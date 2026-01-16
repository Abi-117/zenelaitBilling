import ReportHeader from '../../common/ReportHeader';

const StockReportsView = () => {
  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-4">
      <ReportHeader title="Stock Report" />

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-slate-500">
            <th className="text-left py-2">Item</th>
            <th>Stock</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="py-2 font-medium">Product A</td>
            <td>120</td>
            <td className="text-green-600">Fast Moving</td>
          </tr>
          <tr>
            <td className="py-2 font-medium">Product B</td>
            <td>5</td>
            <td className="text-amber-600">Slow Moving</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default StockReportsView;
