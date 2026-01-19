import React, { useState } from 'react';

const PaymentPanel = ({ invoice, onClose, onPaymentSuccess }) => {
  const [amount, setAmount] = useState(invoice.total || 0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mode, setMode] = useState('UPI');

  const handlePay = () => {
    if (amount <= 0) {
      alert('Enter a valid payment amount');
      return;
    }

    // Call the callback with payment info
    onPaymentSuccess?.({
      invoiceId: invoice.id,
      amount,
      date,
      mode,
    });

    alert(`Payment of ₹${amount} for ${invoice.id} recorded successfully!`);
    onClose(); // close panel
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 font-medium"
          >
            ← Back
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Record Payment</h2>
        </div>

        {/* Invoice Summary */}
        <div className="p-4 border rounded-lg bg-gray-50">
          <p><strong>Invoice:</strong> {invoice.id}</p>
          <p><strong>Customer:</strong> {invoice.customerName}</p>
          <p><strong>Total Due:</strong> ₹{invoice.total}</p>
        </div>

        {/* Payment Form */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-600">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-600">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-600">Payment Mode</label>
            <select
              value={mode}
              onChange={e => setMode(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash">Cash</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={handlePay}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Record Payment
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPanel;
