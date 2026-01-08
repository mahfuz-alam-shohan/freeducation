export const landingIndex = `
        const SubjectIndexPage = ({ classLabel, subjects, onNavigate }) => {
            const [activeGroup, setActiveGroup] = useState('All');
            const [query, setQuery] = useState('');
            const thumbnailMap = useThumbnails('/api/thumbnails', 'subjectKey');
            const { readMap } = useReadingProgress();
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

            if (!isReady && filteredSubjects.length > 0) return <FullScreenLoader />;

            return (
                <div className="flex-1 bg-slate-50 min-h-screen relative">
                    {/* Background Design: Geometric Constellation Pattern (Matching Landing Page) */}
                    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-30 fixed">
                         <svg className="absolute top-20 left-10 w-96 h-96 text-slate-200" viewBox="0 0 200 200" fill="none">
                            <circle cx="50" cy="50" r="2" fill="currentColor" />
                            <circle cx="120" cy="30" r="2" fill="currentColor" />
                            <circle cx="160" cy="90" r="2" fill="currentColor" />
                            <circle cx="40" cy="140" r="2" fill="currentColor" />
                            <path d="M50 50 L120 30 L160 90" stroke="currentColor" strokeWidth="0.5" />
                            <path d="M50 50 L40 140" stroke="currentColor" strokeWidth="0.5" />
                            <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.5" />
                        </svg>
                         <svg className="absolute bottom-20 right-20 w-64 h-64 text-indigo-100" viewBox="0 0 100 100" fill="none">
                            <rect x="20" y="20" width="60" height="60" transform="rotate(15 50 50)" stroke="currentColor" strokeWidth="1" />
                            <rect x="20" y="20" width="60" height="60" transform="rotate(-15 50 50)" stroke="currentColor" strokeWidth="1" />
                        </svg>
                    </div>

                    <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-12 relative z-10">
                        {/* Header Section */}
                        <div className="flex flex-col items-center text-center gap-4 mb-12">
                             <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-indigo-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                Academic Library
                            </div>
                            <h2 className="text-4xl sm:text-5xl font-bold text-slate-800 font-serif relative inline-block">
                                {classLabel} Subjects
                                {/* Artistic Underline */}
                                <svg className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-3 text-amber-400/60" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 12 100 5" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                                </svg>
                            </h2>
                            <p className="text-base text-slate-500 mt-2 max-w-lg font-serif italic">Explore the complete collection of {classLabel} subjects, organized for your learning journey.</p>
                            
                            <button onClick={() => onNavigate('landing')} className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition flex items-center gap-2 group">
                                <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
                                Back to Home
                            </button>
                        </div>

                        {/* Controls Section (Search & Filter) */}
                        <div className="max-w-4xl mx-auto mb-12 bg-white rounded-2xl p-2 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center gap-2">
                            {/* Filter Dropdown */}
                            <div className="w-full sm:w-1/3 relative group">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <i className="fa-solid fa-filter text-slate-400 text-xs"></i>
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
                            <div className="hidden sm:block w-px h-8 bg-slate-100"></div>

                            {/* Search Input */}
                            <div className="w-full sm:w-2/3 relative">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <i className="fa-solid fa-magnifying-glass text-slate-400 text-xs"></i>
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
                                <div className="w-full py-20 text-center">
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
