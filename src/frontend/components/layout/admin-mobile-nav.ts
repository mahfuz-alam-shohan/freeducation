export const adminMobileNavComponent = `
    const AdminMobileNav = ({ activeTab, onNavigate }) => {
        const [isOpen, setIsOpen] = useState(false);

        const navItems = [
            { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
            { id: 'classes', label: 'Classes', icon: 'fa-layer-group' },
            { id: 'users', label: 'Users', icon: 'fa-users' },
            { id: 'questions', label: 'Questions', icon: 'fa-database' },
            { id: 'settings', label: 'Settings', icon: 'fa-cog' }
        ];

        const handleLogout = () => {
            if (confirm('Log out?')) {
                localStorage.removeItem('auth_token');
                window.location.href = '/';
            }
        };

        return (
            <div className="lg:hidden">
                {/* Mobile Top Bar - Colorized */}
                <div className="fixed top-0 left-0 right-0 h-16 bg-[#1e3a8a] flex items-center justify-between px-4 z-50 shadow-md">
                    <div className="font-serif font-bold text-lg tracking-wide text-white">FREEDUCATION</div>
                    <button onClick={() => setIsOpen(true)} className="text-white p-2">
                        <i className="fa-solid fa-bars text-xl"></i>
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                {isOpen && (
                    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
                        <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
                            <div className="h-16 flex items-center justify-between px-5 border-b border-stone-100 bg-stone-50/50">
                                <span className="font-serif font-bold text-[#1e3a8a]">Menu</span>
                                <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-stone-600 transition-colors">
                                    <i className="fa-solid fa-xmark text-xl"></i>
                                </button>
                            </div>
                            
                            <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
                                {navItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => { onNavigate(item.id); setIsOpen(false); }}
                                        className={\`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors \${activeTab === item.id ? 'bg-[#1e3a8a]/5 text-[#1e3a8a] font-bold' : 'text-stone-600 hover:bg-stone-50'}\`}
                                    >
                                        <i className={\`fa-solid \${item.icon} w-6 text-center \${activeTab === item.id ? 'text-[#1e3a8a]' : 'text-stone-400'}\`}></i>
                                        <span>{item.label}</span>
                                    </button>
                                ))}
                            </nav>

                            <div className="p-5 border-t border-stone-100 bg-stone-50/30">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center text-xs font-serif shadow-sm">AD</div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-stone-800">Admin</span>
                                            <span className="text-[10px] text-stone-500">Logged in</span>
                                        </div>
                                    </div>
                                    <button onClick={handleLogout} className="w-10 h-10 flex items-center justify-center text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all">
                                        <i className="fa-solid fa-power-off text-lg"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Spacer */}
                <div className="h-16"></div>
            </div>
        );
    };
`;
