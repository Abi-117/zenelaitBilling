import { useEffect, useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import Modal from '../../ui/Modal';
import OverviewTab from './OverviewTab';
import TransactionsTab from './TransactionsTab';
import StatementTab from './StatementTab';
import MailsTab from './MailsTab';

const tabs = ['Overview', 'Transactions', 'Statement', 'Mails'];

const CustomerDetails = ({ customer, onAddCustomer, onClose }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [addOpen, setAddOpen] = useState(false);

  /* ✅ LOCAL CUSTOMER STATE (IMPORTANT) */
  const [currentCustomer, setCurrentCustomer] = useState(customer);

  /* 🔄 When selected customer changes */
  useEffect(() => {
    setCurrentCustomer(customer);
  }, [customer]);

  /* ---------------- NO CUSTOMER ---------------- */
  if (!currentCustomer) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
          <h2 className="text-xl font-bold mb-2">Add New Customer</h2>

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

  /* ---------------- CUSTOMER DETAILS ---------------- */
  return (
    <div className="h-full flex flex-col bg-white">

      {/* HEADER */}
      <div className="p-6 border-b flex justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onClose}>
            <ArrowLeft size={18} />
          </button>

          <div>
            <h2 className="text-xl font-bold">
              {currentCustomer.name}
            </h2>
            <p className="text-xs text-slate-500">
              {currentCustomer.email}
            </p>
          </div>
        </div>

        <button onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      {/* TABS */}
      <div className="px-6 flex gap-6 border-b text-sm">
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

        {activeTab === 'Overview' && (
          <OverviewTab
            customer={currentCustomer}
            onUpdate={(updatedCustomer) => {
              setCurrentCustomer(updatedCustomer);
            }}
          />
        )}

        {activeTab === 'Transactions' && (
          <TransactionsTab customer={currentCustomer} />
        )}

        {activeTab === 'Statement' && (
          <StatementTab customer={currentCustomer} />
        )}

        {activeTab === 'Mails' && <MailsTab />}

      </div>
    </div>
  );
};

export default CustomerDetails;

/* ---------------- ADD CUSTOMER FORM ---------------- */

const AddCustomerForm = ({ onSave }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    gstin: '',
    billingAddress: '',
    creditLimit: 0,
    outstanding: 0,
    paymentTerms: 'Net 30',
    salesHistory: [],
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
        onChange={e =>
          setForm({ ...form, billingAddress: e.target.value })
        }
      />
      <input
        type="number"
        placeholder="Credit Limit"
        className="w-full border p-2 rounded"
        onChange={e =>
          setForm({ ...form, creditLimit: Number(e.target.value) })
        }
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
