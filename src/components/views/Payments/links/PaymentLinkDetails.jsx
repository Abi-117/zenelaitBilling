// PaymentLinkDetails.jsx
import { Copy } from 'lucide-react';
import { useState } from 'react';

const PaymentLinkDetails = ({ data }) => {
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(data.link || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="p-5 space-y-5">
      <h3 className="text-xl font-bold">{data.customer}</h3>

      <div className="bg-slate-50 p-4 rounded">
        <p className="text-xs text-slate-500">Amount</p>
        <p className="text-2xl font-bold">₹{data.amount}</p>
      </div>

      <div
        className="flex justify-between items-center bg-slate-100 p-3 rounded cursor-pointer"
        onClick={handleCopy}
      >
        <span className="truncate text-sm">{data.link}</span>
        <span className="flex items-center gap-1 text-slate-600 text-xs">
          <Copy size={14} /> {copied && 'Copied!'}
        </span>
      </div>

      <div className="text-sm space-y-1">
        <p>
          <b>Status:</b>{' '}
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${
              data.status === 'Paid'
                ? 'bg-green-100 text-green-700'
                : data.status === 'Expired'
                ? 'bg-red-100 text-red-700'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            {data.status}
          </span>
        </p>
        <p>
          <b>Created:</b> {data.date}
        </p>
        {data.email && (
          <p>
            <b>Email:</b> {data.email}
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentLinkDetails;
