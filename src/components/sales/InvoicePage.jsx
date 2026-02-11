import { useState, useEffect } from "react";
import axios from "axios";
import InvoiceEditorView from "./InvoiceEditorView";

const InvoicePage = () => {
  const [customers, setCustomers] = useState([]);
  const [invoice, setInvoice] = useState({
    invoiceNo: "",
    date: "",
    gstRate: 0,
    status: "Draft",
    items: [],
    customerId: "",
    customerName: "",
    customerEmail: "",
    customerAddress: "",
    gstin: "",
    outstanding: 0,
  });

  const token = localStorage.getItem("token");

  // ---------------- FETCH CUSTOMERS ----------------
  useEffect(() => {
    if (!token) return;

    axios
      .get("http://localhost:5173/customers", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCustomers(res.data || []))
      .catch((err) => {
        console.error("Failed to fetch customers:", err);
        setCustomers([]);
      });
  }, [token]);

  // ---------------- SAVE INVOICE ----------------
  const handleSaveInvoice = (updatedInvoice) => {
    console.log("Saving invoice:", updatedInvoice);
    // Here you can call your backend API to save
    // axios.post("/api/invoices", updatedInvoice)
  };

  return (
    <div className="p-6">
      <InvoiceEditorView
  invoice={creatingInvoice}
  customers={customers}
  onChange={setCreatingInvoice}
  onBack={() => setCreatingInvoice(null)}
  onSave={async (invoice) => {
    try {
      const res = await fetch("http://localhost:5000/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // if auth used
        },
        body: JSON.stringify(invoice),
      });

      if (!res.ok) throw new Error("Invoice save failed");

      const savedInvoice = await res.json();
      alert("Invoice created successfully");
      setCreatingInvoice(null);
    } catch (err) {
      console.error(err);
      alert("Invoice not saved");
    }
  }}
/>

    </div>
  );
};

export default InvoicePage;
