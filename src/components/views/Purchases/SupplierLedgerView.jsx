import { useState, useEffect, useMemo } from "react";
import {
  fetchPurchaseBills,
  fetchPurchaseReturns,
  fetchSupplierPayments,
} from "../../../services/api";

const SupplierLedgerView = () => {
  const [bills, setBills] = useState([]);
  const [returns, setReturns] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("All");

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    const loadData = async () => {
      try {
        setBills(await fetchPurchaseBills());
        setReturns(await fetchPurchaseReturns());
        setPayments(await fetchSupplierPayments());
      } catch (err) {
        console.error("Ledger load failed", err);
      }
    };
    loadData();
  }, []);

  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    return isNaN(d) ? "-" : d.toISOString().slice(0, 10);
  };

  /* ---------------- COMBINE ALL TRANSACTIONS ---------------- */
  const ledgerEntries = useMemo(() => {
    const entries = [
      /* ---------- PURCHASE BILLS (DEBIT) ---------- */
      ...bills.map((b) => ({
        id: b._id,
        supplier: b.supplier?.name || "-",
        date: formatDate(b.billDate || b.createdAt),
        description: `Purchase Bill ${b.billNo}`,
        debit: Number(b.total || b.grandTotal || 0),
        credit: 0,
      })),

      /* ---------- SUPPLIER PAYMENTS (CREDIT) ---------- */
      ...payments.map((p) => ({
        id: p._id,
        supplier: p.supplier?.name || "-",
        date: formatDate(p.date || p.createdAt),
        description: `Payment ${p.paymentNo || ""}`,
        debit: 0,
        credit: Number(p.amount || 0),
      })),

      /* ---------- PURCHASE RETURNS (CREDIT) ---------- */
      ...returns.map((r) => ({
        id: r._id,
        supplier:
          r.supplier?.name ||
          r.supplierName ||
          r.purchaseBill?.supplier?.name ||
          "-",
        date: formatDate(r.returnDate || r.createdAt),
        description: `Purchase Return ${r.returnNo || ""}`,
        debit: 0,
        credit: Number(r.grandTotal || r.total || 0),
      })),
    ];

    return entries.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [bills, payments, returns]);

  /* ---------------- SUPPLIER LIST ---------------- */
  const suppliers = useMemo(
    () => ["All", ...new Set(ledgerEntries.map((e) => e.supplier))],
    [ledgerEntries]
  );

  /* ---------------- FILTER BY SUPPLIER ---------------- */
  const filteredEntries = useMemo(() => {
    return selectedSupplier === "All"
      ? ledgerEntries
      : ledgerEntries.filter(
          (e) => e.supplier === selectedSupplier
        );
  }, [ledgerEntries, selectedSupplier]);

  /* ---------------- RUNNING BALANCE ---------------- */
  const entriesWithBalance = useMemo(() => {
    let balance = 0;
    return filteredEntries.map((e) => {
      balance += e.debit - e.credit;
      return { ...e, balance };
    });
  }, [filteredEntries]);

  const totalOutstanding =
    entriesWithBalance.length > 0
      ? entriesWithBalance[entriesWithBalance.length - 1].balance
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Supplier Ledger</h2>
          <p className="text-sm text-slate-500">
            Supplier-wise debit / credit history
          </p>
        </div>

        <select
          value={selectedSupplier}
          onChange={(e) =>
            setSelectedSupplier(e.target.value)
          }
          className="border rounded px-3 py-2 text-sm"
        >
          {suppliers.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Supplier</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-right">Debit (₹)</th>
              <th className="p-3 text-right">Credit (₹)</th>
              <th className="p-3 text-right">Balance (₹)</th>
            </tr>
          </thead>
          <tbody>
            {entriesWithBalance.map((e) => (
              <tr key={e.id} className="border-b">
                <td className="p-3">{e.date}</td>
                <td className="p-3">{e.supplier}</td>
                <td className="p-3">{e.description}</td>
                <td className="p-3 text-right text-red-600">
                  {e.debit ? `₹${e.debit.toFixed(2)}` : "-"}
                </td>
                <td className="p-3 text-right text-emerald-600">
                  {e.credit ? `₹${e.credit.toFixed(2)}` : "-"}
                </td>
                <td className="p-3 text-right font-semibold">
                  ₹{e.balance.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-slate-50 rounded-xl p-4 flex justify-between font-semibold">
        <span>Total Outstanding</span>
        <span className="text-red-600">
          ₹{totalOutstanding.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default SupplierLedgerView;
