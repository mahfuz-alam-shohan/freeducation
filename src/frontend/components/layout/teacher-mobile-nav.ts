export const teacherMobileNavComponent = `
        const TeacherMobileNav = ({ activeTab, onNavigate }) => {
            const navItems = [
                { id: 'subject', label: 'Subject', icon: 'fa-book-open' },
                { id: 'settings', label: 'Settings', icon: 'fa-gear' }
            ];
            const navRoutes = {
                subject: 'dashboard',
                settings: 'admin-settings'
            };

            return (
                <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-sm z-50">
                    <div className="flex justify-around">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(navRoutes[item.id] || 'dashboard')}
                                className={\`flex flex-col items-center gap-1 py-3 text-xs font-semibold w-full \${activeTab === item.id ? 'text-blue-600' : 'text-gray-500'}\`}
                            >
                                <i className={\`fa-solid \${item.icon} text-base\`}></i>
                                {item.label}
                            </button>
                        ))}
                    </div>
                </nav>
            );
        };
`;
