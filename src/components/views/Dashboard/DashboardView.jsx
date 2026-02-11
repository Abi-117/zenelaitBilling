import { useState, useEffect } from 'react';
import MetricCard from './components/MetricCard';
import QuickActions from './components/QuickActions';
import NetRevenueCard from './components/NetRevenueCard';
import ReceivableSummary from './components/ReceivableSummary';
import SummaryCard from './components/SummaryCard'; 
import logo from '../../../assets/logo-hover.png';
import { getDashboardSummary } from '../../../services/dashboardApi';

const ranges = [
  { label: '3 Months', value: '3M' },
  { label: '6 Months', value: '6M' },
  { label: '10 Months', value: '10M' },
  { label: '1 Year', value: 'YTD' },
];

const DEFAULT_DATA = {
  metrics: {
    revenue: { value: 0, growth: 0 },
    mrr: { value: 0, growth: 0 },
    arpu: { value: 0, growth: 0 },
    ltv: { value: 0, growth: 0 },
    subscriptions: { value: 0, growth: 0 },
  },
  revenue: { total: 0, growth: '+0%', label: '', chart: [] },
  receivables: { total: 0, chart: [] },
};

const DashboardView = () => {
  const [range, setRange] = useState('YTD');
  const [data, setData] = useState(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getDashboardSummary(range);
      setData(res);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      setData(DEFAULT_DATA);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [range]);


 const {
  metrics = DEFAULT_DATA.metrics,
  revenue = DEFAULT_DATA.revenue,
  receivables = DEFAULT_DATA.receivables,
} = data || {};



  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <img src={logo} alt="Logo" className="h-10" />
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-slate-500">Business performance overview</p>
        </div>

        <select
          value={range}
          onChange={e => setRange(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          {ranges.map(r => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-5">
        <MetricCard title="Net Revenue" value={metrics.revenue.value} growth={metrics.revenue.growth} />
        <MetricCard title="MRR" value={metrics.mrr.value} growth={metrics.mrr.growth} />
        <MetricCard title="ARPU" value={metrics.arpu.value} growth={metrics.arpu.growth} />
        <MetricCard title="LTV" value={metrics.ltv.value} growth={metrics.ltv.growth} />
      </div>

      {/* RECEIVABLE SUMMARY */}
      <ReceivableSummary dataRange={range} receivableData={receivables} />

      {/* NET REVENUE */}
      <NetRevenueCard dataRange={range} revenueData={revenue} />

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <SummaryCard title="MRR" value={metrics.mrr.value} change={metrics.mrr.growth} />
        <SummaryCard title="Active Subscriptions" value={metrics.subscriptions.value} change={metrics.subscriptions.growth} />
        <SummaryCard title="ARPU" value={metrics.arpu.value} change={metrics.arpu.growth} />
      </div>

      {/* QUICK ACTIONS */}
      <QuickActions
        onInvoice={() => alert('Open Create Invoice')}
        onCustomer={() => alert('Open Add Customer')}
      />

      {loading && <p className="text-center text-sm text-slate-400">Loading dashboard...</p>}
    </div>
  );
};

export default DashboardView;
