import { useEffect, useState } from "react";
import InvoiceListView from "./InvoiceListView";
import InvoiceDetailsPanel from "./InvoiceDetailsPanel";
import InvoiceEditorView from "./InvoiceEditorView";

const API = "http://localhost:5000/api/invoices";

const InvoiceView = () => {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [editingInvoice, setEditingInvoice] = useState(null);

  const token = localStorage.getItem("token");

  /* ================= FETCH INVOICES ================= */
  const fetchInvoices = async () => {
    const res = await fetch(API, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setInvoices(data);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  /* ================= SELECT ================= */
  const handleSelect = (invoice) => {
    setSelectedInvoice(invoice);
    setEditingInvoice(null);
  };

  /* ================= CREATE ================= */
  const handleCreate = () => {
    setEditingInvoice({
      invoiceNo: `INV-${Date.now()}`,
      customerName: "",
      customerEmail: "",
      gstin: "",
      date: new Date().toISOString().split("T")[0],
      items: [],
      gstRate: 18,
      subtotal: 0,
      tax: 0,
      total: 0,
      status: "Draft",
    });
  };

  /* ================= SAVE ================= */
  const handleSave = async (invoice) => {
    const subtotal = invoice.items.reduce(
      (s, i) => s + i.qty * i.rate,
      0
    );
    const tax = subtotal * (invoice.gstRate / 100);
    const payload = {
      ...invoice,
      subtotal,
      tax,
      total: subtotal + tax,
    };

    const res = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const saved = await res.json();

    setInvoices((prev) => [saved, ...prev]);
    setEditingInvoice(null);
    setSelectedInvoice(saved);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!confirm("Delete invoice?")) return;

    await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setInvoices((prev) => prev.filter((i) => i._id !== id));
    setSelectedInvoice(null);
  };

  /* ================= EDIT MODE ================= */
  if (editingInvoice) {
    return (
      <InvoiceEditorView
        invoice={editingInvoice}
        onChange={setEditingInvoice}
        onBack={() => setEditingInvoice(null)}
        onSave={handleSave}
      />
    );
  }

  return (
    <div className="flex h-full">

      {/* LEFT LIST */}
      <div className="w-[380px] border-r bg-white">
        <InvoiceListView
          invoices={invoices}
          selectedInvoice={selectedInvoice}
          onSelect={handleSelect}
          onCreate={handleCreate}
        />
      </div>

      {/* RIGHT DETAILS */}
      <div className="flex-1 bg-slate-50">
        {selectedInvoice ? (
          <InvoiceDetailsPanel
            invoice={selectedInvoice}
            onEdit={() => setEditingInvoice(selectedInvoice)}
            onDelete={() => handleDelete(selectedInvoice._id)}
            onClose={() => setSelectedInvoice(null)}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400">
            Select an invoice
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceView;
