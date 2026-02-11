// QuickActions.jsx
import { Plus } from "lucide-react";

const QuickActions = ({ setActiveTab }) => {
  return (
    <div className="bg-white p-5 rounded-xl border shadow-sm">
      <h3 className="font-semibold mb-4">Quick Actions</h3>

      <div className="flex gap-3">
        {/* Go to Sales → Invoices */}
        <button
          onClick={() => setActiveTab("invoices")}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} /> Create Invoice
        </button>

        {/* Go to Customers */}
        <button
          onClick={() => setActiveTab("customers")}
          className="btn-success flex items-center gap-2"
        >
          <Plus size={16} /> Add Customer
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
