import { useState } from 'react';
import CustomersList from './CustomersList';
import CustomerDetails from './CustomerDetails';
import { INITIAL_CUSTOMERS } from '../../../data/customers.data';

const CustomersLayout = () => {
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleAddCustomer = (customer) => {
    setCustomers(prev => [...prev, customer]);
    setSelectedCustomer(customer);
  };

  return (
    <div className="flex h-full bg-white">

      {/* LEFT */}
      <div className="w-[380px] border-r bg-slate-50">
        <CustomersList
          customers={customers}
          onSelect={setSelectedCustomer}
        />
      </div>

      {/* RIGHT */}
      <div className="flex-1">
        <CustomerDetails
          customer={selectedCustomer}
          onAddCustomer={handleAddCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      </div>
    </div>
  );
};

export default CustomersLayout;
