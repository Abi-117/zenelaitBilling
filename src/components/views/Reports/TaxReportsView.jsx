// TaxReportsView.jsx
import React, { useState } from "react";
import EventDetailsModal from "./EventDetailsModal";

const dummyTaxData = [
  {
    customer: "Acme Corp",
    taxable: 100000,
    cgst: 9000,
    sgst: 9000,
    igst: 0,
    totalGST: 18000,
    invoices: [
      { ref: "INV-001", amount: 100000, gstRate: 18, status: "Pending", time: "2026-01-10", customer: "Acme Corp" },
    ],
  },
  {
    customer: "Globex",
    taxable: 50000,
    cgst: 4500,
    sgst: 4500,
    igst: 0,
    totalGST: 9000,
    invoices: [
      { ref: "INV-002", amount: 50000, gstRate: 18, status: "Paid", time: "2026-01-05", customer: "Globex" },
    ],
  },
  {
    customer: "Beta Ltd",
    taxable: 80000,
    cgst: 7200,
    sgst: 7200,
    igst: 0,
    totalGST: 14400,
    invoices: [
      { ref: "INV-003", amount: 80000, gstRate: 18, status: "Pending", time: "2026-01-12", customer: "Beta Ltd" },
    ],
  },
];

const TaxReportsView = () => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Totals
  const totals = dummyTaxData.reduce(
    (acc, cur) => {
      acc.taxable += cur.taxable;
      acc.cgst += cur.cgst;
      acc.sgst += cur.sgst;
      acc.igst += cur.igst;
      acc.totalGST += cur.totalGST;
      return acc;
    },
    { taxable: 0, cgst: 0, sgst: 0, igst: 0, totalGST: 0 }
  );

  return (
    <div className="space-y-6">
      {/* GST Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-slate-500">GST Collected</p>
          <p className="text-2xl font-bold mt-2">₹{totals.totalGST}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-slate-500">GST Payable</p>
          <p className="text-2xl font-bold mt-2">₹{totals.totalGST}</p>
        </div>
      </div>

      {/* GST Summary Table */}
      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">GST Summary</h2>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
            onClick={() => alert("Export to CSV/PDF")}
          >
            Export
          </button>
        </div>

        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-slate-500 border-b">
              <th className="py-2 px-3">Customer</th>
              <th className="py-2 px-3">Taxable Amount</th>
              <th className="py-2 px-3">CGST</th>
              <th className="py-2 px-3">SGST</th>
              <th className="py-2 px-3">IGST</th>
              <th className="py-2 px-3">Total GST</th>
              <th className="py-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dummyTaxData.map((row, i) => (
              <tr key={i} className="border-b hover:bg-slate-50">
                <td className="py-2 px-3 font-medium">{row.customer}</td>
                <td className="py-2 px-3">₹{row.taxable}</td>
                <td className="py-2 px-3">₹{row.cgst}</td>
                <td className="py-2 px-3">₹{row.sgst}</td>
                <td className="py-2 px-3">₹{row.igst}</td>
                <td className="py-2 px-3 font-bold">₹{row.totalGST}</td>
                <td className="py-2 px-3 flex gap-2">
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
              <td className="py-2 px-3">₹{totals.taxable}</td>
              <td className="py-2 px-3">₹{totals.cgst}</td>
              <td className="py-2 px-3">₹{totals.sgst}</td>
              <td className="py-2 px-3">₹{totals.igst}</td>
              <td className="py-2 px-3">₹{totals.totalGST}</td>
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

export default TaxReportsView;
