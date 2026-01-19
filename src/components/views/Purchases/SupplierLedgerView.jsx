import { useState } from 'react';

const SupplierLedgerView = () => {
  const [selectedSupplier, setSelectedSupplier] = useState('All');

  const ledgerEntries = [
    {
      id: 1,
      supplier: 'ABC Suppliers',
      date: '2026-01-01',
      type: 'Opening Balance',
      debit: 0,
      credit: 15000,
    },
    {
      id: 2,
      supplier: 'ABC Suppliers',
      date: '2026-01-05',
      type: 'Purchase Bill PB-1001',
      debit: 8500,
      credit: 0,
    },
    {
      id: 3,
      supplier: 'ABC Suppliers',
      date: '2026-01-08',
      type: 'Payment',
      debit: 0,
      credit: 5000,
    },
    {
      id: 4,
      supplier: 'XYZ Traders',
      date: '2026-01-03',
      type: 'Purchase Bill PB-1002',
      debit: 12000,
      credit: 0,
    },
    {
      id: 5,
      supplier: 'XYZ Traders',
      date: '2026-01-10',
      type: 'Purchase Return PR-1001',
      debit: 0,
      credit: 2500,
    },
  ];

  const suppliers = ['All', ...new Set(ledgerEntries.map(l => l.supplier))];

  const filteredEntries =
    selectedSupplier === 'All'
      ? ledgerEntries
      : ledgerEntries.filter(l => l.supplier === selectedSupplier);

  // 🔹 CALCULATE RUNNING BALANCE
  let runningBalance = 0;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Supplier Ledger</h2>
          <p className="text-sm text-slate-500">
            Complete transaction history with suppliers
          </p>
        </div>

        <select
          value={selectedSupplier}
          onChange={e => setSelectedSupplier(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        >
          {suppliers.map(s => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Supplier</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-right">Debit (₹)</th>
              <th className="p-3 text-right">Credit (₹)</th>
              <th className="p-3 text-right">Balance (₹)</th>
            </tr>
          </thead>

          <tbody>
            {filteredEntries.map(entry => {
              runningBalance += entry.debit - entry.credit;

              return (
                <tr key={entry.id} className="border-b hover:bg-slate-50">
                  <td className="p-3">{entry.date}</td>
                  <td className="p-3">{entry.supplier}</td>
                  <td className="p-3">{entry.type}</td>
                  <td className="p-3 text-right text-red-600">
                    {entry.debit ? `₹${entry.debit}` : '-'}
                  </td>
                  <td className="p-3 text-right text-emerald-600">
                    {entry.credit ? `₹${entry.credit}` : '-'}
                  </td>
                  <td className="p-3 text-right font-semibold">
                    ₹{runningBalance}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* SUMMARY */}
      <div className="bg-slate-50 rounded-xl p-4 flex justify-between text-sm font-semibold">
        <span>Total Outstanding</span>
        <span className="text-red-600">₹{runningBalance}</span>
      </div>

    </div>
  );
};

export default SupplierLedgerView;
