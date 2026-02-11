import React from "react";
import { X } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { markInvoicePaid } from "../../../services/invoiceApi";

const getToken = () => localStorage.getItem("token");

/**
 * Generates a professional invoice PDF from an invoice object
 * @param {Object} invoice
 */
const generateInvoicePDF = (invoice) => {
  if (!invoice) return;

  const doc = new jsPDF("p", "pt");

  // ===== HEADER =====
  doc.setFontSize(22);
  doc.setTextColor(37, 99, 235);
  doc.text("INVOICE", 40, 40);

  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`Invoice No: ${invoice.invoiceNo || "N/A"}`, 40, 60);
  doc.text(`Date: ${new Date(invoice.date).toLocaleDateString()}`, 40, 75);
  doc.text(`Status: ${invoice.status || "Unknown"}`, 40, 90);

  // ===== CUSTOMER INFO =====
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", 40, 120);
  doc.setFont("helvetica", "normal");
  doc.text(invoice.customerName || "Unknown", 40, 135);
  if (invoice.gstin) doc.text(`GSTIN: ${invoice.gstin}`, 40, 150);

  // ===== ITEMS TABLE =====
  const items = Array.isArray(invoice.items) ? invoice.items : [];
  const tableData = items.map((item, i) => {
    const qty = item.qty || 1;
    const rate = item.rate || 0;
    const itemTax = (qty * rate * (invoice.gstRate || 0)) / 100;
    const itemTotal = qty * rate + itemTax;
    return [
      i + 1,
      item.name || "Item",
      qty,
      `₹${rate.toFixed(2)}`,
      `${invoice.gstRate || 0}%`,
      `₹${itemTotal.toFixed(2)}`,
    ];
  });

  autoTable(doc, {
    startY: 170,
    head: [["#", "Item", "Qty", "Rate", "GST", "Total"]],
    body: tableData,
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontSize: 11 },
    styles: { fontSize: 10 },
    margin: { left: 40, right: 40 },
  });

  // ===== TOTALS =====
  const finalY = doc.lastAutoTable?.finalY || 200;
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Subtotal: ₹${(invoice.subtotal || 0).toFixed(2)}`, 400, finalY);
  doc.text(`GST: ₹${(invoice.tax || 0).toFixed(2)}`, 400, finalY + 15);
  doc.setFont("helvetica", "bold");
  doc.text(`Grand Total: ₹${(invoice.total || 0).toFixed(2)}`, 400, finalY + 35);

  // ===== FOOTER =====
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Thank you for your business!", 40, 780);

  // Save PDF
  doc.save(`${invoice.invoiceNo || "invoice"}.pdf`);
};

/**
 * Dummy send email function
 * Replace this with real API/email integration
 */
const sendInvoiceEmail = (invoice) => {
  alert(`Email sent to ${invoice.customerName || "customer"} for invoice ${invoice.invoiceNo || "N/A"}`);
};

const EventDetailsModal = ({ invoice, onClose, onMarkPaid }) => {
  if (!invoice) return null;

  const handlePaid = async () => {
    if (invoice.status === "Paid") return;

    const token = getToken();
    try {
      const updated = await markInvoicePaid(invoice._id, token);
      onMarkPaid && onMarkPaid(updated._id || invoice._id);
    } catch (err) {
      console.error("Failed to mark invoice as paid:", err);
      alert("Failed to mark invoice as paid.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-lg relative">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Invoice Details</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <X size={20} />
          </button>
        </div>

        {/* Invoice Info */}
        <div className="space-y-2 text-sm">
          <p><b>Invoice #:</b> {invoice.invoiceNo}</p>
          <p><b>Customer:</b> {invoice.customerName}</p>
          <p><b>Status:</b> {invoice.status}</p>
          <p><b>Date:</b> {new Date(invoice.date).toLocaleDateString()}</p>
          <p><b>Total:</b> ₹{(invoice.total || 0).toLocaleString()}</p>

          {invoice.items && invoice.items.length > 0 && (
            <>
              <h4 className="mt-2 font-semibold">Items:</h4>
              <ul className="list-disc list-inside text-sm">
                {invoice.items.map((item, idx) => (
                  <li key={idx}>
                    {item.name} - {item.qty} × ₹{item.rate} = ₹{item.amount}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {invoice.status !== "Paid" && (
            <button
              onClick={handlePaid}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700"
            >
              Mark as Paid
            </button>
          )}

          <button
            onClick={() => generateInvoicePDF(invoice)}
            className="bg-slate-100 text-slate-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-200"
          >
            Download PDF
          </button>

          <button
            onClick={() => sendInvoiceEmail(invoice)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
          >
            Send Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;
