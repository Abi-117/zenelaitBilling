import { useState, useEffect } from "react";
import { Plus, PauseCircle, PlayCircle, Calendar, IndianRupee, Trash2 } from "lucide-react";
import Card from "../ui/Card";
import Modal from "../ui/Modal";

const API_CUSTOMERS = "http://localhost:5000/api/customers";
const API_RECURRING = "http://localhost:5000/api/recurring-invoices";

const RecurringInvoicesView = () => {
  const token = localStorage.getItem("token");
  const [plans, setPlans] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [addOpen, setAddOpen] = useState(false);

  /* ---------------- FETCH CUSTOMERS ---------------- */
  useEffect(() => {
    fetch(API_CUSTOMERS, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(d => setCustomers(Array.isArray(d) ? d : []))
      .catch(() => setCustomers([]));
  }, [token]);

  /* ---------------- FETCH PLANS ---------------- */
  useEffect(() => {
    fetch(API_RECURRING, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(d => setPlans(Array.isArray(d) ? d : []))
      .catch(() => setPlans([]));
  }, [token]);

  /* ---------------- ACTIONS ---------------- */
  const toggleStatus = async (id, status) => {
    const newStatus = status === "Active" ? "Paused" : "Active";
    const res = await fetch(`${API_RECURRING}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) setPlans(p => p.map(x => (x._id === id ? { ...x, status: newStatus } : x)));
  };

  const deletePlan = async (id) => {
    if (!window.confirm("Delete this plan?")) return;
    const res = await fetch(`${API_RECURRING}/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setPlans(p => p.filter(x => x._id !== id));
  };

  const sendInvoice = async (id) => {
    const res = await fetch(`${API_RECURRING}/${id}/send`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      const data = await res.json();
      alert("Invoice sent successfully!");
      setPlans(p => p.map(plan => plan._id === id ? { ...plan, lastInvoiceStatus: "Sent", nextRun: data.invoice.nextRun } : plan));
    } else {
      alert("Failed to send invoice");
    }
  };

  const addPlan = async (data) => {
    if (!data.customerId || !data.amount || !data.nextDate) { alert("All fields required"); return; }
    const res = await fetch(API_RECURRING, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...data, amount: Number(data.amount) })
    });
    const saved = await res.json();
    setPlans(p => [saved, ...p]);
    setAddOpen(false);
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Recurring Invoices</h2>
        <button onClick={() => setAddOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded flex gap-2">
          <Plus size={16} /> New Plan
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4"><p className="text-xs text-slate-500">Active Plans</p><p className="text-2xl font-bold">{plans.filter(p => p.status === "Active").length}</p></Card>
        <Card className="p-4"><p className="text-xs text-slate-500">Paused Plans</p><p className="text-2xl font-bold">{plans.filter(p => p.status === "Paused").length}</p></Card>
        <Card className="p-4"><p className="text-xs text-slate-500">Monthly Revenue</p><p className="text-2xl font-bold">₹{Math.round(plans.filter(p => p.status === "Active").reduce((sum, p) => sum + (p.amount * (p.frequency === "Monthly" ? 1 : p.frequency === "Quarterly" ? 1/3 : 1/12)),0))}</p></Card>
      </div>

      <Card className="p-0">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-right">Amount</th>
              <th className="p-4 text-center">Frequency</th>
              <th className="p-4 text-center">Next Run</th>
              <th className="p-4 text-center">Last Invoice</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map(p => (
              <tr key={p._id} className="border-t">
                <td className="p-4">{p.customerName}</td>
                <td className="p-4 text-right flex justify-end gap-1"><IndianRupee size={14} />{p.amount}</td>
                <td className="p-4 text-center">{p.frequency}</td>
                <td className="p-4 text-center"><Calendar size={14} /> {p.nextRun ? new Date(p.nextRun).toISOString().split("T")[0] : "-"}</td>
                <td className="p-4 text-center">{p.lastInvoiceStatus || "-"}</td>
                <td className="p-4 text-right space-x-3">
                  <button onClick={() => toggleStatus(p._id, p.status)}>{p.status === "Active" ? <PauseCircle size={16} /> : <PlayCircle size={16} />}</button>
                  <button onClick={() => sendInvoice(p._id)} title="Send Invoice">📤</button>
                  <button onClick={() => deletePlan(p._id)}><Trash2 size={16} className="text-red-600" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="New Recurring Plan">
        <AddRecurringForm customers={customers} onSave={addPlan} />
      </Modal>
    </div>
  );
};

const AddRecurringForm = ({ customers, onSave }) => {
  const [form, setForm] = useState({ customerId: "", customerName: "", customerEmail: "", amount: "", frequency: "Monthly", nextDate: "" });
  return (
    <div className="space-y-3">
      <select className="w-full border p-2 rounded" value={form.customerId} onChange={e => {
        const c = customers.find(x => x._id === e.target.value); if (!c) return;
        setForm(f => ({ ...f, customerId: c._id, customerName: c.name, customerEmail: c.email }));
      }}>
        <option value="">Select Customer</option>
        {customers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
      </select>
      <input type="number" className="w-full border p-2 rounded" placeholder="Amount" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
      <select className="w-full border p-2 rounded" value={form.frequency} onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))}>
        <option>Monthly</option>
        <option>Quarterly</option>
        <option>Yearly</option>
      </select>
      <input type="date" className="w-full border p-2 rounded" value={form.nextDate} onChange={e => setForm(f => ({ ...f, nextDate: e.target.value }))} />
      <button onClick={() => onSave(form)} className="w-full bg-blue-600 text-white py-2 rounded font-bold">Create Plan</button>
    </div>
  );
};

export default RecurringInvoicesView;
