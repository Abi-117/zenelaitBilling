import { useEffect, useState } from "react";
import RecordExpenseView from "./RecordExpenseView";
import RecurringExpenseView from "./RecurringExpenseView";
import ExpenseCategoriesView from "./ExpenseCategoriesView";

import {
  fetchExpenses,
  fetchCategories,
  fetchRecurringExpenses,
  createExpense,
  createRecurringExpense,
  updateCategory,
} from "../../../services/expenseApi";

const ExpensesView = () => {
  const [activeTab, setActiveTab] = useState("record");
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recurringExpenses, setRecurringExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [e, c, r] = await Promise.all([
          fetchExpenses(),
          fetchCategories(),
          fetchRecurringExpenses(),
        ]);
        setExpenses(e.map(exp => ({ ...exp, id: exp._id })));
        setCategories(c.map(cat => ({ ...cat, id: cat._id })));
        setRecurringExpenses(r.map(rec => ({ ...rec, id: rec._id })));
      } catch (err) {
        console.error("Failed to load expense data", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <p className="text-sm text-slate-500">Loading expenses...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Expenses</h1>
        <p className="text-sm text-slate-500">Expense tracking & management</p>
      </div>

      <div className="flex gap-6 border-b">
        {[
          { id: "record", label: "Record Expense" },
          { id: "recurring", label: "Recurring Expenses" },
          { id: "categories", label: "Expense Categories" },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`pb-2 text-sm font-semibold border-b-2 ${
              activeTab === t.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "record" && (
        <RecordExpenseView
          categories={categories}
          expenses={expenses}
          onSave={async expense => {
            const saved = await createExpense(expense);
            setExpenses(prev => [...prev, { ...saved, id: saved._id }]);
          }}
        />
      )}

      {activeTab === "recurring" && (
        <RecurringExpenseView
          data={recurringExpenses}
          onAdd={async rec => {
            const saved = await createRecurringExpense(rec);
            setRecurringExpenses(prev => [...prev, { ...saved, id: saved._id }]);
          }}
          onUpdate={updated => {
            setRecurringExpenses(prev =>
              prev.map(r => (r.id === updated._id ? { ...updated, id: updated._id } : r))
            );
          }}
          onDelete={id => {
            setRecurringExpenses(prev => prev.filter(r => r.id !== id));
          }}
        />
      )}

      {activeTab === "categories" && (
        <ExpenseCategoriesView
          categories={categories}
          onUpdate={async updated => {
            const res = await updateCategory(updated._id, updated);
            setCategories(prev =>
              prev.map(c => (c.id === res._id ? { ...res, id: res._id } : c))
            );
          }}
        />
      )}
    </div>
  );
};

export default ExpensesView;
