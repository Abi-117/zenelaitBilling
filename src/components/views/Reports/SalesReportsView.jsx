// SalesReportsView.jsx
import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import EventDetailsModal from "./EventDetailsModal"; // Your modal

const dummyInvoices = [
  {
    id: "INV-001",
    ref: "INV-001",
    type: "Product Sale",
    entity: "Acme Corp",
    status: "Pending",
    time: "2026-01-15",
    amount: 25000,
    customer: "Acme Corp",
    paymentMethod: "Bank Transfer",
    message: "Monthly subscription",
  },
  {
    id: "INV-002",
    ref: "INV-002",
    type: "Service",
    entity: "Beta Ltd",
    status: "Paid",
    time: "2026-01-10",
    amount: 45000,
    customer: "Beta Ltd",
    paymentMethod: "Credit Card",
  },
  {
    id: "INV-003",
    ref: "INV-003",
    type: "Product Sale",
    entity: "Gamma Inc",
    status: "Overdue",
    time: "2026-01-05",
    amount: 32000,
    customer: "Gamma Inc",
    paymentMethod: "Cash",
  },
];

const monthlySales = [
  { month: "Jan", revenue: 120000 },
  { month: "Feb", revenue: 95000 },
  { month: "Mar", revenue: 150000 },
  { month: "Apr", revenue: 130000 },
  { month: "May", revenue: 175000 },
  { month: "Jun", revenue: 200000 },
];

const SalesReportsView = () => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const stats = [
    { label: "Total Revenue", value: "₹4,82,500" },
    { label: "Outstanding Invoices", value: "₹78,200" },
    { label: "Avg Invoice Value", value: "₹12,450" },
    { label: "Paid Invoices", value: "₹3,50,000" },
    { label: "Pending Invoices", value: "₹78,200" },
    { label: "GST Collected", value: "₹52,300" },
    { label: "Total Customers", value: 45 },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-6">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Monthly Sales Chart */}
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

      {/* Recent Invoices Table */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-bold mb-4">Recent Invoices</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-3 text-sm text-slate-500">Invoice #</th>
                <th className="py-2 px-3 text-sm text-slate-500">Customer</th>
                <th className="py-2 px-3 text-sm text-slate-500">Amount</th>
                <th className="py-2 px-3 text-sm text-slate-500">Status</th>
                <th className="py-2 px-3 text-sm text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dummyInvoices.map((inv) => (
                <tr key={inv.id} className="border-b hover:bg-slate-50">
                  <td className="py-2 px-3 text-sm font-medium">{inv.ref}</td>
                  <td className="py-2 px-3 text-sm">{inv.customer}</td>
                  <td className="py-2 px-3 text-sm">₹{inv.amount}</td>
                  <td className="py-2 px-3 text-sm">{inv.status}</td>
                  <td className="py-2 px-3 text-sm flex gap-2">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

export default SalesReportsView;
