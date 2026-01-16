import { useState } from 'react';
import ProjectsView from './ProjectsView';
import TimesheetsView from './TimesheetsView';
import BillableHoursView from './BillableHoursView';

const TimeTrackingView = () => {
  const [activeTab, setActiveTab] = useState('projects');

  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Website Redesign',
      client: 'Acme Corp',
      status: 'Active',
      rate: 1500
    },
    {
      id: 2,
      name: 'Mobile App',
      client: 'Globex',
      status: 'On Hold',
      rate: 1200
    }
  ]);

  const [timesheets, setTimesheets] = useState([]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Time Tracking</h1>
        <p className="text-sm text-slate-500">
          Track time, bill clients and monitor productivity
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b">
        {[
          { id: 'projects', label: 'Projects' },
          { id: 'timesheets', label: 'Timesheets' },
          { id: 'billable', label: 'Billable Hours' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-2 text-sm font-semibold border-b-2 ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'projects' && (
        <ProjectsView projects={projects} setProjects={setProjects} />
      )}

      {activeTab === 'timesheets' && (
        <TimesheetsView
          projects={projects}
          timesheets={timesheets}
          setTimesheets={setTimesheets}
        />
      )}

      {activeTab === 'billable' && (
        <BillableHoursView
          projects={projects}
          timesheets={timesheets}
        />
      )}
    </div>
  );
};

export default TimeTrackingView;
