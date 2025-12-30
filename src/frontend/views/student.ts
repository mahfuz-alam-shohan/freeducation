export const studentComponents = `
        /* --- API HELPERS --- */
        const api = {
            get: (url) => fetch(url).then(r => r.json()),
        };

        /* --- LANDING PAGE --- */
        function StudentLandingPage() {
            const [classes, setClasses] = useState([]);
            const [searchQuery, setSearchQuery] = useState('');
            const [searchResults, setSearchResults] = useState([]);
            const [selectedClass, setSelectedClass] = useState(null);

            useEffect(() => { api.get('/api/classes').then(setClasses); }, []);

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
                <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 py-6 md:py-10 animate-fade-in">
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
                    const [g, s] = await Promise.all([api.get(\`/api/groups?class_id=\${cls.id}\`), api.get(\`/api/subjects?class_id=\${cls.id}\`)]);
                    setGroups(g); setSubjects(s);
                };
                fetchD();
            }, [cls]);

            if (selectedSubject) return <StudentSubjectView subject={selectedSubject} onBack={() => setSelectedSubject(null)} />;

            const displayedSubjects = subjects.filter(s => s.is_common || (selectedGroupId && s.group_id === selectedGroupId));

            return (
                <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 py-6 md:py-8 animate-fade-in min-h-screen flex flex-col">
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
                                                <span className="text-xs text-gray-500 font-medium">View Chapters</span>
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
            const [activeTopic, setActiveTopic] = useState(null);
            const [topics, setTopics] = useState([]);
            const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

            useEffect(() => { api.get(\`/api/chapters?subject_id=\${subject.id}\`).then(setChapters); }, [subject]);

            const loadTopics = async (chapter) => {
                const data = await api.get(\`/api/topics?chapter_id=\${chapter.id}\`);
                setTopics(data);
                if (data.length > 0) setActiveTopic(data[0]);
                else setActiveTopic(null);
                setMobileMenuOpen(false);
            };

            return (
                <div className="flex h-screen bg-white overflow-hidden">
                    {/* Sidebar (Responsive) */}
                    <div className={\`
                        fixed inset-0 z-40 bg-white md:static md:z-auto md:w-80 md:flex-shrink-0 border-r border-gray-200 flex flex-col transition-transform duration-300
                        \${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                    \`}>
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                            <div className="flex items-center overflow-hidden">
                                <button onClick={onBack} className="mr-3 text-gray-500 hover:text-black transition-colors"><i className="fas fa-arrow-left"></i></button>
                                <h2 className="font-bold text-sm text-gray-800 truncate" title={subject.name}>{subject.name}</h2>
                            </div>
                            <button onClick={() => setMobileMenuOpen(false)} className="md:hidden text-gray-500 p-2"><i className="fas fa-times"></i></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-0">
                            {chapters.length === 0 && <div className="p-6 text-center text-xs text-gray-400">No chapters found.</div>}
                            {chapters.map((ch, idx) => (
                                <div key={ch.id} className="border-b border-gray-100 last:border-0">
                                    <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50 mt-2">Chapter {ch.order_num}</div>
                                    <button 
                                        onClick={() => loadTopics(ch)} 
                                        className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors block focus:outline-none focus:bg-blue-50"
                                    >
                                        {ch.title}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Overlay for Mobile */}
                    {mobileMenuOpen && <div className="fixed inset-0 bg-black/20 z-30 md:hidden backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>}

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col h-full min-w-0 bg-white">
                        {/* Mobile Header Trigger */}
                        <div className="md:hidden p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 flex-shrink-0">
                            <button onClick={() => setMobileMenuOpen(true)} className="flex items-center text-sm font-bold text-gray-800">
                                <i className="fas fa-bars mr-3 text-gray-500"></i> {subject.name}
                            </button>
                            <button onClick={onBack} className="text-gray-400"><i className="fas fa-arrow-left"></i></button>
                        </div>

                        {/* Content Scrollable */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-10 lg:p-12">
                            {topics.length > 0 && activeTopic ? (
                                <div className="max-w-4xl mx-auto w-full">
                                    {/* Topic Tabs */}
                                    <div className="flex overflow-x-auto gap-2 mb-8 pb-1 scrollbar-hide border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur z-10 pt-2">
                                        {topics.map((t, idx) => (
                                            <button 
                                                key={t.id}
                                                onClick={() => setActiveTopic(t)}
                                                className={\`px-4 py-2 whitespace-nowrap text-sm font-medium rounded-t-lg border-b-2 transition-all \${activeTopic.id === t.id ? 'border-blue-600 text-blue-700 bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'}\`}
                                            >
                                                {idx + 1}. {t.title}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="animate-fade-in">
                                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">{activeTopic.title}</h1>
                                        
                                        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed font-serif">
                                            {activeTopic.content ? (
                                                <div className="whitespace-pre-wrap">{activeTopic.content}</div>
                                            ) : (
                                                <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 italic text-center">No notes available for this topic.</div>
                                            )}
                                        </div>

                                        <div className="mt-16 pt-10 border-t border-gray-200">
                                            <InteractiveQuestions topicId={activeTopic.id} />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
                                        <i className="fas fa-book-reader text-4xl"></i>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to Start?</h3>
                                    <p className="text-gray-500 max-w-md mx-auto">Select a chapter from the sidebar menu to begin browsing topics and questions.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        function InteractiveQuestions({ topicId }) {
            const [questions, setQuestions] = useState([]);
            const [revealed, setRevealed] = useState({});

            useEffect(() => {
                api.get(\`/api/questions?topic_id=\${topicId}\`).then(setQuestions);
                setRevealed({});
            }, [topicId]);

            const handleMCQSelect = (qId, option) => {
                if (revealed[qId]) return;
                setRevealed(prev => ({ ...prev, [qId]: option }));
            };

            if (questions.length === 0) return null;

            return (
                <div className="space-y-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
                        <h3 className="text-2xl font-bold text-gray-900">Practice Questions</h3>
                    </div>
                    
                    {questions.map((q, idx) => (
                        <div key={q.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Question {idx + 1}</span>
                                <span className="text-[10px] font-mono text-gray-400">{q.metadata?.board} {q.metadata?.year}</span>
                            </div>
                            
                            <div className="p-6 md:p-8">
                                <p className="font-medium text-lg text-gray-900 mb-6 leading-relaxed">{q.question_text}</p>

                                {q.type === 'MCQ' && q.options ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {q.options.map((opt, i) => {
                                            const isSelected = revealed[q.id] === opt;
                                            const isCorrect = opt === q.answer;
                                            const hasAnswered = revealed[q.id] !== undefined;
                                            
                                            let btnClass = "w-full text-left p-4 rounded-lg border-2 text-sm transition-all relative flex items-center ";
                                            if (!hasAnswered) btnClass += "bg-white border-gray-100 hover:border-blue-300 hover:bg-blue-50 cursor-pointer";
                                            else if (isCorrect) btnClass += "bg-green-50 border-green-500 text-green-900 shadow-sm";
                                            else if (isSelected) btnClass += "bg-red-50 border-red-400 text-red-900";
                                            else btnClass += "bg-gray-50 border-transparent opacity-50";

                                            return (
                                                <button key={i} onClick={() => handleMCQSelect(q.id, opt)} className={btnClass} disabled={hasAnswered}>
                                                    <span className={\`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold mr-3 \${hasAnswered && isCorrect ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-500'}\`}>{String.fromCharCode(65+i)}</span>
                                                    <span className="font-medium">{opt}</span>
                                                    {hasAnswered && isCorrect && <i className="fas fa-check absolute right-4 text-green-600"></i>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="mt-4">
                                        <button 
                                            onClick={() => setRevealed(p => ({...p, [q.id]: !p[q.id]}))} 
                                            className="text-blue-600 text-sm font-bold hover:underline flex items-center"
                                        >
                                            {revealed[q.id] ? <><i className="fas fa-eye-slash mr-2"></i> Hide Answer</> : <><i className="fas fa-eye mr-2"></i> Show Answer</>}
                                        </button>
                                        {revealed[q.id] && (
                                            <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-lg text-green-900 text-sm animate-fade-in">
                                                <span className="font-bold block mb-1">Correct Answer:</span> {q.answer}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            );
        }
`;


