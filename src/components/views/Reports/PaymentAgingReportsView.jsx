// PaymentAgingReportsView.jsx
import React, { useState } from "react";
import EventDetailsModal from "./EventDetailsModal";

const dummyAgingData = [
  {
    customer: "Acme Corp",
    "0-30": 25000,
    "31-60": 8000,
    "61-90": 0,
    "90+": 0,
    invoices: [
      { ref: "INV-001", amount: 25000, status: "Pending", time: "2026-01-10" },
      { ref: "INV-004", amount: 8000, status: "Pending", time: "2025-12-20" },
    ],
  },
  {
    customer: "Globex",
    "0-30": 10500,
    "31-60": 6200,
    "61-90": 3000,
    "90+": 1200,
    invoices: [
      { ref: "INV-002", amount: 10500, status: "Pending", time: "2026-01-12" },
      { ref: "INV-005", amount: 6200, status: "Pending", time: "2025-12-15" },
      { ref: "INV-006", amount: 3000, status: "Pending", time: "2025-11-10" },
      { ref: "INV-007", amount: 1200, status: "Overdue", time: "2025-10-05" },
    ],
  },
];

const PaymentAgingReportsView = () => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Totals per aging bucket
  const totals = dummyAgingData.reduce(
    (acc, cur) => {
      acc["0-30"] += cur["0-30"];
      acc["31-60"] += cur["31-60"];
      acc["61-90"] += cur["61-90"];
      acc["90+"] += cur["90+"];
      return acc;
    },
    { "0-30": 0, "31-60": 0, "61-90": 0, "90+": 0 }
  );

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-6">
      <h2 className="text-lg font-bold">Payment & Aging Report</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-slate-500 border-b">
              <th className="py-2 px-3">Customer</th>
              <th className="py-2 px-3">0–30 Days</th>
              <th className="py-2 px-3">31–60 Days</th>
              <th className="py-2 px-3">61–90 Days</th>
              <th className="py-2 px-3">90+ Days</th>
              <th className="py-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dummyAgingData.map((row, i) => (
              <tr key={i} className="border-b hover:bg-slate-50">
                <td className="py-3 font-medium">{row.customer}</td>
                <td className="py-3">₹{row["0-30"]}</td>
                <td className="py-3">₹{row["31-60"]}</td>
                <td className="py-3">₹{row["61-90"]}</td>
                <td className={`py-3 font-bold ${row["90+"] > 0 ? "text-red-600" : ""}`}>₹{row["90+"]}</td>
                <td className="py-3 flex gap-2">
                  <button
                    onClick={() => setSelectedInvoice(row.invoices[0])}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View Invoice
                  </button>
                  <button
                    onClick={() => alert(`Reminder sent to ${row.customer}`)}
                    className="text-green-600 hover:underline text-sm"
                  >
                    Send Reminder
                  </button>
                </td>
              </tr>
            ))}

            {/* Totals Row */}
            <tr className="border-t font-semibold bg-slate-50">
              <td className="py-2 px-3">Total</td>
              <td className="py-2 px-3">₹{totals["0-30"]}</td>
              <td className="py-2 px-3">₹{totals["31-60"]}</td>
              <td className="py-2 px-3">₹{totals["61-90"]}</td>
              <td className="py-2 px-3">₹{totals["90+"]}</td>
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

export default PaymentAgingReportsView;
