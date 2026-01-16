import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Current', amount: 0 },
  { name: '1-15', amount: 0 },
  { name: '16-30', amount: 0 },
  { name: '31-45', amount: 0 },
  { name: '>45', amount: 372580 },
];

const ReceivableSummary = () => {
  return (
    <div className="bg-white rounded-xl border p-5">
      <h3 className="text-sm font-semibold text-slate-600 mb-1">
        Receivable Summary
      </h3>

      <h2 className="text-xl font-bold mb-3">
        Rs.372,580.05
      </h2>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis hide />
            <Tooltip />
            <Bar dataKey="amount" fill="#c2410c" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReceivableSummary;
