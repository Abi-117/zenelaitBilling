import { Search, Bell } from 'lucide-react';

const TopNavbar = ({
  searchQuery,
  setSearchQuery,
  isSidebarCollapsed
}) => {
  return (
    <header className="h-20 bg-white border-b flex items-center justify-between px-8">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for invoices, customers, or items (Ctrl + K)..."
            className="w-full bg-slate-100 rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs font-bold">LIVE CONNECT</span>
        </div>

        <button className="p-2.5 text-slate-400 hover:text-blue-600 relative">
          <Bell size={22} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full" />
        </button>

        <button className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center text-white font-bold">
            JD
          </div>
          {!isSidebarCollapsed && (
            <div>
              <p className="text-sm font-bold">John Doe</p>
              <p className="text-[10px] text-slate-400">Administrator</p>
            </div>
          )}
        </button>
      </div>
    </header>
  );
};

export default TopNavbar;
