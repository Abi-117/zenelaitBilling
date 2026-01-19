import React, { useState } from 'react';
import { ArrowLeft, Pencil } from 'lucide-react';
import SendInvoicePage from './SendInvoicePage';
import InvoicePreview from './InvoicePreviewPanel';
import { generateInvoicePDF } from '../../utils/invoicePdf';
import PaymentPanel from './PaymentPanel';

const InvoiceDetailsPanel = ({
  invoice,
  onEdit,
  onClose,
  onSendInvoice,
}) => {
  const [sending, setSending] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [paying, setPaying] = useState(false);

  return (
    <div className="p-6 bg-white h-full flex flex-col justify-between">
      {/* ------------------ SEND INVOICE ------------------ */}
      {sending && (
        <SendInvoicePage
          invoice={invoice}
          onSendInvoice={onSendInvoice}
          onBack={() => setSending(false)}
        />
      )}

      {/* ------------------ PREVIEW ------------------ */}
      {previewing && !sending && (
        <InvoicePreview
          invoice={invoice}
          onBack={() => setPreviewing(false)}
        />
      )}

      {/* ------------------ PAYMENT ------------------ */}
      {paying && !sending && !previewing && (
        <PaymentPanel
          invoice={invoice}
          onClose={() => setPaying(false)}
        />
      )}

      {/* ------------------ MAIN PANEL ------------------ */}
      {!sending && !previewing && !paying && (
        <>
          {/* Back Button */}
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-sm text-slate-500 mb-4"
          >
            <ArrowLeft size={16} /> Back
          </button>

          {/* Invoice Info */}
          <h2 className="text-xl font-bold">{invoice.id}</h2>
          <p className="text-sm text-slate-500">{invoice.customerName}</p>

          <div className="mt-4 text-sm space-y-2">
            <p>Date: {invoice.date}</p>
            <p>GSTIN: {invoice.gstin || '-'}</p>
            <p>GST %: {invoice.gstRate || 0}%</p>
            <p>Status: {invoice.status}</p>
            <p className="font-bold text-lg">₹{invoice.total}</p>
            {invoice.customerEmail && (
              <p className="text-sm text-gray-500">
                Email: {invoice.customerEmail}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-6 flex-wrap">
            <button
              onClick={onEdit}
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
              onClick={() => generateInvoicePDF(invoice)}
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
          </div>
        </>
      )}
    </div>
  );
};

export default InvoiceDetailsPanel;
