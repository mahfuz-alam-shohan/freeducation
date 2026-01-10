export const studentMobileNavComponent = `
        const StudentMobileNav = ({ activeTab, onNavigate }) => {
            const navItems = [
                { id: 'class', label: 'My Class', icon: 'fa-graduation-cap' },
                { id: 'settings', label: 'Settings', icon: 'fa-gear' }
            ];
            const navRoutes = {
                class: 'student-class',
                settings: 'student-settings'
            };

            return (
                <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <div className="flex justify-around">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(navRoutes[item.id] || 'student-class')}
                                className={\`flex flex-col items-center gap-1 py-3 text-xs font-semibold w-full transition-colors duration-200 \${activeTab === item.id ? 'text-indigo-600 bg-indigo-50/30' : 'text-slate-500 hover:bg-slate-50'}\`}
                            >
                                <i className={\`fas \${item.icon} text-base mb-0.5\`}></i>
                                {item.label}
                            </button>
                        ))}
                    </div>
                </nav>
            );
        };
`;
