import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { generateInvoicePDF } from '../../utils/invoicePdf'; // Import your PDF generator

// Theme colors
const theme = {
  primary: 'bg-blue-600 text-white',
  headerBg: 'bg-blue-50',
  tableHeader: 'bg-blue-100',
};

const InvoicePreviewPanel = ({ invoice, onBack }) => {
  // Safe totals
  const subtotal = invoice.items?.reduce((s, i) => s + i.qty * i.rate, 0) || 0;
  const tax = (subtotal * (invoice.gstRate || 18)) / 100;
  const total = subtotal + tax;

  return (
    <div className="bg-gray-50 h-screen overflow-auto p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg p-8 flex flex-col">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} /> Back
          </button>
          <h1 className="text-2xl font-bold text-blue-600">Invoice Preview</h1>
        </div>

        {/* Invoice Info */}
        <div className="mb-4 text-sm text-gray-700 space-y-1">
          <h2 className="text-xl font-semibold">{invoice.invoiceNo}</h2>
          <p><strong>Customer:</strong> {invoice.customerName}</p>
          <p><strong>Date:</strong> {invoice.date}</p>
          <p><strong>Status:</strong> {invoice.status}</p>
          {invoice.customerEmail && <p><strong>Email:</strong> {invoice.customerEmail}</p>}
          <p><strong>GSTIN:</strong> {invoice.gstin || '-'}</p>
          <p><strong>GST %:</strong> {invoice.gstRate || 0}%</p>
        </div>

        {/* ---------------- ITEMS TABLE ---------------- */}
        {invoice.items && invoice.items.length > 0 && (
          <table className="w-full border text-sm mb-4">
            <thead className={theme.tableHeader}>
              <tr>
                <th className="border p-2">Item</th>
                <th className="border p-2">Qty</th>
                <th className="border p-2">Rate</th>
                <th className="border p-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((i, idx) => (
                <tr key={idx}>
                  <td className="border p-2">{i.name}</td>
                  <td className="border p-2">{i.qty}</td>
                  <td className="border p-2">₹{i.rate}</td>
                  <td className="border p-2">₹{i.qty * i.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* TOTALS */}
        <div className="flex justify-end gap-8 text-right text-gray-700 mt-4">
          <div className="text-sm space-y-1">
            {/* Subtotal and GST can be removed if you don't want them */}
            <p>Subtotal: ₹{subtotal}</p>
            <p>GST ({invoice.gstRate || 18}%): ₹{tax}</p>
            <p className="font-bold text-lg">Total: ₹{total}</p>
          </div>
        </div>

        {/* FOOTER BUTTON */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => generateInvoicePDF(invoice)}
            className={`${theme.primary} px-4 py-2 rounded`}
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreviewPanel;
