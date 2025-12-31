export const dashboardComponents = `
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
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm divide-y">
                        {loading && (
                            <div className="px-5 py-4 text-sm text-gray-400">Loading...</div>
                        )}
                        {!loading && filteredClasses.length === 0 && (
                            <div className="px-5 py-4 text-sm text-gray-400">No classes available.</div>
                        )}
                        {filteredClasses.map((item) => {
                            const route = getClassRoute(item.name);
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => route && onNavigate(route)}
                                    className={\`w-full flex items-center justify-between px-5 py-4 text-sm font-semibold transition \${route ? 'text-gray-700 hover:bg-gray-50' : 'text-gray-400 cursor-not-allowed'}\`}
                                    disabled={!route}
                                >
                                    <div className="text-left">
                                        <div className="text-xs uppercase tracking-[0.2em] text-gray-400">Class</div>
                                        <div className="text-base font-semibold text-gray-900 mt-1">{item.name}</div>
                                        <p className="text-xs text-gray-500 mt-2">Create subject groups and manage structure.</p>
                                    </div>
                                    <span className={\`text-xs uppercase tracking-[0.2em] \${route ? 'text-blue-600' : 'text-gray-300'}\`}>Open</span>
                                </button>
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
            const getGroupRoute = (groupTitle) => {
                const base = String(classLabel || '').toLowerCase();
                const groupKey = String(groupTitle || '').toLowerCase().replace(/\\s+/g, '-');
                return \`admin-\${base}-\${groupKey}\`;
            };

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

                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm divide-y">
                        {groups.map((group) => (
                            <button
                                key={group.title}
                                onClick={() => onNavigate(getGroupRoute(group.title))}
                                className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                            >
                                <div className="text-left">
                                    <div className="text-xs uppercase tracking-[0.2em] text-gray-400">Group</div>
                                    <div className="text-base font-semibold text-gray-900 mt-1">{group.title}</div>
                                    <p className="text-xs text-gray-500 mt-2">{group.description}</p>
                                </div>
                                <span className="text-xs uppercase tracking-[0.2em] text-blue-600">Open</span>
                            </button>
                        ))}
                    </div>
                </AdminShell>
            );
        };

        const AdminGroupDetail = ({ classLabel, groupLabel, onNavigate }) => {
            const subjectMap = {
                SSC: {
                    Science: [
                        'Bangla 1st Paper',
                        'Bangla 2nd Paper',
                        'English 1st Paper',
                        'English 2nd Paper',
                        'General Mathematics',
                        'Physics',
                        'Chemistry',
                        'Biology',
                        'Higher Mathematics',
                        'Bangladesh and Global Studies',
                        'Information and Communication Technology',
                        'Religion and Moral Education'
                    ],
                    Humanities: [
                        'Bangla 1st Paper',
                        'Bangla 2nd Paper',
                        'English 1st Paper',
                        'English 2nd Paper',
                        'General Mathematics',
                        'Bangladesh and Global Studies',
                        'Information and Communication Technology',
                        'Geography and Environment',
                        'History of Bangladesh and World Civilization',
                        'Civics and Citizenship',
                        'Religion and Moral Education'
                    ],
                    'Business Studies': [
                        'Bangla 1st Paper',
                        'Bangla 2nd Paper',
                        'English 1st Paper',
                        'English 2nd Paper',
                        'General Mathematics',
                        'Bangladesh and Global Studies',
                        'Information and Communication Technology',
                        'Accounting',
                        'Business Entrepreneurship',
                        'Finance and Banking',
                        'Religion and Moral Education'
                    ]
                },
                HSC: {
                    Science: [
                        'Bangla 1st Paper',
                        'Bangla 2nd Paper',
                        'English 1st Paper',
                        'English 2nd Paper',
                        'Information and Communication Technology',
                        'Physics 1st Paper',
                        'Physics 2nd Paper',
                        'Chemistry 1st Paper',
                        'Chemistry 2nd Paper',
                        'Biology 1st Paper',
                        'Biology 2nd Paper',
                        'Higher Mathematics 1st Paper',
                        'Higher Mathematics 2nd Paper'
                    ],
                    Humanities: [
                        'Bangla 1st Paper',
                        'Bangla 2nd Paper',
                        'English 1st Paper',
                        'English 2nd Paper',
                        'Information and Communication Technology',
                        'Economics 1st Paper',
                        'Economics 2nd Paper',
                        'History 1st Paper',
                        'History 2nd Paper',
                        'Civics and Good Governance 1st Paper',
                        'Civics and Good Governance 2nd Paper',
                        'Logic 1st Paper',
                        'Logic 2nd Paper'
                    ],
                    'Business Studies': [
                        'Bangla 1st Paper',
                        'Bangla 2nd Paper',
                        'English 1st Paper',
                        'English 2nd Paper',
                        'Information and Communication Technology',
                        'Accounting 1st Paper',
                        'Accounting 2nd Paper',
                        'Business Organization and Management 1st Paper',
                        'Business Organization and Management 2nd Paper',
                        'Finance, Banking and Insurance 1st Paper',
                        'Finance, Banking and Insurance 2nd Paper',
                        'Production Management and Marketing 1st Paper',
                        'Production Management and Marketing 2nd Paper'
                    ]
                }
            };

            const subjects = subjectMap[classLabel]?.[groupLabel] || [];
            const groupRoute = classLabel === 'SSC' ? 'admin-groups-ssc' : 'admin-groups-hsc';

            return (
                <AdminShell
                    title={\`\${classLabel} - \${groupLabel}\`}
                    subtitle="Manage the subject list for this group."
                    activeTab="classes"
                    onNavigate={onNavigate}
                >
                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => onNavigate(groupRoute)}
                            className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                        >
                            Back to Groups
                        </button>
                        <button
                            onClick={() => onNavigate('dashboard')}
                            className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                        >
                            Back to Dashboard
                        </button>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm divide-y">
                        {subjects.length === 0 && (
                            <div className="px-5 py-4 text-sm text-gray-400">No subjects configured.</div>
                        )}
                        {subjects.map((subject) => (
                            <div key={subject} className="px-5 py-4 text-sm font-semibold text-gray-700">
                                {subject}
                            </div>
                        ))}
                    </div>
                </AdminShell>
            );
        };
`;
