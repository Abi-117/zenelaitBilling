const ReportHeader = ({ title }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="space-x-2">
        <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">
          Export PDF
        </button>
        <button className="px-3 py-1 text-sm bg-emerald-600 text-white rounded">
          Export Excel
        </button>
      </div>
    </div>
  );
};

export default ReportHeader;
