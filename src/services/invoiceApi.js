import API from "./api"; // your axios instance with JWT interceptor

// ================= INVOICES =================

// Fetch all invoices
export const fetchInvoices = async () => {
  try {
    const { data } = await API.get("/invoices");
    return data || [];
  } catch (err) {
    console.error("Failed to fetch invoices:", err);
    return [];
  }
};

// Fetch invoices by customer
export const fetchInvoicesByCustomer = async (customerId) => {
  try {
    const { data } = await API.get(`/invoices/customer/${customerId}`);
    return data || [];
  } catch (err) {
    console.error("Failed to fetch invoices by customer:", err);
    return [];
  }
};

// Create/save invoice
export const saveInvoice = async (invoice) => {
  const { data } = await API.post("/invoices", invoice);
  return data;
};

// Mark invoice as paid
export const markInvoicePaid = async (invoiceId) => {
  const { data } = await API.put(`/invoices/${invoiceId}/mark-paid`);
  return data;
};

// Generate invoice from timesheets
export const generateInvoiceFromTimesheets = async (payload) => {
  const { data } = await API.post("/invoices/generate/from-timesheets", payload);
  return data;
};

// Monthly sales summary
export const fetchMonthlySales = async () => {
  const { data } = await API.get("/invoices/monthly-sales");
  return data || [];
};
