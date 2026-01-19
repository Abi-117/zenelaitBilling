import React from 'react';

const InvoiceListView = ({ invoices, selectedInvoice, onSelect, onCreate }) => (
  <div className="h-full overflow-y-auto">
    <div className="p-4 flex justify-between items-center font-bold">
      Invoices
      <button
        className="btn btn-sm bg-blue-600 text-white px-2 py-1 rounded"
        onClick={onCreate}
      >
        + New
      </button>
    </div>

    {invoices.map(inv => (
      <div
        key={inv.id}
        onClick={() => onSelect(inv)}
        className={`px-4 py-3 cursor-pointer border-b hover:bg-slate-100 ${
          selectedInvoice?.id === inv.id ? 'bg-slate-200' : ''
        }`}
      >
        <p className="font-medium text-blue-600">{inv.id}</p>
        <p className="text-xs text-slate-500">{inv.customerName}</p>
        <p className="text-xs">₹{inv.total}</p>
      </div>
    ))}
  </div>
);

export default InvoiceListView;
