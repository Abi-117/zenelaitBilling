import { useState } from 'react';
import { SIDEBAR_STRUCTURE } from '../config/sidebar.config';

import Sidebar from '../components/layout/Sidebar';
import DashboardView from '../components/views/Dashboard/DashboardView';
import EstimatesView from '../components/sales/EstimatesView';
import InvoicesView from '../components/sales/InvoicesView';
import RecurringInvoicesView from '../components/sales/RecurringInvoicesView';
import CreditNotesView from '../components/sales/CreditNotesView';
import PaymentsView from '../components/views/Payments/PaymentsView';
import ItemsView from '../components/views/ProductCatalog/ItemsView'; 
import SubscriptionItemsView from '../components/views/ProductCatalog/SubscriptionItemsView';
import ExpensesView from '../components/views/Expenses/ExpensesView';
import TimeTrackingView from '../components/views/TimeTracking/TimeTrackingView';
import EventsView from '../components/views/Events/EventsView';
import ReportsView from '../components/views/Reports/ReportsView';
import CustomersLayout from '../components/views/Customers/CustomersLayout';
import InventoryLayout from '../components/views/ProductCatalog/Inventory/InventoryLayout';
import ProductDetailsView from '../components/views/products/ProductDetailsView';
import PurchasesView from '../components/views/Purchases/PurchasesView';

const BillingApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const [selectedProduct, setSelectedProduct] = useState({
    id: 1,
    name: 'Test Product',
    type: 'Product',
    price: 4500,
    hsn: '8523',
    tax: 18,
    status: 'Active',
  });

  return (
    <div className="flex h-screen">
      <Sidebar
        menu={SIDEBAR_STRUCTURE}
        activeTab={activeTab}
        onSelect={setActiveTab}
      />

      <main className="flex-1 p-6 overflow-auto">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'customers' && <CustomersLayout />}
        {activeTab === 'estimates' && <EstimatesView />}
        {activeTab === 'invoices' && <InvoicesView />}
        {activeTab === 'purchases' && <PurchasesView />}
        {activeTab === 'recurring-invoices' && <RecurringInvoicesView />}
        {activeTab === 'credit-notes' && <CreditNotesView />}
        {activeTab === 'payments' && <PaymentsView />}
        {activeTab === 'expenses' && <ExpensesView />}
        {activeTab === 'time' && <TimeTrackingView />}
        {activeTab === 'events' && <EventsView />}
        {activeTab === 'inventory' && <InventoryLayout />}

        {activeTab === 'items' && (
          <ItemsView
            onSelectProduct={(product) => {
              setSelectedProduct(product);
              setActiveTab('product');
            }}
          />
        )}

        {activeTab === 'product' && (
          <ProductDetailsView
            product={selectedProduct || { name: 'No product selected' }}
          />
        )}

        {activeTab === 'subscription-items' && <SubscriptionItemsView />}
        {activeTab === 'reports' && <ReportsView />}
      </main>
    </div>
  );
};

export default BillingApp;
