import { useState, useEffect } from 'react';
import PricingTab from './PricingTab';
import TaxTab from './TaxTab';
import InventoryTab from './InventoryTab';
import BarcodeTab from './BarcodeTab';
import LowStockRulesTab from './LowStockRulesTab';

const tabs = ['Pricing', 'Tax', 'Inventory', 'Barcode', 'Low Stock'];

const ProductDetailsView = ({ product }) => {
  // Local tab state
  const [activeTab, setActiveTab] = useState('Pricing');

  // Reset active tab when product changes
  useEffect(() => {
    if (product?.name) {
      setActiveTab('Pricing'); // default to Pricing tab for new product
    }
  }, [product]);

  // Handle case when no product is selected
  if (!product || !product.name) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <p className="text-gray-500">No product selected</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      {/* Product Name */}
      <h2 className="text-xl font-bold">{product.name}</h2>

      {/* Tabs */}
      <div className="flex gap-4 border-b mt-4">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 font-semibold text-sm ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'border-b-2 border-transparent text-slate-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 'Pricing' && <PricingTab product={product} />}
        {activeTab === 'Tax' && <TaxTab product={product} />}
        {activeTab === 'Inventory' && <InventoryTab product={product} />}
        {activeTab === 'Barcode' && <BarcodeTab product={product} />}
        {activeTab === 'Low Stock' && <LowStockRulesTab product={product} />}
      </div>
    </div>
  );
};

export default ProductDetailsView;
