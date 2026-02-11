import React, { useState, useEffect } from "react";

const SendInvoicePage = ({ invoice, onSendInvoice, onBack }) => {
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  // Prefill email data when invoice loads
  useEffect(() => {
    if (invoice?._id) {
      setTo(invoice.customerEmail || "");
      setSubject(`Invoice ${invoice.invoiceNo || invoice._id}`);
      setBody(
        `Dear ${invoice.customerName || ""},\n\n` +
        `Please find attached your invoice.\n\n` +
        `Invoice No: ${invoice.invoiceNo || invoice._id}\n` +
        `Total Amount: ₹${invoice.total || 0}\n\n` +
        `Regards,\nZenelait Info Tech`
      );
    }
  }, [invoice]);

  const handleSend = async () => {
    if (!invoice?._id) {
      alert("Invoice not loaded correctly!");
      return;
    }

    if (!to) {
      alert("Please enter recipient email!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not logged in. Please login again.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/send-invoice/${invoice._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // 🔑 REQUIRED
          },
          body: JSON.stringify({
            to,
            cc,
            bcc,
            subject,
            body,
          }),
        }
      );

      let data = {};
      try {
        data = await res.json();
      } catch {
        // backend returned empty body
      }

      if (!res.ok) {
        alert(data.message || `Failed to send invoice (Error ${res.status})`);
        return;
      }

      alert(data.message || "Invoice sent successfully!");
      onSendInvoice?.(invoice._id);

    } catch (error) {
      console.error("Send invoice error:", error);
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
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-800"
          >
            ← Back
          </button>
          <h2 className="text-2xl font-bold">Send Invoice</h2>
        </div>

        {/* From */}
        <div>
          <label className="font-semibold text-gray-600">From</label>
          <input
            value={invoice?.senderEmail || "abinaya711s@gmail.com"}
            disabled
            className="w-full mt-1 p-3 border rounded-lg bg-gray-100"
          />
        </div>

        {/* To / CC / BCC */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="email"
            placeholder="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="p-3 border rounded-lg"
          />
          <input
            type="email"
            placeholder="CC"
            value={cc}
            onChange={(e) => setCc(e.target.value)}
            className="p-3 border rounded-lg"
          />
          <input
            type="email"
            placeholder="BCC"
            value={bcc}
            onChange={(e) => setBcc(e.target.value)}
            className="p-3 border rounded-lg"
          />
        </div>

        {/* Subject */}
        <div>
          <label className="font-semibold text-gray-600">Subject</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full mt-1 p-3 border rounded-lg"
          />
        </div>

        {/* Body */}
        <div>
          <label className="font-semibold text-gray-600">Body</label>
          <textarea
            rows={8}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full mt-1 p-3 border rounded-lg resize-none"
          />
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={loading}
          className={`w-full py-3 rounded-xl text-white font-semibold ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Sending..." : "Send Invoice"}
        </button>
      </div>
    </div>
  );
};

export default SendInvoicePage;
