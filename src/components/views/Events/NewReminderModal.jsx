import { useState } from 'react';
import { X } from 'lucide-react';

const NewReminderModal = ({ onClose, onSave }) => {
  const [entity, setEntity] = useState('Subscription');
  const [ref, setRef] = useState('');
  const [date, setDate] = useState('');

  const handleSave = () => {
    if (!ref || !date) return alert('Fill all fields');

    onSave({ entity, ref, date });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">New Reminder</h3>
          <button onClick={onClose}><X /></button>
        </div>

        <div className="space-y-4">
          <select
            value={entity}
            onChange={e => setEntity(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option>Invoice</option>
            <option>Subscription</option>
          </select>

          <input
            value={ref}
            onChange={e => setRef(e.target.value)}
            placeholder="Reference ID (701 / INV-5001)"
            className="w-full border rounded px-3 py-2"
          />

          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />

          <button
            onClick={handleSave}
            className="w-full bg-blue-600 text-white py-2 rounded-lg"
          >
            Save Reminder
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewReminderModal;
