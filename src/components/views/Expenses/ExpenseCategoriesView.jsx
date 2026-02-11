import { useEffect, useState, useMemo } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  fetchCategories,
  fetchExpenses,
  createCategory,
  updateCategory,
  deleteCategory
} from "../../../services/expenseApi";

const ExpenseCategoriesView = () => {
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", budget: "" });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  // Load categories and expenses
  const loadData = async () => {
    setLoading(true);
    try {
      const [catData, expData] = await Promise.all([fetchCategories(), fetchExpenses()]);

      // Merge spent amounts into categories
      const catsWithSpent = catData.map(c => {
        const spent = expData
          .filter(e => e.category === c.name)
          .reduce((sum, e) => sum + e.amount, 0);
        return { ...c, id: c._id, spent };
      });

      setCategories(catsWithSpent);
      setExpenses(expData);
    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Totals for UI
  const totals = useMemo(() => {
    const totalBudget = categories.reduce((sum, c) => sum + Number(c.budget || 0), 0);
    const totalSpent = categories.reduce((sum, c) => sum + Number(c.spent || 0), 0);
    return { totalBudget, totalSpent, remaining: totalBudget - totalSpent };
  }, [categories]);

  // Save / Update category
  const saveCategory = async () => {
    if (!form.name || !form.budget) return alert("Enter category name & budget");
    setSaving(true);
    try {
      if (editingId) {
        const updated = await updateCategory(editingId, { name: form.name, budget: Number(form.budget) });
        setCategories(prev => prev.map(c => (c.id === updated._id ? { ...updated, id: updated._id, spent: c.spent || 0 } : c)));
        setEditingId(null);
      } else {
        const created = await createCategory({ name: form.name, budget: Number(form.budget) });
        setCategories(prev => [...prev, { ...created, id: created._id, spent: 0 }]);
      }
      setForm({ name: "", budget: "" });
    } catch (err) {
      console.error("Failed to save category", err);
      alert("Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  // Edit category
  const editCategory = c => {
    setEditingId(c.id);
    setForm({ name: c.name, budget: c.budget });
  };

  // Delete category
  const removeCategory = async id => {
    if (!confirm("Delete this category?")) return;
    try {
      await deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete category");
    }
  };

  if (loading) return <p className="text-sm text-slate-500">Loading categories...</p>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">

      {/* ADD / EDIT FORM */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-bold mb-4">{editingId ? "Edit Category" : "Add Category"}</h2>
        <div className="grid grid-cols-3 gap-4 items-center">
          <input
            placeholder="Category name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="input"
          />
          <input
            type="number"
            placeholder="Budget"
            value={form.budget}
            onChange={e => setForm({ ...form, budget: e.target.value })}
            className="input"
          />
          <button
            onClick={saveCategory}
            disabled={saving}
            className={`bg-blue-600 text-white h-11 rounded-lg flex items-center justify-center gap-2 ${
              saving ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            <Plus size={16} />
            {editingId ? "Update" : "Add"}
          </button>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-3 gap-4">
        <SummaryCard label="Total Budget" value={totals.totalBudget} />
        <SummaryCard label="Total Spent" value={totals.totalSpent} />
        <SummaryCard label="Remaining" value={totals.remaining} danger={totals.remaining < 0} />
      </div>

      {/* LIST */}
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
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
            {categories.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-6 text-slate-400">
                  No categories added
                </td>
              </tr>
            ) : (
              categories.map(c => {
                const exceeded = c.spent > c.budget;
                return (
                  <tr key={c.id} className="border-b">
                    <td className="p-3 font-semibold">{c.name}</td>
                    <td>₹{c.budget}</td>
                    <td>₹{c.spent || 0}</td>
                    <td>
                      <span className={`text-xs px-2 py-1 rounded ${exceeded ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
                        {exceeded ? "Over Budget" : "On Track"}
                      </span>
                    </td>
                    <td className="p-3 text-right flex justify-end gap-3">
                      <button onClick={() => editCategory(c)} className="text-blue-600">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => removeCategory(c.id)} className="text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

/* SUMMARY CARD COMPONENT */
const SummaryCard = ({ label, value, danger }) => (
  <div className="bg-white border rounded-xl p-5">
    <p className="text-sm text-slate-500">{label}</p>
    <p className={`text-xl font-bold ${danger ? "text-red-600" : ""}`}>₹{value}</p>
  </div>
);

export default ExpenseCategoriesView;
