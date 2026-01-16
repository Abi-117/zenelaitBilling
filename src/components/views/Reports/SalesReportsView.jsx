const SalesReportsView = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { label: 'Total Revenue', value: '₹4,82,500' },
        { label: 'Outstanding Invoices', value: '₹78,200' },
        { label: 'Avg Invoice Value', value: '₹12,450' },
      ].map((stat, i) => (
        <div key={i} className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-slate-500">{stat.label}</p>
          <p className="text-2xl font-bold mt-2">{stat.value}</p>
        </div>
      ))}

      <div className="md:col-span-3 bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-bold mb-4">Monthly Sales Summary</h2>
        <div className="h-48 flex items-center justify-center text-slate-400">
          📊 Chart Placeholder
        </div>
      </div>
    </div>
  );
};

export default SalesReportsView;
