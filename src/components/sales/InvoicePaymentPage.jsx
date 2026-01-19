import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const InvoicePaymentPage = ({ invoice, onBack, onConfirmPayment }) => {
  const [amount, setAmount] = useState(invoice.total);

  return (
    <div className="h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-xl p-6 flex flex-col gap-4">
        <button onClick={onBack} className="flex items-center gap-1 text-gray-600">
          <ArrowLeft size={20} /> Back
        </button>

        <h2 className="text-2xl font-bold text-blue-600 mb-4">Payment for Invoice #{invoice.id}</h2>

        <div className="flex flex-col gap-2">
          <label className="font-semibold">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(+e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>

        <button
          onClick={() => {
            alert(`Paid ₹${amount} for invoice ${invoice.id}`);
            onConfirmPayment(invoice);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Confirm Payment
        </button>
      </div>
    </div>
  );
};

export default InvoicePaymentPage;
