import { useState } from 'react';
import { Plus, Mail, Phone, FileText, MessageSquare, List, IndianRupee } from 'lucide-react';
import Card from '../../ui/Card';
import Modal from '../../ui/Modal';
import Badge from '../../ui/Badge';
import { INITIAL_CUSTOMERS } from '../../../data/customers.data';

export default function CustomersView() {
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [activeCustomer, setActiveCustomer] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [addOpen, setAddOpen] = useState(false);

  const addCustomer = (data) => {
    setCustomers([...customers, { id: Date.now(), ...data }]);
    setAddOpen(false);  // Close modal after save
  };

  return (
    <div className="flex h-[calc(100vh-80px)]">

      {/* LEFT LIST */}
      <div className="w-80 border-r bg-white">
        <div className="p-4 flex justify-between items-center">
          <h3 className="font-bold">All Customers</h3>
          <button
            onClick={() => setAddOpen(true)}
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="overflow-y-auto">
          {customers.map(c => (
            <div
              key={c.id}
              onClick={() => setActiveCustomer(c)}
              className={`p-4 cursor-pointer hover:bg-slate-50 ${activeCustomer?.id === c.id && 'bg-slate-100'}`}
            >
              <p className="font-medium">{c.name}</p>
              <p className="text-xs text-slate-500">₹{c.receivable || 0}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT DETAIL */}
      {activeCustomer ? (
        <div className="flex-1 bg-slate-50">

          {/* HEADER */}
          <div className="bg-white p-4 border-b">
            <h2 className="text-xl font-bold">{activeCustomer.name}</h2>
            <div className="flex space-x-6 mt-3 text-sm">
              <Tab label="Overview" icon={List} tab="overview" />
              <Tab label="Transactions" icon={IndianRupee} tab="transactions" />
              <Tab label="Comments" icon={MessageSquare} tab="comments" />
              <Tab label="Mails" icon={Mail} tab="mails" />
              <Tab label="Statement" icon={FileText} tab="statement" />
            </div>
          </div>

          {/* TAB CONTENT */}
          <div className="p-6">
            {activeTab === 'overview' && <Overview c={activeCustomer} />}
            {activeTab === 'transactions' && <Transactions c={activeCustomer} />}
            {activeTab === 'comments' && <Comments />}
            {activeTab === 'mails' && <Mails />}
            {activeTab === 'statement' && <Statement />}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-400">Select a customer</div>
      )}

      {/* ADD CUSTOMER MODAL */}
      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="New Customer">
        <AddCustomerForm onSave={addCustomer} onCancel={() => setAddOpen(false)} />
      </Modal>
    </div>
  );

  function Tab({ label, icon: Icon, tab }) {
    return (
      <button
        onClick={() => setActiveTab(tab)}
        className={`flex items-center space-x-1 ${activeTab === tab ? 'text-blue-600 font-bold' : 'text-slate-500'}`}
      >
        <Icon size={14} />
        <span>{label}</span>
      </button>
    );
  }
}

/* ---------------- TAB COMPONENTS ---------------- */

function Overview({ c }) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <Card className="p-4">
        <h4 className="font-bold mb-2">Receivables</h4>
        <p className="text-2xl font-bold">₹{c.receivable || 0}</p>
        <p className="text-xs text-slate-500">Unused credit: ₹{c.unusedCredit || 0}</p>
      </Card>

      <Card className="p-4">
        <h4 className="font-bold mb-2">Customer Info</h4>
        <p><Mail size={14} className="inline mr-1" /> {c.email || '—'}</p>
        <p><Phone size={14} className="inline mr-1" /> {c.phone || '—'}</p>
        <p>PAN: {c.pan || '—'}</p>
        <p>GSTIN: {c.gstin || '—'}</p>
      </Card>
    </div>
  );
}

function Transactions({ c }) {
  return (
    <Card className="p-4">
      <h4 className="font-bold mb-4">Sales History</h4>
      {c.salesHistory?.length ? (
        c.salesHistory.map(inv => (
          <div key={inv.id} className="flex justify-between items-center border-b py-2 text-sm">
            <span>{inv.id}</span>
            <span>₹{inv.amount.toLocaleString()}</span>
            <Badge status={inv.status} />
          </div>
        ))
      ) : (
        <p className="text-sm text-slate-500">No transactions found</p>
      )}
    </Card>
  );
}

function Comments() { return <Card className="p-4">Internal notes & timeline</Card>; }
function Mails() { return <Card className="p-4">Invoice emails history</Card>; }
function Statement() { return <Card className="p-4">Customer statement + download</Card>; }

/* ---------------- ADD CUSTOMER ---------------- */

function AddCustomerForm({ onSave, onCancel }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', gstin: '', pan: '', billingAddress: '',
    creditLimit: 0, receivable: 0, unusedCredit: 0
  });
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!form.name) return setError('Customer name is required');
    onSave(form);
    setForm({
      name: '', email: '', phone: '', gstin: '', pan: '', billingAddress: '',
      creditLimit: 0, receivable: 0, unusedCredit: 0
    });
    setError('');
  };

  return (
    <div className="space-y-3">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <input
        className="border px-3 py-2 rounded w-full"
        placeholder="Customer Name*"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />
      <input
        className="border px-3 py-2 rounded w-full"
        placeholder="Email"
        type="email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
      />
      <input
        className="border px-3 py-2 rounded w-full"
        placeholder="Phone"
        value={form.phone}
        onChange={e => setForm({ ...form, phone: e.target.value })}
      />
      <input
        className="border px-3 py-2 rounded w-full"
        placeholder="GSTIN"
        value={form.gstin}
        onChange={e => setForm({ ...form, gstin: e.target.value })}
      />
      <input
        className="border px-3 py-2 rounded w-full"
        placeholder="PAN"
        value={form.pan}
        onChange={e => setForm({ ...form, pan: e.target.value })}
      />
      <input
        className="border px-3 py-2 rounded w-full"
        placeholder="Billing Address"
        value={form.billingAddress}
        onChange={e => setForm({ ...form, billingAddress: e.target.value })}
      />
      <input
        className="border px-3 py-2 rounded w-full"
        placeholder="Credit Limit"
        type="number"
        min={0}
        value={form.creditLimit}
        onChange={e => setForm({ ...form, creditLimit: +e.target.value })}
      />
      <input
        className="border px-3 py-2 rounded w-full"
        placeholder="Opening Outstanding"
        type="number"
        min={0}
        value={form.receivable}
        onChange={e => setForm({ ...form, receivable: +e.target.value })}
      />

      {/* Buttons */}
      <div className="flex justify-end gap-2 mt-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Save Customer
        </button>
      </div>
    </div>
  );
}
