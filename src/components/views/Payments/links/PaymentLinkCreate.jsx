import { useEffect, useState } from "react";
import API from "../../../../config/api";

const PaymentLinkCreate = ({ onCreated }) => {
  const [customers, setCustomers] = useState([]);
  const [invoices, setInvoices] = useState([]);

  const [customer, setCustomer] = useState("");
  const [invoice, setInvoice] = useState("");
  const [amount, setAmount] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  /* ================= FETCH CUSTOMERS ================= */
  useEffect(() => {
    API.get("/customers")
      .then((res) => {
        if (res.data && Array.isArray(res.data.data)) {
          setCustomers(res.data.data);
        } else if (Array.isArray(res.data)) {
          setCustomers(res.data);
        } else {
          setCustomers([]);
        }
      })
      .catch((err) => {
        console.error("Customer fetch error", err);
        setCustomers([]);
      });
  }, []);

  /* ================= FETCH INVOICES BY CUSTOMER ================= */
  useEffect(() => {
    if (!customer) return;

    API.get("/invoices", {
      params: { customerId: customer }
    })
      .then((res) => {
        if (res.data && Array.isArray(res.data.data)) {
          setInvoices(res.data.data);
        } else if (Array.isArray(res.data)) {
          setInvoices(res.data);
        } else {
          setInvoices([]);
        }
      })
      .catch((err) => {
        console.error("Invoice fetch error", err);
        setInvoices([]);
      });
  }, [customer]);

  /* ================= CREATE PAYMENT LINK ================= */
  const createLink = () => {
    if (!customer || !invoice || !amount) {
      alert("Fill all fields");
      return;
    }

    API.post("/payment-links", {
      customerId: customer,
      invoiceId: invoice,
      amount,
      expiresAt
    })
      .then((res) => {
        if (onCreated) onCreated(res.data);
      })
      .catch((err) => {
        console.error("Create payment link error", err);
        alert("Failed to create payment link");
      });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">New Payment Link</h2>

      {/* CUSTOMER */}
      <select
        className="input"
        value={customer}
        onChange={(e) => {
          setCustomer(e.target.value);
          setInvoice("");
          setInvoices([]);
        }}
      >
        <option value="">Select Customer</option>
        {customers.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* INVOICE */}
      <select
        className="input"
        value={invoice}
        disabled={!customer}
        onChange={(e) => {
          setInvoice(e.target.value);
          const inv = invoices.find(i => i._id === e.target.value);
          setAmount(inv ? inv.total : "");
        }}
      >
        <option value="">Select Invoice</option>
        {invoices.map((i) => (
          <option key={i._id} value={i._id}>
            {i.invoiceNo}
          </option>
        ))}
      </select>

      {/* AMOUNT */}
      <input
        className="input"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />

      {/* EXPIRY */}
      <input
        type="date"
        className="input"
        value={expiresAt}
        onChange={(e) => setExpiresAt(e.target.value)}
      />

      <button
        onClick={createLink}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Generate Link
      </button>
    </div>
  );
};

export default PaymentLinkCreate;
