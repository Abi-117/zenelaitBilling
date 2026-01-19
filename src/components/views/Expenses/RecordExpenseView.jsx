import { useState, useMemo } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

const RecordExpenseView = ({ categories = [] }) => {
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      name: 'Office Rent',
      amount: 25000,
      category: 'Rent',
      vendor: 'ABC Properties',
      date: '2026-01-05',
      notes: 'January rent',
    },
    {
      id: 2,
      name: 'Internet Bill',
      amount: 1200,
      category: 'Utilities',
      vendor: 'Airtel',
      date: '2026-01-08',
      notes: '',
    },
    {
      id: 3,
      name: 'Laptop Repair',
      amount: 4500,
      category: 'Maintenance',
      vendor: 'Dell Service',
      date: '2026-01-12',
      notes: 'Fan issue',
    },
  ]);

  const [form, setForm] = useState({
    name: '',
    amount: '',
    category: '',
    vendor: '',
    date: '',
    notes: '',
  });

  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');

  /* ---------- SAVE / UPDATE ---------- */
  const handleSave = () => {
    if (!form.name || !form.amount || !form.date) return;

    if (editingId) {
      setExpenses(prev =>
        prev.map(e =>
          e.id === editingId ? { ...form, id: editingId, amount: Number(form.amount) } : e
        )
      );
      setEditingId(null);
    } else {
      setExpenses(prev => [
        ...prev,
        { id: Date.now(), ...form, amount: Number(form.amount) },
      ]);
    }

    setForm({
      name: '',
      amount: '',
      category: '',
      vendor: '',
      date: '',
      notes: '',
    });
  };

  /* ---------- EDIT ---------- */
  const handleEdit = expense => {
    setForm(expense);
    setEditingId(expense.id);
  };

  /* ---------- DELETE ---------- */
  const handleDelete = id => {
    if (!confirm('Delete this expense?')) return;
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  /* ---------- FILTER / SORT ---------- */
  const filteredExpenses = useMemo(() => {
    let data = expenses.filter(e => {
      const matchesSearch =
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.vendor.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        filterCategory === 'All' || e.category === filterCategory;

      return matchesSearch && matchesCategory;
    });

    if (sortBy === 'date-desc')
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sortBy === 'date-asc')
      data.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sortBy === 'amount-desc')
      data.sort((a, b) => b.amount - a.amount);
    if (sortBy === 'amount-asc')
      data.sort((a, b) => a.amount - b.amount);

    return data;
  }, [expenses, search, filterCategory, sortBy]);

  /* ---------- TOTAL ---------- */
  const totalAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">

      {/* ===== RECORD FORM ===== */}
      <div className="bg-white rounded-xl border p-6 max-w-4xl">
        <h2 className="text-lg font-bold mb-4">
          {editingId ? 'Edit Expense' : 'Record Expense'}
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
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
          >
            <option value="">Select Category</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="input"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
          />

          <input
            className="input col-span-2"
            placeholder="Vendor"
            value={form.vendor}
            onChange={e => setForm({ ...form, vendor: e.target.value })}
          />

          <textarea
            className="input col-span-2"
            placeholder="Notes"
            value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
          />
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold"
          >
            {editingId ? 'Update' : 'Save'}
          </button>
        </div>
      </div>

      {/* ===== LIST + FILTER ===== */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex gap-2 mb-4">
          <input
            className="input flex-1"
            placeholder="Search by name or vendor"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <select
            className="input w-40"
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            className="input w-44"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="date-desc">Date ↓</option>
            <option value="date-asc">Date ↑</option>
            <option value="amount-desc">Amount ↓</option>
            <option value="amount-asc">Amount ↑</option>
          </select>
        </div>

        <table className="w-full text-sm border-t">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th>Category</th>
              <th>Vendor</th>
              <th>Date</th>
              <th className="text-right">Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-slate-400">
                  No expenses found
                </td>
              </tr>
            ) : (
              filteredExpenses.map(e => (
                <tr key={e.id} className="border-t">
                  <td className="p-3">{e.name}</td>
                  <td>{e.category}</td>
                  <td>{e.vendor}</td>
                  <td>{e.date}</td>
                  <td className="text-right font-semibold">₹{e.amount}</td>
                  <td className="flex gap-2 justify-end p-2">
                    <button onClick={() => handleEdit(e)}>
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(e.id)}>
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* TOTAL */}
        <div className="text-right font-bold mt-4">
          Total: ₹{totalAmount}
        </div>
      </div>
    </div>
  );
};

export default RecordExpenseView;
