// PaymentAgingReportsView.jsx
import React, { useState, useEffect } from "react";
import EventDetailsModal from "./EventDetailsModal";
import { fetchInvoices } from "../../../services/invoiceApi";

const PaymentAgingReportsView = () => {
  const [agingData, setAgingData] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Compute aging buckets
  const getAgingBucket = (invoiceDate) => {
    const diffDays = Math.floor((new Date() - new Date(invoiceDate)) / (1000 * 60 * 60 * 24));
    if (diffDays <= 30) return "0-30";
    if (diffDays <= 60) return "31-60";
    if (diffDays <= 90) return "61-90";
    return "90+";
  };

  // Load invoices and compute per-customer aging
  const loadData = async () => {
    try {
      setLoading(true);
      const invoices = await fetchInvoices(token);

      // Group by customer
      const customerMap = {};
      invoices.forEach((inv) => {
        const cust = inv.customerName || "Unknown";
        if (!customerMap[cust]) {
          customerMap[cust] = { customer: cust, "0-30": 0, "31-60": 0, "61-90": 0, "90+": 0, invoices: [] };
        }

        if (inv.status !== "Paid") {
          const bucket = getAgingBucket(inv.date);
          customerMap[cust][bucket] += inv.total || 0;
        }

        customerMap[cust].invoices.push(inv);
      });

      setAgingData(Object.values(customerMap));
    } catch (err) {
      console.error("Failed to load invoices for aging report:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  // Totals per bucket
  const totals = agingData.reduce(
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

      {loading ? (
        <p className="text-center text-sm text-slate-400">Loading...</p>
      ) : (
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
              {agingData.map((row, i) => (
                <tr key={i} className="border-b hover:bg-slate-50">
                  <td className="py-3 font-medium">{row.customer}</td>
                  <td className="py-3">₹{row["0-30"].toLocaleString()}</td>
                  <td className="py-3">₹{row["31-60"].toLocaleString()}</td>
                  <td className="py-3">₹{row["61-90"].toLocaleString()}</td>
                  <td className={`py-3 font-bold ${row["90+"] > 0 ? "text-red-600" : ""}`}>
                    ₹{row["90+"].toLocaleString()}
                  </td>
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
                <td className="py-2 px-3">₹{totals["0-30"].toLocaleString()}</td>
                <td className="py-2 px-3">₹{totals["31-60"].toLocaleString()}</td>
                <td className="py-2 px-3">₹{totals["61-90"].toLocaleString()}</td>
                <td className="py-2 px-3">₹{totals["90+"].toLocaleString()}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Invoice Modal */}
      {selectedInvoice && (
        <EventDetailsModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          onMarkPaid={(id) => {
            alert(`Invoice ${id} marked as Paid`);
            setSelectedInvoice(null);
            loadData(); // refresh after payment
          }}
        />
      )}
    </div>
  );
};

export default PaymentAgingReportsView;
