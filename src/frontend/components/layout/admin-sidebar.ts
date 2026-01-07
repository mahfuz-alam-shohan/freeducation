export const adminSidebarComponent = `
        const AdminSidebar = ({ activeTab, onNavigate }) => {
            const navItems = [
                { id: 'classes', label: 'Classes', icon: 'fa-layer-group' },
                { id: 'users', label: 'Users', icon: 'fa-users' }, // <--- NEW BUTTON
                { id: 'settings', label: 'Settings', icon: 'fa-gear' }
            ];
            const navRoutes = {
                classes: 'dashboard',
                users: 'admin-users', // <--- NEW ROUTE
                settings: 'admin-settings'
            };

            return (
                <aside className="hidden lg:flex lg:w-64 border-r border-gray-200 bg-white p-6">
                    <div className="flex flex-col gap-2 w-full">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(navRoutes[item.id] || 'dashboard')}
                                className={\`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition \${activeTab === item.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}\`}
                            >
                                <i className={\`fas \${item.icon}\`}></i>
                                {item.label}
                            </button>
                        ))}
                    </div>
                </aside>
            );
        };
`;
