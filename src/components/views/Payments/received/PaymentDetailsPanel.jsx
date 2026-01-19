// PaymentDetailsPanel.jsx
import Card from '../../../ui/Card';

const PaymentDetailsPanel = ({ payment, onRefund }) => {
  return (
    <Card>
      <div className="space-y-4">
        <h3 className="text-xl font-bold">{payment.id}</h3>
        <p><b>Customer:</b> {payment.customer}</p>
        <p><b>Invoice:</b> {payment.invoice}</p>
        <p><b>Method:</b> {payment.method}</p>
        <p><b>Date:</b> {payment.date}</p>
        <p className="text-lg font-bold">₹{payment.amount}</p>
        <p>
          <b>Status:</b>{' '}
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${
              payment.status === 'Completed'
                ? 'bg-green-100 text-green-700'
                : payment.status === 'Pending'
                ? 'bg-amber-100 text-amber-700'
                : payment.status === 'Failed'
                ? 'bg-red-100 text-red-700'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {payment.status}
          </span>
        </p>

        {payment.status === 'Completed' && (
          <button
            onClick={() => onRefund(payment.id)}
            className="w-full bg-red-50 text-red-600 py-2 rounded hover:bg-red-100"
          >
            Refund Payment
          </button>
        )}
      </div>
    </Card>
  );
};

export default PaymentDetailsPanel;
