import axios from "axios";

// Base API URL
const API_BASE = "http://localhost:5000/api";

// ---------------- EXPENSES ----------------

// Fetch all expenses
export const fetchExpenses = async () => {
  const res = await axios.get(`${API_BASE}/expenses`);
  return res.data;
};

// Create a new expense
export const createExpense = async (expense) => {
  const res = await axios.post(`${API_BASE}/expenses`, expense);
  return res.data;
};

// Update an existing expense
export const updateExpense = async (id, expense) => {
  const res = await axios.put(`${API_BASE}/expenses/${id}`, expense);
  return res.data;
};

// Delete an expense
export const deleteExpense = async (id) => {
  const res = await axios.delete(`${API_BASE}/expenses/${id}`);
  return res.data;
};

// ---------------- RECURRING EXPENSES ----------------

// Fetch all recurring expenses
export const fetchRecurringExpenses = async () => {
  const res = await axios.get(`${API_BASE}/recurring-expenses`);
  return res.data;
};

// Create a recurring expense
export const createRecurringExpense = async (recurring) => {
  const res = await axios.post(`${API_BASE}/recurring-expenses`, recurring);
  return res.data;
};

// Update a recurring expense
export const updateRecurringExpense = async (id, recurring) => {
  const res = await axios.put(`${API_BASE}/recurring-expenses/${id}`, recurring);
  return res.data;
};

// Delete a recurring expense
export const deleteRecurringExpense = async (id) => {
  const res = await axios.delete(`${API_BASE}/recurring-expenses/${id}`);
  return res.data;
};

// ---------------- CATEGORIES ----------------

// Fetch all categories
export const fetchCategories = async () => {
  const res = await axios.get(`${API_BASE}/categories`);
  return res.data;
};

// Create a category
export const createCategory = async (category) => {
  const res = await axios.post(`${API_BASE}/categories`, category);
  return res.data;
};

// Update a category
export const updateCategory = async (id, category) => {
  const res = await axios.put(`${API_BASE}/categories/${id}`, category);
  return res.data;
};

// Delete a category
export const deleteCategory = async (id) => {
  const res = await axios.delete(`${API_BASE}/categories/${id}`);
  return res.data;
};
