import ReportHeader from '../../common/ReportHeader';

const ExpenseReportsView = () => {
  return (
    <div className="space-y-6">

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Expenses', value: '₹2,35,400' },
          { label: 'This Month', value: '₹48,200' },
          { label: 'Pending Payments', value: '₹12,600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-6">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Expense Table */}
      <div className="bg-white rounded-xl shadow p-6">
        <ReportHeader title="Expense Report" />

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-slate-500">
              <th className="text-left py-2">Date</th>
              <th className="text-left">Category</th>
              <th className="text-left">Description</th>
              <th className="text-right">Amount</th>
              <th className="text-left">Payment Mode</th>
              <th className="text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-3">12 Jan 2026</td>
              <td>Office Rent</td>
              <td>January Rent</td>
              <td className="text-right font-medium">₹35,000</td>
              <td>Bank Transfer</td>
              <td className="text-green-600 font-medium">Paid</td>
            </tr>

            <tr className="border-b">
              <td className="py-3">18 Jan 2026</td>
              <td>Internet</td>
              <td>Broadband Bill</td>
              <td className="text-right font-medium">₹2,400</td>
              <td>UPI</td>
              <td className="text-green-600 font-medium">Paid</td>
            </tr>

            <tr>
              <td className="py-3">22 Jan 2026</td>
              <td>Marketing</td>
              <td>Google Ads</td>
              <td className="text-right font-medium">₹10,600</td>
              <td>Credit Card</td>
              <td className="text-amber-600 font-medium">Pending</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseReportsView;
