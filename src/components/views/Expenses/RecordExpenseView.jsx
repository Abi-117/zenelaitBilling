import { useState } from 'react';

const RecordExpenseView = ({ categories, onSave, expenses }) => {
  const [form, setForm] = useState({
    name: '',
    amount: '',
    category: '',
    vendor: '',
    date: '',
    notes: '',
  });

  const handleSave = () => {
    if (!form.name || !form.amount) return;

    onSave({
      id: Date.now(),
      ...form,
      amount: Number(form.amount),
    });

    setForm({
      name: '',
      amount: '',
      category: '',
      vendor: '',
      date: '',
      notes: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* FORM */}
      <div className="bg-white rounded-xl shadow p-6 max-w-3xl">
        <h2 className="text-lg font-bold mb-4">Record Expense</h2>

        <div className="grid grid-cols-2 gap-4">
          <input
            className="input"
            placeholder="Expense Name"
            value={form.name}
            onChange={e =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            type="number"
            className="input"
            placeholder="Amount"
            value={form.amount}
            onChange={e =>
              setForm({ ...form, amount: e.target.value })
            }
          />

          <select
            className="input"
            value={form.category}
            onChange={e =>
              setForm({ ...form, category: e.target.value })
            }
          >
            <option value="">Select Category</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="input"
            value={form.date}
            onChange={e =>
              setForm({ ...form, date: e.target.value })
            }
          />

          <input
            className="input col-span-2"
            placeholder="Vendor"
            value={form.vendor}
            onChange={e =>
              setForm({ ...form, vendor: e.target.value })
            }
          />

          <textarea
            className="input col-span-2"
            placeholder="Notes"
            value={form.notes}
            onChange={e =>
              setForm({ ...form, notes: e.target.value })
            }
          />
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Save Expense
          </button>
        </div>
      </div>

      {/* SAVED EXPENSES LIST */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="font-bold mb-3">Saved Expenses</h3>

        {expenses.length === 0 ? (
          <p className="text-slate-500">No expenses yet</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-slate-500 border-b">
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(e => (
                <tr key={e.id} className="border-b">
                  <td>{e.name}</td>
                  <td>{e.category}</td>
                  <td className="font-semibold">₹{e.amount}</td>
                  <td>{e.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RecordExpenseView;
