import { Edit, Send, FileText, IndianRupee } from 'lucide-react';
import Badge from '../ui/Badge';

const InvoiceDetailsPanel = ({ invoice, onEdit,onPDF,onSend}) => {
  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{invoice.id}</h2>
        <Badge status={invoice.status} />
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3">
       <button
  disabled={invoice.status !== 'Draft'}
  onClick={onSend}
  className={`btn-primary ${
    invoice.status !== 'Draft'
      ? 'opacity-50 cursor-not-allowed'
      : ''
  }`}
>
  Send
</button>


        <button onClick={onPDF} className="btn-secondary">
  PDF / Print
</button>

        <button
          onClick={onEdit}
          className="btn-outline flex items-center gap-2"
        >
          <Edit size={16} /> Edit
        </button>
      </div>

      {/* WHAT'S NEXT */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">What’s next?</h3>
        <p className="text-sm text-slate-600 mb-3">
          Record payment to close this invoice.
        </p>
        <button className="btn-success flex items-center gap-2">
          <IndianRupee size={16} /> Record Payment
        </button>
      </div>

      {/* DETAILS */}
      <div className="bg-white p-4 rounded shadow space-y-2">
        <p><b>Customer:</b> {invoice.customerName}</p>
        <p><b>Date:</b> {invoice.date}</p>
        <p><b>Total:</b> ₹{invoice.total}</p>
      </div>
    </div>
  );
};

export default InvoiceDetailsPanel;
