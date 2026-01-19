import { useState, useMemo } from 'react';

const INITIAL_ENTRIES = [
  { id: 1, date: '12 Jan 2026', desc: 'UPI – Stark', amount: 3200, matched: true },
  { id: 2, date: '13 Jan 2026', desc: 'Unknown Credit', amount: 1500, matched: false },
  { id: 3, date: '14 Jan 2026', desc: 'Bank Transfer – Wayne', amount: 2500, matched: true },
  { id: 4, date: '15 Jan 2026', desc: 'Cash Deposit', amount: 1800, matched: false },
  { id: 5, date: '16 Jan 2026', desc: 'Cheque – Parker', amount: 1200, matched: false },
];

const BankReconciliationView = () => {
  const [entries, setEntries] = useState(INITIAL_ENTRIES);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');

  // Handle marking a single entry as matched
  const handleMatch = id => {
    setEntries(prev =>
      prev.map(e => (e.id === id ? { ...e, matched: true } : e))
    );
  };

  // Handle marking all unmatched as matched
  const handleMatchAll = () => {
    setEntries(prev => prev.map(e => ({ ...e, matched: true })));
  };

  // Filter and sort
  const filteredEntries = useMemo(() => {
    let result = entries.filter(e => {
      const matchesSearch =
        e.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.date.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === 'All' ||
        (filterStatus === 'Matched' && e.matched) ||
        (filterStatus === 'Unmatched' && !e.matched);
      return matchesSearch && matchesStatus;
    });

    if (sortBy === 'date-desc')
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sortBy === 'date-asc')
      result.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sortBy === 'amount-desc') result.sort((a, b) => b.amount - a.amount);
    if (sortBy === 'amount-asc') result.sort((a, b) => a.amount - b.amount);

    return result;
  }, [entries, searchTerm, filterStatus, sortBy]);

  return (
    <div className="bg-white border rounded-xl p-4 flex flex-col h-[600px]">
      {/* Controls */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by description or date"
          className="input flex-1"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select
          className="input w-40"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Matched">Matched</option>
          <option value="Unmatched">Unmatched</option>
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
        <button
          onClick={handleMatchAll}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Match All
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm border-t">
          <thead className="bg-slate-50 sticky top-0 z-10">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="text-left">Description</th>
              <th className="text-right">Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-slate-400">
                  No entries found
                </td>
              </tr>
            ) : (
              filteredEntries.map(e => (
                <tr
                  key={e.id}
                  className={`border-t ${
                    e.matched ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  <td className="p-3">{e.date}</td>
                  <td>{e.desc}</td>
                  <td className="text-right font-semibold">₹{e.amount}</td>
                  <td>
                    {e.matched ? (
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                        Matched
                      </span>
                    ) : (
                      <button
                        onClick={() => handleMatch(e.id)}
                        className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200"
                      >
                        Match
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BankReconciliationView;
