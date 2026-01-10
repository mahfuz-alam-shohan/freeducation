export const studentSidebarComponent = `
        const StudentSidebar = ({ activeTab, onNavigate }) => {
            const navItems = [
                { id: 'class', label: 'My Class', icon: 'fa-graduation-cap' },
                { id: 'settings', label: 'Settings', icon: 'fa-gear' }
            ];
            const navRoutes = {
                class: 'student-class',
                settings: 'student-settings'
            };

            return (
                <aside className="hidden lg:flex lg:w-64 border-r border-gray-200 bg-white p-6">
                    <div className="flex flex-col gap-2 w-full">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(navRoutes[item.id] || 'student-class')}
                                className={\`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 \${activeTab === item.id ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'}\`}
                            >
                                <i className={\`fas \${item.icon} \${activeTab === item.id ? 'text-indigo-600' : 'text-slate-400'}\`}></i>
                                {item.label}
                            </button>
                        ))}
                    </div>
                </aside>
            );
        };
`;
