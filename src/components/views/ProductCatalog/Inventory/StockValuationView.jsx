import { useEffect, useState } from "react";
import Card from "../../../ui/Card";
import { fetchStockValuation } from "../../../../services/api";

export default function StockValuationView() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ valuation date (default = today)
  const [asOnDate, setAsOnDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    load();
  }, [asOnDate]);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetchStockValuation(asOnDate);
      setData(res || []);
    } catch (e) {
      console.error(e);
      alert("Failed to load stock valuation");
    } finally {
      setLoading(false);
    }
  };

  const totalQty = data.reduce((t, i) => t + (i.quantity || 0), 0);
  const totalFIFO = data.reduce((t, i) => t + (i.fifoValue || 0), 0);
  const totalAVG = data.reduce((t, i) => t + (i.avgCostValue || 0), 0);

  if (loading) return <div className="p-6">Loading valuation...</div>;

  return (
    <div className="p-6 space-y-6">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Stock Valuation</h2>

          {/* 📅 Date Filter */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">As on date:</span>
            <input
              type="date"
              className="input"
              value={asOnDate}
              onChange={(e) => setAsOnDate(e.target.value)}
            />
          </div>
        </div>

        <table className="w-full border text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-2 text-left">Item</th>
              <th className="p-2 text-center">Qty</th>
              <th className="p-2 text-right">FIFO Value</th>
              <th className="p-2 text-right">Avg Cost Value</th>
            </tr>
          </thead>

          <tbody>
            {data.map((i) => (
              <tr key={i.itemId} className="border-t">
                <td className="p-2">{i.itemName}</td>
                <td className="p-2 text-center">{i.quantity}</td>
                <td className="p-2 text-right">₹{i.fifoValue}</td>
                <td className="p-2 text-right">₹{i.avgCostValue}</td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-slate-500">
                  No stock available
                </td>
              </tr>
            )}
          </tbody>

          <tfoot className="bg-slate-50 font-semibold">
            <tr>
              <td className="p-2">Total</td>
              <td className="p-2 text-center">{totalQty}</td>
              <td className="p-2 text-right">₹{totalFIFO}</td>
              <td className="p-2 text-right">₹{totalAVG}</td>
            </tr>
          </tfoot>
        </table>
      </Card>
    </div>
  );
}
