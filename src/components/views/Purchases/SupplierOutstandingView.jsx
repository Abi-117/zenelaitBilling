import { useState, useMemo } from "react";
import { Search } from "lucide-react";

const SupplierOutstandingView = ({ bills = [] }) => {
  const [search, setSearch] = useState("");

  /* ---------------- BUILD OUTSTANDING SAFELY ---------------- */
  const outstanding = useMemo(() => {
    return (Array.isArray(bills) ? bills : []).reduce((acc, b) => {
      // 🛡️ HARD SAFETY (this is the key)
      const supplier =
        b?.supplier && typeof b.supplier === "object"
          ? b.supplier.name || "Unknown Supplier"
          : b?.supplier || "Unknown Supplier";

      if (!acc[supplier]) {
        acc[supplier] = {
          supplier,
          bills: 0,
          amount: 0,
          aging: { "0-30": 0, "31-60": 0, "60+": 0 },
        };
      }

      if (b?.status !== "Paid") {
        const total = Number(b?.total || b?.grandTotal || 0);
        acc[supplier].bills += 1;
        acc[supplier].amount += total;
        acc[supplier].aging["0-30"] += total;
      }

      return acc;
    }, {});
  }, [bills]);

  /* ---------------- FILTER ---------------- */
  const filtered = useMemo(() => {
    return Object.values(outstanding)
      .filter((o) =>
        (o.supplier || "")
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .sort((a, b) => a.supplier.localeCompare(b.supplier));
  }, [outstanding, search]);

  const totalOutstanding = filtered.reduce(
    (sum, o) => sum + o.amount,
    0
  );

  const formatAmount = (amt) => `₹${(amt || 0).toFixed(2)}`;

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Supplier Outstanding</h2>
          <p className="text-sm text-slate-500">
            Total unpaid bills grouped by supplier
          </p>
        </div>

        <div className="flex items-center gap-2 border rounded px-3 py-2 text-sm">
          <Search size={16} className="text-slate-400" />
          <input
            placeholder="Search supplier"
            className="outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="p-3 text-left">Supplier</th>
              <th className="p-3 text-center">Bills</th>
              <th className="p-3 text-right">Outstanding</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={i} className="border-b">
                <td className="p-3 font-medium">{row.supplier}</td>
                <td className="p-3 text-center">{row.bills}</td>
                <td className="p-3 text-right font-bold text-rose-600">
                  {formatAmount(row.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-slate-50 rounded-xl p-4 flex justify-between font-semibold">
        <span>Total Outstanding</span>
        <span className="text-rose-600">
          {formatAmount(totalOutstanding)}
        </span>
      </div>
    </div>
  );
};

export default SupplierOutstandingView;
