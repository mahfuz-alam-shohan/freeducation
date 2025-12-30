export const adminComponents = `
        /* --- API HELPERS (Scoped) --- */
        const adminApi = {
            get: (url) => fetch(url).then(r => r.json()),
            post: (url, body) => fetch(url, { method: 'POST', body: JSON.stringify(body) }),
            put: (url, body) => fetch(url, { method: 'PUT', body: JSON.stringify(body) }),
            update: (type, id, value) => fetch('/api/request', { method: 'PUT', body: JSON.stringify({ type, id, value }) }),
            del: (type, id) => fetch('/api/request', { method: 'DELETE', body: JSON.stringify({ type, id }) })
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
            const [isDirectQMode, setIsDirectQMode] = useState(false);

            useEffect(() => { adminApi.get(\`/api/chapters?subject_id=\${subject.id}\`).then(setChapters); }, [subject]);
            const loadTopics = async (ch) => { 
                setActiveChapter(ch); 
                setIsDirectQMode(false);
                setTopics(await adminApi.get(\`/api/topics?chapter_id=\${ch.id}\`)); 
            };

            if (selTopic || isDirectQMode) {
                return (
                    <TopicContentEditor 
                        topic={isDirectQMode ? { id: 'chapter_'+activeChapter.id, title: activeChapter.title, isChapter: true, realId: activeChapter.id } : selTopic} 
                        onBack={() => { setSelTopic(null); setIsDirectQMode(false); }} 
                        chapters={chapters} 
                    />
                ); 
            }

            return (
                <div className="w-full flex flex-col md:flex-row gap-4 h-[calc(100vh-140px)]">
                    <div className="w-full md:w-60 bg-white border border-gray-300 flex flex-col">
                        <div className="p-2 border-b border-gray-300 bg-gray-100 flex items-center"><button onClick={onBack} className="mr-2 text-gray-500"><i className="fas fa-arrow-left"></i></button><span className="font-bold text-xs uppercase text-gray-600">Chapters</span></div>
                        <div className="flex-1 overflow-y-auto">{chapters.map(c => <button key={c.id} onClick={() => loadTopics(c)} className={\`w-full text-left px-3 py-2 text-sm border-b border-gray-200 \${activeChapter?.id === c.id ? 'bg-blue-50 text-blue-800 font-bold' : 'hover:bg-gray-50'}\`}>{c.title}</button>)}</div>
                    </div>
                    <div className="flex-1 bg-white border border-gray-300 p-4 overflow-y-auto">
                        {!activeChapter ? <div className="h-full flex items-center justify-center text-gray-400 text-sm">Select a chapter.</div> : 
                        <>
                            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                                <h3 className="font-bold text-gray-800">{activeChapter.title} / Topics</h3>
                                <button onClick={() => setIsDirectQMode(true)} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 font-bold">Direct Questions</button>
                            </div>
                            <div className="space-y-2">{topics.map(t => <div key={t.id} onClick={() => setSelTopic(t)} className="flex justify-between items-center p-3 border border-gray-300 hover:bg-gray-50 cursor-pointer"><span className="text-sm font-medium">{t.title}</span><span className="text-xs text-blue-600">Edit <i className="fas fa-pen ml-1"></i></span></div>)}</div>
                            {topics.length === 0 && <div className="text-center text-gray-400 text-sm py-10">No topics. Add direct questions if needed.</div>}
                        </>}
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

            const url = topic.isChapter ? \`/api/questions?chapter_id=\${topic.realId}\` : \`/api/questions?topic_id=\${topic.id}\`;
            const loadQs = async () => { setQuestions(await adminApi.get(url)); };
            useEffect(() => { loadQs(); }, [topic]);
            
            const saveNotes = async () => { 
                if(topic.isChapter) { alert('Notes not supported for chapters directly yet.'); return; }
                setIsSavingNote(true); 
                await adminApi.post('/api/topics', { ...topic, content, order_num: topic.order_num }); 
                setIsSavingNote(false); 
                alert('Saved!'); 
            };
            
            const addQuestion = async (data) => { 
                const payload = topic.isChapter ? { ...data, topic_id: null, chapter_id: topic.realId } : { ...data, topic_id: topic.id };
                await adminApi.post('/api/questions', payload); 
                setIsQModalOpen(false); 
                await loadQs(); 
            };
            
            const delQuestion = async (id) => { if(confirm('Delete question?')) { await adminApi.del('question', id); await loadQs(); } };

            return (
                <div className="w-full h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-300">
                        <div className="flex items-center"><button onClick={onBack} className="text-gray-500 hover:text-black mr-2"><i className="fas fa-arrow-left"></i></button><h2 className="text-lg font-bold">{topic.title} {topic.isChapter ? '(Chapter Mode)' : ''}</h2></div>
                        <div className="flex border border-gray-300">
                            {!topic.isChapter && <button onClick={() => setActiveTab('notes')} className={\`px-3 py-1 text-xs font-bold \${activeTab === 'notes' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-50'}\`}>Notes</button>}
                            <button onClick={() => setActiveTab('questions')} className={\`px-3 py-1 text-xs font-bold border-l border-gray-300 \${activeTab === 'questions' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-50'}\`}>Questions ({questions.length})</button>
                        </div>
                    </div>
                    {activeTab === 'notes' && !topic.isChapter ? (
                        <div className="flex-1 flex flex-col border border-gray-300 bg-white">
                            <textarea className="flex-1 w-full p-4 text-sm font-mono outline-none resize-none" placeholder="Markdown content..." value={content} onChange={e => setContent(e.target.value)}></textarea>
                            <div className="p-2 bg-gray-100 border-t border-gray-300 flex justify-end"><button onClick={saveNotes} className="px-4 py-1 bg-blue-600 text-white text-xs hover:bg-blue-700" disabled={isSavingNote}>{isSavingNote ? 'Saving...' : 'Save'}</button></div>
                        </div>
                    ) : (
                        <div className="flex-1 border border-gray-300 bg-white flex flex-col">
                            <div className="p-2 border-b border-gray-300 bg-gray-100 flex justify-between items-center"><span className="font-bold text-xs uppercase text-gray-600">Question Bank</span><button onClick={() => setIsQModalOpen(true)} className="bg-blue-600 text-white text-xs px-2 py-1 hover:bg-blue-700">Add Question</button></div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-2">{questions.map((q, i) => <div key={q.id} className="p-3 border border-gray-300 bg-gray-50 relative group"><div className="flex justify-between mb-1"><span className="text-[10px] font-bold text-blue-700 uppercase">{q.type}</span><div className="flex gap-2"><span className="text-[10px] text-gray-500">{q.metadata?.board}</span><button onClick={() => delQuestion(q.id)} className="text-red-500 hover:underline text-xs">Delete</button></div></div><p className="text-sm text-gray-800">{q.question_text}</p></div>)}</div>
                        </div>
                    )}
                    {isQModalOpen && <CreateCQModal onClose={() => setIsQModalOpen(false)} onSave={addQuestion} allChapters={chapters} />}
                </div>
            );
        }

        /* --- ADVANCED CQ MODAL (Refined) --- */
        function CreateCQModal({ onClose, onSave, allChapters }) {
            const [mode, setMode] = useState('full');
            const [scenario, setScenario] = useState('');
            const [board, setBoard] = useState('');
            const [year, setYear] = useState('');
            const [school, setSchool] = useState('');
            const [subQs, setSubQs] = useState([
                { id: 'ক', text: '', answer: '', connected: false, chapterId: '', topicId: '' },
                { id: 'খ', text: '', answer: '', connected: false, chapterId: '', topicId: '' },
                { id: 'গ', text: '', answer: '', connected: true, chapterId: '', topicId: '' },
                { id: 'ঘ', text: '', answer: '', connected: true, chapterId: '', topicId: '' }
            ]);
            const [singlePart, setSinglePart] = useState('ক');
            const [singleText, setSingleText] = useState('');
            const [singleAnswer, setSingleAnswer] = useState('');
            
            const [topicsMap, setTopicsMap] = useState({});

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

            const handleSave = () => {
                if (mode === 'single') {
                    onSave({
                        type: 'CQ-Part',
                        question_text: singleText,
                        options: [],
                        answer: singleAnswer, // Storing single answer here
                        metadata: { board, year, school, part: singlePart }
                    });
                } else {
                    onSave({
                        type: 'CQ',
                        question_text: scenario,
                        options: subQs, 
                        answer: '', 
                        metadata: { board, year, school }
                    });
                }
            };

            return (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm" onClick={onClose}>
                    <div className="bg-white w-[900px] h-[90vh] flex flex-col border border-gray-400 shadow-2xl animate-fade-in" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b border-gray-300 flex justify-between items-center bg-gray-50"><h3 className="font-bold text-gray-800">Add Creative Question</h3><button onClick={onClose} className="text-gray-500 hover:text-red-500"><i className="fas fa-times"></i></button></div>
                        
                        <div className="flex border-b border-gray-300">
                            <button onClick={() => setMode('full')} className={\`flex-1 py-2 text-sm font-bold \${mode === 'full' ? 'bg-white text-blue-700 border-b-2 border-blue-600' : 'bg-gray-100 text-gray-500'}\`}>Full Scenario CQ</button>
                            <button onClick={() => setMode('single')} className={\`flex-1 py-2 text-sm font-bold \${mode === 'single' ? 'bg-white text-blue-700 border-b-2 border-blue-600' : 'bg-gray-100 text-gray-500'}\`}>Single Question Part</button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div><label className="block text-xs font-bold mb-1">Board Name</label><input className="w-full border p-2 text-sm" placeholder="Dhaka" value={board} onChange={e => setBoard(e.target.value)} /></div>
                                <div><label className="block text-xs font-bold mb-1">Year</label><input className="w-full border p-2 text-sm" placeholder="2024" value={year} onChange={e => setYear(e.target.value)} /></div>
                                <div><label className="block text-xs font-bold mb-1">School (Optional)</label><input className="w-full border p-2 text-sm" placeholder="Ideal School" value={school} onChange={e => setSchool(e.target.value)} /></div>
                            </div>

                            {mode === 'full' ? (
                                <>
                                    <div className="mb-6"><label className="block text-xs font-bold mb-1 uppercase text-blue-600">Scenario / Stem</label><textarea className="w-full border border-blue-200 p-3 text-sm h-24 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="Enter the creative scenario here..." value={scenario} onChange={e => setScenario(e.target.value)}></textarea></div>
                                    <div className="space-y-4">
                                        {subQs.map((q, i) => (
                                            <div key={q.id} className="border border-gray-200 p-4 rounded bg-gray-50/50">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-sm w-6 bg-gray-200 text-center rounded">{q.id}</span>
                                                        <input className="flex-1 border p-1.5 text-sm" placeholder="Question text..." value={q.text} onChange={e => handleTextChange(i, e.target.value)} />
                                                        <label className="flex items-center gap-1 text-xs cursor-pointer select-none ml-2"><input type="checkbox" checked={q.connected} onChange={e => handleConnChange(i, e.target.checked)} /> Link Scenario</label>
                                                    </div>
                                                    <div className="flex gap-2 pl-8">
                                                        <input className="flex-1 border p-1.5 text-xs bg-white" placeholder="Answer / Key Points / Solution..." value={q.answer} onChange={e => handleAnswerChange(i, e.target.value)} />
                                                    </div>
                                                    <div className="flex gap-2 pl-8">
                                                        <select className="w-1/2 border p-1.5 text-xs text-gray-600" value={q.chapterId} onChange={e => handleChapterChange(i, e.target.value)}><option value="">Select Chapter</option>{allChapters.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select>
                                                        <select className="w-1/2 border p-1.5 text-xs text-gray-600" value={q.topicId} onChange={e => handleTopicChange(i, e.target.value)} disabled={!q.chapterId}><option value="">Select Topic</option>{topicsMap[q.chapterId]?.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}</select>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <div className="mb-4">
                                        <label className="block text-xs font-bold mb-1">Select Part</label>
                                        <div className="flex gap-2">
                                            {['ক', 'খ', 'গ', 'ঘ'].map(p => (
                                                <button key={p} onClick={() => setSinglePart(p)} className={\`w-10 h-10 border rounded font-bold \${singlePart === p ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}\`}>{p}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-xs font-bold mb-1">Question Text</label>
                                        <textarea className="w-full border p-3 text-sm h-24" placeholder="Type the question..." value={singleText} onChange={e => setSingleText(e.target.value)}></textarea>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-xs font-bold mb-1">Answer / Solution</label>
                                        <textarea className="w-full border p-3 text-sm h-24" placeholder="Type the solution or key points..." value={singleAnswer} onChange={e => setSingleAnswer(e.target.value)}></textarea>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3"><button onClick={onClose} className="px-4 py-2 text-sm border bg-white hover:bg-gray-100">Cancel</button><button onClick={handleSave} className="px-6 py-2 text-sm bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-sm">Save CQ</button></div>
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


