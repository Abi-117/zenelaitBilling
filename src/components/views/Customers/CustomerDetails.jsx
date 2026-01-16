// CustomerDetails.jsx
import { useState } from 'react';
import Modal from '../../ui/Modal';
import OverviewTab from './OverviewTab';
import TransactionsTab from './TransactionsTab';
import StatementTab from './StatementTab';
import MailsTab from './MailsTab';

const tabs = ['Overview', 'Transactions', 'Statement', 'Mails'];

const CustomerDetails = ({ customer, onAddCustomer }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [addOpen, setAddOpen] = useState(false);

  // NO CUSTOMER → show add customer screen
  if (!customer) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-xl shadow max-w-md w-full">
          <h2 className="text-xl font-bold mb-2">Add New Customer</h2>
          <p className="text-sm text-slate-500 mb-6">
            Create a customer to start billing, invoicing & tracking
          </p>

          <button
            onClick={() => setAddOpen(true)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold"
          >
            + Create Customer
          </button>

          <Modal
            isOpen={addOpen}
            onClose={() => setAddOpen(false)}
            title="New Customer"
          >
            <AddCustomerForm
              onSave={(data) => {
                onAddCustomer(data);
                setAddOpen(false);
              }}
            />
          </Modal>
        </div>
      </div>
    );
  }

  // CUSTOMER SELECTED → show details
  return (
    <div className="h-full flex flex-col bg-white">
      {/* HEADER */}
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">{customer?.name || 'No Name'}</h2>
        <p className="text-xs text-slate-500">{customer?.email || '-'}</p>
      </div>

      {/* TABS */}
      <div className="px-6 flex space-x-6 border-b text-sm">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`py-3 ${
              activeTab === t
                ? 'border-b-2 border-blue-600 font-bold'
                : 'text-slate-500'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="p-6 flex-1 overflow-y-auto bg-slate-50">
        {activeTab === 'Overview' && <OverviewTab customer={customer} />}
        {activeTab === 'Transactions' && <TransactionsTab customer={customer} />}
        {activeTab === 'Statement' && <StatementTab customer={customer} />}
        {activeTab === 'Mails' && <MailsTab customer={customer} />}
      </div>
    </div>
  );
};

export default CustomerDetails;

// -------------------------
// Add Customer Form
const AddCustomerForm = ({ onSave }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    gstin: '',
    billingAddress: '',
    creditLimit: 0,
  });

  return (
    <div className="space-y-3 text-sm">
      <input
        placeholder="Customer Name"
        className="w-full border p-2 rounded"
        onChange={e => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="Email"
        className="w-full border p-2 rounded"
        onChange={e => setForm({ ...form, email: e.target.value })}
      />
      <input
        placeholder="Phone"
        className="w-full border p-2 rounded"
        onChange={e => setForm({ ...form, phone: e.target.value })}
      />
      <input
        placeholder="GSTIN"
        className="w-full border p-2 rounded"
        onChange={e => setForm({ ...form, gstin: e.target.value })}
      />
      <input
        placeholder="Billing Address"
        className="w-full border p-2 rounded"
        onChange={e => setForm({ ...form, billingAddress: e.target.value })}
      />
      <input
        type="number"
        placeholder="Credit Limit"
        className="w-full border p-2 rounded"
        onChange={e => setForm({ ...form, creditLimit: Number(e.target.value) })}
      />

      <button
        onClick={() => onSave({ id: Date.now(), ...form })}
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold"
      >
        Save Customer
      </button>
    </div>
  );
};
