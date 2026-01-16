import { useState } from 'react';

const ExpenseCategoriesView = ({ categories, onUpdate }) => {
  const [editingId, setEditingId] = useState(null);
  const [temp, setTemp] = useState({ name: '', budget: '' });

  const startEdit = c => {
    setEditingId(c.id);
    setTemp(c);
  };

  const saveEdit = () => {
    onUpdate(prev =>
      prev.map(c =>
        c.id === editingId ? temp : c
      )
    );
    setEditingId(null);
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-2xl">
      <h2 className="text-lg font-bold mb-4">Expense Categories</h2>

      {categories.map(c => (
        <div
          key={c.id}
          className="flex justify-between items-center p-3 border rounded-lg mb-2"
        >
          {editingId === c.id ? (
            <>
              <input
                className="input w-40"
                value={temp.name}
                onChange={e =>
                  setTemp({ ...temp, name: e.target.value })
                }
              />
              <input
                type="number"
                className="input w-32"
                value={temp.budget}
                onChange={e =>
                  setTemp({ ...temp, budget: e.target.value })
                }
              />
              <button
                onClick={saveEdit}
                className="text-blue-600 font-semibold"
              >
                Save
              </button>
            </>
          ) : (
            <>
              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-xs text-slate-500">
                  Budget ₹{c.budget}
                </p>
              </div>
              <button
                onClick={() => startEdit(c)}
                className="text-blue-600 text-sm"
              >
                Edit
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ExpenseCategoriesView;
