import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchReceivables } from "../../../../services/dashboardApi";

const DEFAULT_RECEIVABLE = {
  total: 0,
  chart: [],
};

const ReceivableSummary = ({ dataRange }) => {
  const [receivable, setReceivable] = useState(DEFAULT_RECEIVABLE);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchReceivables(dataRange);
      setReceivable(data || DEFAULT_RECEIVABLE);
      setLoading(false);
    };

    loadData();
  }, [dataRange]);

  return (
    <div className="bg-white rounded-xl border p-5">
      <h3 className="text-sm font-semibold text-slate-600 mb-1">
        Receivable Summary
      </h3>

      <h2 className="text-xl font-bold mb-3">
        {loading
          ? "Loading..."
          : `₹${(receivable.total || 0).toLocaleString("en-IN")}`}
      </h2>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={receivable.chart || []}>
            <XAxis dataKey="name" />
            <YAxis hide />
            <Tooltip
              formatter={(value) =>
                `₹${Number(value).toLocaleString("en-IN")}`
              }
            />
            <Bar dataKey="amount" fill="#c2410c" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReceivableSummary;
