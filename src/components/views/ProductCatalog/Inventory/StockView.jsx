import { useState } from 'react';
import Card from '../../../ui/Card';

const StockView = () => {
  const [mode, setMode] = useState('in'); // in | out

  const [form, setForm] = useState({
    item: '',
    quantity: '',
    reason: '',
    notes: '',
  });

  const [stockLogs, setStockLogs] = useState([
    {
      id: 1,
      date: '2026-01-10',
      item: 'Paracetamol 500mg',
      type: 'IN',
      quantity: 100,
      reason: 'Opening Stock',
    },
  ]);

  const items = [
    'Paracetamol 500mg',
    'Amoxicillin 250mg',
    'Vitamin C Tablets',
  ];

  const submitStock = () => {
    if (!form.item || !form.quantity || !form.reason) return;

    const log = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      item: form.item,
      type: mode.toUpperCase(),
      quantity: Number(form.quantity),
      reason: form.reason,
    };

    setStockLogs([log, ...stockLogs]);
    setForm({ item: '', quantity: '', reason: '', notes: '' });
  };

  return (
    <div className="space-y-6">

      {/* Mode Switch */}
      <div className="flex gap-3">
        <button
          onClick={() => setMode('in')}
          className={`px-4 py-2 rounded font-medium ${
            mode === 'in'
              ? 'bg-green-600 text-white'
              : 'bg-slate-100 text-slate-700'
          }`}
        >
          Stock In
        </button>

        <button
          onClick={() => setMode('out')}
          className={`px-4 py-2 rounded font-medium ${
            mode === 'out'
              ? 'bg-red-600 text-white'
              : 'bg-slate-100 text-slate-700'
          }`}
        >
          Stock Out
        </button>
      </div>

      {/* Stock Form */}
      <Card>
        <h3 className="font-semibold mb-4">
          {mode === 'in' ? 'Add Stock' : 'Remove Stock'}
        </h3>

        <div className="grid grid-cols-4 gap-4">
          <select
            className="input"
            value={form.item}
            onChange={e => setForm({ ...form, item: e.target.value })}
          >
            <option value="">Select Item</option>
            {items.map(item => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <input
            type="number"
            className="input"
            placeholder="Quantity"
            value={form.quantity}
            onChange={e => setForm({ ...form, quantity: e.target.value })}
          />

          <select
            className="input"
            value={form.reason}
            onChange={e => setForm({ ...form, reason: e.target.value })}
          >
            <option value="">Reason</option>
            <option>Purchase</option>
            <option>Sale</option>
            <option>Adjustment</option>
            <option>Damage</option>
            <option>Opening Stock</option>
          </select>

          <button
            onClick={submitStock}
            className={`rounded px-4 py-2 text-white ${
              mode === 'in' ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            {mode === 'in' ? 'Add Stock' : 'Remove Stock'}
          </button>
        </div>

        <textarea
          className="input mt-4"
          placeholder="Notes (optional)"
          value={form.notes}
          onChange={e => setForm({ ...form, notes: e.target.value })}
        />
      </Card>

      {/* Stock History */}
      <Card>
        <h3 className="font-semibold mb-4">Stock History</h3>

        <table className="w-full text-sm">
          <thead className="text-left text-slate-500 border-b">
            <tr>
              <th className="py-2">Date</th>
              <th>Item</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {stockLogs.map(log => (
              <tr key={log.id} className="border-b last:border-0">
                <td className="py-2">{log.date}</td>
                <td>{log.item}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      log.type === 'IN'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {log.type}
                  </span>
                </td>
                <td>{log.quantity}</td>
                <td>{log.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

    </div>
  );
};

export default StockView;
