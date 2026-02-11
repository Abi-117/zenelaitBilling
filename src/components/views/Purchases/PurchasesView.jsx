import { useState, useEffect } from "react";

import PurchaseBillsView from "./PurchaseBillsView";
import GRNView from "./GRNView";
import PurchaseReturnsView from "./PurchaseReturnsView";
import SupplierLedgerView from "./SupplierLedgerView";
import SupplierOutstandingView from "./SupplierOutstandingView";
import SuppliersView from "./SuppliersView.jsx";

import {
  fetchGRNs,
  fetchPurchaseBills,
  fetchPurchaseReturns,
} from "../../../services/apii.js";

const PurchasesView = () => {
  const [activeTab, setActiveTab] = useState("grn");

  const [suppliers, setSuppliers] = useState([]);
  const [grns, setGrns] = useState([]);
  const [purchaseBills, setPurchaseBills] = useState([]);
  const [purchaseReturns, setPurchaseReturns] = useState([]);

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    fetchGRNs().then(setGrns);
    fetchPurchaseBills().then(setPurchaseBills);
    fetchPurchaseReturns().then(setPurchaseReturns);
  }, []);

  const tabs = [
    { id: "suppliers", label: "Suppliers" },
   {
  id: "purchase-bills",
  label: "Purchase Bills"
}
,
    { id: "grn", label: "GRN" },
    { id: "returns", label: "Purchase Returns" },
    { id: "ledger", label: "Supplier Ledger" },
    { id: "outstanding", label: "Outstanding" },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Purchases</h1>
        <p className="text-sm text-slate-500">
          Manage suppliers, GRNs, purchase bills and payables
        </p>
      </div>

      {/* TABS */}
      <div className="flex gap-6 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-2 text-sm font-semibold border-b-2 transition
              ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div>
        {activeTab === "suppliers" && (
          <SuppliersView
            suppliers={suppliers}
            setSuppliers={setSuppliers}
          />
        )}

        {activeTab === "purchase-bills" && (
          <PurchaseBillsView
            purchaseBills={purchaseBills}
            setBills={setPurchaseBills}
          />
        )}

        {activeTab === "grn" && (
          <GRNView
            grns={grns}
            setGrns={setGrns}
            setActiveTab={setActiveTab} // optional (useful after create bill)
          />
        )}

        {activeTab === "returns" && (
          <PurchaseReturnsView
            returns={purchaseReturns}
            setReturns={setPurchaseReturns}
          />
        )}

        {activeTab === "ledger" && (
          <SupplierLedgerView bills={purchaseBills} />
        )}

        {activeTab === "outstanding" && (
          <SupplierOutstandingView bills={purchaseBills} />
        )}
      </div>
    </div>
  );
};

export default PurchasesView;
