import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { month: 'Jan', value: 200000 },
  { month: 'Feb', value: 250000 },
  { month: 'Mar', value: 180000 },
  { month: 'Apr', value: 400000 },
  { month: 'May', value: 1200000 },
  { month: 'Jun', value: 300000 },
];

const NetRevenueCard = () => {
  return (
    <div className="bg-white rounded-xl border p-5">
      {/* Header */}
      <div className="flex justify-between mb-2">
        <h3 className="text-sm font-semibold text-slate-600">
          Net Revenue
        </h3>
        <span className="text-xs text-slate-400">Year To Date</span>
      </div>

      {/* Value */}
      <h2 className="text-2xl font-bold mb-1">
        Rs.17,628,857.60
      </h2>

      <span className="inline-block text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full mb-3">
        ▲ 486.9% YoY
      </span>

      {/* Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
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
    </div>
  );
};

export default NetRevenueCard;
