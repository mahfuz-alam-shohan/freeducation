export const AdminMobileNav = ({ activeTab, onNavigate }) => {
  const navItems = [
    { id: 'classes', label: 'Classes', icon: 'fa-layer-group' },
    { id: 'users', label: 'Users', icon: 'fa-users' },
    { id: 'settings', label: 'Settings', icon: 'fa-gear' }
  ];

  const navRoutes = {
    classes: 'dashboard',
    users: 'admin-users',
    settings: 'admin-settings'
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 z-40">
      <div className="grid grid-cols-3 gap-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(navRoutes[item.id] || 'dashboard')}
            className={`flex flex-col items-center gap-1 py-3 text-xs font-semibold w-full transition-colors duration-200 ${
              activeTab === item.id 
                ? 'text-indigo-600 bg-indigo-50/30' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <i className={`fas ${item.icon} text-base mb-0.5`}></i>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
