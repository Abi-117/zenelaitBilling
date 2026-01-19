import { useState } from 'react';
import Card from '../../../ui/Card';
import { AlertTriangle } from 'lucide-react';

const StockAdjustmentView = () => {
  const [form, setForm] = useState({
    item: '',
    qty: '',
    type: 'decrease',
    reason: '',
  });

  // Sample stock items with current quantity
  const [stockItems, setStockItems] = useState([
    { name: 'Paracetamol 500mg', qty: 120 },
    { name: 'Amoxicillin 250mg', qty: 80 },
    { name: 'Vitamin C Tablets', qty: 60 },
    { name: 'Cough Syrup 100ml', qty: 30 },
  ]);

  const [adjustmentLogs, setAdjustmentLogs] = useState([]);

  const submitAdjustment = () => {
    if (!form.item || !form.qty) {
      alert('Please select item and quantity');
      return;
    }

    const quantity = Number(form.qty);
    const stockIndex = stockItems.findIndex(s => s.name === form.item);

    if (stockIndex === -1) return alert('Item not found');

    let newQty =
      form.type === 'increase'
        ? stockItems[stockIndex].qty + quantity
        : stockItems[stockIndex].qty - quantity;

    if (newQty < 0) newQty = 0;

    // Update stock
    const updatedStock = [...stockItems];
    updatedStock[stockIndex] = { ...updatedStock[stockIndex], qty: newQty };
    setStockItems(updatedStock);

    // Add to adjustment log
    setAdjustmentLogs([
      {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        item: form.item,
        type: form.type,
        qty: quantity,
        reason: form.reason || '-',
        updatedQty: newQty,
      },
      ...adjustmentLogs,
    ]);

    alert('Stock adjusted successfully');
    setForm({ item: '', qty: '', type: 'decrease', reason: '' });
  };

  return (
    <div className="space-y-6">

      {/* Adjustment Form */}
      <Card>
        <h3 className="font-semibold mb-4">Stock Adjustment</h3>

        <div className="grid grid-cols-4 gap-4">
          <select
            className="input"
            value={form.item}
            onChange={e => setForm({ ...form, item: e.target.value })}
          >
            <option value="">Select Item</option>
            {stockItems.map(i => (
              <option key={i.name}>{i.name}</option>
            ))}
          </select>

          <input
            type="number"
            className="input"
            placeholder="Quantity"
            value={form.qty}
            onChange={e => setForm({ ...form, qty: e.target.value })}
          />

          <select
            className="input"
            value={form.type}
            onChange={e => setForm({ ...form, type: e.target.value })}
          >
            <option value="increase">Increase</option>
            <option value="decrease">Decrease</option>
          </select>

          <input
            className="input"
            placeholder="Reason"
            value={form.reason}
            onChange={e => setForm({ ...form, reason: e.target.value })}
          />
        </div>

        <div className="mt-4 text-right">
          <button
            onClick={submitAdjustment}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Apply Adjustment
          </button>
        </div>
      </Card>

      {/* Current Stock */}
      <Card>
        <h3 className="font-semibold mb-4">Current Stock</h3>

        <table className="w-full text-sm border-collapse">
          <thead className="border-b text-slate-500 text-left">
            <tr>
              <th className="py-2">Item</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {stockItems.map((s, i) => (
              <tr key={i} className="border-b last:border-0">
                <td className="py-2">{s.name}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      s.qty === 0
                        ? 'bg-red-100 text-red-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {s.qty}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Adjustment History */}
      <Card>
        <h3 className="font-semibold mb-4">Adjustment History</h3>

        <table className="w-full text-sm border-collapse">
          <thead className="border-b text-slate-500 text-left">
            <tr>
              <th className="py-2">Date</th>
              <th>Item</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Reason</th>
              <th>Updated Qty</th>
            </tr>
          </thead>
          <tbody>
            {adjustmentLogs.map(log => (
              <tr key={log.id} className="border-b last:border-0 hover:bg-slate-50 transition">
                <td className="py-2">{log.date}</td>
                <td>{log.item}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      log.type === 'increase'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {log.type.toUpperCase()}
                  </span>
                </td>
                <td>{log.qty}</td>
                <td>{log.reason}</td>
                <td>{log.updatedQty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

    </div>
  );
};

export default StockAdjustmentView;
