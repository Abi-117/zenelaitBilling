import { useState } from 'react';
import Card from '../../../ui/Card';
import { AlertTriangle, Trash2, Edit } from 'lucide-react';

const BatchManagementView = () => {
  const [form, setForm] = useState({
    item: '',
    batchNo: '',
    expiry: '',
    quantity: '',
    cost: '',
  });

  const [batches, setBatches] = useState([
    { id: 1, item: 'Paracetamol 500mg', batchNo: 'PCM-1024', expiry: '2026-10-31', quantity: 100, cost: 1.25 },
    { id: 2, item: 'Amoxicillin 250mg', batchNo: 'AMX-2048', expiry: '2026-08-15', quantity: 50, cost: 2.0 },
    { id: 3, item: 'Vitamin C Tablets', batchNo: 'VTC-3001', expiry: '2025-12-30', quantity: 80, cost: 0.75 },
  ]);

  const [editingBatch, setEditingBatch] = useState(null);

  const items = [
    'Paracetamol 500mg',
    'Amoxicillin 250mg',
    'Vitamin C Tablets',
    'Cough Syrup 100ml',
    'Ibuprofen 400mg',
  ];

  const isExpired = (date) => new Date(date) < new Date();

  const addOrUpdateBatch = () => {
    if (!form.item || !form.batchNo || !form.expiry || !form.quantity || !form.cost) {
      return alert('Please fill all fields');
    }

    if (editingBatch) {
      setBatches(batches.map(b => b.id === editingBatch.id ? { ...form, id: editingBatch.id } : b));
      setEditingBatch(null);
    } else {
      setBatches([{ ...form, id: Date.now(), quantity: Number(form.quantity), cost: Number(form.cost) }, ...batches]);
    }

    setForm({ item: '', batchNo: '', expiry: '', quantity: '', cost: '' });
  };

  const editBatch = (batch) => {
    setForm(batch);
    setEditingBatch(batch);
  };

  const deleteBatch = (id) => {
    if (confirm('Are you sure you want to delete this batch?')) {
      setBatches(batches.filter(b => b.id !== id));
    }
  };

  return (
    <div className="space-y-6">

      {/* Add / Edit Batch */}
      <Card>
        <h3 className="font-semibold mb-4">{editingBatch ? 'Edit Batch' : 'Add Batch'}</h3>
        <div className="grid grid-cols-5 gap-4">
          <select className="input" value={form.item} onChange={e => setForm({ ...form, item: e.target.value })}>
            <option value="">Item</option>
            {items.map(i => <option key={i}>{i}</option>)}
          </select>

          <input className="input" placeholder="Batch No" value={form.batchNo} onChange={e => setForm({ ...form, batchNo: e.target.value })} />
          <input type="date" className="input" value={form.expiry} onChange={e => setForm({ ...form, expiry: e.target.value })} />
          <input type="number" className="input" placeholder="Qty" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
          <input type="number" className="input" placeholder="Cost" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} />
        </div>

        <div className="mt-4 text-right">
          <button
            onClick={addOrUpdateBatch}
            className={`px-4 py-2 rounded text-white ${editingBatch ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {editingBatch ? 'Update Batch' : 'Add Batch'}
          </button>
        </div>
      </Card>

      {/* Batch Inventory Table */}
      <Card>
        <h3 className="font-semibold mb-4">Batch Inventory</h3>
        <table className="w-full text-sm border-collapse">
          <thead className="text-left text-slate-500 border-b">
            <tr>
              <th className="py-2">Item</th>
              <th>Batch</th>
              <th>Expiry</th>
              <th>Qty</th>
              <th>Cost</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {batches.map(batch => {
              const expired = isExpired(batch.expiry);
              return (
                <tr key={batch.id} className="border-b last:border-0 hover:bg-slate-50 transition">
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
                      <span className="text-green-600 text-xs font-semibold">Active</span>
                    )}
                  </td>
                  <td className="space-x-2">
                    <button className="text-blue-600 hover:bg-blue-50 p-1 rounded" onClick={() => editBatch(batch)}>
                      <Edit size={14} />
                    </button>
                    <button className="text-rose-500 hover:bg-rose-50 p-1 rounded" onClick={() => deleteBatch(batch.id)}>
                      <Trash2 size={14} />
                    </button>
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
