import { useState } from 'react';
import Card from '../../ui/Card';

const LowStockRulesTab = ({ product }) => {
  const [rules, setRules] = useState({
    enabled: product?.lowStockRules?.enabled ?? true,
    threshold: product?.lowStockRules?.threshold || '',
    notifyEmail: product?.lowStockRules?.notifyEmail ?? true,
    notifyInApp: product?.lowStockRules?.notifyInApp ?? true,
    frequency: product?.lowStockRules?.frequency || 'once',
  });

  const saveRules = () => {
    console.log(rules);
    alert('Low stock rules saved');
  };

  return (
    <div className="space-y-6">

      {/* Enable Rule */}
      <Card>
        <h3 className="font-semibold mb-4">Low Stock Alerts</h3>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={rules.enabled}
            onChange={e =>
              setRules({ ...rules, enabled: e.target.checked })
            }
          />
          <span>Enable low stock alerts for this item</span>
        </label>
      </Card>

      {/* Rule Settings */}
      {rules.enabled && (
        <Card>
          <div className="space-y-4">

            <div>
              <label className="text-sm font-medium">
                Alert when stock goes below
              </label>
              <input
                type="number"
                className="input mt-1"
                placeholder="Enter quantity"
                value={rules.threshold}
                onChange={e =>
                  setRules({ ...rules, threshold: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Notification Methods</label>

              <div className="flex gap-6 mt-2">
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

            <div>
              <label className="text-sm font-medium">Alert Frequency</label>
              <select
                className="input mt-1"
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

          </div>
        </Card>
      )}

      {/* Save */}
      <div className="text-right">
        <button
          onClick={saveRules}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Rules
        </button>
      </div>

    </div>
  );
};

export default LowStockRulesTab;
