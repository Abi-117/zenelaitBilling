import React, { useState, useEffect } from 'react';

const SendInvoicePage = ({ invoice, onSendInvoice, onBack }) => {
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  // Populate default values when invoice changes
  useEffect(() => {
    if (invoice) {
      setTo(invoice.customerEmail || '');
      setSubject(`Invoice ${invoice.id}`);
      setBody(
        `Dear ${invoice.customerName || ''},\n\nPlease find attached your invoice (ID: ${invoice.id}).\n\nTotal Amount: ₹${invoice.total || 0}\n\nRegards,\nYour Company`
      );
    }
  }, [invoice]);

  const handleSend = () => {
    if (!to) {
      alert("Please enter recipient email!");
      return;
    }
    // Pass email info + invoice ID to parent handler
    onSendInvoice({
      to,
      cc,
      bcc,
      subject,
      body,
      invoiceId: invoice.id,
      attachment: invoice // optional: attach the invoice object
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-800 font-medium"
          >
            ← Back
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Send Invoice</h2>
        </div>

        {/* Email Form */}
        <div className="flex flex-col gap-5">

          {/* From (readonly) */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-600 font-semibold">From</label>
            <input
              type="text"
              value={invoice.senderEmail || 'you@company.com'}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          {/* To / CC / BCC */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-gray-600 font-semibold">To</label>
              <input
                type="email"
                value={to}
                onChange={e => setTo(e.target.value)}
                placeholder="Recipient email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-gray-600 font-semibold">CC</label>
              <input
                type="email"
                value={cc}
                onChange={e => setCc(e.target.value)}
                placeholder="Optional"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-gray-600 font-semibold">BCC</label>
              <input
                type="email"
                value={bcc}
                onChange={e => setBcc(e.target.value)}
                placeholder="Optional"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
          </div>

          {/* Subject */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-600 font-semibold">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          {/* Body */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-600 font-semibold">Body</label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none font-sans text-gray-700"
            ></textarea>
          </div>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-md transition"
        >
          Send Invoice
        </button>
      </div>
    </div>
  );
};

export default SendInvoicePage;
