const TaxReportsView = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        { label: 'GST Collected', value: '₹62,300' },
        { label: 'GST Payable', value: '₹18,900' },
      ].map((stat, i) => (
        <div key={i} className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-slate-500">{stat.label}</p>
          <p className="text-2xl font-bold mt-2">{stat.value}</p>
        </div>
      ))}

      <div className="md:col-span-2 bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-bold mb-4">GST Summary</h2>
        <div className="h-40 flex items-center justify-center text-slate-400">
          GST Report Table / Export
        </div>
      </div>
    </div>
  );
};

export default TaxReportsView;
