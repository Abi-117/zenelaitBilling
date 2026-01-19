import { useState } from 'react';
import PurchaseBillsView from './PurchaseBillsView';
import GRNView from './GRNView';
import PurchaseReturnsView from './PurchaseReturnsView';
import SupplierLedgerView from './SupplierLedgerView';
import SupplierOutstandingView from './SupplierOutstandingView';

const PurchasesView = () => {
  const [activeTab, setActiveTab] = useState('bills');
   const [purchaseBills, setPurchaseBills] = useState([]);

  const tabs = [
    { id: 'bills', label: 'Purchase Bills' },
    { id: 'grn', label: 'GRN' },
    { id: 'returns', label: 'Purchase Returns' },
    { id: 'ledger', label: 'Supplier Ledger' },
    { id: 'outstanding', label: 'Outstanding' },
  ];

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Purchases</h1>
        <p className="text-sm text-slate-500">
          Manage suppliers, GRNs, purchase bills and payables
        </p>
      </div>

      {/* TABS */}
      <div className="flex gap-6 border-b">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-2 text-sm font-semibold border-b-2 transition
              ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div>
        {activeTab === 'bills' && <PurchaseBillsView />}
        {activeTab === 'grn' && <GRNView />}
        {activeTab === 'returns' && <PurchaseReturnsView />}
        {activeTab === 'ledger' && <SupplierLedgerView />}
        {activeTab === 'outstanding' && <SupplierOutstandingView />}
      </div>

    </div>
  );
};

export default PurchasesView;
