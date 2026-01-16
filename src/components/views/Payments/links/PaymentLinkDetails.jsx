import { Copy } from 'lucide-react';

const PaymentLinkDetails = ({ data }) => {
  if (!data) return null;

  return (
    <div className="p-5 space-y-5">
      <h3 className="text-xl font-bold">{data.customer}</h3>

      <div className="bg-slate-50 p-4 rounded">
        <p className="text-xs text-slate-500">Paid Amount</p>
        <p className="text-2xl font-bold">₹{data.amount}</p>
      </div>

      <div className="flex justify-between bg-slate-100 p-3 rounded">
        <span className="truncate text-sm">{data.link}</span>
        <Copy size={14} />
      </div>

      <div className="text-sm space-y-1">
        <p><b>Status:</b> {data.status}</p>
        <p><b>Created:</b> {data.date}</p>
      </div>
    </div>
  );
};

export default PaymentLinkDetails;
