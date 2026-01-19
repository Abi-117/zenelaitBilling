import { useState } from 'react';
import InvoiceListView from './InvoiceListView';
import InvoiceDetailsPanel from './InvoiceDetailsPanel';
import InvoiceEditorView from './InvoiceEditorView';
import InvoicePreviewPanel from './InvoicePreviewPanel';

// Function to generate dummy invoices (same as your code)
const generateDummyInvoices = (count = 10) => {
  const invoices = [];
  for (let i = 1; i <= count; i++) {
    const items = [
      { name: 'Product A', qty: 2, rate: 500 },
      { name: 'Product B', qty: 1, rate: 1000 },
    ];
    const subtotal = items.reduce((sum, item) => sum + item.qty * item.rate, 0);
    const tax = subtotal * 0.18;
    invoices.push({
      id: `INV-${1000 + i}`,
      customerName: `Customer ${i}`,
      date: `2026-01-${i < 10 ? '0' + i : i}`,
      items,
      subtotal,
      tax,
      total: subtotal + tax,
      status: i % 3 === 0 ? 'Paid' : i % 3 === 1 ? 'Sent' : 'Draft',
      customerEmail: `customer${i}@example.com`,
      gstin: `GSTIN000${i}`,
      gstRate: 18,
    });
  }
  return invoices;
};

const InvoicesView = () => {
  const [invoices, setInvoices] = useState(generateDummyInvoices());
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [mode, setMode] = useState('details'); // details | edit | preview
  const [panelSize, setPanelSize] = useState({ width: 400, height: '100%' }); // NEW state

  const handleSelect = (inv) => {
    setSelectedInvoice(inv);
    setEditingInvoice(null);
    setMode('details');
  };

  const handleCreate = () => {
    const newInvoice = {
      id: `INV-${Date.now()}`,
      customerName: '',
      date: '',
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      status: 'Draft'
    };
    setEditingInvoice(newInvoice);
    setMode('edit');
  };

  const handleEdit = (inv) => {
    setEditingInvoice(inv);
    setMode('edit');
  };

  const handleSave = (updated) => {
    const subtotal = updated.items.reduce((sum, i) => sum + i.qty * i.rate, 0);
    const tax = subtotal * 0.18;
    updated.subtotal = subtotal;
    updated.tax = tax;
    updated.total = subtotal + tax;

    setInvoices(prev => {
      const exists = prev.find(i => i.id === updated.id);
      if (exists) return prev.map(i => i.id === updated.id ? updated : i);
      return [...prev, updated];
    });

    setEditingInvoice(null);
    setSelectedInvoice(updated);
    setMode('details');
  };

  const handleSend = (inv) => {
    const updated = { ...inv, status: 'Sent' };
    setInvoices(prev => prev.map(i => i.id === inv.id ? updated : i));
    setSelectedInvoice(updated);
    alert(`Invoice ${inv.id} mailed successfully`);
  };

  const handlePayment = (inv) => {
    const updated = { ...inv, status: 'Paid' };
    setInvoices(prev => prev.map(i => i.id === inv.id ? updated : i));
    setSelectedInvoice(updated);
  };

  const handlePDF = (inv) => alert(`PDF generated for ${inv.id}`);

  if (editingInvoice) {
    return (
      <InvoiceEditorView
        invoice={editingInvoice}
        onChange={setEditingInvoice}
        onBack={() => setEditingInvoice(null)}
        onSave={handleSave}
      />
    );
  }

  return (
    <div className="flex h-full">
  {/* Left List */}
  <div className="w-[400px] border-r">
    <InvoiceListView
      invoices={invoices}
      selectedInvoice={selectedInvoice}
      onSelect={handleSelect}
      onCreate={handleCreate}
    />
  </div>

  {/* Right Panel */}
  <div className="flex-1 bg-slate-50">
    {selectedInvoice ? (
      mode === 'details' ? (
        <InvoiceDetailsPanel
          invoice={selectedInvoice}
          onEdit={() => handleEdit(selectedInvoice)}
          onSend={() => handleSend(selectedInvoice)}
          onPayment={() => handlePayment(selectedInvoice)}
          onPDF={() => handlePDF(selectedInvoice)}
          onClose={() => setSelectedInvoice(null)}
          onPreview={() => setMode('preview')}
        />
      ) : (
        <InvoicePreviewPanel
          invoice={selectedInvoice}
          onBack={() => setMode('details')}
        />
      )
    ) : (
      <div className="h-full flex items-center justify-center text-slate-400">
        Select an invoice
      </div>
    )}
  </div>
</div>

  );
};

export default InvoicesView;
