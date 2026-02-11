// TaxReportsView.jsx
import React, { useState, useEffect } from "react";
import EventDetailsModal from "./EventDetailsModal";
import { fetchInvoices } from "../../../services/invoiceApi";

const TaxReportsView = () => {
  const [taxData, setTaxData] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Load invoices and compute tax summary per customer
  const loadData = async () => {
    try {
      setLoading(true);
      const invoices = await fetchInvoices(token);

      const customerMap = {};

      invoices.forEach((inv) => {
        const cust = inv.customerName || "Unknown";
        if (!customerMap[cust]) {
          customerMap[cust] = {
            customer: cust,
            taxable: 0,
            cgst: 0,
            sgst: 0,
            igst: 0,
            totalGST: 0,
            invoices: [],
          };
        }

        const gstRate = inv.gstRate || 0;
        const cgst = gstRate / 2 / 100 * inv.total || 0;
        const sgst = gstRate / 2 / 100 * inv.total || 0;
        const igst = gstRate === 18 ? 0 : gstRate / 100 * inv.total || 0; // example logic

        customerMap[cust].taxable += inv.total || 0;
        customerMap[cust].cgst += cgst;
        customerMap[cust].sgst += sgst;
        customerMap[cust].igst += igst;
        customerMap[cust].totalGST += cgst + sgst + igst;

        customerMap[cust].invoices.push(inv);
      });

      setTaxData(Object.values(customerMap));
    } catch (err) {
      console.error("Failed to load tax data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  // Totals across all customers
  const totals = taxData.reduce(
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
          <p className="text-2xl font-bold mt-2">₹{totals.totalGST.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-slate-500">GST Payable</p>
          <p className="text-2xl font-bold mt-2">₹{totals.totalGST.toLocaleString()}</p>
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

        {loading ? (
          <p className="text-center text-sm text-slate-400">Loading...</p>
        ) : (
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
              {taxData.map((row, i) => (
                <tr key={i} className="border-b hover:bg-slate-50">
                  <td className="py-2 px-3 font-medium">{row.customer}</td>
                  <td className="py-2 px-3">₹{row.taxable.toLocaleString()}</td>
                  <td className="py-2 px-3">₹{row.cgst.toLocaleString()}</td>
                  <td className="py-2 px-3">₹{row.sgst.toLocaleString()}</td>
                  <td className="py-2 px-3">₹{row.igst.toLocaleString()}</td>
                  <td className="py-2 px-3 font-bold">₹{row.totalGST.toLocaleString()}</td>
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
                <td className="py-2 px-3">₹{totals.taxable.toLocaleString()}</td>
                <td className="py-2 px-3">₹{totals.cgst.toLocaleString()}</td>
                <td className="py-2 px-3">₹{totals.sgst.toLocaleString()}</td>
                <td className="py-2 px-3">₹{totals.igst.toLocaleString()}</td>
                <td className="py-2 px-3">₹{totals.totalGST.toLocaleString()}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

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

export default TaxReportsView;
