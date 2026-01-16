import ReportHeader from '../../common/ReportHeader';

const OutstandingReportsView = () => {
  return (
    <div className="space-y-6">

      {/* Outstanding Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Outstanding', value: '₹2,45,700' },
          { label: '0–30 Days', value: '₹1,32,400' },
          { label: '31–60 Days', value: '₹74,300' },
          { label: '60+ Days', value: '₹39,000' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-6">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Outstanding Table */}
      <div className="bg-white rounded-xl shadow p-6">
        <ReportHeader title="Outstanding Invoices" />

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-slate-500">
              <th className="text-left py-2">Customer</th>
              <th className="text-left">Invoice No</th>
              <th className="text-left">Invoice Date</th>
              <th className="text-left">Due Date</th>
              <th className="text-right">Invoice Amount</th>
              <th className="text-right">Outstanding</th>
              <th className="text-left">Age</th>
              <th className="text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b">
              <td className="py-3 font-medium">Acme Corp</td>
              <td>INV-2031</td>
              <td>05 Jan 2026</td>
              <td>20 Jan 2026</td>
              <td className="text-right">₹48,500</td>
              <td className="text-right font-semibold">₹48,500</td>
              <td>18 days</td>
              <td className="text-amber-600 font-medium">Pending</td>
            </tr>

            <tr className="border-b">
              <td className="py-3 font-medium">Globex Pvt Ltd</td>
              <td>INV-1984</td>
              <td>12 Dec 2025</td>
              <td>27 Dec 2025</td>
              <td className="text-right">₹32,800</td>
              <td className="text-right font-semibold">₹32,800</td>
              <td>42 days</td>
              <td className="text-orange-600 font-medium">Overdue</td>
            </tr>

            <tr>
              <td className="py-3 font-medium">Zenith Solutions</td>
              <td>INV-1842</td>
              <td>20 Nov 2025</td>
              <td>05 Dec 2025</td>
              <td className="text-right">₹39,000</td>
              <td className="text-right font-semibold">₹39,000</td>
              <td>68 days</td>
              <td className="text-rose-600 font-medium">Critical</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OutstandingReportsView;
