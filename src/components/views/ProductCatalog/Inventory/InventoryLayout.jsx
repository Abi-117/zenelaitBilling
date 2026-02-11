import { useState } from 'react';
import StockView from './StockView';
import BatchManagementView from './BatchManagementView';
import ExpiryTrackingView from './ExpiryTrackingView';
import StockAdjustmentView from './StockAdjustmentView';
import StockValuationView from './StockValuationView';

const InventoryLayout = () => {
  const [activeTab, setActiveTab] = useState('stock');

  const tabs = [
    { id: 'stock', label: 'Stock In / Out' },
    { id: 'batch', label: 'Batch Management' },
    { id: 'expiry', label: 'Expiry Tracking' },
    //{ id: 'adjustment', label: 'Stock Adjustment' },
    { id: 'valuation', label: 'Stock Valuation' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Inventory</h1>

      <div className="flex gap-6 border-b">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-2 text-sm font-semibold border-b-2 ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'stock' && <StockView />}
      {activeTab === 'batch' && <BatchManagementView />}
      {activeTab === 'expiry' && <ExpiryTrackingView />}
      {/* {activeTab === 'adjustment' && <StockAdjustmentView />} */}
      {activeTab === 'valuation' && <StockValuationView />}
    </div>
  );
};

export default InventoryLayout;
