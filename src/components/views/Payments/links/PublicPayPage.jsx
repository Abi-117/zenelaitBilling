import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../../../config/api";

const PublicPayPage = () => {
  const { linkId } = useParams();
  const [link, setLink] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get(`/payment-links/public/${linkId}`)
      .then(res => setLink(res.data))
      .catch(err => {
        setError(
          err.response?.data?.message || "Invalid or expired payment link"
        );
      });
  }, [linkId]);

  const payNow = () => {
    const options = {
      key: import.meta.env.VITE_RZP_KEY,
      amount: link.amount * 100,
      currency: "INR",
      name: "Billing Software",
      description: `Invoice ${link.invoiceNo}`,
      order_id: link.razorpayOrderId,
      handler: async response => {
        await API.post("/payments/verify", {
          ...response,
          linkId: link.linkId
        });
        alert("Payment Successful");
      }
    };

    new window.Razorpay(options).open();
  };

  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!link) return <p className="text-center">Loading...</p>;

  return (
    <div className="h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-6 rounded w-[400px] space-y-4">
        <h2 className="text-xl font-bold">Pay ₹{link.amount}</h2>
        <p>{link.customerName}</p>
        <p>Invoice: {link.invoiceNo}</p>

        <button
          onClick={payNow}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default PublicPayPage;
