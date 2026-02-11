"use client";

import React, { useEffect, useState, useMemo } from "react";
import { ArrowLeft, Trash2, Plus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

/* ================= CONFIG ================= */
const API = "http://localhost:5000/api";

/* ================= INITIAL STATE ================= */
const emptyInvoice = {
  invoiceNo: "",
  customerId: "",
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  company: "",
  customerAddress: "",
  gstin: "",
  gstRate: 18,
  date: "",
  items: [],
};

export default function InvoiceEditView({ invoiceId, invoice: invoiceProp, onBack, onSave }) {
  const [invoice, setInvoice] = useState(emptyInvoice);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  /* ================= FETCH CUSTOMERS ================= */
  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${API}/customers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCustomers(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      console.error("Customer fetch error:", err);
      return [];
    }
  };

  /* ================= FETCH INVOICE ================= */
  const fetchInvoice = async (customersData) => {
    if (!invoiceId) return;

    try {
      const res = await fetch(`${API}/invoices/${invoiceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      const itemsWithId = (data.items || []).map((i) => ({
        ...i,
        id: i.id || uuidv4(),
      }));

      const c = customersData.find((x) => x._id === data.customerId);

      setInvoice({
        ...data,
        date: data.date ? data.date.split("T")[0] : "",
        items: itemsWithId,
        customerId: data.customerId || "",
        customerName: c?.name || data.customerName || "",
        customerEmail: c?.email || data.customerEmail || "",
        customerPhone: c?.mobile || c?.phone || data.customerPhone || "",
        company: c?.company || data.company || "",
        gstin: c?.gstin || data.gstin || "",
        customerAddress: c?.address || c?.billingAddress || data.customerAddress || "",
      });
    } catch (err) {
      console.error("Invoice fetch error:", err);
    }
  };

  /* ================= INIT ================= */
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const customersData = await fetchCustomers();

      if (invoiceId) {
        await fetchInvoice(customersData);
      } else {
        // New invoice
        setInvoice((prev) => ({
          ...prev,
          invoiceNo: `INV-${Date.now()}`,
          date: new Date().toISOString().split("T")[0],
          items: [{ id: uuidv4(), name: "", qty: 1, rate: 0, amount: 0 }],
        }));
      }
      setLoading(false);
    };
    init();
  }, [invoiceId]);

  /* ================= AUTO SELECT FIRST CUSTOMER IF NONE ================= */
  useEffect(() => {
  if (!invoiceId && !invoice.customerId && customers.length > 0) {
    handleCustomerSelect(customers[0]._id);
  }
}, [customers]);


  /* ================= HELPERS ================= */
  const updateField = (key, value) =>
    setInvoice((prev) => ({ ...prev, [key]: value }));

  const handleCustomerSelect = (customerId) => {
    const c = customers.find((x) => x._id === customerId);
    if (!c) return;

    setInvoice((prev) => ({
      ...prev,
      customerId: c._id,
      customerName: c.name || "",
      customerEmail: c.email || "",
      customerPhone: c.mobile || c.phone || "",
      company: c.company || "",
      gstin: c.gstin || "",
      customerAddress: c.address || c.billingAddress || "",
    }));
  };

  /* ================= ITEMS ================= */
  const addItem = () => {
    setInvoice((prev) => ({
      ...prev,
      items: [...prev.items, { id: uuidv4(), name: "", qty: 1, rate: 0, amount: 0 }],
    }));
  };

  const updateItem = (id, key, value) => {
    setInvoice((prev) => {
      const updatedItems = prev.items.map((i) => {
        if (i.id === id) {
          const updated = { ...i, [key]: key === "name" ? value : Number(value) };
          updated.amount = updated.qty * updated.rate;
          return updated;
        }
        return i;
      });
      return { ...prev, items: updatedItems };
    });
  };

  const deleteItem = (id) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.id !== id),
    }));
  };

  /* ================= TOTALS ================= */
  const { subtotal, tax, total } = useMemo(() => {
    const subtotal = invoice.items.reduce((sum, i) => sum + (i.amount || 0), 0);
    const tax = (subtotal * (invoice.gstRate || 0)) / 100;
    return { subtotal, tax, total: subtotal + tax };
  }, [invoice.items, invoice.gstRate]);

  /* ================= SAVE ================= */
  const saveInvoice = async () => {
    try {
      if (!invoice.customerId) return alert("Select a customer before saving");
      if (!invoice.items.length) return alert("Add at least one item");

      const payload = {
        invoiceNo: invoice.invoiceNo,
        customerId: invoice.customerId,
        customerName: invoice.customerName,
        customerEmail: invoice.customerEmail,
        customerPhone: invoice.customerPhone,
        company: invoice.company,
        gstin: invoice.gstin,
        customerAddress: invoice.customerAddress,
        date: invoice.date,
        items: invoice.items.map((i) => ({
          name: i.name,
          qty: i.qty,
          rate: i.rate,
          amount: i.amount,
        })),
        gstRate: invoice.gstRate,
        subtotal,
        tax,
        total,
      };

      const res = await fetch(`${API}/invoices/${invoiceId || ""}`, {
        method: invoiceId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Save failed");
      }

      const savedInvoice = await res.json();
      alert("Invoice saved successfully");
      onSave?.(savedInvoice);
    } catch (err) {
      console.error(err);
      alert("Invoice not saved: " + err.message);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  /* ================= UI ================= */
  return (
    <div className="p-6 bg-white rounded shadow space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="flex items-center gap-1 text-slate-500">
          <ArrowLeft size={16} /> Back
        </button>
        <button
          onClick={saveInvoice}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Invoice
        </button>
      </div>

      {/* META */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <input value={invoice.invoiceNo} disabled className="border p-2 bg-slate-100 rounded" />
        <select
          value={invoice.customerId}
          onChange={(e) => handleCustomerSelect(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Customer</option>
          {customers.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={invoice.date}
          onChange={(e) => updateField("date", e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* CUSTOMER INFO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <input value={invoice.customerEmail} disabled className="border p-2 bg-slate-100 rounded" />
        <input value={invoice.customerPhone} disabled className="border p-2 bg-slate-100 rounded" />
        <input value={invoice.gstin} disabled className="border p-2 bg-slate-100 rounded" />
        <input value={invoice.customerAddress} disabled className="border p-2 bg-slate-100 rounded col-span-3" />
      </div>

      {/* ITEMS */}
      <table className="w-full border text-sm">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-2 text-left">Item</th>
            <th className="p-2">Qty</th>
            <th className="p-2">Rate</th>
            <th className="p-2">Amount</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item) => (
            <tr key={item.id}>
              <td className="p-1">
                <input
                  value={item.name}
                  onChange={(e) => updateItem(item.id, "name", e.target.value)}
                  className="border p-1 w-full"
                />
              </td>
              <td className="p-1">
                <input
                  type="number"
                  value={item.qty}
                  onChange={(e) => updateItem(item.id, "qty", +e.target.value)}
                  className="border p-1 w-full"
                />
              </td>
              <td className="p-1">
                <input
                  type="number"
                  value={item.rate}
                  onChange={(e) => updateItem(item.id, "rate", +e.target.value)}
                  className="border p-1 w-full"
                />
              </td>
              <td className="p-1 text-right">₹{item.amount.toFixed(2)}</td>
              <td className="p-1 text-center">
                <button onClick={() => deleteItem(item.id)}>
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={addItem}
        className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded"
      >
        <Plus size={14} /> Add Item
      </button>

      {/* TOTAL */}
      <div className="flex justify-end">
        <div className="w-64 text-sm space-y-1">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>GST ({invoice.gstRate}%)</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-1">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
