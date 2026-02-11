"use client";

import React, { useState } from "react";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import InvoiceEditView from "./InvoiceEditorView"; // your updated editable form
import SendInvoicePage from "./SendInvoicePage";
import InvoicePreview from "./InvoicePreviewPanel";
import PaymentPanel from "./PaymentPanel";
import { generateInvoicePDF } from "../../utils/invoicePdf";

const InvoiceDetailsPanel = ({
  invoice,
  onClose,
  onSendInvoice,
  onDelete,
  onUpdateInvoice, // callback after saving edit
}) => {
  const [editing, setEditing] = useState(false);
  const [sending, setSending] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [paying, setPaying] = useState(false);
  const [updatedInvoice, setUpdatedInvoice] = useState(invoice); // track live updates

  if (!invoice) return <div className="p-6">Loading invoice...</div>;

  const handleSave = (savedInvoice) => {
    setUpdatedInvoice(savedInvoice); // update local view
    setEditing(false);
    if (onUpdateInvoice) onUpdateInvoice(savedInvoice); // notify parent
  };

  return (
    <div className="p-6 bg-white h-full flex flex-col overflow-auto">
      {/* ---------------- EDIT ---------------- */}
      {editing && (
        <InvoiceEditView
          invoiceId={updatedInvoice._id}
          onBack={() => setEditing(false)}
          onSave={handleSave}
        />
      )}
       

      {/* ---------------- SEND ---------------- */}
      {sending && (
        <SendInvoicePage
          invoice={updatedInvoice}
          onSendInvoice={onSendInvoice}
          onBack={() => setSending(false)}
        />
      )}

      {/* ---------------- PREVIEW ---------------- */}
      {previewing && !sending && !editing && (
        <InvoicePreview invoice={updatedInvoice} onBack={() => setPreviewing(false)} />
      )}

      {/* ---------------- PAYMENT ---------------- */}
      {paying && !sending && !previewing && !editing && (
        <PaymentPanel invoice={updatedInvoice} onClose={() => setPaying(false)} />
      )}

      {/* ---------------- MAIN ---------------- */}
      {!editing && !sending && !previewing && !paying && (
        <>
          {/* BACK BUTTON */}
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-sm text-slate-500 mb-4"
          >
            <ArrowLeft size={16} /> Back
          </button>

          {/* INVOICE HEADER */}
          <h2 className="text-xl font-bold">{updatedInvoice.invoiceNo || "—"}</h2>
          <p className="text-sm text-slate-500">{updatedInvoice.customerName || "—"}</p>

          <div className="mt-4 text-sm space-y-2">
            <p>Date: {updatedInvoice.date || "—"}</p>
            {updatedInvoice.customerPhone && <p>Phone: {updatedInvoice.customerPhone}</p>}
            {updatedInvoice.customerAddress && <p>Address: {updatedInvoice.customerAddress}</p>}
            {updatedInvoice.customerEmail && <p>Email: {updatedInvoice.customerEmail}</p>}
            {updatedInvoice.gstin && <p>GSTIN: {updatedInvoice.gstin}</p>}
            <p>GST %: {updatedInvoice.gstRate ?? 0}%</p>
            <p>Status: {updatedInvoice.status || "Draft"}</p>
            <p className="font-bold text-lg mt-2">Total: ₹{updatedInvoice.total ?? 0}</p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-2 mt-6 flex-wrap">
            <button
              onClick={() => setEditing(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
            >
              <Pencil size={14} /> Edit
            </button>

            <button
              onClick={() => setSending(true)}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded"
            >
              Send
            </button>

            <button
              onClick={() => setPaying(true)}
              className="flex-1 bg-purple-600 text-white px-4 py-2 rounded"
            >
              Payment
            </button>

            <button
              onClick={() => generateInvoicePDF(updatedInvoice)}
              className="flex-1 bg-slate-700 text-white px-4 py-2 rounded"
            >
              PDF
            </button>

            <button
              onClick={() => setPreviewing(true)}
              className="flex-1 bg-orange-600 text-white px-4 py-2 rounded"
            >
              Preview
            </button>

            <button
              onClick={onDelete}
              className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default InvoiceDetailsPanel;
