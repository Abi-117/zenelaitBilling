import { Download, FileText } from 'lucide-react';

const ReportHeader = ({
  title,
  onExportPDF,
  onExportExcel,
  showFilters = true,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
      
      {/* Title */}
      <h2 className="text-lg font-bold">{title}</h2>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        
        {/* Date Filter (optional) */}
        {showFilters && (
          <select className="border rounded-lg px-3 py-1.5 text-sm">
            <option>This Month</option>
            <option>Last Month</option>
            <option>Last 3 Months</option>
            <option>Custom Range</option>
          </select>
        )}

        {/* Export PDF */}
        <button
          onClick={onExportPDF}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <FileText size={14} />
          PDF
        </button>

        {/* Export Excel */}
        <button
          onClick={onExportExcel}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-emerald-600 text-white rounded hover:bg-emerald-700"
        >
          <Download size={14} />
          Excel
        </button>
      </div>
    </div>
  );
};

export default ReportHeader;
