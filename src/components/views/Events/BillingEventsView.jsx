import { useState, useMemo } from 'react';
import { FileText, CreditCard } from 'lucide-react';
import EventDetailsModal from './EventDetailsModal';
import { events as initialEvents } from '../../../data/events.data';

const iconMap = {
  Invoice: FileText,
  Payment: CreditCard,
};

const statusColor = {
  Paid: 'bg-green-100 text-green-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Overdue: 'bg-red-100 text-red-800',
};

const BillingEventsView = () => {
  const [events, setEvents] = useState(initialEvents);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filter, setFilter] = useState('all'); // all | Paid | Pending | Overdue

  const filteredEvents = useMemo(() => {
    if (filter === 'all') return events;
    return events.filter(e => e.status === filter);
  }, [filter, events]);

  const markAsPaid = (eventId) => {
    setEvents(prev =>
      prev.map(e => (e.id === eventId ? { ...e, status: 'Paid' } : e))
    );
    setSelectedEvent(prev => ({ ...prev, status: 'Paid' }));
  };

  const downloadPDF = (event) => {
    const blob = new Blob(
      [JSON.stringify(event, null, 2)],
      { type: 'application/json' }
    );
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${event.ref}.json`;
    link.click();
  };

  const sendEmail = (event) => {
    alert(`Email sent for ${event.ref} to ${event.customer}`);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <h2 className="text-xl font-bold">Billing Events</h2>

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          {['all', 'Paid', 'Pending', 'Overdue'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                filter === f ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Events list */}
        <div className="space-y-3">
          {filteredEvents.map(e => {
            const Icon = iconMap[e.entity] || FileText;
            return (
              <div
                key={e.id}
                className="flex justify-between items-center p-4 border rounded-lg hover:shadow-lg transition cursor-pointer"
              >
                <div className="flex gap-3 items-center">
                  <Icon className="text-blue-600" size={20} />
                  <div>
                    <p className="font-semibold">{e.type}</p>
                    <p className="text-sm text-slate-500">{e.message}</p>
                  </div>
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor[e.status]}`}>
                    {e.status}
                  </span>
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
      </div>

      {/* Modal */}
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onMarkPaid={markAsPaid}
          onDownloadPDF={downloadPDF}
          onSendEmail={sendEmail}
        />
      )}
    </>
  );
};

export default BillingEventsView;
