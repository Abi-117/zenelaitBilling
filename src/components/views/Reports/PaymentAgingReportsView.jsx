const PaymentAgingReportsView = () => {
  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-4">
      <h2 className="text-lg font-bold">Payment & Aging Report</h2>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500 border-b">
            <th>Customer</th>
            <th>0–30 Days</th>
            <th>31–60 Days</th>
            <th>61–90 Days</th>
            <th>90+ Days</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="py-3 font-medium">Acme Corp</td>
            <td>₹25,000</td>
            <td>₹8,000</td>
            <td>₹0</td>
            <td>₹0</td>
          </tr>
          <tr>
            <td className="py-3 font-medium">Globex</td>
            <td>₹10,500</td>
            <td>₹6,200</td>
            <td>₹3,000</td>
            <td>₹1,200</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PaymentAgingReportsView;
