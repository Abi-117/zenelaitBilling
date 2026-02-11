import API from "../../config/api";

const PaymentPanel = ({ invoice, onClose }) => {
  const startPayment = async () => {
    try {
      // 1️⃣ Create order
      const res = await API.post("/payments/invoice/order", {
        invoiceId: invoice._id,
      });

      const {
        orderId,
        amount,
        invoiceNo,
        customerName,
        paymentId,
      } = res.data;

      // 2️⃣ Open Razorpay
      const options = {
        key: import.meta.env.VITE_RZP_KEY,
        amount: amount * 100,
        currency: "INR",
        name: "Billing Software",
        description: `Invoice ${invoiceNo}`,
        order_id: orderId,

        handler: async (response) => {
          // 3️⃣ Verify payment
          await API.post("/payments/invoice/verify", {
            ...response,
            paymentId,
          });

          alert("Payment Successful ✅");
          onClose();
          window.location.reload();
        },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">
        Pay Invoice ₹{invoice.total}
      </h2>

      <button
        onClick={startPayment}
        className="w-full bg-purple-600 text-white py-2 rounded"
      >
        Pay with Razorpay
      </button>

      <button
        onClick={onClose}
        className="w-full mt-2 bg-gray-200 py-2 rounded"
      >
        Cancel
      </button>
    </div>
  );
};

export default PaymentPanel;
