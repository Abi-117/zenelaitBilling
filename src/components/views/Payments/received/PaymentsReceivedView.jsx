import { useState } from 'react';
import PaymentDetailsPanel from './PaymentDetailsPanel';

const payments = [
  {
    id: 'PAY-9001',
    customer: 'Stark Industries',
    invoice: 'INV-5001',
    amount: 3200,
    method: 'UPI',
    date: '12 Jan 2026',
    status: 'Completed'
  }
];

const PaymentsReceivedView = () => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="flex gap-4">
      <div className="w-2/3 bg-white border rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-3">Payment</th>
              <th>Customer</th>
              <th>Invoice</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr
                key={p.id}
                onClick={() => setSelected(p)}
                className="border-t cursor-pointer hover:bg-slate-50"
              >
                <td className="p-3 text-blue-600">{p.id}</td>
                <td>{p.customer}</td>
                <td>{p.invoice}</td>
                <td className="font-semibold">₹{p.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="w-1/3">
        {selected && <PaymentDetailsPanel payment={selected} />}
      </div>
    </div>
  );
};

export default PaymentsReceivedView;
