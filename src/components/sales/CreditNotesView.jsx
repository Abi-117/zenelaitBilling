import { useState } from 'react';
import {
  Plus,
  FileMinus,
  IndianRupee,
  RefreshCw,
  ArrowRight,
  Search
} from 'lucide-react';
import Card from '../ui/Card';
import CreateCreditNoteModal from './CreateCreditNoteModal';

const CreditNotesView = () => {
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  const [credits, setCredits] = useState([
    {
      id: 'CN-3001',
      invoice: 'INV-5001',
      customer: 'Stark Industries',
      amount: 4200,
      balance: 4200,
      status: 'Open',
      date: '2026-01-12'
    },
    {
      id: 'CN-3002',
      invoice: 'INV-5002',
      customer: 'Wayne Enterprises',
      amount: 2500,
      balance: 0,
      status: 'Applied',
      date: '2026-01-05'
    }
  ]);

  const applyCredit = (id) => {
    setCredits(prev =>
      prev.map(c =>
        c.id === id
          ? { ...c, balance: 0, status: 'Applied' }
          : c
      )
    );
  };

  const refundCredit = (id) => {
    setCredits(prev =>
      prev.map(c =>
        c.id === id
          ? { ...c, balance: 0, status: 'Refunded' }
          : c
      )
    );
  };

  const filteredCredits = credits.filter(c =>
    (statusFilter === 'All' || c.status === statusFilter) &&
    c.customer.toLowerCase().includes(search.toLowerCase())
  );

  const openCount = credits.filter(c => c.status === 'Open').length;
  const appliedCount = credits.filter(c => c.status === 'Applied').length;
  const totalValue = credits.reduce((a, b) => a + b.amount, 0);

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Credit Notes</h2>
          <p className="text-sm text-slate-500">
            Returns, refunds & post-invoice adjustments
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={16} /> New Credit Note
        </button>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Summary label="Open Credits" value={openCount} color="amber" />
        <Summary label="Applied Credits" value={appliedCount} color="emerald" />
        <Summary label="Total Credit Value" value={`₹${totalValue}`} color="blue" />
      </div>

      {/* FILTER BAR */}
      <div className="flex justify-between items-center">
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
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option>All</option>
          <option>Open</option>
          <option>Applied</option>
          <option>Refunded</option>
        </select>
      </div>

      {/* TABLE */}
      <Card className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="p-4 text-left">Credit Note</th>
              <th className="p-4 text-left">Invoice</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-right">Amount</th>
              <th className="p-4 text-right">Balance</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCredits.map(cn => (
              <tr key={cn.id} className="border-t hover:bg-slate-50">
                <td className="p-4 font-medium flex items-center gap-2">
                  <FileMinus size={14} />
                  {cn.id}
                </td>
                <td className="p-4">{cn.invoice}</td>
                <td className="p-4">{cn.customer}</td>
                <td className="p-4 text-right flex justify-end gap-1">
                  <IndianRupee size={14} /> {cn.amount}
                </td>
                <td className="p-4 text-right font-semibold">
                  ₹{cn.balance}
                </td>
                <td className="p-4 text-center">
                  <StatusBadge status={cn.status} />
                </td>
                <td className="p-4 text-center">{cn.date}</td>
                <td className="p-4 text-right space-x-2">
                  {cn.status === 'Open' && (
                    <button onClick={() => applyCredit(cn.id)} title="Apply">
                      <ArrowRight size={16} className="text-blue-600" />
                    </button>
                  )}
                  {cn.status !== 'Refunded' && (
                    <button onClick={() => refundCredit(cn.id)} title="Refund">
                      <RefreshCw size={16} className="text-emerald-600" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {showModal && (
        <CreateCreditNoteModal
          onClose={() => setShowModal(false)}
          onSave={(data) =>
            setCredits(prev => [
              ...prev,
              {
                id: `CN-${Date.now()}`,
                status: 'Open',
                balance: data.amount,
                ...data
              }
            ])
          }
        />
      )}
    </div>
  );
};

/* ---- SMALL COMPONENTS ---- */

const Summary = ({ label, value, color }) => (
  <Card className="p-4">
    <p className="text-xs text-slate-500">{label}</p>
    <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
  </Card>
);

const StatusBadge = ({ status }) => {
  const map = {
    Open: 'bg-amber-100 text-amber-700',
    Applied: 'bg-emerald-100 text-emerald-700',
    Refunded: 'bg-slate-200 text-slate-700'
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${map[status]}`}>
      {status}
    </span>
  );
};

export default CreditNotesView;
