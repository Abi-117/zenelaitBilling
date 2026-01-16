import { useState } from 'react';
import LiveTimer from './LiveTimer';

const TimesheetsView = ({ projects, timesheets, setTimesheets }) => {
  const [selectedProject, setSelectedProject] = useState('');
  const [task, setTask] = useState('');
  const [hours, setHours] = useState('');

  const saveManual = () => {
    if (!selectedProject || !hours) return;
    const project = projects.find(p => p.id === Number(selectedProject));
    setTimesheets([...timesheets, {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      project: project.name,
      hours: Number(hours),
      billable: true,
      rate: project.rate
    }]);
    setTask('');
    setHours('');
  };

  const handleTimerStop = (sec) => {
    const project = projects.find(p => p.name === selectedProject);
    if (!project) return;
    const h = (sec / 3600).toFixed(2);
    setTimesheets([...timesheets, {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      project: project.name,
      hours: Number(h),
      billable: true,
      rate: project.rate
    }]);
  };

  return (
    <div className="space-y-6">

      {/* Timer */}
      {selectedProject && (
        <LiveTimer project={selectedProject} onStop={handleTimerStop} />
      )}

      {/* Manual Entry */}
      <div className="grid grid-cols-4 gap-3">
        <select
          className="input"
          value={selectedProject}
          onChange={e => setSelectedProject(e.target.value)}
        >
          <option value="">Select Project</option>
          {projects.map(p => (
            <option key={p.id} value={p.name}>{p.name}</option>
          ))}
        </select>

        <input
          placeholder="Task"
          className="input"
          value={task}
          onChange={e => setTask(e.target.value)}
        />

        <input
          type="number"
          placeholder="Hours"
          className="input"
          value={hours}
          onChange={e => setHours(e.target.value)}
        />

        <button
          onClick={saveManual}
          className="bg-blue-600 text-white rounded-lg font-semibold"
        >
          Save
        </button>
      </div>

      {/* Timesheets Table */}
      <table className="w-full text-sm">
        <thead className="text-left text-slate-500 border-b">
          <tr>
            <th>Date</th>
            <th>Project</th>
            <th>Task</th>
            <th>Hours</th>
            <th>Billable</th>
          </tr>
        </thead>
        <tbody>
          {timesheets.map(t => (
            <tr key={t.id} className="border-b">
              <td className="py-3">{t.date}</td>
              <td>{t.project}</td>
              <td>{t.task || '-'}</td>
              <td>{t.hours}</td>
              <td className="text-emerald-600 font-semibold">{t.billable ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimesheetsView;
