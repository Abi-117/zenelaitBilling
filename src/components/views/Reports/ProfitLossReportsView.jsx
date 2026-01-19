// ProfitLossReportsView.jsx
import React, { useState } from "react";
import ReportHeader from "../../common/ReportHeader";
import EventDetailsModal from "./EventDetailsModal";

// Dummy data (related to invoices, expenses, stock)
const invoices = [
  { id: "INV-001", amount: 25000, customer: "Acme Corp", status: "Pending" },
  { id: "INV-002", amount: 50000, customer: "Globex", status: "Paid" },
  { id: "INV-003", amount: 80000, customer: "Beta Ltd", status: "Pending" },
  { id: "INV-004", amount: 8000, customer: "Acme Corp", status: "Pending" },
  { id: "INV-005", amount: 6200, customer: "Globex", status: "Pending" },
  { id: "INV-006", amount: 3000, customer: "Globex", status: "Pending" },
  { id: "INV-007", amount: 1200, customer: "Globex", status: "Overdue" },
  { id: "INV-008", amount: 32000, customer: "Gamma Inc", status: "Paid" },
];

const expenses = [
  { category: "Rent", amount: 50000 },
  { category: "Salaries", amount: 250000 },
  { category: "Utilities", amount: 40000 },
  { category: "Marketing", amount: 20000 },
  { category: "Supplies", amount: 20000 },
  { category: "Other", amount: 10000 },
];

const ProfitLossReportsView = () => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const totalIncome = invoices.reduce((sum, i) => sum + i.amount, 0);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      <ReportHeader title="Profit & Loss Report" />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-slate-500">Total Income</p>
          <p className="text-2xl font-bold mt-2">₹{totalIncome.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-slate-500">Total Expense</p>
          <p className="text-2xl font-bold mt-2">₹{totalExpense.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-slate-500">Net Profit</p>
          <p className="text-2xl font-bold mt-2">₹{netProfit.toLocaleString()}</p>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
        <h2 className="text-lg font-bold mb-4">Income & Expense Breakdown</h2>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-slate-500 border-b">
              <th className="py-2 px-3">Type</th>
              <th className="py-2 px-3">Description / Customer</th>
              <th className="py-2 px-3">Amount</th>
              <th className="py-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Income */}
            {invoices.map((i) => (
              <tr key={i.id} className="border-b hover:bg-slate-50">
                <td className="py-2 px-3 font-medium text-green-600">Income</td>
                <td className="py-2 px-3">{i.customer}</td>
                <td className="py-2 px-3">₹{i.amount.toLocaleString()}</td>
                <td className="py-2 px-3">
                  <button
                    onClick={() => setSelectedInvoice(i)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View Invoice
                  </button>
                </td>
              </tr>
            ))}

            {/* Expenses */}
            {expenses.map((e, idx) => (
              <tr key={idx} className="border-b hover:bg-slate-50">
                <td className="py-2 px-3 font-medium text-red-600">Expense</td>
                <td className="py-2 px-3">{e.category}</td>
                <td className="py-2 px-3">₹{e.amount.toLocaleString()}</td>
                <td className="py-2 px-3">
                  <button
                    onClick={() => alert(`Expense Details: ${e.category}`)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}

            {/* Totals */}
            <tr className="border-t font-semibold bg-slate-50">
              <td className="py-2 px-3">Total</td>
              <td></td>
              <td className="py-2 px-3">₹{totalIncome.toLocaleString()} / ₹{totalExpense.toLocaleString()}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Invoice Modal */}
      {selectedInvoice && (
        <EventDetailsModal
          event={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          onMarkPaid={(id) => {
            alert(`Invoice ${id} marked as Paid`);
            setSelectedInvoice(null);
          }}
        />
      )}
    </div>
  );
};

export default ProfitLossReportsView;
