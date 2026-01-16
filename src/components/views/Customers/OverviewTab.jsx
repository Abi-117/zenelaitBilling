import React from 'react';

const OverviewTab = ({ customer }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div>
          <h3 className="font-bold text-lg">Customer Info</h3>
          <p>Email: {customer.email}</p>
          <p>Phone: {customer.phone}</p>
          <p>GST: {customer.gstNumber}</p>
        </div>
        <div>
          <h3 className="font-bold text-lg">Financials</h3>
          <p>Credit Limit: ₹{customer.creditLimit}</p>
          <p>Outstanding Balance: ₹{customer.outstandingBalance}</p>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-lg">Sales History</h3>
        <table className="w-full text-left border">
          <thead>
            <tr>
              <th>Date</th>
              <th>Invoice</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {customer.salesHistory.map((s, idx) => (
              <tr key={idx} className="border-t">
                <td>{s.date}</td>
                <td>{s.invoiceNo}</td>
                <td>₹{s.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OverviewTab;
