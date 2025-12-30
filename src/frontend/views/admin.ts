export const adminComponents = `
        function AdminDashboard({ user, logout }) {
            const [activeTab, setActiveTab] = useState('classes');

            return (
                <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] bg-gray-50">
                    {/* DESKTOP SIDEBAR */}
                    <div className="hidden md:flex flex-col w-72 bg-white border-r border-gray-200 sticky top-16 h-[calc(100vh-64px)]">
                        <nav className="p-4 space-y-2 flex-1 overflow-y-auto mt-4">
                            <AdminNavItem icon="fas fa-layer-group" label="Classes & Content" active={activeTab === 'classes'} onClick={() => setActiveTab('classes')} />
                            <AdminNavItem icon="fas fa-cogs" label="System Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                        </nav>
                        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                            <button onClick={logout} className="flex items-center justify-center text-red-600 hover:bg-red-50 hover:text-red-700 font-medium text-sm transition w-full py-2.5 rounded-lg border border-transparent hover:border-red-100">
                                <i className="fas fa-sign-out-alt mr-2"></i> Logout
                            </button>
                        </div>
                    </div>

                    {/* MOBILE BOTTOM NAV */}
                    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 flex justify-around p-2 pb-5 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                        <MobileNavItem icon="fas fa-layer-group" label="Classes" active={activeTab === 'classes'} onClick={() => setActiveTab('classes')} />
                        <MobileNavItem icon="fas fa-cogs" label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                        <button onClick={logout} className="flex flex-col items-center justify-center w-full p-2 active:scale-95 transition-transform text-red-500">
                             <div className="w-12 h-8 flex items-center justify-center rounded-full mb-1"><i className="fas fa-sign-out-alt text-lg"></i></div>
                             <span className="text-[10px] font-medium">Logout</span>
                        </button>
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1 p-4 md:p-8 w-full overflow-x-hidden pb-24 md:pb-8">
                        {activeTab === 'classes' && <ClassManager />}
                        {activeTab === 'settings' && <SettingsManager />}
                    </div>
                </div>
            );
        }

        const AdminNavItem = ({ icon, label, active, onClick }) => (
            <button onClick={onClick} className={\`w-full flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 \${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}\`}>
                <i className={\`\${icon} w-6 text-center mr-3 text-lg \${active ? 'text-white' : 'text-gray-400'}\`}></i> {label}
            </button>
        );

        const MobileNavItem = ({ icon, label, active, onClick }) => (
            <button onClick={onClick} className={\`flex flex-col items-center justify-center w-full p-2 active:scale-95 transition-transform \${active ? 'text-blue-600' : 'text-gray-400'}\`}>
                <div className={\`w-12 h-8 flex items-center justify-center rounded-full mb-1 transition-colors \${active ? 'bg-blue-50' : 'bg-transparent'}\`}><i className={\`\${icon} text-lg\`}></i></div>
                <span className="text-[10px] font-medium">{label}</span>
            </button>
        );

        function ClassManager() {
            const [classes, setClasses] = useState([]);
            const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
            const [selectedClass, setSelectedClass] = useState(null);
            const [linkModalClass, setLinkModalClass] = useState(null);

            useEffect(() => { loadClasses(); }, []);
            const loadClasses = () => fetch('/api/classes').then(r => r.json()).then(setClasses);

            const handleCreateClass = async (name) => {
                if (!name) return;
                await fetch('/api/classes', { method: 'POST', body: JSON.stringify({ name }) });
                setIsCreateModalOpen(false);
                loadClasses();
            };

            const saveLink = async (parentId, label) => {
                await fetch('/api/classes', { method: 'PUT', body: JSON.stringify({ id: linkModalClass.id, parent_class_id: parentId, program_label: label }) });
                setLinkModalClass(null); loadClasses();
            };

            if (selectedClass) return <ClassDetail cls={selectedClass} onBack={() => setSelectedClass(null)} />;

            return (
                <div className="w-full">
                    <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Class Management</h2>
                            <p className="text-gray-500 text-sm mt-1">Manage your academic structure.</p>
                        </div>
                        <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
                            <i className="fas fa-plus mr-2"></i> Add Class
                        </Button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-600">
                                <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-500 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4">ID</th>
                                        <th className="px-6 py-4">Class Name</th>
                                        <th className="px-6 py-4">Type</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {classes.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-8 text-center text-gray-400 italic">
                                                No classes found. Add one to get started.
                                            </td>
                                        </tr>
                                    ) : (
                                        classes.map((cls) => (
                                            <tr key={cls.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 font-mono text-xs text-gray-400">#{cls.id}</td>
                                                <td className="px-6 py-4 font-bold text-gray-800 text-base">{cls.name}</td>
                                                <td className="px-6 py-4">
                                                    {cls.parent_class_id ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                            <i className="fas fa-link mr-1.5"></i> Linked: {cls.parent_name}
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            <i className="fas fa-database mr-1.5"></i> Original Source
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <button 
                                                        onClick={() => setLinkModalClass(cls)}
                                                        className="text-gray-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition" 
                                                        title="Link Content"
                                                    >
                                                        <i className="fas fa-link"></i>
                                                    </button>
                                                    {!cls.parent_class_id && (
                                                        <button 
                                                            onClick={() => setSelectedClass(cls)}
                                                            className="text-blue-600 hover:text-blue-800 font-bold text-xs bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
                                                        >
                                                            Manage <i className="fas fa-arrow-right ml-1"></i>
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {isCreateModalOpen && <CreateClassModal onClose={() => setIsCreateModalOpen(false)} onSave={handleCreateClass} />}
                    {linkModalClass && <LinkClassModal cls={linkModalClass} allClasses={classes} onClose={() => setLinkModalClass(null)} onSave={saveLink} />}
                </div>
            );
        }

        function CreateClassModal({ onClose, onSave }) {
            const [name, setName] = useState('');
            return (
                <Modal isOpen={true} onClose={onClose} title="Create New Class">
                    <div className="mb-4">
                        <Input label="Class Name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Class 11" autoFocus />
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <Button variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button size="md" onClick={() => onSave(name)}>Create Class</Button>
                    </div>
                </Modal>
            );
        }

        function LinkClassModal({ cls, allClasses, onClose, onSave }) {
            const [parentId, setParentId] = useState(cls.parent_class_id || '');
            const [label, setLabel] = useState(cls.program_label || '');
            return (
                <Modal isOpen={true} onClose={onClose} title="Content Linking">
                    <div className="bg-blue-50 p-4 rounded-lg mb-4 text-blue-800 text-sm"><i className="fas fa-info-circle mr-2"></i>Linking <strong>{cls.name}</strong> allows merging batches.</div>
                    <div className="mb-4"><label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Source Class</label><select className="w-full border border-gray-300 p-2.5 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none" value={parentId} onChange={e => setParentId(e.target.value)}><option value="">-- No Link (Independent) --</option>{allClasses.filter(c => c.id !== cls.id).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                    {parentId && <Input label="Program Label (Optional)" value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. SSC 2024" />}
                    <div className="flex justify-end mt-6 gap-2"><Button variant="ghost" onClick={onClose}>Cancel</Button><Button size="md" onClick={() => onSave(parentId, label)}>Save Configuration</Button></div>
                </Modal>
            );
        }

        function ClassDetail({ cls, onBack }) {
            const [groups, setGroups] = useState([]);
            const [subjects, setSubjects] = useState([]);
            const [newGroupName, setNewGroupName] = useState('');
            const [newSubject, setNewSubject] = useState({ name: '', is_common: true, group_id: '' });
            const [selectedSubject, setSelectedSubject] = useState(null);

            useEffect(() => { refreshData(); }, [cls]);
            const refreshData = async () => {
                const [gRes, sRes] = await Promise.all([fetch(\`/api/groups?class_id=\${cls.id}\`), fetch(\`/api/subjects?class_id=\${cls.id}\`)]);
                setGroups(await gRes.json()); setSubjects(await sRes.json());
            };
            const addGroup = async () => { if (!newGroupName) return; await fetch('/api/groups', { method: 'POST', body: JSON.stringify({ name: newGroupName, class_id: cls.id }) }); setNewGroupName(''); refreshData(); };
            const addSubject = async () => { if (!newSubject.name) return; await fetch('/api/subjects', { method: 'POST', body: JSON.stringify({ ...newSubject, class_id: cls.id }) }); setNewSubject({ name: '', is_common: true, group_id: '' }); refreshData(); };

            if (selectedSubject) return <SubjectManager subject={selectedSubject} onBack={() => setSelectedSubject(null)} />;

            return (
                <div className="w-full animate-fade-in">
                    <div className="flex items-center mb-6"><button onClick={onBack} className="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center mr-4 transition"><i className="fas fa-arrow-left text-gray-600"></i></button><div><h2 className="text-2xl font-bold text-gray-800">{cls.name}</h2><p className="text-gray-500 text-sm">Manage groups and subjects.</p></div></div>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-fit sticky top-24">
                            <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide flex justify-between items-center">Groups <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{groups.length}</span></h3>
                            <div className="flex gap-2 mb-6"><input className="border rounded-lg px-3 py-2 text-sm flex-1 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Science" value={newGroupName} onChange={e => setNewGroupName(e.target.value)} /><Button size="sm" onClick={addGroup}><i className="fas fa-plus"></i></Button></div>
                            <div className="space-y-2">{groups.map(g => <div key={g.id} className="px-4 py-3 bg-gray-50 rounded-xl text-sm font-medium text-gray-700 flex items-center border border-transparent hover:border-gray-200 transition"><div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>{g.name}</div>)}</div>
                        </div>
                        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                            <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-100">
                                <div className="flex flex-col sm:flex-row gap-3 mb-3"><input className="border rounded-lg px-4 py-2.5 flex-1 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter Subject Name" value={newSubject.name} onChange={e => setNewSubject({...newSubject, name: e.target.value})} /><Button size="md" onClick={addSubject} className="sm:w-32 w-full">Add Subject</Button></div>
                                <div className="flex flex-wrap items-center gap-4 pl-1"><label className="flex items-center cursor-pointer select-none"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded mr-2" checked={newSubject.is_common} onChange={e => setNewSubject({...newSubject, is_common: e.target.checked})} /><span className="text-sm text-gray-700 font-medium">Common Subject</span></label>{!newSubject.is_common && <select className="border rounded-lg px-3 py-1.5 text-sm flex-1 min-w-[150px] outline-none" value={newSubject.group_id} onChange={e => setNewSubject({...newSubject, group_id: e.target.value})}><option value="">Select Group...</option>{groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}</select>}</div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">{subjects.map(s => <div key={s.id} onClick={() => setSelectedSubject(s)} className="p-4 border rounded-xl hover:bg-blue-50 hover:border-blue-300 cursor-pointer flex flex-col justify-between transition-all group h-32 relative bg-gradient-to-br from-white to-gray-50"><div className="flex justify-between items-start"><span className="font-bold text-gray-800 text-lg group-hover:text-blue-700 line-clamp-2">{s.name}</span><i className="fas fa-chevron-right text-gray-300 group-hover:text-blue-400 transition"></i></div><div className="mt-auto"><span className={\`text-[10px] uppercase font-bold px-2 py-1 rounded-md \${s.is_common ? 'bg-indigo-100 text-indigo-700' : 'bg-purple-100 text-purple-700'}\`}>{s.is_common ? 'All Groups' : (groups.find(g => g.id == s.group_id)?.name || 'Specific Group')}</span></div></div>)}</div>
                        </div>
                    </div>
                </div>
            );
        }

        function SubjectManager({ subject, onBack }) {
            const [chapters, setChapters] = useState([]);
            const [selectedChapter, setSelectedChapter] = useState(null);
            const [newChapter, setNewChapter] = useState({ title: '', order: '' });

            useEffect(() => { loadChapters(); }, [subject]);
            const loadChapters = () => fetch(\`/api/chapters?subject_id=\${subject.id}\`).then(r => r.json()).then(setChapters);
            const addChapter = async () => { await fetch('/api/chapters', { method: 'POST', body: JSON.stringify({ title: newChapter.title, subject_id: subject.id, order_num: newChapter.order || chapters.length + 1 }) }); setNewChapter({ title: '', order: '' }); loadChapters(); };

            if (selectedChapter) return <TopicManager chapter={selectedChapter} onBack={() => setSelectedChapter(null)} />;
            return (
                <div className="w-full animate-fade-in max-w-6xl mx-auto">
                    <div className="flex items-center mb-6"><button onClick={onBack} className="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center mr-4 transition"><i className="fas fa-arrow-left text-gray-600"></i></button><h2 className="text-2xl font-bold text-gray-800">{subject.name} <span className="text-gray-400 font-normal">/ Chapters</span></h2></div>
                    <div className="bg-white p-4 rounded-xl border mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center shadow-sm"><input className="border rounded-lg px-3 py-2 w-full sm:w-20 text-center font-mono text-sm" placeholder="#" type="number" value={newChapter.order} onChange={e => setNewChapter({...newChapter, order: e.target.value})} /><input className="border rounded-lg px-4 py-2 flex-1 outline-none focus:ring-2 focus:ring-blue-500" placeholder="New Chapter Title" value={newChapter.title} onChange={e => setNewChapter({...newChapter, title: e.target.value})} /><Button size="md" onClick={addChapter} className="w-full sm:w-auto">Add Chapter</Button></div>
                    <div className="space-y-3">{chapters.map(ch => <div key={ch.id} onClick={() => setSelectedChapter(ch)} className="bg-white px-6 py-4 rounded-xl border border-gray-100 hover:border-blue-400 cursor-pointer flex items-center shadow-sm transition hover:shadow-md group"><span className="text-gray-300 font-black text-2xl mr-5 w-8 text-center group-hover:text-blue-200 transition">{ch.order_num}</span><div className="flex-1 font-bold text-gray-800 text-lg group-hover:text-blue-700 transition">{ch.title}</div><div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-blue-50 flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition"><i className="fas fa-chevron-right text-sm"></i></div></div>)}</div>
                </div>
            );
        }

        function TopicManager({ chapter, onBack }) {
            const [topics, setTopics] = useState([]);
            const [selectedTopic, setSelectedTopic] = useState(null);
            const [newTopic, setNewTopic] = useState({ title: '', content: '' });

            useEffect(() => { loadTopics(); }, [chapter]);
            const loadTopics = () => fetch(\`/api/topics?chapter_id=\${chapter.id}\`).then(r => r.json()).then(setTopics);
            const addTopic = async () => { await fetch('/api/topics', { method: 'POST', body: JSON.stringify({ ...newTopic, chapter_id: chapter.id, order_num: topics.length + 1 }) }); setNewTopic({ title: '', content: '' }); loadTopics(); };

            if (selectedTopic) return <QuestionManager topic={selectedTopic} onBack={() => setSelectedTopic(null)} />;
            return (
                <div className="w-full animate-fade-in max-w-6xl mx-auto">
                    <div className="flex items-center mb-6"><button onClick={onBack} className="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center mr-4 transition"><i className="fas fa-arrow-left text-gray-600"></i></button><h2 className="text-2xl font-bold text-gray-800">{chapter.title} <span className="text-gray-400 font-normal">/ Topics</span></h2></div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 mb-8 shadow-sm"><Input label="Topic Title" value={newTopic.title} onChange={e => setNewTopic({...newTopic, title: e.target.value})} placeholder="e.g. Introduction to Motion" /><div className="mb-4"><label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Content / Notes</label><textarea className="w-full border border-gray-300 rounded-lg p-3 h-32 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Write your study notes here using Markdown..." value={newTopic.content} onChange={e => setNewTopic({...newTopic, content: e.target.value})}></textarea></div><div className="flex justify-end"><Button size="md" onClick={addTopic}>Save Topic</Button></div></div>
                    <div className="space-y-3">{topics.map(t => <div key={t.id} onClick={() => setSelectedTopic(t)} className="bg-white px-6 py-4 rounded-xl border border-gray-100 hover:border-blue-400 cursor-pointer shadow-sm transition group"><h4 className="font-bold text-gray-800 text-lg group-hover:text-blue-700 mb-1">{t.title}</h4><p className="text-sm text-gray-500 truncate">{t.content || "No content preview"}</p></div>)}</div>
                </div>
            );
        }

        function QuestionManager({ topic, onBack }) {
            const [questions, setQuestions] = useState([]);
            const [qType, setQType] = useState('MCQ');
            const [newQ, setNewQ] = useState({ text: '', options: ['', '', '', ''], answer: '', metadata: { board: '', year: '' } });

            useEffect(() => { loadQs(); }, [topic]);
            const loadQs = () => fetch(\`/api/questions?topic_id=\${topic.id}\`).then(r => r.json()).then(setQuestions);
            const saveQuestion = async () => { await fetch('/api/questions', { method: 'POST', body: JSON.stringify({ type: qType, topic_id: topic.id, question_text: newQ.text, options: qType === 'MCQ' ? newQ.options : [], answer: newQ.answer, metadata: newQ.metadata }) }); setNewQ({ text: '', options: ['', '', '', ''], answer: '', metadata: { board: '', year: '' } }); loadQs(); };
            const updateOption = (idx, val) => { const opts = [...newQ.options]; opts[idx] = val; setNewQ({ ...newQ, options: opts }); };

            return (
                <div className="w-full animate-fade-in pb-20 max-w-6xl mx-auto">
                    <div className="flex items-center mb-6"><button onClick={onBack} className="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center mr-4 transition"><i className="fas fa-arrow-left text-gray-600"></i></button><h2 className="text-2xl font-bold text-gray-800">{topic.title} <span className="text-gray-400 font-normal">/ Questions</span></h2></div>
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm mb-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4 gap-4">
                            <div className="flex bg-gray-100 p-1.5 rounded-xl w-full sm:w-auto">{['MCQ', 'CQ'].map(t => <button key={t} onClick={() => setQType(t)} className={\`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-bold transition \${qType === t ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}\`}>{t}</button>)}</div>
                            <div className="flex gap-3 w-full sm:w-auto"><input className="flex-1 sm:w-24 border rounded-lg px-3 py-2 text-sm text-center" value={newQ.metadata.board} onChange={e => setNewQ({...newQ, metadata: {...newQ.metadata, board: e.target.value}})} placeholder="Board" /><input className="flex-1 sm:w-20 border rounded-lg px-3 py-2 text-sm text-center" value={newQ.metadata.year} onChange={e => setNewQ({...newQ, metadata: {...newQ.metadata, year: e.target.value}})} placeholder="Year" /></div>
                        </div>
                        <div className="mb-6"><label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Question Text</label><textarea className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" rows="3" placeholder="Enter the question here..." value={newQ.text} onChange={e => setNewQ({...newQ, text: e.target.value})}></textarea></div>
                        {qType === 'MCQ' ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">{newQ.options.map((opt, i) => <div key={i} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200"><span className="w-6 font-bold text-blue-500 text-sm bg-blue-100 rounded-full h-6 flex items-center justify-center">{String.fromCharCode(65+i)}</span><input className="flex-1 bg-transparent border-none outline-none text-sm" value={opt} onChange={e => updateOption(i, e.target.value)} placeholder={\`Option \${String.fromCharCode(65+i)}\`} /><input type="radio" name="correct" className="w-5 h-5 text-blue-600" checked={newQ.answer === opt && opt !== ''} onChange={() => setNewQ({...newQ, answer: opt})} /></div>)}</div> : <div className="mb-6"><label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Answer / Marking Scheme</label><textarea className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" rows="3" placeholder="Enter the answer key..." value={newQ.answer} onChange={e => setNewQ({...newQ, answer: e.target.value})}></textarea></div>}
                        <Button size="lg" className="w-full font-bold shadow-lg shadow-blue-200" onClick={saveQuestion}>Add Question</Button>
                    </div>
                    <div className="space-y-4">{questions.map((q, i) => <div key={q.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition"><div className="flex justify-between items-center mb-2"><span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded uppercase tracking-wider">{q.type}</span><span className="text-xs font-medium text-gray-400">{q.metadata && q.metadata.board} {q.metadata && q.metadata.year}</span></div><p className="font-medium text-gray-800 text-base">{q.question_text}</p></div>)}</div>
                </div>
            );
        }

        function SettingsManager() {
            const handleReset = async () => { if (confirm("Permanently delete ALL data?")) { await fetch('/api/reset-db', { method: 'POST' }); window.location.reload(); } };
            return (
                <div className="max-w-2xl bg-white p-8 rounded-2xl shadow-sm border border-red-100"><h2 className="text-xl font-bold mb-2 text-gray-800">System Danger Zone</h2><p className="text-gray-500 text-sm mb-6">Irreversible actions are performed here. Proceed with caution.</p><div className="flex items-center justify-between bg-red-50 p-4 rounded-xl border border-red-100"><div><h4 className="font-bold text-red-700 text-sm">Reset Database</h4><p className="text-red-500 text-xs mt-1">Deletes all subjects, questions, and admins.</p></div><Button variant="danger" size="sm" onClick={handleReset}>Reset Everything</Button></div></div>
            );
        }
`;


