import { useState } from 'react';
import { Plus, Edit, Trash2, Package } from 'lucide-react';

const ItemsView = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'Consultation Service', type: 'Service', price: 1500, hsn: '9983', tax: 18, status: 'Active' },
    { id: 2, name: 'Software License', type: 'Product', price: 4500, hsn: '8523', tax: 18, status: 'Active' },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Service',
    hsn: '',
    price: '',
    tax: 0,
    status: 'Active',
  });

  const openNewItemModal = () => {
    setEditingItem(null);
    setFormData({ name: '', type: 'Service', hsn: '', price: '', tax: 0, status: 'Active' });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData(item);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.hsn || !formData.price) return alert('Please fill all fields');

    if (editingItem) {
      setItems(items.map(item => (item.id === editingItem.id ? formData : item)));
    } else {
      setItems([...items, { ...formData, id: Date.now() }]);
    }

    setModalOpen(false);
  };

  return (
    <div className="space-y-6 p-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Items</h2>
          <p className="text-sm text-slate-500">Manage products and services</p>
        </div>
        <button
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
          onClick={openNewItemModal}
        >
          <Plus size={16} />
          <span>New Item</span>
        </button>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="p-3 text-left">Item Name</th>
              <th className="p-3 text-center">Type</th>
              <th className="p-3 text-center">HSN</th>
              <th className="p-3 text-center">Price</th>
              <th className="p-3 text-center">GST</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>

          <tbody>
  {items.map((item) => (
    <tr
      key={item.id}
      className="border-b hover:bg-slate-50 transition cursor-pointer"
      onClick={() => onSelectProduct && onSelectProduct(item)}
    >
      <td className="p-3 font-medium flex items-center space-x-2">
        <Package size={16} className="text-slate-400" />
        <span>{item.name}</span>
      </td>
      <td className="p-3 text-center">{item.type}</td>
      <td className="p-3 text-center">{item.hsn}</td>
      <td className="p-3 text-center">₹{item.price}</td>
      <td className="p-3 text-center">{item.tax}%</td>
      <td className="p-3 text-center">
        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${item.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
          {item.status}
        </span>
      </td>
      <td className="p-3 text-right space-x-2">
        <button className="text-blue-600 hover:bg-blue-50 p-2 rounded" onClick={(e) => { e.stopPropagation(); openEditModal(item); }}>
          <Edit size={14} />
        </button>
        <button className="text-rose-500 hover:bg-rose-50 p-2 rounded" onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}>
          <Trash2 size={14} />
        </button>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>

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
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <select
                className="w-full border px-3 py-2 rounded"
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="Service">Service</option>
                <option value="Product">Product</option>
              </select>
              <input
                type="text"
                placeholder="HSN"
                className="w-full border px-3 py-2 rounded"
                value={formData.hsn}
                onChange={e => setFormData({ ...formData, hsn: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Price"
                className="w-full border px-3 py-2 rounded"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                required
              />
              <input
                type="number"
                placeholder="GST %"
                className="w-full border px-3 py-2 rounded"
                value={formData.tax}
                onChange={e => setFormData({ ...formData, tax: Number(e.target.value) })}
                required
              />
              <select
                className="w-full border px-3 py-2 rounded"
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

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

export default ItemsView;
