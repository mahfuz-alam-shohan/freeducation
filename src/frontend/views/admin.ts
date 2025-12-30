export const adminComponents = `
        const EditModal = ({ title, value, onSave, onDelete, onClose }) => {
            const [val, setVal] = useState(value);
            return (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={onClose}>
                    <div className="bg-white rounded-lg shadow-xl border p-4 w-72 animate-fade-in" onClick={e => e.stopPropagation()}>
                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">{title}</h4>
                        <input className="w-full border rounded p-2 text-sm mb-4 focus:ring-2 focus:ring-blue-500 outline-none" value={val} onChange={e => setVal(e.target.value)} autoFocus />
                        <div className="flex justify-between items-center">
                            {onDelete && <button onClick={() => { if(confirm('Delete this item?')) onDelete(); }} className="text-red-500 text-xs hover:bg-red-50 p-1.5 rounded"><i className="fas fa-trash"></i></button>}
                            <div className="flex gap-2">
                                <button onClick={onClose} className="px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-100 rounded">Cancel</button>
                                <button onClick={() => onSave(val)} className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">Update</button>
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
                    <div onClick={() => setIsEditing(true)} className="cursor-pointer hover:bg-blue-50 px-2 py-1 -mx-2 rounded transition border border-transparent hover:border-blue-200 group flex justify-between items-center">
                        <span className="truncate">{value}</span>
                        <i className="fas fa-pen text-[10px] text-gray-300 group-hover:text-blue-400 opacity-0 group-hover:opacity-100"></i>
                    </div>
                    {isEditing && <EditModal title={\`Edit \${label}\`} value={value} onClose={() => setIsEditing(false)} onSave={async (v) => { await onUpdate(v); setIsEditing(false); }} onDelete={onDelete ? async () => { await onDelete(); setIsEditing(false); } : null} />}
                </>
            );
        };

        function AdminDashboard({ user, logout }) {
            const [activeTab, setActiveTab] = useState('classes');
            return (
                <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] bg-gray-50">
                    <div className="hidden md:flex flex-col w-64 bg-white border-r sticky top-16 h-[calc(100vh-64px)]">
                        <nav className="p-2 space-y-1 mt-4">
                            <AdminNavItem icon="fas fa-sitemap" label="Structure (Classes)" active={activeTab === 'classes'} onClick={() => setActiveTab('classes')} />
                            <AdminNavItem icon="fas fa-box-open" label="Content Manager" active={activeTab === 'content'} onClick={() => setActiveTab('content')} />
                            <AdminNavItem icon="fas fa-cogs" label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                        </nav>
                        <div className="mt-auto p-4 border-t"><button onClick={logout} className="text-red-600 text-sm hover:underline"><i className="fas fa-sign-out-alt mr-2"></i>Logout</button></div>
                    </div>
                    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50 flex justify-around p-2 pb-5">
                        <MobileNavItem icon="fas fa-sitemap" label="Structure" active={activeTab === 'classes'} onClick={() => setActiveTab('classes')} />
                        <MobileNavItem icon="fas fa-box-open" label="Content" active={activeTab === 'content'} onClick={() => setActiveTab('content')} />
                        <MobileNavItem icon="fas fa-cogs" label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                    </div>
                    <div className="flex-1 p-4 md:p-8 w-full overflow-x-hidden pb-24 md:pb-8">
                        {activeTab === 'classes' && <ClassStructureManager />}
                        {activeTab === 'content' && <ContentManagerLanding />}
                        {activeTab === 'settings' && <SettingsManager />}
                    </div>
                </div>
            );
        }

        const AdminNavItem = ({ icon, label, active, onClick }) => (
            <button onClick={onClick} className={\`w-full flex items-center px-3 py-2 rounded text-sm font-medium transition \${active ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}\`}><i className={\`\${icon} w-5 text-center mr-2 opacity-70\`}></i> {label}</button>
        );
        const MobileNavItem = ({ icon, label, active, onClick }) => (
            <button onClick={onClick} className={\`flex flex-col items-center p-1 \${active ? 'text-blue-600' : 'text-gray-400'}\`}><i className={\`\${icon} text-lg mb-1\`}></i><span className="text-[10px]">{label}</span></button>
        );

        function ClassStructureManager() {
            const [classes, setClasses] = useState([]);
            const [isModalOpen, setIsModalOpen] = useState(false);
            const [selectedClass, setSelectedClass] = useState(null);
            const [linkModalClass, setLinkModalClass] = useState(null);
            
            const loadClasses = () => fetch('/api/classes').then(r => r.json()).then(setClasses);
            useEffect(() => { loadClasses(); }, []);
            
            const createClass = async (name) => { if(!name) return; await fetch('/api/classes', { method: 'POST', body: JSON.stringify({ name }) }); setIsModalOpen(false); loadClasses(); };
            const updateClass = async (id, name) => { await fetch('/api/classes', { method: 'PUT', body: JSON.stringify({ id, name }) }); loadClasses(); }; 
            const deleteClass = async (id) => { await fetch('/api/request', { method: 'DELETE', body: JSON.stringify({ type: 'class', id }) }); loadClasses(); };
            
            const saveLink = async (parentId, label) => {
                await fetch('/api/classes', { method: 'PUT', body: JSON.stringify({ id: linkModalClass.id, parent_class_id: parentId, program_label: label }) });
                setLinkModalClass(null); loadClasses();
            };

            if (selectedClass) return <StructureDetail cls={selectedClass} onBack={() => setSelectedClass(null)} />;

            return (
                <div className="w-full max-w-5xl mx-auto">
                    <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold text-gray-800">Academic Structure</h2><button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white w-8 h-8 rounded hover:bg-blue-700 flex items-center justify-center"><i className="fas fa-plus"></i></button></div>
                    <div className="bg-white border rounded overflow-hidden">
                        <table className="w-full text-xs md:text-sm text-left">
                            <thead className="bg-gray-50 border-b text-gray-500 uppercase text-[10px] md:text-xs"><tr><th className="px-4 py-3 w-16">ID</th><th className="px-4 py-3">Class Name</th><th className="px-4 py-3 w-40 text-right">Actions</th></tr></thead>
                            <tbody className="divide-y">{classes.map(c => (
                                <tr key={c.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-gray-400 font-mono">{c.id}</td>
                                    <td className="px-4 py-3 font-medium">
                                        <TableCell label="Class Name" value={c.name} onUpdate={(v) => updateClass(c.id, v)} onDelete={() => deleteClass(c.id)} />
                                        {c.parent_class_id && <div className="text-[10px] text-orange-600 mt-1"><i className="fas fa-link mr-1"></i>Linked to: {c.parent_name}</div>}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => setLinkModalClass(c)} className="text-gray-400 hover:text-orange-600 px-2 py-1 rounded hover:bg-orange-50" title="Link Content"><i className="fas fa-link"></i></button>
                                            {!c.parent_class_id && <button onClick={() => setSelectedClass(c)} className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded text-xs border border-blue-200">Manage</button>}
                                        </div>
                                    </td>
                                </tr>
                            ))}</tbody>
                        </table>
                    </div>
                    {isModalOpen && <SimpleInputModal title="New Class" onClose={() => setIsModalOpen(false)} onSave={createClass} />}
                    {linkModalClass && <LinkClassModal cls={linkModalClass} allClasses={classes} onClose={() => setLinkModalClass(null)} onSave={saveLink} />}
                </div>
            );
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

        function StructureDetail({ cls, onBack }) {
            const [groups, setGroups] = useState([]);
            const [subjects, setSubjects] = useState([]);
            const [modal, setModal] = useState(null);
            const [selSubject, setSelSubject] = useState(null);

            const refresh = async () => { const [g, s] = await Promise.all([fetch(\`/api/groups?class_id=\${cls.id}\`), fetch(\`/api/subjects?class_id=\${cls.id}\`)]); setGroups(await g.json()); setSubjects(await s.json()); };
            useEffect(() => { refresh(); }, [cls]);
            
            const addGroup = async (name) => { await fetch('/api/groups', { method: 'POST', body: JSON.stringify({ name, class_id: cls.id }) }); setModal(null); refresh(); };
            const addSubject = async (data) => { await fetch('/api/subjects', { method: 'POST', body: JSON.stringify({ ...data, class_id: cls.id }) }); setModal(null); refresh(); };
            const delGroup = async (id) => { await fetch('/api/request', { method: 'DELETE', body: JSON.stringify({ type: 'group', id }) }); refresh(); };
            const delSubject = async (id) => { await fetch('/api/request', { method: 'DELETE', body: JSON.stringify({ type: 'subject', id }) }); refresh(); };
            // Note: Currently no edit API for groups/subjects name in backend, would require updating handleApiRequest

            if (selSubject) return <ChapterStructureManager subject={selSubject} onBack={() => setSelSubject(null)} />;

            return (
                <div className="w-full max-w-6xl mx-auto">
                    <div className="flex items-center mb-6"><button onClick={onBack} className="text-gray-400 hover:text-blue-600 mr-2"><i className="fas fa-arrow-left"></i></button><h2 className="text-lg font-bold">{cls.name} <span className="text-gray-400 font-normal">/ Groups & Subjects</span></h2></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                            <div className="flex justify-between items-center mb-2"><h3 className="font-bold text-gray-700 text-sm">Groups</h3><button onClick={() => setModal('group')} className="text-blue-600 text-sm hover:bg-blue-50 px-2 rounded"><i className="fas fa-plus"></i></button></div>
                            <div className="bg-white border rounded"><table className="w-full text-xs md:text-sm"><tbody className="divide-y">{groups.map(g => <tr key={g.id}><td className="px-3 py-2"><TableCell label="Group" value={g.name} onUpdate={() => {}} onDelete={() => delGroup(g.id)} /></td></tr>)}</tbody></table></div>
                        </div>
                        <div className="md:col-span-2">
                            <div className="flex justify-between items-center mb-2"><h3 className="font-bold text-gray-700 text-sm">Subjects</h3><button onClick={() => setModal('subject')} className="text-blue-600 text-sm hover:bg-blue-50 px-2 rounded"><i className="fas fa-plus"></i></button></div>
                            <div className="bg-white border rounded"><table className="w-full text-xs md:text-sm"><thead className="bg-gray-50 border-b text-[10px] md:text-xs text-gray-500 text-left"><tr><th className="px-3 py-2">Name</th><th className="px-3 py-2">Group</th><th className="px-3 py-2 text-right"></th></tr></thead><tbody className="divide-y">{subjects.map(s => <tr key={s.id}><td className="px-3 py-2 font-medium"><TableCell label="Subject" value={s.name} onUpdate={() => {}} onDelete={() => delSubject(s.id)} /></td><td className="px-3 py-2 text-gray-500 text-xs">{s.is_common ? 'Common' : groups.find(g => g.id == s.group_id)?.name}</td><td className="px-3 py-2 text-right"><button onClick={() => setSelSubject(s)} className="text-blue-600 hover:underline text-xs">Chapters</button></td></tr>)}</tbody></table></div>
                        </div>
                    </div>
                    {modal === 'group' && <SimpleInputModal title="New Group" onClose={() => setModal(null)} onSave={addGroup} />}
                    {modal === 'subject' && <CreateSubjectModal groups={groups} onClose={() => setModal(null)} onSave={addSubject} />}
                </div>
            );
        }

        function ChapterStructureManager({ subject, onBack }) {
            const [chapters, setChapters] = useState([]);
            const [isModalOpen, setIsModalOpen] = useState(false);
            const [selChapter, setSelChapter] = useState(null);

            const load = () => fetch(\`/api/chapters?subject_id=\${subject.id}\`).then(r => r.json()).then(setChapters);
            useEffect(() => { load(); }, [subject]);
            
            const create = async (data) => { await fetch('/api/chapters', { method: 'POST', body: JSON.stringify({ ...data, subject_id: subject.id, order_num: data.order || chapters.length + 1 }) }); setIsModalOpen(false); load(); };
            const del = async (id) => { await fetch('/api/request', { method: 'DELETE', body: JSON.stringify({ type: 'chapter', id }) }); load(); };

            if (selChapter) return <TopicStructureManager chapter={selChapter} onBack={() => setSelChapter(null)} />;

            return (
                <div className="w-full max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-4"><div className="flex items-center"><button onClick={onBack} className="text-gray-400 hover:text-blue-600 mr-2"><i className="fas fa-arrow-left"></i></button><h2 className="text-lg font-bold">{subject.name} <span className="text-gray-400 font-normal">/ Chapters</span></h2></div><button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white w-8 h-8 rounded hover:bg-blue-700 flex items-center justify-center"><i className="fas fa-plus"></i></button></div>
                    <div className="bg-white border rounded overflow-hidden">
                        <table className="w-full text-xs md:text-sm text-left"><thead className="bg-gray-50 border-b text-[10px] md:text-xs text-gray-500"><tr><th className="px-4 py-3 w-16">#</th><th className="px-4 py-3">Chapter Title</th><th className="px-4 py-3 text-right"></th></tr></thead><tbody className="divide-y">{chapters.map(c => <tr key={c.id} className="hover:bg-gray-50"><td className="px-4 py-3 text-gray-400">{c.order_num}</td><td className="px-4 py-3 font-medium"><TableCell label="Chapter" value={c.title} onUpdate={() => {}} onDelete={() => del(c.id)} /></td><td className="px-4 py-3 text-right"><button onClick={() => setSelChapter(c)} className="text-blue-600 hover:underline text-xs">Topics</button></td></tr>)}</tbody></table>
                        {chapters.length === 0 && <div className="p-6 text-center text-gray-400 italic text-xs">No chapters defined.</div>}
                    </div>
                    {isModalOpen && <CreateChapterModal onClose={() => setIsModalOpen(false)} onSave={create} />}
                </div>
            );
        }

        function TopicStructureManager({ chapter, onBack }) {
            const [topics, setTopics] = useState([]);
            const [isModalOpen, setIsModalOpen] = useState(false);

            const load = () => fetch(\`/api/topics?chapter_id=\${chapter.id}\`).then(r => r.json()).then(setTopics);
            useEffect(() => { load(); }, [chapter]);
            
            const create = async (title) => { await fetch('/api/topics', { method: 'POST', body: JSON.stringify({ title, content: '', chapter_id: chapter.id, order_num: topics.length + 1 }) }); setIsModalOpen(false); load(); };
            const del = async (id) => { await fetch('/api/request', { method: 'DELETE', body: JSON.stringify({ type: 'topic', id }) }); load(); };

            return (
                <div className="w-full max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-4"><div className="flex items-center"><button onClick={onBack} className="text-gray-400 hover:text-blue-600 mr-2"><i className="fas fa-arrow-left"></i></button><h2 className="text-lg font-bold">{chapter.title} <span className="text-gray-400 font-normal">/ Topics</span></h2></div><button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white w-8 h-8 rounded hover:bg-blue-700 flex items-center justify-center"><i className="fas fa-plus"></i></button></div>
                    <div className="bg-white border rounded overflow-hidden">
                        <table className="w-full text-xs md:text-sm text-left"><thead className="bg-gray-50 border-b text-[10px] md:text-xs text-gray-500"><tr><th className="px-4 py-3">Topic Title</th><th className="px-4 py-3 w-32 text-right">Status</th></tr></thead><tbody className="divide-y">{topics.map(t => <tr key={t.id} className="hover:bg-gray-50"><td className="px-4 py-3 font-medium"><TableCell label="Topic" value={t.title} onUpdate={() => {}} onDelete={() => del(t.id)} /></td><td className="px-4 py-3 text-right text-xs text-gray-400">Created</td></tr>)}</tbody></table>
                        {topics.length === 0 && <div className="p-6 text-center text-gray-400 italic text-xs">No topics defined. Add one to start adding content later.</div>}
                    </div>
                    {isModalOpen && <SimpleInputModal title="New Topic" onClose={() => setIsModalOpen(false)} onSave={create} />}
                </div>
            );
        }

        // --- CONTENT MANAGER SECTION ---
        function ContentManagerLanding() {
            const [classes, setClasses] = useState([]);
            const [selectedClass, setSelectedClass] = useState(null);
            useEffect(() => { fetch('/api/classes').then(r => r.json()).then(setClasses); }, []);

            if (selectedClass) return <ContentClassView cls={selectedClass} onBack={() => setSelectedClass(null)} />;

            return (
                <div className="w-full max-w-5xl mx-auto">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Content Manager</h2>
                    <div className="bg-white border rounded overflow-hidden">
                        <table className="w-full text-xs md:text-sm text-left"><thead className="bg-gray-50 border-b text-[10px] md:text-xs text-gray-500"><tr><th className="px-4 py-3">Select Class to Manage Content</th><th className="px-4 py-3 text-right"></th></tr></thead><tbody className="divide-y">{classes.map(c => <tr key={c.id} onClick={() => setSelectedClass(c)} className="hover:bg-blue-50 cursor-pointer group"><td className="px-4 py-3 font-medium text-gray-700 group-hover:text-blue-700">{c.name}</td><td className="px-4 py-3 text-right"><i className="fas fa-chevron-right text-gray-300"></i></td></tr>)}</tbody></table>
                    </div>
                </div>
            );
        }

        function ContentClassView({ cls, onBack }) {
            const [subjects, setSubjects] = useState([]);
            const [selSubject, setSelSubject] = useState(null);
            useEffect(() => { fetch(\`/api/subjects?class_id=\${cls.id}\`).then(r => r.json()).then(setSubjects); }, [cls]);

            if (selSubject) return <ContentSubjectView subject={selSubject} onBack={() => setSelSubject(null)} />;

            return (
                <div className="w-full max-w-5xl mx-auto">
                    <div className="flex items-center mb-4"><button onClick={onBack} className="text-gray-400 hover:text-blue-600 mr-2"><i className="fas fa-arrow-left"></i></button><h2 className="text-lg font-bold">{cls.name} <span className="text-gray-400 font-normal">/ Select Subject</span></h2></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{subjects.map(s => <div key={s.id} onClick={() => setSelSubject(s)} className="bg-white border p-4 rounded hover:border-blue-400 hover:shadow-sm cursor-pointer transition"><h3 className="font-bold text-gray-800">{s.name}</h3><p className="text-xs text-gray-500 mt-1">Manage Chapters & Topics</p></div>)}</div>
                </div>
            );
        }

        function ContentSubjectView({ subject, onBack }) {
            const [chapters, setChapters] = useState([]);
            const [activeChapter, setActiveChapter] = useState(null);
            const [topics, setTopics] = useState([]);
            const [selTopic, setSelTopic] = useState(null);

            useEffect(() => { fetch(\`/api/chapters?subject_id=\${subject.id}\`).then(r => r.json()).then(setChapters); }, [subject]);
            const loadTopics = (ch) => { setActiveChapter(ch); fetch(\`/api/topics?chapter_id=\${ch.id}\`).then(r => r.json()).then(setTopics); };

            if (selTopic) return <TopicContentEditor topic={selTopic} onBack={() => setSelTopic(null)} />;

            return (
                <div className="w-full flex flex-col md:flex-row gap-6 h-[calc(100vh-140px)]">
                    <div className="w-full md:w-64 bg-white border rounded overflow-hidden flex flex-col">
                        <div className="p-3 border-b bg-gray-50 flex items-center"><button onClick={onBack} className="mr-2 text-gray-400"><i className="fas fa-arrow-left"></i></button><span className="font-bold text-xs uppercase text-gray-500">Chapters</span></div>
                        <div className="flex-1 overflow-y-auto">{chapters.map(c => <button key={c.id} onClick={() => loadTopics(c)} className={\`w-full text-left px-4 py-3 text-sm border-b \${activeChapter?.id === c.id ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-50'}\`}>{c.title}</button>)}</div>
                    </div>
                    <div className="flex-1 bg-white border rounded p-4 overflow-y-auto">
                        {!activeChapter ? <div className="h-full flex items-center justify-center text-gray-400 text-sm">Select a chapter to see topics.</div> : 
                        <>
                            <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">{activeChapter.title} / Topics</h3>
                            <div className="space-y-2">{topics.map(t => <div key={t.id} onClick={() => setSelTopic(t)} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50 cursor-pointer group"><span className="font-medium text-sm">{t.title}</span><span className="text-xs text-blue-600 opacity-0 group-hover:opacity-100">Edit Content <i className="fas fa-arrow-right ml-1"></i></span></div>)}</div>
                            {topics.length === 0 && <div className="text-center text-gray-400 text-sm py-10">No topics in this chapter.</div>}
                        </>}
                    </div>
                </div>
            );
        }

        function TopicContentEditor({ topic, onBack }) {
            const [content, setContent] = useState(topic.content || '');
            const [questions, setQuestions] = useState([]);
            const [activeTab, setActiveTab] = useState('notes');
            const [isQModalOpen, setIsQModalOpen] = useState(false);

            useEffect(() => { fetch(\`/api/questions?topic_id=\${topic.id}\`).then(r => r.json()).then(setQuestions); }, [topic]);
            
            const saveNotes = async () => { await fetch('/api/topics', { method: 'POST', body: JSON.stringify({ ...topic, content, order_num: topic.order_num }) }); alert('Notes Saved'); };
            const addQuestion = async (data) => { await fetch('/api/questions', { method: 'POST', body: JSON.stringify({ ...data, topic_id: topic.id }) }); setIsQModalOpen(false); fetch(\`/api/questions?topic_id=\${topic.id}\`).then(r => r.json()).then(setQuestions); };
            const delQuestion = async (id) => { await fetch('/api/request', { method: 'DELETE', body: JSON.stringify({ type: 'question', id }) }); fetch(\`/api/questions?topic_id=\${topic.id}\`).then(r => r.json()).then(setQuestions); };

            return (
                <div className="w-full h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4"><div className="flex items-center"><button onClick={onBack} className="text-gray-400 hover:text-blue-600 mr-2"><i className="fas fa-arrow-left"></i></button><h2 className="text-lg font-bold">{topic.title}</h2></div><div className="flex bg-white border rounded p-1"><button onClick={() => setActiveTab('notes')} className={\`px-3 py-1 text-xs font-bold rounded \${activeTab === 'notes' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'}\`}>Notes</button><button onClick={() => setActiveTab('questions')} className={\`px-3 py-1 text-xs font-bold rounded \${activeTab === 'questions' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'}\`}>Questions ({questions.length})</button></div></div>
                    {activeTab === 'notes' ? (
                        <div className="flex-1 flex flex-col bg-white border rounded p-4">
                            <textarea className="flex-1 w-full border-none outline-none resize-none font-mono text-sm" placeholder="# Write content in Markdown..." value={content} onChange={e => setContent(e.target.value)}></textarea>
                            <div className="flex justify-end pt-4 border-t"><button onClick={saveNotes} className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">Save Content</button></div>
                        </div>
                    ) : (
                        <div className="flex-1 bg-white border rounded flex flex-col">
                            <div className="p-4 border-b flex justify-between items-center"><h3 className="font-bold text-sm">Question Bank</h3><button onClick={() => setIsQModalOpen(true)} className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded hover:bg-blue-700"><i className="fas fa-plus mr-1"></i> Add Question</button></div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">{questions.map((q, i) => <div key={q.id} className="p-3 border rounded bg-gray-50 relative group"><div className="flex justify-between mb-1"><span className="text-[10px] font-bold text-blue-600 uppercase">{q.type}</span><div className="flex gap-2"><span className="text-[10px] text-gray-400">{q.metadata?.board}</span><button onClick={() => delQuestion(q.id)} className="text-red-400 hover:text-red-600 text-xs opacity-0 group-hover:opacity-100"><i className="fas fa-trash"></i></button></div></div><p className="text-sm font-medium text-gray-800">{q.question_text}</p></div>)}</div>
                        </div>
                    )}
                    {isQModalOpen && <CreateQuestionModal onClose={() => setIsQModalOpen(false)} onSave={addQuestion} />}
                </div>
            );
        }

        // --- UTILS & MODALS ---
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
        function SettingsManager() {
            const handleReset = async () => { if (confirm("Permanently delete ALL data?")) { await fetch('/api/reset-db', { method: 'POST' }); window.location.reload(); } };
            return <div className="max-w-xl bg-white p-6 rounded shadow-sm border border-red-100"><h2 className="text-lg font-bold mb-4">Danger Zone</h2><Button variant="danger" size="sm" onClick={handleReset}>Reset Database</Button></div>;
        }
`;


