import { TrendingUp, TrendingDown } from 'lucide-react';

const MetricCard = ({ title, value, growth }) => {
  const isPositive = growth >= 0;

  return (
    <div className="bg-white rounded-xl border p-5 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>

      <p className="text-2xl font-bold mt-2">
        ₹{value.toLocaleString()}
      </p>

      {growth !== undefined && (
        <div
          className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full
          ${isPositive
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-rose-100 text-rose-700'}`}
        >
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(growth)}% YoY
        </div>
      )}
    </div>
  );
};

export default MetricCard;
