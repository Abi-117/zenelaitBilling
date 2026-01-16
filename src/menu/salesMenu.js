import { FileText } from 'lucide-react';

export const salesMenu = {
  label: 'Sales',
  id: 'sales',
  icon: FileText,
  children: [
    { label: 'Estimates / Quotes', id: 'estimates' },
    { label: 'Invoices', id: 'invoices' },
    { label: 'Recurring Invoices', id: 'recurring_invoices' },
    { label: 'Credit Notes', id: 'credit_notes' }
  ]
};
