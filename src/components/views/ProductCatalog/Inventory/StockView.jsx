import { useEffect, useMemo, useState } from "react";
import { Plus, Download } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Card from "../../../ui/Card";
import { fetchItems, fetchStockLogs, addStockLog } from "../../../../services/api";

export default function StockView() {
  /* -------------------- STATE -------------------- */
  const [items, setItems] = useState([]);
  const [logs, setLogs] = useState([]);
  const [mode, setMode] = useState("IN");
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    item: "",
    quantity: "",
    reason: "",
    notes: "",
  });

  const [filter, setFilter] = useState({
    type: "ALL",
    item: "",
    month: "",
  });

  /* -------------------- LOAD DATA -------------------- */
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [itemsRes, logsRes] = await Promise.all([fetchItems(), fetchStockLogs()]);
      setItems(itemsRes || []);
      setLogs(logsRes || []);
    } catch (err) {
      console.error("Stock load failed", err);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- SUBMIT STOCK -------------------- */
  const submitStock = async () => {
    if (!form.item || !form.quantity || !form.reason) {
      alert("Fill all required fields");
      return;
    }

    try {
      await addStockLog({
        item: form.item,
        quantity: Number(form.quantity),
        type: mode,
        reason: form.reason,
        notes: form.notes,
      });

      setForm({ item: "", quantity: "", reason: "", notes: "" });
      await loadData();
    } catch (err) {
      alert("Failed to save stock entry");
      console.error(err);
    }
  };

  /* -------------------- FILTER LOGS -------------------- */
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (filter.type !== "ALL" && log.type !== filter.type) return false;
      if (filter.item && log.item?._id !== filter.item) return false;
      if (filter.month) {
        const logMonth = new Date(log.createdAt).toISOString().slice(0, 7);
        if (logMonth !== filter.month) return false;
      }
      return true;
    });
  }, [logs, filter]);

  /* -------------------- STOCK BALANCE -------------------- */
  const calculateStock = (itemId) => {
    return logs.reduce((total, l) => {
      if (l.item?._id !== itemId) return total;
      return l.type === "IN" ? total + l.quantity : total - l.quantity;
    }, 0);
  };

  /* -------------------- EXCEL EXPORT -------------------- */
  const downloadExcel = () => {
    if (filteredLogs.length === 0) {
      alert("No stock records to export");
      return;
    }

    const data = filteredLogs.map((l) => ({
      Date: new Date(l.createdAt).toLocaleDateString(),
      Item: l.item ? l.item.name : "Deleted Item",
      Type: l.type,
      Quantity: l.quantity,
      Balance: calculateStock(l.item?._id),
      Reason: l.reason,
      Notes: l.notes || "",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Stock Logs");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `Stock_Logs_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  /* -------------------- UI -------------------- */
  if (loading) return <div className="p-6">Loading stock...</div>;

  return (
    <div className="space-y-6 p-6">
      {/* MODE SWITCH */}
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <button
            onClick={() => setMode("IN")}
            className={`px-4 py-2 rounded ${mode === "IN" ? "bg-green-600 text-white" : "bg-slate-100"}`}
          >
            Stock In
          </button>
          <button
            onClick={() => setMode("OUT")}
            className={`px-4 py-2 rounded ${mode === "OUT" ? "bg-red-600 text-white" : "bg-slate-100"}`}
          >
            Stock Out
          </button>
        </div>

        <button
          onClick={downloadExcel}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
        >
          <Download size={16} />
          Download
        </button>
      </div>

      {/* FILTERS */}
      <Card>
        <div className="grid grid-cols-3 gap-4">
          <select
            className="input"
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
          >
            <option value="ALL">All</option>
            <option value="IN">IN</option>
            <option value="OUT">OUT</option>
          </select>

          <select
            className="input"
            value={filter.item}
            onChange={(e) => setFilter({ ...filter, item: e.target.value })}
          >
            <option value="">All Items</option>
            {items
              .filter((i) => i.status === "Active")
              .map((i) => (
                <option key={i._id} value={i._id}>
                  {i.name}
                </option>
              ))}
          </select>

          <input
            type="month"
            className="input"
            value={filter.month}
            onChange={(e) => setFilter({ ...filter, month: e.target.value })}
          />
        </div>
      </Card>

      {/* ADD STOCK */}
      <Card>
        <div className="grid grid-cols-4 gap-4">
          <select
            className="input"
            value={form.item}
            onChange={(e) => setForm({ ...form, item: e.target.value })}
          >
            <option value="">Select Item</option>
            {items
              .filter((i) => i.status === "Active")
              .map((i) => (
                <option key={i._id} value={i._id}>
                  {i.name}
                </option>
              ))}
          </select>

          <input
            type="number"
            className="input"
            placeholder="Qty"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          />

          <select
            className="input"
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
          >
            <option value="">Reason</option>
            <option>Purchase</option>
            <option>Sale</option>
            <option>Damage</option>
            <option>Adjustment</option>
            <option>Opening Stock</option>
          </select>

          <button
            onClick={submitStock}
            className={`flex items-center justify-center gap-2 text-white rounded ${
              mode === "IN" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            <Plus size={16} />
            {mode === "IN" ? "Add" : "Remove"}
          </button>
        </div>

        <textarea
          className="input mt-4"
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </Card>

      {/* HISTORY */}
      <Card>
        <table className="w-full text-sm border">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-2">Date</th>
              <th className="p-2">Item</th>
              <th className="p-2">Type</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Balance</th>
              <th className="p-2">Reason</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((l) => (
              <tr
                key={l._id}
                className={`border-t ${!l.item ? "opacity-60" : ""}`} // faded row if item deleted
              >
                <td className="p-2">{new Date(l.createdAt).toLocaleDateString()}</td>
                <td className="p-2">
                  {l.item ? (
                    l.item.name
                  ) : (
                    <span className="inline-block px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded">
                      Deleted Item
                    </span>
                  )}
                </td>
                <td className="p-2">{l.type}</td>
                <td className="p-2">{l.quantity}</td>
                <td className="p-2 font-bold">{calculateStock(l.item?._id)}</td>
                <td className="p-2">{l.reason}</td>
              </tr>
            ))}

            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center">
                  No stock records
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
