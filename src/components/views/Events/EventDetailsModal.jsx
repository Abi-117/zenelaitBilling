import { X } from 'lucide-react';

const EventDetailsModal = ({ event, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Event Details</h3>
          <button onClick={onClose}><X /></button>
        </div>

        <div className="space-y-3 text-sm">
          <p><b>Type:</b> {event.type}</p>
          <p><b>Entity:</b> {event.entity}</p>
          <p><b>Reference:</b> {event.ref}</p>
          <p><b>Status:</b> {event.status}</p>
          <p><b>Time:</b> {event.time}</p>
          <p className="text-slate-600">{event.message}</p>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;
