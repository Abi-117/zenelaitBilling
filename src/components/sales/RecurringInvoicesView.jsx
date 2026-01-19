import { useState } from 'react';
import {
  Plus,
  RefreshCw,
  PauseCircle,
  PlayCircle,
  Calendar,
  IndianRupee,
  Search
} from 'lucide-react';
import Card from '../ui/Card';
import Modal from '../ui/Modal';

/* ---------------- MAIN VIEW ---------------- */
const RecurringInvoicesView = () => {
  const [plans, setPlans] = useState([
    { id: 'RINV-1001', customer: 'Stark Industries', amount: 25000, frequency: 'Monthly', nextDate: '2026-02-01', status: 'Active' },
    { id: 'RINV-1002', customer: 'Wayne Enterprises', amount: 12000, frequency: 'Quarterly', nextDate: '2026-03-15', status: 'Paused' },
    { id: 'RINV-1003', customer: 'Oscorp', amount: 18000, frequency: 'Monthly', nextDate: '2026-02-05', status: 'Active' },
    { id: 'RINV-1004', customer: 'Daily Bugle', amount: 6000, frequency: 'Monthly', nextDate: '2026-02-10', status: 'Active' },
    { id: 'RINV-1005', customer: 'Umbrella Corp', amount: 45000, frequency: 'Yearly', nextDate: '2026-06-01', status: 'Active' },
    { id: 'RINV-1006', customer: 'Cyberdyne Systems', amount: 22000, frequency: 'Quarterly', nextDate: '2026-04-01', status: 'Paused' },
    { id: 'RINV-1007', customer: 'Wonka Industries', amount: 9000, frequency: 'Monthly', nextDate: '2026-02-12', status: 'Active' },
    { id: 'RINV-1008', customer: 'Hooli', amount: 30000, frequency: 'Monthly', nextDate: '2026-02-18', status: 'Active' },
    { id: 'RINV-1009', customer: 'Initech', amount: 15000, frequency: 'Quarterly', nextDate: '2026-05-01', status: 'Active' },
    { id: 'RINV-1010', customer: 'Aperture Science', amount: 52000, frequency: 'Yearly', nextDate: '2026-08-20', status: 'Paused' }
  ]);

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [addOpen, setAddOpen] = useState(false);

  /* ---------------- HELPERS ---------------- */
  const nextRunDate = (date, frequency) => {
    const d = new Date(date);
    if (frequency === 'Monthly') d.setMonth(d.getMonth() + 1);
    if (frequency === 'Quarterly') d.setMonth(d.getMonth() + 3);
    if (frequency === 'Yearly') d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split('T')[0];
  };

  const normalizeMonthly = (amount, frequency) => {
    if (frequency === 'Monthly') return amount;
    if (frequency === 'Quarterly') return amount / 3;
    if (frequency === 'Yearly') return amount / 12;
    return 0;
  };

  /* ---------------- ACTIONS ---------------- */
  const toggleStatus = (id) => {
    setPlans(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, status: p.status === 'Active' ? 'Paused' : 'Active' }
          : p
      )
    );
  };

  const runNow = (id) => {
    setPlans(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, nextDate: nextRunDate(p.nextDate, p.frequency) }
          : p
      )
    );
  };

  const addPlan = (data) => {
    setPlans(prev => [
      ...prev,
      { id: `RINV-${Date.now()}`, status: 'Active', ...data }
    ]);
    setAddOpen(false);
  };

  /* ---------------- FILTERS & STATS ---------------- */
  const filteredPlans = plans.filter(p =>
    (filterStatus === 'All' || p.status === filterStatus) &&
    p.customer.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = plans.filter(p => p.status === 'Active').length;
  const pausedCount = plans.filter(p => p.status === 'Paused').length;
  const monthlyRevenue = plans
    .filter(p => p.status === 'Active')
    .reduce((sum, p) => sum + normalizeMonthly(p.amount, p.frequency), 0);

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Recurring Invoices</h2>
          <p className="text-sm text-slate-500">Automated subscription billing</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2">
          <Plus size={16} /> New Plan
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4">
        <Stat label="Active Plans" value={activeCount} />
        <Stat label="Paused Plans" value={pausedCount} />
        <Stat label="Monthly Revenue" value={`₹${Math.round(monthlyRevenue)}`} />
      </div>

      {/* FILTER */}
      <div className="flex justify-between">
        <div className="relative w-72">
          <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm"
            placeholder="Search customer"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <select className="border px-3 py-2 rounded" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option>All</option>
          <option>Active</option>
          <option>Paused</option>
        </select>
      </div>

      {/* TABLE */}
      <Card className="p-0">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 text-left">Plan ID</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-right">Amount</th>
              <th className="p-4 text-center">Frequency</th>
              <th className="p-4 text-center">Next Run</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlans.map(p => (
              <tr key={p.id} className="border-t hover:bg-slate-50">
                <td className="p-4 font-medium">{p.id}</td>
                <td className="p-4">{p.customer}</td>
                <td className="p-4 text-right flex justify-end gap-1 font-semibold">
                  <IndianRupee size={14} /> {p.amount}
                </td>
                <td className="p-4 text-center">{p.frequency}</td>
                <td className="p-4 text-center flex justify-center gap-1">
                  <Calendar size={14} /> {p.nextDate}
                </td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => toggleStatus(p.id)}>
                    {p.status === 'Active'
                      ? <PauseCircle size={16} className="text-amber-600" />
                      : <PlayCircle size={16} className="text-emerald-600" />}
                  </button>
                  <button onClick={() => runNow(p.id)}>
                    <RefreshCw size={16} className="text-blue-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* ADD MODAL */}
      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="New Recurring Invoice">
        <AddRecurringForm onSave={addPlan} />
      </Modal>
    </div>
  );
};

/* ---------------- SMALL COMPONENTS ---------------- */
const Stat = ({ label, value }) => (
  <Card className="p-4">
    <p className="text-xs text-slate-500">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </Card>
);

const AddRecurringForm = ({ onSave }) => {
  const [form, setForm] = useState({
    customer: '',
    amount: '',
    frequency: 'Monthly',
    nextDate: ''
  });

  return (
    <div className="space-y-3">
      <input className="w-full border p-2 rounded" placeholder="Customer Name" onChange={e => setForm({ ...form, customer: e.target.value })} />
      <input className="w-full border p-2 rounded" placeholder="Amount" type="number" onChange={e => setForm({ ...form, amount: +e.target.value })} />
      <select className="w-full border p-2 rounded" onChange={e => setForm({ ...form, frequency: e.target.value })}>
        <option>Monthly</option>
        <option>Quarterly</option>
        <option>Yearly</option>
      </select>
      <input type="date" className="w-full border p-2 rounded" onChange={e => setForm({ ...form, nextDate: e.target.value })} />

      <button onClick={() => onSave(form)} className="w-full bg-blue-600 text-white py-2 rounded font-bold">
        Create Plan
      </button>
    </div>
  );
};

export default RecurringInvoicesView;
