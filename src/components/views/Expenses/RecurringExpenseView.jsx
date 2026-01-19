import { useState, useMemo } from 'react';
import { Pencil, Trash2, PauseCircle, PlayCircle } from 'lucide-react';

const RecurringExpenseView = () => {
  const [recurring, setRecurring] = useState([
    {
      id: 1,
      name: 'Office Rent',
      amount: 25000,
      frequency: 'Monthly',
      nextDate: '2026-02-01',
      status: 'Active',
      vendor: 'ABC Properties',
    },
    {
      id: 2,
      name: 'Internet Bill',
      amount: 1200,
      frequency: 'Monthly',
      nextDate: '2026-01-20',
      status: 'Active',
      vendor: 'Airtel',
    },
    {
      id: 3,
      name: 'Software Subscription',
      amount: 999,
      frequency: 'Yearly',
      nextDate: '2026-12-01',
      status: 'Paused',
      vendor: 'Zoho',
    },
  ]);

  const [form, setForm] = useState({
    name: '',
    amount: '',
    frequency: 'Monthly',
    nextDate: '',
    vendor: '',
  });

  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');

/* ---------- SAVE / UPDATE ---------- */
  const handleSave = () => {
    if (!form.name || !form.amount || !form.nextDate) return;

    if (editingId) {
      setRecurring(prev =>
        prev.map(r =>
          r.id === editingId
            ? { ...form, id: editingId, amount: Number(form.amount), status: 'Active' }
            : r
        )
      );
      setEditingId(null);
    } else {
      setRecurring(prev => [
        ...prev,
        {
          id: Date.now(),
          ...form,
          amount: Number(form.amount),
          status: 'Active',
        },
      ]);
    }

    setForm({
      name: '',
      amount: '',
      frequency: 'Monthly',
      nextDate: '',
      vendor: '',
    });
  };

/* ---------- EDIT ---------- */
  const handleEdit = r => {
    setForm(r);
    setEditingId(r.id);
  };

/* ---------- DELETE ---------- */
  const handleDelete = id => {
    if (!confirm('Delete this recurring expense?')) return;
    setRecurring(prev => prev.filter(r => r.id !== id));
  };

/* ---------- PAUSE / RESUME ---------- */
  const toggleStatus = id => {
    setRecurring(prev =>
      prev.map(r =>
        r.id === id
          ? { ...r, status: r.status === 'Active' ? 'Paused' : 'Active' }
          : r
      )
    );
  };

/* ---------- FILTER ---------- */
  const filtered = useMemo(() => {
    return recurring.filter(r =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.vendor.toLowerCase().includes(search.toLowerCase())
    );
  }, [recurring, search]);

/* ---------- TOTAL MONTHLY ---------- */
  const totalMonthly = recurring
    .filter(r => r.status === 'Active')
    .reduce((sum, r) => {
      if (r.frequency === 'Monthly') return sum + r.amount;
      if (r.frequency === 'Yearly') return sum + r.amount / 12;
      if (r.frequency === 'Weekly') return sum + r.amount * 4;
      return sum;
    }, 0);

  return (
    <div className="space-y-6">

      {/* ===== ADD / EDIT FORM ===== */}
      <div className="bg-white rounded-xl border p-6 max-w-4xl">
        <h2 className="text-lg font-bold mb-4">
          {editingId ? 'Edit Recurring Expense' : 'Add Recurring Expense'}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <input
            className="input"
            placeholder="Expense Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="number"
            className="input"
            placeholder="Amount"
            value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })}
          />

          <select
            className="input"
            value={form.frequency}
            onChange={e => setForm({ ...form, frequency: e.target.value })}
          >
            <option>Monthly</option>
            <option>Weekly</option>
            <option>Yearly</option>
          </select>

          <input
            type="date"
            className="input"
            value={form.nextDate}
            onChange={e => setForm({ ...form, nextDate: e.target.value })}
          />

          <input
            className="input col-span-2"
            placeholder="Vendor"
            value={form.vendor}
            onChange={e => setForm({ ...form, vendor: e.target.value })}
          />
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold"
          >
            {editingId ? 'Update' : 'Save'}
          </button>
        </div>
      </div>

      {/* ===== LIST ===== */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex justify-between mb-4">
          <input
            className="input w-64"
            placeholder="Search expense or vendor"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <div className="font-bold text-blue-600">
            Monthly Impact: ₹{Math.round(totalMonthly)}
          </div>
        </div>

        <table className="w-full text-sm border-t">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th>Vendor</th>
              <th>Frequency</th>
              <th>Next Date</th>
              <th>Status</th>
              <th className="text-right">Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-slate-400">
                  No recurring expenses
                </td>
              </tr>
            ) : (
              filtered.map(r => (
                <tr key={r.id} className="border-t">
                  <td className="p-3">{r.name}</td>
                  <td>{r.vendor}</td>
                  <td>{r.frequency}</td>
                  <td>{r.nextDate}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        r.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="text-right font-semibold">₹{r.amount}</td>
                  <td className="flex gap-2 justify-end p-2">
                    <button onClick={() => toggleStatus(r.id)}>
                      {r.status === 'Active' ? (
                        <PauseCircle size={16} />
                      ) : (
                        <PlayCircle size={16} />
                      )}
                    </button>
                    <button onClick={() => handleEdit(r)}>
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(r.id)}>
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecurringExpenseView;
