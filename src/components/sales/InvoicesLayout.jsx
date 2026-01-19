import { useState } from 'react';
import InvoiceEditorView from './InvoiceEditorView';
import InvoicePreviewPanel from './InvoicePreviewPanel';

const InvoicesLayout = () => {
  const [mode, setMode] = useState('edit'); // edit | preview
  const [invoice, setInvoice] = useState({
    id: 'INV-001',
    customerName: '',
    date: '',
    items: [],
    gstRate: 18,      // GST percentage editable
    subtotal: 0,
    tax: 0,
    total: 0
  });

  // Calculate totals based on GST %
  const calculateTotals = (inv) => {
    const subtotal = inv.items.reduce((sum, i) => sum + i.qty * i.rate, 0);
    const tax = subtotal * (inv.gstRate / 100);
    return { subtotal, tax, total: subtotal + tax };
  };

  const handleInvoiceChange = (updatedInvoice) => {
    const totals = calculateTotals(updatedInvoice);
    setInvoice({ ...updatedInvoice, ...totals });
  };

  return (
    <div className="h-full flex flex-col">

      {/* Action Bar */}
      <div className="flex gap-3 p-4 border-b bg-white">
        <button onClick={() => setMode('edit')} className="btn">Edit</button>
        <button onClick={() => alert('Invoice Saved')} className="btn">Save</button>
        <button onClick={() => setMode('preview')} className="btn btn-primary">Preview</button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-hidden">
        {mode === 'edit' ? (
          <InvoiceEditorView
            invoice={invoice}
            onChange={handleInvoiceChange}
          />
        ) : (
          <InvoicePreviewPanel invoice={invoice} onBack={() => setMode('edit')} />
        )}
      </div>
    </div>
  );
};

export default InvoicesLayout;
