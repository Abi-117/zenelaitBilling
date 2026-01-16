import { useState } from 'react';
import Card from '../../../ui/Card';
import { AlertTriangle } from 'lucide-react';

const BatchManagementView = () => {
  const [form, setForm] = useState({
    item: '',
    batchNo: '',
    expiry: '',
    quantity: '',
    cost: '',
  });

  const [batches, setBatches] = useState([
    {
      id: 1,
      item: 'Paracetamol 500mg',
      batchNo: 'PCM-1024',
      expiry: '2026-10-31',
      quantity: 100,
      cost: 1.25,
    },
  ]);

  const items = [
    'Paracetamol 500mg',
    'Amoxicillin 250mg',
    'Vitamin C Tablets',
  ];

  const addBatch = () => {
    if (!form.item || !form.batchNo || !form.expiry || !form.quantity) return;

    setBatches([
      {
        id: Date.now(),
        ...form,
        quantity: Number(form.quantity),
        cost: Number(form.cost),
      },
      ...batches,
    ]);

    setForm({
      item: '',
      batchNo: '',
      expiry: '',
      quantity: '',
      cost: '',
    });
  };

  const isExpired = date => new Date(date) < new Date();

  return (
    <div className="space-y-6">

      {/* Add Batch */}
      <Card>
        <h3 className="font-semibold mb-4">Add Batch</h3>

        <div className="grid grid-cols-5 gap-4">
          <select
            className="input"
            value={form.item}
            onChange={e => setForm({ ...form, item: e.target.value })}
          >
            <option value="">Item</option>
            {items.map(item => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <input
            className="input"
            placeholder="Batch No"
            value={form.batchNo}
            onChange={e => setForm({ ...form, batchNo: e.target.value })}
          />

          <input
            type="date"
            className="input"
            value={form.expiry}
            onChange={e => setForm({ ...form, expiry: e.target.value })}
          />

          <input
            type="number"
            className="input"
            placeholder="Qty"
            value={form.quantity}
            onChange={e => setForm({ ...form, quantity: e.target.value })}
          />

          <input
            type="number"
            className="input"
            placeholder="Cost"
            value={form.cost}
            onChange={e => setForm({ ...form, cost: e.target.value })}
          />
        </div>

        <div className="mt-4 text-right">
          <button
            onClick={addBatch}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Batch
          </button>
        </div>
      </Card>

      {/* Batch List */}
      <Card>
        <h3 className="font-semibold mb-4">Batch Inventory</h3>

        <table className="w-full text-sm">
          <thead className="text-left text-slate-500 border-b">
            <tr>
              <th className="py-2">Item</th>
              <th>Batch</th>
              <th>Expiry</th>
              <th>Qty</th>
              <th>Cost</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {batches.map(batch => {
              const expired = isExpired(batch.expiry);

              return (
                <tr key={batch.id} className="border-b last:border-0">
                  <td className="py-2">{batch.item}</td>
                  <td>{batch.batchNo}</td>
                  <td>{batch.expiry}</td>
                  <td>{batch.quantity}</td>
                  <td>₹{batch.cost}</td>
                  <td>
                    {expired ? (
                      <span className="flex items-center gap-1 text-red-600 text-xs font-semibold">
                        <AlertTriangle size={14} /> Expired
                      </span>
                    ) : (
                      <span className="text-green-600 text-xs font-semibold">
                        Active
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

    </div>
  );
};

export default BatchManagementView;
