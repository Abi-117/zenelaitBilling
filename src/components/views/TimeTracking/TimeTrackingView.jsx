import { useEffect, useState } from "react";
import ProjectsView from "./ProjectsView";
import TimesheetsView from "./TimesheetsView";
import BillableHoursView from "./BillableHoursView";

import {
  fetchProjects,
  fetchTimesheets,
} from "../../../services/timeTrackingApi";

const TimeTrackingView = () => {
  const [activeTab, setActiveTab] = useState("projects");

  const [projects, setProjects] = useState([]);
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD DATA ================= */
  const loadData = async () => {
    setLoading(true);
    try {
      const [pRes, tRes] = await Promise.all([
        fetchProjects(),
        fetchTimesheets(),
      ]);

      // normalize backend data
      setProjects(pRes.data.map(p => ({ ...p, id: p._id })));

      setTimesheets(
        tRes.data.map(t => ({
          ...t,
          id: t._id,
          projectId: t.project?._id,
          project: t.project?.name,
        }))
      );
    } catch (err) {
      console.error("Time tracking load failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <p className="text-sm text-slate-500">Loading time tracking...</p>;
  }

  return (
    <div className="space-y-6">

      {/* ===== HEADER ===== */}
      <div>
        <h1 className="text-2xl font-bold">Time Tracking</h1>
        <p className="text-sm text-slate-500">
          Track time, bill clients and monitor productivity
        </p>
      </div>

      {/* ===== TABS ===== */}
      <div className="flex gap-6 border-b">
        {[
          { id: "projects", label: "Projects" },
          { id: "timesheets", label: "Timesheets" },
          { id: "billable", label: "Billable Hours" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-2 text-sm font-semibold border-b-2 ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===== CONTENT ===== */}
      {activeTab === "projects" && (
        <ProjectsView
          projects={projects}
          reload={loadData}
        />
      )}

      {activeTab === "timesheets" && (
        <TimesheetsView
          projects={projects}
          timesheets={timesheets}
          reload={loadData}
        />
      )}

      {activeTab === "billable" && (
        <BillableHoursView
          timesheets={timesheets}
        />
      )}
    </div>
  );
};

export default TimeTrackingView;
