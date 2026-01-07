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
            return (
                <div className="flex-1 bg-[#f3f6ff]">
                    <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-8">
                        <div className="flex flex-col items-center text-center gap-2">
                            <div className="text-xs uppercase tracking-[0.2em] text-indigo-500">Academic</div>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-2">{classLabel} Subjects</h2>
                            <p className="text-sm text-slate-500 mt-2">Browse the complete {classLabel} list by group or search for a subject.</p>
                            <button onClick={() => onNavigate('landing')} className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-md transition hover:border-indigo-300 hover:text-indigo-700">Back to Home</button>
                        </div>
                        <div className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)] lg:items-end">
                            <div>
                                <label className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Group filter</label>
                                <select value={activeGroup} onChange={(event) => setActiveGroup(event.target.value)} className="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200">
                                    {groups.map((group) => <option key={group} value={group}>{group}</option>)}
                                </select>
                            </div>
                            <div className="relative w-full">
                                <label className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Search</label>
                                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search subjects" className="mt-2 w-full border border-slate-200 rounded-lg py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                                <i className="fa-solid fa-magnifying-glass absolute left-4 top-[calc(50%+12px)] -translate-y-1/2 text-slate-400"></i>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400"><span>Showing</span><span>{filteredSubjects.length} subjects</span></div>
                        <div className={'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 justify-items-center ' + cardGridGapClass + ' mt-4'}>
                            {filteredSubjects.map((subject) => {
                                const thumbnail = thumbnailMap[subject.subjectKey];
                                const lastRead = getLastReadForSubject(readMap, subject.title);
                                return <SubjectCard key={subject.subjectKey} subject={{ ...subject, lastRead, thumbnailUrl: thumbnail?.url }} onNavigate={onNavigate} className={cardWidthClass} showGroup />;
                            })}
                        </div>
                    </div>
                </div>
            );
        };
`;
