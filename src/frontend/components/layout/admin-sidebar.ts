export const adminSidebarComponent = `
    const AdminSidebar = ({ activeTab, onNavigate }) => {
        const navItems = [
            { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
            { id: 'classes', label: 'Classes & Groups', icon: 'fa-layer-group' },
            { id: 'users', label: 'Users', icon: 'fa-users' },
            { id: 'questions', label: 'Question Bank', icon: 'fa-database' },
            { id: 'settings', label: 'Settings', icon: 'fa-cog' }
        ];

        const handleLogout = () => {
            if (confirm('Are you sure you want to log out?')) {
                localStorage.removeItem('auth_token');
                window.location.href = '/';
            }
        };

        return (
            <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-white border-r border-stone-200 shrink-0">
                
                {/* Site Title Bar - Colorized (Deep Navy) */}
                <div className="bg-[#1e3a8a] text-white h-16 flex items-center px-6 shadow-md z-10">
                    <div className="font-serif font-bold text-lg tracking-wide uppercase">
                        Freeducation
                    </div>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={\`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 group text-sm font-medium \${activeTab === item.id ? 'bg-stone-100 text-[#1e3a8a] font-bold' : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'}\`}
                        >
                            <i className={\`fa-solid \${item.icon} w-5 text-center text-base \${activeTab === item.id ? 'text-[#1e3a8a]' : 'text-stone-400 group-hover:text-stone-600'}\`}></i>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Footer / User Profile - Clean & "Free" Style */}
                <div className="p-4 border-t border-stone-100">
                    <div className="flex items-center justify-between">
                        
                        {/* Avatar & Name (No Box, No Border) */}
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#1e3a8a] flex items-center justify-center text-white text-xs font-serif shadow-sm">
                                AD
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-stone-800 leading-none">Admin</span>
                                <span className="text-[10px] text-stone-400 mt-0.5">Administrator</span>
                            </div>
                        </div>

                        {/* Logout Icon Button - Functional */}
                        <button 
                            onClick={handleLogout} 
                            className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all" 
                            title="Logout"
                        >
                            <i className="fa-solid fa-power-off text-sm"></i>
                        </button>
                    </div>
                </div>
            </aside>
        );
    };
`;
