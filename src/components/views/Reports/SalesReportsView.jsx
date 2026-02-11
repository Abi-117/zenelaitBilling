import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import EventDetailsModal from "./EventDetailsModal";
import { fetchInvoices, fetchMonthlySales, markInvoicePaid } from "../../../services/invoiceApi";

const SalesReportsView = () => {
  const [invoices, setInvoices] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load invoices and sales
  const loadData = async () => {
    try {
      setLoading(true);
      const [invoiceData, salesData] = await Promise.all([
        fetchInvoices(),
        fetchMonthlySales(),
      ]);
      setInvoices(invoiceData);
      setMonthlySales(salesData);
    } catch (err) {
      console.error("Failed to load sales data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInvoicePaid = async (invoiceId) => {
    try {
      await markInvoicePaid(invoiceId);
      await loadData();
      setSelectedInvoice(null);
    } catch (err) {
      console.error("Failed to mark invoice paid:", err);
    }
  };

  const totalRevenue = monthlySales.reduce((sum, m) => sum + m.revenue, 0);
  const outstanding = invoices
    .filter(inv => inv.status !== "Paid")
    .reduce((sum, inv) => sum + inv.total, 0);
  const avgInvoice = invoices.length
    ? invoices.reduce((sum, inv) => sum + inv.total, 0) / invoices.length
    : 0;
  const paidTotal = invoices
    .filter(inv => inv.status === "Paid")
    .reduce((sum, inv) => sum + inv.total, 0);
  const totalCustomers = new Set(invoices.map(inv => inv.customerName)).size;

  const stats = [
    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}` },
    { label: "Outstanding Invoices", value: `₹${outstanding.toLocaleString()}` },
    { label: "Avg Invoice Value", value: `₹${Math.round(avgInvoice).toLocaleString()}` },
    { label: "Paid Invoices", value: `₹${paidTotal.toLocaleString()}` },
    { label: "Pending Invoices", value: `₹${outstanding.toLocaleString()}` },
    { label: "Total Customers", value: totalCustomers },
  ];

  return (
    <div className="space-y-6">
      {loading && <p className="text-center text-sm text-slate-400">Loading...</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-6">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-bold mb-4">Monthly Sales Summary</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-bold mb-4">Recent Invoices</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th>Invoice #</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv._id} className="border-b hover:bg-slate-50">
                  <td>{inv.invoiceNo}</td>
                  <td>{inv.customerName}</td>
                  <td>₹{inv.total.toLocaleString()}</td>
                  <td>{inv.status}</td>
                  <td>
                    <button onClick={() => setSelectedInvoice(inv)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedInvoice && (
        <EventDetailsModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          onMarkPaid={handleInvoicePaid}
        />
      )}
    </div>
  );
};

export default SalesReportsView;
