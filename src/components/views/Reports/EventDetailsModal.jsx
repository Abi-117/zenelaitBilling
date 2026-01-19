// EventDetailsModal.jsx
import React from "react";
import { X } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Generates a professional invoice PDF from an event object
 * @param {Object} event
 */
const generateInvoicePDF = (event) => {
  // Map event to invoice structure
  const invoice = {
    id: event.ref || "N/A",
    date: event.time || new Date().toLocaleDateString(),
    status: event.status || "Unknown",
    customerName: event.customer || "Unknown",
    gstin: event.gstin || "",
    items: event.items || [{ name: event.type || "Service", qty: 1, rate: event.amount || 0 }],
    gstRate: event.gstRate || 18,
    subtotal: event.amount || 0,
    tax: ((event.amount || 0) * (event.gstRate || 18)) / 100,
    total: (event.amount || 0) * (1 + ((event.gstRate || 18) / 100))
  };

  const doc = new jsPDF("p", "pt");

  // ===== HEADER =====
  doc.setFontSize(22);
  doc.setTextColor(37, 99, 235);
  doc.text("INVOICE", 40, 40);

  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`Invoice No: ${invoice.id}`, 40, 60);
  doc.text(`Date: ${invoice.date}`, 40, 75);
  doc.text(`Status: ${invoice.status}`, 40, 90);

  // ===== CUSTOMER INFO =====
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", 40, 120);
  doc.setFont("helvetica", "normal");
  doc.text(invoice.customerName, 40, 135);
  if (invoice.gstin) doc.text(`GSTIN: ${invoice.gstin}`, 40, 150);

  // ===== ITEMS TABLE =====
  const tableData = invoice.items.map((item, i) => {
    const itemTax = ((item.qty * item.rate) * (invoice.gstRate || 0)) / 100;
    const itemTotal = item.qty * item.rate + itemTax;
    return [
      i + 1,
      item.name,
      item.qty,
      `₹${item.rate.toFixed(2)}`,
      `${invoice.gstRate || 0}%`,
      `₹${itemTotal.toFixed(2)}`
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
  doc.text(`Subtotal: ₹${invoice.subtotal.toFixed(2)}`, 400, finalY);
  doc.text(`GST: ₹${invoice.tax.toFixed(2)}`, 400, finalY + 15);
  doc.setFont("helvetica", "bold");
  doc.text(`Grand Total: ₹${invoice.total.toFixed(2)}`, 400, finalY + 35);

  // ===== FOOTER =====
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Thank you for your business!", 40, 780);

  // Save PDF
  doc.save(`${invoice.id}.pdf`);
};

/**
 * Dummy send email function
 * Replace this with real API/email integration
 */
const sendInvoiceEmail = (event) => {
  alert(`Email sent to ${event.customer || "customer"} for invoice ${event.ref || "N/A"}`);
};

const EventDetailsModal = ({ event, onClose, onMarkPaid }) => {
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
          <p><b>Invoice #:</b> {event.ref}</p>
          <p><b>Customer:</b> {event.customer}</p>
          <p><b>Type:</b> {event.type}</p>
          <p><b>Status:</b> {event.status}</p>
          <p><b>Date:</b> {event.time}</p>
          {event.amount && <p><b>Amount:</b> ₹{event.amount}</p>}
          {event.paymentMethod && <p><b>Payment Method:</b> {event.paymentMethod}</p>}
          {event.message && <p className="text-slate-600">{event.message}</p>}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {event.status === "Pending" && (
            <button
              onClick={() => onMarkPaid(event.id)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700"
            >
              Mark as Paid
            </button>
          )}

          <button
            onClick={() => generateInvoicePDF(event)}
            className="bg-slate-100 text-slate-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-200"
          >
            Download PDF
          </button>

          <button
            onClick={() => sendInvoiceEmail(event)}
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
