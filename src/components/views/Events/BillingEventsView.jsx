import { useState } from 'react';
import { FileText, CreditCard } from 'lucide-react';
import EventDetailsModal from './EventDetailsModal';
import { events } from '../../../data/events.data';

const iconMap = {
  Invoice: FileText,
  Payment: CreditCard,
};

const BillingEventsView = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <>
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <h2 className="text-lg font-bold">Billing Events</h2>

        {events.map(e => {
          const Icon = iconMap[e.entity];
          return (
            <div
              key={e.id}
              className="flex justify-between items-center p-4 border rounded-lg"
            >
              <div className="flex gap-3">
                <Icon className="text-blue-600" size={18} />
                <div>
                  <p className="font-semibold">{e.type}</p>
                  <p className="text-sm text-slate-500">{e.message}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedEvent(e)}
                className="text-blue-600 text-sm font-semibold"
              >
                View Details
              </button>
            </div>
          );
        })}
      </div>

      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </>
  );
};

export default BillingEventsView;
