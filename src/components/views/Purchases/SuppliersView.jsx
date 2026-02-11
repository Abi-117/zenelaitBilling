import { useEffect, useState } from "react";
import { fetchSuppliers, createSupplier, updateSupplier, deleteSupplier } from "../../../services/api";

export default function SuppliersView() {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "" });
  const [editingId, setEditingId] = useState(null);
  const [editingForm, setEditingForm] = useState({ name: "", phone: "", email: "", address: "" });

  useEffect(() => {
    fetchSuppliers().then(setSuppliers);
  }, []);

  // Add new supplier
  const save = async () => {
    if (!form.name.trim()) return;
    const s = await createSupplier(form);
    setSuppliers([s, ...suppliers]);
    setForm({ name: "", phone: "", email: "", address: "" });
  };

  // Start editing
  const startEdit = (supplier) => {
    setEditingId(supplier._id);
    setEditingForm({ name: supplier.name, phone: supplier.phone || "", email: supplier.email || "", address: supplier.address || "" });
  };

  // Save edited supplier
  const saveEdit = async (id) => {
    if (!editingForm.name.trim()) return;
    const updated = await updateSupplier(id, editingForm);
    setSuppliers(suppliers.map(s => (s._id === id ? updated : s)));
    setEditingId(null);
    setEditingForm({ name: "", phone: "", email: "", address: "" });
  };

  // Delete supplier
  const remove = async (id) => {
    if (!confirm("Are you sure you want to delete this supplier?")) return;
    await deleteSupplier(id);
    setSuppliers(suppliers.filter(s => s._id !== id));
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">Suppliers</h2>

      {/* Add new supplier */}
      <div className="grid grid-cols-4 gap-2">
        <input
          className="border p-2 rounded"
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Phone"
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Address"
          value={form.address}
          onChange={e => setForm({ ...form, address: e.target.value })}
        />
        <button
          onClick={save}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition col-span-4"
        >
          Add Supplier
        </button>
      </div>

      {/* Suppliers table */}
      <table className="w-full border-collapse border border-slate-300 mt-4">
        <thead className="bg-slate-100">
          <tr>
            <th className="border px-4 py-2">#</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Phone</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Address</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((s, i) => (
            <tr key={s._id} className="hover:bg-slate-50">
              <td className="border px-4 py-2">{i + 1}</td>
              <td className="border px-4 py-2">
                {editingId === s._id ? (
                  <input
                    className="border p-1 rounded w-full"
                    value={editingForm.name}
                    onChange={e => setEditingForm({ ...editingForm, name: e.target.value })}
                  />
                ) : (
                  s.name
                )}
              </td>
              <td className="border px-4 py-2">
                {editingId === s._id ? (
                  <input
                    className="border p-1 rounded w-full"
                    value={editingForm.phone}
                    onChange={e => setEditingForm({ ...editingForm, phone: e.target.value })}
                  />
                ) : (
                  s.phone || "—"
                )}
              </td>
              <td className="border px-4 py-2">
                {editingId === s._id ? (
                  <input
                    className="border p-1 rounded w-full"
                    value={editingForm.email}
                    onChange={e => setEditingForm({ ...editingForm, email: e.target.value })}
                  />
                ) : (
                  s.email || "—"
                )}
              </td>
              <td className="border px-4 py-2">
                {editingId === s._id ? (
                  <input
                    className="border p-1 rounded w-full"
                    value={editingForm.address}
                    onChange={e => setEditingForm({ ...editingForm, address: e.target.value })}
                  />
                ) : (
                  s.address || "—"
                )}
              </td>
              <td className="border px-4 py-2 text-center space-x-2">
                {editingId === s._id ? (
                  <button
                    onClick={() => saveEdit(s._id)}
                    className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => startEdit(s)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => remove(s._id)}
                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {suppliers.length === 0 && (
            <tr>
              <td colSpan="6" className="border px-4 py-2 text-center text-slate-500">
                No suppliers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
