// PaymentLinksView.jsx
import { useState, useMemo } from 'react';
import PaymentLinkDetails from './PaymentLinkDetails';

const INITIAL_LINKS = [
  { id: '89507', date: '29 Dec 2025', customer: 'John Smith', email: 'john@gmail.com', link: 'http://superior-item.org/89507', amount: 891.52, status: 'Paid' },
  { id: '50783', date: '23 Jul 2025', customer: 'Emily Johnson', email: 'emily@gmail.com', link: 'http://superior-item.org/50783', amount: 835.25, status: 'Expired' },
  { id: '11234', date: '05 Jan 2026', customer: 'Peter Parker', email: 'peter@dailybugle.com', link: 'http://superior-item.org/11234', amount: 1200, status: 'Pending' },
  { id: '99881', date: '10 Jan 2026', customer: 'Tony Stark', email: 'tony@starkindustries.com', link: 'http://superior-item.org/99881', amount: 5000, status: 'Paid' },
  { id: '88765', date: '12 Jan 2026', customer: 'Bruce Wayne', email: 'bruce@wayneenterprises.com', link: 'http://superior-item.org/88765', amount: 2500, status: 'Paid' },
  { id: '33445', date: '15 Jan 2026', customer: 'Clark Kent', email: 'clark@dailyplanet.com', link: 'http://superior-item.org/33445', amount: 1800, status: 'Pending' },
  { id: '77890', date: '18 Jan 2026', customer: 'Diana Prince', email: 'diana@themyscira.com', link: 'http://superior-item.org/77890', amount: 2750, status: 'Paid' },
];

const PaymentLinksView = () => {
  const [links] = useState(INITIAL_LINKS);
  const [selected, setSelected] = useState(links[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');

  const filteredLinks = useMemo(() => {
    let result = links.filter(link => {
      const matchesSearch =
        link.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'All' || link.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    if (sortBy === 'date-desc') result.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sortBy === 'date-asc') result.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sortBy === 'amount-desc') result.sort((a, b) => b.amount - a.amount);
    if (sortBy === 'amount-asc') result.sort((a, b) => a.amount - b.amount);

    return result;
  }, [links, searchTerm, filterStatus, sortBy]);

  return (
    <div className="flex border rounded-xl overflow-hidden bg-white h-[650px]">

      {/* LEFT TABLE */}
      <div className="w-2/3 border-r p-4 flex flex-col">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Search by customer or ref"
            className="input flex-1"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <select
            className="input w-40"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Expired">Expired</option>
            <option value="Pending">Pending</option>
          </select>
          <select
            className="input w-48"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="date-desc">Date: Newest</option>
            <option value="date-asc">Date: Oldest</option>
            <option value="amount-desc">Amount: High to Low</option>
            <option value="amount-asc">Amount: Low to High</option>
          </select>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm border-t">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="text-left">Ref</th>
                <th className="text-left">Customer</th>
                <th>Status</th>
                <th className="text-right p-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredLinks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-slate-400">
                    No payment links found
                  </td>
                </tr>
              ) : (
                filteredLinks.map(link => (
                  <tr
                    key={link.id}
                    onClick={() => setSelected(link)}
                    className={`border-t cursor-pointer ${
                      selected?.id === link.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="p-3">{link.date}</td>
                    <td className="text-blue-600">{link.id}</td>
                    <td>{link.customer}</td>
                    <td>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        link.status === 'Paid' ? 'bg-green-100 text-green-700' :
                        link.status === 'Expired' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {link.status}
                      </span>
                    </td>
                    <td className="text-right font-semibold p-3">₹{link.amount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAILS PANEL */}
      <div className="w-1/3 overflow-auto">
        <PaymentLinkDetails data={selected} />
      </div>
    </div>
  );
};

export default PaymentLinksView;
