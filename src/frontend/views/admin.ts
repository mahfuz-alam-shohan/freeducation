export const adminComponents = `
        /* --- API HELPERS (Scoped) --- */
        const adminApi = {
            request: async (url, options = {}) => {
                const response = await fetch(url, {
                    ...options,
                    headers: {
                        'Content-Type': 'application/json',
                        ...(options.headers || {})
                    }
                });
                if (!response.ok) {
                    const message = await response.text().catch(() => '');
                    throw new Error(message || \`Request failed (\${response.status})\`);
                }
                const contentType = response.headers.get('content-type') || '';
                if (contentType.includes('application/json')) {
                    return response.json();
                }
                return response.text();
            },
            get: (url) => adminApi.request(url),
            post: (url, body) => adminApi.request(url, { method: 'POST', body: JSON.stringify(body) }),
            put: (url, body) => adminApi.request(url, { method: 'PUT', body: JSON.stringify(body) }),
            update: (type, id, value) => adminApi.request('/api/request', { method: 'PUT', body: JSON.stringify({ type, id, value }) }),
            del: (type, id) => adminApi.request('/api/request', { method: 'DELETE', body: JSON.stringify({ type, id }) })
        };

        /* --- UI COMPONENTS --- */
        const EditModal = ({ title, value, onSave, onDelete, onClose }) => {
            const [val, setVal] = useState(value);
            const [isSaving, setIsSaving] = useState(false);

            const handleSave = async () => {
                if (val === value) return onClose();
                setIsSaving(true);
                await onSave(val);
                setIsSaving(false);
                onClose();
            };

            const handleDelete = async () => {
                if(confirm('Delete this item?')) {
                    setIsSaving(true);
                    await onDelete();
                    setIsSaving(false);
                    onClose();
                }
            };

            return (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20" onClick={onClose}>
                    <div className="bg-white border border-gray-400 p-4 w-80 shadow-lg" onClick={e => e.stopPropagation()}>
                        <h4 className="font-bold text-sm mb-3">{title}</h4>
                        <input 
                            className="w-full border border-gray-300 p-2 text-sm mb-4 outline-none focus:border-blue-500" 
                            value={val} 
                            onChange={e => setVal(e.target.value)} 
                            autoFocus 
                            disabled={isSaving}
                        />
                        <div className="flex justify-between items-center">
                            {onDelete ? (
                                <button onClick={handleDelete} className="text-red-600 hover:underline text-xs" disabled={isSaving}>Delete</button>
                            ) : <div></div>}
                            <div className="flex gap-2">
                                <button onClick={onClose} className="px-3 py-1 text-xs border border-gray-300 hover:bg-gray-100" disabled={isSaving}>Cancel</button>
                                <button onClick={handleSave} className="px-3 py-1 text-xs bg-blue-600 text-white hover:bg-blue-700" disabled={isSaving}>
                                    {isSaving ? '...' : 'Save'}
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
                        className="cursor-pointer hover:bg-gray-100 px-2 py-1 flex justify-between items-center h-full min-h-[24px]"
                    >
                        <span className="truncate">{value}</span>
                        <i className="fas fa-pencil-alt text-[10px] text-gray-400 opacity-0 group-hover:opacity-100"></i>
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
                <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] bg-white font-sans text-gray-800">
                    <div className="hidden md:flex flex-col w-60 border-r border-gray-300 h-[calc(100vh-64px)] sticky top-16 bg-gray-50">
                        <div className="p-2 space-y-1 mt-2">
                            <AdminNavItem icon="fas fa-sitemap" label="Structure" active={activeTab === 'classes'} onClick={() => setActiveTab('classes')} />
                            <AdminNavItem icon="fas fa-box-open" label="Content" active={activeTab === 'content'} onClick={() => setActiveTab('content')} />
                            <div className="h-px bg-gray-200 my-2"></div>
                            <AdminNavItem icon="fas fa-cogs" label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                        </div>
                        <div className="mt-auto p-2 border-t border-gray-300">
                            <button onClick={logout} className="w-full text-left px-3 py-2 text-red-600 text-xs font-bold hover:bg-red-50 transition-colors">
                                <i className="fas fa-sign-out-alt mr-2"></i> Log Out
                            </button>
                        </div>
                    </div>

                    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 z-50 flex justify-around p-2">
                        <MobileNavItem icon="fas fa-sitemap" label="Structure" active={activeTab === 'classes'} onClick={() => setActiveTab('classes')} />
                        <MobileNavItem icon="fas fa-box-open" label="Content" active={activeTab === 'content'} onClick={() => setActiveTab('content')} />
                        <MobileNavItem icon="fas fa-cogs" label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                    </div>

                    <div className="flex-1 p-4 w-full overflow-x-hidden pb-20 md:pb-4 bg-white">
                        {activeTab === 'classes' && <ClassStructureManager />}
                        {activeTab === 'content' && <ContentManagerLanding />}
                        {activeTab === 'settings' && <SettingsManager />}
                    </div>
                </div>
            );
        }

        const AdminNavItem = ({ icon, label, active, onClick }) => (
            <button onClick={onClick} className={\`w-full flex items-center px-3 py-2 text-sm transition-colors \${active ? 'bg-blue-100 text-blue-800 font-bold border-r-2 border-blue-600' : 'text-gray-700 hover:bg-gray-200'}\`}>
                <i className={\`\${icon} w-5 text-center mr-2 opacity-70\`}></i> {label}
            </button>
        );
        const MobileNavItem = ({ icon, label, active, onClick }) => (
            <button onClick={onClick} className={\`flex flex-col items-center p-1 \${active ? 'text-blue-700' : 'text-gray-500'}\`}>
                <i className={\`\${icon} text-lg mb-1\`}></i><span className="text-[10px]">{label}</span>
            </button>
        );

        /* --- 1. CLASS & STRUCTURE MANAGEMENT --- */
        function ClassStructureManager() {
            const [classes, setClasses] = useState([]);
            const [isModalOpen, setIsModalOpen] = useState(false);
            const [selectedClass, setSelectedClass] = useState(null);
            const [linkModalClass, setLinkModalClass] = useState(null);

            const loadData = async () => { setClasses(await adminApi.get('/api/classes')); };
            useEffect(() => { loadData(); }, []);

            const handleCreate = async (name) => { await adminApi.post('/api/classes', { name }); setIsModalOpen(false); await loadData(); };
            const handleUpdate = async (id, val) => { await adminApi.update('class', id, val); await loadData(); };
            const handleDelete = async (id) => { await adminApi.del('class', id); await loadData(); };
            const handleLinkSave = async (parentId, label) => {
                await adminApi.put('/api/classes', { id: linkModalClass.id, parent_class_id: parentId, program_label: label });
                setLinkModalClass(null); await loadData();
            };

            if (selectedClass) return <StructureDetail cls={selectedClass} onBack={() => setSelectedClass(null)} />;

            return (
                <div className="w-full max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-2">
                        <h2 className="text-lg font-bold text-gray-800">Academic Structure</h2>
                        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white w-6 h-6 flex items-center justify-center hover:bg-blue-700"><i className="fas fa-plus text-xs"></i></button>
                    </div>

                    <div className="border border-gray-300">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-100 border-b border-gray-300 text-xs font-bold text-gray-600">
                                <tr>
                                    <th className="px-4 py-2 w-16 border-r border-gray-300">ID</th>
                                    <th className="px-4 py-2 border-r border-gray-300">Class Name</th>
                                    <th className="px-4 py-2 w-32 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {classes.map(c => (
                                    <tr key={c.id} className="hover:bg-gray-50 group">
                                        <td className="px-4 py-2 text-gray-500 font-mono text-xs border-r border-gray-300">#{c.id}</td>
                                        <td className="px-4 py-2 border-r border-gray-300">
                                            <TableCell label="Class" value={c.name} onUpdate={(v) => handleUpdate(c.id, v)} onDelete={() => handleDelete(c.id)} />
                                            {c.parent_class_id && <div className="text-[10px] text-orange-700 mt-1"><i className="fas fa-link mr-1"></i>Linked: {c.parent_name}</div>}
                                        </td>
                                        <td className="px-4 py-2 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => setLinkModalClass(c)} className="text-gray-500 hover:text-blue-600" title="Link"><i className="fas fa-link"></i></button>
                                                {!c.parent_class_id && <button onClick={() => setSelectedClass(c)} className="text-blue-700 hover:underline text-xs font-bold">Manage</button>}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {classes.length === 0 && <div className="p-4 text-center text-sm text-gray-500">No classes found.</div>}
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
                const [g, s] = await Promise.all([adminApi.get(\`/api/groups?class_id=\${cls.id}\`), adminApi.get(\`/api/subjects?class_id=\${cls.id}\`)]);
                setGroups(g); setSubjects(s);
            };
            useEffect(() => { loadData(); }, [cls]);

            const handleCreateGroup = async (name) => { await adminApi.post('/api/groups', { name, class_id: cls.id }); setModal(null); await loadData(); };
            const handleUpdateGroup = async (id, v) => { await adminApi.update('group', id, v); await loadData(); };
            const handleDeleteGroup = async (id) => { await adminApi.del('group', id); await loadData(); };

            const handleCreateSubject = async (data) => { await adminApi.post('/api/subjects', { ...data, class_id: cls.id }); setModal(null); await loadData(); };
            const handleUpdateSubject = async (id, v) => { await adminApi.update('subject', id, v); await loadData(); };
            const handleDeleteSubject = async (id) => { await adminApi.del('subject', id); await loadData(); };

            if (selSubject) return <ChapterStructureManager subject={selSubject} onBack={() => setSelSubject(null)} />;

            return (
                <div className="w-full max-w-6xl mx-auto">
                    <div className="flex items-center mb-4 pb-2 border-b border-gray-300">
                        <button onClick={onBack} className="mr-2 text-gray-500 hover:text-black"><i className="fas fa-arrow-left"></i></button>
                        <h2 className="text-lg font-bold">{cls.name} / Structure</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1 border border-gray-300 bg-white">
                            <div className="p-2 bg-gray-100 border-b border-gray-300 flex justify-between items-center">
                                <h3 className="font-bold text-xs uppercase text-gray-600">Groups</h3>
                                <button onClick={() => setModal('group')} className="text-blue-600 hover:underline text-xs"><i className="fas fa-plus"></i> Add</button>
                            </div>
                            <table className="w-full text-sm">
                                <tbody className="divide-y divide-gray-200">
                                    {groups.map(g => (
                                        <tr key={g.id} className="hover:bg-gray-50 group">
                                            <td className="px-2 py-2"><TableCell label="Group Name" value={g.name} onUpdate={v => handleUpdateGroup(g.id, v)} onDelete={() => handleDeleteGroup(g.id)} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {groups.length === 0 && <div className="p-2 text-center text-xs text-gray-400">No groups.</div>}
                        </div>

                        <div className="md:col-span-2 border border-gray-300 bg-white">
                            <div className="p-2 bg-gray-100 border-b border-gray-300 flex justify-between items-center">
                                <h3 className="font-bold text-xs uppercase text-gray-600">Subjects</h3>
                                <button onClick={() => setModal('subject')} className="text-blue-600 hover:underline text-xs"><i className="fas fa-plus"></i> Add</button>
                            </div>
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500">
                                    <tr><th className="px-2 py-1 border-r border-gray-200">Name</th><th className="px-2 py-1 border-r border-gray-200">Group</th><th className="px-2 py-1 text-right"></th></tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {subjects.map(s => (
                                        <tr key={s.id} className="hover:bg-gray-50 group">
                                            <td className="px-2 py-2 border-r border-gray-200 font-medium"><TableCell label="Subject" value={s.name} onUpdate={v => handleUpdateSubject(s.id, v)} onDelete={() => handleDeleteSubject(s.id)} /></td>
                                            <td className="px-2 py-2 border-r border-gray-200 text-xs text-gray-500">{s.is_common ? 'Common' : groups.find(g => g.id == s.group_id)?.name || '-'}</td>
                                            <td className="px-2 py-2 text-right"><button onClick={() => setSelSubject(s)} className="text-blue-700 hover:underline text-xs">Chapters</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {subjects.length === 0 && <div className="p-2 text-center text-xs text-gray-400">No subjects.</div>}
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

            const loadData = async () => { setChapters(await adminApi.get(\`/api/chapters?subject_id=\${subject.id}\`)); };
            useEffect(() => { loadData(); }, [subject]);

            const handleCreate = async (data) => { await adminApi.post('/api/chapters', { ...data, subject_id: subject.id, order_num: data.order || chapters.length + 1 }); setIsModalOpen(false); await loadData(); };
            const handleUpdate = async (id, v) => { await adminApi.update('chapter', id, v); await loadData(); };
            const handleDelete = async (id) => { await adminApi.del('chapter', id); await loadData(); };

            if (selChapter) return <TopicStructureManager chapter={selChapter} onBack={() => setSelChapter(null)} />;

            return (
                <div className="w-full max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-2">
                        <div className="flex items-center"><button onClick={onBack} className="text-gray-500 hover:text-black mr-2"><i className="fas fa-arrow-left"></i></button><h2 className="text-lg font-bold">{subject.name} / Chapters</h2></div>
                        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white w-6 h-6 flex items-center justify-center hover:bg-blue-700"><i className="fas fa-plus text-xs"></i></button>
                    </div>
                    <div className="border border-gray-300 bg-white">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-100 border-b border-gray-300 text-xs text-gray-600"><tr><th className="px-4 py-2 w-12 border-r border-gray-300">#</th><th className="px-4 py-2 border-r border-gray-300">Chapter Title</th><th className="px-4 py-2 text-right"></th></tr></thead>
                            <tbody className="divide-y divide-gray-200">
                                {chapters.map(c => (
                                    <tr key={c.id} className="hover:bg-gray-50 group">
                                        <td className="px-4 py-2 text-gray-500 font-mono text-xs border-r border-gray-300">{c.order_num}</td>
                                        <td className="px-4 py-2 border-r border-gray-300 font-medium"><TableCell label="Chapter" value={c.title} onUpdate={v => handleUpdate(c.id, v)} onDelete={() => handleDelete(c.id)} /></td>
                                        <td className="px-4 py-2 text-right"><button onClick={() => setSelChapter(c)} className="text-blue-700 hover:underline text-xs">Topics</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {chapters.length === 0 && <div className="p-4 text-center text-gray-500 italic text-xs">No chapters.</div>}
                    </div>
                    {isModalOpen && <CreateChapterModal onClose={() => setIsModalOpen(false)} onSave={handleCreate} />}
                </div>
            );
        }

        function TopicStructureManager({ chapter, onBack }) {
            const [topics, setTopics] = useState([]);
            const [isModalOpen, setIsModalOpen] = useState(false);

            const loadData = async () => { setTopics(await adminApi.get(\`/api/topics?chapter_id=\${chapter.id}\`)); };
            useEffect(() => { loadData(); }, [chapter]);

            const handleCreate = async (title) => { await adminApi.post('/api/topics', { title, content: '', chapter_id: chapter.id, order_num: topics.length + 1 }); setIsModalOpen(false); await loadData(); };
            const handleUpdate = async (id, v) => { await adminApi.update('topic', id, v); await loadData(); };
            const handleDelete = async (id) => { await adminApi.del('topic', id); await loadData(); };

            return (
                <div className="w-full max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-2">
                        <div className="flex items-center"><button onClick={onBack} className="text-gray-500 hover:text-black mr-2"><i className="fas fa-arrow-left"></i></button><h2 className="text-lg font-bold">{chapter.title} / Topics</h2></div>
                        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white w-6 h-6 flex items-center justify-center hover:bg-blue-700"><i className="fas fa-plus text-xs"></i></button>
                    </div>
                    <div className="border border-gray-300 bg-white">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-100 border-b border-gray-300 text-xs text-gray-600"><tr><th className="px-4 py-2 border-r border-gray-300">Topic Title</th><th className="px-4 py-2 text-right w-24"></th></tr></thead>
                            <tbody className="divide-y divide-gray-200">
                                {topics.map(t => (
                                    <tr key={t.id} className="hover:bg-gray-50 group">
                                        <td className="px-4 py-2 border-r border-gray-300 font-medium"><TableCell label="Topic" value={t.title} onUpdate={v => handleUpdate(t.id, v)} onDelete={() => handleDelete(t.id)} /></td>
                                        <td className="px-4 py-2 text-right text-xs text-gray-400">Created</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {topics.length === 0 && <div className="p-4 text-center text-gray-500 italic text-xs">No topics.</div>}
                    </div>
                    {isModalOpen && <SimpleInputModal title="New Topic" onClose={() => setIsModalOpen(false)} onSave={handleCreate} />}
                </div>
            );
        }

        /* --- 2. CONTENT MANAGER --- */
        function ContentManagerLanding() {
            const [classes, setClasses] = useState([]);
            const [selectedClass, setSelectedClass] = useState(null);
            useEffect(() => { adminApi.get('/api/classes').then(setClasses); }, []);

            if (selectedClass) return <ContentClassView cls={selectedClass} onBack={() => setSelectedClass(null)} />;

            return (
                <div className="w-full max-w-5xl mx-auto">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-300">Content Manager</h2>
                    <div className="border border-gray-300 bg-white">
                        <table className="w-full text-sm text-left"><thead className="bg-gray-100 border-b border-gray-300 text-xs text-gray-600"><tr><th className="px-4 py-2">Select Class to Manage Content</th><th className="px-4 py-2 text-right"></th></tr></thead><tbody className="divide-y divide-gray-200">{classes.map(c => <tr key={c.id} onClick={() => setSelectedClass(c)} className="hover:bg-blue-50 cursor-pointer"><td className="px-4 py-2 font-medium text-gray-800">{c.name}</td><td className="px-4 py-2 text-right text-gray-400"><i className="fas fa-chevron-right"></i></td></tr>)}</tbody></table>
                    </div>
                </div>
            );
        }

        function ContentClassView({ cls, onBack }) {
            const [subjects, setSubjects] = useState([]);
            const [selSubject, setSelSubject] = useState(null);
            useEffect(() => { adminApi.get(\`/api/subjects?class_id=\${cls.id}\`).then(setSubjects); }, [cls]);

            if (selSubject) return <ContentSubjectView subject={selSubject} onBack={() => setSelSubject(null)} />;

            return (
                <div className="w-full max-w-5xl mx-auto">
                    <div className="flex items-center mb-4 pb-2 border-b border-gray-300"><button onClick={onBack} className="text-gray-500 hover:text-black mr-2"><i className="fas fa-arrow-left"></i></button><h2 className="text-lg font-bold">{cls.name} / Select Subject</h2></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{subjects.map(s => <div key={s.id} onClick={() => setSelSubject(s)} className="bg-white border border-gray-300 p-4 hover:border-blue-500 cursor-pointer"><h3 className="font-bold text-gray-800">{s.name}</h3><p className="text-xs text-gray-500 mt-1">Manage Content</p></div>)}</div>
                </div>
            );
        }

        function ContentSubjectView({ subject, onBack }) {
            const [chapters, setChapters] = useState([]);
            const [activeChapter, setActiveChapter] = useState(null);
            const [topics, setTopics] = useState([]);
            const [selTopic, setSelTopic] = useState(null);
            const [directTarget, setDirectTarget] = useState(null);

            useEffect(() => { adminApi.get(\`/api/chapters?subject_id=\${subject.id}\`).then(setChapters); }, [subject]);
            const loadTopics = async (ch) => { 
                setActiveChapter(ch); 
                setDirectTarget(null);
                setTopics(await adminApi.get(\`/api/topics?chapter_id=\${ch.id}\`)); 
            };

            if (selTopic || directTarget) {
                const directTopic = directTarget
                    ? directTarget.type === 'subject'
                        ? { id: 'subject_'+directTarget.id, title: directTarget.title, isSubject: true, realId: directTarget.id }
                        : { id: 'chapter_'+directTarget.id, title: directTarget.title, isChapter: true, realId: directTarget.id }
                    : null;
                return (
                    <TopicContentEditor 
                        topic={directTopic || selTopic} 
                        onBack={() => { setSelTopic(null); setDirectTarget(null); }} 
                        chapters={chapters} 
                    />
                ); 
            }

            return (
                <div className="w-full flex flex-col gap-4 h-[calc(100vh-140px)]">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">{subject.name}</h2>
                            <p className="text-xs text-gray-500">Manage chapters, topics, and direct subject questions.</p>
                        </div>
                        <button
                            onClick={() => setDirectTarget({ type: 'subject', id: subject.id, title: subject.name })}
                            className="text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded hover:bg-purple-200 font-bold"
                        >
                            Subject Questions
                        </button>
                    </div>
                    <div className="w-full flex flex-col md:flex-row gap-4 flex-1 min-h-0">
                        <div className="w-full md:w-60 bg-white border border-gray-300 flex flex-col">
                            <div className="p-2 border-b border-gray-300 bg-gray-100 flex items-center"><button onClick={onBack} className="mr-2 text-gray-500"><i className="fas fa-arrow-left"></i></button><span className="font-bold text-xs uppercase text-gray-600">Chapters</span></div>
                            <div className="flex-1 overflow-y-auto">{chapters.map(c => <button key={c.id} onClick={() => loadTopics(c)} className={\`w-full text-left px-3 py-2 text-sm border-b border-gray-200 \${activeChapter?.id === c.id ? 'bg-blue-50 text-blue-800 font-bold' : 'hover:bg-gray-50'}\`}>{c.title}</button>)}</div>
                        </div>
                        <div className="flex-1 bg-white border border-gray-300 p-4 overflow-y-auto">
                            {!activeChapter ? <div className="h-full flex items-center justify-center text-gray-400 text-sm">Select a chapter.</div> : 
                            <>
                                <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                                    <h3 className="font-bold text-gray-800">{activeChapter.title} / Topics</h3>
                                    <button onClick={() => setDirectTarget({ type: 'chapter', id: activeChapter.id, title: activeChapter.title })} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 font-bold">Chapter Questions</button>
                                </div>
                                <div className="space-y-2">{topics.map(t => <div key={t.id} onClick={() => setSelTopic(t)} className="flex justify-between items-center p-3 border border-gray-300 hover:bg-gray-50 cursor-pointer"><span className="text-sm font-medium">{t.title}</span><span className="text-xs text-blue-600">Edit <i className="fas fa-pen ml-1"></i></span></div>)}</div>
                                {topics.length === 0 && <div className="text-center text-gray-400 text-sm py-10">No topics. Add direct questions if needed.</div>}
                            </>}
                        </div>
                    </div>
                </div>
            );
        }

        function TopicContentEditor({ topic, onBack, chapters }) {
            const [content, setContent] = useState(topic.content || '');
            const [questions, setQuestions] = useState([]);
            const [activeTab, setActiveTab] = useState('questions');
            const [isQModalOpen, setIsQModalOpen] = useState(false);
            const [isSavingNote, setIsSavingNote] = useState(false);
            const [partFilter, setPartFilter] = useState('all');
            const [editingQuestion, setEditingQuestion] = useState(null);

            const url = topic.isSubject
                ? \`/api/questions?subject_id=\${topic.realId}\`
                : topic.isChapter
                    ? \`/api/questions?chapter_id=\${topic.realId}\`
                    : \`/api/questions?topic_id=\${topic.id}\`;
            const loadQs = async () => { setQuestions(await adminApi.get(url)); };
            useEffect(() => { loadQs(); setPartFilter('all'); }, [topic]);
            
            const saveNotes = async () => { 
                if(topic.isChapter || topic.isSubject) { alert('Notes not supported for chapter/subject questions yet.'); return; }
                setIsSavingNote(true); 
                await adminApi.post('/api/topics', { ...topic, content, order_num: topic.order_num }); 
                setIsSavingNote(false); 
                alert('Saved!'); 
            };
            
            const addQuestion = async (data) => { 
                const payload = topic.isSubject
                    ? { ...data, topic_id: null, subject_id: topic.realId }
                    : topic.isChapter
                        ? { ...data, topic_id: null, chapter_id: topic.realId }
                        : { ...data, topic_id: topic.id };
                try {
                    await adminApi.post('/api/questions', payload); 
                    setIsQModalOpen(false); 
                    await loadQs(); 
                } catch (error) {
                    alert(error?.message || 'Unable to save question. Please try again.');
                }
            };

            const updateQuestion = async (data) => {
                await adminApi.put('/api/questions', data);
                setEditingQuestion(null);
                await loadQs();
            };
            
            const delQuestion = async (id) => { if(confirm('Delete question?')) { await adminApi.del('question', id); await loadQs(); } };

            const partOrder = ['ক', 'খ', 'গ', 'ঘ'];
            const cqPartQuestions = questions.filter(q => q.type === 'CQ-Part');
            const otherQuestions = questions.filter(q => q.type !== 'CQ-Part');
            const cqScenarioQuestions = questions.filter(q => q.type === 'CQ');
            const cqScenarioPartsCount = cqScenarioQuestions.reduce((sum, q) => sum + (q.options || []).length, 0);
            const questionCount = questions.length - cqScenarioQuestions.length + cqScenarioPartsCount;
            const filteredCqParts = partFilter === 'all' ? cqPartQuestions : cqPartQuestions.filter(q => q.metadata?.part === partFilter);
            const groupedCqParts = partOrder
                .map(part => ({ part, items: filteredCqParts.filter(q => q.metadata?.part === part) }))
                .filter(group => group.items.length > 0);
            const hasCqParts = cqPartQuestions.length > 0;
            const defaultChapterId = topic.isChapter ? topic.realId : topic.isSubject ? '' : topic.chapter_id;
            const defaultTopicId = topic.isChapter || topic.isSubject ? '' : topic.id;

            return (
                <div className="w-full h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-300">
                        <div className="flex items-center"><button onClick={onBack} className="text-gray-500 hover:text-black mr-2"><i className="fas fa-arrow-left"></i></button><h2 className="text-lg font-bold">{topic.title} {topic.isSubject ? '(Subject Questions)' : topic.isChapter ? '(Chapter Questions)' : ''}</h2></div>
                        <div className="flex border border-gray-300">
                            {!topic.isChapter && !topic.isSubject && <button onClick={() => setActiveTab('notes')} className={\`px-3 py-1 text-xs font-bold \${activeTab === 'notes' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-50'}\`}>Notes</button>}
                            <button onClick={() => setActiveTab('questions')} className={\`px-3 py-1 text-xs font-bold border-l border-gray-300 \${activeTab === 'questions' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-50'}\`}>Questions ({questionCount})</button>
                        </div>
                    </div>
                    {activeTab === 'notes' && !topic.isChapter && !topic.isSubject ? (
                        <div className="flex-1 flex flex-col border border-gray-300 bg-white">
                            <textarea className="flex-1 w-full p-4 text-sm font-mono outline-none resize-none" placeholder="Markdown content..." value={content} onChange={e => setContent(e.target.value)}></textarea>
                            <div className="p-2 bg-gray-100 border-t border-gray-300 flex justify-end"><button onClick={saveNotes} className="px-4 py-1 bg-blue-600 text-white text-xs hover:bg-blue-700" disabled={isSavingNote}>{isSavingNote ? 'Saving...' : 'Save'}</button></div>
                        </div>
                    ) : (
                        <div className="flex-1 border border-gray-300 bg-white flex flex-col">
                            <div className="p-2 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
                                <span className="font-bold text-xs uppercase text-gray-600">Question Bank</span>
                                <button onClick={() => setIsQModalOpen(true)} className="bg-blue-600 text-white text-xs px-2 py-1 hover:bg-blue-700">Add Question</button>
                            </div>
                            {hasCqParts && (
                                <div className="px-4 py-2 border-b border-gray-200 bg-white flex flex-wrap items-center gap-2 text-xs">
                                    <span className="font-bold text-gray-500 uppercase">Filter:</span>
                                    {['all', ...partOrder].map(part => (
                                        <button
                                            key={part}
                                            onClick={() => setPartFilter(part)}
                                            className={\`px-2 py-1 border rounded \${partFilter === part ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-600 border-gray-200'}\`}
                                        >
                                            {part === 'all' ? 'All' : part}
                                        </button>
                                    ))}
                                </div>
                            )}
                            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                                {groupedCqParts.map(group => (
                                    <div key={group.part} className="space-y-2">
                                        <div className="text-xs font-bold uppercase text-gray-500">Part {group.part}</div>
                                        {group.items.map(q => (
                                            <div key={q.id} className="p-3 border border-gray-300 bg-gray-50 relative group">
                                                <div className="flex justify-between mb-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-bold text-blue-700 uppercase">{q.type}</span>
                                                        <span className="text-[10px] font-bold uppercase text-gray-500">{q.scope || 'topic'}</span>
                                                    </div>
                                                    <div className="flex gap-2 items-center">
                                                        <span className="text-[10px] text-gray-500">{q.metadata?.board}</span>
                                                        <button onClick={() => setEditingQuestion(q)} className="text-xs text-blue-600 hover:underline">Edit</button>
                                                        <button onClick={() => delQuestion(q.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-800 whitespace-pre-wrap">{q.question_text}</p>
                                                <div className="mt-2 text-xs text-gray-600"><span className="font-bold">Answer:</span> {q.answer || '—'}</div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                                {otherQuestions.map(q => (
                                    <div key={q.id} className="p-3 border border-gray-300 bg-gray-50 relative group">
                                        <div className="flex justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold text-blue-700 uppercase">{q.type}</span>
                                                <span className="text-[10px] font-bold uppercase text-gray-500">{q.scope || 'topic'}</span>
                                            </div>
                                            <div className="flex gap-2 items-center">
                                                <span className="text-[10px] text-gray-500">{q.metadata?.board}</span>
                                                <button onClick={() => setEditingQuestion(q)} className="text-xs text-blue-600 hover:underline">Edit</button>
                                                <button onClick={() => delQuestion(q.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-800 whitespace-pre-wrap">{q.question_text}</p>
                                        {q.type === 'MCQ' && (
                                            <div className="mt-2 text-xs text-gray-600"><span className="font-bold">Answer:</span> {q.answer || '—'}</div>
                                        )}
                                        {(q.type === 'CQ' || q.type === 'WRITTEN') && (
                                            <div className="mt-2 space-y-3 text-xs text-gray-600">
                                                <div className="space-y-1">
                                                    <div className="font-bold text-gray-700 uppercase">Questions</div>
                                                    {(q.options || []).map((opt, idx) => (
                                                        <div key={idx}><span className="font-bold">{opt.id}.</span> {opt.text || '—'}</div>
                                                    ))}
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="font-bold text-gray-700 uppercase">Answers</div>
                                                    {(q.options || []).map((opt, idx) => (
                                                        <div key={idx}><span className="font-bold">{opt.id}.</span> {opt.answer || '—'}</div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {groupedCqParts.length === 0 && otherQuestions.length === 0 && (
                                    <div className="text-sm text-gray-400 text-center py-10">No questions yet.</div>
                                )}
                            </div>
                        </div>
                    )}
                    {isQModalOpen && <CreateCQModal onClose={() => setIsQModalOpen(false)} onSave={addQuestion} allChapters={chapters} defaultChapterId={defaultChapterId} defaultTopicId={defaultTopicId} />}
                    {editingQuestion && <EditQuestionModal question={editingQuestion} onClose={() => setEditingQuestion(null)} onSave={updateQuestion} allChapters={chapters} />}
                </div>
            );
        }

        /* --- ADVANCED CQ MODAL (Refined for Universal Written) --- */
        function EditQuestionModal({ question, onClose, onSave, allChapters }) {
            const [questionText, setQuestionText] = useState(question.question_text || '');
            const [answer, setAnswer] = useState(question.answer || '');
            const [metadata, setMetadata] = useState(question.metadata || {});
            const [options, setOptions] = useState(question.options || []);
            const [part, setPart] = useState(question.metadata?.part || 'ক');
            const [topicsMap, setTopicsMap] = useState({});

            useEffect(() => {
                const loadTopics = async () => {
                    if (question.type !== 'CQ') return;
                    const chapterIds = Array.from(new Set((options || []).map(opt => opt.chapterId).filter(Boolean)));
                    if (chapterIds.length === 0) return;
                    const loaded = {};
                    for (const chapterId of chapterIds) {
                        if (!topicsMap[chapterId]) {
                            loaded[chapterId] = await adminApi.get(\`/api/topics?chapter_id=\${chapterId}\`);
                        }
                    }
                    if (Object.keys(loaded).length > 0) {
                        setTopicsMap(prev => ({ ...prev, ...loaded }));
                    }
                };
                loadTopics();
            }, [question.type]);

            const updateOption = (idx, field, value) => {
                const updated = [...options];
                if (typeof updated[idx] === 'object') {
                    updated[idx] = { ...updated[idx], [field]: value };
                } else {
                    updated[idx] = value;
                }
                setOptions(updated);
            };

            const handleMcqOptionChange = (idx, value) => {
                const updated = [...options];
                const prev = updated[idx];
                updated[idx] = value;
                setOptions(updated);
                if (answer === prev) {
                    setAnswer(value);
                }
            };

            const addMcqOption = () => setOptions([...options, '']);
            const removeMcqOption = (idx) => setOptions(options.filter((_, i) => i !== idx));

            const handleCqChapterChange = async (idx, chapterId) => {
                updateOption(idx, 'chapterId', chapterId);
                updateOption(idx, 'topicId', '');
                if (chapterId && !topicsMap[chapterId]) {
                    const topics = await adminApi.get(\`/api/topics?chapter_id=\${chapterId}\`);
                    setTopicsMap(prev => ({ ...prev, [chapterId]: topics }));
                }
            };

            const handleSave = () => {
                const finalMetadata = question.type === 'CQ-Part'
                    ? { ...metadata, part }
                    : { ...metadata };
                onSave({
                    id: question.id,
                    question_text: questionText,
                    answer,
                    options,
                    metadata: finalMetadata
                });
            };

            return (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm" onClick={onClose}>
                    <div className="bg-white w-[720px] max-h-[90vh] overflow-y-auto border border-gray-400 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b border-gray-300 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-800">Edit Question</h3>
                            <button onClick={onClose} className="text-gray-500 hover:text-red-500"><i className="fas fa-times"></i></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="text-xs font-bold uppercase text-blue-600">{question.type}</div>
                            {question.type === 'CQ-Part' && (
                                <div className="flex gap-2">
                                    {['ক', 'খ', 'গ', 'ঘ'].map(p => (
                                        <button key={p} onClick={() => setPart(p)} className={\`w-10 h-10 border rounded font-bold \${part === p ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}\`}>{p}</button>
                                    ))}
                                </div>
                            )}
                            <div>
                                <label className="block text-xs font-bold mb-1">Question Text</label>
                                <textarea className="w-full border p-3 text-sm h-28" value={questionText} onChange={e => setQuestionText(e.target.value)}></textarea>
                            </div>
                            {question.type === 'MCQ' && (
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold mb-1">Options</label>
                                    {options.map((opt, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <span className="text-xs font-bold w-4">{String.fromCharCode(65 + idx)}</span>
                                            <input className="flex-1 border p-1.5 text-sm" value={opt} onChange={e => handleMcqOptionChange(idx, e.target.value)} />
                                            <input type="radio" name="mcq-edit-ans" checked={answer === opt && opt !== ''} onChange={() => setAnswer(opt)} />
                                            {options.length > 2 && (
                                                <button onClick={() => removeMcqOption(idx)} className="text-red-500 text-xs">Remove</button>
                                            )}
                                        </div>
                                    ))}
                                    <button onClick={addMcqOption} className="text-xs font-bold text-blue-600 hover:underline"><i className="fas fa-plus mr-1"></i>Add option</button>
                                </div>
                            )}
                            {question.type === 'CQ-Part' && (
                                <div>
                                    <label className="block text-xs font-bold mb-1">Answer / Solution</label>
                                    <textarea className="w-full border p-3 text-sm h-24" value={answer} onChange={e => setAnswer(e.target.value)}></textarea>
                                </div>
                            )}
                            {(question.type === 'CQ' || question.type === 'WRITTEN') && (
                                <div className="space-y-4">
                                    <label className="block text-xs font-bold mb-1">Sub-Questions</label>
                                    {options.map((opt, idx) => (
                                        <div key={idx} className="flex flex-col gap-2 border border-gray-200 rounded p-3 bg-gray-50/70">
                                            <div className="flex gap-2 items-start">
                                                <span className="font-bold text-sm w-6 pt-2 text-center">{opt.id}.</span>
                                                <div className="flex-1 space-y-1">
                                                    <input className="w-full border p-2 text-sm" value={opt.text} onChange={e => updateOption(idx, 'text', e.target.value)} />
                                                    <input className="w-full border p-2 text-xs bg-gray-50" value={opt.answer} onChange={e => updateOption(idx, 'answer', e.target.value)} />
                                                </div>
                                            </div>
                                            {question.type === 'CQ' && (
                                                <div className="flex flex-wrap gap-2 items-center pl-8">
                                                    <label className="flex items-center gap-1 text-xs cursor-pointer select-none">
                                                        <input
                                                            type="checkbox"
                                                            checked={opt.connected !== false}
                                                            onChange={e => updateOption(idx, 'connected', e.target.checked)}
                                                        />
                                                        Link to scenario
                                                    </label>
                                                    <select className="flex-1 border p-1.5 text-xs text-gray-600" value={opt.chapterId || ''} onChange={e => handleCqChapterChange(idx, e.target.value)}>
                                                        <option value="">Chapter (Optional)</option>
                                                        {allChapters.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                                    </select>
                                                    <select className="flex-1 border p-1.5 text-xs text-gray-600" value={opt.topicId || ''} onChange={e => updateOption(idx, 'topicId', e.target.value)} disabled={!opt.chapterId}>
                                                        <option value="">Topic (Optional)</option>
                                                        {topicsMap[opt.chapterId]?.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                                                    </select>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
                            <button onClick={onClose} className="px-4 py-2 text-sm border bg-white hover:bg-gray-100">Cancel</button>
                            <button onClick={handleSave} className="px-6 py-2 text-sm bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-sm">Save</button>
                        </div>
                    </div>
                </div>
            );
        }

        function CreateCQModal({ onClose, onSave, allChapters, defaultChapterId, defaultTopicId }) {
            const [mode, setMode] = useState('full'); // full, single, written, mcq
            const [scenario, setScenario] = useState('');
            const [board, setBoard] = useState('');
            const [year, setYear] = useState('');
            const [school, setSchool] = useState('');
            
            // Full CQ
            const [subQs, setSubQs] = useState(() => {
                const chapterId = defaultChapterId ? String(defaultChapterId) : '';
                const topicId = defaultTopicId ? String(defaultTopicId) : '';
                return [
                    { id: 'ক', text: '', answer: '', connected: false, chapterId, topicId },
                    { id: 'খ', text: '', answer: '', connected: false, chapterId, topicId },
                    { id: 'গ', text: '', answer: '', connected: true, chapterId, topicId },
                    { id: 'ঘ', text: '', answer: '', connected: true, chapterId, topicId }
                ];
            });
            
            // Single CQ Part
            const [singlePart, setSinglePart] = useState('ক');
            const [singleText, setSingleText] = useState('');
            const [singleAnswer, setSingleAnswer] = useState('');
            
            // Written / General
            const [writtenQs, setWrittenQs] = useState([{ id: 'a', text: '', answer: '' }]);

            // MCQ
            const [mcqQuestion, setMcqQuestion] = useState('');
            const [mcqOptions, setMcqOptions] = useState(['', '', '', '']);
            const [mcqAnswer, setMcqAnswer] = useState('');

            const [topicsMap, setTopicsMap] = useState({});

            useEffect(() => {
                const loadDefaultTopics = async () => {
                    const normalizedChapterId = defaultChapterId ? String(defaultChapterId) : '';
                    if (!normalizedChapterId || topicsMap[normalizedChapterId]) return;
                    const t = await adminApi.get(\`/api/topics?chapter_id=\${normalizedChapterId}\`);
                    setTopicsMap(prev => ({ ...prev, [normalizedChapterId]: t }));
                };
                loadDefaultTopics();
            }, [defaultChapterId]);

            const handleChapterChange = async (idx, chapterId) => {
                const newQs = [...subQs];
                newQs[idx].chapterId = chapterId;
                setSubQs(newQs);
                if (chapterId && !topicsMap[chapterId]) {
                    const t = await adminApi.get(\`/api/topics?chapter_id=\${chapterId}\`);
                    setTopicsMap(prev => ({ ...prev, [chapterId]: t }));
                }
            };

            const handleTopicChange = (idx, topicId) => { const newQs = [...subQs]; newQs[idx].topicId = topicId; setSubQs(newQs); };
            const handleTextChange = (idx, text) => { const newQs = [...subQs]; newQs[idx].text = text; setSubQs(newQs); };
            const handleAnswerChange = (idx, text) => { const newQs = [...subQs]; newQs[idx].answer = text; setSubQs(newQs); };
            const handleConnChange = (idx, val) => { const newQs = [...subQs]; newQs[idx].connected = val; setSubQs(newQs); };

            // Written Handlers
            const addWrittenRow = () => setWrittenQs([...writtenQs, { id: String.fromCharCode(97 + writtenQs.length), text: '', answer: '' }]);
            const updateWritten = (idx, field, val) => { const n = [...writtenQs]; n[idx][field] = val; setWrittenQs(n); };
            const removeWrittenRow = (idx) => setWrittenQs(writtenQs.filter((_, i) => i !== idx));

            const handleMcqOptionChange = (idx, value) => {
                const updated = [...mcqOptions];
                const prev = updated[idx];
                updated[idx] = value;
                setMcqOptions(updated);
                if (mcqAnswer === prev) {
                    setMcqAnswer(value);
                }
            };
            const addMcqOption = () => setMcqOptions([...mcqOptions, '']);
            const removeMcqOption = (idx) => setMcqOptions(mcqOptions.filter((_, i) => i !== idx));

            const handleSave = () => {
                let payload = {};
                if (mode === 'single') {
                    payload = { type: 'CQ-Part', question_text: singleText, options: [], answer: singleAnswer, metadata: { board, year, school, part: singlePart } };
                } else if (mode === 'mcq') {
                    payload = { type: 'MCQ', question_text: mcqQuestion, options: mcqOptions, answer: mcqAnswer, metadata: { board, year, school } };
                } else if (mode === 'written') {
                    payload = { type: 'WRITTEN', question_text: scenario, options: writtenQs, answer: '', metadata: { board, year, school } };
                } else {
                    payload = { type: 'CQ', question_text: scenario, options: subQs, answer: '', metadata: { board, year, school } };
                }
                onSave(payload);
            };

            return (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm" onClick={onClose}>
                    <div className="bg-white w-[900px] h-[90vh] flex flex-col border border-gray-400 shadow-2xl animate-fade-in" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b border-gray-300 flex justify-between items-center bg-gray-50"><h3 className="font-bold text-gray-800">Add Question</h3><button onClick={onClose} className="text-gray-500 hover:text-red-500"><i className="fas fa-times"></i></button></div>
                        
                        <div className="flex border-b border-gray-300 bg-gray-50">
                            <button onClick={() => setMode('full')} className={\`flex-1 py-2 text-sm font-bold border-b-2 \${mode === 'full' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-gray-500 hover:bg-gray-100'}\`}>CQ (Scenario)</button>
                            <button onClick={() => setMode('single')} className={\`flex-1 py-2 text-sm font-bold border-b-2 \${mode === 'single' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-gray-500 hover:bg-gray-100'}\`}>Single Part</button>
                            <button onClick={() => setMode('written')} className={\`flex-1 py-2 text-sm font-bold border-b-2 \${mode === 'written' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-gray-500 hover:bg-gray-100'}\`}>General / Written</button>
                            <button onClick={() => setMode('mcq')} className={\`flex-1 py-2 text-sm font-bold border-b-2 \${mode === 'mcq' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-gray-500 hover:bg-gray-100'}\`}>MCQ</button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div><label className="block text-xs font-bold mb-1">Board</label><input className="w-full border p-2 text-sm" placeholder="Dhaka" value={board} onChange={e => setBoard(e.target.value)} /></div>
                                <div><label className="block text-xs font-bold mb-1">Year</label><input className="w-full border p-2 text-sm" placeholder="2024" value={year} onChange={e => setYear(e.target.value)} /></div>
                                <div><label className="block text-xs font-bold mb-1">School</label><input className="w-full border p-2 text-sm" placeholder="Ideal School" value={school} onChange={e => setSchool(e.target.value)} /></div>
                            </div>

                            {mode === 'full' && (
                                <>
                                    <div className="mb-6"><label className="block text-xs font-bold mb-1 uppercase text-blue-600">Scenario / Stem</label><textarea className="w-full border border-blue-200 p-3 text-sm h-24 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="Enter the creative scenario here..." value={scenario} onChange={e => setScenario(e.target.value)}></textarea></div>
                                    <div className="space-y-4">
                                        {subQs.map((q, i) => (
                                            <div key={q.id} className="border border-gray-200 p-4 rounded bg-gray-50/50">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-sm w-6 bg-gray-200 text-center rounded">{q.id}</span>
                                                        <input className="flex-1 border p-1.5 text-sm" placeholder="Question text..." value={q.text} onChange={e => handleTextChange(i, e.target.value)} />
                                                        <label className="flex items-center gap-1 text-xs cursor-pointer select-none ml-2"><input type="checkbox" checked={q.connected} onChange={e => handleConnChange(i, e.target.checked)} /> Link</label>
                                                    </div>
                                                    <div className="flex gap-2 pl-8">
                                                        <input className="flex-1 border p-1.5 text-xs bg-white" placeholder="Answer / Key Points..." value={q.answer} onChange={e => handleAnswerChange(i, e.target.value)} />
                                                    </div>
                                                    <div className="flex gap-2 pl-8">
                                                        <select className="w-1/2 border p-1.5 text-xs text-gray-600" value={q.chapterId} onChange={e => handleChapterChange(i, e.target.value)}><option value="">Chapter (Optional)</option>{allChapters.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select>
                                                        <select className="w-1/2 border p-1.5 text-xs text-gray-600" value={q.topicId} onChange={e => handleTopicChange(i, e.target.value)} disabled={!q.chapterId}><option value="">Topic (Optional)</option>{topicsMap[q.chapterId]?.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}</select>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {mode === 'single' && (
                                <div>
                                    <div className="mb-4">
                                        <label className="block text-xs font-bold mb-1">Select Part</label>
                                        <div className="flex gap-2">
                                            {['ক', 'খ', 'গ', 'ঘ'].map(p => (
                                                <button key={p} onClick={() => setSinglePart(p)} className={\`w-10 h-10 border rounded font-bold \${singlePart === p ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}\`}>{p}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mb-4"><label className="block text-xs font-bold mb-1">Question Text</label><textarea className="w-full border p-3 text-sm h-32" placeholder="Type the question..." value={singleText} onChange={e => setSingleText(e.target.value)}></textarea></div>
                                    <div className="mb-4"><label className="block text-xs font-bold mb-1">Answer / Solution</label><textarea className="w-full border p-3 text-sm h-32" placeholder="Type the solution..." value={singleAnswer} onChange={e => setSingleAnswer(e.target.value)}></textarea></div>
                                </div>
                            )}

                            {mode === 'mcq' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold mb-1">Question</label>
                                        <textarea className="w-full border p-3 text-sm h-24" placeholder="Type the MCQ question..." value={mcqQuestion} onChange={e => setMcqQuestion(e.target.value)}></textarea>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold mb-1">Options</label>
                                        {mcqOptions.map((opt, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <span className="text-xs font-bold w-4">{String.fromCharCode(65 + idx)}</span>
                                                <input className="flex-1 border p-1.5 text-sm" value={opt} onChange={e => handleMcqOptionChange(idx, e.target.value)} />
                                                <input type="radio" name="mcq-create-ans" checked={mcqAnswer === opt && opt !== ''} onChange={() => setMcqAnswer(opt)} />
                                                {mcqOptions.length > 2 && (
                                                    <button onClick={() => removeMcqOption(idx)} className="text-red-500 text-xs">Remove</button>
                                                )}
                                            </div>
                                        ))}
                                        <button onClick={addMcqOption} className="text-xs font-bold text-blue-600 hover:underline"><i className="fas fa-plus mr-1"></i>Add option</button>
                                    </div>
                                </div>
                            )}

                            {mode === 'written' && (
                                <div>
                                    <div className="mb-6"><label className="block text-xs font-bold mb-1 uppercase text-blue-600">Main Instruction / Passage</label><textarea className="w-full border border-blue-200 p-3 text-sm h-24 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="e.g. Fill in the blanks with suitable words..." value={scenario} onChange={e => setScenario(e.target.value)}></textarea></div>
                                    <div className="space-y-2">
                                        {writtenQs.map((q, i) => (
                                            <div key={i} className="flex gap-2 items-start">
                                                <span className="font-bold text-sm w-6 pt-2 text-center">{q.id}.</span>
                                                <div className="flex-1 space-y-1">
                                                    <input className="w-full border p-2 text-sm" placeholder="Question / Sub-part" value={q.text} onChange={e => updateWritten(i, 'text', e.target.value)} />
                                                    <input className="w-full border p-2 text-xs bg-gray-50" placeholder="Answer / Solution" value={q.answer} onChange={e => updateWritten(i, 'answer', e.target.value)} />
                                                </div>
                                                <button onClick={() => removeWrittenRow(i)} className="text-red-500 pt-2 hover:text-red-700"><i className="fas fa-times"></i></button>
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={addWrittenRow} className="mt-4 text-xs font-bold text-blue-600 hover:underline"><i className="fas fa-plus"></i> Add Sub-Question</button>
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3"><button onClick={onClose} className="px-4 py-2 text-sm border bg-white hover:bg-gray-100">Cancel</button><button onClick={handleSave} className="px-6 py-2 text-sm bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-sm">Save</button></div>
                    </div>
                </div>
            );
        }

        /* --- MODALS --- */
        function SimpleInputModal({ title, onClose, onSave }) {
            const [val, setVal] = useState('');
            return <Modal isOpen={true} onClose={onClose} title={title}><Input value={val} onChange={e => setVal(e.target.value)} autoFocus /><div className="flex justify-end mt-4 gap-2"><Button variant="ghost" onClick={onClose}>Cancel</Button><Button size="md" onClick={() => onSave(val)}>Save</Button></div></Modal>;
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
            return <Modal isOpen={true} onClose={onClose} title="Add Question"><div className="flex gap-2 mb-3 border-b pb-2"><button onClick={() => setType('MCQ')} className={\`px-3 py-1 text-xs font-bold \${type==='MCQ'?'bg-blue-100 text-blue-800':'text-gray-500'}\`}>MCQ</button><button onClick={() => setType('CQ')} className={\`px-3 py-1 text-xs font-bold \${type==='CQ'?'bg-blue-100 text-blue-800':'text-gray-500'}\`}>CQ</button></div><div className="flex gap-2 mb-3"><div className="flex-1"><Input label="Board" value={board} onChange={e => setBoard(e.target.value)} /></div><div className="w-24"><Input label="Year" value={year} onChange={e => setYear(e.target.value)} /></div></div><div className="mb-3"><label className="block text-xs font-bold mb-1">Question</label><textarea className="w-full border p-2 rounded text-sm h-20" value={text} onChange={e => setText(e.target.value)}></textarea></div>{type === 'MCQ' ? <div className="space-y-2 mb-3">{options.map((o, i) => <div key={i} className="flex items-center gap-2"><span className="text-xs font-bold w-4">{String.fromCharCode(65+i)}</span><input className="flex-1 border p-1.5 rounded text-sm" value={o} onChange={e => updateOption(i, e.target.value)} /><input type="radio" name="ans" checked={answer===o && o!==''} onChange={() => setAnswer(o)} /></div>)}</div> : <div className="mb-3"><label className="block text-xs font-bold mb-1">Answer Key</label><textarea className="w-full border p-2 rounded text-sm h-20" value={answer} onChange={e => setAnswer(e.target.value)}></textarea></div>}<div className="flex justify-end mt-4"><Button size="md" onClick={() => onSave({ type, question_text: text, options: type==='MCQ'?options:[], answer, metadata: { board, year } })}>Save</Button></div></Modal>;
        }
        function LinkClassModal({ cls, allClasses, onClose, onSave }) {
            const [parentId, setParentId] = useState(cls.parent_class_id || ''); const [label, setLabel] = useState(cls.program_label || '');
            return <Modal isOpen={true} onClose={onClose} title="Link Content"><div className="bg-blue-50 p-2 mb-4 text-blue-800 text-xs">Link <strong>{cls.name}</strong> to use content from another class.</div><div className="mb-4"><label className="block text-xs font-bold mb-1">Source Class</label><select className="w-full border p-2 text-sm bg-white" value={parentId} onChange={e => setParentId(e.target.value)}><option value="">-- Independent --</option>{allClasses.filter(c => c.id !== cls.id).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>{parentId && <Input label="Label" value={label} onChange={e => setLabel(e.target.value)} />}<div className="flex justify-end mt-4 gap-2"><Button variant="ghost" onClick={onClose}>Cancel</Button><Button size="md" onClick={() => onSave(parentId, label)}>Save</Button></div></Modal>;
        }
        function SettingsManager() {
            const handleReset = async () => { if (confirm("Permanently delete ALL data?")) { await adminApi.post('/api/reset-db', {}); window.location.reload(); } };
            return <div className="max-w-xl bg-white p-6 border border-gray-300"><h2 className="text-lg font-bold mb-4">Danger Zone</h2><Button variant="danger" size="sm" onClick={handleReset}>Reset Database</Button></div>;
        }
`;
