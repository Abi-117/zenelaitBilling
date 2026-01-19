// AIInsightsForecastingView.jsx
import React from "react";
import { Sparkles, TrendingUp, AlertTriangle } from "lucide-react";

// Dummy data (should match your invoices & agingData)
const invoices = [
  { id: "INV-001", amount: 25000, customer: "Acme Corp", status: "Pending", date: "2026-01-10" },
  { id: "INV-002", amount: 50000, customer: "Globex", status: "Paid", date: "2026-01-05" },
  { id: "INV-003", amount: 80000, customer: "Beta Ltd", status: "Pending", date: "2026-01-12" },
  { id: "INV-004", amount: 8000, customer: "Acme Corp", status: "Pending", date: "2025-12-20" },
  { id: "INV-005", amount: 6200, customer: "Globex", status: "Pending", date: "2025-12-15" },
  { id: "INV-006", amount: 3000, customer: "Globex", status: "Pending", date: "2025-11-10" },
  { id: "INV-007", amount: 1200, customer: "Globex", status: "Overdue", date: "2025-10-05" },
  { id: "INV-008", amount: 32000, customer: "Gamma Inc", status: "Paid", date: "2026-01-02" },
];

// Helper: calculate expected revenue growth
const calculateRevenueForecast = (invoices) => {
  const lastQuarterRevenue = invoices
    .filter(inv => new Date(inv.date) >= new Date("2025-10-01"))
    .reduce((sum, inv) => sum + inv.amount, 0);
  const expectedGrowth = 0.18; // 18%
  return { revenue: lastQuarterRevenue, growth: expectedGrowth };
};

// Helper: find high-risk customers (overdue > 30 days)
const getPaymentRisk = (invoices) => {
  const today = new Date();
  return invoices
    .filter(inv => inv.status === "Overdue")
    .map(inv => inv.customer);
};

// Helper: generate AI suggestions
const generateAISuggestions = (invoices) => {
  const over45Days = invoices.filter(inv => {
    const invDate = new Date(inv.date);
    const diff = (new Date() - invDate) / (1000 * 60 * 60 * 24);
    return diff > 45 && inv.status !== "Paid";
  });
  return over45Days.length > 0
    ? `Increase follow-ups for ${over45Days.length} invoice(s) over 45 days`
    : "No immediate follow-ups needed";
};

const AIInsightsForecastingView = () => {
  const revenueForecast = calculateRevenueForecast(invoices);
  const riskyCustomers = getPaymentRisk(invoices);
  const aiSuggestion = generateAISuggestions(invoices);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Revenue Forecast */}
      <div className="bg-white rounded-xl shadow p-6">
        <TrendingUp className="text-emerald-600" />
        <h3 className="font-bold mt-2">Revenue Forecast</h3>
        <p className="text-sm text-slate-500 mt-1">
          ₹{revenueForecast.revenue.toLocaleString()} expected, +{(revenueForecast.growth*100).toFixed(0)}% growth next quarter
        </p>
      </div>

      {/* Payment Risk */}
      <div className="bg-white rounded-xl shadow p-6">
        <AlertTriangle className="text-amber-500" />
        <h3 className="font-bold mt-2">Payment Risk</h3>
        <p className="text-sm text-slate-500 mt-1">
          {riskyCustomers.length > 0
            ? `${riskyCustomers.length} customer(s) likely to delay payments: ${riskyCustomers.join(", ")}`
            : "No immediate payment risks detected"}
        </p>
      </div>

      {/* AI Suggestions */}
      <div className="bg-white rounded-xl shadow p-6">
        <Sparkles className="text-violet-600" />
        <h3 className="font-bold mt-2">AI Suggestions</h3>
        <p className="text-sm text-slate-500 mt-1">{aiSuggestion}</p>
      </div>
    </div>
  );
};

export default AIInsightsForecastingView;
