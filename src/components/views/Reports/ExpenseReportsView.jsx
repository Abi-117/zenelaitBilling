// ExpenseReportsView.jsx
import React, { useState, useEffect } from "react";
import ReportHeader from "../../common/ReportHeader";
import EventDetailsModal from "./EventDetailsModal";
import { fetchExpenses } from "../../../services/expenseApi";

const ExpenseReportsView = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState(null);

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        setLoading(true);
        const data = await fetchExpenses();
        setExpenses(data.map(e => ({ ...e, id: e._id })));
      } catch (err) {
        console.error("Failed to load expenses", err);
      } finally {
        setLoading(false);
      }
    };
    loadExpenses();
  }, []);

  // Summary calculations
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const thisMonth = expenses
    .filter(e => e.date.startsWith(new Date().toISOString().slice(0, 7))) // current month
    .reduce((sum, e) => sum + e.amount, 0);
  const pendingPayments = expenses
    .filter(e => e.status === "Pending")
    .reduce((sum, e) => sum + e.amount, 0);

  if (loading) return <p className="text-sm text-slate-500">Loading expenses...</p>;

  return (
    <div className="space-y-6">

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Expenses", value: totalExpenses },
          { label: "This Month", value: thisMonth },
          { label: "Pending Payments", value: pendingPayments },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-6">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="text-2xl font-bold mt-2">₹{stat.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Expense Table */}
      {/* Expense Table */}
<div className="bg-white rounded-xl shadow p-6">
  <ReportHeader title="Expense Report" />

  <div className="overflow-x-auto">
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="border-b text-slate-500">
          <th className="text-left py-2 px-3">Date</th>
          <th className="text-left px-3">Category</th>
          <th className="text-left px-3">Description</th>
          <th className="text-right px-3">Amount</th>
         
          <th className="text-left px-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map(e => {
          let statusColor = "text-slate-600";
          if (e.status === "Paid") statusColor = "text-green-600";
          else if (e.status === "Pending") statusColor = "text-amber-600";
          else if (e.status === "Overdue") statusColor = "text-red-600";

          return (
            <tr key={e.id} className="border-b hover:bg-slate-50">
              <td className="py-2 px-3">{e.date}</td>
              <td className="px-3">{e.category}</td>
              <td className="px-3">{e.description}</td>
              <td className="py-2 px-3 text-right font-medium">₹{e.amount.toLocaleString()}</td>
             
              <td className="px-3">
                <button
                  onClick={() => setSelectedExpense(e)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  View
                </button>
                {e.status === "Pending" && (
                  <button
                    onClick={() => alert(`Marked as Paid: ${e.description}`)}
                    className="text-green-600 hover:underline text-sm ml-2"
                  >
                    Mark Paid
                  </button>
                )}
              </td>
            </tr>
          );
        })}

        {/* Totals Row */}
        <tr className="border-t font-semibold bg-slate-50">
          <td colSpan={3} className="py-2 px-3">Total</td>
          <td className="py-2 px-3 text-right">₹{totalExpenses.toLocaleString()}</td>
          <td colSpan={2}></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>


      {/* Expense Modal */}
      {selectedExpense && (
        <EventDetailsModal
          event={{
            ref: `EXP-${selectedExpense.id}`,
            type: selectedExpense.category,
            entity: selectedExpense.description,
            amount: selectedExpense.amount,
            status: selectedExpense.status,
            paymentMethod: selectedExpense.paymentMode,
            time: selectedExpense.date,
            message: `Expense Details: ${selectedExpense.description}`,
          }}
          onClose={() => setSelectedExpense(null)}
          onMarkPaid={(id) => {
            alert(`${id} marked as Paid`);
            setSelectedExpense(null);
            // Optionally refresh the list
            fetchExpenses().then(data => setExpenses(data.map(e => ({ ...e, id: e._id }))));
          }}
        />
      )}

    </div>
  );
};

export default ExpenseReportsView;
