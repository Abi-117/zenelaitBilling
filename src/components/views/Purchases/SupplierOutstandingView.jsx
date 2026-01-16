import { useState } from 'react';

const SupplierOutstandingView = () => {
  const [outstanding, setOutstanding] = useState([
    {
      supplier: 'ABC Suppliers',
      bills: 3,
      amount: 18500,
    },
    {
      supplier: 'XYZ Traders',
      bills: 1,
      amount: 4200,
    },
  ]);

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-4">
      <div>
        <h2 className="text-xl font-bold">Supplier Outstanding</h2>
        <p className="text-sm text-slate-500">
          Payables pending for suppliers
        </p>
      </div>

      <table className="w-full text-sm">
        <thead className="border-b text-slate-500">
          <tr>
            <th className="text-left py-2">Supplier</th>
            <th>Bills</th>
            <th>Outstanding Amount</th>
          </tr>
        </thead>

        <tbody>
          {outstanding.map((row, i) => (
            <tr key={i} className="border-b">
              <td className="py-2 font-medium">{row.supplier}</td>
              <td className="text-center">{row.bills}</td>
              <td className="text-right font-bold text-rose-600">
                ₹{row.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierOutstandingView;
