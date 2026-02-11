import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchSuppliers,
  fetchGRNs,
  createGRN,
  updateGRN,
  deleteGRN,
  createPurchaseBillFromGRN,
} from "../../../services/api";

/* ---------------- PO AUTO GENERATOR ---------------- */
const generatePONumber = () => {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `PO-${year}-${rand}`;
};

/* ---------------- TODAY DATE ---------------- */
const today = new Date().toISOString().split("T")[0];

export default function GRNView() {
  const navigate = useNavigate();

  /* ---------------- STATES ---------------- */
  const [suppliers, setSuppliers] = useState([]);
  const [grns, setGrns] = useState([]);

  // Create new GRN
  const [newGRN, setNewGRN] = useState({
    supplier: "",
    poNo: generatePONumber(),
    grnDate: today,
    items: [{ name: "", qty: 1, rate: 0 }],
  });

  // Edit/View GRN
  const [editingGRN, setEditingGRN] = useState(null);

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    fetchSuppliers().then(setSuppliers).catch(console.error);
    fetchGRNs().then(setGrns).catch(console.error);
  }, []);

  /* ---------------- TOTAL CALC ---------------- */
  const calcTotal = (items) => items.reduce((s, i) => s + i.qty * i.rate, 0);

  /* ---------------- FORM HANDLERS ---------------- */
  const handleItemChange = (form, setForm, index, key, value) => {
    const updated = [...form.items];
    updated[index][key] = key === "name" ? value : Number(value);
    setForm({ ...form, items: updated });
  };

  const addItem = (form, setForm) =>
    setForm({ ...form, items: [...form.items, { name: "", qty: 1, rate: 0 }] });

  const removeItem = (form, setForm, index) =>
    setForm({ ...form, items: form.items.filter((_, i) => i !== index) });

  /* ---------------- SAVE / UPDATE ---------------- */
  const saveGRN = async (form, setForm, editing = false) => {
    if (!form.supplier) return alert("Select supplier");
    if (form.items.some((i) => !i.name || i.qty <= 0 || i.rate < 0))
      return alert("Invalid items");

    const payload = { ...form, total: calcTotal(form.items) };

    try {
      if (editing) {
        const updated = await updateGRN(editingGRN._id, payload);
        setGrns((prev) =>
          prev.map((g) => (g._id === editingGRN._id ? updated : g))
        );
        setEditingGRN(null);
      } else {
        const created = await createGRN(payload);
        setGrns((prev) => [created, ...prev]);
      }

      // Reset form
      setForm({
        supplier: "",
        poNo: generatePONumber(),
        grnDate: today,
        items: [{ name: "", qty: 1, rate: 0 }],
      });
    } catch (err) {
      console.error(err);
      alert("Failed to save GRN");
    }
  };

  /* ---------------- EDIT / VIEW ---------------- */
  const openGRN = (grn) => {
    setEditingGRN(grn);
  };

  const isReadOnly = editingGRN?.status === "Billed";

  /* ---------------- DELETE ---------------- */
  const removeGRN = async (id) => {
    if (!confirm("Delete GRN?")) return;
    try {
      await deleteGRN(id);
      setGrns((prev) => prev.filter((g) => g._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete GRN");
    }
  };

  /* ---------------- CREATE BILL ---------------- */
  const createBill = async (id) => {
    try {
      const updated = await createPurchaseBillFromGRN(id);
      setGrns((prev) => prev.map((g) => (g._id === id ? updated : g)));
      navigate("/purchase-bills");
    } catch (err) {
      console.error(err);
      alert("Failed to create bill");
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <h2 className="text-2xl font-semibold">Goods Receipt Notes</h2>

      {/* ---------------- CREATE NEW GRN ---------------- */}
      <div className="bg-white shadow rounded p-6 space-y-4">
        <h3 className="text-lg font-semibold">Create New GRN</h3>

        <select
          className="border p-2 rounded w-full"
          value={newGRN.supplier}
          onChange={(e) => setNewGRN({ ...newGRN, supplier: e.target.value })}
        >
          <option value="">Select Supplier</option>
          {suppliers.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="border p-2 rounded w-full"
          value={newGRN.grnDate}
          onChange={(e) => setNewGRN({ ...newGRN, grnDate: e.target.value })}
        />

        <input
          className="border p-2 rounded w-full bg-slate-100 text-slate-700"
          value={newGRN.poNo}
          readOnly
        />

        {newGRN.items.map((item, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              className="border p-2 rounded flex-1"
              placeholder="Item"
              value={item.name}
              onChange={(e) =>
                handleItemChange(newGRN, setNewGRN, i, "name", e.target.value)
              }
            />
            <input
              type="number"
              className="border p-2 rounded w-20"
              value={item.qty}
              onChange={(e) =>
                handleItemChange(newGRN, setNewGRN, i, "qty", e.target.value)
              }
            />
            <input
              type="number"
              className="border p-2 rounded w-24"
              value={item.rate}
              onChange={(e) =>
                handleItemChange(newGRN, setNewGRN, i, "rate", e.target.value)
              }
            />
            <span className="w-20 text-right">₹{item.qty * item.rate}</span>
            <button
              onClick={() => removeItem(newGRN, setNewGRN, i)}
              className="text-red-600"
            >
              ✕
            </button>
          </div>
        ))}

        <div className="flex justify-between">
          <button onClick={() => addItem(newGRN, setNewGRN)} className="text-blue-600">
            + Add Item
          </button>
          <strong>Total: ₹{calcTotal(newGRN.items)}</strong>
        </div>

        <button
          onClick={() => saveGRN(newGRN, setNewGRN)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Save GRN
        </button>
      </div>

      {/* ---------------- EDIT / VIEW GRN ---------------- */}
      {editingGRN && (
        <div className="bg-white shadow rounded p-6 space-y-4">
          <h3 className="text-lg font-semibold">
            {isReadOnly ? "View GRN (Billed)" : "Edit GRN"}
          </h3>

          <select
            className="border p-2 rounded w-full"
            value={editingGRN.supplier?._id || ""}
            onChange={(e) => setEditingGRN({ ...editingGRN, supplier: { _id: e.target.value } })}
            disabled={isReadOnly}
          >
            <option value="">Select Supplier</option>
            {suppliers.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="border p-2 rounded w-full"
            value={editingGRN.grnDate?.split("T")[0] || ""}
            onChange={(e) => setEditingGRN({ ...editingGRN, grnDate: e.target.value })}
            disabled={isReadOnly}
          />

          <input
            className="border p-2 rounded w-full bg-slate-100 text-slate-700"
            value={editingGRN.poNo}
            readOnly
          />

          {editingGRN.items?.map((item, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                className="border p-2 rounded flex-1"
                placeholder="Item"
                value={item.name}
                onChange={(e) => {
                  if (!isReadOnly) {
                    const updatedItems = [...editingGRN.items];
                    updatedItems[i].name = e.target.value;
                    setEditingGRN({ ...editingGRN, items: updatedItems });
                  }
                }}
                disabled={isReadOnly}
              />
              <input
                type="number"
                className="border p-2 rounded w-20"
                value={item.qty}
                onChange={(e) => {
                  if (!isReadOnly) {
                    const updatedItems = [...editingGRN.items];
                    updatedItems[i].qty = Number(e.target.value);
                    setEditingGRN({ ...editingGRN, items: updatedItems });
                  }
                }}
                disabled={isReadOnly}
              />
              <input
                type="number"
                className="border p-2 rounded w-24"
                value={item.rate}
                onChange={(e) => {
                  if (!isReadOnly) {
                    const updatedItems = [...editingGRN.items];
                    updatedItems[i].rate = Number(e.target.value);
                    setEditingGRN({ ...editingGRN, items: updatedItems });
                  }
                }}
                disabled={isReadOnly}
              />
              <span className="w-20 text-right">₹{item.qty * item.rate}</span>
            </div>
          ))}

          {!isReadOnly && (
            <button
              onClick={() => saveGRN(editingGRN, setEditingGRN, true)}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Update GRN
            </button>
          )}
        </div>
      )}

      {/* ---------------- TABLE ---------------- */}
      <div className="bg-white shadow rounded p-4">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-2">GRN No</th>
              <th>Supplier</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {grns.map((g) => (
              <tr key={g._id} className="border-b">
                <td className="p-2">{g.grnNo}</td>
                <td>{g.supplier?.name}</td>
                <td>{new Date(g.grnDate || g.createdAt).toLocaleDateString()}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      g.status === "Billed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {g.status}
                  </span>
                </td>
                <td>₹{calcTotal(g.items)}</td>
                <td className="space-x-2">
                  <button onClick={() => openGRN(g)} className="text-blue-600">
                    {g.status === "Billed" ? "View" : "Edit"}
                  </button>
                  <button onClick={() => removeGRN(g._id)} className="text-red-600">
                    Delete
                  </button>
                  {g.status === "Pending" && (
                    <button onClick={() => createBill(g._id)} className="text-green-600">
                      Create Bill
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
