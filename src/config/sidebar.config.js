import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  ShoppingBag,
  ShoppingCart,
  Clock,
  PieChart,
  Box,
  Boxes,
  Calendar,
  Package
} from 'lucide-react';

export const SIDEBAR_STRUCTURE = [
  {
    label: 'Dashboard',
    id: 'dashboard',
    icon: LayoutDashboard
  },
  {
    label: 'Customers',
    id: 'customers',
    icon: Users
  },
  {
  label: 'Sales',
  id: 'sales',
  icon: FileText,
  children: [
    { label: 'Estimates / Quotes', id: 'estimates' },
    { label: 'Invoices', id: 'invoices' },
    { label: 'Recurring Invoices', id: 'recurring-invoices' },
    { label: 'Credit Notes', id: 'credit-notes' }
  ]
}
,
{
  label: 'Purchases',
  id:'purchases',
  icon: ShoppingCart
  
}
,
  {
    label: 'Product Catalog',
    id: 'product-catalog',
    icon: Box,
    children: [
      {
        label: 'Items',
        id: 'items'
      },
      {
        label: 'Subscription Items',
        id: 'subscription-items'
      },
      {
        id: 'inventory',
        label: 'Inventory',
        icon: Boxes,
        children: [
          { id: 'stock', label: 'Stock In / Out' },
          { id: 'batch', label: 'Batch Management' },
          { id: 'expiry', label: 'Expiry Tracking' },
          { id: 'adjustment', label: 'Stock Adjustment' },
          { id: 'valuation', label: 'Stock Valuation' },
        ],
      },
      {
        id: 'product',
        label: 'Product',
        icon: Package
      }
    ]
  },
  {
    label: 'Payments',
    id: 'payments',
    icon: CreditCard
  },
  {
    label: 'Expenses',
    id: 'expenses',
    icon: ShoppingBag
  },
  {
    label: 'Time Tracking',
    id: 'time',
    icon: Clock
  },
  {
  label: 'Events',
  id: 'events',
  icon: Calendar,
  
}
,
  {
    label: 'Reports',
    id: 'reports',
    icon: PieChart
  }
];
