import ReportHeader from '../../common/ReportHeader';

const LedgerReportsView = () => {
  return (
    <div className="space-y-6">

      {/* Ledger Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Debit', value: '₹3,85,600' },
          { label: 'Total Credit', value: '₹4,72,900' },
          { label: 'Closing Balance', value: '₹87,300' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-6">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-xl shadow p-6">
        <ReportHeader title="Ledger Report" />

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-slate-500">
              <th className="text-left py-2">Date</th>
              <th className="text-left">Reference</th>
              <th className="text-left">Description</th>
              <th className="text-right">Debit</th>
              <th className="text-right">Credit</th>
              <th className="text-right">Balance</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b">
              <td className="py-3">01 Jan 2026</td>
              <td>INV-1023</td>
              <td>Invoice Generated</td>
              <td className="text-right">₹0</td>
              <td className="text-right font-medium">₹18,500</td>
              <td className="text-right font-semibold">₹18,500</td>
            </tr>

            <tr className="border-b">
              <td className="py-3">05 Jan 2026</td>
              <td>PAY-458</td>
              <td>Payment Received</td>
              <td className="text-right">₹0</td>
              <td className="text-right font-medium">₹18,500</td>
              <td className="text-right font-semibold">₹37,000</td>
            </tr>

            <tr className="border-b">
              <td className="py-3">12 Jan 2026</td>
              <td>EXP-212</td>
              <td>Office Expense</td>
              <td className="text-right font-medium">₹4,200</td>
              <td className="text-right">₹0</td>
              <td className="text-right font-semibold">₹32,800</td>
            </tr>

            <tr>
              <td className="py-3">18 Jan 2026</td>
              <td>INV-1055</td>
              <td>Invoice Generated</td>
              <td className="text-right">₹0</td>
              <td className="text-right font-medium">₹54,500</td>
              <td className="text-right font-semibold">₹87,300</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LedgerReportsView;
