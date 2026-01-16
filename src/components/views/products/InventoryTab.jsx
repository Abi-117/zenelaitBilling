import { useState } from 'react';
import Card from '../../ui/Card';

const InventoryTab = ({ product }) => {
  const [inventory, setInventory] = useState({
    trackStock: product?.inventory?.trackStock ?? true,
    openingStock: product?.inventory?.openingStock || '',
    reorderLevel: product?.inventory?.reorderLevel || '',
    enableBatch: product?.inventory?.enableBatch ?? false,
    enableExpiry: product?.inventory?.enableExpiry ?? false,
  });

  const saveInventory = () => {
    console.log(inventory);
    alert('Inventory settings saved');
  };

  return (
    <div className="space-y-6">

      {/* Stock Tracking */}
      <Card>
        <h3 className="font-semibold mb-4">Stock Settings</h3>

        <div className="space-y-4">

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={inventory.trackStock}
              onChange={e =>
                setInventory({ ...inventory, trackStock: e.target.checked })
              }
            />
            <span>Track inventory for this item</span>
          </label>

          {inventory.trackStock && (
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                className="input"
                placeholder="Opening Stock"
                value={inventory.openingStock}
                onChange={e =>
                  setInventory({ ...inventory, openingStock: e.target.value })
                }
              />

              <input
                type="number"
                className="input"
                placeholder="Reorder Level (Low Stock Alert)"
                value={inventory.reorderLevel}
                onChange={e =>
                  setInventory({ ...inventory, reorderLevel: e.target.value })
                }
              />
            </div>
          )}

        </div>
      </Card>

      {/* Batch & Expiry */}
      <Card>
        <h3 className="font-semibold mb-4">Advanced Tracking</h3>

        <div className="space-y-3">

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={inventory.enableBatch}
              onChange={e =>
                setInventory({ ...inventory, enableBatch: e.target.checked })
              }
              disabled={!inventory.trackStock}
            />
            <span>Enable Batch / Lot tracking</span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={inventory.enableExpiry}
              onChange={e =>
                setInventory({ ...inventory, enableExpiry: e.target.checked })
              }
              disabled={!inventory.trackStock}
            />
            <span>Enable Expiry date tracking</span>
          </label>

          {!inventory.trackStock && (
            <p className="text-sm text-slate-500">
              Enable stock tracking to use batch & expiry features
            </p>
          )}
        </div>
      </Card>

      {/* Save */}
      <div className="text-right">
        <button
          onClick={saveInventory}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Inventory
        </button>
      </div>

    </div>
  );
};

export default InventoryTab;
