// ExpenseReportsView.jsx
import React, { useState } from "react";
import ReportHeader from "../../common/ReportHeader";
import EventDetailsModal from "./EventDetailsModal";

// Dummy Expense Data
const dummyExpenses = [
  { id: 1, date: "2026-01-12", category: "Office Rent", description: "January Rent", amount: 35000, paymentMode: "Bank Transfer", status: "Paid" },
  { id: 2, date: "2026-01-18", category: "Internet", description: "Broadband Bill", amount: 2400, paymentMode: "UPI", status: "Paid" },
  { id: 3, date: "2026-01-22", category: "Marketing", description: "Google Ads", amount: 10600, paymentMode: "Credit Card", status: "Pending" },
  { id: 4, date: "2026-01-15", category: "Supplies", description: "Stationery", amount: 5600, paymentMode: "Cash", status: "Paid" },
  { id: 5, date: "2026-01-20", category: "Utilities", description: "Electricity Bill", amount: 4800, paymentMode: "Bank Transfer", status: "Pending" },
];

const ExpenseReportsView = () => {
  const [selectedExpense, setSelectedExpense] = useState(null);

  const totalExpenses = dummyExpenses.reduce((sum, e) => sum + e.amount, 0);
  const thisMonth = dummyExpenses.filter(e => e.date.startsWith("2026-01")).reduce((sum, e) => sum + e.amount, 0);
  const pendingPayments = dummyExpenses.filter(e => e.status === "Pending").reduce((sum, e) => sum + e.amount, 0);

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
                <th className="text-left px-3">Payment Mode</th>
                <th className="text-left px-3">Status</th>
                <th className="text-left px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dummyExpenses.map(e => {
                let statusColor = "text-slate-600";
                if(e.status === "Paid") statusColor = "text-green-600";
                else if(e.status === "Pending") statusColor = "text-amber-600";
                else if(e.status === "Overdue") statusColor = "text-red-600";

                return (
                  <tr key={e.id} className="border-b hover:bg-slate-50">
                    <td className="py-2 px-3">{e.date}</td>
                    <td className="px-3">{e.category}</td>
                    <td className="px-3">{e.description}</td>
                    <td className="py-2 px-3 text-right font-medium">₹{e.amount.toLocaleString()}</td>
                    <td className="px-3">{e.paymentMode}</td>
                    <td className={`px-3 font-medium ${statusColor}`}>{e.status}</td>
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
                <td colSpan={3}></td>
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
          }}
        />
      )}

    </div>
  );
};

export default ExpenseReportsView;
