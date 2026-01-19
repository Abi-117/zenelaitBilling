import { useMemo, useState } from 'react';

/* ================= SAMPLE DATA ================= */
const SAMPLE_TIMESHEETS = [
  {
    id: 1,
    date: new Date(), // Today
    project: 'Website Redesign',
    hours: 4,
    billable: true,
    rate: 1200,
    amount: 4800,
  },
  {
    id: 2,
    date: new Date(), // Today
    project: 'Mobile App',
    hours: 3.5,
    billable: true,
    rate: 1500,
    amount: 5250,
  },
  {
    id: 3,
    date: new Date('2026-01-01'),
    project: 'Website Redesign',
    hours: 2,
    billable: true,
    rate: 1200,
    amount: 2400,
  },
  {
    id: 4,
    date: new Date('2026-02-01'),
    project: 'Internal Meeting',
    hours: 1.5,
    billable: false,
    rate: 0,
    amount: 0,
  },
];

const BillableHoursView = ({ timesheets = SAMPLE_TIMESHEETS }) => {
  const [filter, setFilter] = useState('billable'); // default: show only billable

  /* ================= FILTER ================= */
  const filtered = useMemo(() => {
    const now = new Date();

    return timesheets.filter(t => {
      if (!t.billable) return false; // remove non-billable by default

      if (filter === 'today') {
        return (
          t.date.getDate() === now.getDate() &&
          t.date.getMonth() === now.getMonth() &&
          t.date.getFullYear() === now.getFullYear()
        );
      }

      if (filter === 'month') {
        return (
          t.date.getMonth() === now.getMonth() &&
          t.date.getFullYear() === now.getFullYear()
        );
      }

      return true; // billable all time
    });
  }, [timesheets, filter]);

  /* ================= TOTALS ================= */
  const totalHours = filtered.reduce((sum, t) => sum + Number(t.hours || 0), 0);

  const totalAmount = filtered.reduce(
    (sum, t) =>
      sum +
      (t.amount !== undefined && t.amount !== null
        ? Number(t.amount)
        : Number(t.hours || 0) * Number(t.rate || 0)),
    0
  );

  /* ================= PROJECT SUMMARY ================= */
  const projectWise = useMemo(() => {
    const map = {};
    filtered.forEach(t => {
      if (!map[t.project]) map[t.project] = { hours: 0, amount: 0 };
      map[t.project].hours += Number(t.hours || 0);
      map[t.project].amount +=
        t.amount !== undefined && t.amount !== null
          ? Number(t.amount)
          : Number(t.hours || 0) * Number(t.rate || 0);
    });
    return map;
  }, [filtered]);

  return (
    <div className="space-y-6">
      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Billable Hours</h2>
        <select
          className="input w-40"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="billable">All Billable</option>
          <option value="today">Today</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {/* ===== STATS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Stat label="Billable Hours" value={`${totalHours.toFixed(2)} hrs`} />
        <Stat label="Entries" value={filtered.length} />
        <Stat label="Billable Amount" value={`₹${totalAmount.toFixed(2)}`} />
      </div>

      {/* ===== PROJECT BREAKUP ===== */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="font-semibold mb-4">Project-wise Summary</h3>
        {Object.keys(projectWise).length === 0 ? (
          <p className="text-slate-500 text-sm">No billable entries found</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-slate-500 border-b">
              <tr>
                <th className="text-left py-2">Project</th>
                <th>Hours</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(projectWise).map(([project, v]) => (
                <tr key={project} className="border-b">
                  <td className="py-2">{project}</td>
                  <td className="text-center">{v.hours.toFixed(2)}</td>
                  <td className="text-center font-semibold">₹{v.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

/* ================= STAT CARD ================= */
const Stat = ({ label, value }) => (
  <div className="bg-white rounded-xl shadow p-6 text-center">
    <p className="text-sm text-slate-500">{label}</p>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </div>
);

export default BillableHoursView;
