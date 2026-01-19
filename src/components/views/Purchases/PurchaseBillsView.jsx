import { useState } from 'react';
import { FileText, IndianRupee, Search } from 'lucide-react';

const PurchaseBillsView = () => {
  const [search, setSearch] = useState('');

  const [bills, setBills] = useState([
    {
      id: 'PB-2001',
      supplier: 'Metro Steels',
      billNo: 'PB-2001',
      billDate: '2026-01-16',
      subtotal: 95000,
      tax: 17100,
      total: 112100,
      status: 'Unpaid',
      sourceGRN: 'GRN-1002',
    },
    {
      id: 'PB-2002',
      supplier: 'OfficeMart',
      billNo: 'PB-2002',
      billDate: '2026-01-21',
      subtotal: 55600,
      tax: 10008,
      total: 65608,
      status: 'Paid',
      sourceGRN: 'GRN-1004',
    },
    {
      id: 'PB-2003',
      supplier: 'Packaging World',
      billNo: 'PB-2003',
      billDate: '2026-01-26',
      subtotal: 17000,
      tax: 2040,
      total: 19040,
      status: 'Unpaid',
      sourceGRN: 'GRN-1006',
    },
    {
      id: 'PB-2004',
      supplier: 'ABC Suppliers',
      billNo: 'PB-2004',
      billDate: '2026-01-13',
      subtotal: 20000,
      tax: 3600,
      total: 23600,
      status: 'Overdue',
      sourceGRN: 'GRN-1001',
    },
    {
      id: 'PB-2005',
      supplier: 'TechZone Pvt Ltd',
      billNo: 'PB-2005',
      billDate: '2026-01-19',
      subtotal: 31000,
      tax: 5580,
      total: 36580,
      status: 'Unpaid',
      sourceGRN: 'GRN-1003',
    },
    {
      id: 'PB-2006',
      supplier: 'PowerGrid Electricals',
      billNo: 'PB-2006',
      billDate: '2026-01-23',
      subtotal: 26000,
      tax: 4680,
      total: 30680,
      status: 'Paid',
      sourceGRN: 'GRN-1005',
    },
  ]);

  const filteredBills = bills.filter(
    b =>
      b.supplier.toLowerCase().includes(search.toLowerCase()) ||
      b.billNo.toLowerCase().includes(search.toLowerCase())
  );

  const totalAmount = filteredBills.reduce((a, b) => a + b.total, 0);

  return (
    <div className="space-y-4 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Purchase Bills</h2>

        <div className="relative w-64">
          <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            placeholder="Search bill / supplier"
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm"
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
              <th className="p-3 text-left">Bill No</th>
              <th className="p-3 text-left">Supplier</th>
              <th className="p-3 text-center">Date</th>
              <th className="p-3 text-right">Amount</th>
              <th className="p-3 text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredBills.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-6 text-center text-slate-400">
                  No purchase bills found
                </td>
              </tr>
            ) : (
              filteredBills.map(bill => (
                <tr key={bill.id} className="border-b hover:bg-slate-50">
                  <td className="p-3 flex items-center gap-2 font-medium">
                    <FileText size={14} /> {bill.billNo}
                  </td>
                  <td className="p-3">{bill.supplier}</td>
                  <td className="p-3 text-center">{bill.billDate}</td>
                  <td className="p-3 text-right font-semibold flex justify-end gap-1">
                    <IndianRupee size={14} /> {bill.total}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        bill.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-700'
                          : bill.status === 'Overdue'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {bill.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* TOTAL SUMMARY */}
      <div className="flex justify-end text-sm font-semibold text-slate-700">
        Total Amount:&nbsp;
        <span className="flex items-center gap-1">
          <IndianRupee size={14} /> {totalAmount}
        </span>
      </div>
    </div>
  );
};

export default PurchaseBillsView;
