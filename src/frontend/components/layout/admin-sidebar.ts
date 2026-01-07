export const adminSidebarComponent = `
    const AdminSidebar = ({ activeTab, onNavigate }) => {
        const [isExpanded, setIsExpanded] = useState(true);

        const navItems = [
            { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
            { id: 'classes', label: 'Classes & Groups', icon: 'fa-layer-group' },
            { id: 'users', label: 'Users', icon: 'fa-users' },
            { id: 'questions', label: 'Question Bank', icon: 'fa-database' },
            { id: 'settings', label: 'Settings', icon: 'fa-cog' }
        ];

        return (
            <>
                {/* Desktop Sidebar */}
                <aside className={\`hidden lg:flex flex-col h-screen sticky top-0 bg-white border-r border-stone-200 transition-all duration-300 \${isExpanded ? 'w-64' : 'w-20'}\`}>
                    
                    {/* Colorized Site Title Bar */}
                    <div className="bg-[#1e3a8a] text-white p-4 flex items-center justify-between shrink-0 h-16 shadow-md">
                        {isExpanded ? (
                            <div className="font-serif font-bold text-lg tracking-wide whitespace-nowrap overflow-hidden">
                                FREEDUCATION
                            </div>
                        ) : (
                            <div className="w-full text-center font-serif font-bold text-xl">F</div>
                        )}
                        <button onClick={() => setIsExpanded(!isExpanded)} className="text-white/70 hover:text-white transition-colors">
                            <i className={\`fa-solid \${isExpanded ? 'fa-chevron-left' : 'fa-chevron-right'}\`}></i>
                        </button>
                    </div>

                    {/* Navigation Items */}
                    <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className={\`flex items-center gap-4 px-3 py-3 rounded-lg transition-all duration-200 group \${activeTab === item.id ? 'bg-stone-100 text-[#1e3a8a] font-bold' : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'}\`}
                                title={!isExpanded ? item.label : ''}
                            >
                                <div className={\`w-6 flex justify-center text-lg \${activeTab === item.id ? 'text-[#1e3a8a]' : 'text-stone-400 group-hover:text-stone-600'}\`}>
                                    <i className={\`fa-solid \${item.icon}\`}></i>
                                </div>
                                {isExpanded && <span className="whitespace-nowrap">{item.label}</span>}
                            </button>
                        ))}
                    </nav>

                    {/* Footer / User Profile - "Free" Style (No Boxes) */}
                    <div className="p-4 border-t border-stone-100">
                        <div className={\`flex items-center \${isExpanded ? 'justify-between' : 'justify-center'}\`}>
                            
                            {/* Avatar & Name Area */}
                            <div className="flex items-center gap-3 overflow-hidden">
                                {/* Avatar Free - No borders, just the image */}
                                <div className="w-8 h-8 rounded-full bg-[#1e3a8a] flex items-center justify-center text-white text-xs font-serif shrink-0">
                                    AD
                                </div>
                                
                                {/* Name Free - No background box */}
                                {isExpanded && (
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-stone-800 leading-none">Admin</span>
                                        <span className="text-[10px] text-stone-400">Manage</span>
                                    </div>
                                )}
                            </div>

                            {/* Logout Icon Only */}
                            {isExpanded && (
                                <button className="text-stone-400 hover:text-red-600 transition-colors" title="Logout">
                                    <i className="fa-solid fa-power-off text-lg"></i>
                                </button>
                            )}
                        </div>
                    </div>
                </aside>
            </>
        );
    };
`;
