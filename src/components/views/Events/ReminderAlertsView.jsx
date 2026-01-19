import { useState, useMemo } from 'react';
import { Bell, Edit, Trash2, Send } from 'lucide-react';
import NewReminderModal from './NewReminderModal';

const statusColor = {
  Scheduled: 'bg-blue-100 text-blue-800',
  Sent: 'bg-green-100 text-green-800',
  Overdue: 'bg-red-100 text-red-800',
};

const ReminderAlertsView = () => {
  const [reminders, setReminders] = useState([
    {
      id: 1,
      entity: 'Invoice',
      ref: 'INV-5001',
      customer: 'John Doe',
      amount: 1500,
      date: '2026-01-20',
      status: 'Scheduled',
      message: 'Payment reminder for invoice INV-5001',
    },
    {
      id: 2,
      entity: 'Subscription',
      ref: 'SUB-1002',
      customer: 'Jane Smith',
      amount: 3200,
      date: '2026-01-25',
      status: 'Scheduled',
      message: 'Subscription renewal reminder for SUB-1002',
    },
  ]);

  const [showModal, setShowModal] = useState(false);

  const handleSaveReminder = (data) => {
    setReminders(prev => [
      ...prev,
      {
        id: prev.length + 1,
        ...data,
        status: 'Scheduled',
        message: `Reminder for ${data.ref} (${data.entity}) on ${data.date}`,
      },
    ]);
    setShowModal(false);
  };

  const handleSendReminder = (id) => {
    setReminders(prev =>
      prev.map(r =>
        r.id === id ? { ...r, status: 'Sent' } : r
      )
    );
  };

  const handleMarkDone = (id) => {
    setReminders(prev =>
      prev.map(r =>
        r.id === id ? { ...r, status: 'Sent' } : r
      )
    );
  };

  const handleDelete = (id) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Reminders & Alerts</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            + New Reminder
          </button>
        </div>

        <div className="space-y-3">
          {reminders.map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-3 border p-4 rounded-lg hover:shadow transition"
            >
              <Bell className="text-amber-600" size={20} />
              <div>
                <p className="font-semibold">{r.entity} Reminder</p>
                <p className="text-sm text-slate-500">{r.message}</p>
                <p className="text-xs text-slate-400">{r.customer} • ₹{r.amount} • {r.date}</p>
              </div>

              <span className={`ml-auto px-2 py-1 rounded-full text-xs font-semibold ${statusColor[r.status]}`}>
                {r.status}
              </span>

              {/* Action Buttons */}
              <div className="flex gap-1 ml-2">
                {r.status === 'Scheduled' && (
                  <button
                    onClick={() => handleSendReminder(r.id)}
                    className="text-blue-600 p-1 rounded hover:bg-blue-50"
                    title="Send Reminder"
                  >
                    <Send size={16} />
                  </button>
                )}
                <button
                  onClick={() => handleMarkDone(r.id)}
                  className="text-green-600 p-1 rounded hover:bg-green-50"
                  title="Mark Done"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="text-red-600 p-1 rounded hover:bg-red-50"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <NewReminderModal
          onClose={() => setShowModal(false)}
          onSave={handleSaveReminder}
        />
      )}
    </>
  );
};

export default ReminderAlertsView;
