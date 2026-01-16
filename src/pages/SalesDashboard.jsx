
export default function Sidebar({ menu, activeId, setActiveId }) {
  return (
    <div className="w-64 bg-white border-r h-screen p-4">
      <h2 className="text-lg font-bold text-slate-700 mb-4">
        {menu.label}
      </h2>

      <div className="space-y-1">
        {menu.children.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveId(item.id)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition
              ${
                activeId === item.id
                  ? 'bg-blue-100 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }
            `}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
