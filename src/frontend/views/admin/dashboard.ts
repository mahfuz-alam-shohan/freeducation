export const dashboardComponents = `
        const AdminShell = ({ title, subtitle, activeTab, onNavigate, children }) => {
            const navItems = [
                { id: 'classes', label: 'Classes', icon: 'fa-layer-group' },
                { id: 'settings', label: 'Settings', icon: 'fa-gear' }
            ];

            return (
                <div className="flex flex-col lg:flex-row flex-1 bg-gray-50">
                    <aside className="hidden lg:flex lg:w-64 border-r border-gray-200 bg-white p-6">
                        <div className="flex flex-col gap-2 w-full">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => onNavigate('dashboard')}
                                    className={\`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition \${activeTab === item.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}\`}
                                >
                                    <i className={\`fas \${item.icon}\`}></i>
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </aside>

                    <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8 pb-24 lg:pb-8 flex flex-col gap-6">
                        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">{title}</h2>
                                {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
                            </div>
                        </header>
                        <section className="flex flex-col gap-6">
                            {children}
                        </section>
                        <footer className="border-t border-gray-200 pt-4 text-xs text-gray-400">
                            Freeducation Admin • Manage classes and content responsibly.
                        </footer>
                    </main>

                    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-sm">
                        <div className="flex justify-around">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => onNavigate('dashboard')}
                                    className={\`flex flex-col items-center gap-1 py-3 text-xs font-semibold w-full \${activeTab === item.id ? 'text-blue-600' : 'text-gray-500'}\`}
                                >
                                    <i className={\`fas \${item.icon} text-base\`}></i>
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </nav>
                </div>
            );
        };

        const AdminDashboard = ({ onNavigate }) => {
            const [classes, setClasses] = useState([]);
            const [loading, setLoading] = useState(true);
            const allowedClasses = ['SSC', 'HSC'];

            const fetchClasses = async () => {
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    setLoading(false);
                    return;
                }
                const response = await fetch('/api/classes', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const data = await response.json();
                if (data.success) {
                    setClasses(data.classes || []);
                }
                setLoading(false);
            };

            useEffect(() => {
                fetchClasses();
            }, []);

            const allowedLookup = new Set(allowedClasses.map((name) => name.toUpperCase()));
            const filteredClasses = classes.filter((item) => allowedLookup.has(String(item.name || '').toUpperCase()));

            const getClassRoute = (name) => {
                const upper = String(name || '').toUpperCase();
                if (upper === 'SSC') return 'admin-groups-ssc';
                if (upper === 'HSC') return 'admin-groups-hsc';
                return null;
            };

            return (
                <AdminShell
                    title="Admin Dashboard"
                    subtitle="Manage class structure and learning content."
                    activeTab="classes"
                    onNavigate={onNavigate}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {loading && (
                            <div className="col-span-full text-sm text-gray-400">Loading...</div>
                        )}
                        {!loading && filteredClasses.length === 0 && (
                            <div className="col-span-full text-sm text-gray-400">No classes available.</div>
                        )}
                        {filteredClasses.map((item) => {
                            const route = getClassRoute(item.name);
                            return (
                                <div key={item.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
                                    <div>
                                        <div className="text-sm uppercase tracking-[0.2em] text-gray-400">Class</div>
                                        <div className="text-lg font-semibold text-gray-900 mt-2">{item.name}</div>
                                        <p className="text-sm text-gray-500 mt-2">Create subject groups and manage structure.</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => route && onNavigate(route)}
                                            className={\`px-3 py-2 rounded-lg text-sm font-semibold border transition \${route ? 'border-blue-200 text-blue-700 hover:bg-blue-50' : 'border-gray-200 text-gray-400 cursor-not-allowed'}\`}
                                            disabled={!route}
                                        >
                                            Open Groups
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </AdminShell>
            );
        };

        const AdminGroupSelection = ({ classLabel, onNavigate }) => {
            const groups = [
                { title: 'Science', description: 'Physics, Chemistry, Biology' },
                { title: 'Humanities', description: 'Arts, Social Science' },
                { title: 'Business Studies', description: 'Commerce, Finance' }
            ];

            return (
                <AdminShell
                    title={"Class " + classLabel}
                    subtitle="Choose a group to manage materials."
                    activeTab="classes"
                    onNavigate={onNavigate}
                >
                    <div className="flex justify-end">
                        <button
                            onClick={() => onNavigate('dashboard')}
                            className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                        >
                            Back to Dashboard
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {groups.map((group) => (
                            <div key={group.title} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
                                <div>
                                    <div className="text-sm uppercase tracking-[0.2em] text-gray-400">Group</div>
                                    <div className="text-lg font-semibold text-gray-900 mt-2">{group.title}</div>
                                    <p className="text-sm text-gray-500 mt-2">{group.description}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
                                        View Topics
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </AdminShell>
            );
        };
`;
