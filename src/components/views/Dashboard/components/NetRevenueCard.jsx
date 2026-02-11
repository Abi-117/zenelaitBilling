import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { fetchNetRevenue } from '../../../../services/dashboardApi'; // real API

const DEFAULT_REVENUE = {
  total: 0,
  growth: '+0%',
  label: '',
  chart: [],
};

const NetRevenueCard = ({ dataRange }) => {
  const [revenue, setRevenue] = useState(DEFAULT_REVENUE);

  useEffect(() => {
    const getRevenue = async () => {
      try {
        const data = await fetchNetRevenue(dataRange);

        if (data) {
          // Map API data to Recharts format
          const chartData = (data.chart || []).map((item, i) => ({
            month: item.month || item.date || `Day ${i + 1}`, // X-axis label
            value: Number(item.value ?? item.amount ?? 0),   // Y-axis value
          }));

          setRevenue({
            total: Number(data.total) || 0,
            growth: data.growth || '+0%',
            label: data.label || '',
            chart: chartData,
          });
        } else {
          setRevenue(DEFAULT_REVENUE);
        }
      } catch (err) {
        console.error('Revenue fetch failed', err);
        setRevenue(DEFAULT_REVENUE);
      }
    };

    getRevenue();
  }, [dataRange]);

  return (
    <div className="bg-white rounded-xl border p-5">
      {/* Header */}
      <div className="flex justify-between mb-2">
        <h3 className="text-sm font-semibold text-slate-600">Net Revenue</h3>
        <span className="text-xs text-slate-400">{revenue.label}</span>
      </div>

      {/* Total value */}
      <h2 className="text-2xl font-bold mb-1">₹{revenue.total.toLocaleString()}</h2>

      {/* Growth */}
      <span className="inline-block text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full mb-3">
        {revenue.growth}
      </span>

      {/* Chart */}
      {revenue.chart.length > 0 ? (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenue.chart}>
              <XAxis dataKey="month" />
              <YAxis hide />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-48 flex items-center justify-center text-slate-400">
          No chart data
        </div>
      )}
    </div>
  );
};

export default NetRevenueCard;
