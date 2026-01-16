import ReportHeader from '../../common/ReportHeader';

const ProfitLossReportsView = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { label: 'Total Income', value: '₹8,20,000' },
        { label: 'Total Expense', value: '₹4,10,000' },
        { label: 'Net Profit', value: '₹4,10,000' },
      ].map((item, i) => (
        <div key={i} className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-slate-500">{item.label}</p>
          <p className="text-2xl font-bold mt-2">{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default ProfitLossReportsView;
