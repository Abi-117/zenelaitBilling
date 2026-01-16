import { useState } from 'react';

const SupplierLedgerView = () => {
  const [ledger, setLedger] = useState([
    {
      id: 1,
      supplier: 'ABC Suppliers',
      date: '2026-01-10',
      type: 'Purchase Bill',
      ref: 'PB-1001',
      debit: 12500,
      credit: 0,
      balance: 12500,
    },
    {
      id: 2,
      supplier: 'ABC Suppliers',
      date: '2026-01-15',
      type: 'Payment',
      ref: 'PAY-2001',
      debit: 0,
      credit: 5000,
      balance: 7500,
    },
  ]);

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-4">
      <div>
        <h2 className="text-xl font-bold">Supplier Ledger</h2>
        <p className="text-sm text-slate-500">
          Complete transaction history for suppliers
        </p>
      </div>

      <table className="w-full text-sm">
        <thead className="border-b text-slate-500">
          <tr>
            <th className="text-left py-2">Date</th>
            <th>Supplier</th>
            <th>Type</th>
            <th>Reference</th>
            <th>Debit</th>
            <th>Credit</th>
            <th>Balance</th>
          </tr>
        </thead>

        <tbody>
          {ledger.map(row => (
            <tr key={row.id} className="border-b">
              <td className="py-2">{row.date}</td>
              <td className="text-center">{row.supplier}</td>
              <td className="text-center">{row.type}</td>
              <td className="text-center">{row.ref}</td>
              <td className="text-right text-red-600">
                {row.debit ? `₹${row.debit}` : '-'}
              </td>
              <td className="text-right text-emerald-600">
                {row.credit ? `₹${row.credit}` : '-'}
              </td>
              <td className="text-right font-semibold">
                ₹{row.balance}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierLedgerView;
