export const StudentSidebar = ({ activeTab, onNavigate }) => {
  const navItems = [
    { id: 'class', label: 'My Class', icon: 'fa-graduation-cap' },
    { id: 'settings', label: 'Settings', icon: 'fa-gear' }
  ];

  const navRoutes = {
    class: 'student-class',
    settings: 'student-settings'
  };

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-slate-200 lg:bg-white/50 lg:backdrop-blur-sm lg:z-40">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center gap-3 p-6 border-b border-slate-200">
          <LogoMark />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(navRoutes[item.id] || 'student-class')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
              }`}
            >
              <i className={`fas ${item.icon} ${activeTab === item.id ? 'text-indigo-600' : 'text-slate-400'}`}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200">
          <div className="text-xs text-slate-500 text-center">
            Student Portal
          </div>
        </div>
      </div>
    </aside>
  );
};
