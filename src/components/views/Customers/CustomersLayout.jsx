import { useState, useEffect } from "react";
import axios from "axios";
import CustomersList from "./CustomersList";
import CustomerDetails from "./CustomerDetails";
import CustomerForm from "./CustomerForm";

const CustomersLayout = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const token = localStorage.getItem("token");

  /* ---------------- FETCH CUSTOMERS ---------------- */
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/customers", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCustomers(data);
        else setCustomers([]);
      })
      .catch(() => setCustomers([]));
  }, [token]);

  /* ---------------- ADD CUSTOMER ---------------- */
  const handleAddCustomer = async (customerData) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/customers",
        customerData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCustomers((prev) => [res.data, ...prev]);
      setSelectedCustomer(res.data);
    } catch (err) {
      console.error("Add customer failed", err.response?.data);
    }
  };

  /* ---------------- UPDATE ---------------- */
  const handleUpdateCustomer = async (updatedCustomer) => {
    const res = await fetch(
      `http://localhost:5000/api/customers/${updatedCustomer._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedCustomer),
      }
    );

    const saved = await res.json();

    setCustomers((prev) =>
      prev.map((c) => (c._id === saved._id ? saved : c))
    );
    setSelectedCustomer(saved);
  };

  /* ---------------- DELETE ---------------- */
  const handleDeleteCustomer = async (id) => {
    await fetch(`http://localhost:5000/api/customers/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setCustomers((prev) => prev.filter((c) => c._id !== id));
    setSelectedCustomer(null);
  };

  return (
    <div className="flex h-full bg-white">
      <div className="w-[380px] border-r bg-slate-50">
        <CustomersList
          customers={customers}
          onSelect={setSelectedCustomer}
          selectedCustomer={selectedCustomer}
        />
      </div>

      <div className="flex-1 p-6">
        {!selectedCustomer ? (
          <CustomerForm onSave={handleAddCustomer} />
        ) : (
          <CustomerDetails
            customer={selectedCustomer}
            onUpdateCustomer={handleUpdateCustomer}
            onDeleteCustomer={handleDeleteCustomer}
            onClose={() => setSelectedCustomer(null)}
          />
        )}
      </div>
    </div>
  );
};

export default CustomersLayout;
