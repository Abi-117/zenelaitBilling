import { Plus } from 'lucide-react';

const QuickActions = ({ onInvoice, onCustomer, onSubscription }) => {
  return (
    <div className="bg-white p-5 rounded-xl border shadow-sm">
      <h3 className="font-semibold mb-4">Quick Actions</h3>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={onInvoice}
          className="btn-primary"
        >
          <Plus size={16} /> Create Invoice
        </button>

        <button
          onClick={onCustomer}
          className="btn-success"
        >
          <Plus size={16} /> Add Customer
        </button>

        <button
          onClick={onSubscription}
          className="btn-violet"
        >
          <Plus size={16} /> New Subscription
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
