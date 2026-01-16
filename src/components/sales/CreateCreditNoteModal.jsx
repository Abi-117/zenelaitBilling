import { useState } from 'react';
import { X, FileMinus } from 'lucide-react';
import Card from '../ui/Card';

const CreateCreditNoteModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    invoice: '',
    customer: '',
    reason: '',
    amount: ''
  });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <Card className="w-full max-w-xl p-6">

        <div className="flex justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileMinus className="text-blue-600" />
            <h3 className="font-bold text-lg">New Credit Note</h3>
          </div>
          <button onClick={onClose}><X /></button>
        </div>

        <div className="space-y-4">
          <input
            placeholder="Invoice Number"
            className="w-full border p-2 rounded"
            onChange={e => setForm({ ...form, invoice: e.target.value })}
          />
          <input
            placeholder="Customer Name"
            className="w-full border p-2 rounded"
            onChange={e => setForm({ ...form, customer: e.target.value })}
          />
          <select
            className="w-full border p-2 rounded"
            onChange={e => setForm({ ...form, reason: e.target.value })}
          >
            <option value="">Select Reason</option>
            <option>Return</option>
            <option>Overcharge</option>
            <option>Discount</option>
          </select>
          <input
            placeholder="Amount"
            type="number"
            className="w-full border p-2 rounded"
            onChange={e => setForm({ ...form, amount: +e.target.value })}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create
          </button>
        </div>
      </Card>
    </div>
  );
};

export default CreateCreditNoteModal;
