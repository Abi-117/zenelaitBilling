import { useState } from 'react';
import RecordExpenseView from './RecordExpenseView';
import RecurringExpenseView from './RecurringExpenseView';
import ExpenseCategoriesView from './ExpenseCategoriesView';

const ExpensesView = () => {
  const [activeTab, setActiveTab] = useState('record');

  // 🔑 SINGLE SOURCE OF TRUTH
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([
    { id: 1, name: 'Travel', budget: 15000 },
    { id: 2, name: 'Meals', budget: 8000 },
    { id: 3, name: 'Office Supplies', budget: 10000 },
  ]);

  const [recurringExpenses, setRecurringExpenses] = useState([
    {
      id: 1,
      name: 'Office Rent',
      amount: 25000,
      frequency: 'Monthly',
      nextDate: '2026-02-01',
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Expenses</h1>
        <p className="text-sm text-slate-500">
          Zoho-style expense tracking & management
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b">
        {[
          { id: 'record', label: 'Record Expense' },
          { id: 'recurring', label: 'Recurring Expenses' },
          { id: 'categories', label: 'Expense Categories' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`pb-2 text-sm font-semibold border-b-2 ${
              activeTab === t.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'record' && (
        <RecordExpenseView
          categories={categories}
          onSave={expense =>
            setExpenses(prev => [...prev, expense])
          }
          expenses={expenses}
        />
      )}

      {activeTab === 'recurring' && (
        <RecurringExpenseView
          data={recurringExpenses}
          onAdd={e =>
            setRecurringExpenses(prev => [...prev, e])
          }
        />
      )}

      {activeTab === 'categories' && (
        <ExpenseCategoriesView
          categories={categories}
          onUpdate={setCategories}
        />
      )}
    </div>
  );
};

export default ExpensesView;
