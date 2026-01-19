import { useState } from 'react';

const INITIAL_TIMESHEETS = [
  {
    id: 1,
    date: '15/01/2026',
    projectId: 1,
    project: 'Website Redesign',
    task: 'Homepage UI',
    hours: 4,
    billable: true,
    rate: 1200,
    amount: 4800,
    source: 'Manual',
  },
  {
    id: 2,
    date: '16/01/2026',
    projectId: 1,
    project: 'Website Redesign',
    task: 'Bug fixes',
    hours: 2,
    billable: false,
    rate: 1200,
    amount: 0,
    source: 'Manual',
  },
];

const TimesheetsView = ({ projects }) => {
  const [timesheets, setTimesheets] = useState(INITIAL_TIMESHEETS);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [task, setTask] = useState('');
  const [hours, setHours] = useState('');
  const [billable, setBillable] = useState(true);

  /* ================= SAVE MANUAL ================= */
  const saveManual = () => {
    if (!selectedProjectId || !hours) {
      alert('Select project & hours');
      return;
    }

    const project = projects.find(
      p => p.id === Number(selectedProjectId)
    );
    if (!project) return;

    const h = Number(hours);

    setTimesheets(prev => [
      ...prev,
      {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        projectId: project.id,
        project: project.name,
        task: task || '-',
        hours: h,
        billable,
        rate: project.rate,
        amount: billable ? project.rate * h : 0,
        source: 'Manual',
      },
    ]);

    setTask('');
    setHours('');
  };

  /* ================= TOTALS ================= */
  const totalHours = timesheets.reduce(
    (a, b) => a + b.hours,
    0
  );

  const totalAmount = timesheets.reduce(
    (a, b) => a + b.amount,
    0
  );

  return (
    <div className="space-y-6">

      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Timesheets</h2>
        <div className="text-sm text-slate-600">
          Total Hours: <b>{totalHours}</b> | Billable: <b>₹{totalAmount}</b>
        </div>
      </div>

      {/* ===== MANUAL ENTRY ===== */}
      <div className="bg-white rounded-xl p-4 border grid grid-cols-6 gap-3 items-end">
        <select
          className="input"
          value={selectedProjectId}
          onChange={e => setSelectedProjectId(e.target.value)}
        >
          <option value="">Select Project</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <input
          className="input"
          placeholder="Task / Description"
          value={task}
          onChange={e => setTask(e.target.value)}
        />

        <input
          type="number"
          step="0.1"
          className="input"
          placeholder="Hours"
          value={hours}
          onChange={e => setHours(e.target.value)}
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={billable}
            onChange={e => setBillable(e.target.checked)}
          />
          Billable
        </label>

        <button
          onClick={saveManual}
          className="bg-blue-600 text-white rounded-lg font-semibold py-2"
        >
          Add Entry
        </button>
      </div>

      {/* ===== TABLE ===== */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th>Project</th>
              <th>Task</th>
              <th>Hours</th>
              <th>Billable</th>
              <th>Rate</th>
              <th>Amount</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {timesheets.map(t => (
              <tr key={t.id} className="border-t">
                <td className="p-3">{t.date}</td>
                <td>{t.project}</td>
                <td>{t.task}</td>
                <td>{t.hours}</td>
                <td
                  className={
                    t.billable
                      ? 'text-emerald-600 font-semibold'
                      : 'text-slate-400'
                  }
                >
                  {t.billable ? 'Yes' : 'No'}
                </td>
                <td>₹{t.rate}</td>
                <td className="font-semibold">₹{t.amount}</td>
                <td className="text-xs">{t.source}</td>
              </tr>
            ))}

            {timesheets.length === 0 && (
              <tr>
                <td
                  colSpan="8"
                  className="p-6 text-center text-slate-400"
                >
                  No timesheets added
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimesheetsView;
