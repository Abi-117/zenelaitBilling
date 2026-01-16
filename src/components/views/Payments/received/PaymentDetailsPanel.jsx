const PaymentDetailsPanel = ({ payment }) => {
  return (
    <div className="bg-white border rounded-xl p-5 space-y-4">
      <h3 className="text-xl font-bold">{payment.id}</h3>
      <p><b>Customer:</b> {payment.customer}</p>
      <p><b>Invoice:</b> {payment.invoice}</p>
      <p><b>Method:</b> {payment.method}</p>
      <p className="text-lg font-bold">₹{payment.amount}</p>

      <button className="w-full bg-red-50 text-red-600 py-2 rounded">
        Refund Payment
      </button>
    </div>
  );
};

export default PaymentDetailsPanel;

