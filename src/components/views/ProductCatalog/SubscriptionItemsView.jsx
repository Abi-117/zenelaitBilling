import { useState } from 'react';
import { Plus, RefreshCw, Trash2 } from 'lucide-react';
import Card from '../../ui/Card';

const SubscriptionItemsView = () => {
  const [plans, setPlans] = useState([
    { id: 1, name: 'Basic Plan', price: 999, interval: 'Monthly', status: 'Active' },
    { id: 2, name: 'Pro Plan', price: 2499, interval: 'Monthly', status: 'Active' },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    interval: 'Monthly',
    status: 'Active',
  });

  const openNewModal = () => {
    setEditingPlan(null);
    setFormData({ name: '', price: '', interval: 'Monthly', status: 'Active' });
    setModalOpen(true);
  };

  const openEditModal = (plan) => {
    setEditingPlan(plan);
    setFormData(plan);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this subscription?')) {
      setPlans(plans.filter(p => p.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return alert('Please fill all fields');

    if (editingPlan) {
      setPlans(plans.map(p => (p.id === editingPlan.id ? formData : p)));
    } else {
      setPlans([...plans, { ...formData, id: Date.now() }]);
    }

    setModalOpen(false);
  };

  return (
    <div className="space-y-6 p-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Subscription Items</h2>
          <p className="text-slate-500 text-sm">Manage recurring products & plans</p>
        </div>

        <button
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
          onClick={openNewModal}
        >
          <Plus size={16} />
          <span>New Subscription</span>
        </button>
      </div>

      {/* Plans List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-800">{plan.name}</h3>
                <p className="text-xs text-slate-500">
                  ₹{plan.price} / {plan.interval}
                </p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${plan.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                {plan.status}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t">
              <button
                className="text-blue-600 text-sm flex items-center space-x-1"
                onClick={() => openEditModal(plan)}
              >
                <RefreshCw size={14} />
                <span>Edit</span>
              </button>

              <button
                className="text-rose-500 hover:bg-rose-50 p-2 rounded"
                onClick={() => handleDelete(plan.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editingPlan ? 'Edit Subscription' : 'New Subscription'}</h2>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Plan Name"
                className="w-full border px-3 py-2 rounded"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
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
              <select
                className="w-full border px-3 py-2 rounded"
                value={formData.interval}
                onChange={e => setFormData({ ...formData, interval: e.target.value })}
              >
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Yearly">Yearly</option>
              </select>
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
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">{editingPlan ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default SubscriptionItemsView;
