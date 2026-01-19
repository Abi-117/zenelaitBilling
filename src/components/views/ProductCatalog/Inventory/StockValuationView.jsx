import { useState } from 'react';
import Card from '../../../ui/Card';
import { Plus, Edit, Trash2 } from 'lucide-react';

const StockValuationView = () => {
  const [inventory, setInventory] = useState([
    { id: 1, item: 'Paracetamol 500mg', qty: 200, fifoValue: 260, avgCostValue: 250 },
    { id: 2, item: 'Amoxicillin', qty: 120, fifoValue: 180, avgCostValue: 175 },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({
    item: '',
    qty: '',
    fifoValue: '',
    avgCostValue: '',
  });

  // Open Add Modal
  const openNewItemModal = () => {
    setEditingItem(null);
    setForm({ item: '', qty: '', fifoValue: '', avgCostValue: '' });
    setModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = item => {
    setEditingItem(item);
    setForm(item);
    setModalOpen(true);
  };

  // Delete item
  const handleDelete = id => {
    if (confirm('Are you sure you want to delete this item?')) {
      setInventory(prev => prev.filter(i => i.id !== id));
    }
  };

  // Submit Add/Edit Form
  const handleSubmit = e => {
    e.preventDefault();
    if (!form.item || !form.qty || !form.fifoValue || !form.avgCostValue)
      return alert('Please fill all fields');

    if (editingItem) {
      setInventory(prev =>
        prev.map(i => (i.id === editingItem.id ? { ...form, id: i.id } : i))
      );
    } else {
      setInventory([...inventory, { ...form, id: Date.now() }]);
    }
    setModalOpen(false);
  };

  // Totals
  const totalFIFO = inventory.reduce((sum, i) => sum + i.fifoValue * i.qty, 0);
  const totalAvg = inventory.reduce((sum, i) => sum + i.avgCostValue * i.qty, 0);

  return (
    <div className="space-y-6 p-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Stock Valuation</h2>
          <p className="text-sm text-slate-500">Manage inventory values and stock</p>
        </div>
        <button
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
          onClick={openNewItemModal}
        >
          <Plus size={16} />
          <span>New Item</span>
        </button>
      </div>

      {/* Inventory Table */}
      <Card>
        <table className="w-full text-sm">
          <thead className="border-b text-left text-slate-500">
            <tr>
              <th className="p-2">Item</th>
              <th className="p-2 text-center">Qty</th>
              <th className="p-2 text-center">FIFO Value</th>
              <th className="p-2 text-center">Avg Cost Value</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(i => (
              <tr key={i.id} className="border-b hover:bg-slate-50 transition">
                <td className="p-2 font-medium">{i.item}</td>
                <td className="p-2 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${i.qty < 50 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                    {i.qty}
                  </span>
                </td>
                <td className="p-2 text-center">₹{i.fifoValue}</td>
                <td className="p-2 text-center">₹{i.avgCostValue}</td>
                <td className="p-2 text-center space-x-2">
                  <button
                    className="text-blue-600 hover:bg-blue-50 p-1 rounded"
                    onClick={() => openEditModal(i)}
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    className="text-rose-500 hover:bg-rose-50 p-1 rounded"
                    onClick={() => handleDelete(i.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}

            {/* Totals */}
            <tr className="font-bold bg-slate-100">
              <td className="p-2">Total</td>
              <td className="p-2 text-center">{inventory.reduce((s, i) => s + i.qty, 0)}</td>
              <td className="p-2 text-center">₹{totalFIFO}</td>
              <td className="p-2 text-center">₹{totalAvg}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </Card>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editingItem ? 'Edit Item' : 'New Item'}</h2>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Item Name"
                className="w-full border px-3 py-2 rounded"
                value={form.item}
                onChange={e => setForm({ ...form, item: e.target.value })}
              />
              <input
                type="number"
                placeholder="Quantity"
                className="w-full border px-3 py-2 rounded"
                value={form.qty}
                onChange={e => setForm({ ...form, qty: Number(e.target.value) })}
              />
              <input
                type="number"
                placeholder="FIFO Value"
                className="w-full border px-3 py-2 rounded"
                value={form.fifoValue}
                onChange={e => setForm({ ...form, fifoValue: Number(e.target.value) })}
              />
              <input
                type="number"
                placeholder="Avg Cost Value"
                className="w-full border px-3 py-2 rounded"
                value={form.avgCostValue}
                onChange={e => setForm({ ...form, avgCostValue: Number(e.target.value) })}
              />
              <div className="flex justify-end space-x-2 mt-4">
                <button type="button" className="px-4 py-2 rounded bg-gray-200" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">{editingItem ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default StockValuationView;
