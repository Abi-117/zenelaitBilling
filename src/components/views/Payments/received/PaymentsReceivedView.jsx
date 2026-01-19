// PaymentsReceivedView.jsx
import { useState } from 'react';
import PaymentDetailsPanel from './PaymentDetailsPanel';

const INITIAL_PAYMENTS = [
  { id: 'PAY-9001', customer: 'Stark Industries', invoice: 'INV-5001', amount: 3200, method: 'UPI', date: '12 Jan 2026', status: 'Completed' },
  { id: 'PAY-9002', customer: 'Wayne Enterprises', invoice: 'INV-5002', amount: 12500, method: 'Credit Card', date: '13 Jan 2026', status: 'Pending' },
  { id: 'PAY-9003', customer: 'Oscorp', invoice: 'INV-5003', amount: 7800, method: 'Net Banking', date: '14 Jan 2026', status: 'Completed' },
  { id: 'PAY-9004', customer: 'LexCorp', invoice: 'INV-5004', amount: 5400, method: 'UPI', date: '15 Jan 2026', status: 'Failed' },
  { id: 'PAY-9005', customer: 'Daily Planet', invoice: 'INV-5005', amount: 9800, method: 'Cash', date: '16 Jan 2026', status: 'Completed' },
];

const PaymentsReceivedView = () => {
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPayments = payments.filter(p => {
    const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
    const matchesSearch =
      p.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.invoice.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleRefund = (id) => {
    const updated = payments.map(p =>
      p.id === id ? { ...p, status: 'Refunded' } : p
    );
    setPayments(updated);
    if (selected?.id === id) setSelected({ ...selected, status: 'Refunded' });
    alert('Payment refunded successfully!');
  };

  return (
    <div className="flex gap-4">
      <div className="w-2/3 bg-white border rounded-xl p-4 space-y-4">
        <div className="flex justify-between items-center gap-4 mb-2">
          <input
            type="text"
            placeholder="Search by customer or invoice"
            className="input w-1/2"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <select
            className="input w-1/4"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>

        <table className="w-full text-sm border-t">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-3 text-left">Payment</th>
              <th className="text-left">Customer</th>
              <th className="text-left">Invoice</th>
              <th className="text-right">Amount</th>
              <th className="text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-slate-400">
                  No payments found.
                </td>
              </tr>
            ) : (
              filteredPayments.map(p => (
                <tr
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className="border-t cursor-pointer hover:bg-slate-50"
                >
                  <td className="p-3 text-blue-600 font-medium">{p.id}</td>
                  <td>{p.customer}</td>
                  <td>{p.invoice}</td>
                  <td className="text-right font-semibold">₹{p.amount}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        p.status === 'Completed'
                          ? 'bg-green-100 text-green-700'
                          : p.status === 'Pending'
                          ? 'bg-amber-100 text-amber-700'
                          : p.status === 'Failed'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="w-1/3">
        {selected ? (
          <PaymentDetailsPanel payment={selected} onRefund={handleRefund} />
        ) : (
          <div className="bg-white border rounded-xl p-5 text-center text-slate-400">
            Select a payment to view details
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsReceivedView;
