import { useEffect, useState } from "react";
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../../../services/timeTrackingApi";

const emptyForm = {
  name: "",
  client: "",
  rate: "",
  status: "Active",
};

const ProjectsView = ({ onSelect }) => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ================= LOAD PROJECTS ================= */
  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await fetchProjects();

      // ✅ Normalize MongoDB _id → id
      const data = (res.data || []).map(p => ({
        ...p,
        id: p._id,
      }));

      setProjects(data);
    } catch (err) {
      console.error("Failed to load projects", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  /* ================= SAVE (CREATE / UPDATE) ================= */
  const saveProject = async () => {
    if (!form.name || !form.rate) {
      alert("Project name & rate required");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name,
        client: form.client,
        rate: Number(form.rate),
        status: form.status,
      };

      if (editingId) {
        // ✅ UPDATE
        await updateProject(editingId, payload);
      } else {
        // ✅ CREATE
        await createProject(payload);
      }

      setForm(emptyForm);
      setEditingId(null);
      loadProjects();
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  /* ================= EDIT ================= */
  const editProject = p => {
    setEditingId(p.id);
    setForm({
      name: p.name || "",
      client: p.client || "",
      rate: p.rate || "",
      status: p.status || "Active",
    });
  };

  /* ================= DELETE ================= */
  const removeProject = async id => {
    if (!confirm("Delete this project?")) return;
    try {
      await deleteProject(id);
      loadProjects();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="space-y-6">

      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Projects</h2>
      </div>

      {/* ===== FORM ===== */}
      <div className="bg-white rounded-xl p-4 border grid grid-cols-5 gap-3">
        <input
          className="input"
          placeholder="Project Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="input"
          placeholder="Client"
          value={form.client}
          onChange={e => setForm({ ...form, client: e.target.value })}
        />
        <input
          type="number"
          className="input"
          placeholder="Rate / Hour"
          value={form.rate}
          onChange={e => setForm({ ...form, rate: e.target.value })}
        />
        <select
          className="input"
          value={form.status}
          onChange={e => setForm({ ...form, status: e.target.value })}
        >
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
        </select>

        <button
          onClick={saveProject}
          disabled={saving}
          className={`bg-emerald-600 text-white rounded-lg font-semibold ${
            saving ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      {/* ===== TABLE ===== */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Project</th>
              <th>Client</th>
              <th>Rate</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : projects.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-6 text-center text-slate-400">
                  No projects created
                </td>
              </tr>
            ) : (
              projects.map(p => (
                <tr key={p.id} className="border-t">
                  <td
                    className="p-3 font-semibold cursor-pointer"
                    onClick={() => onSelect?.(p)}
                  >
                    {p.name}
                  </td>
                  <td>{p.client || "-"}</td>
                  <td>₹{p.rate}</td>
                  <td>{p.status}</td>
                  <td className="text-right p-3 space-x-3">
                    <button
                      onClick={() => editProject(p)}
                      className="text-blue-600 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeProject(p.id)}
                      className="text-red-600 text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default ProjectsView;
