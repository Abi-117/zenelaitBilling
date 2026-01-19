import { useState } from 'react';
import { Plus, RotateCcw, FileText } from 'lucide-react';

const PurchaseReturnsView = () => {
  const [returns, setReturns] = useState([
    {
      id: 'PR-1001',
      supplier: 'ABC Suppliers',
      billNo: 'PB-9001',
      date: '2026-01-10',
      reason: 'Damaged goods',
      status: 'Credited',
      total: 2500,
    },
    {
      id: 'PR-1002',
      supplier: 'Metro Steels',
      billNo: 'PB-9003',
      date: '2026-01-14',
      reason: 'Excess quantity',
      status: 'Draft',
      total: 18500,
    },
    {
      id: 'PR-1003',
      supplier: 'OfficeMart',
      billNo: 'PB-9006',
      date: '2026-01-18',
      reason: 'Wrong item delivered',
      status: 'Credited',
      total: 6200,
    },
    {
      id: 'PR-1004',
      supplier: 'TechZone Pvt Ltd',
      billNo: 'PB-9010',
      date: '2026-01-22',
      reason: 'Quality issue',
      status: 'Draft',
      total: 14500,
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    supplier: '',
    billNo: '',
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
        billNo: form.billNo || '-',
        date: new Date().toISOString().slice(0, 10),
        reason: form.reason,
        total: Number(form.total),
        status: 'Draft',
      },
    ]);

    setModalOpen(false);
    setForm({ supplier: '', billNo: '', reason: '', total: '' });
  };

  const convertToCredit = (id) => {
    setReturns(prev =>
      prev.map(r =>
        r.id === id ? { ...r, status: 'Credited' } : r
      )
    );
  };

  return (
    <div className="space-y-6 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Purchase Returns</h2>
          <p className="text-sm text-slate-500">
            Manage supplier returns & credit notes
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={16} /> New Return
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="p-3 text-left">Return No</th>
              <th className="p-3">Supplier</th>
              <th className="p-3">Bill No</th>
              <th className="p-3">Date</th>
              <th className="p-3">Reason</th>
              <th className="p-3 text-right">Total</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {returns.map(r => (
              <tr key={r.id} className="border-b hover:bg-slate-50">
                <td className="p-3 font-medium">{r.id}</td>
                <td className="p-3 text-center">{r.supplier}</td>
                <td className="p-3 text-center">{r.billNo}</td>
                <td className="p-3 text-center">{r.date}</td>
                <td className="p-3 text-center">{r.reason}</td>
                <td className="p-3 text-right font-semibold">
                  ₹{r.total}
                </td>
                <td className="p-3 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold
                      ${
                        r.status === 'Draft'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="p-3 text-right">
                  {r.status === 'Draft' && (
                    <button
                      onClick={() => convertToCredit(r.id)}
                      className="flex items-center gap-1 text-blue-600 text-sm"
                    >
                      <RotateCcw size={14} /> Convert
                    </button>
                  )}
                  {r.status === 'Credited' && (
                    <span className="flex justify-end items-center gap-1 text-emerald-600 text-sm font-semibold">
                      <FileText size={14} /> Credit Note
                    </span>
                  )}
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
                placeholder="Purchase Bill No (optional)"
                className="w-full border px-3 py-2 rounded"
                value={form.billNo}
                onChange={e => setForm({ ...form, billNo: e.target.value })}
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
