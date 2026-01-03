export const dashboardComponents = `
        const TeacherDashboard = ({ assignment, subjectConfig, onNavigate }) => {
            const hasAssignment = assignment && assignment.level && assignment.subject;
            return (
                <TeacherShell
                    title="Teacher Dashboard"
                    subtitle="Access the subject you are assigned to manage."
                    activeTab="subject"
                    onNavigate={onNavigate}
                >
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm divide-y">
                        {!hasAssignment && (
                            <div className="px-5 py-6 text-sm text-gray-400">
                                No subject assignment found yet. Please contact an admin to assign your subject.
                            </div>
                        )}
                        {hasAssignment && (
                            <div className="px-5 py-6 flex flex-col gap-4">
                                <div className="text-xs uppercase tracking-[0.3em] text-gray-400">Assigned subject</div>
                                <div className="text-lg font-semibold text-gray-900">{assignment.subject}</div>
                                <div className="text-sm text-gray-500">Class: {assignment.level}</div>
                                <p className="text-sm text-gray-500">
                                    {subjectConfig?.description || 'Content tools for this subject will appear here.'}
                                </p>
                                {subjectConfig?.route ? (
                                    <div className="flex flex-wrap items-center gap-3">
                                        <button
                                            onClick={() => onNavigate(subjectConfig.route)}
                                            className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-[0.3em] bg-blue-600 text-white hover:bg-blue-500 transition"
                                        >
                                            Manage content
                                        </button>
                                        <span className="text-xs text-gray-400">
                                            You only see the subject assigned to you.
                                        </span>
                                    </div>
                                ) : (
                                    <div className="text-xs text-gray-400">
                                        Content tools for this subject are not available yet.
                                    </div>
                                )}
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
            const banglaRoute = classLabel === 'SSC' ? 'bangla-ssc-1st-paper' : 'bangla-hsc-1st-paper';
            const englishRoute = classLabel === 'HSC' ? 'english-hsc-1st-paper' : null;
            const ictRoute = classLabel === 'SSC' ? 'admin-ssc-ict' : null;
            const physicsRoute = classLabel === 'SSC' ? 'admin-ssc-physics' : null;
            const chemistryRoute = classLabel === 'SSC' ? 'admin-ssc-chemistry' : null;
            const biologyRoute = classLabel === 'SSC' ? 'admin-ssc-biology' : null;

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
                        {subjects.map((subject) => {
                            const isBanglaFirst = subject === 'Bangla 1st Paper';
                            const isEnglishFirst = subject === 'English 1st Paper' && classLabel === 'HSC';
                            const isIct = subject === 'Information and Communication Technology' && classLabel === 'SSC';
                            const isPhysics = subject === 'Physics' && classLabel === 'SSC';
                            const isChemistry = subject === 'Chemistry' && classLabel === 'SSC';
                            const isBiology = subject === 'Biology' && classLabel === 'SSC';
                            const displayLabel = isBanglaFirst ? 'বাংলা ১ম পত্র' : isIct ? 'আইসিটি' : subject;
                            if (!isBanglaFirst && !isEnglishFirst && !isIct && !isPhysics && !isChemistry && !isBiology) {
                                return (
                                    <div key={subject} className="px-5 py-4 text-sm font-semibold text-gray-700">
                                        {displayLabel}
                                    </div>
                                );
                            }
                            const route = isBanglaFirst
                                ? banglaRoute
                                : isEnglishFirst
                                    ? englishRoute
                                    : isIct
                                        ? ictRoute
                                        : isPhysics
                                            ? physicsRoute
                                            : isChemistry
                                                ? chemistryRoute
                                                : biologyRoute;
                            return (
                                <button
                                    key={subject}
                                    onClick={() => route && onNavigate(route)}
                                    className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                                >
                                    <span className={isBanglaFirst ? 'font-bangla' : ''}>{displayLabel}</span>
                                    <span className="text-xs uppercase tracking-[0.2em] text-blue-600">Open</span>
                                </button>
                            );
                        })}
                    </div>
                </AdminShell>
            );
        };

        const BanglaFirstPaperTopics = ({ classLabel, onNavigate }) => {
            const groupRoute = classLabel === 'SSC' ? 'admin-groups-ssc' : 'admin-groups-hsc';
            const topics = [
                {
                    title: 'বাংলা সাহিত্য',
                    description: 'গদ্য ও পদ্য অধ্যায় সমূহ',
                    route: classLabel === 'SSC' ? 'bangla-ssc-shahitto' : 'bangla-hsc-shahitto',
                    active: true
                },
                {
                    title: 'সহপাঠ',
                    description: 'নাটক ও উপন্যাস ভিত্তিক পাঠ',
                    route: classLabel === 'SSC' ? 'bangla-ssc-shohopath' : 'bangla-hsc-shohopath',
                    active: true
                }
            ];

            return (
                <AdminShell
                    title="বাংলা ১ম পত্র"
                    subtitle={\`\${classLabel} শ্রেণির পাঠ তালিকা নির্বাচন করুন।\`}
                    activeTab="classes"
                    onNavigate={onNavigate}
                >
                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => onNavigate(groupRoute)}
                            className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                        >
                            Back
                        </button>
                        <button
                            onClick={() => onNavigate('dashboard')}
                            className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                        >
                            Dashboard
                        </button>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm divide-y font-bangla">
                        {topics.map((topic) => (
                            <button
                                key={topic.title}
                                onClick={() => topic.active && topic.route && onNavigate(topic.route)}
                                className={\`w-full flex items-center justify-between px-5 py-4 text-sm font-semibold transition \${topic.active ? 'text-gray-700 hover:bg-gray-50' : 'text-gray-300 cursor-not-allowed'}\`}
                                disabled={!topic.active}
                            >
                                <div className="text-left">
                                    <div className="text-xs uppercase tracking-[0.2em] text-gray-300">বিষয়</div>
                                    <div className="text-base font-semibold text-gray-900 mt-1">{topic.title}</div>
                                    <p className="text-xs text-gray-500 mt-2">{topic.description}</p>
                                </div>
                                <span className={\`text-xs uppercase tracking-[0.2em] \${topic.active ? 'text-blue-600' : 'text-gray-300'}\`}>Open</span>
                            </button>
                        ))}
                    </div>
                </AdminShell>
            );
        };

        const BanglaShahitto = ({ classLabel, onNavigate }) => {
            const baseRoute = classLabel === 'SSC' ? 'bangla-ssc-1st-paper' : 'bangla-hsc-1st-paper';
            const goddoRoute = classLabel === 'SSC' ? 'bangla-ssc-goddo' : 'bangla-hsc-goddo';
            const poddoRoute = classLabel === 'SSC' ? 'bangla-ssc-poddo' : 'bangla-hsc-poddo';

            return (
                <AdminShell
                    title="বাংলা সাহিত্য"
                    subtitle="গদ্য ও পদ্য অধ্যায় নির্বাচন করুন।"
                    activeTab="classes"
                    onNavigate={onNavigate}
                >
                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => onNavigate(baseRoute)}
                            className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                        >
                            Back
                        </button>
                        <button
                            onClick={() => onNavigate('dashboard')}
                            className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                        >
                            Dashboard
                        </button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 font-bangla">
                        <button
                            onClick={() => onNavigate(goddoRoute)}
                            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 text-left hover:bg-gray-50 transition"
                        >
                            <div className="text-xs uppercase tracking-[0.2em] text-gray-300">ধারা</div>
                            <div className="text-lg font-semibold text-gray-900 mt-2">গদ্য</div>
                            <p className="text-sm text-gray-500 mt-2">গদ্য অধ্যায় সমূহ</p>
                        </button>
                        <button
                            onClick={() => onNavigate(poddoRoute)}
                            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 text-left hover:bg-gray-50 transition"
                        >
                            <div className="text-xs uppercase tracking-[0.2em] text-gray-300">ধারা</div>
                            <div className="text-lg font-semibold text-gray-900 mt-2">পদ্য</div>
                            <p className="text-sm text-gray-500 mt-2">পদ্য অধ্যায় সমূহ</p>
                        </button>
                    </div>
                </AdminShell>
            );
        };

        const BanglaShohopath = ({ classLabel, items, onAddItem, onUpdateItem, onRemoveItem, onSelectItem, onNavigate }) => {
            const baseRoute = classLabel === 'SSC' ? 'bangla-ssc-1st-paper' : 'bangla-hsc-1st-paper';
            const [isModalOpen, setIsModalOpen] = useState(false);
            const [newItemName, setNewItemName] = useState('');
            const [newItemType, setNewItemType] = useState('নাটক');
            const [editingItem, setEditingItem] = useState(null);
            const typeOptions = ['নাটক', 'উপন্যাস'];

            const resetForm = () => {
                setNewItemName('');
                setNewItemType('নাটক');
                setEditingItem(null);
            };

            const handleSave = () => {
                const trimmed = newItemName.trim();
                if (!trimmed) return;
                if (editingItem) {
                    onUpdateItem(editingItem.id, { name: trimmed, type: newItemType });
                } else {
                    const nextId = \`\${Date.now()}-\${Math.random().toString(16).slice(2)}\`;
                    onAddItem({ id: nextId, name: trimmed, type: newItemType });
                }
                resetForm();
                setIsModalOpen(false);
            };

            return (
                <AdminShell
                    title="সহপাঠ"
                    subtitle="নাটক ও উপন্যাসের পাঠ যোগ করুন।"
                    activeTab="classes"
                    onNavigate={onNavigate}
                >
                    <div className="flex flex-wrap gap-3 justify-between items-center">
                        <button
                            onClick={() => onNavigate(baseRoute)}
                            className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                        >
                            Back
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition"
                        >
                            Add
                        </button>
                    </div>

                    <div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-sm divide-y font-bangla">
                        {items.length === 0 && (
                            <div className="px-5 py-4 text-sm text-gray-400">এখনও কোনো সহপাঠ যোগ করা হয়নি।</div>
                        )}
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="w-full flex flex-wrap gap-3 items-center justify-between px-5 py-4 text-sm font-semibold text-gray-700"
                            >
                                <div className="flex flex-col text-left">
                                    <span>{item.name}</span>
                                    <span className="text-xs text-gray-500 mt-1">{item.type}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-semibold">
                                    <button
                                        onClick={() => {
                                            setEditingItem(item);
                                            setNewItemName(item.name);
                                            setNewItemType(item.type);
                                            setIsModalOpen(true);
                                        }}
                                        className="px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                                    >
                                        Rename
                                    </button>
                                    <button
                                        onClick={() => {
                                            const shouldRemove = window.confirm('আপনি কি এই পাঠটি মুছে ফেলতে চান?');
                                            if (shouldRemove) {
                                                onRemoveItem(item.id);
                                            }
                                        }}
                                        className="px-2 py-1 rounded-md border border-red-100 text-red-500 hover:bg-red-50 transition"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => onSelectItem(item)}
                                        className="text-xs uppercase tracking-[0.2em] text-blue-600 hover:text-blue-500 transition"
                                    >
                                        Open
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {isModalOpen && (
                        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center px-4 py-6 z-50">
                            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 font-bangla">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {editingItem ? 'Rename entry' : 'নতুন সহপাঠ যোগ করুন'}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">পাঠের নাম ও ধরণ নির্বাচন করুন।</p>
                                <input
                                    value={newItemName}
                                    onChange={(event) => setNewItemName(event.target.value)}
                                    placeholder="উদাহরণ: সিরাজউদ্দৌলা"
                                    className="mt-4 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                                />
                                <div className="mt-4">
                                    <label className="text-xs uppercase tracking-[0.2em] text-gray-400">ধরণ</label>
                                    <select
                                        value={newItemType}
                                        onChange={(event) => setNewItemType(event.target.value)}
                                        className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                                    >
                                        {typeOptions.map((option) => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mt-5 flex justify-end gap-2">
                                    <button
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            resetForm();
                                        }}
                                        className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition"
                                    >
                                        {editingItem ? 'Update' : 'Add'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </AdminShell>
            );
        };

        const BanglaTextList = ({ classLabel, typeLabel, items, onAddItem, onUpdateItem, onRemoveItem, onSelectItem, onNavigate, showAdd = false, baseRouteOverride }) => {
            const [isModalOpen, setIsModalOpen] = useState(false);
            const [newItem, setNewItem] = useState('');
            const [editingItem, setEditingItem] = useState(null);
            const baseRoute = baseRouteOverride || (classLabel === 'SSC' ? 'bangla-ssc-shahitto' : 'bangla-hsc-shahitto');

            const handleSave = () => {
                const trimmed = newItem.trim();
                if (!trimmed) return;
                if (editingItem) {
                    onUpdateItem(editingItem, trimmed);
                } else {
                    onAddItem(trimmed);
                }
                setNewItem('');
                setEditingItem(null);
                setIsModalOpen(false);
            };

            return (
                <AdminShell
                    title={\`\${typeLabel} পাঠ তালিকা\`}
                    subtitle="পাঠের নাম নির্বাচন করুন।"
                    activeTab="classes"
                    onNavigate={onNavigate}
                >
                    <div className="flex flex-wrap gap-3 justify-between items-center">
                        <button
                            onClick={() => onNavigate(baseRoute)}
                            className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                        >
                            Back
                        </button>
                        {showAdd && (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition"
                            >
                                Add
                            </button>
                        )}
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm divide-y font-bangla">
                        {items.length === 0 && (
                            <div className="px-5 py-4 text-sm text-gray-400">এখনও কোনো পাঠ যোগ করা হয়নি।</div>
                        )}
                        {items.map((item) => (
                            <div
                                key={item}
                                className="w-full flex flex-wrap gap-3 items-center justify-between px-5 py-4 text-sm font-semibold text-gray-700"
                            >
                                <span>{item}</span>
                                <div className="flex items-center gap-2 text-xs font-semibold">
                                    <button
                                        onClick={() => {
                                            setEditingItem(item);
                                            setNewItem(item);
                                            setIsModalOpen(true);
                                        }}
                                        className="px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                                    >
                                        Rename
                                    </button>
                                    <button
                                        onClick={() => {
                                            const shouldRemove = window.confirm('আপনি কি এই পাঠটি মুছে ফেলতে চান?');
                                            if (shouldRemove) {
                                                onRemoveItem(item);
                                            }
                                        }}
                                        className="px-2 py-1 rounded-md border border-red-100 text-red-500 hover:bg-red-50 transition"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => onSelectItem(item)}
                                        className="text-xs uppercase tracking-[0.2em] text-blue-600 hover:text-blue-500 transition"
                                    >
                                        Open
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {isModalOpen && (
                        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center px-4 py-6 z-50">
                            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 font-bangla">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {editingItem ? 'Rename entry' : 'নতুন পাঠ যোগ করুন'}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">পাঠের নাম লিখুন।</p>
                                <input
                                    value={newItem}
                                    onChange={(event) => setNewItem(event.target.value)}
                                    placeholder="উদাহরণ: অপরিচিতা"
                                    className="mt-4 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                                />
                                <div className="mt-5 flex justify-end gap-2">
                                    <button
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            setNewItem('');
                                            setEditingItem(null);
                                        }}
                                        className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition"
                                    >
                                        {editingItem ? 'Update' : 'Add'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </AdminShell>
            );
        };

        const BanglaItemDetail = ({ classLabel, itemName, categoryName, notesByItem, onUpdateNotes, onNavigate }) => {
            const baseRoute = classLabel === 'SSC' ? 'bangla-ssc-1st-paper' : 'bangla-hsc-1st-paper';
            const categoryRoute = classLabel === 'SSC'
                ? (categoryName === 'পদ্য'
                    ? 'bangla-ssc-poddo'
                    : categoryName === 'নাটক' || categoryName === 'উপন্যাস'
                        ? 'bangla-ssc-shohopath'
                        : 'bangla-ssc-goddo')
                : (categoryName === 'পদ্য'
                    ? 'bangla-hsc-poddo'
                    : categoryName === 'নাটক' || categoryName === 'উপন্যাস'
                        ? 'bangla-hsc-shohopath'
                        : 'bangla-hsc-goddo');

            const srijonshilRoute = classLabel === 'SSC' ? 'bangla-ssc-srijonshil-types' : 'bangla-hsc-srijonshil-types';
            const mcqRoute = classLabel === 'SSC' ? 'bangla-ssc-mcq' : 'bangla-hsc-mcq';
            const optionList = [
                {
                    label: 'সৃজনশীল',
                    description: 'জ্ঞান ও অনুধাবন প্রশ্ন যোগ করুন',
                    route: srijonshilRoute
                },
                {
                    label: 'বহুনির্বাচনী',
                    description: 'MCQ প্রশ্ন তৈরি করুন',
                    route: mcqRoute
                }
            ];
            const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
            const [noteInput, setNoteInput] = useState('');
            const [editingNoteIndex, setEditingNoteIndex] = useState(null);
            const noteKey = [classLabel, categoryName || 'general', itemName || ''].join('-');
            const notes = (notesByItem || {})[noteKey] || [];

            const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            const toBanglaNumber = (value) => String(value).split('').map((digit) => banglaDigits[Number(digit)] ?? digit).join('');

            const openNoteModal = (index = null) => {
                setEditingNoteIndex(index);
                setNoteInput(index === null ? '' : notes[index] || '');
                setIsNoteModalOpen(true);
            };

            const handleNoteSave = () => {
                const trimmed = noteInput.trim();
                if (!trimmed) return;
                if (onUpdateNotes) {
                    onUpdateNotes((prev) => {
                        const current = prev && prev[noteKey] ? [...prev[noteKey]] : [];
                        if (editingNoteIndex === null) {
                            current.push(trimmed);
                        } else {
                            current[editingNoteIndex] = trimmed;
                        }
                        return { ...prev, [noteKey]: current };
                    });
                }
                setIsNoteModalOpen(false);
                setNoteInput('');
                setEditingNoteIndex(null);
            };

            return (
                <AdminShell
                    title={null}
                    subtitle={null}
                    activeTab="classes"
                    onNavigate={onNavigate}
                >
                    <div className="flex flex-col gap-2 font-bangla">
                    <div className="flex flex-wrap gap-3 justify-between items-center">
                        <button
                            onClick={() => onNavigate(categoryRoute)}
                            className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                        >
                            Back
                        </button>
                        <button
                            onClick={() => onNavigate(baseRoute)}
                            className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                        >
                            Subjects
                        </button>
                    </div>

                    <div className="text-center">
                        <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900">
                            {itemName || 'পাঠ নির্বাচন করুন'}
                        </h2>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        {optionList.map((option) => (
                            <button
                                key={option.label}
                                onClick={() => option.route && onNavigate(option.route)}
                                className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 text-left hover:bg-gray-50 transition"
                            >
                                <div className="text-xs uppercase tracking-[0.2em] text-gray-300">ধরণ</div>
                                <div className="text-lg font-semibold text-gray-900 mt-2">{option.label}</div>
                                <p className="text-sm text-gray-500 mt-2">{option.description}</p>
                            </button>
                        ))}
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                        <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
                            <div>
                                <div className="text-xs uppercase tracking-[0.2em] text-gray-300">নোটস</div>
                                <div className="text-sm font-semibold text-gray-700 mt-1">গুরুত্বপূর্ণ লাইন সংযুক্ত করুন</div>
                            </div>
                            <button
                                onClick={() => openNoteModal()}
                                className="px-3 py-2 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                            >
                                নোট যোগ করুন
                            </button>
                        </div>
                        <ul className="divide-y">
                            {notes.length === 0 && (
                                <li className="px-4 py-3 text-sm text-gray-400">এখনো কোন নোট যুক্ত হয়নি।</li>
                            )}
                            {notes.map((note, index) => (
                                <li key={\`\${noteKey}-\${index}\`} className="px-4 py-3 flex items-start gap-3">
                                    <span className="text-sm font-semibold text-gray-500">
                                        {toBanglaNumber(index + 1)}.
                                    </span>
                                    <div className="flex-1 text-sm text-gray-700">{note}</div>
                                    <button
                                        onClick={() => openNoteModal(index)}
                                        className="text-gray-400 hover:text-gray-600 transition"
                                        title="নোট সম্পাদনা করুন"
                                    >
                                        ✎
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    </div>

                    {isNoteModalOpen && (
                        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center px-4 py-6 z-50">
                            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 font-bangla">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {editingNoteIndex === null ? 'নোট যোগ করুন' : 'নোট সম্পাদনা করুন'}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">গুরুত্বপূর্ণ লাইন লিখুন।</p>
                                <textarea
                                    value={noteInput}
                                    onChange={(event) => setNoteInput(event.target.value)}
                                    placeholder="উদাহরণ: পাঠের মূল বক্তব্য..."
                                    className="mt-4 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[120px]"
                                />
                                <div className="mt-5 flex justify-end gap-2">
                                    <button
                                        onClick={() => {
                                            setIsNoteModalOpen(false);
                                            setNoteInput('');
                                            setEditingNoteIndex(null);
                                        }}
                                        className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleNoteSave}
                                        className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </AdminShell>
            );
        };

        const SrijonshilTypeList = ({
            classLabel,
            itemName,
            onSelectType,
            onNavigate,
            itemRoute,
            questionRoute,
            title,
            subtitle
        }) => {
            const resolvedItemRoute = itemRoute || (classLabel === 'SSC' ? 'bangla-ssc-item' : 'bangla-hsc-item');
            const resolvedQuestionRoute =
                questionRoute || (classLabel === 'SSC' ? 'bangla-ssc-srijonshil-questions' : 'bangla-hsc-srijonshil-questions');
            const types = [
                { key: 'gyan', label: 'জ্ঞান (ক)', description: 'জ্ঞানমূলক প্রশ্ন যোগ করুন' },
                { key: 'onudhabon', label: 'অনুধাবন (খ)', description: 'অনুধাবনমূলক প্রশ্ন যোগ করুন' }
            ];

            return (
                <AdminShell
                    title={title || 'সৃজনশীল প্রশ্ন'}
                    subtitle={subtitle || \`\${itemName} অধ্যায়ের প্রশ্নের ধরন নির্বাচন করুন।\`}
                    activeTab="classes"
                    onNavigate={onNavigate}
                >
                    <div className="flex justify-between items-center font-bangla">
                        <button
                            onClick={() => onNavigate(resolvedItemRoute)}
                            className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                        >
                            Back
                        </button>
                        <button
                            onClick={() => onNavigate('dashboard')}
                            className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                        >
                            Dashboard
                        </button>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2 font-bangla">
                        {types.map((type) => (
                            <button
                                key={type.key}
                                onClick={() => {
                                    onSelectType(type);
                                    onNavigate(resolvedQuestionRoute);
                                }}
                                className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 text-left hover:bg-gray-50 transition"
                            >
                                <div className="text-xs uppercase tracking-[0.2em] text-gray-300">ধরণ</div>
                                <div className="text-lg font-semibold text-gray-900 mt-2">{type.label}</div>
                                <p className="text-sm text-gray-500 mt-2">{type.description}</p>
                            </button>
                        ))}
                    </div>
                </AdminShell>
            );
        };

        const SrijonshilQuestionList = ({
            classLabel,
            itemName,
            typeLabel,
            questions,
            onAdd,
            onUpdate,
            onDelete,
            onNavigate,
            typeRoute
        }) => {
            const resolvedTypeRoute = typeRoute || (classLabel === 'SSC' ? 'bangla-ssc-srijonshil-types' : 'bangla-hsc-srijonshil-types');
            const [isModalOpen, setIsModalOpen] = useState(false);
            const [questionInput, setQuestionInput] = useState('');
            const [answerInput, setAnswerInput] = useState('');
            const [editingIndex, setEditingIndex] = useState(null);
            const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            const toBanglaNumber = (value) => String(value).split('').map((digit) => banglaDigits[Number(digit)] ?? digit).join('');

            const resetForm = () => {
                setQuestionInput('');
                setAnswerInput('');
                setEditingIndex(null);
            };

            const handleSave = () => {
                const trimmedQuestion = questionInput.trim();
                const trimmedAnswer = answerInput.trim();
                if (!trimmedQuestion || !trimmedAnswer) return;
                if (editingIndex === null) {
                    onAdd({ question: trimmedQuestion, answer: trimmedAnswer });
                } else {
                    onUpdate(editingIndex, { question: trimmedQuestion, answer: trimmedAnswer });
                }
                resetForm();
                setIsModalOpen(false);
            };

            return (
                <AdminShell
                    title={typeLabel}
                    subtitle={\`\${itemName} অধ্যায়ের প্রশ্ন যোগ করুন।\`}
                    activeTab="classes"
                    onNavigate={onNavigate}
                >
                    <div className="flex flex-wrap gap-3 justify-between items-center font-bangla">
                        <button
                            onClick={() => onNavigate(resolvedTypeRoute)}
                            className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                        >
                            Back
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition"
                        >
                            প্রশ্ন যোগ করুন
                        </button>
                    </div>

                    <div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-sm divide-y font-bangla">
                        {questions.length === 0 && (
                            <div className="px-5 py-4 text-sm text-gray-400">এখনো কোন প্রশ্ন যোগ করা হয়নি।</div>
                        )}
                        {questions.map((entry, index) => (
                            <div key={\`\${entry.question}-\${index}\`} className="px-5 py-4">
                                <div className="flex flex-wrap gap-3 items-start justify-between">
                                    <div className="flex-1">
                                        <div className="text-sm font-semibold text-gray-800">
                                            {toBanglaNumber(index + 1)}. {entry.question}
                                        </div>
                                        <details className="mt-2 text-sm text-gray-600">
                                            <summary className="cursor-pointer text-blue-600">উত্তর দেখুন</summary>
                                            <div className="mt-2 border-l-2 border-blue-100 pl-3 text-gray-700">
                                                {entry.answer}
                                            </div>
                                        </details>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-semibold">
                                        <button
                                            onClick={() => {
                                                setEditingIndex(index);
                                                setQuestionInput(entry.question);
                                                setAnswerInput(entry.answer);
                                                setIsModalOpen(true);
                                            }}
                                            className="px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                const shouldRemove = window.confirm('আপনি কি এই প্রশ্নটি মুছে ফেলতে চান?');
                                                if (shouldRemove) {
                                                    onDelete(index);
                                                }
                                            }}
                                            className="px-2 py-1 rounded-md border border-red-100 text-red-500 hover:bg-red-50 transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {isModalOpen && (
                        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center px-4 py-6 z-50">
                            <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 font-bangla">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {editingIndex === null ? 'নতুন প্রশ্ন যোগ করুন' : 'প্রশ্ন সম্পাদনা করুন'}
                                </h3>
                                <div className="mt-4">
                                    <label className="text-xs uppercase tracking-[0.2em] text-gray-400">প্রশ্ন</label>
                                    <textarea
                                        value={questionInput}
                                        onChange={(event) => setQuestionInput(event.target.value)}
                                        placeholder="প্রশ্ন লিখুন"
                                        className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[100px]"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label className="text-xs uppercase tracking-[0.2em] text-gray-400">উত্তর</label>
                                    <textarea
                                        value={answerInput}
                                        onChange={(event) => setAnswerInput(event.target.value)}
                                        placeholder="উত্তর লিখুন"
                                        className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[100px]"
                                    />
                                </div>
                                <div className="mt-5 flex justify-end gap-2">
                                    <button
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            resetForm();
                                        }}
                                        className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </AdminShell>
            );
        };

        const McqQuestionList = ({ classLabel, itemName, questions, onAdd, onUpdate, onDelete, onNavigate, itemRoute }) => {
            const backRoute = itemRoute || (classLabel === 'SSC' ? 'bangla-ssc-item' : 'bangla-hsc-item');
            const [isModalOpen, setIsModalOpen] = useState(false);
            const [questionInput, setQuestionInput] = useState('');
            const [optionsInput, setOptionsInput] = useState(['', '', '', '']);
            const [answerIndex, setAnswerIndex] = useState(0);
            const [editingIndex, setEditingIndex] = useState(null);
            const optionLabels = ['ক', 'খ', 'গ', 'ঘ'];
            const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            const toBanglaNumber = (value) => String(value).split('').map((digit) => banglaDigits[Number(digit)] ?? digit).join('');

            const resetForm = () => {
                setQuestionInput('');
                setOptionsInput(['', '', '', '']);
                setAnswerIndex(0);
                setEditingIndex(null);
            };

            const handleSave = () => {
                const trimmedQuestion = questionInput.trim();
                const trimmedOptions = optionsInput.map((option) => option.trim());
                if (!trimmedQuestion || trimmedOptions.some((option) => !option)) return;
                const payload = { question: trimmedQuestion, options: trimmedOptions, answerIndex };
                if (editingIndex === null) {
                    onAdd(payload);
                } else {
                    onUpdate(editingIndex, payload);
                }
                resetForm();
                setIsModalOpen(false);
            };

            return (
                <AdminShell
                    title="বহুনির্বাচনী"
                    subtitle={\`\${itemName} অধ্যায়ের MCQ যোগ করুন।\`}
                    activeTab="classes"
                    onNavigate={onNavigate}
                >
                    <div className="flex flex-wrap gap-3 justify-between items-center font-bangla">
                        <button
                            onClick={() => onNavigate(backRoute)}
                            className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                        >
                            Back
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition"
                        >
                            MCQ যোগ করুন
                        </button>
                    </div>

                    <div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-sm divide-y font-bangla">
                        {questions.length === 0 && (
                            <div className="px-5 py-4 text-sm text-gray-400">এখনো কোন MCQ যোগ করা হয়নি।</div>
                        )}
                        {questions.map((entry, index) => (
                            <div key={\`\${entry.question}-\${index}\`} className="px-5 py-4">
                                <div className="flex flex-wrap gap-3 items-start justify-between">
                                    <div className="flex-1">
                                        <div className="text-sm font-semibold text-gray-800">
                                            {toBanglaNumber(index + 1)}. {entry.question}
                                        </div>
                                        <div className="mt-2 grid gap-1 text-sm text-gray-600">
                                            {entry.options.map((option, optionIndex) => (
                                                <div key={\`\${option}-\${optionIndex}\`}>
                                                    {optionLabels[optionIndex]}. {option}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-2 text-sm text-gray-700">
                                            উত্তর: {optionLabels[entry.answerIndex]}। {entry.options[entry.answerIndex]}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-semibold">
                                        <button
                                            onClick={() => {
                                                setEditingIndex(index);
                                                setQuestionInput(entry.question);
                                                setOptionsInput(entry.options);
                                                setAnswerIndex(entry.answerIndex);
                                                setIsModalOpen(true);
                                            }}
                                            className="px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                const shouldRemove = window.confirm('আপনি কি এই MCQ মুছে ফেলতে চান?');
                                                if (shouldRemove) {
                                                    onDelete(index);
                                                }
                                            }}
                                            className="px-2 py-1 rounded-md border border-red-100 text-red-500 hover:bg-red-50 transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {isModalOpen && (
                        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center px-4 py-6 z-50">
                            <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 font-bangla">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {editingIndex === null ? 'নতুন MCQ যোগ করুন' : 'MCQ সম্পাদনা করুন'}
                                </h3>
                                <div className="mt-4">
                                    <label className="text-xs uppercase tracking-[0.2em] text-gray-400">প্রশ্ন</label>
                                    <textarea
                                        value={questionInput}
                                        onChange={(event) => setQuestionInput(event.target.value)}
                                        placeholder="প্রশ্ন লিখুন"
                                        className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[80px]"
                                    />
                                </div>
                                <div className="mt-4 grid gap-3">
                                    {optionsInput.map((option, optionIndex) => (
                                        <div key={\`option-\${optionIndex}\`} className="flex flex-col gap-1">
                                            <label className="text-xs uppercase tracking-[0.2em] text-gray-400">
                                                অপশন {optionLabels[optionIndex]}
                                            </label>
                                            <input
                                                value={option}
                                                onChange={(event) => {
                                                    const nextOptions = [...optionsInput];
                                                    nextOptions[optionIndex] = event.target.value;
                                                    setOptionsInput(nextOptions);
                                                }}
                                                placeholder={\`অপশন \${optionLabels[optionIndex]}\`}
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4">
                                    <label className="text-xs uppercase tracking-[0.2em] text-gray-400">সঠিক উত্তর</label>
                                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-600">
                                        {optionLabels.map((label, optionIndex) => (
                                            <label key={label} className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="mcq-answer"
                                                    checked={answerIndex === optionIndex}
                                                    onChange={() => setAnswerIndex(optionIndex)}
                                                />
                                                {label}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-5 flex justify-end gap-2">
                                    <button
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            resetForm();
                                        }}
                                        className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </AdminShell>
            );
        };

        const IctChapterList = ({ chapters, onAdd, onUpdate, onDelete, onSelect, onNavigate }) => {
            const [isModalOpen, setIsModalOpen] = useState(false);
            const [chapterName, setChapterName] = useState('');
            const [editingChapter, setEditingChapter] = useState(null);

            const resetForm = () => {
                setChapterName('');
                setEditingChapter(null);
            };

            const handleSave = () => {
                const trimmed = chapterName.trim();
                if (!trimmed) return;
                if (editingChapter) {
                    onUpdate(editingChapter.id, trimmed);
                } else {
                    const nextId = \`\${Date.now()}-\${Math.random().toString(16).slice(2)}\`;
                    onAdd({ id: nextId, name: trimmed });
                }
                resetForm();
                setIsModalOpen(false);
            };

            return (
                <AdminShell
                    title="SSC ICT"
                    subtitle="আইসিটি অধ্যায় যোগ করুন এবং MCQ তৈরি করুন।"
                    activeTab="classes"
                    onNavigate={onNavigate}
                >
                    <div className="flex flex-wrap gap-3 justify-between items-center font-bangla">
                        <button
                            onClick={() => onNavigate('admin-groups-ssc')}
                            className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                        >
                            Back
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition"
                        >
                            অধ্যায় যোগ করুন
                        </button>
                    </div>

                    <div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-sm divide-y font-bangla">
                        {chapters.length === 0 && (
                            <div className="px-5 py-4 text-sm text-gray-400">এখনো কোন অধ্যায় যোগ করা হয়নি।</div>
                        )}
                        {chapters.map((chapter) => (
                            <div
                                key={chapter.id}
                                className="w-full flex flex-wrap gap-3 items-center justify-between px-5 py-4 text-sm font-semibold text-gray-700"
                            >
                                <span>{chapter.name}</span>
                                <div className="flex items-center gap-2 text-xs font-semibold">
                                    <button
                                        onClick={() => {
                                            setEditingChapter(chapter);
                                            setChapterName(chapter.name);
                                            setIsModalOpen(true);
                                        }}
                                        className="px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                                    >
                                        Rename
                                    </button>
                                    <button
                                        onClick={() => {
                                            const shouldRemove = window.confirm('আপনি কি এই অধ্যায়টি মুছে ফেলতে চান?');
                                            if (shouldRemove) {
                                                onDelete(chapter.id);
                                            }
                                        }}
                                        className="px-2 py-1 rounded-md border border-red-100 text-red-500 hover:bg-red-50 transition"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => onSelect(chapter)}
                                        className="text-xs uppercase tracking-[0.2em] text-blue-600 hover:text-blue-500 transition"
                                    >
                                        MCQ যোগ করুন
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {isModalOpen && (
                        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center px-4 py-6 z-50">
                            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 font-bangla">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {editingChapter ? 'অধ্যায় সম্পাদনা করুন' : 'নতুন অধ্যায় যোগ করুন'}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">আইসিটি অধ্যায়ের নাম লিখুন।</p>
                                <input
                                    value={chapterName}
                                    onChange={(event) => setChapterName(event.target.value)}
                                    placeholder="উদাহরণ: তথ্য ও যোগাযোগ প্রযুক্তি"
                                    className="mt-4 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                                />
                                <div className="mt-5 flex justify-end gap-2">
                                    <button
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            resetForm();
                                        }}
                                        className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </AdminShell>
            );
        };

        const ScienceChapterList = ({ subjectLabel, chapters, onAdd, onUpdate, onDelete, onSelect, onNavigate }) => {
            const [isModalOpen, setIsModalOpen] = useState(false);
            const [chapterName, setChapterName] = useState('');
            const [editingChapter, setEditingChapter] = useState(null);

            const resetForm = () => {
                setChapterName('');
                setEditingChapter(null);
            };

            const handleSave = () => {
                const trimmed = chapterName.trim();
                if (!trimmed) return;
                if (editingChapter) {
                    onUpdate(editingChapter.id, trimmed);
                } else {
                    const nextId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
                    onAdd({ id: nextId, name: trimmed, topics: [] });
                }
                resetForm();
                setIsModalOpen(false);
            };

            return (
                <AdminShell
                    title={`SSC ${subjectLabel}`}
                    subtitle={`${subjectLabel} অধ্যায় যোগ করুন এবং টপিক সেট করুন।`}
                    activeTab="classes"
                    onNavigate={onNavigate}
                >
                    <div className="flex flex-wrap gap-3 justify-between items-center font-bangla">
                        <button
                            onClick={() => onNavigate('admin-groups-ssc')}
                            className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                        >
                            Back
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition"
                        >
                            অধ্যায় যোগ করুন
                        </button>
                    </div>

                    <div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-sm divide-y font-bangla">
                        {chapters.length === 0 && (
                            <div className="px-5 py-4 text-sm text-gray-400">এখনো কোন অধ্যায় যোগ করা হয়নি।</div>
                        )}
                        {chapters.map((chapter) => (
                            <div key={chapter.id} className="px-5 py-4">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <div className="text-sm font-semibold text-gray-900">{chapter.name}</div>
                                        <div className="text-xs text-gray-400 mt-1">
                                            টপিক: {(chapter.topics || []).length}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-semibold">
                                        <button
                                            onClick={() => {
                                                setEditingChapter(chapter);
                                                setChapterName(chapter.name);
                                                setIsModalOpen(true);
                                            }}
                                            className="px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                const shouldRemove = window.confirm('আপনি কি এই অধ্যায়টি মুছে ফেলতে চান?');
                                                if (shouldRemove) {
                                                    onDelete(chapter.id);
                                                }
                                            }}
                                            className="px-2 py-1 rounded-md border border-red-100 text-red-500 hover:bg-red-50 transition"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => onSelect(chapter)}
                                            className="text-xs uppercase tracking-[0.2em] text-blue-600 hover:text-blue-500 transition"
                                        >
                                            Open
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {isModalOpen && (
                        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center px-4 py-6 z-50">
                            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 font-bangla">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {editingChapter ? 'অধ্যায় সম্পাদনা করুন' : 'নতুন অধ্যায় যোগ করুন'}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">অধ্যায়ের নাম লিখুন।</p>
                                <input
                                    value={chapterName}
                                    onChange={(event) => setChapterName(event.target.value)}
                                    placeholder="উদাহরণ: অধ্যায় ১"
                                    className="mt-4 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                                />
                                <div className="mt-5 flex justify-end gap-2">
                                    <button
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            resetForm();
                                        }}
                                        className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </AdminShell>
            );
        };

        const ScienceTopicList = ({
            subjectLabel,
            chapter,
            onAddTopic,
            onUpdateTopic,
            onDeleteTopic,
            onSelectTopic,
            onBack,
            onNavigate
        }) => {
            const [isModalOpen, setIsModalOpen] = useState(false);
            const [topicName, setTopicName] = useState('');
            const [editingTopic, setEditingTopic] = useState(null);
            const topics = chapter?.topics || [];

            const resetForm = () => {
                setTopicName('');
                setEditingTopic(null);
            };

            const handleSave = () => {
                const trimmed = topicName.trim();
                if (!trimmed || !chapter) return;
                if (editingTopic) {
                    onUpdateTopic(chapter.id, editingTopic.id, trimmed);
                } else {
                    const nextId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
                    onAddTopic(chapter.id, { id: nextId, name: trimmed });
                }
                resetForm();
                setIsModalOpen(false);
            };

            return (
                <AdminShell
                    title={`${subjectLabel} টপিকসমূহ`}
                    subtitle={`${chapter?.name || 'অধ্যায়'} এর টপিক নির্বাচন করুন।`}
                    activeTab="classes"
                    onNavigate={onNavigate}
                >
                    <div className="flex flex-wrap gap-3 justify-between items-center font-bangla">
                        <button
                            onClick={onBack}
                            className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                        >
                            Back
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition"
                        >
                            টপিক যোগ করুন
                        </button>
                    </div>

                    <div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-sm divide-y font-bangla">
                        {topics.length === 0 && (
                            <div className="px-5 py-4 text-sm text-gray-400">এখনো কোন টপিক যোগ করা হয়নি।</div>
                        )}
                        {topics.map((topic) => (
                            <div key={topic.id} className="px-5 py-4">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div className="text-sm font-semibold text-gray-900">{topic.name}</div>
                                    <div className="flex items-center gap-2 text-xs font-semibold">
                                        <button
                                            onClick={() => {
                                                setEditingTopic(topic);
                                                setTopicName(topic.name);
                                                setIsModalOpen(true);
                                            }}
                                            className="px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                const shouldRemove = window.confirm('আপনি কি এই টপিকটি মুছে ফেলতে চান?');
                                                if (shouldRemove && chapter) {
                                                    onDeleteTopic(chapter.id, topic.id);
                                                }
                                            }}
                                            className="px-2 py-1 rounded-md border border-red-100 text-red-500 hover:bg-red-50 transition"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => onSelectTopic(topic)}
                                            className="text-xs uppercase tracking-[0.2em] text-blue-600 hover:text-blue-500 transition"
                                        >
                                            Open
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {isModalOpen && (
                        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center px-4 py-6 z-50">
                            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 font-bangla">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {editingTopic ? 'টপিক সম্পাদনা করুন' : 'নতুন টপিক যোগ করুন'}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">টপিকের নাম লিখুন।</p>
                                <input
                                    value={topicName}
                                    onChange={(event) => setTopicName(event.target.value)}
                                    placeholder="উদাহরণ: বল এবং গতি"
                                    className="mt-4 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                                />
                                <div className="mt-5 flex justify-end gap-2">
                                    <button
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            resetForm();
                                        }}
                                        className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </AdminShell>
            );
        };

        const ScienceTopicDetail = ({
            subjectLabel,
            chapter,
            topic,
            noteKey,
            notesByItem,
            onUpdateNotes,
            onBack,
            onNavigateCq,
            onNavigateMcq,
            onNavigate
        }) => {
            const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
            const [noteInput, setNoteInput] = useState('');
            const [editingNoteIndex, setEditingNoteIndex] = useState(null);
            const notes = (notesByItem || {})[noteKey] || [];
            const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            const toBanglaNumber = (value) => String(value).split('').map((digit) => banglaDigits[Number(digit)] ?? digit).join('');

            const openNoteModal = (index = null) => {
                setEditingNoteIndex(index);
                setNoteInput(index === null ? '' : notes[index] || '');
                setIsNoteModalOpen(true);
            };

            const handleNoteSave = () => {
                const trimmed = noteInput.trim();
                if (!trimmed) return;
                if (onUpdateNotes) {
                    onUpdateNotes((prev) => {
                        const current = prev && prev[noteKey] ? [...prev[noteKey]] : [];
                        if (editingNoteIndex === null) {
                            current.push(trimmed);
                        } else {
                            current[editingNoteIndex] = trimmed;
                        }
                        return { ...prev, [noteKey]: current };
                    });
                }
                setIsNoteModalOpen(false);
                setNoteInput('');
                setEditingNoteIndex(null);
            };

            return (
                <AdminShell
                    title={`${subjectLabel} • ${topic?.name || 'টপিক'}`}
                    subtitle={chapter?.name ? `অধ্যায়: ${chapter.name}` : 'টপিকের তথ্য যোগ করুন।'}
                    activeTab="classes"
                    onNavigate={onNavigate}
                >
                    <div className="flex flex-wrap gap-3 justify-between items-center font-bangla">
                        <button
                            onClick={onBack}
                            className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                        >
                            Back
                        </button>
                        <button
                            onClick={() => onNavigate('dashboard')}
                            className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                        >
                            Dashboard
                        </button>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2 font-bangla">
                        <button
                            onClick={onNavigateCq}
                            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 text-left hover:bg-gray-50 transition"
                        >
                            <div className="text-xs uppercase tracking-[0.2em] text-gray-300">ধরণ</div>
                            <div className="text-lg font-semibold text-gray-900 mt-2">সৃজনশীল (CQ)</div>
                            <p className="text-sm text-gray-500 mt-2">জ্ঞান ও অনুধাবন প্রশ্ন যোগ করুন</p>
                        </button>
                        <button
                            onClick={onNavigateMcq}
                            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 text-left hover:bg-gray-50 transition"
                        >
                            <div className="text-xs uppercase tracking-[0.2em] text-gray-300">ধরণ</div>
                            <div className="text-lg font-semibold text-gray-900 mt-2">বহুনির্বাচনী (MCQ)</div>
                            <p className="text-sm text-gray-500 mt-2">MCQ প্রশ্ন তৈরি করুন</p>
                        </button>
                    </div>

                    <div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
                        <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
                            <div>
                                <div className="text-xs uppercase tracking-[0.2em] text-gray-300">নোটস</div>
                                <div className="text-sm font-semibold text-gray-700 mt-1">টপিকের মূল তথ্য যোগ করুন</div>
                            </div>
                            <button
                                onClick={() => openNoteModal()}
                                className="px-3 py-2 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                            >
                                নোট যোগ করুন
                            </button>
                        </div>
                        <ul className="divide-y">
                            {notes.length === 0 && (
                                <li className="px-4 py-3 text-sm text-gray-400">এখনো কোন নোট যোগ করা হয়নি।</li>
                            )}
                            {notes.map((note, index) => (
                                <li key={`${noteKey}-${index}`} className="px-4 py-3 flex items-start gap-3">
                                    <span className="text-sm font-semibold text-gray-500">
                                        {toBanglaNumber(index + 1)}.
                                    </span>
                                    <div className="flex-1 text-sm text-gray-700">{note}</div>
                                    <button
                                        onClick={() => openNoteModal(index)}
                                        className="text-gray-400 hover:text-gray-600 transition"
                                        title="নোট সম্পাদনা করুন"
                                    >
                                        ✎
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {isNoteModalOpen && (
                        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center px-4 py-6 z-50">
                            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 font-bangla">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {editingNoteIndex === null ? 'নোট যোগ করুন' : 'নোট সম্পাদনা করুন'}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">গুরুত্বপূর্ণ তথ্য লিখুন।</p>
                                <textarea
                                    value={noteInput}
                                    onChange={(event) => setNoteInput(event.target.value)}
                                    placeholder="উদাহরণ: অধ্যায়ের মূল সূত্র..."
                                    className="mt-4 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[120px]"
                                />
                                <div className="mt-5 flex justify-end gap-2">
                                    <button
                                        onClick={() => {
                                            setIsNoteModalOpen(false);
                                            setNoteInput('');
                                            setEditingNoteIndex(null);
                                        }}
                                        className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleNoteSave}
                                        className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </AdminShell>
            );
        };

        const EnglishFirstPaperHome = ({ classLabel, onNavigate }) => {
            const groupRoute = classLabel === 'SSC' ? 'admin-groups-ssc' : 'admin-groups-hsc';
            const readingRoute = classLabel === 'SSC' ? 'english-ssc-reading' : 'english-hsc-reading';
            const writingRoute = classLabel === 'SSC' ? 'english-ssc-writing' : 'english-hsc-writing';

            return (
                <AdminShell
                    title="English 1st Paper"
                    subtitle={\`\${classLabel} section overview for Reading and Writing.\`}
                    activeTab="classes"
                    onNavigate={onNavigate}
                >
                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => onNavigate(groupRoute)}
                            className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                        >
                            Back
                        </button>
                        <button
                            onClick={() => onNavigate('dashboard')}
                            className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                        >
                            Dashboard
                        </button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <button
                            onClick={() => onNavigate(readingRoute)}
                            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 text-left hover:bg-gray-50 transition"
                        >
                            <div className="text-xs uppercase tracking-[0.2em] text-gray-400">Section</div>
                            <div className="text-lg font-semibold text-gray-900 mt-2">Reading</div>
                            <p className="text-sm text-gray-500 mt-2">MCQ, comprehension, and passage-based tasks.</p>
                        </button>
                        <button
                            onClick={() => onNavigate(writingRoute)}
                            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 text-left hover:bg-gray-50 transition"
                        >
                            <div className="text-xs uppercase tracking-[0.2em] text-gray-400">Section</div>
                            <div className="text-lg font-semibold text-gray-900 mt-2">Writing</div>
                            <p className="text-sm text-gray-500 mt-2">Paragraphs, stories, letters, and analysis tasks.</p>
                        </button>
                    </div>
                </AdminShell>
            );
        };

        const EnglishSectionList = ({ title, subtitle, items, onBack, onSelect, onNavigate }) => (
            <AdminShell title={title} subtitle={subtitle} activeTab="classes" onNavigate={onNavigate}>
                <div className="flex justify-between items-center">
                    <button
                        onClick={onBack}
                        className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                    >
                        Back
                    </button>
                    <button
                        onClick={() => onNavigate('dashboard')}
                        className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                    >
                        Dashboard
                    </button>
                </div>
                <div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-sm divide-y">
                    {items.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => onSelect(item)}
                            className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                        >
                            <div className="text-left space-y-1">
                                <div className="text-xs uppercase tracking-[0.2em] text-gray-400">Question Type</div>
                                <div className="text-base font-semibold text-gray-900">{item.label}</div>
                                {item.description && <p className="text-xs text-gray-500">{item.description}</p>}
                                {item.children?.length > 0 && (
                                    <p className="text-xs text-blue-500">Includes {item.children.map((child) => child.label).join(', ')}</p>
                                )}
                            </div>
                            <span className="text-xs uppercase tracking-[0.2em] text-blue-600">Open</span>
                        </button>
                    ))}
                    {items.length === 0 && (
                        <div className="px-5 py-4 text-sm text-gray-400">No question types configured yet.</div>
                    )}
                </div>
            </AdminShell>
        );

        const EnglishQuestionList = ({ title, subtitle, questions, onAdd, onUpdate, onDelete, onBack, onNavigate }) => {
            const [questionInput, setQuestionInput] = useState('');
            const [answerInput, setAnswerInput] = useState('');
            const [editingIndex, setEditingIndex] = useState(null);
            const [isModalOpen, setIsModalOpen] = useState(false);

            const resetForm = () => {
                setQuestionInput('');
                setAnswerInput('');
                setEditingIndex(null);
            };

            const handleSave = () => {
                const trimmedQuestion = questionInput.trim();
                const trimmedAnswer = answerInput.trim();
                if (!trimmedQuestion || !trimmedAnswer) return;
                if (editingIndex === null) {
                    onAdd({ question: trimmedQuestion, answer: trimmedAnswer });
                } else {
                    onUpdate(editingIndex, { question: trimmedQuestion, answer: trimmedAnswer });
                }
                resetForm();
                setIsModalOpen(false);
            };

            return (
                <AdminShell title={title} subtitle={subtitle} activeTab="classes" onNavigate={onNavigate}>
                    <div className="flex flex-wrap gap-3 justify-between items-center">
                        <button
                            onClick={onBack}
                            className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                        >
                            Back
                        </button>
                        <button
                            onClick={() => {
                                resetForm();
                                setIsModalOpen(true);
                            }}
                            className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition"
                        >
                            Add Question
                        </button>
                    </div>

                    <div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-sm divide-y">
                        {questions.length === 0 && (
                            <div className="px-5 py-4 text-sm text-gray-400">No questions added yet.</div>
                        )}
                        {questions.map((entry, index) => (
                            <div key={index} className="px-5 py-4 text-sm text-gray-700 space-y-2">
                                <div className="font-semibold text-gray-900">Q{index + 1}. {entry.question}</div>
                                <div className="text-sm text-gray-600">Answer: {entry.answer}</div>
                                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                                    <button
                                        onClick={() => {
                                            setEditingIndex(index);
                                            setQuestionInput(entry.question);
                                            setAnswerInput(entry.answer);
                                            setIsModalOpen(true);
                                        }}
                                        className="px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            const shouldDelete = window.confirm('Delete this question?');
                                            if (shouldDelete) {
                                                onDelete(index);
                                            }
                                        }}
                                        className="px-2 py-1 rounded-md border border-red-100 text-red-500 hover:bg-red-50 transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {isModalOpen && (
                        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center px-4 py-6 z-50">
                            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {editingIndex === null ? 'Add question' : 'Update question'}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">Provide the question prompt and answer.</p>
                                <textarea
                                    value={questionInput}
                                    onChange={(event) => setQuestionInput(event.target.value)}
                                    placeholder="Question prompt"
                                    rows={3}
                                    className="mt-4 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                                />
                                <textarea
                                    value={answerInput}
                                    onChange={(event) => setAnswerInput(event.target.value)}
                                    placeholder="Answer"
                                    rows={3}
                                    className="mt-4 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                                />
                                <div className="mt-5 flex justify-end gap-2">
                                    <button
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            resetForm();
                                        }}
                                        className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </AdminShell>
            );
        };
`;
