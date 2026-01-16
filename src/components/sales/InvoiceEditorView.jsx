import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, FileText } from 'lucide-react';
import { generateInvoicePDF } from '../../utils/invoicePdf';

const EMPTY_ITEM = {
  name: '',
  hsn: '',
  qty: 1,
  rate: 0,
  tax: 18,
  total: 0,
};

const InvoiceEditorView = ({ invoice = {}, onBack }) => {
  const [items, setItems] = useState([EMPTY_ITEM]);
  const [customer, setCustomer] = useState('');
  const [gstin, setGstin] = useState('');
  const [invoiceNo] = useState(`INV-${Date.now()}`);
  const [date] = useState(new Date().toISOString().slice(0, 10));

  // 🔢 Calculations
  const subtotal = items.reduce((s, i) => s + i.qty * i.rate, 0);
  const taxAmount = items.reduce(
    (s, i) => s + (i.qty * i.rate * i.tax) / 100,
    0
  );
  const grandTotal = subtotal + taxAmount;

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    updated[index].total =
      updated[index].qty * updated[index].rate +
      (updated[index].qty * updated[index].rate * updated[index].tax) / 100;
    setItems(updated);
  };

  const addItem = () => setItems([...items, EMPTY_ITEM]);
  const removeItem = (i) =>
    setItems(items.filter((_, index) => index !== i));

  const invoiceData = {
    invoiceNo,
    date,
    customer,
    gstin,
    items,
    subtotal,
    taxAmount,
    grandTotal,
  };

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-200 rounded-lg"
          >
            <ArrowLeft />
          </button>
          <h2 className="text-2xl font-bold">Invoice Editor</h2>
        </div>

        <button
          onClick={() => generateInvoicePDF(invoiceData)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
        >
          <FileText size={16} />
          <span>Download PDF</span>
        </button>
      </div>

      {/* Invoice Meta */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl shadow">
        <input
          placeholder="Customer Name"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          placeholder="GSTIN"
          value={gstin}
          onChange={(e) => setGstin(e.target.value)}
          className="border p-2 rounded"
        />
        <input value={invoiceNo} disabled className="border p-2 rounded bg-slate-100" />
        <input value={date} disabled className="border p-2 rounded bg-slate-100" />
      </div>

      {/* Items Table */}
      <div className="bg-white p-4 rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="p-2 text-left">Item</th>
              <th className="p-2">HSN</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Rate</th>
              <th className="p-2">GST %</th>
              <th className="p-2">Total</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b">
                <td className="p-2">
                  <input
                    value={item.name}
                    onChange={(e) =>
                      updateItem(i, 'name', e.target.value)
                    }
                    className="border p-1 rounded w-full"
                  />
                </td>
                <td className="p-2">
                  <input
                    value={item.hsn}
                    onChange={(e) =>
                      updateItem(i, 'hsn', e.target.value)
                    }
                    className="border p-1 rounded w-24"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) =>
                      updateItem(i, 'qty', Number(e.target.value))
                    }
                    className="border p-1 rounded w-20"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) =>
                      updateItem(i, 'rate', Number(e.target.value))
                    }
                    className="border p-1 rounded w-24"
                  />
                </td>
                <td className="p-2">
                  <select
                    value={item.tax}
                    onChange={(e) =>
                      updateItem(i, 'tax', Number(e.target.value))
                    }
                    className="border p-1 rounded"
                  >
                    {[0, 5, 12, 18, 28].map((t) => (
                      <option key={t} value={t}>
                        {t}%
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 font-semibold">
                  ₹{item.total.toFixed(2)}
                </td>
                <td className="p-2">
                  <button
                    onClick={() => removeItem(i)}
                    className="text-rose-500 hover:bg-rose-50 p-1 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={addItem}
          className="mt-4 flex items-center space-x-2 text-blue-600 font-medium"
        >
          <Plus size={16} />
          <span>Add Item</span>
        </button>
      </div>

      {/* Totals */}
      <div className="bg-white p-4 rounded-xl shadow max-w-md ml-auto space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>GST</span>
          <span>₹{taxAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span>Grand Total</span>
          <span>₹{grandTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceEditorView;
