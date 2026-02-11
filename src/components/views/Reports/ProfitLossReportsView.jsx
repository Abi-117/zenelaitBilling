import React, { useState, useEffect } from "react";
import ReportHeader from "../../common/ReportHeader";
import EventDetailsModal from "./EventDetailsModal";
import { fetchInvoices } from "../../../services/invoiceApi";
import { fetchExpenses } from "../../../services/expenseApi";

const ProfitLossReportsView = () => {
  const [invoices, setInvoices] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [invData = [], expData = []] = await Promise.all([
          fetchInvoices(),
          fetchExpenses(),
        ]);

        // Map invoice amounts safely
        setInvoices(
          invData.map(i => ({
            ...i,
            id: i._id,
            // Pick the correct key from API: total > amount > 0
            amount: Number(i.total ?? i.amount ?? i.invoiceAmount ?? 0),
          }))
        );

        setExpenses(
          expData.map(e => ({
            ...e,
            id: e._id,
            amount: Number(e.amount ?? 0),
          }))
        );
      } catch (err) {
        console.error("Failed to load profit/loss data", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate totals
  const totalIncome = invoices
    .filter(i => i.status === "Paid")
    .reduce((sum, i) => sum + i.amount, 0);

  const pendingIncome = invoices
    .filter(i => i.status !== "Paid")
    .reduce((sum, i) => sum + i.amount, 0);

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalIncome - totalExpense;

  if (loading)
    return <p className="text-sm text-slate-500">Loading Profit & Loss data...</p>;

  return (
    <div className="space-y-6">
      <ReportHeader title="Profit & Loss Report" />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-slate-500">Received Income</p>
          <p className="text-2xl font-bold mt-2">₹{totalIncome.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-slate-500">Pending/Overdue Income</p>
          <p className="text-2xl font-bold mt-2">₹{pendingIncome.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-slate-500">Total Expense</p>
          <p className="text-2xl font-bold mt-2">₹{totalExpense.toLocaleString()}</p>
        </div>
        <div className={`bg-white rounded-xl shadow p-6 ${netProfit >= 0 ? "" : "bg-red-50"}`}>
          <p className="text-sm text-slate-500">Net Profit</p>
          <p className={`text-2xl font-bold mt-2 ${netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
            ₹{netProfit.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Income & Expense Table */}
      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
        <h2 className="text-lg font-bold mb-4">Income & Expense Breakdown</h2>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-slate-500 border-b">
              <th className="py-2 px-3">Type</th>
              <th className="py-2 px-3">Description / Customer</th>
              <th className="py-2 px-3">Amount</th>
              <th className="py-2 px-3">Status / Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Income */}
            {invoices.map(i => {
              let rowClass = "";
              let statusColor = "text-slate-600";

              if (i.status === "Pending") {
                rowClass = "bg-amber-50";
                statusColor = "text-amber-600";
              } else if (i.status === "Overdue") {
                rowClass = "bg-red-50";
                statusColor = "text-red-600";
              } else if (i.status === "Paid") {
                statusColor = "text-green-600";
              }

              return (
                <tr key={i.id} className={`border-b hover:bg-slate-50 ${rowClass}`}>
                  <td className="py-2 px-3 font-medium text-green-600">Income</td>
                  <td className="py-2 px-3">{i.customer}</td>
                  <td className="py-2 px-3">₹{i.amount.toLocaleString()}</td>
                  <td className={`py-2 px-3 font-medium ${statusColor}`}>
                    {i.status}
                    <button
                      onClick={() => setSelectedInvoice(i)}
                      className="ml-2 text-blue-600 hover:underline text-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}

            {/* Expenses */}
            {expenses.map((e, idx) => (
              <tr key={idx} className="border-b hover:bg-slate-50 bg-red-50">
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
              <td className="py-2 px-3">
                ₹{totalIncome.toLocaleString()} / ₹{totalExpense.toLocaleString()}
              </td>
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
          onMarkPaid={id => {
            alert(`Invoice ${id} marked as Paid`);
            setSelectedInvoice(null);
            // Reload invoices
            fetchInvoices().then(data =>
              setInvoices(
                data.map(i => ({
                  ...i,
                  id: i._id,
                  amount: Number(i.total ?? i.amount ?? i.invoiceAmount ?? 0),
                }))
              )
            );
          }}
        />
      )}
    </div>
  );
};

export default ProfitLossReportsView;
