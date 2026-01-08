export const landingUi = `
        const FullScreenLoader = () => (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
                <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="mt-4 text-sm font-semibold text-slate-500 uppercase tracking-[0.2em] animate-pulse">Loading Content...</div>
            </div>
        );

        const useImagePreloader = (urls) => {
            const [ready, setReady] = useState(false);
            useEffect(() => {
                const validUrls = urls.filter(Boolean);
                if (validUrls.length === 0) {
                    const timer = setTimeout(() => setReady(true), 100); 
                    return () => clearTimeout(timer);
                }
                let mounted = true;
                let loadedCount = 0;
                const total = validUrls.length;
                const check = () => {
                    loadedCount++;
                    if (loadedCount >= total && mounted) {
                        setReady(true);
                    }
                };
                validUrls.forEach((url) => {
                    const img = new Image();
                    img.src = url;
                    if (img.complete) {
                        check();
                    } else {
                        img.onload = check;
                        img.onerror = check;
                    }
                });
                return () => { mounted = false; };
            }, [JSON.stringify(urls)]); 
            return ready;
        };

        const cardWidthClass = 'w-40 sm:w-44';
        const cardGridGapClass = 'gap-4 sm:gap-6';
        const cardSurfaceClass = 'relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-slate-100 bg-white transition-all duration-300 group-hover:shadow-xl group-hover:shadow-indigo-100/50 group-hover:-translate-y-1 card-art-surface';
        const cardPanelClass = 'relative';
        const flatSectionClass = 'border-b border-slate-200 pb-4 last:border-b-0';

        // Reusable Background Art Component
        const BackgroundArt = () => (
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none fixed opacity-30">
                 <svg className="absolute -top-20 -right-20 w-[600px] h-[600px] text-indigo-100 opacity-60" viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.5" />
                    <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                    <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="2" opacity="0.5" />
                    <circle cx="50" cy="50" r="15" fill="currentColor" opacity="0.2" />
                </svg>
                 <svg className="absolute top-10 left-0 w-96 h-96 text-slate-300 opacity-50" viewBox="0 0 200 200" fill="none">
                    <path d="M40 40 L90 20 L140 60" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="40" cy="40" r="3" fill="#fbbf24" />
                    <circle cx="90" cy="20" r="3" fill="#fbbf24" />
                    <circle cx="140" cy="60" r="3" fill="#fbbf24" />
                    <path d="M40 40 L60 120 L120 100" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" />
                    <circle cx="60" cy="120" r="2" fill="currentColor" />
                    <circle cx="120" cy="100" r="2" fill="currentColor" />
                </svg>
                <div className="absolute bottom-0 left-0 w-full h-64 opacity-20" style={{backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '24px 24px'}}></div>
                <svg className="absolute bottom-40 right-40 w-24 h-24 text-indigo-200 opacity-80 animate-pulse" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22h20L12 2z" /></svg>
                <svg className="absolute top-1/2 left-20 w-16 h-16 text-amber-200 opacity-80" viewBox="0 0 24 24" fill="currentColor" style={{transform: 'rotate(45deg)'}}><rect width="24" height="24" rx="4" /></svg>
            </div>
        );

        const getSubjectChapterCount = (subject) => {
            if (!contentLoaded || !subject) return null;
            const title = subject.title;
            if (subject.classLabel === 'SSC') {
                if (title === 'Information and Communication Technology') return sscIctChapters.length;
                if (title === 'Physics') return sscPhysicsChapters.length;
                if (title === 'Chemistry') return sscChemistryChapters.length;
                if (title === 'Biology') return sscBiologyChapters.length;
                if (title === 'Bangladesh and Global Studies') return sscBangladeshGlobalChapters.length;
                if (title === 'Religion and Moral Education') {
                    return Object.values(sscReligionChapters || {}).reduce((total, chapters) => total + (chapters?.length || 0), 0);
                }
                return null;
            }
            if (subject.classLabel === 'HSC') {
                if (title === 'Information and Communication Technology') return hscIctChapters.length;
                if (title === 'Physics 1st Paper') return hscPhysics1stChapters.length;
                if (title === 'Physics 2nd Paper') return hscPhysics2ndChapters.length;
                if (title === 'Chemistry 1st Paper') return hscChemistry1stChapters.length;
                if (title === 'Chemistry 2nd Paper') return hscChemistry2ndChapters.length;
                if (title === 'Biology 1st Paper') return hscBiology1stChapters.length;
                if (title === 'Biology 2nd Paper') return hscBiology2ndChapters.length;
                return null;
            }
            return null;
        };

        const ArtPanelGrid = ({ children, className = '' }) => (
            <div className={cardPanelClass}>
                <div className={'relative grid justify-items-center ' + cardGridGapClass + ' ' + className}>
                    {children}
                </div>
            </div>
        );

        const SubjectCard = ({ subject, onNavigate, className = '', showGroup = false }) => {
            const isActive = Boolean(subject.route);
            const chapterCount = getSubjectChapterCount(subject);
            return (
                <div 
                    onClick={() => isActive && onNavigate(subject.route)}
                    className={className + ' block text-left transition-all duration-300 group ' + (isActive ? 'cursor-pointer' : 'opacity-60 cursor-default')}
                >
                    <div className={cardSurfaceClass + ' mb-3 relative'}>
                        {subject.thumbnailUrl ? (
                            <img src={subject.thumbnailUrl} alt={subject.title + ' thumbnail'} loading="eager" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 card-art-media" />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 bg-slate-50 gap-2 card-art-media">
                                <div className={'h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm ' + subject.accent}>
                                    <i className={'fa-solid ' + subject.icon + ' text-sm text-slate-400'}></i>
                                </div>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        {subject.lastRead && (
                             <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-white/95 backdrop-blur-sm text-emerald-600 text-[9px] font-bold uppercase tracking-wider rounded shadow-sm flex items-center gap-1 z-10">
                                <i className="fa-solid fa-check-circle"></i>
                                Read
                             </div>
                        )}
                        {showGroup && subject.groupLabel && (
                            <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/50 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-wider rounded shadow-sm z-10">
                                {subject.groupLabel}
                            </div>
                        )}
                    </div>
                    <div className="pl-1">
                        <h4 className="font-bold text-base text-slate-800 leading-tight group-hover:text-indigo-700 transition-colors font-serif">{subject.title}</h4>
                        <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wide font-medium">
                            {subject.subtitle}
                            {chapterCount !== null && <span className="mx-1">•</span>}
                            {chapterCount !== null && <span>{chapterCount} Ch</span>}
                        </p>
                    </div>
                </div>
            );
        };

        const ChapterCard = ({ title, subtitle, thumbnailUrl, onClick, className = '', isRead = false }) => (
            <button onClick={onClick} className={className + ' block text-left transition-all duration-300 group'}>
                <div className="space-y-2 h-full text-center">
                    <div className={cardSurfaceClass + (isRead ? ' ring-2 ring-emerald-400' : '')}>
                        {isRead && (
                            <div className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-1 text-[10px] font-semibold text-white shadow-sm z-10">
                                <i className="fa-solid fa-check text-[10px]"></i>Read
                            </div>
                        )}
                        {thumbnailUrl ? (
                            <img src={thumbnailUrl} alt={title + ' thumbnail'} loading="eager" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 card-art-media" />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 text-[9px] uppercase tracking-[0.3em] card-art-media"><span>No thumbnail</span></div>
                        )}
                         <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="text-center px-1">
                        <div className="text-sm font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors font-bangla">{title}</div>
                        {subtitle && <div className="text-[10px] text-slate-500 mt-0.5">{subtitle}</div>}
                    </div>
                </div>
            </button>
        );

        const PublicChapterList = ({ classLabel, subjectLabel, chapters, onSelectChapter, recentRoute }) => {
            const chapterThumbnails = useThumbnails('/api/chapter-thumbnails', 'chapterKey');
            const { readMap, markRead } = useReadingProgress();
            const imageUrls = chapters.map(c => chapterThumbnails[makeChapterThumbnailKey(classLabel, subjectLabel, c.id)]?.url);
            const isReady = useImagePreloader(imageUrls);
            if (!isReady && chapters.length > 0) return <FullScreenLoader />;
            return (
                <ArtPanelGrid className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                    {chapters.map((chapter) => {
                        const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, chapter.id);
                        return (
                            <ChapterCard
                                key={chapter.id}
                                title={chapter.name}
                                subtitle={subjectLabel}
                                thumbnailUrl={chapterThumbnails[chapterKey]?.url}
                                isRead={Boolean(readMap[chapterKey])}
                                onClick={() => {
                                    markRead({ key: chapterKey, label: chapter.name, subjectLabel, route: recentRoute });
                                    onSelectChapter(chapter);
                                }}
                                className={cardWidthClass + ' font-bangla'}
                            />
                        );
                    })}
                    {chapters.length === 0 && <div className="border border-dashed border-slate-200 rounded-md p-6 text-sm text-slate-400 font-bangla text-center">এখনো কোনো অধ্যায় যোগ করা হয়নি।</div>}
                </ArtPanelGrid>
            );
        };

        const SubjectRow = ({ title, subjects, onNavigate, onAll, thumbnailMap, readMap }) => {
            const containerRef = useRef(null);
            const scroll = (direction) => {
                if (containerRef.current) {
                    const scrollAmount = direction === 'left' ? -300 : 300;
                    containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                }
            };
            return (
                <div className="w-full mb-12">
                    <div className="relative mb-8 px-2 py-4">
                        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
                             <svg className="absolute top-0 left-0 w-64 h-64 text-slate-200" viewBox="0 0 200 200" fill="none">
                                <circle cx="50" cy="50" r="2" fill="currentColor" />
                                <circle cx="120" cy="30" r="2" fill="currentColor" />
                                <path d="M50 50 L120 30" stroke="currentColor" strokeWidth="0.5" />
                                <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.5" />
                            </svg>
                             <svg className="absolute bottom-0 right-10 w-48 h-48 text-indigo-100" viewBox="0 0 100 100" fill="none">
                                <rect x="20" y="20" width="60" height="60" transform="rotate(15 50 50)" stroke="currentColor" strokeWidth="1" />
                            </svg>
                        </div>
                        <div className="relative flex items-end justify-between z-10 pl-2">
                            <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] pl-1 mb-1 block">Curriculum</span>
                                <h3 className="text-4xl font-bold text-slate-800 font-serif leading-none relative inline-block">
                                    {title}
                                    <span className="absolute -bottom-2 left-0 w-2/3 h-1.5 bg-indigo-500/20 rounded-full"></span>
                                    <span className="absolute -bottom-2 left-2/3 w-1.5 h-1.5 bg-amber-400 rounded-full ml-1"></span>
                                </h3>
                            </div>
                            <div className="flex items-center gap-3 pb-1">
                                <button onClick={() => scroll('left')} className="w-9 h-9 rounded-full bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 flex items-center justify-center transition shadow-sm hidden sm:flex"><i className="fa-solid fa-arrow-left text-sm"></i></button>
                                <button onClick={() => scroll('right')} className="w-9 h-9 rounded-full bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 flex items-center justify-center transition shadow-sm hidden sm:flex"><i className="fa-solid fa-arrow-right text-sm"></i></button>
                                <button onClick={onAll} className="px-4 py-2 rounded-full bg-white border border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 transition shadow-sm ml-2">View All</button>
                            </div>
                        </div>
                    </div>
                    <div ref={containerRef} className="flex overflow-x-auto gap-4 pb-8 px-2 snap-x hide-scrollbars pt-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {subjects.map((subject, index) => {
                            const thumbnail = thumbnailMap[subject.subjectKey];
                            const lastRead = getLastReadForSubject(readMap, subject.title);
                            return <SubjectCard key={index} subject={{ ...subject, lastRead, thumbnailUrl: thumbnail?.url }} onNavigate={onNavigate} className={'flex-none snap-start ' + cardWidthClass} />;
                        })}
                    </div>
                </div>
            );
        };

        const formatHierarchyLabel = (segment) => {
            if (!segment) return '';
            const normalized = segment.toLowerCase();
            const replacements = { ssc: 'SSC', hsc: 'HSC', ict: 'ICT', mcq: 'MCQ', cq: 'CQ', srijonshil: 'Srijonshil', shohopath: 'Shohopath', shahitto: 'Shahitto', goddo: 'Goddo', poddo: 'Poddo', topics: 'Topics', topic: 'Topic', chapters: 'Chapters', videos: 'Videos' };
            if (replacements[normalized]) return replacements[normalized];
            return segment.split('-').map((part) => replacements[part] || part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
        };

        const buildHierarchyTrail = () => {
            const { pathname } = window.location;
            const parts = pathname.split('/').filter(Boolean);
            const trail = [{ label: 'Home', path: '/' }];
            let currentPath = '';
            parts.forEach((part) => {
                currentPath += '/' + part;
                trail.push({ label: formatHierarchyLabel(part), path: currentPath });
            });
            return trail;
        };

        const PublicSidebar = ({ title, subtitle, onBack, onNavigate }) => {
            const [trail, setTrail] = useState(buildHierarchyTrail());
            useEffect(() => { setTrail(buildHierarchyTrail()); }, [title, subtitle]);
            return (
                <aside className="hidden lg:flex lg:w-64 border-r border-slate-100 bg-white/50 backdrop-blur-sm p-6 shrink-0 rounded-l-2xl">
                    <div className="flex flex-col gap-6 w-full">
                        <div>
                            <div className="text-[11px] uppercase tracking-[0.3em] text-slate-400 font-bold">Location</div>
                            <div className="mt-4 space-y-1">
                                {trail.map((item, index) => {
                                    const view = getViewFromPath(item.path);
                                    return (
                                        <button key={item.path} onClick={() => onNavigate(view)} className={\`w-full text-left text-sm py-1.5 transition flex items-center gap-2 \${index === trail.length - 1 ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'}\`}>
                                            <i className={\`fa-solid fa-angle-right text-[10px] \${index === trail.length - 1 ? 'text-indigo-400' : 'text-slate-300'}\`}></i>
                                            {item.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div>
                            <div className="text-[11px] uppercase tracking-[0.3em] text-slate-400 font-bold">Shortcuts</div>
                            <div className="mt-3 space-y-2">
                                {onBack && <button onClick={onBack} className="w-full text-left text-sm font-semibold text-slate-600 hover:text-indigo-600 transition py-1">Back</button>}
                                <button onClick={() => onNavigate('landing')} className="w-full text-left text-sm font-semibold text-slate-600 hover:text-indigo-600 transition py-1">Home</button>
                                <button onClick={() => onNavigate('public-videos')} className="w-full text-left text-sm font-semibold text-slate-600 hover:text-indigo-600 transition py-1">Videos</button>
                            </div>
                        </div>
                    </div>
                </aside>
            );
        };

        const PublicSimpleShell = ({ title, subtitle, backgroundClass = 'bg-slate-50', onBack, onNavigate, children }) => (
            <div className={'flex-1 min-h-screen relative ' + backgroundClass}>
                <BackgroundArt />
                <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-8 relative z-10">
                    {/* Stylized Header */}
                    <div className="grid grid-cols-[auto,1fr,auto] items-center gap-4 border-b border-slate-200/60 pb-6 mb-8">
                        {onBack ? (
                            <button onClick={onBack} className="w-12 h-12 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition flex items-center justify-center group">
                                <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
                            </button>
                        ) : <div className="w-12 h-12" />}
                        
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif leading-tight">
                                {title}
                            </h2>
                            {subtitle && <p className="text-base text-slate-500 font-serif italic opacity-80">{subtitle}</p>}
                        </div>
                        
                        <button onClick={() => onNavigate('landing')} className="px-5 py-2.5 rounded-full bg-white/80 border border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-indigo-600 hover:border-indigo-200 transition shadow-sm backdrop-blur-sm">
                            Home
                        </button>
                    </div>

                    <div className="mt-6 lg:flex lg:gap-8">
                        <PublicSidebar title={title} subtitle={subtitle} onBack={onBack} onNavigate={onNavigate} />
                        <div className="flex-1 min-w-0">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        );

        const CqQuestionList = ({ sections }) => {
            const [openMap, setOpenMap] = useState({});
            const toggleAnswer = (sectionKey, index) => { setOpenMap((prev) => ({ ...prev, [sectionKey + '-' + index]: !prev[sectionKey + '-' + index] })); };
            if (!sections.length) return <div className="text-sm text-slate-400">এখনো কোন প্রশ্ন যোগ করা হয়নি।</div>;
            return (
                <div className="space-y-4">
                    {sections.map((section) => (
                        <div key={section.key} className={flatSectionClass}>
                            <div className="text-sm font-semibold text-slate-900">{section.label}</div>
                            {section.items.length === 0 ? <div className="text-sm text-slate-400 mt-3">এখনো কোন প্রশ্ন যোগ করা হয়নি।</div> : (
                                <div className="mt-4 space-y-4">
                                    {section.items.map((entry, index) => {
                                        const openKey = section.key + '-' + index;
                                        const isOpen = Boolean(openMap[openKey]);
                                        return (
                                            <div key={entry.question + '-' + index} className="space-y-2">
                                                <div className="text-sm font-semibold text-slate-800">{section.prefix(index)}. {entry.question}</div>
                                                <button onClick={() => toggleAnswer(section.key, index)} className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition">{isOpen ? 'উত্তর লুকান' : 'উত্তর দেখুন'}</button>
                                                {isOpen && <div className="text-sm text-slate-600 border-l-2 border-slate-200 pl-3">{entry.answer}</div>}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            );
        };

        const PublicMcqList = ({ mcqList }) => {
            const optionLabels = ['ক', 'খ', 'গ', 'ঘ'];
            const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            const toBanglaNumber = (value) => String(value).split('').map((digit) => banglaDigits[Number(digit)] ?? digit).join('');
            const [globalOpen, setGlobalOpen] = useState(false);
            const [openOverrides, setOpenOverrides] = useState({});
            const isOpen = (index) => openOverrides[index] !== undefined ? openOverrides[index] : globalOpen;
            const toggleAnswer = (index) => { setOpenOverrides((prev) => ({ ...prev, [index]: !isOpen(index) })); };
            const showAll = () => { setGlobalOpen(true); setOpenOverrides({}); };
            const hideAll = () => { setGlobalOpen(false); setOpenOverrides({}); };
            if (mcqList.length === 0) return <div className="text-sm text-slate-400">এখনো কোন MCQ প্রশ্ন যোগ করা হয়নি।</div>;
            return (
                <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-500">
                        <span>মোট প্রশ্ন: {toBanglaNumber(mcqList.length)}</span>
                        <div className="flex flex-wrap gap-2">
                            <button onClick={showAll} className="px-3 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition">সকল উত্তর দেখুন</button>
                            <button onClick={hideAll} className="px-3 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition">সকল উত্তর লুকান</button>
                        </div>
                    </div>
                    <div className="border-y border-slate-200 divide-y">
                        {mcqList.map((entry, index) => (
                            <div key={entry.question + '-' + index} className="px-4 py-4">
                                <div className="text-sm font-semibold text-slate-900">{toBanglaNumber(index + 1)}. {entry.question}</div>
                                <div className="mt-2 grid gap-1 text-sm text-slate-700">{(entry.options || []).map((option, optionIndex) => <div key={entry.question + '-' + optionIndex}>{optionLabels[optionIndex]}. {option}</div>)}</div>
                                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                                    <button onClick={() => toggleAnswer(index)} className="px-3 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition">{isOpen(index) ? 'উত্তর লুকান' : 'উত্তর দেখুন'}</button>
                                    {isOpen(index) && <div className="text-emerald-700 font-semibold">উত্তর: {optionLabels[entry.answerIndex]}। {entry.options?.[entry.answerIndex]}</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        };
`;
