export const EXPENSE_CATEGORIES = [
  { id: 1, name: 'Travel', budget: 15000 },
  { id: 2, name: 'Meals', budget: 8000 },
  { id: 3, name: 'Office Supplies', budget: 10000 },
];

export const RECURRING_EXPENSES = [
  {
    id: 'RE-101',
    name: 'Office Rent',
    amount: 25000,
    frequency: 'Monthly',
    nextDate: '2026-02-01',
    status: 'Active',
  },
  {
    id: 'RE-102',
    name: 'Internet',
    amount: 1200,
    frequency: 'Monthly',
    nextDate: '2026-02-05',
    status: 'Paused',
  },
];
