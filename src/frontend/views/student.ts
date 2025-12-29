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
                <div className="animate-fade-in pb-20">
                    {/* Hero Section */}
                    <LandingHeader
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        searchResults={searchResults}
                    />

                    {/* Class Browser - Properly Spaced */}
                    <div className="w-full px-4 sm:px-6 lg:px-8 mt-12 relative z-10">
                        <div className="max-w-8xl mx-auto">
                            <div className="flex items-center mb-8">
                                <div className="w-1.5 h-8 bg-blue-600 rounded-full mr-4"></div>
                                <h2 className="text-3xl font-bold text-gray-900">Academic Programs</h2>
                            </div>
                            
                            {classes.length === 0 ? (
                                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                        <i className="fas fa-folder-open text-2xl"></i>
                                    </div>
                                    <p className="text-gray-500 font-medium">No classes have been published yet.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {classes.map(cls => (
                                        <div 
                                            key={cls.id} 
                                            onClick={() => setSelectedClass(cls)} 
                                            className="bg-white rounded-2xl p-6 cursor-pointer border border-gray-100 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full"
                                        >
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg flex items-center justify-center text-white text-xl font-bold group-hover:scale-110 transition-transform">
                                                    {cls.name.replace(/[^0-9]/g,'') || cls.name[0]}
                                                </div>
                                                {cls.program_label && (
                                                    <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase tracking-wider border border-blue-100">
                                                        {cls.program_label}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <div className="mt-auto">
                                                <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{cls.name}</h3>
                                                <div className="flex items-center text-xs font-medium text-gray-500">
                                                    {cls.parent_class_id ? (
                                                        <><i className="fas fa-link mr-2 text-orange-400"></i> Linked Content</>
                                                    ) : (
                                                        <><i className="fas fa-database mr-2 text-green-400"></i> Original Source</>
                                                    )}
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
                <div className="min-h-screen bg-gray-50">
                    <div className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                        <button onClick={onBack} className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-8 font-medium text-sm transition group">
                            <span className="w-8 h-8 rounded-full bg-white border flex items-center justify-center mr-2 group-hover:border-blue-300 shadow-sm"><i className="fas fa-arrow-left"></i></span> 
                            Back to All Classes
                        </button>

                        <div className="flex flex-col lg:flex-row gap-8 items-start">
                            <ClassSidebar
                                cls={cls}
                                groups={groups}
                                selectedGroupId={selectedGroupId}
                                onSelectGroup={setSelectedGroupId}
                            />

                            <div className="flex-1 w-full">
                                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm min-h-[500px]">
                                    <div className="mb-8">
                                        <h2 className="text-2xl font-bold text-gray-900">Subjects</h2>
                                        <p className="text-gray-500 text-sm mt-1">Select a subject to browse chapters.</p>
                                    </div>
                                    
                                    {displayedSubjects.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-20 text-center">
                                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                                                <i className="fas fa-book text-3xl"></i>
                                            </div>
                                            <p className="text-gray-400 font-medium">No subjects found for this selection.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                            {displayedSubjects.map(sub => (
                                                <div 
                                                    key={sub.id} 
                                                    onClick={() => setSelectedSubject(sub)} 
                                                    className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-blue-400 hover:shadow-xl cursor-pointer transition-all duration-300 flex flex-col relative overflow-hidden"
                                                >
                                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150"></div>
                                                    
                                                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors relative z-10">
                                                        <i className="fas fa-book-open text-xl"></i>
                                                    </div>
                                                    
                                                    <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-700 transition relative z-10">{sub.name}</h3>
                                                    <span className="text-xs text-gray-400 font-medium relative z-10">Click to explore chapters</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
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
                <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row bg-white relative overflow-hidden">
                    {/* Mobile Header for Subject */}
                    <div className="md:hidden p-4 border-b bg-white flex justify-between items-center z-30 shadow-sm">
                        <button onClick={onBack} className="text-gray-500 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"><i className="fas fa-arrow-left"></i></button>
                        <span className="font-bold text-gray-800 text-sm truncate max-w-[200px]">{subject.name}</span>
                        <button onClick={() => setMobileChapterMenu(!mobileChapterMenu)} className="text-blue-600 font-medium text-sm bg-blue-50 px-3 py-1.5 rounded-lg">
                            <i className="fas fa-list mr-1"></i> Chapters
                        </button>
                    </div>

                    {/* Chapter Sidebar - Sticky and Full Height */}
                    <div className={\`
                        fixed inset-0 z-40 bg-white md:static md:w-80 md:flex-shrink-0 border-r border-gray-200 flex flex-col transform transition-transform duration-300
                        \${mobileChapterMenu ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                    \`}>
                        <div className="p-5 border-b border-gray-100 hidden md:flex items-center gap-3 bg-gray-50/50">
                            <button onClick={onBack} className="text-gray-400 hover:text-blue-600 transition w-8 h-8 flex items-center justify-center rounded-full hover:bg-white shadow-sm"><i className="fas fa-arrow-left"></i></button>
                            <h2 className="font-bold text-gray-800 truncate" title={subject.name}>{subject.name}</h2>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1">
                            {chapters.length === 0 && (
                                <div className="text-center mt-10">
                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-2 text-gray-300">
                                        <i className="fas fa-layer-group"></i>
                                    </div>
                                    <p className="text-gray-400 text-xs">No chapters available.</p>
                                </div>
                            )}
                            
                            {chapters.map((ch) => (
                                <div key={ch.id} className="mb-2">
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-3 mt-4 flex items-center">
                                        <span className="w-full h-px bg-gray-100 mr-2"></span>
                                        Chapter {ch.order_num}
                                        <span className="w-full h-px bg-gray-100 ml-2"></span>
                                    </div>
                                    <button 
                                        onClick={() => { loadTopicsForChapter(ch); setMobileChapterMenu(false); }} 
                                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition text-sm font-medium text-gray-700 border border-transparent hover:border-blue-100 group"
                                    >
                                        <div className="flex items-start">
                                            <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-blue-500 mr-3 flex-shrink-0"></span>
                                            {ch.title}
                                        </div>
                                    </button>
                                </div>
                            ))}
                        </div>
                        
                        {/* Mobile close button */}
                        <div className="md:hidden p-4 border-t">
                            <Button className="w-full" onClick={() => setMobileChapterMenu(false)}>Close Menu</Button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto bg-gray-50/30 custom-scrollbar h-full relative">
                        {topics.length > 0 && activeTopic ? (
                            <div className="max-w-4xl mx-auto p-4 md:p-10 pb-32">
                                {/* Topic Navigation Pills */}
                                <div className="sticky top-0 bg-white/95 backdrop-blur-sm p-2 -mx-4 md:-mx-10 px-4 md:px-10 mb-8 border-b z-20 flex overflow-x-auto gap-2 no-scrollbar">
                                    {topics.map((t, idx) => (
                                        <button 
                                            key={t.id}
                                            onClick={() => setActiveTopic(t)}
                                            className={\`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border \${activeTopic.id === t.id ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}\`}
                                        >
                                            {idx + 1}. {t.title}
                                        </button>
                                    ))}
                                </div>

                                <div className="animate-fade-in">
                                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-8 leading-tight">{activeTopic.title}</h1>
                                    
                                    <div className="prose prose-lg max-w-none mb-12">
                                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-gray-800 leading-relaxed whitespace-pre-wrap font-light text-lg">
                                            {activeTopic.content || "No detailed notes available."}
                                        </div>
                                    </div>

                                    <InteractiveQuestions topicId={activeTopic.id} />
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
                                <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                    <i className="fas fa-book-reader text-5xl text-gray-300"></i>
                                </div>
                                <h3 className="text-xl font-bold text-gray-600 mb-2">Ready to learn?</h3>
                                <p className="text-gray-500">Select a chapter from the sidebar to start studying.</p>
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
                <div className="space-y-8 border-t border-gray-200 pt-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                            <i className="fas fa-clipboard-question text-xl"></i>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">Practice Questions</h3>
                    </div>
                    
                    {questions.map((q, idx) => (
                        <div key={q.id} className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between mb-4">
                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Question {idx + 1} • {q.type}</span>
                                {q.metadata && q.metadata.board && (
                                    <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-bold border border-blue-100">
                                        {q.metadata.board}
                                    </span>
                                )}
                            </div>
                            
                            <p className="font-medium text-gray-800 mb-6 text-lg leading-relaxed">{q.question_text}</p>

                            {q.type === 'MCQ' && q.options ? (
                                <div className="grid gap-3">
                                    {q.options.map((opt, i) => {
                                        const isSelected = revealed[q.id] === opt;
                                        const isCorrect = opt === q.answer;
                                        const hasAnswered = revealed[q.id] !== undefined;
                                        
                                        let btnClass = "p-4 rounded-xl border-2 text-left text-sm transition-all relative flex items-center ";
                                        if (!hasAnswered) btnClass += "bg-white border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 cursor-pointer";
                                        else if (isCorrect) btnClass += "bg-green-50 border-green-500 text-green-900 shadow-sm";
                                        else if (isSelected) btnClass += "bg-red-50 border-red-400 text-red-900";
                                        else btnClass += "bg-gray-50 border-transparent opacity-50";

                                        return (
                                            <div key={i} onClick={() => handleMCQSelect(q.id, opt, q.answer)} className={btnClass}>
                                                <div className={\`w-8 h-8 rounded-lg flex items-center justify-center mr-4 font-bold text-sm \${hasAnswered && isCorrect ? 'bg-green-200 text-green-800' : 'bg-gray-100 text-gray-500'}\`}>
                                                    {String.fromCharCode(65+i)}
                                                </div>
                                                <span className="font-medium">{opt}</span>
                                                {hasAnswered && isCorrect && <i className="fas fa-check-circle text-green-600 text-xl absolute right-4"></i>}
                                                {hasAnswered && isSelected && !isCorrect && <i className="fas fa-times-circle text-red-500 text-xl absolute right-4"></i>}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded-xl p-1">
                                    <button 
                                        onClick={() => setRevealed(p => ({...p, [q.id]: !p[q.id]}))} 
                                        className="w-full flex justify-between items-center p-3 text-blue-600 font-semibold text-sm hover:bg-white rounded-lg transition"
                                    >
                                        <span>{revealed[q.id] ? 'Hide Answer' : 'Show Answer'}</span>
                                        <i className={\`fas \${revealed[q.id] ? 'fa-eye-slash' : 'fa-eye'}\`}></i>
                                    </button>
                                    {revealed[q.id] && (
                                        <div className="p-4 border-t border-gray-200 text-gray-800 text-sm leading-relaxed bg-white rounded-b-lg">
                                            <span className="font-bold text-green-600 block mb-1">Correct Answer:</span> 
                                            {q.answer}
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


