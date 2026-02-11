const PaymentLinkDetails = ({ data }) => {
  if (!data) return null;

  const openPaymentPage = () => {
    window.open(`/pay/${data.linkId}`, "_blank");
  };

  const statusColor = {
    Pending: "text-orange-500",
    Paid: "text-green-600",
    Expired: "text-red-600",
  }[data.status] || "text-slate-500";

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-lg font-bold">Payment Link Details</h2>

      <div>
        <p className="text-xs text-slate-500">Customer</p>
        <p className="font-medium">{data.customerName}</p>
      </div>

      <div>
        <p className="text-xs text-slate-500">Invoice</p>
        <p className="font-medium">{data.invoiceNo || "-"}</p>
      </div>

      <div>
        <p className="text-xs text-slate-500">Amount</p>
        <p className="font-bold text-xl">₹{data.amount}</p>
      </div>

      <div>
        <p className="text-xs text-slate-500">Status</p>
        <p className={`${statusColor} font-semibold`}>
          {data.status}
        </p>
      </div>

      {data.status === "Pending" && (
        <button
          onClick={openPaymentPage}
          className="text-blue-600 underline"
        >
          Open Payment Page
        </button>
      )}

      {data.status === "Paid" && (
        <div className="text-green-600 text-center font-semibold">
          Payment Completed ✅
        </div>
      )}
    </div>
  );
};

export default PaymentLinkDetails;
