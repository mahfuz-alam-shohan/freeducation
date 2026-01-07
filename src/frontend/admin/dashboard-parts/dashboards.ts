export const dashboardMain = `
        const TeacherDashboard = ({ assignment, subjectConfig, onNavigate }) => {
            const hasAssignment = assignment && assignment.level && assignment.subject;
            return (
                <TeacherShell title="Teacher Dashboard" subtitle="Access the subject you are assigned to manage." activeTab="subject" onNavigate={onNavigate}>
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm divide-y soft-glow">
                        {!hasAssignment && <div className="px-5 py-6 text-sm text-gray-400">No subject assignment found yet. Please contact an admin to assign your subject.</div>}
                        {hasAssignment && (
                            <div className="px-5 py-6 flex flex-col gap-4">
                                <div className="text-xs uppercase tracking-[0.3em] text-gray-400">Assigned subject</div>
                                <div className="text-lg font-semibold text-gray-900">{assignment.subject}</div>
                                <div className="text-sm text-gray-500">Class: {assignment.level}</div>
                                <p className="text-sm text-gray-500">{subjectConfig?.description || 'Content tools for this subject will appear here.'}</p>
                                {subjectConfig?.route ? (
                                    <div className="flex flex-wrap items-center gap-3">
                                        <button onClick={() => onNavigate(subjectConfig.route)} className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-[0.3em] bg-blue-600 text-white hover:bg-blue-500 transition">Manage content</button>
                                        <span className="text-xs text-gray-400">You only see the subject assigned to you.</span>
                                    </div>
                                ) : <div className="text-xs text-gray-400">Content tools for this subject are not available yet.</div>}
                            </div>
                        )}
                    </div>
                </TeacherShell>
            );
        };

        const AdminDashboard = ({ onNavigate }) => {
            const [classes, setClasses] = useState([]);
            const [loading, setLoading] = useState(true);
            const allowedClasses = ['SSC', 'HSC'];
            const fetchClasses = async () => {
                const token = localStorage.getItem('auth_token');
                if (!token) { setLoading(false); return; }
                const response = await fetch('/api/classes', { headers: { 'Authorization': 'Bearer ' + token } });
                const data = await response.json();
                if (data.success) { setClasses(data.classes || []); }
                setLoading(false);
            };
            useEffect(() => { fetchClasses(); }, []);
            const allowedLookup = new Set(allowedClasses.map((name) => name.toUpperCase()));
            const filteredClasses = classes.filter((item) => allowedLookup.has(String(item.name || '').toUpperCase()));
            const getClassRoute = (name) => {
                const upper = String(name || '').toUpperCase();
                if (upper === 'SSC') return 'admin-groups-ssc';
                if (upper === 'HSC') return 'admin-groups-hsc';
                return null;
            };
            return (
                <AdminShell title="Admin Dashboard" subtitle="Manage class structure and learning content." activeTab="classes" onNavigate={onNavigate}>
                    {loading && <div className="px-5 py-4 text-sm text-gray-400">Loading...</div>}
                    {!loading && filteredClasses.length === 0 && <div className="px-5 py-4 text-sm text-gray-400">No classes available.</div>}
                    {!loading && filteredClasses.length > 0 && (
                        <div className="grid card-grid-gap sm:grid-cols-2">
                            {filteredClasses.map((item) => {
                                const route = getClassRoute(item.name);
                                const isActive = Boolean(route);
                                return (
                                    <button key={item.id} onClick={() => route && onNavigate(route)} className={\`border border-gray-200 rounded-2xl p-5 text-left shadow-sm transition \${isActive ? 'bg-white hover:border-gray-300 hover:bg-gray-50' : 'bg-gray-50 text-gray-400 cursor-not-allowed'}\`} disabled={!route}>
                                        <div className="text-xs uppercase tracking-[0.3em] text-gray-400">Class</div>
                                        <div className="text-lg font-semibold text-gray-900 mt-2">{item.name}</div>
                                        <div className="text-sm text-gray-500 mt-2">Create subject groups and manage structure.</div>
                                        <div className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em]"><span className={isActive ? 'text-blue-600' : 'text-gray-300'}>Open</span>{isActive && <span className="text-gray-300">→</span>}</div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </AdminShell>
            );
        };
`;
