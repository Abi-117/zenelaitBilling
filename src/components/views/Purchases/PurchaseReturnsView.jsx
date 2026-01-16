import { useState } from 'react';
import { Plus, RotateCcw } from 'lucide-react';

const PurchaseReturnsView = () => {
  const [returns, setReturns] = useState([
    {
      id: 'PR-1001',
      supplier: 'ABC Suppliers',
      date: '2026-01-10',
      reason: 'Damaged goods',
      status: 'Processed',
      total: 2500,
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    supplier: '',
    reason: '',
    total: '',
  });

  const createReturn = () => {
    if (!form.supplier || !form.total) {
      alert('Please fill all required fields');
      return;
    }

    setReturns(prev => [
      ...prev,
      {
        id: `PR-${Date.now()}`,
        supplier: form.supplier,
        date: new Date().toISOString().slice(0, 10),
        reason: form.reason,
        total: Number(form.total),
        status: 'Processed',
      },
    ]);

    setModalOpen(false);
    setForm({ supplier: '', reason: '', total: '' });
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Purchase Returns</h2>
          <p className="text-sm text-slate-500">
            Track returned items and supplier adjustments
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={16} />
          New Return
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="p-3 text-left">Return No</th>
              <th className="p-3">Supplier</th>
              <th className="p-3">Date</th>
              <th className="p-3">Reason</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {returns.map(r => (
              <tr key={r.id} className="border-b hover:bg-slate-50">
                <td className="p-3 font-medium">{r.id}</td>
                <td className="p-3 text-center">{r.supplier}</td>
                <td className="p-3 text-center">{r.date}</td>
                <td className="p-3 text-center">{r.reason}</td>
                <td className="p-3 text-center">₹{r.total}</td>
                <td className="p-3 text-center">
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">New Purchase Return</h3>

            <div className="space-y-3">
              <input
                placeholder="Supplier Name"
                className="w-full border px-3 py-2 rounded"
                value={form.supplier}
                onChange={e => setForm({ ...form, supplier: e.target.value })}
              />

              <input
                placeholder="Return Reason"
                className="w-full border px-3 py-2 rounded"
                value={form.reason}
                onChange={e => setForm({ ...form, reason: e.target.value })}
              />

              <input
                type="number"
                placeholder="Total Amount"
                className="w-full border px-3 py-2 rounded"
                value={form.total}
                onChange={e => setForm({ ...form, total: e.target.value })}
              />

              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={createReturn}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Create Return
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PurchaseReturnsView;
