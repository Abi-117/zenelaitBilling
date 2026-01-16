import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Edit, Trash2 } from 'lucide-react';
import Card from '../ui/Card';

const EstimatesView = () => {
  const navigate = useNavigate();

  const [estimates, setEstimates] = useState([
    { id: 'EST-9110', customer: 'Anissa', amount: 373, status: 'Expired', date: '2025-12-05', viewed: true },
    { id: 'EST-99439', customer: 'Theresia', amount: 403, status: 'Expired', date: '2026-01-02', viewed: false },
    { id: 'EST-94964', customer: 'Darrin', amount: 467, status: 'Invoiced', date: '2025-12-03', viewed: true },
    { id: 'EST-60533', customer: 'Kennedi', amount: 521, status: 'Invoiced', date: '2025-05-13', viewed: true },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEstimate, setEditingEstimate] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    customer: '',
    amount: '',
    status: 'Draft',
    date: '',
    viewed: false,
  });

  const [selectedEstimate, setSelectedEstimate] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  // Modal handlers
  const openNewModal = () => {
    setEditingEstimate(null);
    setFormData({ id: `EST-${Date.now()}`, customer: '', amount: '', status: 'Draft', date: new Date().toISOString().split('T')[0], viewed: false });
    setModalOpen(true);
  };

  const openEditModal = (estimate) => {
    setEditingEstimate(estimate);
    setFormData(estimate);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this estimate?')) {
      setEstimates(estimates.filter(e => e.id !== id));
      if (selectedEstimate?.id === id) setSelectedEstimate(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customer || !formData.amount) return alert('Please fill all fields');

    if (editingEstimate) {
      setEstimates(estimates.map(e => (e.id === editingEstimate.id ? formData : e)));
      if (selectedEstimate?.id === editingEstimate.id) setSelectedEstimate(formData);
    } else {
      setEstimates([...estimates, formData]);
    }

    setModalOpen(false);
  };

  // Bulk selection
  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(sid => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === estimates.length) setSelectedIds([]);
    else setSelectedIds(estimates.map(e => e.id));
  };

  // Right panel actions
  const handleConvertInvoice = () => {
    if (!selectedEstimate) return;
    navigate(`/invoices/new/${selectedEstimate.id}`);
  };

  const handleCreateProject = () => {
    if (!selectedEstimate) return;
    navigate(`/projects/new/${selectedEstimate.id}`);
  };

  return (
    <div className="flex space-x-6 p-6 animate-fadeIn">

      {/* Left Table */}
      <div className="w-2/3 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">Estimates / Quotes</h2>
          <button
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
            onClick={openNewModal}
          >
            <Plus size={16} />
            <span>New Estimate</span>
          </button>
        </div>

        {/* Table */}
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="p-4">
                  <input type="checkbox" checked={selectedIds.length === estimates.length} onChange={toggleSelectAll} />
                </th>
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-right">Amount</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {estimates.map(est => (
                <tr
                  key={est.id}
                  className={`border-t hover:bg-slate-50 transition cursor-pointer ${selectedEstimate?.id === est.id ? 'bg-blue-50' : ''}`}
                  onClick={() => setSelectedEstimate(est)}
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(est.id)}
                      onChange={e => { e.stopPropagation(); toggleSelect(est.id); }}
                    />
                  </td>
                  <td className="p-4 font-medium flex items-center space-x-2">
                    <FileText size={14} className="text-slate-400" />
                    <span>{est.id}</span>
                  </td>
                  <td className="p-4">{est.customer}</td>
                  <td className="p-4 text-right font-semibold">₹{est.amount}</td>
                  <td className="p-4">{est.date}</td>
                  <td className="p-4 text-center">
                    <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                      est.status === 'Sent' ? 'bg-blue-100 text-blue-700' :
                      est.status === 'Draft' ? 'bg-gray-100 text-gray-700' :
                      est.status === 'Expired' ? 'bg-rose-100 text-rose-700' :
                      est.status === 'Invoiced' ? 'bg-green-100 text-green-700' : ''
                    }`}>
                      {est.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button className="text-blue-600 hover:bg-blue-50 p-2 rounded" onClick={e => { e.stopPropagation(); openEditModal(est); }}>
                      <Edit size={14} />
                    </button>
                    <button className="text-rose-500 hover:bg-rose-50 p-2 rounded" onClick={e => { e.stopPropagation(); handleDelete(est.id); }}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Right Detail Panel */}
      {selectedEstimate && (
        <div className="w-1/3 bg-white rounded-xl shadow p-4 space-y-4 sticky top-6 max-h-[90vh] overflow-auto">
          <h3 className="text-xl font-bold">{selectedEstimate.id}</h3>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500">{selectedEstimate.customer}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              selectedEstimate.status === 'Sent' ? 'bg-blue-100 text-blue-700' :
              selectedEstimate.status === 'Draft' ? 'bg-gray-100 text-gray-700' :
              selectedEstimate.status === 'Expired' ? 'bg-rose-100 text-rose-700' :
              selectedEstimate.status === 'Invoiced' ? 'bg-green-100 text-green-700' : ''
            }`}>
              {selectedEstimate.status}
            </span>
          </div>

          <div className="pt-4 border-t space-y-2">
            {/* Dynamic Next Steps */}
            {selectedEstimate.status === 'Draft' && (
              <p className="text-sm">💡 Next: Send this estimate to the customer.</p>
            )}
            {selectedEstimate.status === 'Sent' && (
              <p className="text-sm">💡 Next: Wait for approval or convert to invoice.</p>
            )}
            {selectedEstimate.status === 'Expired' && (
              <p className="text-sm">💡 Next: You can resend or update this estimate.</p>
            )}
            {selectedEstimate.status === 'Invoiced' && (
              <p className="text-sm">💡 This estimate has already been invoiced.</p>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2 mt-2">
              <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={handleConvertInvoice}>
                Convert to Invoice
              </button>
              <button className="px-4 py-2 bg-gray-200 rounded" onClick={handleCreateProject}>
                Create Project
              </button>
            </div>

            <div className="text-xs text-slate-500 mt-2">{selectedEstimate.viewed ? 'Viewed' : 'Not Viewed'}</div>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editingEstimate ? 'Edit Estimate' : 'New Estimate'}</h2>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Customer Name"
                className="w-full border px-3 py-2 rounded"
                value={formData.customer}
                onChange={e => setFormData({ ...formData, customer: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Amount"
                className="w-full border px-3 py-2 rounded"
                value={formData.amount}
                onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                required
              />
              <input
                type="date"
                className="w-full border px-3 py-2 rounded"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
              />
              <select
                className="w-full border px-3 py-2 rounded"
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Draft">Draft</option>
                <option value="Sent">Sent</option>
                <option value="Expired">Expired</option>
                <option value="Invoiced">Invoiced</option>
              </select>

              <div className="flex justify-end space-x-2 mt-4">
                <button type="button" className="px-4 py-2 rounded bg-gray-200" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">{editingEstimate ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default EstimatesView;
