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
                // If there are no images to load, we are ready immediately
                // But we add a small delay to prevent flickering if data comes in fast
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
                        img.onerror = check; // Proceed even if image fails
                    }
                });

                return () => { mounted = false; };
            }, [JSON.stringify(urls)]); // Re-run if the list of images changes
            return ready;
        };

        const cardWidthClass = 'w-36 sm:w-40 md:w-44';
        const cardGridGapClass = 'gap-2 sm:gap-4';
        const cardSurfaceClass = 'relative w-full aspect-[4/5] rounded-lg overflow-hidden border border-slate-200 bg-white transition group-hover:border-indigo-200 card-art-surface';
        const cardPanelClass = 'relative';
        const flatSectionClass = 'border-b border-slate-200 pb-4 last:border-b-0';

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
                <button
                    onClick={() => isActive && onNavigate(subject.route)}
                    className={className + ' block h-full text-left transition-all duration-300 group ' + (isActive ? 'cursor-pointer' : 'opacity-60 cursor-default')}
                    disabled={!isActive}
                >
                    <div className="space-y-1.5 h-full text-center">
                        <div className={cardSurfaceClass}>
                            {subject.thumbnailUrl ? (
                                <img src={subject.thumbnailUrl} alt={subject.title + ' thumbnail'} loading="eager" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 card-art-media" />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-2 card-art-media">
                                    <div className={'h-9 w-9 rounded-lg text-white flex items-center justify-center shadow-sm ' + subject.accent}>
                                        <i className={'fa-solid ' + subject.icon + ' text-xs'}></i>
                                    </div>
                                    <div className="text-[9px] uppercase tracking-[0.3em]">Thumbnail</div>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 flex flex-col items-center text-center">
                            <div className="text-xs sm:text-sm font-semibold text-slate-900">{subject.title}</div>
                            {subject.subtitle && <div className="text-[11px] text-slate-500 font-bangla mt-1">{subject.subtitle}</div>}
                            <div className="mt-1 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                                {chapterCount !== null && <span className="inline-flex items-center gap-1"><i className="fa-solid fa-layer-group text-[10px] text-slate-400"></i>{chapterCount} Chapters</span>}
                                {subject.lastRead && <span className="inline-flex items-center gap-1 text-emerald-600"><i className="fa-solid fa-check text-[10px]"></i>Last read: {subject.lastRead}</span>}
                            </div>
                            {showGroup && <div className="mt-2 inline-flex items-center text-[10px] uppercase tracking-[0.2em] text-slate-400">{subject.groupLabel}</div>}
                        </div>
                    </div>
                </button>
            );
        };

        const ChapterCard = ({ title, subtitle, thumbnailUrl, onClick, className = '', isRead = false }) => (
            <button onClick={onClick} className={className + ' block text-left transition-all duration-300 group'}>
                <div className="space-y-2 h-full text-center">
                    <div className={cardSurfaceClass + (isRead ? ' ring-1 ring-emerald-200' : '')}>
                        {isRead && (
                            <div className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-1 text-[10px] font-semibold text-white shadow-sm">
                                <i className="fa-solid fa-check text-[10px]"></i>Read
                            </div>
                        )}
                        {thumbnailUrl ? (
                            <img src={thumbnailUrl} alt={title + ' thumbnail'} loading="eager" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 card-art-media" />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 text-[9px] uppercase tracking-[0.3em] card-art-media"><span>No thumbnail</span></div>
                        )}
                    </div>
                    <div className="text-center">
                        <div className="text-xs sm:text-sm font-semibold text-slate-900">{title}</div>
                        {subtitle && <div className="text-[11px] text-slate-500 mt-1">{subtitle}</div>}
                    </div>
                </div>
            </button>
        );

        const PublicChapterList = ({ classLabel, subjectLabel, chapters, onSelectChapter, recentRoute }) => {
            const chapterThumbnails = useThumbnails('/api/chapter-thumbnails', 'chapterKey');
            const { readMap, markRead } = useReadingProgress();
            
            // Wait for images
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
                    {/* Stylized Header Section */}
                    <div className="relative mb-8 px-2">
                        {/* Abstract Art Blobs behind the text */}
                        <div className="absolute -left-4 -top-8 w-32 h-32 bg-indigo-100/50 rounded-full blur-2xl pointer-events-none"></div>
                        <div className="absolute left-16 -top-4 w-20 h-20 bg-amber-100/60 rounded-full blur-xl pointer-events-none"></div>

                        <div className="relative flex items-end justify-between z-10">
                            <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] pl-1 mb-2 block">
                                    Curriculum
                                </span>
                                <h3 className="text-4xl font-bold text-slate-800 font-serif leading-none relative inline-block">
                                    {title}
                                    {/* Artistic Underline SVG */}
                                    <svg className="absolute -bottom-3 left-0 w-[110%] h-3 text-indigo-400/40" viewBox="0 0 100 10" preserveAspectRatio="none">
                                        <path d="M0 5 Q 50 12 100 5" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                                    </svg>
                                </h3>
                            </div>

                            <div className="flex items-center gap-3 pb-1">
                                <button onClick={() => scroll('left')} className="w-9 h-9 rounded-full bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 flex items-center justify-center transition shadow-sm hidden sm:flex">
                                    <i className="fa-solid fa-arrow-left text-sm"></i>
                                </button>
                                <button onClick={() => scroll('right')} className="w-9 h-9 rounded-full bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 flex items-center justify-center transition shadow-sm hidden sm:flex">
                                    <i className="fa-solid fa-arrow-right text-sm"></i>
                                </button>
                                <button onClick={onAll} className="px-4 py-2 rounded-full bg-white border border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 transition shadow-sm ml-2">
                                    View All
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div 
                        ref={containerRef}
                        className="flex overflow-x-auto gap-5 pb-8 px-2 snap-x hide-scrollbars pt-2"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {subjects.map((subject, index) => {
                            const thumbnail = thumbnailMap[subject.subjectKey];
                            const lastRead = getLastReadForSubject(readMap, subject.title);
                            
                            return (
                                <div 
                                    key={index} 
                                    onClick={() => onNavigate(subject.route)}
                                    className="flex-none w-72 snap-start cursor-pointer group"
                                >
                                    <div className="aspect-[16/10] rounded-2xl bg-white border border-slate-100 mb-4 overflow-hidden relative shadow-sm group-hover:shadow-xl group-hover:shadow-indigo-100/50 group-hover:-translate-y-1 transition-all duration-300">
                                        {thumbnail ? (
                                            <img src={thumbnail.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                                                <i className="fa-solid fa-book-open text-3xl opacity-40"></i>
                                            </div>
                                        )}
                                        
                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        
                                        {lastRead && (
                                             <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 text-emerald-600 text-[10px] font-bold uppercase tracking-wider rounded-md backdrop-blur-sm shadow-sm flex items-center gap-1">
                                                <i className="fa-solid fa-check-circle"></i>
                                                Read
                                             </div>
                                        )}
                                    </div>
                                    <div className="pl-1">
                                        <h4 className="font-bold text-lg text-slate-800 leading-tight group-hover:text-indigo-700 transition-colors font-serif">{subject.title}</h4>
                                        <p className="text-xs text-slate-400 mt-1.5 uppercase tracking-wide font-medium">{subject.subtitle}</p>
                                    </div>
                                </div>
                            );
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
                <aside className="hidden lg:flex lg:w-64 border-r border-gray-200 bg-white p-6 shrink-0">
                    <div className="flex flex-col gap-6 w-full">
                        <div>
                            <div className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Hierarchy</div>
                            <div className="mt-3 space-y-2">
                                {trail.map((item, index) => {
                                    const view = getViewFromPath(item.path);
                                    return (
                                        <button key={item.path} onClick={() => onNavigate(view)} className={\`w-full text-left text-sm font-semibold transition \${index === trail.length - 1 ? 'text-blue-700' : 'text-slate-600 hover:text-slate-900'}\`}>
                                            {item.label}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="mt-4 text-xs text-slate-500">{title}{subtitle ? \` · \${subtitle}\` : ''}</div>
                        </div>
                        <div>
                            <div className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Shortcuts</div>
                            <div className="mt-3 space-y-2">
                                {onBack && <button onClick={onBack} className="w-full text-left text-sm font-semibold text-slate-600 hover:text-slate-900 transition">Back</button>}
                                <button onClick={() => onNavigate('landing')} className="w-full text-left text-sm font-semibold text-slate-600 hover:text-slate-900 transition">Home</button>
                                <button onClick={() => onNavigate('public-videos')} className="w-full text-left text-sm font-semibold text-slate-600 hover:text-slate-900 transition">Videos</button>
                                <button onClick={() => onNavigate('ssc-subjects')} className="w-full text-left text-sm font-semibold text-slate-600 hover:text-slate-900 transition">SSC Subjects</button>
                                <button onClick={() => onNavigate('hsc-subjects')} className="w-full text-left text-sm font-semibold text-slate-600 hover:text-slate-900 transition">HSC Subjects</button>
                            </div>
                        </div>
                    </div>
                </aside>
            );
        };

        const PublicSimpleShell = ({ title, subtitle, backgroundClass = 'bg-white', onBack, onNavigate, children }) => (
            <div className={'flex-1 ' + backgroundClass}>
                <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-8">
                    <div className="grid grid-cols-[auto,1fr,auto] items-center gap-4 border-b border-slate-200 pb-4">
                        {onBack ? <button onClick={onBack} className="w-10 h-10 rounded-md border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800 transition flex items-center justify-center" aria-label="Go back"><i className="fa-solid fa-arrow-left"></i></button> : <div className="w-10 h-10" />}
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 font-bangla">{title}</h2>
                            {subtitle && <p className="text-base text-slate-500 font-bangla">{subtitle}</p>}
                        </div>
                        <button onClick={() => onNavigate('landing')} className="px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-[0.2em] border border-slate-200 text-slate-600 hover:border-slate-300 transition justify-self-end">Home</button>
                    </div>
                    <div className="mt-6 lg:flex lg:gap-8">
                        <PublicSidebar title={title} subtitle={subtitle} onBack={onBack} onNavigate={onNavigate} />
                        <div className="flex-1">{children}</div>
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
