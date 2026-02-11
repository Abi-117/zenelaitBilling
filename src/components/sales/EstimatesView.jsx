"use client";

import { useState, useEffect } from "react";
import { Plus, FileText, Edit, Trash2, Mail } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import Card from "../ui/Card";
import Modal from "../ui/Modal";
import NewEstimateForm from "../sales/NewEstimateForm";
import SendEstimatePage from "../sales/SendEstimatePage";
import InvoiceEditorView from "../sales/InvoiceEditorView";

const API_ESTIMATES = "http://localhost:5000/api/estimates";
const API_CUSTOMERS = "http://localhost:5000/api/customers";

export default function EstimatesView() {
  const [estimates, setEstimates] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedEstimate, setSelectedEstimate] = useState(null);

  const [showNewEstimateModal, setShowNewEstimateModal] = useState(false);
  const [editingEstimate, setEditingEstimate] = useState(null);

  const [sendEstimateModal, setSendEstimateModal] = useState(false);
  const [sendingEstimate, setSendingEstimate] = useState(null);

  const [creatingInvoice, setCreatingInvoice] = useState(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  /* ---------------- AUTH CHECK ---------------- */
  useEffect(() => {
    if (!token) {
      alert("Please login again");
      window.location.href = "/login";
    }
  }, [token]);

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const custRes = await fetch(API_CUSTOMERS, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const custData = await custRes.json();
        setCustomers(Array.isArray(custData) ? custData : []);

        const estRes = await fetch(API_ESTIMATES, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const estData = await estRes.json();
        setEstimates(Array.isArray(estData) ? estData : []);
      } catch (err) {
        alert("Session expired");
        window.location.href = "/login";
      }
    };

    fetchData();
  }, [token]);

  const formatDate = (iso) =>
    iso ? new Date(iso).toISOString().split("T")[0] : "";

  /* ---------------- DELETE ESTIMATE ---------------- */
  const handleDeleteEstimate = async (e, estimateId) => {
    e.stopPropagation();

    const confirm = window.confirm(
      "Are you sure you want to delete this estimate?"
    );
    if (!confirm) return;

    try {
      const res = await fetch(`${API_ESTIMATES}/${estimateId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Delete failed");
      }

      setEstimates((prev) => prev.filter((e) => e._id !== estimateId));
      if (selectedEstimate?._id === estimateId) {
        setSelectedEstimate(null);
      }

      alert("Estimate deleted successfully");
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  /* ---------------- SAVE NEW ESTIMATE ---------------- */
  const handleSaveNewEstimate = async (payload) => {
    try {
      const res = await fetch(API_ESTIMATES, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Save failed");
      }

      const saved = await res.json();
      setEstimates((prev) => [...prev, saved]);

      setShowNewEstimateModal(false);
      setEditingEstimate(null);
    } catch (err) {
      alert("Save failed: " + err.message);
    }
  };

  /* ---------------- SAVE EDITED ESTIMATE ---------------- */
  const handleSaveEditedEstimate = async (payload) => {
    try {
      const res = await fetch(`${API_ESTIMATES}/${editingEstimate._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Update failed");
      }

      const updated = await res.json();
      setEstimates((prev) =>
        prev.map((e) => (e._id === updated._id ? updated : e))
      );

      setShowNewEstimateModal(false);
      setEditingEstimate(null);
    } catch (err) {
      alert("Update failed: " + err.message);
    }
  };

  /* ---------------- CONVERT TO INVOICE ---------------- */
  const handleConvertInvoice = async (estimate) => {
    try {
      const res = await fetch(`${API_ESTIMATES}/${estimate._id}/convert`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Convert failed");
      }

      const { invoice } = await res.json();

      // open invoice editor
      setCreatingInvoice({
        ...invoice,
        items: invoice.items.map((i) => ({ ...i, id: uuidv4() })),
        date: invoice.date?.split("T")[0],
      });

      // auto update estimate status
      setEstimates((prev) =>
        prev.map((e) =>
          e._id === estimate._id ? { ...e, status: "Invoiced" } : e
        )
      );

      setSelectedEstimate((prev) =>
        prev?._id === estimate._id ? { ...prev, status: "Invoiced" } : prev
      );

      alert("Invoice created successfully");
    } catch (err) {
      alert(err.message || "Invoice conversion failed");
    }
  };

  /* ---------------- SEND ESTIMATE ---------------- */
  const handleSendEstimate = ({ estimateId, status }) => {
    setEstimates((prev) =>
      prev.map((e) =>
        e._id === estimateId ? { ...e, status: status || "Sent" } : e
      )
    );
    setSendEstimateModal(false);
    setSendingEstimate(null);
    alert("Estimate sent successfully");
  };

  /* ---------------- SAVE INVOICE ---------------- */
  const saveInvoice = async (invoice) => {
    try {
      const res = await fetch("http://localhost:5000/api/invoices", {
        method: invoice._id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(invoice),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Invoice save failed");
      }

      const saved = await res.json();
      alert("Invoice saved successfully");
      setCreatingInvoice(null);
    } catch (err) {
      alert("Invoice save failed: " + err.message);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="flex gap-6 p-6">
      {/* LEFT PANEL */}
      <div className="w-2/3 space-y-4">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold">Estimates</h2>
          <button
            onClick={() => setShowNewEstimateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded flex gap-2"
          >
            <Plus size={16} /> New Estimate
          </button>
        </div>

        <Card className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3 text-right">Amount</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {estimates.map((est) => (
                <tr
                  key={est._id}
                  onClick={() => setSelectedEstimate(est)}
                  className="border-t hover:bg-slate-50 cursor-pointer"
                >
                  <td className="p-3 flex gap-2">
                    <FileText size={14} /> {est.estimateNo}
                  </td>
                  <td className="p-3">{est.customerName}</td>
                  <td className="p-3 text-right font-bold">₹{est.total}</td>
                  <td className="p-3">{formatDate(est.date)}</td>
                  <td className="p-3">{est.status}</td>
                  <td className="p-3 flex justify-end gap-3">
                    <Mail
                      size={14}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSendingEstimate(est);
                        setSendEstimateModal(true);
                      }}
                    />
                    <Edit
                      size={14}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (est.status === "Sent" || est.status === "Invoiced")
                          return;
                        setEditingEstimate(est);
                      }}
                    />
                    <Trash2
                      size={14}
                      className="text-red-600"
                      onClick={(e) => handleDeleteEstimate(e, est._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* RIGHT PANEL */}
      {selectedEstimate && (
        <div className="w-1/3 bg-white p-4 rounded shadow">
          <h3 className="font-bold">{selectedEstimate.estimateNo}</h3>
          <p>{selectedEstimate.customerName}</p>
          <p className="font-bold text-lg">₹{selectedEstimate.total}</p>
          <button
            onClick={() => handleConvertInvoice(selectedEstimate)}
            className="bg-green-600 text-white px-4 py-2 rounded mt-3"
            disabled={selectedEstimate.status === "Invoiced"}
          >
            Convert to Invoice
          </button>
        </div>
      )}

      {/* MODALS */}
      <Modal
        isOpen={showNewEstimateModal || !!editingEstimate}
        onClose={() => {
          setShowNewEstimateModal(false);
          setEditingEstimate(null);
        }}
        title="Estimate"
      >
        <NewEstimateForm
          customers={customers}
          initial={editingEstimate}
          onSave={editingEstimate ? handleSaveEditedEstimate : handleSaveNewEstimate}
          onCancel={() => {
            setShowNewEstimateModal(false);
            setEditingEstimate(null);
          }}
        />
      </Modal>

      {sendEstimateModal && sendingEstimate && (
        <SendEstimatePage
          estimate={sendingEstimate}
          onSend={handleSendEstimate}
          onBack={() => setSendEstimateModal(false)}
        />
      )}

      {creatingInvoice && (
        <InvoiceEditorView
          invoice={creatingInvoice}
          customers={customers}
          onChange={setCreatingInvoice}
          onBack={() => setCreatingInvoice(null)}
          onSave={saveInvoice}
        />
      )}
    </div>
  );
}
