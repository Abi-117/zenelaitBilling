import { useState } from 'react';
import PaymentLinkDetails from './PaymentLinkDetails';

const links = [
  {
    id: '89507',
    date: '29 Dec 2025',
    customer: 'John Smith',
    email: 'john@gmail.com',
    link: 'http://superior-item.org',
    amount: 891.52,
    status: 'Paid'
  },
  {
    id: '50783',
    date: '23 Jul 2025',
    customer: 'Emily Johnson',
    amount: 835.25,
    status: 'Expired'
  }
];

const PaymentLinksView = () => {
  const [selected, setSelected] = useState(links[0]);

  return (
    <div className="flex border rounded-xl overflow-hidden bg-white">

      {/* TABLE */}
      <div className="w-2/3 border-r">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-3">Date</th>
              <th>Ref</th>
              <th>Customer</th>
              <th>Status</th>
              <th className="text-right p-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            {links.map(l => (
              <tr
                key={l.id}
                onClick={() => setSelected(l)}
                className={`border-t cursor-pointer ${
                  selected?.id === l.id && 'bg-blue-50'
                }`}
              >
                <td className="p-3">{l.date}</td>
                <td className="text-blue-600">{l.id}</td>
                <td>{l.customer}</td>
                <td>
                  <span className="text-xs px-2 py-1 rounded bg-emerald-100 text-emerald-700">
                    {l.status}
                  </span>
                </td>
                <td className="text-right font-semibold p-3">
                  ₹{l.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DETAILS */}
      <div className="w-1/3">
        <PaymentLinkDetails data={selected} />
      </div>
    </div>
  );
};

export default PaymentLinksView;
