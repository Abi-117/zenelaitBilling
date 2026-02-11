import { useEffect, useState } from "react";
import Card from "../../ui/Card";
import api from "../../../services/api";

/**
 * LowStockRulesTab
 * @param {string} itemId - MongoDB _id of the ITEM (required)
 */
const LowStockRulesTab = ({ itemId }) => {
  const [rules, setRules] = useState({
    enabled: false,
    threshold: 10,
    notifyEmail: true,
    notifyInApp: true,
    frequency: "once",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- FETCH RULES ---------------- */
  useEffect(() => {
    if (!itemId) return;

    const fetchRules = async () => {
      try {
        const res = await api.get(`/low-stock/${itemId}`);
        if (res?.data) {
          setRules({
            enabled: res.data.enabled ?? false,
            threshold: res.data.threshold ?? 10,
            notifyEmail: res.data.notifyEmail ?? true,
            notifyInApp: res.data.notifyInApp ?? true,
            frequency: res.data.frequency ?? "once",
          });
        }
      } catch (err) {
        console.error("Failed to fetch low stock rules", err);
      }
    };

    fetchRules();
  }, [itemId]);

  /* ---------------- SAVE RULES ---------------- */
  const handleSave = async () => {
    if (!itemId) return;

    if (rules.enabled && rules.threshold <= 0) {
      setError("Threshold must be greater than 0");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await api.put(`/low-stock/${itemId}`, rules);
      alert("Low stock rules saved successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to save low stock rules");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- EMPTY STATE ---------------- */
  if (!itemId) {
    return (
      <Card>
        <p className="text-slate-500 text-sm">
          Select an item to configure low stock alerts
        </p>
      </Card>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-4">
      {/* Enable / Disable */}
      <Card>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={rules.enabled}
            onChange={(e) =>
              setRules({ ...rules, enabled: e.target.checked })
            }
          />
          <span className="font-medium">Enable Low Stock Alerts</span>
        </label>
      </Card>

      {/* Settings */}
      {rules.enabled && (
        <Card className="space-y-4">
          {/* Threshold */}
          <div>
            <label className="text-sm font-medium block mb-1">
              Alert when stock goes below
            </label>
            <input
              type="number"
              min={1}
              className="input w-full"
              value={rules.threshold}
              onChange={(e) =>
                setRules({
                  ...rules,
                  threshold: Number(e.target.value),
                })
              }
            />
          </div>

          {/* Notifications */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rules.notifyInApp}
                onChange={(e) =>
                  setRules({
                    ...rules,
                    notifyInApp: e.target.checked,
                  })
                }
              />
              In-App Notification
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rules.notifyEmail}
                onChange={(e) =>
                  setRules({
                    ...rules,
                    notifyEmail: e.target.checked,
                  })
                }
              />
              Email Notification
            </label>
          </div>

          {/* Frequency */}
          <div>
            <label className="text-sm font-medium block mb-1">
              Alert Frequency
            </label>
            <select
              className="input w-full"
              value={rules.frequency}
              onChange={(e) =>
                setRules({
                  ...rules,
                  frequency: e.target.value,
                })
              }
            >
              <option value="once">Once</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm font-medium">{error}</p>
          )}
        </Card>
      )}

      {/* Save */}
      <div className="text-right">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {loading ? "Saving..." : "Save Rules"}
        </button>
      </div>
    </div>
  );
};

export default LowStockRulesTab;
