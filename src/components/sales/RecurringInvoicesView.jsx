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

const RecurringInvoicesView = () => {
  const [plans, setPlans] = useState([
    {
      id: 'RINV-1001',
      customer: 'Stark Industries',
      amount: 25000,
      frequency: 'Monthly',
      nextDate: '2026-02-01',
      status: 'Active'
    },
    {
      id: 'RINV-1002',
      customer: 'Wayne Enterprises',
      amount: 12000,
      frequency: 'Quarterly',
      nextDate: '2026-03-15',
      status: 'Paused'
    }
  ]);

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [addOpen, setAddOpen] = useState(false);

  const toggleStatus = (id) => {
    setPlans(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, status: p.status === 'Active' ? 'Paused' : 'Active' }
          : p
      )
    );
  };

  const addPlan = (data) => {
    setPlans([
      ...plans,
      {
        id: `RINV-${Date.now()}`,
        status: 'Active',
        ...data
      }
    ]);
    setAddOpen(false);
  };

  const filteredPlans = plans.filter(p =>
    (filterStatus === 'All' || p.status === filterStatus) &&
    p.customer.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = plans.filter(p => p.status === 'Active').length;
  const pausedCount = plans.filter(p => p.status === 'Paused').length;
  const monthlyRevenue = plans
    .filter(p => p.status === 'Active')
    .reduce((a, b) => a + b.amount, 0);

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Recurring Invoices</h2>
          <p className="text-sm text-slate-500">
            Automate billing cycles & subscriptions
          </p>
        </div>

        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={16} /> New Recurring Invoice
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Stat label="Active Plans" value={activeCount} color="emerald" />
        <Stat label="Paused Plans" value={pausedCount} color="amber" />
        <Stat
          label="Monthly Revenue"
          value={`₹${monthlyRevenue}`}
          color="blue"
        />
      </div>

      {/* FILTER BAR */}
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            placeholder="Search customer"
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <select
          className="border rounded-lg px-3 py-2 text-sm"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option>All</option>
          <option>Active</option>
          <option>Paused</option>
        </select>
      </div>

      {/* TABLE */}
      <Card className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
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
            {filteredPlans.map(plan => (
              <tr key={plan.id} className="border-t hover:bg-slate-50">
                <td className="p-4 font-medium">{plan.id}</td>
                <td className="p-4">{plan.customer}</td>
                <td className="p-4 text-right flex justify-end gap-1 font-semibold">
                  <IndianRupee size={14} /> {plan.amount}
                </td>
                <td className="p-4 text-center">{plan.frequency}</td>
                <td className="p-4 text-center flex justify-center gap-1">
                  <Calendar size={14} /> {plan.nextDate}
                </td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold
                    ${plan.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'}
                  `}>
                    {plan.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => toggleStatus(plan.id)}>
                    {plan.status === 'Active'
                      ? <PauseCircle size={16} className="text-amber-600" />
                      : <PlayCircle size={16} className="text-emerald-600" />}
                  </button>
                  <button title="Run Now">
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

/* -------- COMPONENTS -------- */

const Stat = ({ label, value, color }) => (
  <Card className="p-4">
    <p className="text-xs text-slate-500">{label}</p>
    <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
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
      <input
        placeholder="Customer Name"
        className="w-full border p-2 rounded"
        onChange={e => setForm({ ...form, customer: e.target.value })}
      />
      <input
        placeholder="Amount"
        className="w-full border p-2 rounded"
        onChange={e => setForm({ ...form, amount: +e.target.value })}
      />
      <select
        className="w-full border p-2 rounded"
        onChange={e => setForm({ ...form, frequency: e.target.value })}
      >
        <option>Monthly</option>
        <option>Quarterly</option>
        <option>Yearly</option>
      </select>
      <input
        type="date"
        className="w-full border p-2 rounded"
        onChange={e => setForm({ ...form, nextDate: e.target.value })}
      />

      <button
        onClick={() => onSave(form)}
        className="w-full bg-blue-600 text-white py-2 rounded font-bold"
      >
        Create Plan
      </button>
    </div>
  );
};

export default RecurringInvoicesView;
