export const adminComponents = `
        /* --- API HELPERS --- */
        const api = {
            get: (url) => fetch(url).then(r => r.json()),
            post: (url, body) => fetch(url, { method: 'POST', body: JSON.stringify(body) }),
            put: (url, body) => fetch(url, { method: 'PUT', body: JSON.stringify(body) }),
            // Generic update for name/title
            update: (type, id, value) => fetch('/api/request', { method: 'PUT', body: JSON.stringify({ type, id, value }) }),
            // Generic delete
            del: (type, id) => fetch('/api/request', { method: 'DELETE', body: JSON.stringify({ type, id }) })
        };

        /* --- UI COMPONENTS --- */
        const EditModal = ({ title, value, onSave, onDelete, onClose }) => {
            const [val, setVal] = useState(value);
            const [processing, setProcessing] = useState(false);

            const handleSave = async () => {
                if (val === value) return onClose(); // No change
                setProcessing(true);
                await onSave(val);
                setProcessing(false);
                onClose();
            };

            const handleDelete = async () => {
                if (confirm('Are you sure you want to delete this?')) {
                    setProcessing(true);
                    await onDelete();
                    setProcessing(false);
                    onClose();
                }
            };

            return (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={onClose}>
                    <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-5 w-80 animate-fade-in" onClick={e => e.stopPropagation()}>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">{title}</h4>
                        <input 
                            className="w-full border border-gray-300 rounded-lg p-3 text-sm mb-6 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                            value={val} 
                            onChange={e => setVal(e.target.value)} 
                            autoFocus 
                            disabled={processing}
                        />
                        <div className="flex justify-between items-center">
                            {onDelete ? (
                                <button onClick={handleDelete} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" disabled={processing}>
                                    <i className="fas fa-trash"></i>
                                </button>
                            ) : <div></div>}
                            <div className="flex gap-2">
                                <button onClick={onClose} className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" disabled={processing}>Cancel</button>
                                <button onClick={handleSave} className="px-4 py-2 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2" disabled={processing}>
                                    {processing && <i className="fas fa-spinner fa-spin"></i>} Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        const TableCell = ({ value, onUpdate, onDelete, label }) => {
            const [isEditing, setIsEditing] = useState(false);
            return (
                <>
                    <div 
                        onClick={() => setIsEditing(true)} 
                        className="cursor-pointer hover:bg-blue-50/50 px-3 py-2 -mx-3 rounded-lg transition-all border border-transparent hover:border-blue-100 group flex justify-between items-center h-full min-h-[32px]"
                    >
                        <span className="truncate font-medium text-gray-700">{value}</span>
                        <i className="fas fa-pen text-[10px] text-gray-300 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                    </div>
                    {isEditing && (
                        <EditModal 
                            title={\`Edit \${label}\`} 
                            value={value} 
                            onClose={() => setIsEditing(false)} 
                            onSave={onUpdate} 
                            onDelete={onDelete} 
                        />
                    )}
                </>
            );
        };

        /* --- MAIN DASHBOARD --- */
        function AdminDashboard({ user, logout }) {
            const [activeTab, setActiveTab] = useState('classes');
            
            return (
                <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] bg-gray-50/50">
                    {/* Desktop Sidebar */}
                    <div className="hidden md:flex flex-col w-64 bg-white border-r sticky top-16 h-[calc(100vh-64px)] shadow-sm z-10">
                        <div className="p-4 space-y-1 mt-2">
                            <AdminNavItem icon="fas fa-sitemap" label="Structure" sub="(Classes & Structure)" active={activeTab === 'classes'} onClick={() => setActiveTab('classes')} />
                            <AdminNavItem icon="fas fa-box-open" label="Content" sub="(Questions & Notes)" active={activeTab === 'content'} onClick={() => setActiveTab('content')} />
                            <div className="h-px bg-gray-100 my-2"></div>
                            <AdminNavItem icon="fas fa-cogs" label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                        </div>
                        <div className="mt-auto p-4 border-t bg-gray-50/50">
                            <button onClick={logout} className="flex items-center text-red-600 text-xs font-bold hover:text-red-700 transition">
                                <i className="fas fa-sign-out-alt mr-2"></i> Log Out
                            </button>
                        </div>
                    </div>

                    {/* Mobile Nav */}
                    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50 flex justify-around p-2 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                        <MobileNavItem icon="fas fa-sitemap" label="Structure" active={activeTab === 'classes'} onClick={() => setActiveTab('classes')} />
                        <MobileNavItem icon="fas fa-box-open" label="Content" active={activeTab === 'content'} onClick={() => setActiveTab('content')} />
                        <MobileNavItem icon="fas fa-cogs" label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-4 md:p-8 w-full overflow-x-hidden pb-24 md:pb-8">
                        {activeTab === 'classes' && <ClassStructureManager />}
                        {activeTab === 'content' && <ContentManagerLanding />}
                        {activeTab === 'settings' && <SettingsManager />}
                    </div>
                </div>
            );
        }

        const AdminNavItem = ({ icon, label, sub, active, onClick }) => (
            <button onClick={onClick} className={\`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 \${active ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}\`}>
                <div className={\`w-8 h-8 rounded-lg flex items-center justify-center mr-3 \${active ? 'bg-white text-blue-600 shadow-sm' : 'bg-gray-100 text-gray-400'}\`}>
                    <i className={icon}></i>
                </div>
                <div className="text-left">
                    <div className="leading-none">{label}</div>
                    {sub && <div className="text-[10px] font-normal opacity-60 mt-0.5">{sub}</div>}
                </div>
            </button>
        );
        const MobileNavItem = ({ icon, label, active, onClick }) => (
            <button onClick={onClick} className={\`flex flex-col items-center p-2 rounded-lg transition-all \${active ? 'text-blue-600 bg-blue-50' : 'text-gray-400'}\`}>
                <i className={\`\${icon} text-lg mb-1\`}></i><span className="text-[10px] font-medium">{label}</span>
            </button>
        );

        /* --- 1. CLASS & STRUCTURE MANAGEMENT --- */
        function ClassStructureManager() {
            const [classes, setClasses] = useState([]);
            const [isModalOpen, setIsModalOpen] = useState(false);
            const [selectedClass, setSelectedClass] = useState(null);
            const [linkModalClass, setLinkModalClass] = useState(null);

            const loadData = async () => { setClasses(await api.get('/api/classes')); };
            useEffect(() => { loadData(); }, []);

            const handleCreate = async (name) => { await api.post('/api/classes', { name }); setIsModalOpen(false); await loadData(); };
            const handleUpdate = async (id, val) => { await api.update('class', id, val); await loadData(); };
            const handleDelete = async (id) => { await api.del('class', id); await loadData(); };
            
            const handleLinkSave = async (parentId, label) => {
                await api.put('/api/classes', { id: linkModalClass.id, parent_class_id: parentId, program_label: label });
                setLinkModalClass(null); 
                await loadData();
            };

            if (selectedClass) return <StructureDetail cls={selectedClass} onBack={() => setSelectedClass(null)} />;

            return (
                <div className="w-full max-w-6xl mx-auto animate-fade-in">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Academic Structure</h2>
                            <p className="text-sm text-gray-500">Manage your hierarchy (Class > Group > Subject > Chapter)</p>
                        </div>
                        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 transition-all active:scale-95"><i className="fas fa-plus"></i></button>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 w-20">ID</th>
                                    <th className="px-6 py-4">Class Name</th>
                                    <th className="px-6 py-4 w-48 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {classes.map(c => (
                                    <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-gray-400 font-mono text-xs">#{c.id}</td>
                                        <td className="px-6 py-4">
                                            <TableCell label="Class" value={c.name} onUpdate={(v) => handleUpdate(c.id, v)} onDelete={() => handleDelete(c.id)} />
                                            {c.parent_class_id && <div className="text-[10px] text-orange-600 mt-1 font-medium bg-orange-50 inline-block px-2 py-0.5 rounded border border-orange-100"><i className="fas fa-link mr-1"></i>Linked: {c.parent_name}</div>}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                <button onClick={() => setLinkModalClass(c)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-colors" title="Link Content"><i className="fas fa-link"></i></button>
                                                {!c.parent_class_id && <button onClick={() => setSelectedClass(c)} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors border border-blue-100">Manage</button>}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {classes.length === 0 && <div className="p-8 text-center text-gray-400 italic">No classes found. Add one to get started.</div>}
                    </div>
                    
                    {isModalOpen && <SimpleInputModal title="New Class" onClose={() => setIsModalOpen(false)} onSave={handleCreate} />}
                    {linkModalClass && <LinkClassModal cls={linkModalClass} allClasses={classes} onClose={() => setLinkModalClass(null)} onSave={handleLinkSave} />}
                </div>
            );
        }

        function StructureDetail({ cls, onBack }) {
            const [groups, setGroups] = useState([]);
            const [subjects, setSubjects] = useState([]);
            const [modal, setModal] = useState(null);
            const [selSubject, setSelSubject] = useState(null);

            const loadData = async () => {
                const [g, s] = await Promise.all([api.get(\`/api/groups?class_id=\${cls.id}\`), api.get(\`/api/subjects?class_id=\${cls.id}\`)]);
                setGroups(g); setSubjects(s);
            };
            useEffect(() => { loadData(); }, [cls]);

            const handleCreateGroup = async (name) => { await api.post('/api/groups', { name, class_id: cls.id }); setModal(null); await loadData(); };
            const handleUpdateGroup = async (id, v) => { await api.update('group', id, v); await loadData(); };
            const handleDeleteGroup = async (id) => { await api.del('group', id); await loadData(); };

            const handleCreateSubject = async (data) => { await api.post('/api/subjects', { ...data, class_id: cls.id }); setModal(null); await loadData(); };
            const handleUpdateSubject = async (id, v) => { await api.update('subject', id, v); await loadData(); };
            const handleDeleteSubject = async (id) => { await api.del('subject', id); await loadData(); };

            if (selSubject) return <ChapterStructureManager subject={selSubject} onBack={() => setSelSubject(null)} />;

            return (
                <div className="w-full max-w-7xl mx-auto animate-fade-in">
                    <div className="flex items-center mb-6">
                        <button onClick={onBack} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-300 mr-3 shadow-sm transition-all"><i className="fas fa-arrow-left"></i></button>
                        <h2 className="text-xl font-bold text-gray-800">{cls.name} <span className="text-gray-400 mx-2">/</span> Structure</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* GROUPS COLUMN */}
                        <div className="lg:col-span-1">
                            <div className="flex justify-between items-end mb-3 px-1">
                                <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">Groups</h3>
                                <button onClick={() => setModal('group')} className="text-blue-600 hover:bg-blue-50 w-6 h-6 rounded flex items-center justify-center transition-colors"><i className="fas fa-plus"></i></button>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                                <table className="w-full text-sm">
                                    <tbody className="divide-y divide-gray-100">
                                        {groups.map(g => (
                                            <tr key={g.id} className="hover:bg-gray-50/50">
                                                <td className="px-4 py-3"><TableCell label="Group Name" value={g.name} onUpdate={v => handleUpdateGroup(g.id, v)} onDelete={() => handleDeleteGroup(g.id)} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {groups.length === 0 && <div className="p-4 text-center text-xs text-gray-400">No groups defined.</div>}
                            </div>
                        </div>

                        {/* SUBJECTS COLUMN */}
                        <div className="lg:col-span-2">
                            <div className="flex justify-between items-end mb-3 px-1">
                                <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">Subjects</h3>
                                <button onClick={() => setModal('subject')} className="text-blue-600 hover:bg-blue-50 w-6 h-6 rounded flex items-center justify-center transition-colors"><i className="fas fa-plus"></i></button>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50/50 border-b border-gray-100 text-xs text-gray-400">
                                        <tr><th className="px-4 py-2 font-medium">Name</th><th className="px-4 py-2 font-medium">Group</th><th className="px-4 py-2 text-right"></th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {subjects.map(s => (
                                            <tr key={s.id} className="hover:bg-gray-50/50">
                                                <td className="px-4 py-3 font-medium"><TableCell label="Subject" value={s.name} onUpdate={v => handleUpdateSubject(s.id, v)} onDelete={() => handleDeleteSubject(s.id)} /></td>
                                                <td className="px-4 py-3 text-xs text-gray-500">{s.is_common ? 'Common' : groups.find(g => g.id == s.group_id)?.name || '-'}</td>
                                                <td className="px-4 py-3 text-right"><button onClick={() => setSelSubject(s)} className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded text-xs font-bold transition-colors">Chapters <i className="fas fa-chevron-right ml-1 text-[10px]"></i></button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {subjects.length === 0 && <div className="p-8 text-center text-xs text-gray-400">No subjects defined.</div>}
                            </div>
                        </div>
                    </div>
                    {modal === 'group' && <SimpleInputModal title="Add Group" onClose={() => setModal(null)} onSave={handleCreateGroup} />}
                    {modal === 'subject' && <CreateSubjectModal groups={groups} onClose={() => setModal(null)} onSave={handleCreateSubject} />}
                </div>
            );
        }

        function ChapterStructureManager({ subject, onBack }) {
            const [chapters, setChapters] = useState([]);
            const [isModalOpen, setIsModalOpen] = useState(false);
            const [selChapter, setSelChapter] = useState(null);

            const loadData = async () => { setChapters(await api.get(\`/api/chapters?subject_id=\${subject.id}\`)); };
            useEffect(() => { loadData(); }, [subject]);

            const handleCreate = async (data) => { await api.post('/api/chapters', { ...data, subject_id: subject.id, order_num: data.order || chapters.length + 1 }); setIsModalOpen(false); await loadData(); };
            const handleUpdate = async (id, v) => { await api.update('chapter', id, v); await loadData(); };
            const handleDelete = async (id) => { await api.del('chapter', id); await loadData(); };

            if (selChapter) return <TopicStructureManager chapter={selChapter} onBack={() => setSelChapter(null)} />;

            return (
                <div className="w-full max-w-4xl mx-auto animate-fade-in">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <button onClick={onBack} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-300 mr-3 shadow-sm transition-all"><i className="fas fa-arrow-left"></i></button>
                            <h2 className="text-xl font-bold text-gray-800">{subject.name} <span className="text-gray-400 mx-2">/</span> Chapters</h2>
                        </div>
                        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center hover:bg-blue-700 shadow-md transition-colors"><i className="fas fa-plus"></i></button>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50/50 border-b border-gray-100 text-xs text-gray-400"><tr><th className="px-6 py-3 w-16">#</th><th className="px-6 py-3">Chapter Title</th><th className="px-6 py-3 text-right"></th></tr></thead>
                            <tbody className="divide-y divide-gray-100">
                                {chapters.map(c => (
                                    <tr key={c.id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-3 text-gray-400 font-mono text-xs">{c.order_num}</td>
                                        <td className="px-6 py-3 font-medium"><TableCell label="Chapter" value={c.title} onUpdate={v => handleUpdate(c.id, v)} onDelete={() => handleDelete(c.id)} /></td>
                                        <td className="px-6 py-3 text-right"><button onClick={() => setSelChapter(c)} className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded text-xs font-bold transition-colors">Topics <i className="fas fa-chevron-right ml-1 text-[10px]"></i></button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {chapters.length === 0 && <div className="p-8 text-center text-gray-400 italic">No chapters added yet.</div>}
                    </div>
                    {isModalOpen && <CreateChapterModal onClose={() => setIsModalOpen(false)} onSave={handleCreate} />}
                </div>
            );
        }

        function TopicStructureManager({ chapter, onBack }) {
            const [topics, setTopics] = useState([]);
            const [isModalOpen, setIsModalOpen] = useState(false);

            const loadData = async () => { setTopics(await api.get(\`/api/topics?chapter_id=\${chapter.id}\`)); };
            useEffect(() => { loadData(); }, [chapter]);

            const handleCreate = async (title) => { await api.post('/api/topics', { title, content: '', chapter_id: chapter.id, order_num: topics.length + 1 }); setIsModalOpen(false); await loadData(); };
            const handleUpdate = async (id, v) => { await api.update('topic', id, v); await loadData(); };
            const handleDelete = async (id) => { await api.del('topic', id); await loadData(); };

            return (
                <div className="w-full max-w-4xl mx-auto animate-fade-in">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <button onClick={onBack} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-300 mr-3 shadow-sm transition-all"><i className="fas fa-arrow-left"></i></button>
                            <h2 className="text-xl font-bold text-gray-800">{chapter.title} <span className="text-gray-400 mx-2">/</span> Topics</h2>
                        </div>
                        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center hover:bg-blue-700 shadow-md transition-colors"><i className="fas fa-plus"></i></button>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50/50 border-b border-gray-100 text-xs text-gray-400"><tr><th className="px-6 py-3">Topic Title</th><th className="px-6 py-3 text-right w-32">Status</th></tr></thead>
                            <tbody className="divide-y divide-gray-100">
                                {topics.map(t => (
                                    <tr key={t.id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-3 font-medium"><TableCell label="Topic" value={t.title} onUpdate={v => handleUpdate(t.id, v)} onDelete={() => handleDelete(t.id)} /></td>
                                        <td className="px-6 py-3 text-right text-xs text-gray-400"><span className="bg-gray-100 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider">Created</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {topics.length === 0 && <div className="p-8 text-center text-gray-400 italic">No topics defined yet.</div>}
                    </div>
                    {isModalOpen && <SimpleInputModal title="New Topic" onClose={() => setIsModalOpen(false)} onSave={handleCreate} />}
                </div>
            );
        }

        /* --- 2. CONTENT MANAGER --- */
        function ContentManagerLanding() {
            const [classes, setClasses] = useState([]);
            const [selectedClass, setSelectedClass] = useState(null);
            
            useEffect(() => { api.get('/api/classes').then(setClasses); }, []);

            if (selectedClass) return <ContentClassView cls={selectedClass} onBack={() => setSelectedClass(null)} />;

            return (
                <div className="w-full max-w-5xl mx-auto animate-fade-in">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Content Manager</h2>
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="p-4 bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wide">Select Class</div>
                        <div className="divide-y divide-gray-100">
                            {classes.map(c => (
                                <div key={c.id} onClick={() => setSelectedClass(c)} className="p-4 flex justify-between items-center hover:bg-blue-50/50 cursor-pointer transition group">
                                    <span className="font-medium text-gray-700 group-hover:text-blue-700">{c.name}</span>
                                    <i className="fas fa-chevron-right text-gray-300 group-hover:text-blue-400"></i>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }

        function ContentClassView({ cls, onBack }) {
            const [subjects, setSubjects] = useState([]);
            const [selSubject, setSelSubject] = useState(null);
            
            useEffect(() => { api.get(\`/api/subjects?class_id=\${cls.id}\`).then(setSubjects); }, [cls]);

            if (selSubject) return <ContentSubjectView subject={selSubject} onBack={() => setSelSubject(null)} />;

            return (
                <div className="w-full max-w-6xl mx-auto animate-fade-in">
                    <div className="flex items-center mb-6">
                        <button onClick={onBack} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-300 mr-3 shadow-sm transition-all"><i className="fas fa-arrow-left"></i></button>
                        <h2 className="text-xl font-bold text-gray-800">{cls.name} <span className="text-gray-400 mx-2">/</span> Subjects</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {subjects.map(s => (
                            <div key={s.id} onClick={() => setSelSubject(s)} className="bg-white border border-gray-200 p-5 rounded-xl hover:border-blue-400 hover:shadow-md cursor-pointer transition-all group">
                                <h3 className="font-bold text-gray-800 group-hover:text-blue-700">{s.name}</h3>
                                <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
                                    <span>Manage Content</span>
                                    <i className="fas fa-arrow-right opacity-0 group-hover:opacity-100 transition-opacity text-blue-500"></i>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        function ContentSubjectView({ subject, onBack }) {
            const [chapters, setChapters] = useState([]);
            const [activeChapter, setActiveChapter] = useState(null);
            const [topics, setTopics] = useState([]);
            const [selTopic, setSelTopic] = useState(null);

            useEffect(() => { api.get(\`/api/chapters?subject_id=\${subject.id}\`).then(setChapters); }, [subject]);
            
            const loadTopics = async (ch) => { 
                setActiveChapter(ch); 
                setTopics(await api.get(\`/api/topics?chapter_id=\${ch.id}\`)); 
            };

            if (selTopic) return <TopicContentEditor topic={selTopic} onBack={() => setSelTopic(null)} />;

            return (
                <div className="w-full flex flex-col md:flex-row gap-6 h-[calc(100vh-140px)] animate-fade-in">
                    <div className="w-full md:w-64 bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col shadow-sm">
                        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center">
                            <button onClick={onBack} className="mr-3 text-gray-400 hover:text-gray-700"><i className="fas fa-arrow-left"></i></button>
                            <span className="font-bold text-xs uppercase text-gray-500 tracking-wider">Chapters</span>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {chapters.map(c => (
                                <button 
                                    key={c.id} 
                                    onClick={() => loadTopics(c)} 
                                    className={\`w-full text-left px-4 py-3 text-sm border-b border-gray-50 transition-colors \${activeChapter?.id === c.id ? 'bg-blue-50 text-blue-700 font-bold border-l-4 border-l-blue-600' : 'hover:bg-gray-50 text-gray-700'}\`}
                                >
                                    {c.title}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm p-6 overflow-y-auto">
                        {!activeChapter ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-300">
                                <i className="fas fa-book-open text-4xl mb-4"></i>
                                <span className="text-sm font-medium">Select a chapter to manage topics.</span>
                            </div>
                        ) : (
                            <>
                                <h3 className="font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100 flex items-center">
                                    <span className="text-gray-400 mr-2">{activeChapter.title} /</span> Topics
                                </h3>
                                <div className="space-y-3">
                                    {topics.map(t => (
                                        <div key={t.id} onClick={() => setSelTopic(t)} className="flex justify-between items-center p-4 border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 cursor-pointer group transition-all">
                                            <span className="font-medium text-sm text-gray-700">{t.title}</span>
                                            <span className="text-xs text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center bg-blue-100 px-2 py-1 rounded">
                                                Edit Content <i className="fas fa-pen ml-1.5"></i>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                {topics.length === 0 && <div className="text-center text-gray-400 text-sm py-12">No topics found in this chapter.</div>}
                            </>
                        )}
                    </div>
                </div>
            );
        }

        function TopicContentEditor({ topic, onBack }) {
            const [content, setContent] = useState(topic.content || '');
            const [questions, setQuestions] = useState([]);
            const [activeTab, setActiveTab] = useState('notes');
            const [isQModalOpen, setIsQModalOpen] = useState(false);
            const [isSavingNote, setIsSavingNote] = useState(false);

            const loadQs = async () => { setQuestions(await api.get(\`/api/questions?topic_id=\${topic.id}\`)); };
            useEffect(() => { loadQs(); }, [topic]);
            
            const saveNotes = async () => { 
                setIsSavingNote(true);
                await api.post('/api/topics', { ...topic, content, order_num: topic.order_num }); 
                setIsSavingNote(false);
                alert('Content saved successfully!'); 
            };
            
            const addQuestion = async (data) => { 
                await api.post('/api/questions', { ...data, topic_id: topic.id }); 
                setIsQModalOpen(false); 
                await loadQs(); 
            };
            
            const delQuestion = async (id) => { 
                if(confirm('Delete question?')) {
                    await api.del('question', id); 
                    await loadQs(); 
                }
            };

            return (
                <div className="w-full h-full flex flex-col animate-fade-in">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <button onClick={onBack} className="text-gray-400 hover:text-blue-600 mr-3 transition-colors"><i className="fas fa-arrow-left"></i></button>
                            <h2 className="text-lg font-bold text-gray-800">{topic.title}</h2>
                        </div>
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                            <button onClick={() => setActiveTab('notes')} className={\`px-4 py-1.5 text-xs font-bold rounded-md transition-all \${activeTab === 'notes' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}\`}>Notes</button>
                            <button onClick={() => setActiveTab('questions')} className={\`px-4 py-1.5 text-xs font-bold rounded-md transition-all \${activeTab === 'questions' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}\`}>Questions ({questions.length})</button>
                        </div>
                    </div>
                    {activeTab === 'notes' ? (
                        <div className="flex-1 flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                            <textarea 
                                className="flex-1 w-full border-none outline-none resize-none font-mono text-sm p-6 leading-relaxed" 
                                placeholder="# Write content in Markdown...\\n\\n- Use bullet points\\n- Bold text for emphasis" 
                                value={content} 
                                onChange={e => setContent(e.target.value)}
                            ></textarea>
                            <div className="bg-gray-50 border-t border-gray-100 p-4 flex justify-end">
                                <button onClick={saveNotes} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm transition-all disabled:opacity-70" disabled={isSavingNote}>
                                    {isSavingNote ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-save mr-2"></i>} Save Content
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                                <h3 className="font-bold text-xs text-gray-500 uppercase tracking-wide">Question Bank</h3>
                                <button onClick={() => setIsQModalOpen(true)} className="bg-blue-600 text-white text-xs px-4 py-2 rounded-lg hover:bg-blue-700 font-bold transition-colors"><i className="fas fa-plus mr-1.5"></i> Add Question</button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/30">
                                {questions.map((q, i) => (
                                    <div key={q.id} className="p-4 bg-white border border-gray-200 rounded-xl relative group shadow-sm hover:border-blue-300 transition-all">
                                        <div className="flex justify-between mb-2">
                                            <span className={\`text-[10px] font-bold px-2 py-0.5 rounded uppercase \${q.type === 'MCQ' ? 'bg-indigo-50 text-indigo-600' : 'bg-purple-50 text-purple-600'}\`}>{q.type}</span>
                                            <div className="flex gap-3 items-center">
                                                <span className="text-[10px] font-mono text-gray-400">{q.metadata?.board}</span>
                                                <button onClick={() => delQuestion(q.id)} className="text-gray-300 hover:text-red-500 transition-colors"><i className="fas fa-trash"></i></button>
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium text-gray-800 leading-snug">{q.question_text}</p>
                                    </div>
                                ))}
                                {questions.length === 0 && <div className="text-center text-gray-400 text-sm py-12 flex flex-col items-center"><i className="fas fa-clipboard-question text-3xl mb-3 opacity-20"></i>No questions added yet.</div>}
                            </div>
                        </div>
                    )}
                    {isQModalOpen && <CreateQuestionModal onClose={() => setIsQModalOpen(false)} onSave={addQuestion} />}
                </div>
            );
        }

        /* --- MODALS --- */
        function SimpleInputModal({ title, onClose, onSave }) {
            const [val, setVal] = useState('');
            return <Modal isOpen={true} onClose={onClose} title={title}><Input value={val} onChange={e => setVal(e.target.value)} autoFocus /><div className="flex justify-end mt-4"><Button size="md" onClick={() => onSave(val)}>Save</Button></div></Modal>;
        }
        function CreateSubjectModal({ groups, onClose, onSave }) {
            const [name, setName] = useState(''); const [isCommon, setIsCommon] = useState(true); const [groupId, setGroupId] = useState('');
            return <Modal isOpen={true} onClose={onClose} title="Add Subject"><div className="mb-3"><Input label="Name" value={name} onChange={e => setName(e.target.value)} autoFocus /></div><div className="flex gap-2 mb-3"><input type="checkbox" checked={isCommon} onChange={e => setIsCommon(e.target.checked)} /><label className="text-sm">Common</label></div>{!isCommon && <select className="w-full border p-2 rounded text-sm" value={groupId} onChange={e => setGroupId(e.target.value)}><option value="">Select Group</option>{groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}</select>}<div className="flex justify-end mt-4"><Button size="md" onClick={() => onSave({ name, is_common: isCommon, group_id: groupId })}>Save</Button></div></Modal>;
        }
        function CreateChapterModal({ onClose, onSave }) {
            const [title, setTitle] = useState(''); const [order, setOrder] = useState('');
            return <Modal isOpen={true} onClose={onClose} title="Add Chapter"><div className="flex gap-2 mb-3"><div className="w-20"><Input label="#" type="number" value={order} onChange={e => setOrder(e.target.value)} /></div><div className="flex-1"><Input label="Title" value={title} onChange={e => setTitle(e.target.value)} autoFocus /></div></div><div className="flex justify-end mt-4"><Button size="md" onClick={() => onSave({ title, order })}>Save</Button></div></Modal>;
        }
        function CreateQuestionModal({ onClose, onSave }) {
            const [type, setType] = useState('MCQ'); const [text, setText] = useState(''); const [options, setOptions] = useState(['', '', '', '']); const [answer, setAnswer] = useState(''); const [board, setBoard] = useState(''); const [year, setYear] = useState('');
            const updateOption = (i, v) => { const n = [...options]; n[i] = v; setOptions(n); };
            return <Modal isOpen={true} onClose={onClose} title="Add Question"><div className="flex gap-2 mb-3 border-b pb-2"><button onClick={() => setType('MCQ')} className={\`px-3 py-1 rounded text-xs font-bold \${type==='MCQ'?'bg-blue-100 text-blue-700':'text-gray-500'}\`}>MCQ</button><button onClick={() => setType('CQ')} className={\`px-3 py-1 rounded text-xs font-bold \${type==='CQ'?'bg-blue-100 text-blue-700':'text-gray-500'}\`}>CQ</button></div><div className="flex gap-2 mb-3"><div className="flex-1"><Input label="Board" value={board} onChange={e => setBoard(e.target.value)} /></div><div className="w-24"><Input label="Year" value={year} onChange={e => setYear(e.target.value)} /></div></div><div className="mb-3"><label className="block text-xs font-bold mb-1">Question</label><textarea className="w-full border p-2 rounded text-sm h-20" value={text} onChange={e => setText(e.target.value)}></textarea></div>{type === 'MCQ' ? <div className="space-y-2 mb-3">{options.map((o, i) => <div key={i} className="flex items-center gap-2"><span className="text-xs font-bold w-4">{String.fromCharCode(65+i)}</span><input className="flex-1 border p-1.5 rounded text-sm" value={o} onChange={e => updateOption(i, e.target.value)} /><input type="radio" name="ans" checked={answer===o && o!==''} onChange={() => setAnswer(o)} /></div>)}</div> : <div className="mb-3"><label className="block text-xs font-bold mb-1">Answer Key</label><textarea className="w-full border p-2 rounded text-sm h-20" value={answer} onChange={e => setAnswer(e.target.value)}></textarea></div>}<div className="flex justify-end mt-4"><Button size="md" onClick={() => onSave({ type, question_text: text, options: type==='MCQ'?options:[], answer, metadata: { board, year } })}>Save</Button></div></Modal>;
        }
        
        function LinkClassModal({ cls, allClasses, onClose, onSave }) {
            const [parentId, setParentId] = useState(cls.parent_class_id || '');
            const [label, setLabel] = useState(cls.program_label || '');
            return (
                <Modal isOpen={true} onClose={onClose} title="Content Linking">
                    <div className="bg-blue-50 p-3 rounded mb-4 text-blue-800 text-xs"><i className="fas fa-info-circle mr-1"></i>Link <strong>{cls.name}</strong> to use content from another class.</div>
                    <div className="mb-4"><label className="block text-xs font-bold text-gray-700 mb-1">Source Class</label><select className="w-full border p-2 rounded text-sm bg-white" value={parentId} onChange={e => setParentId(e.target.value)}><option value="">-- Independent (No Link) --</option>{allClasses.filter(c => c.id !== cls.id).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                    {parentId && <Input label="Label (e.g. SSC)" value={label} onChange={e => setLabel(e.target.value)} />}
                    <div className="flex justify-end mt-4 gap-2"><Button variant="ghost" onClick={onClose}>Cancel</Button><Button size="md" onClick={() => onSave(parentId, label)}>Save</Button></div>
                </Modal>
            );
        }

        function SettingsManager() {
            const handleReset = async () => { if (confirm("Permanently delete ALL data?")) { await fetch('/api/reset-db', { method: 'POST' }); window.location.reload(); } };
            return <div className="max-w-xl bg-white p-6 rounded shadow-sm border border-red-100"><h2 className="text-lg font-bold mb-4">Danger Zone</h2><Button variant="danger" size="sm" onClick={handleReset}>Reset Database</Button></div>;
        }
`;


