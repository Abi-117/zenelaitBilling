import React, { useEffect, useState } from "react";
import ReportHeader from "../../common/ReportHeader";
import { fetchInvoices } from "../../../services/invoiceApi";

const OutstandingReportsView = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    total: 0,
    days0_30: 0,
    days31_60: 0,
    days60plus: 0,
  });

  useEffect(() => {
    const loadOutstanding = async () => {
      try {
        setLoading(true);

        const allInvoices = await fetchInvoices();
        console.log("Invoices from API:", allInvoices);

        const outstandingInvoices = allInvoices
          .map((i) => {
            const total = i.totalAmount ?? i.amount ?? i.total ?? 0;
            const paid = i.paidAmount ?? i.paid ?? i.receivedAmount ?? 0;
            const outstanding = total - paid;
            if (outstanding <= 0) return null;

            const dueDateStr = i.dueDate ?? i.invoiceDate ?? i.createdAt ?? null;
            const dueDateObj = dueDateStr ? new Date(dueDateStr) : null;
            const age = dueDateObj
              ? Math.floor((new Date() - dueDateObj) / (1000 * 60 * 60 * 24))
              : 0;

            const status =
              age <= 30 ? "Pending" : age <= 60 ? "Overdue" : "Critical";

            return {
              ...i,
              customer: i.customer?.name || i.customer || "Unknown",
              outstanding,
              age,
              status,
              invoiceAmount: total,
              dueDate: dueDateObj ? dueDateObj.toLocaleDateString() : "-",
              invoiceDate: i.invoiceDate ?? i.createdAt ?? "-",
            };
          })
          .filter(Boolean);

        setInvoices(outstandingInvoices);

        // Summary computation
        let total = 0,
          days0_30 = 0,
          days31_60 = 0,
          days60plus = 0;

        outstandingInvoices.forEach((i) => {
          total += i.outstanding;
          if (i.age <= 30) days0_30 += i.outstanding;
          else if (i.age <= 60) days31_60 += i.outstanding;
          else days60plus += i.outstanding;
        });

        setSummary({ total, days0_30, days31_60, days60plus });
      } catch (err) {
        console.error("Error loading outstanding invoices:", err);
      } finally {
        setLoading(false);
      }
    };

    loadOutstanding();
  }, []);

  if (loading) return <p>Loading outstanding invoices...</p>;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Outstanding", value: summary.total },
          { label: "0–30 Days", value: summary.days0_30 },
          { label: "31–60 Days", value: summary.days31_60 },
          { label: "60+ Days", value: summary.days60plus },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-6">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="text-2xl font-bold mt-2">
              ₹{stat.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow p-6">
        <ReportHeader title="Outstanding Invoices" />
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-slate-500">
              <th>Customer</th>
              <th>Invoice No</th>
              <th>Invoice Date</th>
              <th>Due Date</th>
              <th className="text-right">Invoice Amount</th>
              <th className="text-right">Outstanding</th>
              <th>Age</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((i, idx) => (
              <tr key={idx} className="border-b">
                <td className="py-3 font-medium">{i.customer}</td>
                <td>{i.invoiceNo ?? i.invoiceNumber ?? "-"}</td>
                <td>{i.invoiceDate ?? "-"}</td>
                <td>{i.dueDate ?? "-"}</td>
                <td className="text-right">
                  ₹{(i.invoiceAmount || 0).toLocaleString()}
                </td>
                <td className="text-right font-semibold">
                  ₹{i.outstanding.toLocaleString()}
                </td>
                <td>{i.age} days</td>
                <td
                  className={`font-medium ${
                    i.status === "Pending"
                      ? "text-amber-600"
                      : i.status === "Overdue"
                      ? "text-orange-600"
                      : "text-rose-600"
                  }`}
                >
                  {i.status}
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  No outstanding invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OutstandingReportsView;
