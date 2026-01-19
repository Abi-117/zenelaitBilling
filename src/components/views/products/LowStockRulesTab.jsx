import { useState } from 'react';
import Card from '../../ui/Card';

const LowStockRulesTab = ({ product }) => {
  const [rules, setRules] = useState({
    enabled: product?.lowStockRules?.enabled ?? true,
    threshold: product?.lowStockRules?.threshold || 10,
    notifyEmail: product?.lowStockRules?.notifyEmail ?? true,
    notifyInApp: product?.lowStockRules?.notifyInApp ?? true,
    frequency: product?.lowStockRules?.frequency || 'once',
  });

  const [message, setMessage] = useState('');

  const handleSave = () => {
    if (rules.enabled && (!rules.threshold || rules.threshold <= 0)) {
      setMessage('Threshold must be greater than 0');
      return;
    }
    setMessage('');
    console.log('Low Stock Rules Saved:', rules);
    alert('Low stock rules saved successfully!');
  };

  return (
    <div className="space-y-6">

      {/* Enable / Disable Low Stock Alerts */}
      <Card>
        <h3 className="font-semibold mb-4 text-lg">Low Stock Alerts</h3>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={rules.enabled}
            onChange={e => setRules({ ...rules, enabled: e.target.checked })}
          />
          <span>Enable low stock alerts for this item</span>
        </label>
      </Card>

      {/* Settings Panel */}
      {rules.enabled && (
        <Card>
          <div className="space-y-4">

            {/* Threshold */}
            <div>
              <label className="text-sm font-medium block mb-1">
                Alert when stock goes below
              </label>
              <input
                type="number"
                min={1}
                className="input w-full"
                placeholder="Enter quantity"
                value={rules.threshold}
                onChange={e =>
                  setRules({ ...rules, threshold: Number(e.target.value) })
                }
              />
            </div>

            {/* Notification Methods */}
            <div>
              <label className="text-sm font-medium block mb-1">Notification Methods</label>
              <div className="flex gap-6 mt-1">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rules.notifyInApp}
                    onChange={e =>
                      setRules({ ...rules, notifyInApp: e.target.checked })
                    }
                  />
                  In-App Notification
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rules.notifyEmail}
                    onChange={e =>
                      setRules({ ...rules, notifyEmail: e.target.checked })
                    }
                  />
                  Email Notification
                </label>
              </div>
            </div>

            {/* Alert Frequency */}
            <div>
              <label className="text-sm font-medium block mb-1">Alert Frequency</label>
              <select
                className="input w-full"
                value={rules.frequency}
                onChange={e =>
                  setRules({ ...rules, frequency: e.target.value })
                }
              >
                <option value="once">Once per low stock</option>
                <option value="daily">Daily reminder</option>
                <option value="weekly">Weekly reminder</option>
              </select>
            </div>

            {/* Validation / Info Message */}
            {message && (
              <p className="text-rose-500 text-sm font-medium">{message}</p>
            )}
          </div>
        </Card>
      )}

      {/* Save Button */}
      <div className="text-right">
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          Save Rules
        </button>
      </div>
    </div>
  );
};

export default LowStockRulesTab;
