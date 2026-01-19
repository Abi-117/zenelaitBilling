import React from 'react';
import { ArrowLeft } from 'lucide-react';
import logo from '../../assets/zen - logo.png';
import { generateInvoicePDF } from '../../utils/invoicePdf'; // Import your PDF generator

// Theme colors
const theme = {
  primary: 'bg-blue-600 text-white',
  headerBg: 'bg-blue-50',
  tableHeader: 'bg-blue-100',
};

const InvoicePreviewPanel = ({ invoice, onBack }) => {
  return (
    <div className="bg-gray-50 h-screen overflow-auto p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg p-8 flex flex-col">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={20} /> Back
            </button>
            <img src={logo} alt="Logo" className="h-10" />
          </div>
          <h1 className="text-2xl font-bold text-blue-600">Invoice Preview</h1>
        </div>

        {/* Invoice Info */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">{invoice.id}</h2>
          <p><strong>Customer:</strong> {invoice.customerName}</p>
          <p><strong>Date:</strong> {invoice.date}</p>
          <p><strong>Status:</strong> {invoice.status}</p>
        </div>

        {/* Items Table */}
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

        {/* Totals */}
        <div className="flex justify-end gap-8 text-right text-gray-700">
          <div>
            <p>Subtotal: ₹{invoice.subtotal}</p>
            <p>GST (18%): ₹{invoice.tax}</p>
            <p className="font-bold text-lg">Total: ₹{invoice.total}</p>
          </div>
        </div>

        {/* Footer Button */}
        <div className="mt-6 flex gap-3 justify-end">
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
