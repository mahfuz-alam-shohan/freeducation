export const dashboardComponents = `
        const AdminDashboard = ({ onNavigate }) => {
            const [activeTab, setActiveTab] = useState('classes');
            const [classes, setClasses] = useState([]);
            const [newClassName, setNewClassName] = useState('');
            const [loading, setLoading] = useState(true);
            const [saving, setSaving] = useState(false);
            const templates = ['SSC', 'HSC'];

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

            const handleCreateClass = async (name) => {
                const trimmed = String(name || '').trim();
                if (!trimmed || saving) return;
                setSaving(true);
                const token = localStorage.getItem('auth_token');
                const response = await fetch('/api/classes', {
                    method: 'POST',
                    headers: { 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify({ name: trimmed })
                });
                const data = await response.json();
                if (data.success && data.class) {
                    setClasses((prev) => [data.class, ...prev]);
                    setNewClassName('');
                } else if (data.error) {
                    alert(data.error);
                }
                setSaving(false);
            };

            const existing = new Set(classes.map((item) => String(item.name || '').toUpperCase()));
            const quickAdd = templates.filter((name) => !existing.has(name));

            const getClassRoute = (name) => {
                const upper = String(name || '').toUpperCase();
                if (upper === 'SSC') return 'admin-groups-ssc';
                if (upper === 'HSC') return 'admin-groups-hsc';
                return null;
            };

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
                                    onClick={() => setActiveTab(item.id)}
                                    className={\`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition \${activeTab === item.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}\`}
                                >
                                    <i className={\`fas \${item.icon}\`}></i>
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </aside>

                    <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8 pb-24 lg:pb-8">
                        {activeTab === 'classes' && (
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Admin Dashboard</h2>
                                        <p className="text-sm text-gray-500 mt-1">Manage class structure and learning content.</p>
                                    </div>
                                    <div className="flex w-full sm:w-auto gap-2">
                                        <input
                                            value={newClassName}
                                            onChange={(e) => setNewClassName(e.target.value)}
                                            placeholder="Class name"
                                            className="flex-1 sm:flex-none sm:w-56 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                                        />
                                        <button
                                            onClick={() => handleCreateClass(newClassName)}
                                            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
                                        >
                                            {saving ? 'Adding...' : 'Add'}
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {loading && (
                                        <div className="col-span-full text-sm text-gray-400">Loading...</div>
                                    )}
                                    {!loading && classes.length === 0 && quickAdd.length === 0 && (
                                        <div className="col-span-full text-sm text-gray-400">No classes yet.</div>
                                    )}
                                    {classes.map((item) => {
                                        const route = getClassRoute(item.name);
                                        return (
                                            <div key={item.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
                                                <div>
                                                    <div className="text-sm uppercase tracking-[0.2em] text-gray-400">Class</div>
                                                    <div className="text-lg font-semibold text-gray-900 mt-2">{item.name}</div>
                                                    <p className="text-sm text-gray-500 mt-2">Create subject groups and upload content.</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => route && onNavigate(route)}
                                                        className={\`px-3 py-2 rounded-lg text-sm font-semibold border transition \${route ? 'border-blue-200 text-blue-700 hover:bg-blue-50' : 'border-gray-200 text-gray-400 cursor-not-allowed'}\`}
                                                        disabled={!route}
                                                    >
                                                        Open Groups
                                                    </button>
                                                    <button className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
                                                        Upload Content
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {quickAdd.map((name) => (
                                        <button
                                            key={name}
                                            onClick={() => handleCreateClass(name)}
                                            className="text-left bg-white border border-dashed border-gray-200 rounded-2xl p-5 shadow-sm hover:border-blue-200 hover:bg-blue-50 transition"
                                        >
                                            <div className="text-sm uppercase tracking-[0.2em] text-gray-400">{name}</div>
                                            <div className="text-lg font-semibold text-gray-900 mt-2">Add</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="flex flex-col gap-4">
                                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Settings</h2>
                                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                                    <div className="text-sm text-gray-500">Account settings will appear here.</div>
                                </div>
                            </div>
                        )}
                    </main>

                    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-sm">
                        <div className="flex justify-around">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
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

        const AdminGroupSelection = ({ classLabel, onNavigate }) => {
            const groups = [
                { title: 'Science', description: 'Physics, Chemistry, Biology' },
                { title: 'Humanities', description: 'Arts, Social Science' },
                { title: 'Business Studies', description: 'Commerce, Finance' }
            ];

            return (
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <div className="text-sm uppercase tracking-[0.2em] text-gray-400">Class</div>
                            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-2">{classLabel}</h2>
                            <p className="text-sm text-gray-500 mt-1">Choose a group to upload materials.</p>
                        </div>
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
                                    <button className="px-3 py-2 rounded-lg text-sm font-semibold border border-blue-200 text-blue-700 hover:bg-blue-50 transition">
                                        Upload Content
                                    </button>
                                    <button className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
                                        View Topics
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        };
`;
