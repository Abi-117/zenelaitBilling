// services/dashboardApi.js
import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "/api"; // production (Render/Vercel)

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * Fetch full dashboard summary
 */
export const getDashboardSummary = async (range = "YTD") => {
  try {
    const res = await api.get(`/dashboard`, {
      params: { range },
    });
    return res.data;
  } catch (err) {
    console.error("Dashboard summary error:", err.response?.data || err.message);
    return null;
  }
};

/**
 * Fetch dashboard metrics
 */
export const fetchMetrics = async (range = "YTD") => {
  try {
    const res = await api.get(`/dashboard/metrics`, {
      params: { range },
    });
    return res.data;
  } catch (err) {
    console.error("Metrics error:", err.response?.data || err.message);
    return null;
  }
};

/**
 * Fetch receivables
 */
export const fetchReceivables = async (range = "YTD") => {
  try {
    const res = await api.get(`/dashboard/receivables`, {
      params: { range },
    });
    return res.data;
  } catch (err) {
    console.error("Receivables error:", err.response?.data || err.message);
    return null;
  }
};

/**
 * Fetch net revenue
 */
export const fetchNetRevenue = async (range = "YTD") => {
  try {
    const res = await api.get(`/dashboard/net-revenue`, {
      params: { range },
    });
    return res.data;
  } catch (err) {
    console.error("Net revenue error:", err.response?.data || err.message);
    return null;
  }
};

/**
 * Fetch subscriptions
 */
export const fetchSubscriptions = async (range = "YTD") => {
  try {
    const res = await api.get(`/dashboard/subscriptions`, {
      params: { range },
    });
    return res.data;
  } catch (err) {
    console.error("Subscriptions error:", err.response?.data || err.message);
    return null;
  }
};
