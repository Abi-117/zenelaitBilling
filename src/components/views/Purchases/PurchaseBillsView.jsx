import { FileText } from 'lucide-react';

const PurchaseBillsView = ({ bills = [] }) => {
  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-100 text-slate-600">
          <tr>
            <th className="p-3 text-left">Bill No</th>
            <th className="p-3">Supplier</th>
            <th className="p-3">Date</th>
            <th className="p-3 text-right">Amount</th>
          </tr>
        </thead>

        <tbody>
          {bills.length === 0 ? (
            <tr>
              <td colSpan="4" className="p-6 text-center text-slate-400">
                No purchase bills found
              </td>
            </tr>
          ) : (
            bills.map((bill) => (
              <tr key={bill.id} className="border-b hover:bg-slate-50">
                <td className="p-3 flex items-center gap-2">
                  <FileText size={14} />
                  {bill.billNo}
                </td>
                <td className="p-3">{bill.supplier}</td>
                <td className="p-3">{bill.date}</td>
                <td className="p-3 text-right">₹{bill.total}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseBillsView;
