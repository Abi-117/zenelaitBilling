import { useEffect, useMemo, useState } from "react";
import { FileText, CreditCard } from "lucide-react";
import EventDetailsModal from "./EventDetailsModal";

/* ================= CONFIG ================= */
const API_URL = "http://localhost:5000/api/events";

/* ================= ICON MAP ================= */
const iconMap = {
  Invoice: FileText,
  Subscription: FileText,
  Payment: CreditCard,
};

/* ================= STATUS STYLES ================= */
const statusColor = {
  Paid: "bg-green-100 text-green-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Overdue: "bg-red-100 text-red-800",
};

const BillingEventsView = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  /* ================= FETCH EVENTS ================= */
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Failed to fetch billing events", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  /* ================= FILTER ================= */
  const filteredEvents = useMemo(() => {
    if (filter === "all") return events;
    return events.filter((e) => e.status === filter);
  }, [events, filter]);

  /* ================= MARK AS PAID ================= */
  const markAsPaid = async (eventId) => {
    try {
      const res = await fetch(`${API_URL}/${eventId}/pay`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updated = await res.json();

      setEvents((prev) =>
        prev.map((e) => (e._id === eventId ? updated : e))
      );

      setSelectedEvent(updated);
    } catch (err) {
      console.error("Mark as paid failed", err);
    }
  };

  /* ================= UI ================= */
  return (
    <>
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <h2 className="text-xl font-bold">Billing Events</h2>

        {/* Filters */}
        <div className="flex gap-2">
          {["all", "Paid", "Pending", "Overdue"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Events List */}
        {loading ? (
          <div className="text-center text-slate-400 py-10">
            Loading events...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center text-slate-400 py-10">
            No billing events found
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEvents.map((event) => {
              const Icon = iconMap[event.entity] || FileText;

              return (
                <div
                  key={event._id}
                  className="flex justify-between items-center p-4 border rounded-lg hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="text-blue-600" size={20} />
                    <div>
                      <p className="font-semibold">{event.type}</p>
                      <p className="text-sm text-slate-500">
                        {event.message}
                      </p>
                    </div>
                    <span
                      className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor[event.status]}`}
                    >
                      {event.status}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="text-blue-600 text-sm font-semibold hover:underline"
                  >
                    View Details
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onMarkPaid={markAsPaid}
        />
      )}
    </>
  );
};

export default BillingEventsView;
