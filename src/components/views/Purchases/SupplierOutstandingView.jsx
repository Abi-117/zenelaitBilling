import { useState } from 'react';
import { Search } from 'lucide-react';

const SupplierOutstandingView = () => {
  const [search, setSearch] = useState('');

  // 🔹 ZOHO-LIKE OUTSTANDING DATA
  const outstanding = [
    {
      supplier: 'ABC Suppliers',
      bills: 3,
      amount: 18500,
      aging: {
        '0-30': 8500,
        '31-60': 6000,
        '60+': 4000,
      },
    },
    {
      supplier: 'XYZ Traders',
      bills: 1,
      amount: 4200,
      aging: {
        '0-30': 4200,
        '31-60': 0,
        '60+': 0,
      },
    },
    {
      supplier: 'Global Stationers',
      bills: 2,
      amount: 9600,
      aging: {
        '0-30': 3000,
        '31-60': 6600,
        '60+': 0,
      },
    },
  ];

  const filtered = outstanding.filter(o =>
    o.supplier.toLowerCase().includes(search.toLowerCase())
  );

  const totalOutstanding = filtered.reduce(
    (sum, o) => sum + o.amount,
    0
  );

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Supplier Outstanding</h2>
          <p className="text-sm text-slate-500">
            Total unpaid bills grouped by supplier
          </p>
        </div>

        <div className="flex items-center gap-2 border rounded px-3 py-2 text-sm">
          <Search size={16} className="text-slate-400" />
          <input
            placeholder="Search supplier"
            className="outline-none"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="p-3 text-left">Supplier</th>
              <th className="p-3 text-center">Bills</th>
              <th className="p-3 text-right">0–30 Days</th>
              <th className="p-3 text-right">31–60 Days</th>
              <th className="p-3 text-right">60+ Days</th>
              <th className="p-3 text-right">Outstanding</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((row, i) => (
              <tr key={i} className="border-b hover:bg-slate-50">
                <td className="p-3 font-medium">{row.supplier}</td>
                <td className="p-3 text-center">{row.bills}</td>
                <td className="p-3 text-right">₹{row.aging['0-30']}</td>
                <td className="p-3 text-right">₹{row.aging['31-60']}</td>
                <td className="p-3 text-right text-rose-600">
                  ₹{row.aging['60+']}
                </td>
                <td className="p-3 text-right font-bold text-rose-600">
                  ₹{row.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SUMMARY */}
      <div className="bg-slate-50 rounded-xl p-4 flex justify-between items-center">
        <span className="text-sm font-semibold">
          Total Outstanding Payable
        </span>
        <span className="text-lg font-bold text-rose-600">
          ₹{totalOutstanding}
        </span>
      </div>

    </div>
  );
};

export default SupplierOutstandingView;
