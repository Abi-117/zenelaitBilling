import { useState } from 'react';

const initialUsers = [
  { id: 1, name: 'Admin User', role: 'Admin', lastLogin: '2026-01-15 09:23' },
  { id: 2, name: 'Billing User', role: 'Billing Only', lastLogin: '2026-01-14 16:42' },
];

const UserManagementView = () => {
  const [users, setUsers] = useState(initialUsers);
  const [form, setForm] = useState({ name: '', role: 'Billing Only' });

  const addUser = () => {
    if (!form.name) return;
    setUsers([...users, { ...form, id: Date.now(), lastLogin: '-' }]);
    setForm({ name: '', role: 'Billing Only' });
  };

  return (
    <div className="space-y-6">
      {/* Add User Form */}
      <div className="bg-white rounded-xl shadow p-6 flex gap-3 items-end">
        <div>
          <label className="text-sm font-medium">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="mt-1 block w-full border rounded px-3 py-2 text-sm"
            placeholder="User Name"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Role</label>
          <select
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
            className="mt-1 block w-full border rounded px-3 py-2 text-sm"
          >
            <option>Admin</option>
            <option>Billing Only</option>
            <option>Inventory Only</option>
          </select>
        </div>
        <button
          onClick={addUser}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add User
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
        <h2 className="text-lg font-bold mb-4">Existing Users</h2>
        <table className="w-full text-sm table-auto">
          <thead>
            <tr className="text-left text-slate-500 border-b">
              <th className="py-2">Name</th>
              <th>Role</th>
              <th>Last Login</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b hover:bg-slate-50">
                <td className="py-2 font-medium">{user.name}</td>
                <td>{user.role}</td>
                <td>{user.lastLogin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementView;
