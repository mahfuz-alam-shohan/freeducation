export const studentComponents = `
        /* --- API HELPERS (Scoped) --- */
        const studentApi = {
            get: (url) => fetch(url).then(r => r.json()),
        };

        /* --- LANDING PAGE --- */
        function StudentLandingPage() {
            const [classes, setClasses] = useState([]);
            const [searchQuery, setSearchQuery] = useState('');
            const [searchResults, setSearchResults] = useState([]);
            const [selectedClass, setSelectedClass] = useState(null);

            useEffect(() => { studentApi.get('/api/classes').then(setClasses); }, []);

            useEffect(() => {
                if (searchQuery.length > 2) {
                    const timer = setTimeout(() => {
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

            if (selectedClass) return <StudentClassView cls={selectedClass} onBack={() => setSelectedClass(null)} />;

            return (
                <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 py-6 md:py-10 animate-fade-in font-sans text-gray-800">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Academic Programs</h1>
                            <p className="text-gray-500 text-sm mt-1">Select a program to browse available courses.</p>
                        </div>
                        <div className="w-full md:w-96 relative">
                            <input 
                                type="text" 
                                className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all bg-gray-50 focus:bg-white"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                            {searchResults.length > 0 && (
                                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 mt-1 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                                    {searchResults.map((r, i) => (
                                        <div key={i} className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                                            <div className="font-semibold text-sm text-gray-800">{r.title}</div>
                                            <div className="text-xs text-gray-500 capitalize">{r.type}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {classes.length === 0 ? (
                            <div className="col-span-full py-12 text-center border border-dashed border-gray-300 rounded-xl bg-gray-50">
                                <p className="text-gray-500 text-sm">No classes available at the moment.</p>
                            </div>
                        ) : (
                            classes.map(cls => (
                                <div 
                                    key={cls.id} 
                                    onClick={() => setSelectedClass(cls)} 
                                    className="bg-white border border-gray-200 p-5 rounded-lg hover:border-blue-500 hover:shadow-sm cursor-pointer transition-all duration-200 group flex flex-col h-full justify-between"
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2">{cls.name}</h3>
                                            {cls.program_label && <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200">{cls.program_label}</span>}
                                        </div>
                                        <p className="text-xs text-gray-500 line-clamp-2">Access comprehensive study materials, notes, and questions for {cls.name}.</p>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                                        <span className={\`text-[10px] font-medium px-2 py-0.5 rounded \${cls.parent_class_id ? 'bg-orange-50 text-orange-700' : 'bg-green-50 text-green-700'}\`}>
                                            {cls.parent_class_id ? "Linked Program" : "Original Program"}
                                        </span>
                                        <i className="fas fa-arrow-right text-gray-300 group-hover:text-blue-600 transition-colors text-sm"></i>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            );
        }

        /* --- CLASS VIEW --- */
        function StudentClassView({ cls, onBack }) {
            const [groups, setGroups] = useState([]);
            const [subjects, setSubjects] = useState([]);
            const [selectedGroupId, setSelectedGroupId] = useState(null);
            const [selectedSubject, setSelectedSubject] = useState(null);

            useEffect(() => {
                const fetchD = async () => {
                    const [g, s] = await Promise.all([studentApi.get(\`/api/groups?class_id=\${cls.id}\`), studentApi.get(\`/api/subjects?class_id=\${cls.id}\`)]);
                    setGroups(g); setSubjects(s);
                };
                fetchD();
            }, [cls]);

            if (selectedSubject) return <StudentSubjectView subject={selectedSubject} onBack={() => setSelectedSubject(null)} />;

            const displayedSubjects = subjects.filter(s => {
                if (selectedGroupId === null) return true; 
                return s.is_common || s.group_id === selectedGroupId; 
            });

            return (
                <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 py-6 md:py-8 animate-fade-in min-h-screen flex flex-col font-sans text-gray-800">
                    <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
                        <button onClick={onBack} className="text-gray-500 hover:text-black mr-3 transition-colors"><i className="fas fa-arrow-left"></i></button>
                        <nav className="flex items-center text-sm">
                            <span className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={onBack}>Programs</span>
                            <span className="mx-2 text-gray-300">/</span>
                            <span className="font-bold text-gray-900">{cls.name}</span>
                        </nav>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        {/* Filter Sidebar (Desktop: Left, Mobile: Top) */}
                        <div className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-24">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Filter by Group</h3>
                            <div className="flex flex-wrap lg:flex-col gap-2">
                                <button 
                                    onClick={() => setSelectedGroupId(null)}
                                    className={\`px-4 py-2 rounded-lg text-sm font-medium transition-all text-left border \${selectedGroupId === null ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'}\`}
                                >
                                    All Subjects
                                </button>
                                {groups.map(g => (
                                    <button 
                                        key={g.id}
                                        onClick={() => setSelectedGroupId(g.id)}
                                        className={\`px-4 py-2 rounded-lg text-sm font-medium transition-all text-left border \${selectedGroupId === g.id ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'}\`}
                                    >
                                        {g.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Subject Grid */}
                        <div className="flex-1 w-full">
                            <div className="flex justify-between items-end mb-4 px-1">
                                <h2 className="text-lg font-bold text-gray-800">Subjects</h2>
                                <span className="text-xs text-gray-500">{displayedSubjects.length} available</span>
                            </div>
                            
                            {displayedSubjects.length === 0 ? (
                                <div className="p-12 border border-dashed border-gray-300 rounded-xl text-center">
                                    <div className="text-gray-400 mb-2"><i className="fas fa-folder-open text-4xl"></i></div>
                                    <p className="text-gray-500 text-sm">No subjects found for this selection.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {displayedSubjects.map(sub => (
                                        <div 
                                            key={sub.id} 
                                            onClick={() => setSelectedSubject(sub)} 
                                            className="bg-white border border-gray-200 p-5 rounded-lg hover:border-blue-500 hover:shadow-md cursor-pointer transition-all duration-200 group relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-gray-50 to-white rounded-bl-full -mr-8 -mt-8 z-0"></div>
                                            <h4 className="font-bold text-lg text-gray-900 mb-2 relative z-10 group-hover:text-blue-700 transition-colors">{sub.name}</h4>
                                            <div className="flex justify-between items-end mt-4 relative z-10">
                                                <span className={\`text-[10px] uppercase font-bold px-2 py-0.5 rounded border \${sub.is_common ? 'bg-gray-100 text-gray-600 border-gray-200' : 'bg-blue-50 text-blue-700 border-blue-100'}\`}>
                                                    {sub.is_common ? 'Common' : (groups.find(g => g.id == sub.group_id)?.name || 'Group Subject')}
                                                </span>
                                                <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                    <i className="fas fa-chevron-right text-xs"></i>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        /* --- SUBJECT VIEW (Chapters & Topics) --- */
        function StudentSubjectView({ subject, onBack }) {
            const [chapters, setChapters] = useState([]);
            const [activeChapter, setActiveChapter] = useState(null); // Used on Desktop as selected sidebar item
            const [activeTopic, setActiveTopic] = useState(null);
            const [topics, setTopics] = useState([]);
            
            useEffect(() => { studentApi.get(\`/api/chapters?subject_id=\${subject.id}\`).then(setChapters); }, [subject]);

            const loadTopicsForChapter = async (chapter) => {
                setActiveChapter(chapter);
                const data = await studentApi.get(\`/api/topics?chapter_id=\${chapter.id}\`);
                setTopics(data);
                if (data.length > 0) setActiveTopic(data[0]);
                else setActiveTopic(null);
            };

            if (activeChapter && window.innerWidth < 768) {
                return (
                    <StudentTopicView 
                        chapter={activeChapter} 
                        topics={topics} 
                        activeTopic={activeTopic} 
                        setActiveTopic={setActiveTopic} 
                        onBack={() => { setActiveChapter(null); setActiveTopic(null); }} 
                        subjectId={subject.id}
                    />
                );
            }

            return (
                <div className="flex flex-col h-screen bg-white font-sans text-gray-800 animate-fade-in">
                    {/* Header */}
                    <div className="flex-shrink-0 border-b border-gray-200 p-4 flex items-center bg-white z-10">
                        <button onClick={onBack} className="mr-4 text-gray-500 hover:text-black"><i className="fas fa-arrow-left"></i></button>
                        <div>
                            <h2 className="font-bold text-gray-900">{subject.name}</h2>
                            <p className="text-xs text-gray-500 hidden md:block">Select a chapter to begin.</p>
                        </div>
                    </div>

                    <div className="flex-1 flex overflow-hidden">
                        {/* Desktop Sidebar (Visible md+) */}
                        <div className="hidden md:flex md:w-80 border-r border-gray-200 flex-col bg-gray-50 overflow-y-auto">
                            <div className="p-4 font-bold text-xs text-gray-400 uppercase tracking-wider">Chapters</div>
                            {chapters.map((ch) => (
                                <button 
                                    key={ch.id} 
                                    onClick={() => loadTopicsForChapter(ch)}
                                    className={\`w-full text-left px-6 py-3 text-sm font-medium border-l-4 transition-all \${activeChapter?.id === ch.id ? 'bg-white border-blue-600 text-blue-700 shadow-sm' : 'border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900'}\`}
                                >
                                    {ch.title}
                                </button>
                            ))}
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 flex flex-col min-w-0 bg-white relative">
                            {/* Mobile Chapter List (Visible only on Mobile when no chapter selected) */}
                            <div className="md:hidden flex-1 overflow-y-auto p-4">
                                <h3 className="font-bold text-lg mb-4 text-gray-800">Chapters</h3>
                                <div className="space-y-3">
                                    {chapters.length === 0 && <div className="text-center text-gray-400 py-8">No chapters found.</div>}
                                    {chapters.map((ch) => (
                                        <div 
                                            key={ch.id}
                                            onClick={() => loadTopicsForChapter(ch)}
                                            className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 active:bg-gray-50 cursor-pointer transition-all flex justify-between items-center"
                                        >
                                            <div>
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Chapter {ch.order_num}</span>
                                                <span className="font-medium text-gray-900">{ch.title}</span>
                                            </div>
                                            <i className="fas fa-chevron-right text-gray-300"></i>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Desktop Content Placeholder or Actual Content */}
                            <div className="hidden md:flex flex-1 flex-col h-full">
                                {activeChapter ? (
                                    <StudentTopicContent topics={topics} activeTopic={activeTopic} setActiveTopic={setActiveTopic} chapterTitle={activeChapter.title} chapterId={activeChapter.id} subjectId={subject.id} />
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-10 text-gray-400">
                                        <i className="fas fa-book-reader text-5xl mb-4 opacity-20"></i>
                                        <p>Select a chapter from the sidebar to view contents.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        /* --- MOBILE TOPIC VIEW (Drill Down) --- */
        function StudentTopicView({ chapter, topics, activeTopic, setActiveTopic, onBack, subjectId }) {
            return (
                <div className="flex flex-col h-screen bg-white font-sans animate-fade-in fixed inset-0 z-50">
                    <div className="flex-shrink-0 border-b border-gray-200 p-4 flex items-center bg-white">
                        <button onClick={onBack} className="mr-4 text-gray-500 hover:text-black"><i className="fas fa-arrow-left"></i></button>
                        <h2 className="font-bold text-gray-900 truncate">{chapter.title}</h2>
                    </div>
                    <StudentTopicContent topics={topics} activeTopic={activeTopic} setActiveTopic={setActiveTopic} chapterTitle={chapter.title} chapterId={chapter.id} subjectId={subjectId} />
                </div>
            );
        }

        /* --- SHARED CONTENT COMPONENT --- */
        function StudentTopicContent({ topics, activeTopic, setActiveTopic, chapterTitle, chapterId, subjectId }) {
            if (topics.length === 0) {
                return (
                    <div className="flex-1 overflow-y-auto p-4 md:p-10">
                        <div className="max-w-3xl mx-auto">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{chapterTitle}</h1>
                            <p className="text-gray-500 mb-8">No topics found in this chapter.</p>
                            <div className="border-t border-gray-100 pt-8">
                                <InteractiveQuestions topicId={null} chapterId={chapterId} subjectId={subjectId} />
                            </div>
                        </div>
                    </div>
                );
            }
            if (!activeTopic) return null;

            return (
                <div className="flex-1 flex flex-col min-h-0">
                    {/* Topic Tabs */}
                    <div className="flex-shrink-0 border-b border-gray-200 bg-white z-10 px-4 pt-2 overflow-x-auto scrollbar-hide">
                        <div className="flex space-x-4">
                            {topics.map((t, idx) => (
                                <button 
                                    key={t.id}
                                    onClick={() => setActiveTopic(t)}
                                    className={\`pb-3 border-b-2 whitespace-nowrap text-sm font-medium transition-colors \${activeTopic.id === t.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}\`}
                                >
                                    {idx + 1}. {t.title}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Scrollable Body */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-10">
                        <div className="max-w-3xl mx-auto">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{activeTopic.title}</h1>
                            <article className="prose prose-gray max-w-none mb-12">
                                <div className="whitespace-pre-wrap leading-relaxed text-gray-800">
                                    {activeTopic.content || "No notes available."}
                                </div>
                            </article>
                            <div className="border-t border-gray-100 pt-8">
                                <InteractiveQuestions topicId={activeTopic.id} chapterId={chapterId} subjectId={subjectId} />
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        function InteractiveQuestions({ topicId, chapterId, subjectId }) {
            const [questions, setQuestions] = useState([]);
            const [selectedType, setSelectedType] = useState(null);
            const [cqFilter, setCqFilter] = useState('full');

            useEffect(() => {
                studentApi.get(\`/api/questions?topic_id=\${topicId}&chapter_id=\${chapterId}&subject_id=\${subjectId}&level=all\`).then(setQuestions);
            }, [topicId, chapterId, subjectId]);
            useEffect(() => {
                setSelectedType(null);
                setCqFilter('full');
            }, [topicId, chapterId, subjectId]);

            if (questions.length === 0) return null;

            const partOrder = ['ক', 'খ', 'গ', 'ঘ'];
            const mcqQuestions = questions.filter(q => q.type === 'MCQ');
            const cqPartQuestions = questions.filter(q => q.type === 'CQ-Part');
            const cqScenarioQuestions = questions.filter(q => q.type === 'CQ');
            const expandCqParts = (cqQuestion) => (cqQuestion.options || []).map((opt, idx) => {
                const isLinked = opt.connected !== false;
                return {
                    ...cqQuestion,
                    id: \`\${cqQuestion.id}-\${opt.id || idx}\`,
                    type: 'CQ-Part',
                    question_text: opt.text,
                    answer: opt.answer,
                    options: [],
                    metadata: {
                        ...(cqQuestion.metadata || {}),
                        part: opt.id,
                        scenario: cqQuestion.question_text,
                        linked: isLinked
                    }
                };
            });
            const expandedCqParts = cqScenarioQuestions.flatMap(expandCqParts);
            const combinedCqParts = [...cqPartQuestions, ...expandedCqParts];
            const cqAvailable = cqScenarioQuestions.length > 0 || combinedCqParts.length > 0;
            const availableTypes = [
                ...(cqAvailable ? [{ key: 'CQ', label: 'CQ', count: cqScenarioQuestions.length + combinedCqParts.length, color: 'bg-blue-600' }] : []),
                ...(mcqQuestions.length > 0 ? [{ key: 'MCQ', label: 'MCQ', count: mcqQuestions.length, color: 'bg-emerald-600' }] : [])
            ];

            if (availableTypes.length === 0) return null;

            const cqFilteredParts = cqFilter === 'full'
                ? []
                : combinedCqParts.filter(q => q.metadata?.part === cqFilter);

            return (
                <div className="space-y-8">
                    {!selectedType && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {availableTypes.map(type => (
                                <button
                                    key={type.key}
                                    onClick={() => setSelectedType(type.key)}
                                    className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`inline-flex items-center justify-center w-11 h-11 rounded-full ${type.color} text-white text-lg font-bold shadow`}>
                                            {type.label}
                                        </span>
                                        <div className="text-left">
                                            <div className="text-sm font-semibold text-gray-900">{type.label} Questions</div>
                                            <div className="text-xs text-gray-500">{type.count} available</div>
                                        </div>
                                    </div>
                                    <span className="text-xs font-semibold text-blue-600">View</span>
                                </button>
                            ))}
                        </div>
                    )}
                    {selectedType === 'MCQ' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-600 text-white text-lg font-bold shadow">MCQ</span>
                                    <h3 className="text-lg font-bold text-gray-900">Multiple Choice Questions</h3>
                                </div>
                                <button onClick={() => setSelectedType(null)} className="text-xs font-semibold text-blue-600 hover:underline">Back</button>
                            </div>
                            <div className="space-y-4">
                                {mcqQuestions.map((q, index) => (
                                    <div key={q.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm space-y-2">
                                        <div className="flex items-start gap-2 text-sm text-gray-900">
                                            <span className="font-bold text-gray-700">{index + 1}.</span>
                                            <span className="whitespace-pre-line font-medium">{q.question_text}</span>
                                        </div>
                                        <div className="grid gap-1 pl-6 text-sm text-gray-700">
                                            {(q.options || []).map((opt, idx) => (
                                                <div key={idx} className="flex items-start gap-2">
                                                    <span className="font-bold text-gray-500">{String.fromCharCode(65 + idx)}.</span>
                                                    <span className="whitespace-pre-line">{opt}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="text-sm text-gray-700 whitespace-pre-line pl-6"><span className="font-semibold">Ans:</span> {q.answer || ''}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {selectedType === 'CQ' && cqAvailable && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white text-lg font-bold shadow">CQ</span>
                                    <h3 className="text-lg font-bold text-gray-900">Creative Questions</h3>
                                </div>
                                <button onClick={() => setSelectedType(null)} className="text-xs font-semibold text-blue-600 hover:underline">Back</button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setCqFilter('full')}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-full border ${cqFilter === 'full' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                                >
                                    Full CQ
                                </button>
                                {partOrder.map(part => (
                                    <button
                                        key={part}
                                        onClick={() => setCqFilter(part)}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-full border ${cqFilter === part ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                                    >
                                        {part}
                                    </button>
                                ))}
                            </div>
                            {cqFilter === 'full' && (
                                <div className="space-y-4">
                                    {cqScenarioQuestions.map((q, index) => (
                                        <div key={q.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm space-y-3">
                                            <div className="flex items-start gap-2 text-sm text-gray-900">
                                                <span className="font-bold text-gray-700">{index + 1}.</span>
                                                <div className="whitespace-pre-line">
                                                    <span className="font-semibold text-gray-800">Ques:</span> {q.question_text}
                                                </div>
                                            </div>
                                            <div className="space-y-2 pl-6 text-sm text-gray-700">
                                                {(q.options || []).map((opt, idx) => (
                                                    <div key={opt.id || idx} className="flex items-start gap-2">
                                                        <span className="font-bold text-gray-500">{opt.id || partOrder[idx] || idx + 1}.</span>
                                                        <span className="whitespace-pre-line">{opt.text}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    {cqScenarioQuestions.length === 0 && (
                                        <div className="text-sm text-gray-500">No full CQ available.</div>
                                    )}
                                </div>
                            )}
                            {cqFilter !== 'full' && (
                                <div className="space-y-4">
                                    {cqFilteredParts.map((q, index) => {
                                        const isLinked = q.metadata?.linked;
                                        const scenarioText = q.metadata?.scenario;
                                        return (
                                            <div key={q.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm space-y-2">
                                                {isLinked && scenarioText ? (
                                                    <div className="flex items-start gap-2 text-sm text-gray-900">
                                                        <span className="font-bold text-gray-700">{index + 1}.</span>
                                                        <div className="space-y-1">
                                                            <div className="whitespace-pre-line">
                                                                <span className="font-semibold text-gray-800">Scene:</span> {scenarioText}
                                                            </div>
                                                            <div className="whitespace-pre-line">
                                                                <span className="font-semibold text-gray-800">Ques:</span> {q.question_text}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-start gap-2 text-sm text-gray-900">
                                                        <span className="font-bold text-gray-700">{index + 1}.</span>
                                                        <span className="whitespace-pre-line">
                                                            <span className="font-semibold text-gray-800">Ques:</span> {q.question_text}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="text-sm text-gray-700 whitespace-pre-line pl-6"><span className="font-semibold">Ans:</span> {q.answer || ''}</div>
                                            </div>
                                        );
                                    })}
                                    {cqFilteredParts.length === 0 && (
                                        <div className="text-sm text-gray-500">No questions available for this part.</div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            );
        }
`;
