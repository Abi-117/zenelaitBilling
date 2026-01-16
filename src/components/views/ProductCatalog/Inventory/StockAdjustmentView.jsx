import { useState } from 'react';
import Card from '../../../ui/Card';

const StockAdjustmentView = () => {
  const [form, setForm] = useState({
    item: '',
    qty: '',
    type: 'decrease',
    reason: '',
  });

  const items = ['Paracetamol 500mg', 'Amoxicillin'];

  const submitAdjustment = () => {
    if (!form.item || !form.qty) return;
    alert('Stock adjusted successfully');
    setForm({ item: '', qty: '', type: 'decrease', reason: '' });
  };

  return (
    <Card>
      <h3 className="font-semibold mb-4">Stock Adjustment</h3>

      <div className="grid grid-cols-4 gap-4">
        <select
          className="input"
          value={form.item}
          onChange={e => setForm({ ...form, item: e.target.value })}
        >
          <option value="">Item</option>
          {items.map(i => (
            <option key={i}>{i}</option>
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
  );
};

export default StockAdjustmentView;
