import React from "react";

const InvoiceListView = ({ invoices = [], selectedInvoice, onSelect, onCreate }) => {

  const getKey = (inv, idx) =>
    inv._id ?? inv.invoiceNo ?? `invoice-${idx}`;

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 flex justify-between items-center font-bold">
        Invoices
        <button
          className="bg-blue-600 text-white px-2 py-1 rounded text-sm"
          onClick={onCreate}
        >
          + New
        </button>
      </div>

      {Array.isArray(invoices) && invoices.map((inv, idx) => (
        <div
          key={getKey(inv, idx)}
          onClick={() => onSelect(inv)}
          className={`px-4 py-3 cursor-pointer border-b hover:bg-slate-100 ${
            selectedInvoice?._id === inv._id ? "bg-slate-200" : ""
          }`}
        >
          <p className="font-medium text-blue-600">
            {inv.invoiceNo || "No ID"}
          </p>
          <p className="text-xs text-slate-500">
            {inv.customerName || "-"}
          </p>
          <p className="text-xs font-semibold">
            ₹{inv.total ?? 0}
          </p>
        </div>
      ))}
    </div>
  );
};

export default InvoiceListView;
