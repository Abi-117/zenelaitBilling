import { useState } from 'react';

const Sidebar = ({ menu, activeTab, onSelect }) => {
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (id) => {
    setOpenMenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen p-4 overflow-y-auto">
      {menu.map((item) => {
        const isActiveParent =
          activeTab === item.id ||
          item.children?.some((child) => child.id === activeTab);

        return (
          <div key={item.id}>
            {/* Parent Item */}
            <button
              onClick={() => (item.children ? toggleMenu(item.id) : onSelect(item.id))}
              className={`flex items-center w-full px-3 py-2 rounded text-left
                ${isActiveParent ? 'bg-blue-600' : 'hover:bg-slate-700'}
              `}
            >
              {item.icon && <item.icon size={16} className="mr-2" />}
              <span className="flex-1">{item.label}</span>
              {item.children && (
                <span className="ml-auto">
                  {openMenus[item.id] ? '▾' : '▸'}
                </span>
              )}
            </button>

            {/* Child Items */}
            {item.children && openMenus[item.id] && (
              <div className="ml-5 mt-1 space-y-1">
                {item.children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => onSelect(child.id)}
                    className={`block w-full text-left px-3 py-2 rounded text-sm
                      ${
                        activeTab === child.id
                          ? 'bg-blue-500 text-white'
                          : 'text-slate-300 hover:bg-slate-700'
                      }
                    `}
                  >
                    {child.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </aside>
  );
};

export default Sidebar;
