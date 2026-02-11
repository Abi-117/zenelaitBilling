import { useEffect, useState } from "react";
import {
  fetchPurchaseBills,
  createPurchaseReturn,
  fetchPurchaseReturns,
} from "../../../services/api";

export default function PurchaseReturnsView() {
  const [purchaseBills, setPurchaseBills] = useState([]);
  const [returns, setReturns] = useState([]);
  const [selectedBill, setSelectedBill] = useState("");
  const [billDate, setBillDate] = useState("");
  const [items, setItems] = useState([{ name: "", qty: 1, rate: 0 }]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ================= FETCH DATA ================= */
  const loadData = async () => {
    try {
      setLoading(true);
      const bills = await fetchPurchaseBills();
      const returnsData = await fetchPurchaseReturns();

      setPurchaseBills(bills || []);
      setReturns(returnsData || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ================= BILL SELECT ================= */
  const handleBillSelect = (billId) => {
    setSelectedBill(billId);

    const bill = purchaseBills.find((b) => b._id === billId);
    if (!bill) return;

    setBillDate(
      bill.billDate ? new Date(bill.billDate).toLocaleDateString() : ""
    );

    setItems(
      bill.items?.map((i) => ({
        name: i.name,
        qty: i.qty,
        rate: i.rate,
      })) || [{ name: "", qty: 1, rate: 0 }]
    );
  };

  /* ================= ITEMS ================= */
  const updateItem = (i, key, value) => {
    const copy = [...items];
    copy[i][key] = key === "name" ? value : Number(value);
    setItems(copy);
  };

  const addItem = () =>
    setItems([...items, { name: "", qty: 1, rate: 0 }]);

  const removeItem = (i) =>
    setItems(items.filter((_, index) => index !== i));

  const total = items.reduce(
    (sum, i) => sum + i.qty * i.rate,
    0
  );

  /* ================= DUPLICATE CHECK ================= */
  const isBillAlreadyReturned = returns.some(
    (r) => r.purchaseBill?._id === selectedBill
  );

  const isSaveEnabled =
    selectedBill &&
    items.every((i) => i.name && i.qty > 0 && i.rate > 0) &&
    !isBillAlreadyReturned;

  /* ================= SAVE ================= */
  const submitReturn = async () => {
    if (!isSaveEnabled || saving) return;

    try {
      setSaving(true);

      const bill = purchaseBills.find((b) => b._id === selectedBill);

      const payload = {
        purchaseBill: selectedBill,
        supplier: bill?.supplier?._id,
        supplierName: bill?.supplier?.name,
        items,
        total,
        grandTotal: total,
      };

      await createPurchaseReturn(payload);

      await loadData(); // 🔥 IMPORTANT

      setSelectedBill("");
      setBillDate("");
      setItems([{ name: "", qty: 1, rate: 0 }]);

      alert("Purchase return saved!");
    } catch (err) {
      alert(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Purchase Returns</h2>

      {/* CREATE */}
      <div className="bg-white p-4 shadow rounded space-y-3">
        <select
          className="border p-2 w-full"
          value={selectedBill}
          onChange={(e) => handleBillSelect(e.target.value)}
        >
          <option value="">Select Bill</option>
          {purchaseBills.map((b) => (
            <option key={b._id} value={b._id}>
              {b.billNo}
            </option>
          ))}
        </select>

        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              className="border p-2 flex-1"
              value={item.name}
              placeholder="Item"
              onChange={(e) =>
                updateItem(i, "name", e.target.value)
              }
            />
            <input
              type="number"
              className="border p-2 w-20"
              value={item.qty}
              onChange={(e) =>
                updateItem(i, "qty", e.target.value)
              }
            />
            <input
              type="number"
              className="border p-2 w-24"
              value={item.rate}
              onChange={(e) =>
                updateItem(i, "rate", e.target.value)
              }
            />
            <button
              onClick={() => removeItem(i)}
              className="text-red-600"
            >
              ✕
            </button>
          </div>
        ))}

        <div className="flex justify-between">
          <button onClick={addItem} className="text-blue-600">
            + Add Item
          </button>
          <strong>Total: ₹{total}</strong>
        </div>

        <button
          disabled={!isSaveEnabled || saving}
          onClick={submitReturn}
          className="bg-green-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {isBillAlreadyReturned
            ? "Already Returned"
            : saving
            ? "Saving..."
            : "Save Return"}
        </button>
      </div>

      {/* LIST */}
      <div className="bg-white p-4 shadow rounded">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-100">
              <th>Return No</th>
              <th>Supplier</th>
              <th>Bill</th>
              <th>Date</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {returns.map((r) => (
              <tr key={r._id} className="border-b">
                <td>{r.returnNo}</td>
                <td>{r.supplierName}</td>
                <td>{r.purchaseBill?.billNo}</td>
                <td>
                  {new Date(r.createdAt).toLocaleDateString()}
                </td>
                <td>₹{r.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
