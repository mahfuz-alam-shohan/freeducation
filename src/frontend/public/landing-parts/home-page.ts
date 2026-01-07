export const landingHome = `
        const StudentLanding = ({ onNavigate }) => {
            const [quoteIndex, setQuoteIndex] = useState(0);
            const [quickQuery, setQuickQuery] = useState('');
            const thumbnailMap = useThumbnails('/api/thumbnails', 'subjectKey');
            const { readMap, recentRead } = useReadingProgress();
            const { recentVideo } = useVideoProgress();

            // Collect all images we need to show
            const allSubjects = [...sscFeaturedSubjects, ...hscFeaturedSubjects];
            const imageUrls = allSubjects.map(s => thumbnailMap[s.subjectKey]?.url);
            const isReady = useImagePreloader(imageUrls);

            useEffect(() => {
                const timer = setInterval(() => { setQuoteIndex((prev) => (prev + 1) % quoteItems.length); }, 9000);
                return () => clearInterval(timer);
            }, []);

            const activeQuote = quoteItems[quoteIndex];
            const continueLabel = recentRead?.label;
            const continueRoute = recentRead?.route;
            const continueVideoTitle = recentVideo?.title;
            const continueVideoRoute = recentVideo?.route || 'public-videos';
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

                [...sscSubjects, ...hscSubjects].forEach((subject) => {
                    if (!subject.route) return;
                    addEntry({ type: 'Subject', title: subject.title, subtitle: subject.classLabel + ' • ' + subject.groupLabel, keywords: [subject.title, subject.subtitle, subject.classLabel, subject.groupLabel].join(' '), onSelect: () => onNavigate(subject.route) });
                });

                const scienceConfigs = [
                    { classLabel: 'SSC', subjectLabel: 'Physics', chapters: sscPhysicsChapters, listRoute: 'public-ssc-physics-topics', topicRoute: 'public-ssc-physics-topic' },
                    { classLabel: 'SSC', subjectLabel: 'Chemistry', chapters: sscChemistryChapters, listRoute: 'public-ssc-chemistry-topics', topicRoute: 'public-ssc-chemistry-topic' },
                    { classLabel: 'SSC', subjectLabel: 'Biology', chapters: sscBiologyChapters, listRoute: 'public-ssc-biology-topics', topicRoute: 'public-ssc-biology-topic' },
                    { classLabel: 'SSC', subjectLabel: 'Bangladesh and Global Studies', chapters: sscBangladeshGlobalChapters, listRoute: 'public-ssc-bangladesh-global-studies-topics', topicRoute: 'public-ssc-bangladesh-global-studies-topic' },
                    { classLabel: 'HSC', subjectLabel: 'Physics 1st Paper', chapters: hscPhysics1stChapters, listRoute: 'public-hsc-physics-1st-topics', topicRoute: 'public-hsc-physics-1st-topic' },
                    { classLabel: 'HSC', subjectLabel: 'Physics 2nd Paper', chapters: hscPhysics2ndChapters, listRoute: 'public-hsc-physics-2nd-topics', topicRoute: 'public-hsc-physics-2nd-topic' },
                    { classLabel: 'HSC', subjectLabel: 'Chemistry 1st Paper', chapters: hscChemistry1stChapters, listRoute: 'public-hsc-chemistry-1st-topics', topicRoute: 'public-hsc-chemistry-1st-topic' },
                    { classLabel: 'HSC', subjectLabel: 'Chemistry 2nd Paper', chapters: hscChemistry2ndChapters, listRoute: 'public-hsc-chemistry-2nd-topics', topicRoute: 'public-hsc-chemistry-2nd-topic' },
                    { classLabel: 'HSC', subjectLabel: 'Biology 1st Paper', chapters: hscBiology1stChapters, listRoute: 'public-hsc-biology-1st-topics', topicRoute: 'public-hsc-biology-1st-topic' },
                    { classLabel: 'HSC', subjectLabel: 'Biology 2nd Paper', chapters: hscBiology2ndChapters, listRoute: 'public-hsc-biology-2nd-topics', topicRoute: 'public-hsc-biology-2nd-topic' },
                    { classLabel: 'HSC', subjectLabel: 'Information and Communication Technology', chapters: hscIctChapters, listRoute: 'public-hsc-ict-topics', topicRoute: 'public-hsc-ict-topic', questionKey: 'ICT' }
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

                (sscIctChapters || []).forEach((chapter) => {
                    addEntry({
                        type: 'Chapter', title: chapter.name, subtitle: 'ICT • SSC', keywords: [chapter.name, 'ICT', 'SSC', 'chapter'].join(' '),
                        onSelect: () => { setSelectedIctChapter(chapter); setSelectedIctClass('SSC'); onNavigate('public-ssc-ict-mcq'); }
                    });
                });

                religionOptions.forEach((option) => {
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
                addBanglaItems('SSC', 'গদ্য', sscGoddoItems, 'public-bangla-ssc-item');
                addBanglaItems('SSC', 'পদ্য', sscPoddoItems, 'public-bangla-ssc-item');
                addBanglaItems('SSC', 'সহপাঠ', sscShohopathItems, 'public-bangla-ssc-item');
                addBanglaItems('HSC', 'গদ্য', hscGoddoItems, 'public-bangla-hsc-item');
                addBanglaItems('HSC', 'পদ্য', hscPoddoItems, 'public-bangla-hsc-item');
                addBanglaItems('HSC', 'সহপাঠ', hscShohopathItems, 'public-bangla-hsc-item');
                return entries;
            };

            const quickResults = normalizedQuickQuery ? buildQuickSearchEntries().filter((entry) => { const haystack = (entry.keywords || entry.title || '').toLowerCase(); return haystack.includes(normalizedQuickQuery); }).slice(0, 10) : [];
            const handleQuickSelect = (entry) => { if (!entry?.onSelect) return; entry.onSelect(); };

            if (!isReady) return <FullScreenLoader />;

            return (
                <div className="flex-1 bg-[#f3f6ff]">
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
                                <div className="max-w-xl bg-indigo-600 border border-indigo-500 rounded-md p-6 text-white">
                                    <p className="text-base sm:text-lg font-serif italic leading-relaxed">“{activeQuote.text}”</p>
                                    <p className="text-sm font-semibold text-white/90 mt-3">— {activeQuote.author}</p>
                                </div>
                            </div>
                            <div className="mt-6">
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
                            {continueLabel && continueRoute && (
                                <div className="mt-6"><button onClick={() => onNavigate(continueRoute)} className="w-full sm:w-auto inline-flex items-center gap-3 rounded-md bg-emerald-400/90 text-emerald-950 px-5 py-3 text-sm font-semibold shadow-sm hover:bg-emerald-300 transition"><i className="fa-solid fa-play"></i>Continue Reading: {continueLabel}</button></div>
                            )}
                            {continueVideoTitle && (
                                <div className="mt-3"><button onClick={() => onNavigate(continueVideoRoute)} className="w-full sm:w-auto inline-flex items-center gap-3 rounded-md bg-indigo-500/90 text-white px-5 py-3 text-sm font-semibold shadow-sm hover:bg-indigo-400 transition"><i className="fa-solid fa-circle-play"></i>Continue Watching: {continueVideoTitle}</button></div>
                            )}
                        </div>
                    </section>
                    <section className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-10 space-y-6 bg-white relative z-0">
                        <div className="text-center">
                            <div className="text-xs uppercase tracking-[0.2em] text-indigo-500">Academic</div>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-2">Academic</h2>
                        </div>
                        <SubjectRow title="SSC" subjects={sscFeaturedSubjects} onNavigate={onNavigate} onAll={() => onNavigate('ssc-subjects')} thumbnailMap={thumbnailMap} readMap={readMap} />
                        <SubjectRow title="HSC" subjects={hscFeaturedSubjects} onNavigate={onNavigate} onAll={() => onNavigate('hsc-subjects')} thumbnailMap={thumbnailMap} readMap={readMap} />
                    </section>
                </div>
            );
        };
`;
