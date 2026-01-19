import { useState } from 'react';
import Card from '../../ui/Card';

const InventoryTab = ({ product }) => {
  const [inventory, setInventory] = useState({
    trackStock: product?.inventory?.trackStock ?? true,
    openingStock: product?.inventory?.openingStock || '',
    reorderLevel: product?.inventory?.reorderLevel || '',
    maxStock: product?.inventory?.maxStock || '',
    enableBatch: product?.inventory?.enableBatch ?? false,
    enableExpiry: product?.inventory?.enableExpiry ?? false,
    locations: product?.inventory?.locations || [
      { id: 1, name: 'Main Warehouse', stock: 0, batchEnabled: false, expiryEnabled: false }
    ],
  });

  // Add new stock location
  const addLocation = () => {
    setInventory({
      ...inventory,
      locations: [
        ...inventory.locations,
        { id: Date.now(), name: '', stock: 0, batchEnabled: false, expiryEnabled: false }
      ],
    });
  };

  // Update location data
  const updateLocation = (id, field, value) => {
    setInventory({
      ...inventory,
      locations: inventory.locations.map(loc =>
        loc.id === id ? { ...loc, [field]: value } : loc
      ),
    });
  };

  // Delete location
  const removeLocation = id => {
    setInventory({
      ...inventory,
      locations: inventory.locations.filter(loc => loc.id !== id),
    });
  };

  const saveInventory = () => {
    if (inventory.trackStock && inventory.openingStock === '') return alert('Enter opening stock');
    console.log('Inventory saved:', inventory);
    alert('Inventory settings saved!');
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
              onChange={e => setInventory({ ...inventory, trackStock: e.target.checked })}
            />
            <span>Track inventory for this item</span>
          </label>

          {inventory.trackStock && (
            <div className="grid grid-cols-3 gap-4">
              <input
                type="number"
                className="input"
                placeholder="Opening Stock"
                value={inventory.openingStock}
                onChange={e => setInventory({ ...inventory, openingStock: e.target.value })}
              />
              <input
                type="number"
                className="input"
                placeholder="Reorder Level (Low Stock Alert)"
                value={inventory.reorderLevel}
                onChange={e => setInventory({ ...inventory, reorderLevel: e.target.value })}
              />
              <input
                type="number"
                className="input"
                placeholder="Maximum Stock"
                value={inventory.maxStock}
                onChange={e => setInventory({ ...inventory, maxStock: e.target.value })}
              />
            </div>
          )}
        </div>
      </Card>

      {/* Advanced Tracking */}
      <Card>
        <h3 className="font-semibold mb-4">Advanced Tracking</h3>
        <div className="space-y-3">

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={inventory.enableBatch}
              onChange={e => setInventory({ ...inventory, enableBatch: e.target.checked })}
              disabled={!inventory.trackStock}
            />
            <span>Enable Batch / Lot tracking</span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={inventory.enableExpiry}
              onChange={e => setInventory({ ...inventory, enableExpiry: e.target.checked })}
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

      {/* Multiple Stock Locations */}
      <Card>
        <h3 className="font-semibold mb-4">Stock Locations</h3>
        {inventory.locations.map(loc => (
          <div key={loc.id} className="grid grid-cols-4 gap-3 items-center mb-2">
            <input
              type="text"
              className="input"
              placeholder="Location Name"
              value={loc.name}
              onChange={e => updateLocation(loc.id, 'name', e.target.value)}
            />
            <input
              type="number"
              className="input"
              placeholder="Stock Qty"
              value={loc.stock}
              onChange={e => updateLocation(loc.id, 'stock', Number(e.target.value))}
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={loc.batchEnabled}
                onChange={e => updateLocation(loc.id, 'batchEnabled', e.target.checked)}
                disabled={!inventory.enableBatch}
              />
              Batch
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={loc.expiryEnabled}
                onChange={e => updateLocation(loc.id, 'expiryEnabled', e.target.checked)}
                disabled={!inventory.enableExpiry}
              />
              Expiry
            </label>
            <button
              className="text-rose-500 hover:bg-rose-50 px-2 py-1 rounded"
              onClick={() => removeLocation(loc.id)}
            >
              Remove
            </button>
          </div>
        ))}

        <button
          onClick={addLocation}
          className="mt-2 px-3 py-2 bg-blue-600 text-white rounded flex items-center gap-2"
        >
          Add Location
        </button>
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
