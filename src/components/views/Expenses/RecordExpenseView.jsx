import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  fetchExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  fetchCategories
} from "../../../services/expenseApi";

const RecordExpenseView = () => {
  const [form, setForm] = useState({
    name: "",
    amount: "",
    category: "",
    vendor: "",
    date: "",
    notes: "",
  });

  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState("date-desc");
  const [loading, setLoading] = useState(true);

  /* -------------------- LOAD DATA -------------------- */
  const loadData = async () => {
    setLoading(true);
    try {
      const [expData = [], catData = []] = await Promise.all([
        fetchExpenses(),
        fetchCategories(),
      ]);

      setExpenses(
        expData.map(e => ({
          ...e,
          id: e._id,
          amount: Number(e.amount) || 0,
        }))
      );

      setCategories(
        catData.map(c => ({
          ...c,
          id: c._id,
          budget: Number(c.budget) || 0,
        }))
      );
    } catch (err) {
      console.error("Failed to load data", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* -------------------- SAVE / UPDATE -------------------- */
  const handleSave = async () => {
    if (!form.name || !form.amount || !form.date) {
      return alert("Name, Amount & Date required");
    }

    try {
      const payload = {
        ...form,
        amount: Number(form.amount),
      };

      if (editingId) {
        await updateExpense(editingId, payload);
        setEditingId(null);
      } else {
        await createExpense(payload);
      }

      setForm({
        name: "",
        amount: "",
        category: "",
        vendor: "",
        date: "",
        notes: "",
      });

      loadData();
    } catch (err) {
      console.error("Save failed", err.response?.data || err.message);
      alert("Failed to save expense");
    }
  };

  /* -------------------- EDIT -------------------- */
  const handleEdit = (e) => {
    setForm({
      ...e,
      date: e.date ? e.date.substring(0, 10) : "",
    });
    setEditingId(e.id);
  };

  /* -------------------- DELETE -------------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;

    try {
      await deleteExpense(id);
      loadData();
    } catch (err) {
      console.error("Delete failed", err.response?.data || err.message);
      alert("Failed to delete expense");
    }
  };

  /* -------------------- FILTER & SORT -------------------- */
  const filteredExpenses = useMemo(() => {
    let data = expenses.filter(e => {
      const matchesSearch =
        (e.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (e.vendor || "").toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        filterCategory === "All" || e.category === filterCategory;

      return matchesSearch && matchesCategory;
    });

    if (sortBy === "date-desc")
      data.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (sortBy === "date-asc")
      data.sort((a, b) => new Date(a.date) - new Date(b.date));

    if (sortBy === "amount-desc")
      data.sort((a, b) => b.amount - a.amount);

    if (sortBy === "amount-asc")
      data.sort((a, b) => a.amount - b.amount);

    return data;
  }, [expenses, search, filterCategory, sortBy]);

  /* -------------------- TOTALS -------------------- */
  const totalAmount = filteredExpenses.reduce(
    (sum, e) => sum + (Number(e.amount) || 0),
    0
  );

  /* -------------------- CATEGORY TOTALS -------------------- */
  const categoryTotals = useMemo(() => {
    return categories.map(c => {
      const spent = expenses
        .filter(e => e.category === c.name)
        .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

      return { ...c, spent };
    });
  }, [categories, expenses]);

  if (loading) {
    return (
      <p className="text-sm text-slate-500 text-center py-10">
        Loading expenses...
      </p>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      {/* ===== RECORD FORM ===== */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-bold mb-4">
          {editingId ? "Edit Expense" : "Record Expense"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            className="input col-span-1 sm:col-span-2"
            placeholder="Vendor"
            value={form.vendor}
            onChange={e => setForm({ ...form, vendor: e.target.value })}
          />

          <textarea
            className="input col-span-1 sm:col-span-2"
            placeholder="Notes"
            value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
          />
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold"
          >
            {editingId ? "Update" : "Save"}
          </button>
        </div>
      </div>

      {/* ===== CATEGORY SUMMARY ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoryTotals.map(c => {
          const exceeded = (c.spent || 0) > (c.budget || 0);

          return (
            <div key={c.id} className="bg-white border rounded-xl p-5">
              <p className="text-sm text-slate-500">{c.name}</p>
              <p className={`text-xl font-bold ${exceeded ? "text-red-600" : ""}`}>
                Spent: ₹{c.spent} / ₹{c.budget}
              </p>
              <p
                className={`text-xs px-2 py-1 rounded ${
                  exceeded
                    ? "bg-red-100 text-red-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {exceeded ? "Over Budget" : "On Track"}
              </p>
            </div>
          );
        })}
      </div>

      {/* ===== LIST + FILTER ===== */}
      <div className="bg-white rounded-xl border p-6 space-y-4">

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          <input
            className="input flex-1 min-w-[180px]"
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm border-t">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Vendor</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-right">Amount</th>
                <th className="p-3 text-right">Actions</th>
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
                    <td className="p-3">{e.category}</td>
                    <td className="p-3">{e.vendor}</td>
                    <td className="p-3">
                      {e.date ? new Date(e.date).toLocaleDateString() : "-"}
                    </td>
                    <td className="p-3 text-right font-semibold">
                      ₹{e.amount}
                    </td>
                    <td className="p-3 text-right flex gap-2 justify-end">
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

          <div className="text-right font-bold mt-4">
            Total: ₹{totalAmount}
          </div>
        </div>

      </div>
    </div>
  );
};

export default RecordExpenseView;
