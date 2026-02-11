"use client";

import React, { useState, useEffect } from "react";

const SendEstimatePage = ({ estimate, onSend, onBack }) => {
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  // Prefill email when estimate loads
  useEffect(() => {
    if (estimate?._id) {
      setTo(estimate.customerEmail || "");
      setSubject(`Estimate ${estimate.estimateNo || estimate._id}`);
      setBody(
        `Dear ${estimate.customerName || ""},\n\n` +
        `Please find attached your estimate.\n\n` +
        `Estimate No: ${estimate.estimateNo || estimate._id}\n` +
        `Total Amount: ₹${estimate.total || 0}\n\n` +
        `Regards,\nZenelait Info Tech`
      );
    }
  }, [estimate]);

  const handleSend = async () => {
    if (!estimate?._id) return alert("Estimate not loaded correctly!");
    if (!to) return alert("Please enter recipient email!");

    const token = localStorage.getItem("token");
    if (!token) return alert("You are not logged in.");

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/send-estimate/${estimate._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ to, cc, bcc, subject, body }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) return alert(data.message || "Failed to send estimate");

      alert(data.message || "Estimate sent successfully!");
      onSend?.({ estimateId: estimate._id, status: "Sent" });

    } catch (err) {
      console.error(err);
      alert("Cannot connect to backend server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <button onClick={onBack} className="text-gray-500 hover:text-gray-800">← Back</button>
          <h2 className="text-2xl font-bold">Send Estimate</h2>
        </div>

        {/* From */}
        <div>
          <label className="font-semibold text-gray-600">From</label>
          <input value={estimate?.senderEmail || "abinaya711s@gmail.com"} disabled className="w-full mt-1 p-3 border rounded-lg bg-gray-100" />
        </div>

        {/* To / CC / BCC */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="email" placeholder="To" value={to} onChange={(e) => setTo(e.target.value)} className="p-3 border rounded-lg" />
          <input type="email" placeholder="CC" value={cc} onChange={(e) => setCc(e.target.value)} className="p-3 border rounded-lg" />
          <input type="email" placeholder="BCC" value={bcc} onChange={(e) => setBcc(e.target.value)} className="p-3 border rounded-lg" />
        </div>

        {/* Subject */}
        <div>
          <label className="font-semibold text-gray-600">Subject</label>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full mt-1 p-3 border rounded-lg" />
        </div>

        {/* Body */}
        <div>
          <label className="font-semibold text-gray-600">Body</label>
          <textarea rows={8} value={body} onChange={(e) => setBody(e.target.value)} className="w-full mt-1 p-3 border rounded-lg resize-none" />
        </div>

        {/* Send Button */}
        <button onClick={handleSend} disabled={loading} className={`w-full py-3 rounded-xl text-white font-semibold ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}>
          {loading ? "Sending..." : "Send Estimate"}
        </button>
      </div>
    </div>
  );
};

export default SendEstimatePage;
