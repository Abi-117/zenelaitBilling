import { useState } from 'react';
import {
  Plus,
  Search,
  Eye,
  Edit,
  Send,
  Download
} from 'lucide-react';

import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { INITIAL_INVOICES } from '../../data/invoices.data';

const InvoiceListView = ({
  invoices,
  selectedInvoice,
  onSelect,
  onCreate,
  onEdit,
  onSend,
  onPDF   
}) => {

  const [search, setSearch] = useState('');

  const filtered = INITIAL_INVOICES.filter(inv =>
    inv.id.toLowerCase().includes(search.toLowerCase()) ||
    inv.customerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Invoices</h2>
        <button
          onClick={onCreate}
          className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded"
        >
          <Plus size={14} />
          New
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
        <input
          className="w-full border rounded pl-9 py-2 text-sm"
          placeholder="Search invoices..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* LIST */}
      <Card className="p-0 overflow-hidden">
        {filtered.map(inv => (
          <div
            key={inv.id}
            onClick={() => onSelect(inv)}
            className={`p-4 border-b cursor-pointer hover:bg-slate-50
              ${selectedInvoice?.id === inv.id ? 'bg-blue-50' : ''}
            `}
          >
            <div className="flex justify-between">
              <div>
                <p className="font-bold">{inv.id}</p>
                <p className="text-sm text-slate-500">{inv.customerName}</p>
              </div>

              <div className="text-right">
                <p className="font-bold">₹{inv.total}</p>
                <Badge status={inv.status} />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => onSelect(inv)}>
  <Eye size={14} />
</button>

<button onClick={() => onEdit(inv)}>
  <Edit size={14} />
</button>

<button
  disabled={inv.status !== 'Draft'}
  onClick={() => onSend(inv)}
  className={`icon-btn ${
    inv.status !== 'Draft'
      ? 'opacity-40 cursor-not-allowed'
      : ''
  }`}
>
  <Send size={14} />
</button>


<button onClick={() => onPDF(inv)}>
  <Download size={14} />
</button>

            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="p-6 text-center text-slate-400">
            No invoices found
          </div>
        )}
      </Card>
    </div>
  );
};

export default InvoiceListView;
