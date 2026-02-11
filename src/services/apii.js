const API_BASE = "http://localhost:5000/api";
 // your backend URL

export const fetchGRNs = async () => {
  const res = await fetch(`${API_BASE}/grns`);
  return res.json();
};

export const fetchPurchaseBills = async () => {
  const res = await fetch(`${API_BASE}/purchase-bills`);
  return res.json();
};

export const fetchPurchaseReturns = async () => {
  const res = await fetch(`${API_BASE}/purchase-returns`);
  return res.json();
};
export const fetchSupplierPayments = async () => {
  const res = await axios.get(`${API}/supplier-payments`);
  return res.data;
};
