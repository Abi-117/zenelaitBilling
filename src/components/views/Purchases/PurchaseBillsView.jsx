// PurchaseBillsView.jsx
import { useEffect, useState } from "react";
import { fetchPurchaseBills } from "../../../services/api";
import PurchasePaymentPanel from "./PurchasePaymentPanel";

export default function PurchaseBillsView() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBill, setSelectedBill] = useState(null);

  const loadBills = async () => {
    try {
      setLoading(true);
      const data = await fetchPurchaseBills();
      setBills(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load purchase bills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBills();
  }, []);

  const calculateNextStepDate = (bill) => {
    if (bill.status === "Paid" || !bill.billDate) return null;
    const days = bill.status === "Pending" ? 7 : 5;
    return new Date(new Date(bill.billDate).getTime() + days * 86400000);
  };

  if (loading)
    return <div className="p-6 text-center text-gray-500">Loading purchase bills...</div>;

  if (error)
    return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Purchase Bills</h2>

      <div className="bg-white shadow rounded p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th>Bill No</th>
              <th>Supplier</th>
              <th>GRN</th>
              <th>Total</th>
              <th>Status</th>
              <th>Bill Date</th>
              <th>Next Step</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bills.length ? (
              bills.map((b) => {
                const nextStepDate = calculateNextStepDate(b);
                const isPaid = b.status === "Paid";
                const isOverdue = nextStepDate && new Date() > nextStepDate;

                return (
                  <tr key={b._id} className="border-b">
                    <td>{b.billNo}</td>
                    <td>{b.supplier?.name || "-"}</td>
                    <td>{b.grn?.grnNo || "-"}</td>
                    <td>₹{b.total}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          isPaid
                            ? "bg-green-100 text-green-700"
                            : b.status === "Partial"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td>{b.billDate ? new Date(b.billDate).toLocaleDateString() : "-"}</td>
                    <td className={isOverdue ? "text-red-600 font-semibold" : ""}>
                      {nextStepDate ? nextStepDate.toLocaleDateString() : "-"}
                    </td>
                    <td>
                      {!isPaid && (
                        <button
                          className="px-2 py-1 text-white bg-blue-600 rounded text-xs"
                          onClick={() => setSelectedBill(b)}
                        >
                          Pay Now
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="text-center p-4 text-slate-500">
                  No purchase bills found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Payment Modal */}
      {selectedBill && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow w-80">
            <PurchasePaymentPanel
              bill={selectedBill}
              onClose={() => setSelectedBill(null)}
              reloadBills={loadBills}
            />
          </div>
        </div>
      )}
    </div>
  );
}
