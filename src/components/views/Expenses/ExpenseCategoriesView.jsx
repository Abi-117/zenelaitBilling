import { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const ExpenseCategoriesView = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Rent', budget: 20000, spent: 18000 },
    { id: 2, name: 'Salary', budget: 30000, spent: 15000 },
    { id: 3, name: 'Marketing', budget: 10000, spent: 3800 },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', budget: '' });

  /* ================= TOTALS ================= */
  const totals = useMemo(() => {
    const totalBudget = categories.reduce((a, c) => a + Number(c.budget), 0);
    const totalSpent = categories.reduce((a, c) => a + Number(c.spent), 0);
    return {
      totalBudget,
      totalSpent,
      remaining: totalBudget - totalSpent,
    };
  }, [categories]);

  /* ================= ACTIONS ================= */
  const saveCategory = () => {
    if (!form.name || !form.budget) return alert('Enter name & budget');

    if (editingId) {
      setCategories(prev =>
        prev.map(c =>
          c.id === editingId
            ? { ...c, name: form.name, budget: Number(form.budget) }
            : c
        )
      );
    } else {
      setCategories(prev => [
        ...prev,
        {
          id: Date.now(),
          name: form.name,
          budget: Number(form.budget),
          spent: 0,
        },
      ]);
    }

    setForm({ name: '', budget: '' });
    setEditingId(null);
  };

  const editCategory = c => {
    setEditingId(c.id);
    setForm({ name: c.name, budget: c.budget });
  };

  const deleteCategory = id => {
    if (!confirm('Delete this category?')) return;
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-6 max-w-4xl">

      {/* ===== ADD / EDIT CATEGORY ===== */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-bold mb-4">
          {editingId ? 'Edit Category' : 'Add Category'}
        </h2>

        <div className="grid grid-cols-3 gap-4 items-center">
          <input
            className="input"
            placeholder="Category name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="number"
            className="input"
            placeholder="Budget"
            value={form.budget}
            onChange={e => setForm({ ...form, budget: e.target.value })}
          />

          <button
            onClick={saveCategory}
            className="bg-blue-600 text-white h-11 rounded-lg flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            {editingId ? 'Update' : 'Add'}
          </button>
        </div>
      </div>

      {/* ===== SUMMARY ===== */}
      <div className="grid grid-cols-3 gap-4">
        <SummaryCard label="Total Budget" value={totals.totalBudget} />
        <SummaryCard label="Total Spent" value={totals.totalSpent} />
        <SummaryCard
          label="Remaining"
          value={totals.remaining}
          danger={totals.remaining < 0}
        />
      </div>

      {/* ===== CATEGORY LIST ===== */}
      <div className="bg-white rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-3 text-left">Category</th>
              <th>Budget</th>
              <th>Spent</th>
              <th>Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => {
              const exceeded = c.spent > c.budget;
              return (
                <tr key={c.id} className="border-b">
                  <td className="p-3 font-semibold">{c.name}</td>
                  <td>₹{c.budget}</td>
                  <td>₹{c.spent}</td>
                  <td>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        exceeded
                          ? 'bg-red-100 text-red-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {exceeded ? 'Over Budget' : 'On Track'}
                    </span>
                  </td>
                  <td className="p-3 text-right flex justify-end gap-3">
                    <button
                      onClick={() => editCategory(c)}
                      className="text-blue-600"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => deleteCategory(c.id)}
                      className="text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}

            {categories.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-6 text-slate-400">
                  No categories added
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

/* ===== SMALL COMPONENT ===== */
const SummaryCard = ({ label, value, danger }) => (
  <div className="bg-white border rounded-xl p-5">
    <p className="text-sm text-slate-500">{label}</p>
    <p className={`text-xl font-bold ${danger ? 'text-red-600' : ''}`}>
      ₹{value}
    </p>
  </div>
);

export default ExpenseCategoriesView;
