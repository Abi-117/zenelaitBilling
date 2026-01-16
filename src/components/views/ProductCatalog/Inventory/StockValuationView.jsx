import Card from '../../../ui/Card';

const StockValuationView = () => {
  const inventory = [
    {
      item: 'Paracetamol 500mg',
      qty: 200,
      fifoValue: 260,
      avgCostValue: 250,
    },
    {
      item: 'Amoxicillin',
      qty: 120,
      fifoValue: 180,
      avgCostValue: 175,
    },
  ];

  return (
    <Card>
      <h3 className="font-semibold mb-4">Stock Valuation</h3>

      <table className="w-full text-sm">
        <thead className="border-b text-left text-slate-500">
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>FIFO Value</th>
            <th>Avg Cost Value</th>
          </tr>
        </thead>

        <tbody>
          {inventory.map((row, i) => (
            <tr key={i} className="border-b last:border-0">
              <td className="py-2">{row.item}</td>
              <td>{row.qty}</td>
              <td>₹{row.fifoValue}</td>
              <td>₹{row.avgCostValue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};

export default StockValuationView;
