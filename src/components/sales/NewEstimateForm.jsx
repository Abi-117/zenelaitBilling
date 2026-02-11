"use client";

import React, { useEffect, useState, useMemo } from "react";
import { ArrowLeft, Trash2, Plus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const emptyEstimate = {
  estimateNo: "",
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

export default function NewEstimateForm({ initial, customers = [], onSave, onCancel }) {
  const [estimate, setEstimate] = useState(emptyEstimate);

  // ---------------- INITIALIZE ----------------
  useEffect(() => {
    if (initial) {
      // Editing existing estimate
      const itemsWithId = (initial.items || []).map((i) => ({
        ...i,
        id: i.id || uuidv4(),
      }));
      setEstimate({
        ...initial,
        items: itemsWithId,
        date: initial.date ? initial.date.split("T")[0] : "",
      });
    } else if (customers.length > 0) {
      // New estimate default
      setEstimate({
        ...emptyEstimate,
        estimateNo: `EST-${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        items: [{ id: uuidv4(), name: "", qty: 1, rate: "", amount: 0 }],
        customerId: customers[0]._id,
        customerName: customers[0].name,
        customerEmail: customers[0].email,
        customerPhone: customers[0].mobile || customers[0].phone || "",
        company: customers[0].company || "",
        gstin: customers[0].gstin || "",
        customerAddress: customers[0].address || customers[0].billingAddress || "",
      });
    }
  }, [initial, customers]);

  // ---------------- HELPERS ----------------
  const updateField = (key, value) =>
    setEstimate((prev) => ({ ...prev, [key]: value }));

  const handleCustomerSelect = (customerId) => {
    const c = customers.find((x) => x._id === customerId);
    if (!c) return;

    setEstimate((prev) => ({
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

  // ---------------- ITEMS ----------------
  const addItem = () => {
    setEstimate((prev) => ({
      ...prev,
      items: [...prev.items, { id: uuidv4(), name: "", qty: 1, rate: "", amount: 0 }],
    }));
  };

  const updateItem = (id, key, value) => {
    setEstimate((prev) => {
      const updatedItems = prev.items.map((i) => {
        if (i.id === id) {
          const updated = {
            ...i,
            [key]: key === "name" ? value : Number(value) || 0,
          };
          updated.amount = updated.qty * updated.rate;
          return updated;
        }
        return i;
      });
      return { ...prev, items: updatedItems };
    });
  };

  const deleteItem = (id) => {
    setEstimate((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.id !== id),
    }));
  };

  // ---------------- TOTALS ----------------
  const { subtotal, tax, total } = useMemo(() => {
    const subtotal = estimate.items.reduce((sum, i) => sum + (i.amount || 0), 0);
    const tax = (subtotal * (estimate.gstRate || 0)) / 100;
    return { subtotal, tax, total: subtotal + tax };
  }, [estimate.items, estimate.gstRate]);

  // ---------------- SAVE ----------------
  const handleSave = () => {
    if (!estimate.customerId) return alert("Select a customer before saving");

    const invalidItem = estimate.items.find(
      (i) => !i.name || i.qty <= 0 || i.rate <= 0
    );
    if (invalidItem)
      return alert("Please fill item name, quantity, and rate for all items");

    if (subtotal <= 0) return alert("Total amount must be greater than zero");

    onSave?.(estimate);
  };

  // ---------------- UI ----------------
  return (
    <div className="p-6 bg-white rounded shadow space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <button
          onClick={onCancel}
          className="flex items-center gap-1 text-slate-500"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button
          onClick={handleSave}
          disabled={
            !estimate.customerId ||
            subtotal <= 0 ||
            estimate.items.some((i) => !i.name || i.qty <= 0 || i.rate <= 0)
          }
          className={`px-4 py-2 rounded text-white ${
            !estimate.customerId ||
            subtotal <= 0 ||
            estimate.items.some((i) => !i.name || i.qty <= 0 || i.rate <= 0)
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600"
          }`}
        >
          Save Estimate
        </button>
      </div>

      {/* META */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <input
          value={estimate.estimateNo}
          disabled
          className="border p-2 bg-slate-100 rounded"
        />
        <select
          value={estimate.customerId}
          onChange={(e) => handleCustomerSelect(e.target.value)}
          className="border p-2 rounded"
        >
          {customers.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={estimate.date}
          onChange={(e) => updateField("date", e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* CUSTOMER INFO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <input
          value={estimate.customerEmail}
          disabled
          className="border p-2 bg-slate-100 rounded"
        />
        <input
          value={estimate.customerPhone}
          disabled
          className="border p-2 bg-slate-100 rounded"
        />
        <input
          value={estimate.gstin}
          disabled
          className="border p-2 bg-slate-100 rounded"
        />
        <input
          value={estimate.customerAddress}
          disabled
          className="border p-2 bg-slate-100 rounded col-span-3"
        />
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
          {estimate.items.map((item) => (
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
                  min={1}
                />
              </td>
              <td className="p-1">
                <input
                  type="number"
                  value={item.rate}
                  onChange={(e) => updateItem(item.id, "rate", +e.target.value)}
                  className="border p-1 w-full"
                  min={0}
                  placeholder="Rate"
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
            <span>GST ({estimate.gstRate}%)</span>
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
