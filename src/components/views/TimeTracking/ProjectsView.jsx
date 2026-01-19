import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const ProjectsView = ({ initialProject, onBack }) => {
  /* ================= PROJECT LIST ================= */
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Website Redesign',
      client: 'ABC Corp',
      rate: 1200,
      hours: 25,
      status: 'Active',
      description: 'UI & UX redesign',
    },
    {
      id: 2,
      name: 'Mobile App',
      client: 'Zenelait Pvt Ltd',
      rate: 1500,
      hours: 40,
      status: 'Completed',
      description: 'Android & iOS app',
    },
  ]);

  /* ================= FORM ================= */
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    client: '',
    rate: '',
    hours: '',
    description: '',
  });

  /* ================= PREFILL FROM ESTIMATE ================= */
  useEffect(() => {
    if (initialProject) {
      setForm({
        name: initialProject.name || '',
        client: initialProject.client || '',
        rate: initialProject.rate || '',
        hours: '',
        description: initialProject.description || '',
      });
    }
  }, [initialProject]);

  /* ================= ADD / UPDATE ================= */
  const saveProject = () => {
    if (!form.name || !form.client || !form.rate) {
      alert('Please fill required fields');
      return;
    }

    if (editingId) {
      setProjects(prev =>
        prev.map(p =>
          p.id === editingId
            ? {
                ...p,
                name: form.name,
                client: form.client,
                rate: Number(form.rate),
                hours: Number(form.hours || 0),
                description: form.description,
              }
            : p
        )
      );
    } else {
      setProjects(prev => [
        ...prev,
        {
          id: Date.now(),
          name: form.name,
          client: form.client,
          rate: Number(form.rate),
          hours: Number(form.hours || 0),
          status: 'Active',
          description: form.description,
        },
      ]);
    }

    resetForm();
  };

  /* ================= HELPERS ================= */
  const resetForm = () => {
    setForm({ name: '', client: '', rate: '', hours: '', description: '' });
    setEditingId(null);
  };

  const editProject = p => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      client: p.client,
      rate: p.rate,
      hours: p.hours,
      description: p.description,
    });
  };

  const deleteProject = id => {
    if (!confirm('Delete this project?')) return;
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const toggleStatus = id => {
    setProjects(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, status: p.status === 'Active' ? 'Completed' : 'Active' }
          : p
      )
    );
  };

  /* ================= UI ================= */
  return (
    <div className="p-6 bg-slate-50 min-h-full space-y-6">

      {/* BACK */}
      <button onClick={onBack} className="text-sm text-slate-500">
        ← Back
      </button>

      {/* ===== ADD / EDIT FORM ===== */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-bold mb-4">
          {editingId ? 'Edit Project' : 'Create Project'}
        </h2>

        <div className="grid grid-cols-5 gap-3">
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
            placeholder="Rate / hr"
            value={form.rate}
            onChange={e => setForm({ ...form, rate: e.target.value })}
          />
          <input
            type="number"
            className="input"
            placeholder="Hours"
            value={form.hours}
            onChange={e => setForm({ ...form, hours: e.target.value })}
          />
          <button
            onClick={saveProject}
            className="bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            {editingId ? 'Update' : 'Add'}
          </button>
        </div>

        <textarea
          className="input mt-3"
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
      </div>

      {/* ===== PROJECT LIST ===== */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Project</th>
              <th>Client</th>
              <th>Rate</th>
              <th>Hours</th>
              <th>Earnings</th>
              <th>Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(p => {
              const earnings = p.rate * p.hours;
              return (
                <tr key={p.id} className="border-t">
                  <td className="p-3 font-semibold">{p.name}</td>
                  <td>{p.client}</td>
                  <td>₹{p.rate}</td>
                  <td>{p.hours}</td>
                  <td className="font-semibold">₹{earnings}</td>
                  <td>
                    <button
                      onClick={() => toggleStatus(p.id)}
                      className={`text-xs px-2 py-1 rounded ${
                        p.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {p.status}
                    </button>
                  </td>
                  <td className="p-3 flex justify-end gap-3">
                    <button
                      onClick={() => editProject(p)}
                      className="text-blue-600"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => deleteProject(p.id)}
                      className="text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}

            {projects.length === 0 && (
              <tr>
                <td colSpan="7" className="p-6 text-center text-slate-400">
                  No projects created
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default ProjectsView;
