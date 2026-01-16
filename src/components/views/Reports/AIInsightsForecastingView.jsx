import { Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';

const AIInsightsForecastingView = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-xl shadow p-6">
        <TrendingUp className="text-emerald-600" />
        <h3 className="font-bold mt-2">Revenue Forecast</h3>
        <p className="text-sm text-slate-500 mt-1">
          Expected +18% growth next quarter
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <AlertTriangle className="text-amber-500" />
        <h3 className="font-bold mt-2">Payment Risk</h3>
        <p className="text-sm text-slate-500 mt-1">
          3 customers likely to delay payments
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <Sparkles className="text-violet-600" />
        <h3 className="font-bold mt-2">AI Suggestions</h3>
        <p className="text-sm text-slate-500 mt-1">
          Increase follow-ups for invoices over 45 days
        </p>
      </div>
    </div>
  );
};

export default AIInsightsForecastingView;
