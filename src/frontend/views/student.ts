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
                <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
                    {/* Simple Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Academic Programs</h1>
                        <p className="text-gray-500 text-sm">Select your class to access study materials.</p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative mb-8">
                        <input 
                            type="text" 
                            className="w-full border border-gray-300 rounded p-3 pl-10 text-sm outline-none focus:border-blue-500 transition-colors"
                            placeholder="Search subjects, chapters, or topics..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <i className="fas fa-search absolute left-3 top-3.5 text-gray-400"></i>
                        
                        {searchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 mt-1 rounded shadow-sm z-50 max-h-60 overflow-y-auto">
                                {searchResults.map((r, i) => (
                                    <div key={i} className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                                        <div className="font-medium text-sm text-gray-800">{r.title}</div>
                                        <div className="text-xs text-gray-500 capitalize">{r.type}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Class List (Flat Grid) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {classes.length === 0 ? (
                            <div className="col-span-full text-center py-10 text-gray-400 text-sm">No classes available yet.</div>
                        ) : (
                            classes.map(cls => (
                                <div 
                                    key={cls.id} 
                                    onClick={() => setSelectedClass(cls)} 
                                    className="bg-white border border-gray-300 p-4 rounded hover:border-blue-500 cursor-pointer transition-colors group"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-700">{cls.name}</h3>
                                        {cls.program_label && <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200">{cls.program_label}</span>}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {cls.parent_class_id ? "Linked Content" : "Original Content"}
                                    </div>
                                </div>
                            ))
                        )}
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
                <div className="max-w-5xl mx-auto px-4 py-6 animate-fade-in min-h-screen">
                    {/* Breadcrumb-style Header */}
                    <div className="flex items-center text-sm mb-6 border-b border-gray-200 pb-4">
                        <button onClick={onBack} className="text-gray-500 hover:text-black mr-2"><i className="fas fa-home"></i></button>
                        <span className="text-gray-300 mx-2">/</span>
                        <span className="font-bold text-gray-800">{cls.name}</span>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Sidebar / Filter */}
                        <div className="w-full md:w-64 flex-shrink-0">
                            <h3 className="font-bold text-xs uppercase text-gray-500 mb-3 tracking-wide">Select Group</h3>
                            <div className="space-y-1">
                                <button 
                                    onClick={() => setSelectedGroupId(null)}
                                    className={\`w-full text-left px-3 py-2 rounded text-sm \${selectedGroupId === null ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}\`}
                                >
                                    All Subjects
                                </button>
                                {groups.map(g => (
                                    <button 
                                        key={g.id}
                                        onClick={() => setSelectedGroupId(g.id)}
                                        className={\`w-full text-left px-3 py-2 rounded text-sm \${selectedGroupId === g.id ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}\`}
                                    >
                                        {g.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Subject Grid */}
                        <div className="flex-1">
                            <h3 className="font-bold text-xs uppercase text-gray-500 mb-3 tracking-wide">Subjects</h3>
                            {displayedSubjects.length === 0 ? (
                                <div className="p-8 border border-dashed border-gray-300 rounded text-center text-gray-400 text-sm">No subjects found.</div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {displayedSubjects.map(sub => (
                                        <div 
                                            key={sub.id} 
                                            onClick={() => setSelectedSubject(sub)} 
                                            className="bg-white border border-gray-300 p-4 rounded hover:border-blue-500 cursor-pointer hover:shadow-sm transition-all"
                                        >
                                            <h4 className="font-bold text-gray-800 text-sm mb-1">{sub.name}</h4>
                                            <div className="text-xs text-gray-500">View Chapters <i className="fas fa-arrow-right ml-1 text-[10px]"></i></div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        function StudentSubjectView({ subject, onBack }) {
            const [chapters, setChapters] = useState([]);
            const [activeTopic, setActiveTopic] = useState(null);
            const [topics, setTopics] = useState([]);
            const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

            useEffect(() => {
                fetch(\`/api/chapters?subject_id=\${subject.id}\`).then(r => r.json()).then(setChapters);
            }, [subject]);

            const loadTopicsForChapter = async (chapter) => {
                const res = await fetch(\`/api/topics?chapter_id=\${chapter.id}\`);
                const data = await res.json();
                setTopics(data);
                if (data.length > 0) setActiveTopic(data[0]);
                else setActiveTopic(null);
                setMobileMenuOpen(false);
            };

            return (
                <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] bg-white">
                    {/* Mobile Header */}
                    <div className="md:hidden border-b border-gray-200 p-3 flex justify-between items-center bg-gray-50">
                        <div className="flex items-center">
                            <button onClick={onBack} className="mr-3 text-gray-500"><i className="fas fa-arrow-left"></i></button>
                            <span className="font-bold text-sm text-gray-800">{subject.name}</span>
                        </div>
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-blue-600 text-sm font-medium">
                            {mobileMenuOpen ? 'Close' : 'Chapters'}
                        </button>
                    </div>

                    {/* Sidebar (Chapters) */}
                    <div className={\`
                        fixed inset-0 z-30 bg-white md:static md:w-72 border-r border-gray-200 flex flex-col transform transition-transform duration-200
                        \${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                    \`}>
                        <div className="p-4 border-b border-gray-100 hidden md:flex items-center bg-gray-50">
                            <button onClick={onBack} className="mr-3 text-gray-400 hover:text-black"><i className="fas fa-arrow-left"></i></button>
                            <span className="font-bold text-sm text-gray-700 truncate">{subject.name}</span>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-2">
                            {chapters.length === 0 && <div className="p-4 text-center text-xs text-gray-400">No chapters.</div>}
                            {chapters.map((ch) => (
                                <div key={ch.id} className="mb-1">
                                    <button 
                                        onClick={() => loadTopicsForChapter(ch)} 
                                        className="w-full text-left px-3 py-2.5 rounded text-sm font-medium text-gray-700 hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-colors"
                                    >
                                        <span className="text-gray-400 mr-2 text-xs">{ch.order_num}.</span>
                                        {ch.title}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto bg-white p-4 md:p-8" onClick={() => setMobileMenuOpen(false)}>
                        {topics.length > 0 && activeTopic ? (
                            <div className="max-w-3xl mx-auto">
                                {/* Topic Tabs */}
                                <div className="flex overflow-x-auto gap-2 mb-8 border-b border-gray-200 pb-2 scrollbar-hide">
                                    {topics.map((t, idx) => (
                                        <button 
                                            key={t.id}
                                            onClick={() => setActiveTopic(t)}
                                            className={\`px-3 py-1.5 whitespace-nowrap text-xs font-bold rounded transition-colors \${activeTopic.id === t.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}\`}
                                        >
                                            {idx + 1}. {t.title}
                                        </button>
                                    ))}
                                </div>

                                <article className="prose prose-sm md:prose-base max-w-none text-gray-800">
                                    <h1 className="text-2xl font-bold text-gray-900 mb-6">{activeTopic.title}</h1>
                                    <div className="whitespace-pre-wrap leading-relaxed">
                                        {activeTopic.content || <span className="text-gray-400 italic">No study notes added for this topic yet.</span>}
                                    </div>
                                </article>

                                <div className="mt-12 pt-8 border-t border-gray-200">
                                    <InteractiveQuestions topicId={activeTopic.id} />
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <i className="fas fa-book-reader text-3xl mb-3 opacity-20"></i>
                                <p className="text-sm">Select a chapter to begin studying.</p>
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
                <div className="space-y-6">
                    <h3 className="font-bold text-gray-800 text-lg border-l-4 border-blue-600 pl-3">Practice Questions</h3>
                    
                    {questions.map((q, idx) => (
                        <div key={q.id} className="border border-gray-200 rounded p-5 bg-gray-50/50">
                            <div className="flex justify-between mb-3 text-xs text-gray-500 uppercase font-bold tracking-wide">
                                <span>Question {idx + 1}</span>
                                <span>{q.metadata?.board} {q.metadata?.year}</span>
                            </div>
                            
                            <p className="font-medium text-gray-900 mb-4">{q.question_text}</p>

                            {q.type === 'MCQ' && q.options ? (
                                <div className="space-y-2">
                                    {q.options.map((opt, i) => {
                                        const isSelected = revealed[q.id] === opt;
                                        const isCorrect = opt === q.answer;
                                        const hasAnswered = revealed[q.id] !== undefined;
                                        
                                        let btnClass = "w-full text-left p-3 rounded border text-sm transition-colors relative ";
                                        if (!hasAnswered) btnClass += "bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50 cursor-pointer";
                                        else if (isCorrect) btnClass += "bg-green-100 border-green-500 text-green-900 font-medium";
                                        else if (isSelected) btnClass += "bg-red-100 border-red-500 text-red-900";
                                        else btnClass += "bg-gray-100 border-gray-200 text-gray-400 opacity-70";

                                        return (
                                            <button key={i} onClick={() => handleMCQSelect(q.id, opt, q.answer)} className={btnClass} disabled={hasAnswered}>
                                                <span className="font-bold mr-2 opacity-60">{String.fromCharCode(65+i)}.</span> {opt}
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="mt-2">
                                    <button 
                                        onClick={() => setRevealed(p => ({...p, [q.id]: !p[q.id]}))} 
                                        className="text-blue-600 text-xs font-bold hover:underline mb-2"
                                    >
                                        {revealed[q.id] ? 'Hide Answer' : 'View Answer'}
                                    </button>
                                    {revealed[q.id] && (
                                        <div className="p-3 bg-white border border-gray-200 rounded text-sm text-gray-800">
                                            <span className="font-bold text-green-600">Answer:</span> {q.answer}
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


