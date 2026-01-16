import { useState } from 'react';
import InvoiceListView from './InvoiceListView';
import InvoiceEditorView from './InvoiceEditorView';
import InvoiceDetailsPanel from './InvoiceDetailsPanel';
import { INITIAL_INVOICES } from '../../data/invoices.data';
import { generateInvoicePDF } from '../../utils/invoicePdf';


const InvoicesView = () => {
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [editingInvoice, setEditingInvoice] = useState(null);

  // 🔹 SELECT / VIEW
  const handleSelect = (inv) => setSelectedInvoice(inv);

  // 🔹 CREATE
  const handleCreate = () => {
    setEditingInvoice({});
  };

  // 🔹 EDIT
  const handleEdit = (inv) => {
    setEditingInvoice(inv);
  };

  // 🔹 SAVE (Editor)
  const handleSave = (updated) => {
    setInvoices((prev) => {
      const exists = prev.find(i => i.id === updated.id);
      if (exists) {
        return prev.map(i => (i.id === updated.id ? updated : i));
      }
      return [...prev, updated];
    });
    setEditingInvoice(null);
    setSelectedInvoice(updated);
  };

  // 🔹 SEND
  const handleSend = (inv) => {
  if (inv.status === 'Sent' || inv.status === 'Paid') return;

  const updatedInvoice = { ...inv, status: 'Sent' };

  setInvoices(prev =>
    prev.map(i => (i.id === inv.id ? updatedInvoice : i))
  );

  setSelectedInvoice(updatedInvoice);

  alert(`Invoice ${inv.id} sent successfully`);
};


  // 🔹 RECORD PAYMENT
  const handlePayment = (inv) => {
    setInvoices(prev =>
      prev.map(i =>
        i.id === inv.id ? { ...i, status: 'Paid' } : i
      )
    );
    setSelectedInvoice({ ...inv, status: 'Paid' });
  };

const handlePDF = (inv) => {
  generateInvoicePDF({
    ...inv,
    items: [
      {
        name: "Consulting Service",
        qty: 1,
        rate: inv.total,
        tax: 18,
        total: inv.total
      }
    ],
    subtotal: inv.total,
    taxAmount: 0,
    total: inv.total
  });
};


  if (editingInvoice) {
    return (
      <InvoiceEditorView
        invoice={editingInvoice}
        onBack={() => setEditingInvoice(null)}
        onSave={handleSave}
      />
    );
  }

  return (
    <div className="flex h-full">
      <div className="w-[420px] border-r">
        <InvoiceListView
          invoices={invoices}
          selectedInvoice={selectedInvoice}
          onSelect={handleSelect}
          onCreate={handleCreate}
          onEdit={handleEdit}
          onSend={handleSend}
          onPDF={handlePDF}
        />
      </div>

      <div className="flex-1 bg-slate-50">
        {selectedInvoice ? (
          <InvoiceDetailsPanel
            invoice={selectedInvoice}
            onEdit={() => handleEdit(selectedInvoice)}
            onSend={() => handleSend(selectedInvoice)}
            onPDF={() => handlePDF(selectedInvoice)}
            onPayment={() => handlePayment(selectedInvoice)}
          />
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
