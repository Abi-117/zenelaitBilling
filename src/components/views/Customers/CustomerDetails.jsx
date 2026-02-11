import { useEffect, useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import Modal from "../../ui/Modal";
import OverviewTab from "./OverviewTab";
import TransactionsTab from "./TransactionsTab";
import StatementTab from "./StatementTab";
import MailsTab from "./MailsTab";

const tabs = ["Overview", "Transactions", "Statement", "Mails"];

const CustomerDetails = ({
  customer,
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [addOpen, setAddOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(customer);
  const token = localStorage.getItem("token");

  useEffect(() => {
    setCurrentCustomer(customer);
  }, [customer]);

  /* ---------------- NO CUSTOMER SELECTED ---------------- */
  if (!currentCustomer) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Add New Customer</h2>

          <button
            onClick={() => setAddOpen(true)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold"
          >
            + Create Customer
          </button>

          <Modal
            isOpen={addOpen}
            onClose={() => setAddOpen(false)}
            title="New Customer"
          >
            <AddCustomerForm
              onSave={async (data) => {
                try {
                  const res = await fetch(
                    "http://localhost:5000/api/customers",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify(data),
                    }
                  );

                  const newCustomer = await res.json();
                  onAddCustomer(newCustomer);
                  setAddOpen(false);
                } catch (err) {
                  console.error("Failed to add customer", err);
                }
              }}
            />
          </Modal>
        </div>
      </div>
    );
  }

  /* ---------------- CUSTOMER DETAILS ---------------- */
  return (
    <div className="h-full flex flex-col bg-white">

      {/* HEADER */}
      <div className="p-6 border-b flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={onClose}>
            <ArrowLeft size={18} />
          </button>

          <div>
            <h2 className="text-xl font-bold">{currentCustomer.name}</h2>
            <p className="text-xs text-slate-500">{currentCustomer.email}</p>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <button
            onClick={async () => {
              if (
                window.confirm(
                  `Are you sure you want to delete ${currentCustomer.name}?`
                )
              ) {
                try {
                  await fetch(
                    `http://localhost:5000/api/customers/${currentCustomer._id}`,
                    {
                      method: "DELETE",
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );
                  onDeleteCustomer(currentCustomer._id);
                  onClose();
                } catch (err) {
                  console.error("Failed to delete customer", err);
                }
              }
            }}
            className="text-red-600 text-sm font-semibold hover:bg-red-50 px-3 py-2 rounded"
          >
            Delete
          </button>

          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="px-6 flex gap-6 border-b text-sm">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 ${
              activeTab === tab
                ? "border-b-2 border-blue-600 font-bold"
                : "text-slate-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="p-6 flex-1 overflow-y-auto bg-slate-50">
        {activeTab === "Overview" && (
          <OverviewTab
            customer={currentCustomer}
            onUpdate={async (updatedData) => {
              try {
                const res = await fetch(
                  `http://localhost:5000/api/customers/${currentCustomer._id}`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(updatedData),
                  }
                );
                const updatedCustomer = await res.json();
                setCurrentCustomer(updatedCustomer);
                onUpdateCustomer(updatedCustomer);
              } catch (err) {
                console.error("Failed to update customer", err);
              }
            }}
          />
        )}

        {activeTab === "Transactions" && (
          <TransactionsTab customer={currentCustomer} />
        )}

        {activeTab === "Statement" && (
          <StatementTab customer={currentCustomer} />
        )}

        {activeTab === "Mails" && <MailsTab />}
      </div>
    </div>
  );
};

export default CustomerDetails;

/* ---------------- ADD CUSTOMER FORM ---------------- */
const AddCustomerForm = ({ onSave }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gstin: "",
    billingAddress: "",
    creditLimit: 0,
    outstanding: 0,
    paymentTerms: "Net 30",
    salesHistory: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-3 text-sm">
      {["name", "email", "phone", "gstin", "billingAddress"].map((field) => (
        <input
          key={field}
          name={field}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          className="w-full border p-2 rounded"
          value={form[field]}
          onChange={handleChange}
          required={field === "name" || field === "email"}
        />
      ))}

      <input
        type="number"
        name="creditLimit"
        placeholder="Credit Limit"
        className="w-full border p-2 rounded"
        value={form.creditLimit}
        onChange={handleChange}
      />

      <button
        onClick={() => onSave(form)}
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold"
      >
        Save Customer
      </button>
    </div>
  );
};
