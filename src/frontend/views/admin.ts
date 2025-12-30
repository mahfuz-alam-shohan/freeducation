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
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Class Management</h2>
                        <button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-600 text-white w-8 h-8 rounded hover:bg-blue-700 flex items-center justify-center transition" title="Add New Class"><i className="fas fa-plus"></i></button>
                    </div>
                    <div className="bg-white border border-gray-300 overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-800">
                            <thead className="bg-gray-100 border-b border-gray-300 font-semibold text-gray-700">
                                <tr>
                                    <th className="px-4 py-3 border-r border-gray-200 w-16">ID</th>
                                    <th className="px-4 py-3 border-r border-gray-200">Class Name</th>
                                    <th className="px-4 py-3 border-r border-gray-200">Type</th>
                                    <th className="px-4 py-3 text-right w-40">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {classes.length === 0 ? <tr><td colSpan="4" className="px-4 py-8 text-center text-gray-500 italic">No classes found.</td></tr> : classes.map((cls) => (
                                    <tr key={cls.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 border-r border-gray-200 font-mono text-xs">{cls.id}</td>
                                        <td className="px-4 py-3 border-r border-gray-200 font-medium">{cls.name}</td>
                                        <td className="px-4 py-3 border-r border-gray-200">{cls.parent_class_id ? <span className="text-orange-600"><i className="fas fa-link text-xs mr-1"></i>Linked</span> : <span className="text-green-600"><i className="fas fa-database text-xs mr-1"></i>Original</span>}</td>
                                        <td className="px-4 py-3 text-right"><div className="flex justify-end gap-3"><button onClick={() => setLinkModalClass(cls)} className="text-gray-400 hover:text-blue-600" title="Link"><i className="fas fa-link"></i></button>{!cls.parent_class_id && <button onClick={() => setSelectedClass(cls)} className="text-blue-600 hover:underline text-xs font-semibold">Manage</button>}</div></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {isCreateModalOpen && <CreateClassModal onClose={() => setIsCreateModalOpen(false)} onSave={handleCreateClass} />}
                    {linkModalClass && <LinkClassModal cls={linkModalClass} allClasses={classes} onClose={() => setLinkModalClass(null)} onSave={saveLink} />}
                </div>
            );
        }

        function CreateClassModal({ onClose, onSave }) {
            const [name, setName] = useState('');
            return <Modal isOpen={true} onClose={onClose} title="Create New Class"><div className="mb-4"><Input label="Class Name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Class 11" autoFocus /></div><div className="flex justify-end gap-2 mt-6"><Button variant="ghost" onClick={onClose}>Cancel</Button><Button size="md" onClick={() => onSave(name)}>Create</Button></div></Modal>;
        }

        function LinkClassModal({ cls, allClasses, onClose, onSave }) {
            const [parentId, setParentId] = useState(cls.parent_class_id || '');
            const [label, setLabel] = useState(cls.program_label || '');
            return <Modal isOpen={true} onClose={onClose} title="Content Linking"><div className="bg-blue-50 p-4 rounded-lg mb-4 text-blue-800 text-sm"><i className="fas fa-info-circle mr-2"></i>Link <strong>{cls.name}</strong> to merge content.</div><div className="mb-4"><label className="block text-xs font-bold text-gray-700 mb-1">Source Class</label><select className="w-full border p-2 rounded text-sm" value={parentId} onChange={e => setParentId(e.target.value)}><option value="">-- Independent --</option>{allClasses.filter(c => c.id !== cls.id).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>{parentId && <Input label="Label" value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. SSC" />}<div className="flex justify-end mt-4 gap-2"><Button variant="ghost" onClick={onClose}>Cancel</Button><Button size="md" onClick={() => onSave(parentId, label)}>Save</Button></div></Modal>;
        }

        function ClassDetail({ cls, onBack }) {
            const [groups, setGroups] = useState([]);
            const [subjects, setSubjects] = useState([]);
            const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
            const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
            const [selectedSubject, setSelectedSubject] = useState(null);

            useEffect(() => { refreshData(); }, [cls]);
            const refreshData = async () => { const [gRes, sRes] = await Promise.all([fetch(\`/api/groups?class_id=\${cls.id}\`), fetch(\`/api/subjects?class_id=\${cls.id}\`)]); setGroups(await gRes.json()); setSubjects(await sRes.json()); };
            
            const handleCreateGroup = async (name) => { await fetch('/api/groups', { method: 'POST', body: JSON.stringify({ name, class_id: cls.id }) }); setIsGroupModalOpen(false); refreshData(); };
            const handleCreateSubject = async (data) => { await fetch('/api/subjects', { method: 'POST', body: JSON.stringify({ ...data, class_id: cls.id }) }); setIsSubjectModalOpen(false); refreshData(); };

            if (selectedSubject) return <SubjectManager subject={selectedSubject} onBack={() => setSelectedSubject(null)} />;

            return (
                <div className="w-full">
                     <div className="flex items-center mb-6"><button onClick={onBack} className="text-gray-500 hover:text-blue-600 mr-2"><i className="fas fa-arrow-left"></i></button><h2 className="text-xl font-bold text-gray-800">{cls.name} / Content</h2></div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Groups Table */}
                        <div className="md:col-span-1">
                            <div className="flex justify-between items-center mb-2"><h3 className="font-bold text-gray-700">Groups</h3><button onClick={() => setIsGroupModalOpen(true)} className="text-blue-600 hover:bg-blue-50 px-2 rounded"><i className="fas fa-plus"></i></button></div>
                            <div className="bg-white border border-gray-300">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-100 border-b"><tr><th className="px-3 py-2">Name</th></tr></thead>
                                    <tbody className="divide-y">{groups.map(g => <tr key={g.id}><td className="px-3 py-2">{g.name}</td></tr>)}</tbody>
                                </table>
                                {groups.length === 0 && <div className="p-3 text-center text-gray-400 text-xs">No groups.</div>}
                            </div>
                        </div>

                        {/* Subjects Table */}
                        <div className="md:col-span-2">
                             <div className="flex justify-between items-center mb-2"><h3 className="font-bold text-gray-700">Subjects</h3><button onClick={() => setIsSubjectModalOpen(true)} className="text-blue-600 hover:bg-blue-50 px-2 rounded"><i className="fas fa-plus"></i></button></div>
                             <div className="bg-white border border-gray-300">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-100 border-b"><tr><th className="px-3 py-2 border-r">Name</th><th className="px-3 py-2 border-r">Group</th><th className="px-3 py-2 text-right">Action</th></tr></thead>
                                    <tbody className="divide-y">
                                        {subjects.map(s => (
                                            <tr key={s.id} className="hover:bg-gray-50">
                                                <td className="px-3 py-2 border-r font-medium">{s.name}</td>
                                                <td className="px-3 py-2 border-r text-gray-500 text-xs">{s.is_common ? 'Common' : groups.find(g => g.id == s.group_id)?.name || '-'}</td>
                                                <td className="px-3 py-2 text-right"><button onClick={() => setSelectedSubject(s)} className="text-blue-600 hover:underline text-xs">Open</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {subjects.length === 0 && <div className="p-3 text-center text-gray-400 text-xs">No subjects.</div>}
                            </div>
                        </div>
                     </div>
                     
                     {isGroupModalOpen && <CreateGroupModal onClose={() => setIsGroupModalOpen(false)} onSave={handleCreateGroup} />}
                     {isSubjectModalOpen && <CreateSubjectModal groups={groups} onClose={() => setIsSubjectModalOpen(false)} onSave={handleCreateSubject} />}
                </div>
            );
        }

        function CreateGroupModal({ onClose, onSave }) {
            const [name, setName] = useState('');
            return <Modal isOpen={true} onClose={onClose} title="Add Group"><Input label="Group Name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Science" autoFocus /><div className="flex justify-end gap-2 mt-4"><Button variant="ghost" onClick={onClose}>Cancel</Button><Button size="md" onClick={() => onSave(name)}>Save</Button></div></Modal>;
        }

        function CreateSubjectModal({ groups, onClose, onSave }) {
            const [name, setName] = useState('');
            const [isCommon, setIsCommon] = useState(true);
            const [groupId, setGroupId] = useState('');
            return <Modal isOpen={true} onClose={onClose} title="Add Subject">
                <div className="mb-3"><Input label="Subject Name" value={name} onChange={e => setName(e.target.value)} placeholder="Physics" autoFocus /></div>
                <div className="flex items-center gap-2 mb-3"><input type="checkbox" checked={isCommon} onChange={e => setIsCommon(e.target.checked)} id="common" /><label htmlFor="common" className="text-sm">Common Subject (All Groups)</label></div>
                {!isCommon && <div className="mb-3"><label className="block text-xs font-bold mb-1">Group</label><select className="w-full border p-2 rounded text-sm" value={groupId} onChange={e => setGroupId(e.target.value)}><option value="">Select Group</option>{groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}</select></div>}
                <div className="flex justify-end gap-2 mt-4"><Button variant="ghost" onClick={onClose}>Cancel</Button><Button size="md" onClick={() => onSave({ name, is_common: isCommon, group_id: groupId })}>Save</Button></div>
            </Modal>;
        }

        function SubjectManager({ subject, onBack }) {
            const [chapters, setChapters] = useState([]);
            const [selectedChapter, setSelectedChapter] = useState(null);
            const [isModalOpen, setIsModalOpen] = useState(false);

            useEffect(() => { loadChapters(); }, [subject]);
            const loadChapters = () => fetch(\`/api/chapters?subject_id=\${subject.id}\`).then(r => r.json()).then(setChapters);
            const handleCreate = async (data) => { await fetch('/api/chapters', { method: 'POST', body: JSON.stringify({ ...data, subject_id: subject.id, order_num: data.order || chapters.length + 1 }) }); setIsModalOpen(false); loadChapters(); };

            if (selectedChapter) return <TopicManager chapter={selectedChapter} onBack={() => setSelectedChapter(null)} />;

            return (
                <div className="w-full">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center"><button onClick={onBack} className="text-gray-500 hover:text-blue-600 mr-2"><i className="fas fa-arrow-left"></i></button><h2 className="text-xl font-bold text-gray-800">{subject.name} / Chapters</h2></div>
                        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white w-8 h-8 rounded hover:bg-blue-700 flex items-center justify-center transition"><i className="fas fa-plus"></i></button>
                    </div>
                    <div className="bg-white border border-gray-300">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-100 border-b"><tr><th className="px-4 py-3 border-r w-16">#</th><th className="px-4 py-3 border-r">Chapter Title</th><th className="px-4 py-3 text-right w-24">Action</th></tr></thead>
                            <tbody className="divide-y">{chapters.map(ch => (
                                <tr key={ch.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 border-r font-mono text-xs text-gray-500">{ch.order_num}</td>
                                    <td className="px-4 py-3 border-r font-medium">{ch.title}</td>
                                    <td className="px-4 py-3 text-right"><button onClick={() => setSelectedChapter(ch)} className="text-blue-600 hover:underline text-xs">Manage</button></td>
                                </tr>
                            ))}</tbody>
                        </table>
                        {chapters.length === 0 && <div className="p-6 text-center text-gray-400 italic">No chapters added yet.</div>}
                    </div>
                    {isModalOpen && <CreateChapterModal onClose={() => setIsModalOpen(false)} onSave={handleCreate} />}
                </div>
            );
        }

        function CreateChapterModal({ onClose, onSave }) {
            const [title, setTitle] = useState('');
            const [order, setOrder] = useState('');
            return <Modal isOpen={true} onClose={onClose} title="Add Chapter"><div className="flex gap-2 mb-3"><div className="w-20"><Input label="Order" type="number" value={order} onChange={e => setOrder(e.target.value)} placeholder="#" /></div><div className="flex-1"><Input label="Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Chapter Name" autoFocus /></div></div><div className="flex justify-end gap-2 mt-4"><Button variant="ghost" onClick={onClose}>Cancel</Button><Button size="md" onClick={() => onSave({ title, order })}>Save</Button></div></Modal>;
        }

        function TopicManager({ chapter, onBack }) {
            const [topics, setTopics] = useState([]);
            const [selectedTopic, setSelectedTopic] = useState(null);
            const [isModalOpen, setIsModalOpen] = useState(false);

            useEffect(() => { loadTopics(); }, [chapter]);
            const loadTopics = () => fetch(\`/api/topics?chapter_id=\${chapter.id}\`).then(r => r.json()).then(setTopics);
            const handleCreate = async (data) => { await fetch('/api/topics', { method: 'POST', body: JSON.stringify({ ...data, chapter_id: chapter.id, order_num: topics.length + 1 }) }); setIsModalOpen(false); loadTopics(); };

            if (selectedTopic) return <QuestionManager topic={selectedTopic} onBack={() => setSelectedTopic(null)} />;
            return (
                <div className="w-full">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center"><button onClick={onBack} className="text-gray-500 hover:text-blue-600 mr-2"><i className="fas fa-arrow-left"></i></button><h2 className="text-xl font-bold text-gray-800">{chapter.title} / Topics</h2></div>
                        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white w-8 h-8 rounded hover:bg-blue-700 flex items-center justify-center transition"><i className="fas fa-plus"></i></button>
                    </div>
                    <div className="bg-white border border-gray-300">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-100 border-b"><tr><th className="px-4 py-3 border-r">Topic Title</th><th className="px-4 py-3 border-r">Content Preview</th><th className="px-4 py-3 text-right w-24">Action</th></tr></thead>
                            <tbody className="divide-y">{topics.map(t => (
                                <tr key={t.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 border-r font-medium">{t.title}</td>
                                    <td className="px-4 py-3 border-r text-gray-500 truncate max-w-xs">{t.content || '-'}</td>
                                    <td className="px-4 py-3 text-right"><button onClick={() => setSelectedTopic(t)} className="text-blue-600 hover:underline text-xs">Questions</button></td>
                                </tr>
                            ))}</tbody>
                        </table>
                        {topics.length === 0 && <div className="p-6 text-center text-gray-400 italic">No topics added yet.</div>}
                    </div>
                    {isModalOpen && <CreateTopicModal onClose={() => setIsModalOpen(false)} onSave={handleCreate} />}
                </div>
            );
        }

        function CreateTopicModal({ onClose, onSave }) {
            const [title, setTitle] = useState('');
            const [content, setContent] = useState('');
            return <Modal isOpen={true} onClose={onClose} title="Add Topic"><div className="mb-3"><Input label="Title" value={title} onChange={e => setTitle(e.target.value)} autoFocus /></div><div className="mb-3"><label className="block text-xs font-bold mb-1">Content (Markdown)</label><textarea className="w-full border p-2 rounded text-sm h-32" value={content} onChange={e => setContent(e.target.value)}></textarea></div><div className="flex justify-end gap-2 mt-4"><Button variant="ghost" onClick={onClose}>Cancel</Button><Button size="md" onClick={() => onSave({ title, content })}>Save</Button></div></Modal>;
        }

        function QuestionManager({ topic, onBack }) {
            const [questions, setQuestions] = useState([]);
            const [isModalOpen, setIsModalOpen] = useState(false);

            useEffect(() => { loadQs(); }, [topic]);
            const loadQs = () => fetch(\`/api/questions?topic_id=\${topic.id}\`).then(r => r.json()).then(setQuestions);
            const handleCreate = async (data) => { await fetch('/api/questions', { method: 'POST', body: JSON.stringify({ ...data, topic_id: topic.id }) }); setIsModalOpen(false); loadQs(); };

            return (
                <div className="w-full">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center"><button onClick={onBack} className="text-gray-500 hover:text-blue-600 mr-2"><i className="fas fa-arrow-left"></i></button><h2 className="text-xl font-bold text-gray-800">{topic.title} / Questions</h2></div>
                        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white w-8 h-8 rounded hover:bg-blue-700 flex items-center justify-center transition"><i className="fas fa-plus"></i></button>
                    </div>
                    <div className="bg-white border border-gray-300">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-100 border-b"><tr><th className="px-4 py-3 border-r w-16">Type</th><th className="px-4 py-3 border-r">Question</th><th className="px-4 py-3 border-r">Meta</th></tr></thead>
                            <tbody className="divide-y">{questions.map(q => (
                                <tr key={q.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 border-r font-bold text-xs text-gray-500">{q.type}</td>
                                    <td className="px-4 py-3 border-r font-medium">{q.question_text}</td>
                                    <td className="px-4 py-3 border-r text-xs text-gray-500">{q.metadata && q.metadata.board} {q.metadata && q.metadata.year}</td>
                                </tr>
                            ))}</tbody>
                        </table>
                        {questions.length === 0 && <div className="p-6 text-center text-gray-400 italic">No questions added yet.</div>}
                    </div>
                    {isModalOpen && <CreateQuestionModal onClose={() => setIsModalOpen(false)} onSave={handleCreate} />}
                </div>
            );
        }

        function CreateQuestionModal({ onClose, onSave }) {
            const [type, setType] = useState('MCQ');
            const [text, setText] = useState('');
            const [options, setOptions] = useState(['', '', '', '']);
            const [answer, setAnswer] = useState('');
            const [board, setBoard] = useState('');
            const [year, setYear] = useState('');

            const updateOption = (i, v) => { const n = [...options]; n[i] = v; setOptions(n); };

            return <Modal isOpen={true} onClose={onClose} title="Add Question">
                <div className="flex gap-2 mb-3 border-b pb-2"><button onClick={() => setType('MCQ')} className={\`px-3 py-1 rounded text-xs font-bold \${type==='MCQ'?'bg-blue-100 text-blue-700':'text-gray-500'}\`}>MCQ</button><button onClick={() => setType('CQ')} className={\`px-3 py-1 rounded text-xs font-bold \${type==='CQ'?'bg-blue-100 text-blue-700':'text-gray-500'}\`}>CQ</button></div>
                <div className="flex gap-2 mb-3"><div className="flex-1"><Input label="Board" value={board} onChange={e => setBoard(e.target.value)} placeholder="Dhaka" /></div><div className="w-24"><Input label="Year" value={year} onChange={e => setYear(e.target.value)} placeholder="2023" /></div></div>
                <div className="mb-3"><label className="block text-xs font-bold mb-1">Question</label><textarea className="w-full border p-2 rounded text-sm h-20" value={text} onChange={e => setText(e.target.value)}></textarea></div>
                {type === 'MCQ' ? <div className="space-y-2 mb-3">{options.map((o, i) => <div key={i} className="flex items-center gap-2"><span className="text-xs font-bold w-4">{String.fromCharCode(65+i)}</span><input className="flex-1 border p-1.5 rounded text-sm" value={o} onChange={e => updateOption(i, e.target.value)} /><input type="radio" name="ans" checked={answer===o && o!==''} onChange={() => setAnswer(o)} /></div>)}</div> : <div className="mb-3"><label className="block text-xs font-bold mb-1">Answer Key</label><textarea className="w-full border p-2 rounded text-sm h-20" value={answer} onChange={e => setAnswer(e.target.value)}></textarea></div>}
                <div className="flex justify-end gap-2 mt-4"><Button variant="ghost" onClick={onClose}>Cancel</Button><Button size="md" onClick={() => onSave({ type, question_text: text, options: type==='MCQ'?options:[], answer, metadata: { board, year } })}>Save</Button></div>
            </Modal>;
        }

        function SettingsManager() {
            const handleReset = async () => { if (confirm("Permanently delete ALL data?")) { await fetch('/api/reset-db', { method: 'POST' }); window.location.reload(); } };
            return (
                <div className="max-w-xl bg-white p-6 rounded-xl shadow-sm border border-red-100"><h2 className="text-lg font-bold mb-4">System Danger Zone</h2><p className="text-gray-600 text-sm mb-4">Irreversible actions are performed here. Proceed with caution.</p><Button variant="danger" size="sm" onClick={handleReset}>Reset Database</Button></div>
            );
        }
`;


