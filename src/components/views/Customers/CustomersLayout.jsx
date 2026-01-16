// CustomersLayout.jsx
import { useState } from 'react';
import CustomersList from './CustomersList';
import CustomerDetails from './CustomerDetails';
import { INITIAL_CUSTOMERS as DATA } from '../../../data/customers.data';

const CustomersLayout = () => {
  const [customers, setCustomers] = useState(DATA); // all customers
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Add new customer
  const handleAddCustomer = (customer) => {
    setCustomers(prev => [...prev, customer]);
    setSelectedCustomer(customer); // select new customer immediately
  };

  return (
    <div className="flex h-full bg-white">
      {/* LEFT: Customer List */}
      <div className="w-[380px] border-r bg-slate-50">
        <CustomersList
          customers={customers}
          onSelect={setSelectedCustomer}
        />
      </div>
      {/* RIGHT: Details */}
      <div className="flex-1">
        <CustomerDetails
          customer={selectedCustomer}
          onAddCustomer={handleAddCustomer}
        />
      </div>
    </div>
  );
};

export default CustomersLayout;
