import { useState, useEffect } from "react";
import InvoiceEditorView from "./InvoiceEditorView";
import InvoicePreviewPanel from "./InvoicePreviewPanel";
import { saveInvoice } from "../services/invoiceApi";
import { API_CUSTOMERS } from "../../services/invoiceApi"; // ✅ use constant for API

const InvoicesLayout = () => {
  const [mode, setMode] = useState("edit");
  const [customers, setCustomers] = useState([]);
  const [invoice, setInvoice] = useState({
    invoiceNo: "INV-1001",
    customerId: "",
    customerName: "",
    customerEmail: "",
    gstin: "",
    customerAddress: "",
    date: new Date().toISOString().split("T")[0],
    items: [],
    gstRate: 18,
    subtotal: 0,
    tax: 0,
    total: 0,
    status: "Draft",
  });

  const token = localStorage.getItem("token");

  // ---------------- FETCH CUSTOMERS ----------------
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch(API_CUSTOMERS, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        console.log("Fetched customers:", data); // 🔥 debug

        // Safe handling if API returns { data: [...] } or [...]
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
          ? data.data
          : [];

        setCustomers(list);
      } catch (err) {
        console.error("Error fetching customers:", err);
        setCustomers([]);
      }
    };

    fetchCustomers();
  }, [token]);

  // ---------------- CALCULATE TOTALS ----------------
  const calculateTotals = (inv) => {
    const subtotal = inv.items.reduce((sum, i) => sum + Number(i.qty) * Number(i.rate), 0);
    const tax = (subtotal * Number(inv.gstRate || 0)) / 100;
    return { subtotal, tax, total: subtotal + tax };
  };

  const handleChange = (updated) => {
    const totals = calculateTotals(updated);
    setInvoice({ ...updated, ...totals });
  };

  const handleSave = async () => {
    try {
      await saveInvoice(invoice, token);
      alert("Invoice Saved Successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to save invoice");
    }
  };

  // ---------------- RENDER ----------------
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex gap-3 p-4 border-b bg-white">
        {/* Buttons can go here */}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {mode === "edit" ? (
          <InvoiceEditorView
            invoice={invoice}
            onChange={handleChange}
            customers={customers} // ✅ pass customers
            onSave={handleSave}   // optional: if your editor handles save
          />
        ) : (
          <InvoicePreviewPanel invoice={invoice} />
        )}
      </div>
    </div>
  );
};

export default InvoicesLayout;
