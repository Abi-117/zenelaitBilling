// services/api.js
import axios from "axios";

const BASE_URL = "http://localhost:5000/api"; // your backend URL

// Axios instance
const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


// Add JWT token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle API errors
const handleError = (err) => {
  if (err.response) {
    if (err.response.status === 401) {
      alert("Unauthorized! Please login again.");
    } else {
      alert(err.response.data?.message || "API Error");
    }
  } else {
    alert(err.message || "Network Error");
  }
  console.error(err);
  return null;
};

/* ================= ITEMS ================= */
export const fetchItems = async () => {
  try {
    const { data } = await API.get("/items");
    return data || [];
  } catch (err) {
    return handleError(err) || [];
  }
};

export const fetchDashboardData = async () => {
  try {
    const [
      customersRes,
      invoicesRes,
      paymentLinksRes,
      paymentsRes,
      suppliersRes,
      grnsRes,
      purchaseBillsRes,
    ] = await Promise.all([
      API.get("/customers"),
      API.get("/invoices"),
      API.get("/payment-links"),
      API.get("/payments"),
      API.get("/suppliers"),
      API.get("/grns"),
      API.get("/purchase-bills"),
    ]);

    return {
      customers: customersRes.data,
      invoices: invoicesRes.data,
      paymentLinks: paymentLinksRes.data,
      payments: paymentsRes.data,
      suppliers: suppliersRes.data,
      grns: grnsRes.data,
      purchaseBills: purchaseBillsRes.data,
    };
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    throw error;
  }
};

export const createItem = async (payload) => {
  try {
    const { data } = await API.post("/items", payload);
    return data;
  } catch (err) {
    return handleError(err);
  }
};

export const updateItem = async (id, payload) => {
  try {
    const { data } = await API.put(`/items/${id}`, payload);
    return data;
  } catch (err) {
    return handleError(err);
  }
};

export const deleteItem = async (id) => {
  try {
    const { data } = await API.delete(`/items/${id}`);
    return data;
  } catch (err) {
    return handleError(err);
  }
};

/* ================= STOCK ================= */
export const fetchStockLogs = async () => {
  try {
    const { data } = await API.get("/stock");
    // handle deleted items gracefully
    return data.map((log) => ({
      ...log,
      item: log.item || { _id: null, name: "Item deleted" },
    }));
  } catch (err) {
    return handleError(err) || [];
  }
};

export const addStockLog = async (payload) => {
  try {
    const { data } = await API.post("/stock", payload);
    return data;
  } catch (err) {
    return handleError(err);
  }
};

/* ================= BATCHES ================= */
export const fetchBatches = async () => {
  try {
    const { data } = await API.get("/batches");
    return data.map((b) => ({
      ...b,
      item: b.item || { _id: null, name: "Item deleted" },
    }));
  } catch (err) {
    return handleError(err) || [];
  }
};

export const createBatch = async (payload) => {
  try {
    const { data } = await API.post("/batches", payload);
    return data;
  } catch (err) {
    return handleError(err);
  }
};

export const updateBatch = async (id, payload) => {
  try {
    const { data } = await API.put(`/batches/${id}`, payload);
    return data;
  } catch (err) {
    return handleError(err);
  }
};

export const deleteBatch = async (id) => {
  try {
    const { data } = await API.delete(`/batches/${id}`);
    return data;
  } catch (err) {
    return handleError(err);
  }
};

/* ================= SUPPLIERS ================= */
export const fetchSuppliers = async () => {
  try {
    const { data } = await API.get("/suppliers");
    return data || [];
  } catch (err) {
    return handleError(err) || [];
  }
};

export const createSupplier = async (payload) => {
  try {
    const { data } = await API.post("/suppliers", payload);
    return data;
  } catch (err) {
    return handleError(err);
  }
};

export const updateSupplier = async (id, payload) => {
  try {
    const { data } = await API.put(`/suppliers/${id}`, payload);
    return data;
  } catch (err) {
    return handleError(err);
  }
};

export const deleteSupplier = async (id) => {
  try {
    const { data } = await API.delete(`/suppliers/${id}`);
    return data;
  } catch (err) {
    return handleError(err);
  }
};

/* ================= GRN ================= */
export const fetchGRNs = async () => {
  try {
    const { data } = await API.get("/grns");
    return data || [];
  } catch (err) {
    return handleError(err) || [];
  }
};

export const createGRN = async (payload) => {
  try {
    const { data } = await API.post("/grns", payload);
    return data;
  } catch (err) {
    return handleError(err);
  }
};

export const updateGRN = async (id, payload) => {
  try {
    const { data } = await API.put(`/grns/${id}`, payload);
    return data;
  } catch (err) {
    return handleError(err);
  }
};

export const deleteGRN = async (id) => {
  try {
    const { data } = await API.delete(`/grns/${id}`);
    return data;
  } catch (err) {
    return handleError(err);
  }
};

export const createPurchaseBillFromGRN = async (grnId) => {
  try {
    const { data } = await API.post(`/grns/${grnId}/create-bill`);
    return data;
  } catch (err) {
    return handleError(err);
  }
};

/* ================= PURCHASE BILLS ================= */
export const fetchPurchaseBills = async () => {
  try {
    const { data } = await API.get("/purchase-bills");
    return data || [];
  } catch (err) {
    return handleError(err) || [];
  }
};

export const createPurchaseBill = async (payload) => {
  try {
    const { data } = await API.post("/purchase-bills", payload);
    return data;
  } catch (err) {
    return handleError(err);
  }
};
export const createPurchaseOrder = async (billId) => {
  try {
    const { data } = await API.post("/purchase-payments/order", { billId });
    return data;
  } catch (err) {
    return handleError(err);
  }
};

export const verifyPurchasePayment = async (payload) => {
  try {
    const { data } = await API.post("/purchase-payments/verify", payload);
    return data;
  } catch (err) {
    return handleError(err);
  }
};

/* ================= PURCHASE RETURNS ================= */
export const fetchPurchaseReturns = async () => {
  try {
    const { data } = await API.get("/purchase-returns");
    return data || [];
  } catch (err) {
    return handleError(err) || [];
  }
};

export const createPurchaseReturn = async (payload) => {
  try {
    const { data } = await API.post("/purchase-returns", payload);
    return data;
  } catch (err) {
    return handleError(err);
  }
};

export const deletePurchaseReturn = async (id) => {
  try {
    const { data } = await API.delete(`/purchase-returns/${id}`);
    return data;
  } catch (err) {
    return handleError(err);
  }
};

/* ================= LEDGER ================= */
export const fetchLedger = async (supplierId) => {
  try {
    const { data } = await API.get(`/ledger/${supplierId}`);
    return data || [];
  } catch (err) {
    return handleError(err) || [];
  }
};

export const fetchSupplierPayments = async () => {
  try {
    const { data } = await API.get("/supplier-payments");
    return Array.isArray(data) ? data : data.data || [];
  } catch (err) {
    return handleError(err) || [];
  }
};



export const fetchStockValuation = async () => {
  const res = await fetch("http://localhost:5000/api/stock-valuation");
  if (!res.ok) throw new Error("API failed");
  return res.json();
};

/* ================= PRICING ================= */
export const fetchPricing = async (itemId) => {
  try {
    const { data } = await API.get(`/items/${itemId}/pricing`);
    return data;
  } catch (err) {
    return handleError(err);
  }
};

export const savePricing = async (itemId, payload) => {
  try {
    const { data } = await API.put(`/items/${itemId}/pricing`, payload);
    return data;
  } catch (err) {
    return handleError(err);
  }
};
// Fetch a single item (with tax data)
export const fetchItem = async (itemId) => {
  if (!itemId) throw new Error("Item ID required");
  const res = await axios.get(`${API}/${itemId}`);
  return res.data;
};

// Save tax data
export const saveTax = async (itemId, taxData) => {
  if (!itemId) throw new Error("Item ID required");
  const res = await axios.put(`${API}/tax/${itemId}`, taxData);
  return res.data;
};



export default API;