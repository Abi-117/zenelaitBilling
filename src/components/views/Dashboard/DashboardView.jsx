import { useState } from 'react';
import MetricCard from './components/MetricCard';
import QuickActions from './components/QuickActions';
import NetRevenueCard from './components/NetRevenueCard';
import ReceivableSummary from './components/ReceivableSummary';
import SummaryCard from './components/SummaryCard';
import { dashboardMetrics } from '../../../data/dashboard.data';

const DashboardView = () => {
  const [range, setRange] = useState('YTD');

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-slate-500">Business performance overview</p>
        </div>

        <select
          value={range}
          onChange={e => setRange(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option>YTD</option>
          <option>This Month</option>
          <option>Last Month</option>
        </select>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-5">
        <MetricCard
          title="Net Revenue"
          value={dashboardMetrics.revenue.value}
          growth={dashboardMetrics.revenue.growth}
        />
        <MetricCard
          title="MRR"
          value={dashboardMetrics.mrr.value}
          growth={dashboardMetrics.mrr.growth}
        />
        <MetricCard
          title="ARPU"
          value={dashboardMetrics.arpu.value}
          growth={dashboardMetrics.arpu.growth}
        />
        <MetricCard
          title="LTV"
          value={dashboardMetrics.ltv.value}
          growth={dashboardMetrics.ltv.growth}
        />
      </div>

      {/* RECEIVABLE SUMMARY */}
      <ReceivableSummary />

      {/* NET REVENUE CARD */}
      <NetRevenueCard />

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <SummaryCard
          title="MRR"
          value="Rs.454,102.86"
          change={29.3}
        />
        <SummaryCard
          title="Active Subscriptions"
          value="1522"
          change={0}
        />
        <SummaryCard
          title="ARPU"
          value="Rs.298.36"
          change={-18.7}
        />
      </div>

      {/* QUICK ACTIONS */}
      <QuickActions
        onInvoice={() => alert('Open Create Invoice')}
        onCustomer={() => alert('Open Add Customer')}
        onSubscription={() => alert('Open New Subscription')}
      />

    </div>
  );
};

export default DashboardView;
