import { useState } from 'react';
import { Bell } from 'lucide-react';
import NewReminderModal from './NewReminderModal';

const ReminderAlertsView = () => {
  const [reminders, setReminders] = useState([
    {
      title: 'Invoice Payment Reminder',
      desc: 'Reminder scheduled for INV-5001',
      status: 'Scheduled',
    },
  ]);

  const [showModal, setShowModal] = useState(false);

  const handleSaveReminder = (data) => {
    setReminders(prev => [
      ...prev,
      {
        title: `${data.entity} Reminder`,
        desc: `Reminder for ${data.ref} on ${data.date}`,
        status: 'Scheduled',
      },
    ]);
    setShowModal(false);
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

        {reminders.map((r, i) => (
          <div key={i} className="flex items-center gap-3 border p-4 rounded-lg">
            <Bell className="text-amber-600" />
            <div>
              <p className="font-semibold">{r.title}</p>
              <p className="text-sm text-slate-500">{r.desc}</p>
            </div>
            <span className="ml-auto text-xs bg-slate-100 px-2 py-1 rounded">
              {r.status}
            </span>
          </div>
        ))}
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
