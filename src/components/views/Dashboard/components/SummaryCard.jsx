import { TrendingUp, TrendingDown } from 'lucide-react';

const SummaryCard = ({
  title,
  value = 0,
  suffix = '',
  change = null,       // % change (number)
  period = 'Year To Date',
}) => {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-slate-600">
          {title}
        </h3>
        <span className="text-xs text-slate-400">
          {period}
        </span>
      </div>

      {/* Value and Change */}
      <div className="flex items-end gap-2">
        <p className="text-2xl font-bold">
          {value?.toLocaleString()}{suffix}
        </p>

        {change !== null && !isNaN(change) && (
          <span
            className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full
            ${isPositive
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-rose-100 text-rose-700'}`}
          >
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(change)}%
          </span>
        )}
      </div>

      {/* Footer */}
      {change !== null && !isNaN(change) && (
        <p className="text-xs text-slate-500 mt-2">
          Year on Year
        </p>
      )}
    </div>
  );
};

export default SummaryCard;
