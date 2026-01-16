export const reportsData = [
  {
    id: 'sales',
    label: 'Sales Reports',
    stats: [
      { label: 'Total Revenue', value: '₹4,82,500' },
      { label: 'Outstanding Invoices', value: '₹78,200' },
      { label: 'Avg Invoice Value', value: '₹12,450' },
    ],
    table: 'Monthly Sales Summary',
    tablePlaceholder: '📊 Chart Placeholder',
  },
  {
    id: 'payments',
    label: 'Payment & Aging Reports',
    table: 'Payment Aging Report',
    tablePlaceholder: 'Payment & Aging Table Placeholder',
  },
  {
    id: 'tax',
    label: 'Tax Reports',
    stats: [
      { label: 'GST Collected', value: '₹62,300' },
      { label: 'GST Payable', value: '₹18,900' },
    ],
    table: 'GST Summary',
    tablePlaceholder: 'GST Table / Export',
  },
  {
    id: 'ai',
    label: 'AI Insights & Forecasting',
    cards: [
      {
        title: 'Revenue Forecast',
        icon: 'TrendingUp',
        value: 'Expected +18% growth next quarter',
        color: 'emerald',
      },
      {
        title: 'Payment Risk',
        icon: 'AlertTriangle',
        value: '3 customers likely to delay payments',
        color: 'amber',
      },
      {
        title: 'AI Suggestions',
        icon: 'Sparkles',
        value: 'Increase follow-ups for invoices over 45 days',
        color: 'violet',
      },
    ],
  },
];
