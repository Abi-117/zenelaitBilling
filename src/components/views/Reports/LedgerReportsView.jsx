import React, { useState, useEffect } from "react";
import ReportHeader from "../../common/ReportHeader";
import { fetchLedgerEntries } from "../../../services/ledgerApi";

const LedgerReportsView = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({ debit: 0, credit: 0, balance: 0 });

  useEffect(() => {
    const loadLedger = async () => {
      try {
        setLoading(true);
        const data = await fetchLedgerEntries(); // can pass supplierId if needed
        setEntries(data);

        // Compute totals
        const totalDebit = data.reduce((sum, e) => sum + e.debit, 0);
        const totalCredit = data.reduce((sum, e) => sum + e.credit, 0);
        const closingBalance = data.length ? data[data.length - 1].balance : 0;

        setTotals({ debit: totalDebit, credit: totalCredit, balance: closingBalance });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadLedger();
  }, []);

  if (loading) return <p>Loading ledger data...</p>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <p>Total Debit</p>
          <p>₹{totals.debit.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p>Total Credit</p>
          <p>₹{totals.credit.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p>Closing Balance</p>
          <p>₹{totals.balance.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <ReportHeader title="Ledger Report" />
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th>Date</th>
              <th>Reference</th>
              <th>Description</th>
              <th className="text-right">Debit</th>
              <th className="text-right">Credit</th>
              <th className="text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e, idx) => (
              <tr key={idx}>
                <td>{e.date}</td>
                <td>{e.reference}</td>
                <td>{e.description}</td>
                <td className="text-right">₹{e.debit.toLocaleString()}</td>
                <td className="text-right">₹{e.credit.toLocaleString()}</td>
                <td className="text-right">₹{e.balance.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LedgerReportsView;
