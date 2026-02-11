import { useState, useEffect } from "react";
import Card from "../../../ui/Card";
import { AlertTriangle, Trash2, Edit } from "lucide-react";
import { fetchItems, fetchBatches, createBatch, updateBatch, deleteBatch } from "../../../../services/api";

const BatchManagementView = () => {
  const [form, setForm] = useState({ item: "", batchNo: "", expiry: "", quantity: "", cost: "" });
  const [batches, setBatches] = useState([]);
  const [items, setItems] = useState([]);
  const [editingBatch, setEditingBatch] = useState(null);

  // Load items and batches
  const loadData = async () => {
    try {
      const itemsData = await fetchItems();
      setItems(itemsData);

      const batchesData = await fetchBatches();
      setBatches(
        batchesData.map(b => ({ ...b, itemName: b.item.name }))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to fetch data from server");
    }
  };

  useEffect(() => {
    loadData();

    // Poll items every 10 seconds to get new items dynamically
    const interval = setInterval(async () => {
      try {
        const latestItems = await fetchItems();
        setItems(latestItems);
      } catch (err) {
        console.error("Failed to refresh items", err);
      }
    }, 10000); // 10 sec

    return () => clearInterval(interval);
  }, []);

  const isExpired = (date) => new Date(date) < new Date();

  // Add or update batch
  const addOrUpdateBatch = async () => {
    if (!form.item || !form.batchNo || !form.expiry || !form.quantity || !form.cost) {
      return alert("Please fill all fields");
    }

    try {
      if (editingBatch) {
        const updated = await updateBatch(editingBatch._id, form);
        setBatches(
          batches.map(b => (b._id === updated._id ? { ...updated, itemName: updated.item.name } : b))
        );
        setEditingBatch(null);
      } else {
        const newBatch = await createBatch(form);
        setBatches([{ ...newBatch, itemName: newBatch.item.name }, ...batches]);
      }
      setForm({ item: "", batchNo: "", expiry: "", quantity: "", cost: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to save batch");
    }
  };

  const editBatch = (batch) => {
    setForm({
      item: batch.item._id,
      batchNo: batch.batchNo,
      expiry: batch.expiry.slice(0, 10),
      quantity: batch.quantity,
      cost: batch.cost,
    });
    setEditingBatch(batch);
  };

  const removeBatch = async (id) => {
    if (!confirm("Are you sure you want to delete this batch?")) return;
    try {
      await deleteBatch(id);
      setBatches(batches.filter(b => b._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete batch");
    }
  };

  return (
    <div className="space-y-6 p-6">

      {/* Add / Edit Batch */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">{editingBatch ? "Edit Batch" : "Add Batch"}</h3>
        <div className="grid grid-cols-5 gap-4">
          <select
            className="input"
            value={form.item}
            onChange={e => setForm({ ...form, item: e.target.value })}
          >
            <option value="">Select Item</option>
            {items.map(i => (
              <option key={i._id} value={i._id}>{i.name}</option>
            ))}
          </select>

          <input className="input" placeholder="Batch No" value={form.batchNo} onChange={e => setForm({ ...form, batchNo: e.target.value })} />
          <input type="date" className="input" value={form.expiry} onChange={e => setForm({ ...form, expiry: e.target.value })} />
          <input type="number" className="input" placeholder="Qty" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
          <input type="number" className="input" placeholder="Cost" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} />
        </div>

        <div className="mt-4 text-right">
          <button
            onClick={addOrUpdateBatch}
            className={`px-4 py-2 rounded text-white font-medium ${editingBatch ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {editingBatch ? "Update Batch" : "Add Batch"}
          </button>
        </div>
      </Card>

      {/* Batch Table */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Batch Inventory</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="text-left text-slate-500 border-b">
              <tr>
                <th className="py-2">Item</th>
                <th>Batch</th>
                <th>Expiry</th>
                <th>Qty</th>
                <th>Cost</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {batches.map(batch => {
                const expired = isExpired(batch.expiry);
                return (
                  <tr key={batch._id} className="border-b last:border-0 hover:bg-slate-50 transition">
                    <td className="py-2">{batch.itemName}</td>
                    <td>{batch.batchNo}</td>
                    <td>{batch.expiry.slice(0, 10)}</td>
                    <td>{batch.quantity}</td>
                    <td>₹{batch.cost}</td>
                    <td>
                      {expired ? (
                        <span className="flex items-center gap-1 text-red-600 text-xs font-semibold">
                          <AlertTriangle size={14} /> Expired
                        </span>
                      ) : (
                        <span className="text-green-600 text-xs font-semibold">Active</span>
                      )}
                    </td>
                    <td className="text-right space-x-2">
                      <button className="text-blue-600 hover:bg-blue-50 p-1 rounded" onClick={() => editBatch(batch)}>
                        <Edit size={14} />
                      </button>
                      <button className="text-rose-500 hover:bg-rose-50 p-1 rounded" onClick={() => removeBatch(batch._id)}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
};

export default BatchManagementView;
