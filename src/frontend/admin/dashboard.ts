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
            const banglaRoute = classLabel === 'SSC' ? 'bangla-ssc-1st-paper' : 'bangla-hsc-1st-paper';

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
                            const displayLabel = isBanglaFirst ? 'বাংলা ১ম পত্র' : subject;
                            if (!isBanglaFirst) {
                                return (
                                    <div key={subject} className="px-5 py-4 text-sm font-semibold text-gray-700">
                                        {displayLabel}
                                    </div>
                                );
                            }
                            return (
                                <button
                                    key={subject}
                                    onClick={() => onNavigate(banglaRoute)}
                                    className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                                >
                                    <span className="font-bangla">{displayLabel}</span>
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
                                <button
                                    onClick={() => onSelectItem(item)}
                                    className="flex flex-col text-left hover:text-gray-900 transition"
                                >
                                    <span>{item.name}</span>
                                    <span className="text-xs text-gray-500 mt-1">{item.type}</span>
                                </button>
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
                                    <span className="text-xs uppercase tracking-[0.2em] text-blue-600">Open</span>
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
                                <button
                                    onClick={() => onSelectItem(item)}
                                    className="hover:text-gray-900 transition"
                                >
                                    {item}
                                </button>
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
                                    <span className="text-xs uppercase tracking-[0.2em] text-blue-600">Open</span>
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

        const BanglaItemDetail = ({ classLabel, itemName, categoryName, onNavigate }) => {
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

            const optionList = ['সৃজনশীল', 'বহুনির্বাচনী'];

            return (
                <AdminShell
                    title="পাঠ বিশ্লেষণ"
                    subtitle="সৃজনশীল ও বহুনির্বাচনী প্রশ্ন তালিকা।"
                    activeTab="classes"
                    onNavigate={onNavigate}
                >
                    <div className="flex flex-wrap gap-3 justify-between items-center font-bangla">
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

                    <div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-sm p-5 font-bangla">
                        <div className="text-xs uppercase tracking-[0.2em] text-gray-300">নির্বাচিত পাঠ</div>
                        <div className="text-lg font-semibold text-gray-900 mt-2">
                            {itemName || 'পাঠ নির্বাচন করুন'}
                        </div>
                        {categoryName && (
                            <div className="text-sm text-gray-500 mt-1">{categoryName} অধ্যায়</div>
                        )}
                    </div>

                    <div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-sm divide-y font-bangla">
                        {optionList.map((option) => (
                            <div key={option} className="px-5 py-4 text-sm font-semibold text-gray-700">
                                {option}
                            </div>
                        ))}
                    </div>
                </AdminShell>
            );
        };
`;
