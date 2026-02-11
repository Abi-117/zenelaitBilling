import { useEffect, useState } from "react";
import { Bell, Edit, Trash2, Send } from "lucide-react";
import NewReminderModal from "./NewReminderModal";

/* ================= CONFIG ================= */
const API_URL = "http://localhost:5000/api/reminders";

/* ================= STATUS STYLES ================= */
const statusColor = {
  Scheduled: "bg-blue-100 text-blue-800",
  Sent: "bg-green-100 text-green-800",
  Overdue: "bg-red-100 text-red-800",
};

const ReminderAlertsView = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("token");

  /* ================= FETCH REMINDERS ================= */
  const fetchReminders = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setReminders(data);
    } catch (err) {
      console.error("Failed to fetch reminders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  /* ================= CREATE REMINDER ================= */
  const handleSaveReminder = async (data) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const saved = await res.json();
      setReminders((prev) => [...prev, saved]);
      setShowModal(false);
    } catch (err) {
      console.error("Create reminder failed", err);
    }
  };

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const updated = await res.json();

      setReminders((prev) =>
        prev.map((r) => (r._id === id ? updated : r))
      );
    } catch (err) {
      console.error("Update reminder failed", err);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!confirm("Delete reminder?")) return;

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReminders((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Delete reminder failed", err);
    }
  };

  /* ================= UI ================= */
  return (
    <>
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Reminders & Alerts</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
          >
            + New Reminder
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-10 text-slate-400">
            Loading reminders...
          </div>
        ) : reminders.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            No reminders found
          </div>
        ) : (
          <div className="space-y-3">
            {reminders.map((r) => (
              <div
                key={r._id}
                className="flex items-center gap-3 border p-4 rounded-lg hover:shadow transition"
              >
                <Bell className="text-amber-600" size={20} />

                <div className="flex-1">
                  <p className="font-semibold">
                    {r.entity} Reminder – {r.ref}
                  </p>
                  <p className="text-sm text-slate-500">{r.message}</p>
                  <p className="text-xs text-slate-400">
                    {r.customer} • ₹{r.amount} •{" "}
                    {new Date(r.date).toLocaleDateString()}
                  </p>
                </div>

                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor[r.status]}`}
                >
                  {r.status}
                </span>

                {/* Actions */}
                <div className="flex gap-1 ml-2">
                  {r.status === "Scheduled" && (
                    <button
                      onClick={() => updateStatus(r._id, "Sent")}
                      className="text-blue-600 p-1 rounded hover:bg-blue-50"
                      title="Send Reminder"
                    >
                      <Send size={16} />
                    </button>
                  )}

                  <button
                    onClick={() => updateStatus(r._id, "Sent")}
                    className="text-green-600 p-1 rounded hover:bg-green-50"
                    title="Mark Done"
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(r._id)}
                    className="text-red-600 p-1 rounded hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
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
