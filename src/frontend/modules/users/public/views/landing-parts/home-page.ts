export const landingHome = `
        const StudentLanding = ({ onNavigate }) => {
            const [quoteIndex, setQuoteIndex] = useState(0);
            const [quickQuery, setQuickQuery] = useState('');
            const thumbnailMap = useThumbnails('/api/thumbnails', 'subjectKey');
            const { readMap } = useReadingProgress();
            const isStudent = user?.role === 'student';
            const studentClass = user?.classLabel;
            const allowedClass = isStudent && (studentClass === 'SSC' || studentClass === 'HSC') ? studentClass : null;
            const showSsc = !allowedClass || allowedClass === 'SSC';
            const showHsc = !allowedClass || allowedClass === 'HSC';
            const scopedSscSubjects = showSsc ? sscSubjects : [];
            const scopedHscSubjects = showHsc ? hscSubjects : [];
            const scopedSscFeatured = showSsc ? sscFeaturedSubjects : [];
            const scopedHscFeatured = showHsc ? hscFeaturedSubjects : [];

            // Collect all images we need to show
            const allSubjects = [...scopedSscFeatured, ...scopedHscFeatured];
            const imageUrls = allSubjects.map(s => thumbnailMap[s.subjectKey]?.url);
            const isReady = useImagePreloader(imageUrls);

            useEffect(() => {
                const timer = setInterval(() => { setQuoteIndex((prev) => (prev + 1) % quoteItems.length); }, 9000);
                return () => clearInterval(timer);
            }, []);

            const activeQuote = quoteItems[quoteIndex];

            const normalizedQuickQuery = quickQuery.trim().toLowerCase();
            const buildQuickSearchEntries = () => {
                const entries = [];
                const addEntry = (entry) => entries.push(entry);
                const addContentEntries = ({ noteKey, parentLabel, onSelect, videoContext }) => {
                    const notes = (notesByItem || {})[noteKey] || [];
                    notes.forEach((note, index) => {
                        addEntry({ type: 'Content', title: note, subtitle: parentLabel + ' • Note ' + (index + 1), keywords: [note, parentLabel, 'note', 'content'].join(' '), onSelect });
                    });
                    const videos = (videosByItem || {})[noteKey] || [];
                    videos.forEach((video) => {
                        addEntry({
                            type: 'Video', title: video.title, subtitle: parentLabel + ' • Video', keywords: [video.title, parentLabel, 'video'].join(' '),
                            onSelect: () => { setSelectedVideoContext({ ...videoContext, noteKey }); setSelectedVideoId(video.id); onNavigate('public-video-player'); }
                        });
                    });
                };

                [...scopedSscSubjects, ...scopedHscSubjects].forEach((subject) => {
                    if (!subject.route) return;
                    addEntry({ type: 'Subject', title: subject.title, subtitle: subject.classLabel + ' • ' + subject.groupLabel, keywords: [subject.title, subject.subtitle, subject.classLabel, subject.groupLabel].join(' '), onSelect: () => onNavigate(subject.route) });
                });

                const scienceConfigs = [
                    ...(showSsc ? [
                        { classLabel: 'SSC', subjectLabel: 'Physics', chapters: sscPhysicsChapters, listRoute: 'public-ssc-physics-topics', topicRoute: 'public-ssc-physics-topic' },
                        { classLabel: 'SSC', subjectLabel: 'Chemistry', chapters: sscChemistryChapters, listRoute: 'public-ssc-chemistry-topics', topicRoute: 'public-ssc-chemistry-topic' },
                        { classLabel: 'SSC', subjectLabel: 'Biology', chapters: sscBiologyChapters, listRoute: 'public-ssc-biology-topics', topicRoute: 'public-ssc-biology-topic' },
                        { classLabel: 'SSC', subjectLabel: 'Bangladesh and Global Studies', chapters: sscBangladeshGlobalChapters, listRoute: 'public-ssc-bangladesh-global-studies-topics', topicRoute: 'public-ssc-bangladesh-global-studies-topic' }
                    ] : []),
                    ...(showHsc ? [
                        { classLabel: 'HSC', subjectLabel: 'Physics 1st Paper', chapters: hscPhysics1stChapters, listRoute: 'public-hsc-physics-1st-topics', topicRoute: 'public-hsc-physics-1st-topic' },
                        { classLabel: 'HSC', subjectLabel: 'Physics 2nd Paper', chapters: hscPhysics2ndChapters, listRoute: 'public-hsc-physics-2nd-topics', topicRoute: 'public-hsc-physics-2nd-topic' },
                        { classLabel: 'HSC', subjectLabel: 'Chemistry 1st Paper', chapters: hscChemistry1stChapters, listRoute: 'public-hsc-chemistry-1st-topics', topicRoute: 'public-hsc-chemistry-1st-topic' },
                        { classLabel: 'HSC', subjectLabel: 'Chemistry 2nd Paper', chapters: hscChemistry2ndChapters, listRoute: 'public-hsc-chemistry-2nd-topics', topicRoute: 'public-hsc-chemistry-2nd-topic' },
                        { classLabel: 'HSC', subjectLabel: 'Biology 1st Paper', chapters: hscBiology1stChapters, listRoute: 'public-hsc-biology-1st-topics', topicRoute: 'public-hsc-biology-1st-topic' },
                        { classLabel: 'HSC', subjectLabel: 'Biology 2nd Paper', chapters: hscBiology2ndChapters, listRoute: 'public-hsc-biology-2nd-topics', topicRoute: 'public-hsc-biology-2nd-topic' },
                        { classLabel: 'HSC', subjectLabel: 'Information and Communication Technology', chapters: hscIctChapters, listRoute: 'public-hsc-ict-topics', topicRoute: 'public-hsc-ict-topic', questionKey: 'ICT' }
                    ] : [])
                ];

                scienceConfigs.forEach((config) => {
                    (config.chapters || []).forEach((chapter) => {
                        addEntry({
                            type: 'Chapter', title: chapter.name, subtitle: config.subjectLabel + ' • ' + config.classLabel, keywords: [chapter.name, config.subjectLabel, config.classLabel, 'chapter'].join(' '),
                            onSelect: () => { setSelectedScienceChapter(chapter); setSelectedScienceSubject({ classLabel: config.classLabel, subjectLabel: config.subjectLabel, questionKey: config.questionKey }); setSelectedScienceTopic(null); onNavigate(config.listRoute); }
                        });
                        (chapter.topics || []).forEach((topic) => {
                            const topicKey = getScienceTopicKey(chapter.id, topic.id);
                            const noteKey = [config.classLabel, config.subjectLabel, topicKey].join('-');
                            const topicAction = () => { setSelectedScienceChapter(chapter); setSelectedScienceSubject({ classLabel: config.classLabel, subjectLabel: config.subjectLabel, questionKey: config.questionKey }); setSelectedScienceTopic(topic); onNavigate(config.topicRoute); };
                            const parentLabel = topic.name + ' • ' + chapter.name;
                            addEntry({ type: 'Topic', title: topic.name, subtitle: config.subjectLabel + ' • ' + chapter.name, keywords: [topic.name, chapter.name, config.subjectLabel, 'topic'].join(' '), onSelect: topicAction });
                            addContentEntries({ noteKey, parentLabel, onSelect: topicAction, videoContext: { title: topic.name, subtitle: chapter.name, backRoute: config.topicRoute, backgroundClass: 'bg-[#ecfdf3]' } });
                        });
                    });
                });

                if (showSsc) (sscIctChapters || []).forEach((chapter) => {
                    addEntry({
                        type: 'Chapter', title: chapter.name, subtitle: 'ICT • SSC', keywords: [chapter.name, 'ICT', 'SSC', 'chapter'].join(' '),
                        onSelect: () => { setSelectedIctChapter(chapter); setSelectedIctClass('SSC'); onNavigate('public-ssc-ict-mcq'); }
                    });
                });

                if (showSsc) religionOptions.forEach((option) => {
                    const chapters = (sscReligionChapters || {})[option.key] || [];
                    chapters.forEach((chapter) => {
                        addEntry({
                            type: 'Chapter', title: chapter.name, subtitle: option.label + ' • Religion', keywords: [chapter.name, option.label, option.subtitle, 'religion', 'chapter'].join(' '),
                            onSelect: () => { setSelectedReligion(option); setSelectedScienceChapter(chapter); setSelectedScienceSubject({ classLabel: 'SSC', subjectLabel: 'Religion and Moral Education', religionKey: option.key }); setSelectedScienceTopic(null); onNavigate('public-ssc-religion-topics'); }
                        });
                        (chapter.topics || []).forEach((topic) => {
                            const topicKey = getScienceTopicKey(chapter.id, topic.id);
                            const noteKey = ['SSC', getReligionSubjectKey(option), topicKey].join('-');
                            const topicAction = () => { setSelectedReligion(option); setSelectedScienceChapter(chapter); setSelectedScienceSubject({ classLabel: 'SSC', subjectLabel: 'Religion and Moral Education', religionKey: option.key }); setSelectedScienceTopic(topic); onNavigate('public-ssc-religion-topic'); };
                            const parentLabel = topic.name + ' • ' + chapter.name;
                            addEntry({ type: 'Topic', title: topic.name, subtitle: option.label + ' • ' + chapter.name, keywords: [topic.name, chapter.name, option.label, 'religion', 'topic'].join(' '), onSelect: topicAction });
                            addContentEntries({ noteKey, parentLabel, onSelect: topicAction, videoContext: { title: topic.name, subtitle: chapter.name, backRoute: 'public-ssc-religion-topic', backgroundClass: 'bg-[#ecfdf3]' } });
                        });
                    });
                });

                const addBanglaItems = (classLabel, categoryLabel, items, itemRoute) => {
                    (items || []).forEach((item) => {
                        const itemName = typeof item === 'string' ? item : item.name;
                        const label = typeof item === 'string' ? categoryLabel : item.type;
                        if (!itemName || !label) return;
                        const noteKey = [classLabel, label, itemName].join('-');
                        const itemAction = () => { storeBanglaSelection({ classLabel, categoryName: label, itemName }); setSelectedBanglaItem(itemName); setSelectedBanglaCategory(label); onNavigate(itemRoute); };
                        const parentLabel = itemName + ' • ' + label;
                        addEntry({ type: 'Content', title: itemName, subtitle: classLabel + ' Bangla • ' + label, keywords: [itemName, label, classLabel, 'bangla', 'content'].join(' '), onSelect: itemAction });
                        addContentEntries({ noteKey, parentLabel, onSelect: itemAction, videoContext: { title: itemName, subtitle: label, backRoute: itemRoute, backgroundClass: 'bg-[#fff7ed]' } });
                    });
                };
                if (showSsc) {
                    addBanglaItems('SSC', 'গদ্য', sscGoddoItems, 'public-bangla-ssc-item');
                    addBanglaItems('SSC', 'পদ্য', sscPoddoItems, 'public-bangla-ssc-item');
                    addBanglaItems('SSC', 'সহপাঠ', sscShohopathItems, 'public-bangla-ssc-item');
                }
                if (showHsc) {
                    addBanglaItems('HSC', 'গদ্য', hscGoddoItems, 'public-bangla-hsc-item');
                    addBanglaItems('HSC', 'পদ্য', hscPoddoItems, 'public-bangla-hsc-item');
                    addBanglaItems('HSC', 'সহপাঠ', hscShohopathItems, 'public-bangla-hsc-item');
                }
                return entries;
            };

            const quickResults = normalizedQuickQuery ? buildQuickSearchEntries().filter((entry) => { const haystack = (entry.keywords || entry.title || '').toLowerCase(); return haystack.includes(normalizedQuickQuery); }).slice(0, 10) : [];
            const handleQuickSelect = (entry) => { if (!entry?.onSelect) return; entry.onSelect(); };

            if (!isReady) return <FullScreenLoader />;

            return (
                <div className="flex-1 bg-white">
                    {/* Style to hide scrollbars for the academic section */}
                    <style>{\`
                        .hide-scrollbars *::-webkit-scrollbar { display: none !important; }
                        .hide-scrollbars * { -ms-overflow-style: none; scrollbar-width: none; }
                    \`}</style>

                    <section className="relative bg-indigo-700">
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                             <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-indigo-600/60"></div>
                             <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-amber-400/40"></div>
                        </div>
                        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-14 relative z-10">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-md bg-white/90 border border-white/60 flex items-center justify-center shadow-lg">
                                        <svg viewBox="0 0 24 24" className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 9.5L12 5l8.5 4.5L12 14 3.5 9.5z" /><path d="M6.5 11.2V16c0 .7.4 1.4 1.1 1.7C9 18.4 10.4 19 12 19s3-.6 4.4-1.3c.7-.3 1.1-1 1.1-1.7v-4.8" /><path d="M20.5 9.7V14" /><path d="M21.5 14h-2" /></svg>
                                    </div>
                                    <div><div className="text-3xl sm:text-4xl font-semibold text-white">Freeducation</div><div className="text-sm text-white/80 uppercase tracking-[0.2em] mt-1">Serve education with clarity</div></div>
                                </div>
                                <div className="max-w-xl text-white">
                                    <p className="text-base sm:text-lg font-serif italic leading-relaxed opacity-90">“{activeQuote.text}”</p>
                                    <p className="text-sm font-semibold opacity-80 mt-2">— {activeQuote.author}</p>
                                </div>
                            </div>
                            <div className="mt-8">
                                <div className="relative">
                                    <label className="text-[11px] uppercase tracking-[0.3em] text-white/70">Quick Search</label>
                                    <input value={quickQuery} onChange={(event) => setQuickQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && quickResults[0]) { handleQuickSelect(quickResults[0]); } }} placeholder="Search subjects, chapters, topics, notes, videos..." className="mt-2 w-full rounded-lg border border-white/30 bg-white/95 py-2.5 pl-11 pr-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-white" />
                                    <i className="fa-solid fa-magnifying-glass absolute left-4 top-[calc(50%+12px)] -translate-y-1/2 text-slate-400"></i>
                                    {normalizedQuickQuery && (
                                        <div className="absolute left-0 right-0 mt-2 z-[100] rounded-lg border border-white/40 bg-white/95 text-slate-700 max-h-72 overflow-y-auto shadow-2xl">
                                            {quickResults.length === 0 && <div className="px-4 py-3 text-sm text-slate-400 text-left">No matches found.</div>}
                                            {quickResults.map((entry, index) => (
                                                <button key={entry.title + '-' + entry.type + '-' + index} onClick={() => handleQuickSelect(entry)} className="w-full text-left px-4 py-3 hover:bg-slate-50 transition">
                                                    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{entry.type}</div>
                                                    <div className="text-sm font-semibold text-slate-900">{entry.title}</div>
                                                    {entry.subtitle && <div className="text-xs text-slate-500 mt-1">{entry.subtitle}</div>}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Academic Section with Styled Background & No Scrollbars */}
                    <section className="relative w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-16 space-y-10 bg-slate-50 z-0 hide-scrollbars overflow-hidden">
                        
                        {/* Abstract Background Art */}
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-30">
                            {/* Circle 1 */}
                            <svg className="absolute -top-20 -left-20 w-96 h-96 text-slate-200" fill="currentColor" viewBox="0 0 200 200">
                                <path fillOpacity="0.5" d="M44.5,-73.2C58.9,-68.7,72.6,-61.4,82.4,-50.3C92.2,-39.2,98.1,-24.3,95.8,-10.1C93.5,4.1,83,17.6,73.4,30.2C63.8,42.8,55.1,54.6,44.1,63.9C33.1,73.2,19.9,80,6.1,80.9C-7.7,81.8,-22,76.8,-34.5,69.5C-47,62.2,-57.6,52.6,-66.1,41.4C-74.6,30.2,-81,17.4,-80.7,5C-80.4,-7.4,-73.4,-19.4,-64.3,-29.4C-55.2,-39.4,-44,-47.4,-32.2,-53.4C-20.4,-59.4,-8,-63.3,4,-69.5C16.1,-75.7,30.1,-69.1,44.5,-73.2Z" transform="translate(100 100)" />
                            </svg>
                            {/* Circle 2 */}
                            <svg className="absolute bottom-0 right-0 w-[500px] h-[500px] text-slate-200" fill="currentColor" viewBox="0 0 200 200">
                                <path fillOpacity="0.5" d="M39.9,-65.7C50.8,-57.5,58.3,-45.3,64.6,-33.4C70.9,-21.5,76,-9.9,74.9,1.1C73.8,12.1,66.5,22.5,58.8,32.3C51.1,42.1,43,51.3,33.3,58.3C23.6,65.3,12.3,70.1,0.6,69.1C-11.1,68.1,-22.8,61.3,-33.4,54.5C-44,47.7,-53.5,40.9,-60.7,31.7C-67.9,22.5,-72.8,10.9,-70.9,0.5C-69,-9.9,-60.3,-19.1,-52.1,-27.6C-43.9,-36.1,-36.2,-43.9,-27.3,-53.6C-18.4,-63.3,-8.2,-74.9,3.3,-80.6C14.8,-86.3,29,-86,39.9,-65.7Z" transform="translate(100 100)" />
                            </svg>
                            {/* Dots Pattern */}
                            <div className="absolute top-20 right-20 w-32 h-32 opacity-20" style={{backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)', backgroundSize: '16px 16px'}}></div>
                            <div className="absolute bottom-20 left-20 w-48 h-48 opacity-20" style={{backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)', backgroundSize: '16px 16px'}}></div>
                        </div>

                        {/* Styled Header Section */}
                        <div className="relative z-10 mb-12 text-center">
                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 font-serif tracking-tight">
                                <span className="relative inline-block">
                                    Academic Courses
                                    <span className="absolute -bottom-2 left-0 w-full h-1.5 bg-indigo-500 rounded-full opacity-20"></span>
                                </span>
                            </h2>
                            <p className="mt-4 text-slate-500 max-w-lg mx-auto text-base">Select your class level below to explore subjects, chapters, and resources.</p>
                        </div>

                        {/* Content */}
                        <div className="relative z-10">
                            {allowedClass ? (
                                <SubjectRow title={allowedClass} subjects={allowedClass === 'SSC' ? scopedSscFeatured : scopedHscFeatured} onNavigate={onNavigate} onAll={() => onNavigate(allowedClass === 'SSC' ? 'ssc-subjects' : 'hsc-subjects')} thumbnailMap={thumbnailMap} readMap={readMap} />
                            ) : (
                                <>
                                    <SubjectRow title="SSC" subjects={scopedSscFeatured} onNavigate={onNavigate} onAll={() => onNavigate('ssc-subjects')} thumbnailMap={thumbnailMap} readMap={readMap} />
                                    <div className="h-10"></div>
                                    <SubjectRow title="HSC" subjects={scopedHscFeatured} onNavigate={onNavigate} onAll={() => onNavigate('hsc-subjects')} thumbnailMap={thumbnailMap} readMap={readMap} />
                                </>
                            )}
                            {isStudent && studentClass && !allowedClass && (
                                <div className="mt-10 bg-white border border-dashed border-slate-200 rounded-2xl p-6 text-center text-sm text-slate-500">
                                    Academic content for this class level is coming soon. Keep your profile updated for new updates.
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            );
        };
`;
