import { useState, useEffect } from 'react';

import SalesReportsView from './SalesReportsView';
import PaymentAgingReportsView from './PaymentAgingReportsView';
import TaxReportsView from './TaxReportsView';
import AIInsightsForecastingView from './AIInsightsForecastingView';
import UserManagementView from './UserManagementView';

import StockReportsView from './StockReportsView';
import ProfitLossReportsView from './ProfitLossReportsView';
import ExpenseReportsView from './ExpenseReportsView';
import LedgerReportsView from './LedgerReportsView';
import OutstandingReportsView from './OutstandingReportsView';

const ReportsView = ({ defaultTab = 'sales' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const tabs = [
    { id: 'sales', label: 'Sales' },
    { id: 'payments', label: 'Payment Aging' },
    { id: 'tax', label: 'GST / Tax' },
    { id: 'stock', label: 'Stock' },
    { id: 'pl', label: 'Profit & Loss' },
    { id: 'expense', label: 'Expenses' },
    { id: 'ledger', label: 'Ledger' },
    { id: 'outstanding', label: 'Outstanding' },
    { id: 'ai', label: 'AI Insights' },
    { id: 'users', label: 'Users & Staff' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Reports & Management</h1>
        <p className="text-sm text-slate-500">
          Business reports, compliance, analytics & user control
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-2 whitespace-nowrap text-sm font-semibold border-b-2 transition ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'sales' && <SalesReportsView />}
      {activeTab === 'payments' && <PaymentAgingReportsView />}
      {activeTab === 'tax' && <TaxReportsView />}
      {activeTab === 'stock' && <StockReportsView />}
      {activeTab === 'pl' && <ProfitLossReportsView />}
      {activeTab === 'expense' && <ExpenseReportsView />}
      {activeTab === 'ledger' && <LedgerReportsView />}
      {activeTab === 'outstanding' && <OutstandingReportsView />}
      {activeTab === 'ai' && <AIInsightsForecastingView />}
      {activeTab === 'users' && <UserManagementView />}
    </div>
  );
};

export default ReportsView;
