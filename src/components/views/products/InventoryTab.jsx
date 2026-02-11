import { useEffect, useMemo, useState } from "react";
import Card from "../../ui/Card";
import { updateItem, fetchItems } from "../../../services/api";

const emptyLocation = () => ({
  id: crypto.randomUUID(),
  name: "",
  openingStock: 0,
});

const InventoryTab = ({ itemId }) => {
  const [inventory, setInventory] = useState({
    trackStock: true,
    reorderLevel: 0,
    maxStock: 0,
    enableBatch: false,
    enableExpiry: false,
    locations: [emptyLocation()],
  });

  const [loading, setLoading] = useState(false);

  /* ================= FETCH INVENTORY ================= */
  useEffect(() => {
    if (!itemId) return;

    fetchItems()
      .then((items) => {
        const item = items.find((i) => i._id === itemId);
        if (item?.inventory) setInventory(item.inventory);
      })
      .catch(() => {});
  }, [itemId]);

  /* ================= TOTAL STOCK ================= */
  const totalStock = useMemo(() => {
    return inventory.locations.reduce(
      (sum, l) => sum + Number(l.openingStock || 0),
      0
    );
  }, [inventory.locations]);

  /* ================= HANDLERS ================= */
  const updateLocation = (id, field, value) => {
    setInventory((prev) => ({
      ...prev,
      locations: prev.locations.map((l) =>
        l.id === id ? { ...l, [field]: value } : l
      ),
    }));
  };

  const addLocation = () => {
    setInventory((prev) => ({
      ...prev,
      locations: [...prev.locations, emptyLocation()],
    }));
  };

  const removeLocation = (id) => {
    setInventory((prev) => ({
      ...prev,
      locations: prev.locations.filter((l) => l.id !== id),
    }));
  };

  /* ================= SAVE ================= */
  const saveInventory = async () => {
    setLoading(true);
    try {
      await updateItem(itemId, { inventory });
      alert("Inventory settings saved");
    } catch (err) {
      console.error(err);
      alert("Failed to save inventory");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-6">
      {/* STOCK SETTINGS */}
      <Card>
        <h3 className="font-semibold mb-4">Stock Settings</h3>

        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={inventory.trackStock}
            onChange={(e) =>
              setInventory({ ...inventory, trackStock: e.target.checked })
            }
          />
          Track inventory
        </label>

        {inventory.trackStock && (
          <div className="grid grid-cols-3 gap-4">
            <input
              type="number"
              className="input"
              placeholder="Reorder Level"
              value={inventory.reorderLevel}
              onChange={(e) =>
                setInventory({ ...inventory, reorderLevel: e.target.value })
              }
            />
            <input
              type="number"
              className="input"
              placeholder="Max Stock"
              value={inventory.maxStock}
              onChange={(e) =>
                setInventory({ ...inventory, maxStock: e.target.value })
              }
            />
          </div>
        )}
      </Card>

      {/* BATCH / EXPIRY */}
      <Card>
        <h3 className="font-semibold mb-4">Advanced Tracking</h3>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            disabled={!inventory.trackStock}
            checked={inventory.enableBatch}
            onChange={(e) =>
              setInventory({ ...inventory, enableBatch: e.target.checked })
            }
          />
          Enable Batch Tracking
        </label>

        <label className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            disabled={!inventory.trackStock}
            checked={inventory.enableExpiry}
            onChange={(e) =>
              setInventory({ ...inventory, enableExpiry: e.target.checked })
            }
          />
          Enable Expiry Tracking
        </label>
      </Card>

      {/* LOCATIONS */}
      <Card>
        <h3 className="font-semibold mb-4">Opening Stock (By Location)</h3>

        {inventory.locations.map((loc) => (
          <div
            key={loc.id}
            className="grid grid-cols-3 gap-3 items-center mb-2"
          >
            <input
              className="input"
              placeholder="Location"
              value={loc.name}
              onChange={(e) =>
                updateLocation(loc.id, "name", e.target.value)
              }
            />
            <input
              type="number"
              className="input"
              placeholder="Opening Stock"
              value={loc.openingStock}
              onChange={(e) =>
                updateLocation(loc.id, "openingStock", e.target.value)
              }
            />
            <button
              onClick={() => removeLocation(loc.id)}
              className="text-red-500"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          onClick={addLocation}
          className="mt-3 px-3 py-2 bg-blue-600 text-white rounded"
        >
          + Add Location
        </button>
      </Card>

      {/* SUMMARY */}
      <Card>
        <h3 className="font-semibold mb-2">Inventory Summary</h3>
        <p>
          Total Opening Stock: <b>{totalStock}</b>
        </p>

        {totalStock < inventory.reorderLevel && (
          <p className="text-red-600 mt-1">⚠ Stock below reorder level</p>
        )}
      </Card>

      {/* SAVE */}
      <div className="text-right">
        <button
          disabled={loading}
          onClick={saveInventory}
          className="bg-blue-600 text-white px-5 py-2 rounded"
        >
          {loading ? "Saving..." : "Save Inventory"}
        </button>
      </div>
    </div>
  );
};

export default InventoryTab;
