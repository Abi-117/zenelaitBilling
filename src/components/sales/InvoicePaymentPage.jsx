"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import API from "../../../../config/api";

const InvoicePaymentPage = ({ invoice, onBack, onPaid }) => {
  const [amount, setAmount] = useState(invoice.total);
  const [loading, setLoading] = useState(false);

  const payNow = async () => {
    try {
      setLoading(true);

      // 🔹 1. Create Razorpay Order (backend)
      const res = await API.post("/invoices/create-order", {
        invoiceId: invoice._id,
        amount
      });

      const { orderId } = res.data;

      // 🔹 2. Razorpay options
      const options = {
        key: import.meta.env.VITE_RZP_KEY,
        amount: amount * 100,
        currency: "INR",
        name: "Billing Software",
        description: `Invoice ${invoice.invoiceNo}`,
        order_id: orderId,

        handler: async response => {
          // 🔹 3. Verify payment
          await API.post("/payments/verify", {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            invoiceId: invoice._id
          });

          alert("Payment Successful ✅");
          onPaid && onPaid();
        },

        prefill: {
          name: invoice.customer?.name,
          email: invoice.customer?.email
        },

        theme: { color: "#2563eb" }
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-xl p-6 space-y-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-gray-600"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <h2 className="text-2xl font-bold text-blue-600">
          Pay Invoice #{invoice.invoiceNo}
        </h2>

        <div>
          <label className="font-semibold">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(+e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <button
          onClick={payNow}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Processing..." : "Pay with Razorpay"}
        </button>
      </div>
    </div>
  );
};

export default InvoicePaymentPage;
