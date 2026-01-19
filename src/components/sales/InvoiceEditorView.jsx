import React from 'react';
import { ArrowLeft } from 'lucide-react';

const InvoiceEditorPanel = ({ invoice, onChange, onBack, onSave }) => {
  const updateItem = (i, key, value) => {
    const items = [...invoice.items];
    items[i][key] = value;
    onChange({ ...invoice, items });
  };

  const addItem = () => {
    onChange({ ...invoice, items: [...invoice.items, { name: '', qty: 1, rate: 0 }] });
  };

  const deleteItem = (i) => {
    const items = invoice.items.filter((_, index) => index !== i);
    onChange({ ...invoice, items });
  };

  // Calculate totals
  const subtotal = invoice.items.reduce((sum, item) => sum + item.qty * item.rate, 0);
  const tax = (subtotal * (invoice.gstRate || 0)) / 100;
  const total = subtotal + tax;

  return (
    <div className="p-6 bg-white border-r h-full flex flex-col justify-between">

      {/* Back & Save Buttons */}
      <div className="flex gap-2 mb-4">
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-slate-500">
          <ArrowLeft size={16} /> Back
        </button>
        <button
          onClick={() => onSave({ ...invoice, subtotal, tax, total })}
          className="btn bg-blue-600 text-white px-3 py-1 rounded"
        >
          Save
        </button>
      </div>

      {/* Editable Invoice Info */}
      <div className="space-y-2 flex-1 overflow-auto">
        <input
          type="text"
          placeholder="Invoice ID"
          value={invoice.id}
          onChange={e => onChange({ ...invoice, id: e.target.value })}
          className="input border px-2 py-1 rounded w-full"
        />
        <input
          type="text"
          placeholder="Customer Name"
          value={invoice.customerName}
          onChange={e => onChange({ ...invoice, customerName: e.target.value })}
          className="input border px-2 py-1 rounded w-full"
        />
        <input
          type="date"
          value={invoice.date}
          onChange={e => onChange({ ...invoice, date: e.target.value })}
          className="input border px-2 py-1 rounded w-full"
        />
        <input
          type="text"
          placeholder="GSTIN"
          value={invoice.gstin || ''}
          onChange={e => onChange({ ...invoice, gstin: e.target.value })}
          className="input border px-2 py-1 rounded w-full"
        />
        <div className="flex gap-2 items-center">
          <label className="font-semibold">GST %:</label>
          <input
            type="number"
            className="border rounded px-2 py-1 w-20"
            value={invoice.gstRate}
            onChange={e => onChange({ ...invoice, gstRate: +e.target.value })}
          />
        </div>

        {/* Items Table */}
        <table className="w-full text-sm border mt-2">
          <thead className="bg-slate-100">
            <tr>
              <th className="border p-2">Item</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Rate</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Action</th> {/* New column for delete */}
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, i) => (
              <tr key={i}>
                <td className="border p-2">
                  <input
                    value={item.name}
                    onChange={e => updateItem(i, 'name', e.target.value)}
                    className="input border px-1 py-1 rounded w-full"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={item.qty}
                    onChange={e => updateItem(i, 'qty', +e.target.value)}
                    className="input border px-1 py-1 rounded w-full"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={item.rate}
                    onChange={e => updateItem(i, 'rate', +e.target.value)}
                    className="input border px-1 py-1 rounded w-full"
                  />
                </td>
                <td className="border p-2">₹{(item.qty * item.rate).toFixed(2)}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => deleteItem(i)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={addItem} className="btn mt-2 bg-green-500 text-white px-2 py-1 rounded">
          + Add Item
        </button>

        {/* Totals */}
        <div className="mt-4 flex flex-col gap-1 text-right text-gray-700">
          <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
          <p>GST ({invoice.gstRate || 0}%): ₹{tax.toFixed(2)}</p>
          <p className="font-bold text-lg">Total: ₹{total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceEditorPanel;
