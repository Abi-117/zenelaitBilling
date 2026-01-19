// UserManagementView.jsx
import { useState } from 'react';
import { X, Pencil } from 'lucide-react';

const initialUsers = [
  { id: 1, name: 'Admin User', role: 'Admin', lastLogin: '2026-01-15 09:23' },
  { id: 2, name: 'Billing User', role: 'Billing Only', lastLogin: '2026-01-14 16:42' },
];

const roles = ['Admin', 'Billing Only', 'Inventory Only'];

const UserManagementView = () => {
  const [users, setUsers] = useState(initialUsers);
  const [form, setForm] = useState({ name: '', role: 'Billing Only' });
  const [editingUser, setEditingUser] = useState(null);
  const [search, setSearch] = useState('');

  const addUser = () => {
    if (!form.name) return alert('Name is required');
    if (editingUser) {
      // Update user
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...form } : u));
      setEditingUser(null);
    } else {
      // Add new user
      setUsers([...users, { ...form, id: Date.now(), lastLogin: '-' }]);
    }
    setForm({ name: '', role: 'Billing Only' });
  };

  const editUser = (user) => {
    setForm({ name: user.name, role: user.role });
    setEditingUser(user);
  };

  const deleteUser = (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* Search */}
      <div className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search users..."
          className="border rounded px-3 py-2 text-sm w-full md:w-1/3"
        />
      </div>

      {/* Add / Edit User Form */}
      <div className="bg-white rounded-xl shadow p-6 flex gap-3 flex-wrap items-end">
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
            {roles.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <button
          onClick={addUser}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingUser ? 'Update User' : 'Add User'}
        </button>
        {editingUser && (
          <button
            onClick={() => { setEditingUser(null); setForm({ name: '', role: 'Billing Only' }) }}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
        <h2 className="text-lg font-bold mb-4">Existing Users</h2>
        <table className="w-full text-sm table-auto">
          <thead>
            <tr className="text-left text-slate-500 border-b">
              <th className="py-2 px-3">Name</th>
              <th>Role</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={4} className="py-3 text-center text-slate-400">No users found</td>
              </tr>
            )}
            {filteredUsers.map(user => (
              <tr key={user.id} className="border-b hover:bg-slate-50">
                <td className="py-2 px-3 font-medium">{user.name}</td>
                <td className="px-3">{user.role}</td>
                <td className="px-3">{user.lastLogin}</td>
                <td className="px-3 flex gap-2">
                  <button
                    onClick={() => editUser(user)}
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Pencil size={14}/> Edit
                  </button>
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="text-red-600 hover:underline flex items-center gap-1"
                  >
                    <X size={14}/> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementView;
