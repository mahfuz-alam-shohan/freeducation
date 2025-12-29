export const studentComponents = `
        function StudentLandingPage() {
            const [classes, setClasses] = useState([]);
            const [searchQuery, setSearchQuery] = useState('');
            const [searchResults, setSearchResults] = useState([]);
            const [selectedClass, setSelectedClass] = useState(null);

            useEffect(() => {
                fetch('/api/classes').then(res => res.json()).then(setClasses);
            }, []);

            useEffect(() => {
                if (searchQuery.length > 2) {
                    const timer = setTimeout(() => {
                        // FIX: encodeURIComponent prevents crashes with special characters
                        fetch(\`/api/search?q=\${encodeURIComponent(searchQuery)}\`)
                            .then(res => res.json())
                            .then(setSearchResults)
                            .catch(e => console.error(e));
                    }, 300);
                    return () => clearTimeout(timer);
                } else {
                    setSearchResults([]);
                }
            }, [searchQuery]);

            if (selectedClass) {
                return <StudentClassView cls={selectedClass} onBack={() => setSelectedClass(null)} />;
            }

            return (
                <div className="animate-fade-in pb-12">
                    {/* Hero Section */}
                    {/* Header is z-30, so its dropdown will naturally appear above the content below */}
                    <LandingHeader
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        searchResults={searchResults}
                    />

                    {/* Class Browser */}
                    {/* FIX: Removed '-mt-10' and added 'mt-8'. 
                        This places the container cleanly AFTER the header.
                        z-10 ensures it sits below the Header's z-30 stacking context. */}
                    <div className="max-w-7xl mx-auto px-4 mt-8 relative z-10">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                <i className="fas fa-layer-group text-blue-600 mr-2"></i> Available Classes
                            </h2>
                            {classes.length === 0 ? (
                                <div className="text-center py-10 text-gray-400 text-sm">No classes added yet.</div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {classes.map(cls => (
                                        <div 
                                            key={cls.id} 
                                            onClick={() => setSelectedClass(cls)} 
                                            className="bg-gray-50 rounded-lg p-4 hover:bg-blue-50 cursor-pointer border border-transparent hover:border-blue-200 hover:-translate-y-1 transition-all group shadow-sm"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-blue-600 text-lg font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                    {cls.name.replace(/[^0-9]/g,'') || cls.name[0]}
                                                </div>
                                                {cls.program_label && (
                                                    <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full uppercase">
                                                        {cls.program_label}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="font-bold text-sm md:text-base text-gray-900 mb-1">{cls.name}</h3>
                                            <p className="text-[10px] text-gray-500 flex items-center">
                                                {cls.parent_class_id ? (
                                                    <><i className="fas fa-link mr-1"></i> Linked Content</>
                                                ) : (
                                                    <><i className="fas fa-database mr-1"></i> Original</>
                                                )}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        function StudentClassView({ cls, onBack }) {
            const [groups, setGroups] = useState([]);
            const [subjects, setSubjects] = useState([]);
            const [selectedGroupId, setSelectedGroupId] = useState(null);
            const [selectedSubject, setSelectedSubject] = useState(null);

            useEffect(() => {
                const fetchData = async () => {
                    const [groupsRes, subjectsRes] = await Promise.all([
                        fetch(\`/api/groups?class_id=\${cls.id}\`),
                        fetch(\`/api/subjects?class_id=\${cls.id}\`)
                    ]);
                    setGroups(await groupsRes.json());
                    setSubjects(await subjectsRes.json());
                };
                fetchData();
            }, [cls]);

            if (selectedSubject) {
                return <StudentSubjectView subject={selectedSubject} onBack={() => setSelectedSubject(null)} />;
            }

            const displayedSubjects = subjects.filter(s => s.is_common || (selectedGroupId && s.group_id === selectedGroupId));

            return (
                <div className="max-w-6xl mx-auto px-4 py-6 animate-fade-in min-h-screen">
                    <button onClick={onBack} className="flex items-center text-gray-500 hover:text-blue-600 mb-6 text-sm font-medium transition">
                        <i className="fas fa-arrow-left mr-2"></i> Back to Classes
                    </button>

                    <div className="flex flex-col md:flex-row gap-6">
                        <ClassSidebar
                            cls={cls}
                            groups={groups}
                            selectedGroupId={selectedGroupId}
                            onSelectGroup={setSelectedGroupId}
                        />

                        <div className="flex-1">
                            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm min-h-[400px]">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Subjects</h2>
                                {displayedSubjects.length === 0 ? (
                                    <div className="text-gray-400 italic text-center py-16 text-sm">Select a group to see subjects.</div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {displayedSubjects.map(sub => (
                                            <div 
                                                key={sub.id} 
                                                onClick={() => setSelectedSubject(sub)} 
                                                className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md cursor-pointer transition-all hover:-translate-y-1 group text-center"
                                            >
                                                <div className="w-10 h-10 mx-auto rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                    <i className="fas fa-book text-lg"></i>
                                                </div>
                                                <h3 className="font-bold text-sm text-gray-800 group-hover:text-indigo-600 transition truncate">{sub.name}</h3>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        function StudentSubjectView({ subject, onBack }) {
            const [chapters, setChapters] = useState([]);
            const [activeTopic, setActiveTopic] = useState(null);
            const [topics, setTopics] = useState([]);
            const [mobileChapterMenu, setMobileChapterMenu] = useState(false);

            useEffect(() => {
                fetch(\`/api/chapters?subject_id=\${subject.id}\`).then(r => r.json()).then(setChapters);
            }, [subject]);

            const loadTopicsForChapter = async (chapter) => {
                const res = await fetch(\`/api/topics?chapter_id=\${chapter.id}\`);
                const data = await res.json();
                setTopics(data);
                if (data.length > 0) setActiveTopic(data[0]);
                else setActiveTopic(null);
                setMobileChapterMenu(false);
            };

            return (
                <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row bg-white relative">
                    {/* Mobile Chapter Toggle */}
                    <div className="md:hidden p-3 border-b bg-gray-50 flex justify-between items-center">
                        <button onClick={onBack} className="text-gray-500"><i className="fas fa-arrow-left"></i></button>
                        <span className="font-bold text-gray-800 text-sm truncate max-w-[200px]">{subject.name}</span>
                        <button onClick={() => setMobileChapterMenu(!mobileChapterMenu)} className="text-blue-600 font-medium text-sm">
                            <i className="fas fa-list mr-1"></i> Chapters
                        </button>
                    </div>

                    {/* Chapter Sidebar */}
                    <div className={\`absolute inset-y-0 left-0 z-30 w-72 bg-gray-50 border-r flex flex-col transform transition-transform md:translate-x-0 md:static \${mobileChapterMenu ? 'translate-x-0' : '-translate-x-full'}\`}>
                        <div className="p-3 border-b bg-white hidden md:flex items-center justify-between">
                             <div className="flex items-center overflow-hidden">
                                <button onClick={onBack} className="mr-2 text-gray-400 hover:text-blue-600 transition"><i className="fas fa-arrow-left"></i></button>
                                <h2 className="font-bold text-gray-800 text-sm truncate">{subject.name}</h2>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                            {chapters.length === 0 && <p className="text-center text-gray-400 text-xs mt-10">No chapters.</p>}
                            {chapters.map((ch) => (
                                <div key={ch.id}>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-2 mt-2">
                                        Chapter {ch.order_num}
                                    </div>
                                    <button 
                                        onClick={() => loadTopicsForChapter(ch)} 
                                        className="w-full text-left bg-white px-3 py-2 rounded-lg border shadow-sm hover:border-blue-300 transition text-sm font-medium text-gray-700"
                                    >
                                        {ch.title}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto bg-white custom-scrollbar" onClick={() => setMobileChapterMenu(false)}>
                        {topics.length > 0 && activeTopic ? (
                            <div className="max-w-4xl mx-auto p-4 md:p-8 pb-24">
                                <div className="flex overflow-x-auto space-x-2 mb-6 pb-2 border-b custom-scrollbar">
                                    {topics.map((t, idx) => (
                                        <button 
                                            key={t.id}
                                            onClick={() => setActiveTopic(t)}
                                            className={\`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition \${activeTopic.id === t.id ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-600'}\`}
                                        >
                                            {idx + 1}. {t.title}
                                        </button>
                                    ))}
                                </div>

                                <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-6">{activeTopic.title}</h1>
                                
                                <div className="prose max-w-none mb-10">
                                    <div className="bg-amber-50 p-6 rounded-xl border border-amber-100 shadow-sm text-sm md:text-base leading-relaxed text-gray-800 whitespace-pre-wrap">
                                        {activeTopic.content || "No detailed notes available."}
                                    </div>
                                </div>

                                <InteractiveQuestions topicId={activeTopic.id} />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
                                <i className="fas fa-book-open text-4xl mb-3 opacity-20"></i>
                                <p className="text-sm">Select a chapter to start studying.</p>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        function InteractiveQuestions({ topicId }) {
            const [questions, setQuestions] = useState([]);
            const [revealed, setRevealed] = useState({});

            useEffect(() => {
                fetch(\`/api/questions?topic_id=\${topicId}\`).then(r => r.json()).then(setQuestions);
                setRevealed({});
            }, [topicId]);

            const handleMCQSelect = (qId, option, correctAnswer) => {
                if (revealed[qId]) return;
                setRevealed(prev => ({ ...prev, [qId]: option }));
            };

            if (questions.length === 0) return null;

            return (
                <div className="space-y-6 border-t pt-8">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center">
                        <i className="fas fa-clipboard-question text-blue-600 mr-2"></i> Practice Questions
                    </h3>
                    
                    {questions.map((q, idx) => (
                        <div key={q.id} className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                            <div className="flex justify-between mb-2">
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Q{idx + 1} • {q.type}</span>
                                {q.metadata && q.metadata.board && (
                                    <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100">
                                        {q.metadata.board}
                                    </span>
                                )}
                            </div>
                            
                            <p className="font-medium text-gray-800 mb-4 text-base">{q.question_text}</p>

                            {/* CLEANED UP: No JSON.parse needed here anymore */}
                            {q.type === 'MCQ' && q.options ? (
                                <div className="grid gap-2">
                                    {q.options.map((opt, i) => {
                                        const isSelected = revealed[q.id] === opt;
                                        const isCorrect = opt === q.answer;
                                        const hasAnswered = revealed[q.id] !== undefined;
                                        
                                        let btnClass = "p-3 rounded border text-left text-sm transition relative ";
                                        if (!hasAnswered) btnClass += "bg-white hover:bg-gray-50 cursor-pointer";
                                        else if (isCorrect) btnClass += "bg-green-50 border-green-400 text-green-800";
                                        else if (isSelected) btnClass += "bg-red-50 border-red-400 text-red-800";
                                        else btnClass += "bg-gray-50 opacity-60";

                                        return (
                                            <div key={i} onClick={() => handleMCQSelect(q.id, opt, q.answer)} className={btnClass}>
                                                <span className="font-bold mr-2 opacity-50">{String.fromCharCode(65+i)}.</span> {opt}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div>
                                    <button onClick={() => setRevealed(p => ({...p, [q.id]: !p[q.id]}))} className="text-blue-600 text-sm font-semibold hover:underline">
                                        {revealed[q.id] ? 'Hide Answer' : 'Show Answer'}
                                    </button>
                                    {revealed[q.id] && (
                                        <div className="mt-2 p-3 bg-green-50 rounded border border-green-100 text-green-900 text-sm">
                                            <span className="font-bold">Ans:</span> {q.answer}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            );
        }
`;
