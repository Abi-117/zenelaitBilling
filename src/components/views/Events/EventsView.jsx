import { useState, useEffect } from 'react';
import BillingEventsView from './BillingEventsView';
import ReminderAlertsView from './ReminderAlertsView';

const EventsView = ({ defaultTab = 'billing' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Events</h1>
        <p className="text-sm text-slate-500">
          Monitor billing activities, reminders and automated alerts
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b">
        {[
          { id: 'billing', label: 'Billing Events' },
          { id: 'alerts', label: 'Reminders & Alerts' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-2 text-sm font-semibold border-b-2 transition ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'billing' && <BillingEventsView />}
      {activeTab === 'alerts' && <ReminderAlertsView />}
    </div>
  );
};

export default EventsView;
