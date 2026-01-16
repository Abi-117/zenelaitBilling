import { useState } from 'react';

const ProjectsView = () => {
  // Internal state for projects
  const [projects, setProjects] = useState([
    { id: 1, name: 'Website Redesign', client: 'ABC Corp', rate: 1200, status: 'Active' }
  ]);

  const [form, setForm] = useState({ name: '', client: '', rate: '' });

  const addProject = () => {
    // Validate
    if (!form.name || !form.client || !form.rate) {
      alert('Please fill all fields');
      return;
    }

    const newProject = {
      id: Date.now(),
      name: form.name,
      client: form.client,
      rate: Number(form.rate),
      status: 'Active'
    };

    setProjects([...projects, newProject]);
    setForm({ name: '', client: '', rate: '' });
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-6">

      {/* Add Project Form */}
      <div className="grid grid-cols-4 gap-3">
        <input
          className="border rounded px-3 py-2"
          placeholder="Project Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Client"
          value={form.client}
          onChange={e => setForm({ ...form, client: e.target.value })}
        />
        <input
          type="number"
          className="border rounded px-3 py-2"
          placeholder="Rate / hr"
          value={form.rate}
          onChange={e => setForm({ ...form, rate: e.target.value })}
        />
        <button
          onClick={addProject}
          className="bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
        >
          Add Project
        </button>
      </div>

      {/* Projects Table */}
      <table className="w-full text-sm mt-4 border-collapse border border-slate-200">
        <thead className="text-left text-slate-500 border-b">
          <tr>
            <th className="p-2 border">Project</th>
            <th className="p-2 border">Client</th>
            <th className="p-2 border">Rate</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(p => (
            <tr key={p.id} className="border-b">
              <td className="py-2 px-2 font-medium">{p.name}</td>
              <td className="py-2 px-2">{p.client}</td>
              <td className="py-2 px-2">₹{p.rate}/hr</td>
              <td className="py-2 px-2">
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                  {p.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectsView;
