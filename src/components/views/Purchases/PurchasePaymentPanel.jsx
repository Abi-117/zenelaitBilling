import { useState } from "react";
import { createPurchaseOrder, verifyPurchasePayment } from "../../../services/api";

export default function PurchasePaymentPanel({ bill, onClose, reloadBills }) {
  const [loading, setLoading] = useState(false);

  const pendingAmount = bill.status === "Partial"
    ? bill.total - (bill.paidAmount || 0)
    : bill.total;

  // Load Razorpay SDK dynamically
  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const payNow = async () => {
    setLoading(true);

    const loaded = await loadRazorpay();
    if (!loaded) {
      alert("Failed to load Razorpay SDK");
      setLoading(false);
      return;
    }

    try {
      // 1️⃣ Create order on backend
      const orderData = await createPurchaseOrder(bill._id);

      // 2️⃣ Open Razorpay modal
      const options = {
        key: import.meta.env.VITE_RZP_KEY,
        amount: orderData.amount * 100, // amount in paise
        currency: "INR",
        name: "Zenelait Billing",
        description: `Purchase Bill ${bill.billNo}`,
        order_id: orderData.orderId,
        prefill: {
          name: bill.supplier?.name || "",
        },
        handler: async (response) => {
          try {
            // 3️⃣ Verify payment on backend
            await verifyPurchasePayment({
              paymentId: orderData.paymentId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            alert("Payment successful ✅");
            reloadBills();
            onClose();
          } catch (verifyError) {
            console.error("Verification failed:", verifyError);
            alert("Payment verification failed ❌");
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
        theme: { color: "#2563eb" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-center">Pay Purchase Bill</h3>

      <div className="text-sm space-y-2 border rounded p-3 bg-slate-50">
        <div className="flex justify-between">
          <span className="text-slate-500">Bill No</span>
          <span className="font-medium">{bill.billNo}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">Supplier</span>
          <span className="font-medium">{bill.supplier?.name || "-"}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">Total</span>
          <span className="font-medium">₹{bill.total}</span>
        </div>

        {bill.status === "Partial" && (
          <div className="flex justify-between text-green-600">
            <span>Paid</span>
            <span>₹{bill.paidAmount}</span>
          </div>
        )}

        <div className="flex justify-between text-red-600 font-semibold">
          <span>Pending</span>
          <span>₹{pendingAmount}</span>
        </div>
      </div>

      <button
        disabled={loading}
        onClick={payNow}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>

      <button
        onClick={onClose}
        className="w-full text-sm text-slate-500 hover:underline"
      >
        Cancel
      </button>
    </div>
  );
}
