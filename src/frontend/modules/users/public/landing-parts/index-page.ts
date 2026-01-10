export const landingIndex = `
        const SubjectIndexPage = ({ classLabel, subjects, onNavigate }) => {
            const [activeGroup, setActiveGroup] = useState('All');
            const [query, setQuery] = useState('');
            const thumbnailMap = useThumbnails('/api/thumbnails', 'subjectKey');
            const { readMap } = useReadingProgress();
            const isStudentRestricted = user?.role === 'student' && user?.classLabel && user.classLabel !== classLabel;
            const normalizedQuery = query.trim().toLowerCase();
            const groups = ['All', ...new Set(subjects.flatMap((subject) => subject.groups || []))];
            const filteredSubjects = subjects.filter((subject) => {
                const matchesGroup = activeGroup === 'All' || (subject.groups || []).includes(activeGroup);
                const matchesQuery = !normalizedQuery || subject.title.toLowerCase().includes(normalizedQuery) || subject.subtitle.toLowerCase().includes(normalizedQuery);
                return matchesGroup && matchesQuery;
            });

            // Collect images for visible subjects
            const imageUrls = filteredSubjects.map(s => thumbnailMap[s.subjectKey]?.url);
            const isReady = useImagePreloader(imageUrls);

            if (isStudentRestricted) {
                return (
                    <div className="flex-1 min-h-screen flex items-center justify-center bg-slate-50 px-6">
                        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md text-center shadow-sm">
                            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                                <i className="fa-solid fa-lock"></i>
                            </div>
                            <h2 className="text-xl font-semibold text-slate-900">Class library locked</h2>
                            <p className="text-sm text-slate-500 mt-2">Switch to your assigned class to explore your learning library.</p>
                            <button onClick={() => onNavigate('student-class')} className="mt-5 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg">Go to my class</button>
                        </div>
                    </div>
                );
            }

            if (!isReady && filteredSubjects.length > 0) return <FullScreenLoader />;

            return (
                <div className="flex-1 bg-slate-50 min-h-screen relative">
                    {/* BOLD & NOTICEABLE Background Design */}
                    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none fixed">
                         {/* 1. Large Indigo Concentric Circles (Top Right) */}
                         <svg className="absolute -top-20 -right-20 w-[600px] h-[600px] text-indigo-100 opacity-60" viewBox="0 0 100 100" fill="none">
                            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.5" />
                            <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                            <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="2" opacity="0.5" />
                            <circle cx="50" cy="50" r="15" fill="currentColor" opacity="0.2" />
                        </svg>

                         {/* 2. Amber Geometric Constellation (Top Left) */}
                         <svg className="absolute top-10 left-0 w-96 h-96 text-slate-300 opacity-50" viewBox="0 0 200 200" fill="none">
                            <path d="M40 40 L90 20 L140 60" stroke="currentColor" strokeWidth="1.5" />
                            <circle cx="40" cy="40" r="3" fill="#fbbf24" />
                            <circle cx="90" cy="20" r="3" fill="#fbbf24" />
                            <circle cx="140" cy="60" r="3" fill="#fbbf24" />
                            <path d="M40 40 L60 120 L120 100" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" />
                            <circle cx="60" cy="120" r="2" fill="currentColor" />
                            <circle cx="120" cy="100" r="2" fill="currentColor" />
                        </svg>

                        {/* 3. Stylish Dot Matrix Grid (Bottom Left) */}
                        <div className="absolute bottom-0 left-0 w-full h-64 opacity-20" 
                             style={{backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '24px 24px'}}>
                        </div>

                        {/* 4. Floating Distinct Shapes */}
                        <svg className="absolute bottom-40 right-40 w-24 h-24 text-indigo-200 opacity-80 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L2 22h20L12 2z" />
                        </svg>
                        <svg className="absolute top-1/2 left-20 w-16 h-16 text-amber-200 opacity-80" viewBox="0 0 24 24" fill="currentColor" style={{transform: 'rotate(45deg)'}}>
                            <rect width="24" height="24" rx="4" />
                        </svg>
                    </div>

                    <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-12 relative z-10">
                        {/* Header Section */}
                        <div className="flex flex-col items-center text-center gap-4 mb-12">
                             <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-indigo-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-indigo-600 shadow-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                Academic Library
                            </div>
                            <h2 className="text-4xl sm:text-5xl font-bold text-slate-800 font-serif relative inline-block">
                                {classLabel} Subjects
                                {/* Artistic Underline */}
                                <svg className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-4 text-indigo-500/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 15 100 5" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                                </svg>
                            </h2>
                            <p className="text-base text-slate-600 mt-2 max-w-lg font-serif italic">Explore the complete collection of {classLabel} subjects, organized for your learning journey.</p>
                            
                            <button onClick={() => onNavigate('landing')} className="mt-4 px-4 py-2 bg-white/80 hover:bg-white text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 rounded-full transition flex items-center gap-2 group shadow-sm backdrop-blur-sm">
                                <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
                                Back to Home
                            </button>
                        </div>

                        {/* Controls Section (Search & Filter) - Floating Glass Effect */}
                        <div className="max-w-4xl mx-auto mb-12 bg-white/90 backdrop-blur-md rounded-2xl p-2 shadow-lg shadow-indigo-100/50 border border-white/50 flex flex-col sm:flex-row items-center gap-2 relative z-20">
                            {/* Filter Dropdown */}
                            <div className="w-full sm:w-1/3 relative group">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <i className="fa-solid fa-filter text-indigo-400 text-xs"></i>
                                </div>
                                <select 
                                    value={activeGroup} 
                                    onChange={(event) => setActiveGroup(event.target.value)} 
                                    className="w-full pl-9 pr-4 py-3 bg-transparent text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer appearance-none hover:bg-slate-50 transition rounded-xl"
                                >
                                    {groups.map((group) => <option key={group} value={group}>{group === 'All' ? 'All Groups' : group}</option>)}
                                </select>
                                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                    <i className="fa-solid fa-chevron-down text-slate-300 text-xs"></i>
                                </div>
                            </div>
                            
                            {/* Divider */}
                            <div className="hidden sm:block w-px h-8 bg-slate-200"></div>

                            {/* Search Input */}
                            <div className="w-full sm:w-2/3 relative">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <i className="fa-solid fa-magnifying-glass text-indigo-400 text-xs"></i>
                                </div>
                                <input 
                                    value={query} 
                                    onChange={(event) => setQuery(event.target.value)} 
                                    placeholder="Search for a subject..." 
                                    className="w-full pl-9 pr-4 py-3 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 font-medium focus:outline-none" 
                                />
                            </div>
                        </div>

                        {/* Results Count */}
                        <div className="mb-6 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">
                            <span>Showing {filteredSubjects.length} Results</span>
                        </div>

                        {/* Cards Grid - Using Flex Wrap for better Portrait Card fit */}
                        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 pb-12">
                            {filteredSubjects.map((subject) => {
                                const thumbnail = thumbnailMap[subject.subjectKey];
                                const lastRead = getLastReadForSubject(readMap, subject.title);
                                return (
                                    <div key={subject.subjectKey} className="flex-none">
                                        <SubjectCard 
                                            subject={{ ...subject, lastRead, thumbnailUrl: thumbnail?.url }} 
                                            onNavigate={onNavigate} 
                                            className={cardWidthClass} 
                                            showGroup 
                                        />
                                    </div>
                                );
                            })}
                            
                            {/* Empty State */}
                            {filteredSubjects.length === 0 && (
                                <div className="w-full py-20 text-center bg-white/50 rounded-3xl border border-dashed border-slate-200">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4">
                                        <i className="fa-regular fa-face-frown text-2xl"></i>
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900">No subjects found</h3>
                                    <p className="text-slate-500 text-sm mt-1">Try adjusting your filters or search query.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        };
`;
