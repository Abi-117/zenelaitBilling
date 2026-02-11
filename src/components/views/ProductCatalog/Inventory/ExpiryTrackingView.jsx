import { useState, useEffect } from "react";
import Card from "../../../ui/Card";
import { AlertTriangle } from "lucide-react";
import { fetchBatches } from "../../../../services/api";

const ExpiryTrackingView = () => {
  const [batches, setBatches] = useState([]);
  const today = new Date();

  useEffect(() => {
    const loadBatches = async () => {
      try {
        const data = await fetchBatches();
        setBatches(data);
      } catch (err) {
        console.error("Failed to fetch batches", err);
      }
    };
    loadBatches();
  }, []);

  const getStatus = (expiry) => {
    if (!expiry) return "ok";
    const exp = new Date(expiry);
    const diff = (exp - today) / (1000 * 60 * 60 * 24); // days difference

    if (diff < 0) return "expired";
    if (diff <= 30) return "warning";
    return "ok";
  };

  return (
    <Card>
      <h3 className="font-semibold mb-4">Expiry Tracking</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="border-b text-slate-500 text-left">
            <tr>
              <th className="py-2">Item</th>
              <th>Batch</th>
              <th>Expiry</th>
              <th>Qty</th>
              <th>Cost</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {batches.map((b) => {
              const status = getStatus(b.expiry);
              return (
                <tr key={b._id} className="border-b last:border-0 hover:bg-slate-50 transition">
                  <td className="py-2">{b.item?.name || "Deleted Item"}</td>
                  <td>{b.batchNo}</td>
                  <td>{b.expiry?.slice(0, 10)}</td>
                  <td>{b.quantity}</td>
                  <td>₹{b.cost}</td>
                  <td>
                    {status === "expired" && (
                      <span className="flex items-center gap-1 text-red-600 text-xs font-semibold">
                        <AlertTriangle size={14} /> Expired
                      </span>
                    )}
                    {status === "warning" && (
                      <span className="text-amber-600 text-xs font-semibold">Expiring Soon</span>
                    )}
                    {status === "ok" && (
                      <span className="text-green-600 text-xs font-semibold">Valid</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {batches.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-slate-500">
                  No batches found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default ExpiryTrackingView;
