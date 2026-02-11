import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2, PauseCircle, PlayCircle } from "lucide-react";
import {
  fetchRecurringExpenses,
  createRecurringExpense,
  updateRecurringExpense,
  deleteRecurringExpense
} from "../../../services/expenseApi";

const RecurringExpenseView = ({ data: initialData, onAdd, onUpdate, onDelete }) => {
  const [recurring, setRecurring] = useState([]);
  const [form, setForm] = useState({ name: "", amount: "", frequency: "Monthly", nextDate: "", vendor: "" });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /* -------------------- LOAD DATA -------------------- */
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchRecurringExpenses();
      setRecurring(res.map(r => ({ ...r, id: r._id })));
    } catch (err) {
      console.error("Failed to load recurring expenses", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  /* -------------------- SAVE / UPDATE -------------------- */
  const handleSave = async () => {
    if (!form.name || !form.amount || !form.nextDate) return alert("Name, Amount & Next Date required");
    const payload = { ...form, amount: Number(form.amount), status: "Active" };
    try {
      if (editingId) {
        const updated = await updateRecurringExpense(editingId, payload);
        setRecurring(prev => prev.map(r => r.id === editingId ? { ...updated, id: updated._id } : r));
        onUpdate && onUpdate(updated);
        setEditingId(null);
      } else {
        const saved = await createRecurringExpense(payload);
        setRecurring(prev => [...prev, { ...saved, id: saved._id }]);
        onAdd && onAdd(saved);
      }
      setForm({ name: "", amount: "", frequency: "Monthly", nextDate: "", vendor: "" });
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save recurring expense");
    }
  };

  /* -------------------- EDIT -------------------- */
  const handleEdit = r => {
    setForm(r);
    setEditingId(r.id);
  };

  /* -------------------- DELETE -------------------- */
  const handleDelete = async id => {
    if (!confirm("Delete this recurring expense?")) return;
    try {
      await deleteRecurringExpense(id);
      setRecurring(prev => prev.filter(r => r.id !== id));
      onDelete && onDelete(id);
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete recurring expense");
    }
  };

  /* -------------------- TOGGLE STATUS -------------------- */
  const toggleStatus = async id => {
    const r = recurring.find(r => r.id === id);
    if (!r) return;
    const updated = { ...r, status: r.status === "Active" ? "Paused" : "Active" };
    try {
      const res = await updateRecurringExpense(id, updated);
      setRecurring(prev => prev.map(r => r.id === id ? { ...res, id: res._id } : r));
      onUpdate && onUpdate(res);
    } catch (err) {
      console.error("Toggle status failed", err);
    }
  };

  /* -------------------- FILTERED & SEARCHED -------------------- */
  const filtered = useMemo(() => {
    return recurring.filter(r =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.vendor.toLowerCase().includes(search.toLowerCase())
    );
  }, [recurring, search]);

  /* -------------------- MONTHLY IMPACT -------------------- */
  const totalMonthly = useMemo(() => {
    return recurring
      .filter(r => r.status === "Active")
      .reduce((sum, r) => {
        if (r.frequency === "Monthly") return sum + r.amount;
        if (r.frequency === "Yearly") return sum + r.amount / 12;
        if (r.frequency === "Weekly") return sum + r.amount * 4;
        return sum;
      }, 0);
  }, [recurring]);

  if (loading) return <p className="text-sm text-slate-500">Loading recurring expenses...</p>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      {/* ===== ADD / EDIT FORM ===== */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-bold mb-4">{editingId ? "Edit Recurring Expense" : "Add Recurring Expense"}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input className="input" placeholder="Expense Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <input className="input" type="number" placeholder="Amount" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />
          <select className="input" value={form.frequency} onChange={e => setForm({...form, frequency: e.target.value})}>
            <option>Monthly</option>
            <option>Weekly</option>
            <option>Yearly</option>
          </select>
          <input className="input" type="date" value={form.nextDate} onChange={e => setForm({...form, nextDate: e.target.value})} />
          <input className="input col-span-1 sm:col-span-2" placeholder="Vendor" value={form.vendor} onChange={e => setForm({...form, vendor: e.target.value})} />
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold">
            {editingId ? "Update" : "Save"}
          </button>
        </div>
      </div>

      {/* ===== LIST & SEARCH ===== */}
      <div className="bg-white rounded-xl border p-6 space-y-4">

        {/* Search & Monthly Impact */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <input className="input flex-1 min-w-[180px]" placeholder="Search expense or vendor" value={search} onChange={e => setSearch(e.target.value)} />
          <div className="font-bold text-blue-600">Monthly Impact: ₹{Math.round(totalMonthly)}</div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm border-t table-auto">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Vendor</th>
                <th className="p-3 text-left">Frequency</th>
                <th className="p-3 text-left">Next Date</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-right">Amount</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-slate-400">No recurring expenses</td>
                </tr>
              ) : filtered.map(r => (
                <tr key={r.id} className="border-t">
                  <td className="p-3">{r.name}</td>
                  <td className="p-3">{r.vendor}</td>
                  <td className="p-3">{r.frequency}</td>
                  <td className="p-3">{new Date(r.nextDate).toLocaleDateString()}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${r.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3 text-right font-semibold">₹{r.amount}</td>
                  <td className="p-3 flex gap-2 justify-end">
                    <button onClick={() => toggleStatus(r.id)}>
                      {r.status === "Active" ? <PauseCircle size={16}/> : <PlayCircle size={16}/>}
                    </button>
                    <button onClick={() => handleEdit(r)}><Pencil size={16}/></button>
                    <button onClick={() => handleDelete(r.id)}><Trash2 size={16} className="text-red-500"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default RecurringExpenseView;
