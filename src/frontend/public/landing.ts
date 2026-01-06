export const landingComponents = `
        const LandingModule = (() => {
        const quoteItems = [
            { text: 'Education is the most powerful weapon which you can use to change the world.', author: 'Nelson Mandela' },
            { text: 'The roots of education are bitter, but the fruit is sweet.', author: 'Aristotle' },
            { text: 'An investment in knowledge pays the best interest.', author: 'Benjamin Franklin' },
            { text: 'Education is not the filling of a pail, but the lighting of a fire.', author: 'William Butler Yeats' },
            { text: 'The beautiful thing about learning is that no one can take it away from you.', author: 'B.B. King' },
            { text: 'Education is the passport to the future, for tomorrow belongs to those who prepare for it today.', author: 'Malcolm X' },
            { text: 'Service to others is the rent you pay for your room here on earth.', author: 'Muhammad Ali' },
            { text: 'Knowledge will bring you the opportunity to make a difference.', author: 'Claire Fagin' },
            { text: 'The purpose of education is to replace an empty mind with an open one.', author: 'Malcolm Forbes' },
            { text: 'We serve others best when we empower them to learn for themselves.', author: 'Education proverb' }
        ];

        const subjectGroups = {
            SSC: {
                Science: [
                    'Bangla 1st Paper',
                    'Bangla 2nd Paper',
                    'English 1st Paper',
                    'English 2nd Paper',
                    'General Mathematics',
                    'Physics',
                    'Chemistry',
                    'Biology',
                    'Higher Mathematics',
                    'Bangladesh and Global Studies',
                    'Information and Communication Technology',
                    'Religion and Moral Education'
                ],
                Humanities: [
                    'Bangla 1st Paper',
                    'Bangla 2nd Paper',
                    'English 1st Paper',
                    'English 2nd Paper',
                    'General Mathematics',
                    'Bangladesh and Global Studies',
                    'Information and Communication Technology',
                    'Geography and Environment',
                    'History of Bangladesh and World Civilization',
                    'Civics and Citizenship',
                    'Religion and Moral Education'
                ],
                'Business Studies': [
                    'Bangla 1st Paper',
                    'Bangla 2nd Paper',
                    'English 1st Paper',
                    'English 2nd Paper',
                    'General Mathematics',
                    'Bangladesh and Global Studies',
                    'Information and Communication Technology',
                    'Accounting',
                    'Business Entrepreneurship',
                    'Finance and Banking',
                    'Religion and Moral Education'
                ]
            },
            HSC: {
                Science: [
                    'Bangla 1st Paper',
                    'Bangla 2nd Paper',
                    'English 1st Paper',
                    'English 2nd Paper',
                    'Information and Communication Technology',
                    'Physics 1st Paper',
                    'Physics 2nd Paper',
                    'Chemistry 1st Paper',
                    'Chemistry 2nd Paper',
                    'Biology 1st Paper',
                    'Biology 2nd Paper',
                    'Higher Mathematics 1st Paper',
                    'Higher Mathematics 2nd Paper'
                ],
                Humanities: [
                    'Bangla 1st Paper',
                    'Bangla 2nd Paper',
                    'English 1st Paper',
                    'English 2nd Paper',
                    'Information and Communication Technology',
                    'Economics 1st Paper',
                    'Economics 2nd Paper',
                    'History 1st Paper',
                    'History 2nd Paper',
                    'Civics and Good Governance 1st Paper',
                    'Civics and Good Governance 2nd Paper',
                    'Logic 1st Paper',
                    'Logic 2nd Paper'
                ],
                'Business Studies': [
                    'Bangla 1st Paper',
                    'Bangla 2nd Paper',
                    'English 1st Paper',
                    'English 2nd Paper',
                    'Information and Communication Technology',
                    'Accounting 1st Paper',
                    'Accounting 2nd Paper',
                    'Business Organization and Management 1st Paper',
                    'Business Organization and Management 2nd Paper',
                    'Finance, Banking and Insurance 1st Paper',
                    'Finance, Banking and Insurance 2nd Paper',
                    'Production Management and Marketing 1st Paper',
                    'Production Management and Marketing 2nd Paper'
                ]
            }
        };

        const subjectIconMap = {
            'Bangla 1st Paper': 'fa-book-open',
            'Bangla 2nd Paper': 'fa-book',
            'English 1st Paper': 'fa-language',
            'English 2nd Paper': 'fa-pen-nib',
            'General Mathematics': 'fa-calculator',
            Mathematics: 'fa-calculator',
            Physics: 'fa-atom',
            Chemistry: 'fa-flask',
            Biology: 'fa-dna',
            'Higher Mathematics': 'fa-square-root-variable',
            'Higher Mathematics 1st Paper': 'fa-square-root-variable',
            'Higher Mathematics 2nd Paper': 'fa-square-root-variable',
            'Bangladesh and Global Studies': 'fa-globe',
            'Information and Communication Technology': 'fa-laptop-code',
            Religion: 'fa-hands-praying',
            'Religion and Moral Education': 'fa-hands-praying',
            'Geography and Environment': 'fa-mountain-sun',
            'History of Bangladesh and World Civilization': 'fa-landmark',
            'Civics and Citizenship': 'fa-scale-balanced',
            Accounting: 'fa-receipt',
            'Business Entrepreneurship': 'fa-briefcase',
            'Finance and Banking': 'fa-coins',
            'Physics 1st Paper': 'fa-atom',
            'Physics 2nd Paper': 'fa-atom',
            'Chemistry 1st Paper': 'fa-flask',
            'Chemistry 2nd Paper': 'fa-flask',
            'Biology 1st Paper': 'fa-dna',
            'Biology 2nd Paper': 'fa-dna',
            'Economics 1st Paper': 'fa-chart-line',
            'Economics 2nd Paper': 'fa-chart-line',
            'History 1st Paper': 'fa-landmark',
            'History 2nd Paper': 'fa-landmark',
            'Civics and Good Governance 1st Paper': 'fa-scale-balanced',
            'Civics and Good Governance 2nd Paper': 'fa-scale-balanced',
            'Logic 1st Paper': 'fa-lightbulb',
            'Logic 2nd Paper': 'fa-lightbulb',
            'Accounting 1st Paper': 'fa-receipt',
            'Accounting 2nd Paper': 'fa-receipt',
            'Business Organization and Management 1st Paper': 'fa-briefcase',
            'Business Organization and Management 2nd Paper': 'fa-briefcase',
            'Finance, Banking and Insurance 1st Paper': 'fa-coins',
            'Finance, Banking and Insurance 2nd Paper': 'fa-coins',
            'Production Management and Marketing 1st Paper': 'fa-industry',
            'Production Management and Marketing 2nd Paper': 'fa-industry'
        };

        const accentPalette = [
            'bg-sky-500',
            'bg-indigo-500',
            'bg-emerald-500',
            'bg-rose-500',
            'bg-amber-500',
            'bg-violet-500',
            'bg-teal-500'
        ];
        const buildSubjectList = (classLabel) => {
            const groupMap = subjectGroups[classLabel] || {};
            let paletteIndex = 0;
            const subjectMap = new Map();
            Object.entries(groupMap).forEach(([group, subjects]) => {
                subjects.forEach((subject) => {
                    if (subjectMap.has(subject)) {
                        subjectMap.get(subject).groups.add(group);
                        return;
                    }
                    const accent = accentPalette[paletteIndex % accentPalette.length];
                    paletteIndex += 1;
                    const isBanglaFirst = subject === 'Bangla 1st Paper';
                    const isEnglishFirst = subject === 'English 1st Paper' && classLabel === 'HSC';
                    const isIct = subject === 'Information and Communication Technology' && classLabel === 'SSC';
                    const isHscIct = subject === 'Information and Communication Technology' && classLabel === 'HSC';
                    const isSscPhysics = subject === 'Physics' && classLabel === 'SSC';
                    const isSscChemistry = subject === 'Chemistry' && classLabel === 'SSC';
                    const isSscBiology = subject === 'Biology' && classLabel === 'SSC';
                    const isBangladeshGlobal = subject === 'Bangladesh and Global Studies' && classLabel === 'SSC';
                    const isReligionMoral = subject === 'Religion and Moral Education' && classLabel === 'SSC';
                    const isHscPhysics1 = subject === 'Physics 1st Paper' && classLabel === 'HSC';
                    const isHscPhysics2 = subject === 'Physics 2nd Paper' && classLabel === 'HSC';
                    const isHscChemistry1 = subject === 'Chemistry 1st Paper' && classLabel === 'HSC';
                    const isHscChemistry2 = subject === 'Chemistry 2nd Paper' && classLabel === 'HSC';
                    const isHscBiology1 = subject === 'Biology 1st Paper' && classLabel === 'HSC';
                    const isHscBiology2 = subject === 'Biology 2nd Paper' && classLabel === 'HSC';
                    subjectMap.set(subject, {
                        title: subject,
                        subtitle: isBanglaFirst ? 'বাংলা ১ম পত্র' : '',
                        icon: subjectIconMap[subject] || 'fa-book',
                        accent,
                        groups: new Set([group]),
                        classLabel,
                        subjectKey: makeThumbnailKey(subject, classLabel),
                        route: isBanglaFirst
                            ? (classLabel === 'SSC' ? 'public-bangla-ssc-1st-paper' : 'public-bangla-hsc-1st-paper')
                            : isEnglishFirst
                                ? 'public-english-hsc-1st-paper'
                                : isIct
                                    ? 'public-ssc-ict'
                                    : isHscIct
                                        ? 'public-hsc-ict'
                                        : isSscPhysics
                                            ? 'public-ssc-physics'
                                            : isSscChemistry
                                                ? 'public-ssc-chemistry'
                                                : isSscBiology
                                                    ? 'public-ssc-biology'
                                                    : isBangladeshGlobal
                                                        ? 'public-ssc-bangladesh-global-studies'
                                                        : isReligionMoral
                                                            ? 'public-ssc-religion'
                                                    : isHscPhysics1
                                                        ? 'public-hsc-physics-1st'
                                                        : isHscPhysics2
                                                        ? 'public-hsc-physics-2nd'
                                                        : isHscChemistry1
                                                            ? 'public-hsc-chemistry-1st'
                                                            : isHscChemistry2
                                                                ? 'public-hsc-chemistry-2nd'
                                                                : isHscBiology1
                                                                    ? 'public-hsc-biology-1st'
                                                                    : isHscBiology2
                                                                        ? 'public-hsc-biology-2nd'
                                                                        : ''
                    });
                });
            });
            return Array.from(subjectMap.values()).map((subject) => {
                const groups = Array.from(subject.groups);
                return {
                    ...subject,
                    groups,
                    groupLabel: groups.length > 1 ? 'Common' : groups[0]
                };
            });
        };

        const sscSubjects = buildSubjectList('SSC');
        const hscSubjects = buildSubjectList('HSC');
        const sscFeaturedSubjects = sscSubjects.slice(0, 8);
        const hscFeaturedSubjects = hscSubjects.slice(0, 8);
        const religionOptions = [
            { key: 'Islam', label: 'Islam', subtitle: 'ইসলাম' },
            { key: 'Hinduism', label: 'Hinduism', subtitle: 'হিন্দু ধর্ম' },
            { key: 'Buddhism', label: 'Buddhism', subtitle: 'বৌদ্ধ ধর্ম' },
            { key: 'Christianity', label: 'Christianity', subtitle: 'খ্রিষ্টান ধর্ম' }
        ];

        const useThumbnails = (endpoint, keyField) => {
            const [thumbnailMap, setThumbnailMap] = useState({});

            useEffect(() => {
                let isActive = true;
                const loadThumbnails = async () => {
                    try {
                        const response = await fetch(endpoint);
                        if (!response.ok) return;
                        const data = await response.json();
                        if (!isActive) return;
                        const map = (data.thumbnails || []).reduce((acc, item) => {
                            const key = item[keyField];
                            if (!key) return acc;
                            acc[key] = {
                                url: item.url
                            };
                            return acc;
                        }, {});
                        setThumbnailMap(map);
                    } catch (error) {
                        console.warn('Failed to load thumbnails', error);
                    }
                };
                loadThumbnails();
                return () => {
                    isActive = false;
                };
            }, []);

            return thumbnailMap;
        };

        const READ_PROGRESS_KEY = 'freeducation.read-progress';
        const RECENT_READ_KEY = 'freeducation.recent-read';
        const VIDEO_PROGRESS_KEY = 'freeducation.video-progress';
        const RECENT_VIDEO_KEY = 'freeducation.recent-video';

        const loadVideoProgress = () => {
            try {
                const raw = localStorage.getItem(VIDEO_PROGRESS_KEY);
                return raw ? JSON.parse(raw) : {};
            } catch (error) {
                console.warn('Failed to read video progress', error);
                return {};
            }
        };

        const loadRecentVideo = () => {
            try {
                const raw = localStorage.getItem(RECENT_VIDEO_KEY);
                return raw ? JSON.parse(raw) : null;
            } catch (error) {
                console.warn('Failed to read recent video', error);
                return null;
            }
        };

        const storeVideoProgress = (entry) => {
            const current = loadVideoProgress();
            const updated = {
                ...current,
                [entry.id]: {
                    title: entry.title,
                    context: entry.context,
                    route: entry.route,
                    currentTime: entry.currentTime,
                    duration: entry.duration,
                    updatedAt: entry.updatedAt
                }
            };
            try {
                localStorage.setItem(VIDEO_PROGRESS_KEY, JSON.stringify(updated));
                localStorage.setItem(RECENT_VIDEO_KEY, JSON.stringify({
                    id: entry.id,
                    title: entry.title,
                    context: entry.context,
                    route: entry.route,
                    currentTime: entry.currentTime,
                    duration: entry.duration,
                    updatedAt: entry.updatedAt
                }));
            } catch (error) {
                console.warn('Failed to store video progress', error);
            }
            return updated;
        };

        const useVideoProgress = () => {
            const [videoProgress, setVideoProgress] = useState(() => loadVideoProgress());
            const [recentVideo, setRecentVideo] = useState(() => loadRecentVideo());

            const updateVideoProgress = (entry) => {
                const timestamped = {
                    ...entry,
                    updatedAt: Date.now()
                };
                const updated = storeVideoProgress(timestamped);
                setVideoProgress(updated);
                setRecentVideo({
                    id: entry.id,
                    title: entry.title,
                    context: entry.context,
                    route: entry.route,
                    currentTime: entry.currentTime,
                    duration: entry.duration,
                    updatedAt: timestamped.updatedAt
                });
            };

            return { videoProgress, recentVideo, updateVideoProgress };
        };


        const loadReadProgress = () => {
            try {
                const raw = localStorage.getItem(READ_PROGRESS_KEY);
                return raw ? JSON.parse(raw) : {};
            } catch (error) {
                console.warn('Failed to read progress data', error);
                return {};
            }
        };

        const loadRecentRead = () => {
            try {
                const raw = localStorage.getItem(RECENT_READ_KEY);
                return raw ? JSON.parse(raw) : null;
            } catch (error) {
                console.warn('Failed to read recent chapter', error);
                return null;
            }
        };

        const storeReadProgress = (entry) => {
            const current = loadReadProgress();
            const updated = {
                ...current,
                [entry.key]: {
                    label: entry.label,
                    subjectLabel: entry.subjectLabel,
                    updatedAt: entry.updatedAt
                }
            };
            try {
                localStorage.setItem(READ_PROGRESS_KEY, JSON.stringify(updated));
                localStorage.setItem(
                    RECENT_READ_KEY,
                    JSON.stringify({
                        label: entry.label,
                        route: entry.route,
                        updatedAt: entry.updatedAt
                    })
                );
            } catch (error) {
                console.warn('Failed to store reading progress', error);
            }
            return updated;
        };

        const storeBanglaSelection = ({ classLabel, categoryName, itemName }) => {
            try {
                localStorage.setItem(
                    'freeducation.bangla-selection',
                    JSON.stringify({
                        classLabel,
                        categoryName,
                        itemName
                    })
                );
            } catch (error) {
                console.warn('Failed to store Bangla selection', error);
            }
        };

        const getLastReadForSubject = (readMap, subjectLabel) => {
            const entries = Object.values(readMap || {}).filter((entry) => entry.subjectLabel === subjectLabel);
            if (entries.length === 0) return '';
            entries.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
            return entries[0]?.label || '';
        };

        const useReadingProgress = () => {
            const [readMap, setReadMap] = useState(() => loadReadProgress());
            const [recentRead, setRecentRead] = useState(() => loadRecentRead());

            const markRead = (entry) => {
                const timestamped = {
                    ...entry,
                    updatedAt: Date.now()
                };
                const updated = storeReadProgress(timestamped);
                setReadMap(updated);
                setRecentRead({
                    label: entry.label,
                    route: entry.route,
                    updatedAt: timestamped.updatedAt
                });
            };

            return { readMap, recentRead, markRead };
        };

        const cardWidthClass = 'w-36 sm:w-40 md:w-44';
        const cardGridGapClass = 'gap-2 sm:gap-4';
        const cardSurfaceClass =
            'relative w-full aspect-[4/5] rounded-lg overflow-hidden border border-slate-200 bg-white transition group-hover:border-indigo-200 card-art-surface';
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
                    return Object.values(sscReligionChapters || {}).reduce(
                        (total, chapters) => total + (chapters?.length || 0),
                        0
                    );
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
                    className={
                        className +
                        ' block h-full text-left transition-all duration-300 group ' +
                        (isActive ? 'cursor-pointer' : 'opacity-60 cursor-default')
                    }
                    disabled={!isActive}
                >
                    <div className="space-y-1.5 h-full text-center">
                        <div className={cardSurfaceClass}>
                            {subject.thumbnailUrl ? (
                                <img
                                    src={subject.thumbnailUrl}
                                    alt={subject.title + ' thumbnail'}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 card-art-media"
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-2 card-art-media">
                                    <div
                                        className={
                                            'h-9 w-9 rounded-lg text-white flex items-center justify-center shadow-sm ' +
                                            subject.accent
                                        }
                                    >
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
                                {chapterCount !== null && (
                                    <span className="inline-flex items-center gap-1">
                                        <i className="fa-solid fa-layer-group text-[10px] text-slate-400"></i>
                                        {chapterCount} Chapters
                                    </span>
                                )}
                                {subject.lastRead && (
                                    <span className="inline-flex items-center gap-1 text-emerald-600">
                                        <i className="fa-solid fa-check text-[10px]"></i>
                                        Last read: {subject.lastRead}
                                    </span>
                                )}
                            </div>
                            {showGroup && (
                                <div className="mt-2 inline-flex items-center text-[10px] uppercase tracking-[0.2em] text-slate-400">
                                    {subject.groupLabel}
                                </div>
                            )}
                        </div>
                    </div>
                </button>
            );
        };

        const ChapterCard = ({ title, subtitle, thumbnailUrl, onClick, className = '', isRead = false }) => (
            <button
                onClick={onClick}
                className={className + ' block text-left transition-all duration-300 group'}
            >
                <div className="space-y-2 h-full text-center">
                    <div className={cardSurfaceClass + (isRead ? ' ring-1 ring-emerald-200' : '')}>
                        {isRead && (
                            <div className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-1 text-[10px] font-semibold text-white shadow-sm">
                                <i className="fa-solid fa-check text-[10px]"></i>
                                Read
                            </div>
                        )}
                        {thumbnailUrl ? (
                            <img
                                src={thumbnailUrl}
                                alt={title + ' thumbnail'}
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 card-art-media"
                            />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 text-[9px] uppercase tracking-[0.3em] card-art-media">
                                <span>No thumbnail</span>
                            </div>
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
                                    markRead({
                                        key: chapterKey,
                                        label: chapter.name,
                                        subjectLabel,
                                        route: recentRoute
                                    });
                                    onSelectChapter(chapter);
                                }}
                                className={cardWidthClass + ' font-bangla'}
                            />
                        );
                    })}
                    {chapters.length === 0 && (
                        <div className="border border-dashed border-slate-200 rounded-md p-6 text-sm text-slate-400 font-bangla text-center">
                            এখনো কোনো অধ্যায় যোগ করা হয়নি।
                        </div>
                    )}
                </ArtPanelGrid>
            );
        };

        const SubjectRow = ({ title, onAll, subjects, onNavigate, thumbnailMap, readMap }) => (
            <section className="space-y-3">
                <div className="flex flex-col items-center gap-2 text-center">
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-900">{title}</h3>
                    <button
                        onClick={onAll}
                        className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-md transition hover:border-indigo-300 hover:text-indigo-700 flex items-center gap-2"
                    >
                        See all <i className="fa-solid fa-angle-right"></i>
                    </button>
                </div>
                <div className={'flex items-stretch ' + cardGridGapClass + ' pb-4 overflow-x-auto snap-x scrollbar-hide'}>
                    {subjects.map((subject) => {
                        const thumbnail = thumbnailMap[subject.subjectKey];
                        const lastRead = getLastReadForSubject(readMap, subject.title);
                        return (
                            <SubjectCard
                                key={subject.subjectKey}
                                subject={{
                                    ...subject,
                                    lastRead,
                                    thumbnailUrl: thumbnail?.url
                                }}
                                onNavigate={onNavigate}
                                className={'flex-shrink-0 snap-start ' + cardWidthClass}
                            />
                        );
                    })}
                </div>
            </section>
        );

        const SubjectIndexPage = ({ classLabel, subjects, onNavigate }) => {
            const [activeGroup, setActiveGroup] = useState('All');
            const [query, setQuery] = useState('');
            const thumbnailMap = useThumbnails('/api/thumbnails', 'subjectKey');
            const { readMap } = useReadingProgress();
            const normalizedQuery = query.trim().toLowerCase();
            const groups = ['All', ...new Set(subjects.flatMap((subject) => subject.groups || []))];
            const filteredSubjects = subjects.filter((subject) => {
                const matchesGroup = activeGroup === 'All' || (subject.groups || []).includes(activeGroup);
                const matchesQuery =
                    !normalizedQuery ||
                    subject.title.toLowerCase().includes(normalizedQuery) ||
                    subject.subtitle.toLowerCase().includes(normalizedQuery);
                return matchesGroup && matchesQuery;
            });

            return (
                <div className="flex-1 bg-[#f3f6ff]">
                    <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-8">
                        <div className="flex flex-col items-center text-center gap-2">
                            <div className="text-xs uppercase tracking-[0.2em] text-indigo-500">Academic</div>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-2">
                                {classLabel} Subjects
                            </h2>
                            <p className="text-sm text-slate-500 mt-2">
                                Browse the complete {classLabel} list by group or search for a subject.
                            </p>
                            <button
                                onClick={() => onNavigate('landing')}
                                className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-md transition hover:border-indigo-300 hover:text-indigo-700"
                            >
                                Back to Home
                            </button>
                        </div>
                        <div className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)] lg:items-end">
                            <div>
                                <label className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Group filter</label>
                                <select
                                    value={activeGroup}
                                    onChange={(event) => setActiveGroup(event.target.value)}
                                    className="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                >
                                    {groups.map((group) => (
                                        <option key={group} value={group}>
                                            {group}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="relative w-full">
                                <label className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Search</label>
                                <input
                                    value={query}
                                    onChange={(event) => setQuery(event.target.value)}
                                    placeholder="Search subjects"
                                    className="mt-2 w-full border border-slate-200 rounded-lg py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                />
                                <i className="fa-solid fa-magnifying-glass absolute left-4 top-[calc(50%+12px)] -translate-y-1/2 text-slate-400"></i>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                            <span>Showing</span>
                            <span>{filteredSubjects.length} subjects</span>
                        </div>
                        <div className={'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 justify-items-center ' + cardGridGapClass + ' mt-4'}>
                            {filteredSubjects.map((subject) => {
                                const thumbnail = thumbnailMap[subject.subjectKey];
                                const lastRead = getLastReadForSubject(readMap, subject.title);
                                return (
                                    <SubjectCard
                                        key={subject.subjectKey}
                                        subject={{
                                            ...subject,
                                            lastRead,
                                            thumbnailUrl: thumbnail?.url
                                        }}
                                        onNavigate={onNavigate}
                                        className={cardWidthClass}
                                        showGroup
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            );
        };

        const formatHierarchyLabel = (segment) => {
            if (!segment) return '';
            const normalized = segment.toLowerCase();
            const replacements = {
                ssc: 'SSC',
                hsc: 'HSC',
                ict: 'ICT',
                mcq: 'MCQ',
                cq: 'CQ',
                srijonshil: 'Srijonshil',
                shohopath: 'Shohopath',
                shahitto: 'Shahitto',
                goddo: 'Goddo',
                poddo: 'Poddo',
                topics: 'Topics',
                topic: 'Topic',
                chapters: 'Chapters',
                videos: 'Videos'
            };
            if (replacements[normalized]) return replacements[normalized];
            return segment
                .split('-')
                .map((part) => replacements[part] || part.charAt(0).toUpperCase() + part.slice(1))
                .join(' ');
        };

        const buildHierarchyTrail = () => {
            const { pathname } = window.location;
            const parts = pathname.split('/').filter(Boolean);
            const trail = [{ label: 'Home', path: '/' }];
            let currentPath = '';
            parts.forEach((part) => {
                currentPath += '/' + part;
                trail.push({
                    label: formatHierarchyLabel(part),
                    path: currentPath
                });
            });
            return trail;
        };

        const PublicSidebar = ({ title, subtitle, onBack, onNavigate }) => {
            const [trail, setTrail] = useState(buildHierarchyTrail());

            useEffect(() => {
                setTrail(buildHierarchyTrail());
            }, [title, subtitle]);

            return (
                <aside className="hidden lg:flex lg:w-64 border-r border-gray-200 bg-white p-6 shrink-0">
                    <div className="flex flex-col gap-6 w-full">
                        <div>
                            <div className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Hierarchy</div>
                            <div className="mt-3 space-y-2">
                                {trail.map((item, index) => {
                                    const view = getViewFromPath(item.path);
                                    return (
                                        <button
                                            key={item.path}
                                            onClick={() => onNavigate(view)}
                                            className={\`w-full text-left text-sm font-semibold transition \${index === trail.length - 1 ? 'text-blue-700' : 'text-slate-600 hover:text-slate-900'}\`}
                                        >
                                            {item.label}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="mt-4 text-xs text-slate-500">
                                {title}
                                {subtitle ? \` · \${subtitle}\` : ''}
                            </div>
                        </div>
                        <div>
                            <div className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Shortcuts</div>
                            <div className="mt-3 space-y-2">
                                {onBack && (
                                    <button
                                        onClick={onBack}
                                        className="w-full text-left text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
                                    >
                                        Back
                                    </button>
                                )}
                                <button
                                    onClick={() => onNavigate('landing')}
                                    className="w-full text-left text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
                                >
                                    Home
                                </button>
                                <button
                                    onClick={() => onNavigate('public-videos')}
                                    className="w-full text-left text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
                                >
                                    Videos
                                </button>
                                <button
                                    onClick={() => onNavigate('ssc-subjects')}
                                    className="w-full text-left text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
                                >
                                    SSC Subjects
                                </button>
                                <button
                                    onClick={() => onNavigate('hsc-subjects')}
                                    className="w-full text-left text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
                                >
                                    HSC Subjects
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>
            );
        };

        const PublicBanglaShell = ({ title, subtitle, onBack, onNavigate, children }) => (
            <div className="flex-1 bg-[#fff7ed]">
                <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-8 space-y-5">
                    <div className="space-y-6">
                        <div className="border-b border-slate-200 pb-4">
                            <div className="grid grid-cols-[auto,1fr,auto] items-center gap-4">
                                {onBack ? (
                                    <button
                                        onClick={onBack}
                                        className="w-10 h-10 rounded-md border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800 transition flex items-center justify-center"
                                        aria-label="Go back"
                                    >
                                        <i className="fa-solid fa-arrow-left"></i>
                                    </button>
                                ) : (
                                    <div className="w-10 h-10" />
                                )}
                                <div className="text-center">
                                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Bangla 1st Paper</div>
                                    <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-2 font-bangla">
                                        {title}
                                    </h2>
                                    {subtitle && <p className="text-sm text-slate-600 mt-2 font-bangla">{subtitle}</p>}
                                </div>
                                <button
                                    onClick={() => onNavigate('landing')}
                                    className="px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-[0.2em] border border-slate-200 text-slate-600 hover:border-slate-300 transition justify-self-end"
                                >
                                    Home
                                </button>
                            </div>
                        </div>
                        <div className="lg:flex lg:gap-8">
                            <PublicSidebar title={title} subtitle={subtitle} onBack={onBack} onNavigate={onNavigate} />
                            <div className="flex-1">{children}</div>
                        </div>
                    </div>
                </div>
            </div>
        );

        const PublicSimpleShell = ({ title, subtitle, backgroundClass = 'bg-white', onBack, onNavigate, children }) => (
            <div className={'flex-1 ' + backgroundClass}>
                <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-8">
                    <div className="grid grid-cols-[auto,1fr,auto] items-center gap-4 border-b border-slate-200 pb-4">
                        {onBack ? (
                            <button
                                onClick={onBack}
                                className="w-10 h-10 rounded-md border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800 transition flex items-center justify-center"
                                aria-label="Go back"
                            >
                                <i className="fa-solid fa-arrow-left"></i>
                            </button>
                        ) : (
                            <div className="w-10 h-10" />
                        )}
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 font-bangla">{title}</h2>
                            {subtitle && <p className="text-base text-slate-500 font-bangla">{subtitle}</p>}
                        </div>
                        <button
                            onClick={() => onNavigate('landing')}
                            className="px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-[0.2em] border border-slate-200 text-slate-600 hover:border-slate-300 transition justify-self-end"
                        >
                            Home
                        </button>
                    </div>
                    <div className="mt-6 lg:flex lg:gap-8">
                        <PublicSidebar title={title} subtitle={subtitle} onBack={onBack} onNavigate={onNavigate} />
                        <div className="flex-1">{children}</div>
                    </div>
                </div>
            </div>
        );

        const PublicBanglaTopicGrid = ({ classLabel, subjectLabel, topics, onNavigate }) => {
            const chapterThumbnails = useThumbnails('/api/chapter-thumbnails', 'chapterKey');
            const { readMap, markRead } = useReadingProgress();

            return (
                <ArtPanelGrid className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 font-bangla">
                    {topics.map((topic) => {
                        const chapterKey = makeChapterThumbnailKey(
                            classLabel,
                            subjectLabel,
                            topic.thumbnailKey || topic.title
                        );
                        return (
                            <ChapterCard
                                key={topic.title}
                                title={topic.title}
                                subtitle={topic.description}
                                thumbnailUrl={chapterThumbnails[chapterKey]?.url}
                                isRead={Boolean(readMap[chapterKey])}
                                onClick={() => {
                                    markRead({
                                        key: chapterKey,
                                        label: topic.title,
                                        subjectLabel,
                                        route: topic.route
                                    });
                                    topic.route && onNavigate(topic.route);
                                }}
                                className={cardWidthClass}
                            />
                        );
                    })}
                </ArtPanelGrid>
            );
        };

        const PublicBanglaTextList = ({ classLabel, subjectLabel, categoryLabel, subtitle, items, onSelectItem }) => {
            const chapterThumbnails = useThumbnails('/api/chapter-thumbnails', 'chapterKey');
            const { readMap, markRead } = useReadingProgress();

            return (
                <div className="space-y-4 font-bangla">
                    {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
                    <ArtPanelGrid className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                        {items.length === 0 && (
                            <div className="text-sm text-slate-400">এই অংশে এখনও কোন পাঠ যোগ করা হয়নি।</div>
                        )}
                        {items.map((item) => {
                            const chapterKey = makeChapterThumbnailKey(
                                classLabel,
                                subjectLabel,
                                item + '-' + categoryLabel
                            );
                            return (
                                <ChapterCard
                                    key={item}
                                    title={item}
                                    subtitle={categoryLabel}
                                    thumbnailUrl={chapterThumbnails[chapterKey]?.url}
                                    isRead={Boolean(readMap[chapterKey])}
                                    onClick={() => {
                                        storeBanglaSelection({
                                            classLabel,
                                            categoryName: categoryLabel,
                                            itemName: item
                                        });
                                        markRead({
                                            key: chapterKey,
                                            label: item,
                                            subjectLabel,
                                            route: classLabel === 'SSC' ? 'public-bangla-ssc-item' : 'public-bangla-hsc-item'
                                        });
                                        onSelectItem(item);
                                    }}
                                    className={cardWidthClass}
                                />
                            );
                        })}
                    </ArtPanelGrid>
                </div>
            );
        };

        const PublicBanglaShohopathList = ({ classLabel, subjectLabel, items, onSelectItem }) => {
            const chapterThumbnails = useThumbnails('/api/chapter-thumbnails', 'chapterKey');
            const { readMap, markRead } = useReadingProgress();

            return (
                <ArtPanelGrid className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 font-bangla">
                    {items.length === 0 && (
                        <div className="text-sm text-slate-400">এই অংশে এখনও কোন সহপাঠ যোগ করা হয়নি।</div>
                    )}
                    {items.map((item) => {
                        const chapterKey = makeChapterThumbnailKey(
                            classLabel,
                            subjectLabel,
                            (item.id || item.name) + '-সহপাঠ'
                        );
                        return (
                            <ChapterCard
                                key={item.id}
                                title={item.name}
                                subtitle={item.type}
                                thumbnailUrl={chapterThumbnails[chapterKey]?.url}
                                isRead={Boolean(readMap[chapterKey])}
                                onClick={() => {
                                    storeBanglaSelection({
                                        classLabel,
                                        categoryName: item.type,
                                        itemName: item.name
                                    });
                                    markRead({
                                        key: chapterKey,
                                        label: item.name,
                                        subjectLabel,
                                        route: classLabel === 'SSC' ? 'public-bangla-ssc-item' : 'public-bangla-hsc-item'
                                    });
                                    onSelectItem(item);
                                }}
                                className={cardWidthClass}
                            />
                        );
                    })}
                </ArtPanelGrid>
            );
        };

        const CqQuestionList = ({ sections }) => {
            const [openMap, setOpenMap] = useState({});
            const toggleAnswer = (sectionKey, index) => {
                setOpenMap((prev) => ({
                    ...prev,
                    [sectionKey + '-' + index]: !prev[sectionKey + '-' + index]
                }));
            };
            if (!sections.length) {
                return <div className="text-sm text-slate-400">এখনো কোন প্রশ্ন যোগ করা হয়নি।</div>;
            }
            return (
                <div className="space-y-4">
                    {sections.map((section) => (
                        <div key={section.key} className={flatSectionClass}>
                            <div className="text-sm font-semibold text-slate-900">{section.label}</div>
                            {section.items.length === 0 ? (
                                <div className="text-sm text-slate-400 mt-3">এখনো কোন প্রশ্ন যোগ করা হয়নি।</div>
                            ) : (
                                <div className="mt-4 space-y-4">
                                    {section.items.map((entry, index) => {
                                        const openKey = section.key + '-' + index;
                                        const isOpen = Boolean(openMap[openKey]);
                                        return (
                                            <div key={entry.question + '-' + index} className="space-y-2">
                                                <div className="text-sm font-semibold text-slate-800">
                                                    {section.prefix(index)}. {entry.question}
                                                </div>
                                                <button
                                                    onClick={() => toggleAnswer(section.key, index)}
                                                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition"
                                                >
                                                    {isOpen ? 'উত্তর লুকান' : 'উত্তর দেখুন'}
                                                </button>
                                                {isOpen && (
                                                    <div className="text-sm text-slate-600 border-l-2 border-slate-200 pl-3">
                                                        {entry.answer}
                                                    </div>
                                                )}
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

        const PublicBanglaItemDetail = ({
            classLabel,
            itemName,
            categoryName,
            notesByItem,
            onNavigate,
            onOpenVideos
        }) => {
            const categoryRoute = classLabel === 'SSC'
                ? (categoryName === 'পদ্য'
                    ? 'public-bangla-ssc-poddo'
                    : categoryName === 'নাটক' || categoryName === 'উপন্যাস'
                        ? 'public-bangla-ssc-shohopath'
                        : 'public-bangla-ssc-goddo')
                : (categoryName === 'পদ্য'
                    ? 'public-bangla-hsc-poddo'
                    : categoryName === 'নাটক' || categoryName === 'উপন্যাস'
                        ? 'public-bangla-hsc-shohopath'
                        : 'public-bangla-hsc-goddo');

            const srijonshilRoute = classLabel === 'SSC' ? 'public-bangla-ssc-srijonshil' : 'public-bangla-hsc-srijonshil';
            const mcqRoute = classLabel === 'SSC' ? 'public-bangla-ssc-mcq' : 'public-bangla-hsc-mcq';
            const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            const toBanglaNumber = (value) => String(value)
                .split('')
                .map((digit) => banglaDigits[Number(digit)] ?? digit)
                .join('');
            const noteKey = [classLabel, categoryName || 'general', itemName || ''].join('-');
            const notes = (notesByItem || {})[noteKey] || [];
            const chapterTitle = itemName || 'পাঠ নির্বাচন করুন';
            const actionCards = [
                { key: 'cq', label: 'CQ', onClick: () => onNavigate(srijonshilRoute) },
                { key: 'mcq', label: 'MCQ', onClick: () => onNavigate(mcqRoute) },
                {
                    key: 'videos',
                    label: 'Videos',
                    onClick: () =>
                        onOpenVideos &&
                        onOpenVideos({
                            noteKey,
                            title: chapterTitle,
                            subtitle: '',
                            backRoute: categoryRoute
                        })
                },
                { key: 'practice', label: 'Practice', disabled: true }
            ];

            return (
                <PublicSimpleShell
                    backgroundClass="bg-[#fff7ed]"
                    title={chapterTitle}
                    onBack={() => onNavigate(categoryRoute)}
                    onNavigate={onNavigate}
                >
                    <div className="space-y-6 font-bangla text-left">
                        <div className="flex flex-wrap gap-2">
                            {actionCards.map((card) => (
                            <button
                                key={card.key}
                                onClick={card.disabled ? undefined : card.onClick}
                                disabled={card.disabled}
                                className={
                                    'rounded-md border text-xs font-semibold transition px-3 py-1.5 ' +
                                    (card.disabled
                                        ? 'border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed'
                                        : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50')
                                }
                            >
                                {card.label}
                            </button>
                            ))}
                        </div>
                        <div className="space-y-2 text-sm text-slate-700">
                            {notes.length === 0 && (
                                <div className="text-sm text-slate-400">এখনো কোন নোট যোগ করা হয়নি।</div>
                            )}
                            {notes.map((note, index) => (
                                <div key={noteKey + '-' + index}>
                                    {toBanglaNumber(index + 1)}. {note}
                                </div>
                            ))}
                        </div>
                    </div>
                </PublicSimpleShell>
            );
        };

        const PublicBanglaSrijonshilDetail = ({
            classLabel,
            itemName,
            categoryName,
            srijonshilQuestions,
            getQuestionKey,
            onNavigate
        }) => {
            const itemRoute = classLabel === 'SSC' ? 'public-bangla-ssc-item' : 'public-bangla-hsc-item';
            const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            const toBanglaNumber = (value) => String(value)
                .split('')
                .map((digit) => banglaDigits[Number(digit)] ?? digit)
                .join('');
            const srijonshilTypes = [
                { key: 'gyan', label: 'জ্ঞান (ক)' },
                { key: 'onudhabon', label: 'অনুধাবন (খ)' }
            ];
            const chapterTitle = itemName || 'পাঠ নির্বাচন করুন';

            return (
                <PublicBanglaShell
                    title="সৃজনশীল প্রশ্ন"
                    subtitle={categoryName ? 'বিভাগ: ' + categoryName : ''}
                    onBack={() => onNavigate(itemRoute)}
                    onNavigate={onNavigate}
                >
                    <div className="space-y-6 font-bangla text-left">
                        <div className="text-center">
                            <div className="text-xs uppercase tracking-[0.3em] text-slate-400">অধ্যায়</div>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-2">{chapterTitle}</h2>
                        </div>
                        {srijonshilTypes.map((type) => {
                            const list = srijonshilQuestions[getQuestionKey(classLabel, categoryName, itemName, type.key)] || [];
                            return (
                                <div key={type.key} className={flatSectionClass}>
                                    <div className="text-sm font-semibold text-slate-900">{type.label}</div>
                                    {list.length === 0 ? (
                                        <div className="text-sm text-slate-400 mt-3">এখনো কোন প্রশ্ন যোগ করা হয়নি।</div>
                                    ) : (
                                        <div className="mt-4 space-y-4">
                                            {list.map((entry, index) => (
                                                <div key={entry.question + '-' + index} className="space-y-2">
                                                    <div className="text-sm font-semibold text-slate-800">
                                                        {toBanglaNumber(index + 1)}. {entry.question}
                                                    </div>
                                                    <div className="text-sm text-slate-600 border-l-2 border-slate-200 pl-3">
                                                        {entry.answer}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </PublicBanglaShell>
            );
        };

        const PublicMcqList = ({ mcqList }) => {
            const optionLabels = ['ক', 'খ', 'গ', 'ঘ'];
            const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            const toBanglaNumber = (value) => String(value)
                .split('')
                .map((digit) => banglaDigits[Number(digit)] ?? digit)
                .join('');
            const [globalOpen, setGlobalOpen] = useState(false);
            const [openOverrides, setOpenOverrides] = useState({});

            const isOpen = (index) => {
                if (openOverrides[index] !== undefined) {
                    return openOverrides[index];
                }
                return globalOpen;
            };

            const toggleAnswer = (index) => {
                setOpenOverrides((prev) => ({
                    ...prev,
                    [index]: !isOpen(index)
                }));
            };

            const showAll = () => {
                setGlobalOpen(true);
                setOpenOverrides({});
            };

            const hideAll = () => {
                setGlobalOpen(false);
                setOpenOverrides({});
            };

            if (mcqList.length === 0) {
                return <div className="text-sm text-slate-400">এখনো কোন MCQ প্রশ্ন যোগ করা হয়নি।</div>;
            }

            return (
                <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-500">
                        <span>মোট প্রশ্ন: {toBanglaNumber(mcqList.length)}</span>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={showAll}
                                className="px-3 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition"
                            >
                                সকল উত্তর দেখুন
                            </button>
                            <button
                                onClick={hideAll}
                                className="px-3 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition"
                            >
                                সকল উত্তর লুকান
                            </button>
                        </div>
                    </div>
                    <div className="border-y border-slate-200 divide-y">
                        {mcqList.map((entry, index) => (
                            <div key={entry.question + '-' + index} className="px-4 py-4">
                                <div className="text-sm font-semibold text-slate-900">
                                    {toBanglaNumber(index + 1)}. {entry.question}
                                </div>
                                <div className="mt-2 grid gap-1 text-sm text-slate-700">
                                    {(entry.options || []).map((option, optionIndex) => (
                                        <div key={entry.question + '-' + optionIndex}>
                                            {optionLabels[optionIndex]}. {option}
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                                    <button
                                        onClick={() => toggleAnswer(index)}
                                        className="px-3 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition"
                                    >
                                        {isOpen(index) ? 'উত্তর লুকান' : 'উত্তর দেখুন'}
                                    </button>
                                    {isOpen(index) && (
                                        <div className="text-emerald-700 font-semibold">
                                            উত্তর: {optionLabels[entry.answerIndex]}। {entry.options?.[entry.answerIndex]}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        };

        const PublicBanglaMcqDetail = ({
            classLabel,
            itemName,
            categoryName,
            mcqQuestions,
            getQuestionKey,
            onNavigate
        }) => {
            const itemRoute = classLabel === 'SSC' ? 'public-bangla-ssc-item' : 'public-bangla-hsc-item';
            const mcqList = mcqQuestions[getQuestionKey(classLabel, categoryName, itemName, 'mcq')] || [];
            const chapterTitle = itemName || 'পাঠ নির্বাচন করুন';

            return (
                <PublicBanglaShell
                    title="বহুনির্বাচনী প্রশ্ন"
                    subtitle={categoryName ? 'বিভাগ: ' + categoryName : ''}
                    onBack={() => onNavigate(itemRoute)}
                    onNavigate={onNavigate}
                >
                    <div className="space-y-6 font-bangla">
                        <div className="text-center">
                            <div className="text-xs uppercase tracking-[0.3em] text-slate-400">অধ্যায়</div>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-2">{chapterTitle}</h2>
                        </div>
                        <PublicMcqList mcqList={mcqList} />
                    </div>
                </PublicBanglaShell>
            );
        };

        const PublicIctShell = ({ title, subtitle, classLabel, onBack, onNavigate, children }) => (
            <div className="flex-1 bg-[#ecfeff]">
                <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-8 space-y-5">
                    <div className="grid grid-cols-[auto,1fr,auto] items-center gap-4 border-b border-slate-200 pb-4">
                        {onBack ? (
                            <button
                                onClick={onBack}
                                className="w-10 h-10 rounded-md border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800 transition flex items-center justify-center"
                                aria-label="Go back"
                            >
                                <i className="fa-solid fa-arrow-left"></i>
                            </button>
                        ) : (
                            <div className="w-10 h-10" />
                        )}
                        <div className="text-center">
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{classLabel} ICT</div>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-2 font-bangla">{title}</h2>
                            {subtitle && <p className="text-sm text-slate-500 mt-2 font-bangla">{subtitle}</p>}
                        </div>
                        <button
                            onClick={() => onNavigate('landing')}
                            className="px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-[0.2em] border border-slate-200 text-slate-600 hover:border-slate-300 transition justify-self-end"
                        >
                            Home
                        </button>
                    </div>
                    <div className="lg:flex lg:gap-8">
                        <PublicSidebar title={title} subtitle={subtitle} onBack={onBack} onNavigate={onNavigate} />
                        <div className="flex-1">{children}</div>
                    </div>
                </div>
            </div>
        );

        const PublicIctChapterList = (props) => <PublicChapterList {...props} />;

        const PublicIctMcqDetail = ({ classLabel, chapter, mcqQuestions, getQuestionKey, onBack, onNavigate }) => {
            const chapterKey = chapter?.id || '';
            const mcqList = mcqQuestions[getQuestionKey(classLabel, 'ICT', chapterKey, 'mcq')] || [];
            const chapterTitle = chapter?.name || 'অধ্যায় নির্বাচন করুন';

            return (
                <PublicIctShell
                    title="আইসিটি বহুনির্বাচনী"
                    subtitle="অধ্যায় অনুযায়ী প্রশ্ন সমূহ"
                    classLabel={classLabel}
                    onBack={onBack}
                    onNavigate={onNavigate}
                >
                    <div className="space-y-6 font-bangla">
                        <div className="text-center">
                            <div className="text-xs uppercase tracking-[0.3em] text-slate-400">অধ্যায়</div>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-2">{chapterTitle}</h2>
                        </div>
                        <PublicMcqList mcqList={mcqList} />
                    </div>
                </PublicIctShell>
            );
        };

        const PublicScienceShell = ({ title, subtitle, subjectLabel, classLabel, onBack, onNavigate, children }) => (
            <div className="flex-1 bg-[#ecfdf3]">
                <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-8 space-y-5">
                    <div className="grid grid-cols-[auto,1fr,auto] items-center gap-4 border-b border-slate-200 pb-4">
                        {onBack ? (
                            <button
                                onClick={onBack}
                                className="w-10 h-10 rounded-md border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800 transition flex items-center justify-center"
                                aria-label="Go back"
                            >
                                <i className="fa-solid fa-arrow-left"></i>
                            </button>
                        ) : (
                            <div className="w-10 h-10" />
                        )}
                        <div className="text-center">
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{classLabel} {subjectLabel}</div>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-2 font-bangla">{title}</h2>
                            {subtitle && <p className="text-sm text-slate-500 mt-2 font-bangla">{subtitle}</p>}
                        </div>
                        <button
                            onClick={() => onNavigate('landing')}
                            className="px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-[0.2em] border border-slate-200 text-slate-600 hover:border-slate-300 transition justify-self-end"
                        >
                            Home
                        </button>
                    </div>
                    <div className="lg:flex lg:gap-8">
                        <PublicSidebar title={title} subtitle={subtitle} onBack={onBack} onNavigate={onNavigate} />
                        <div className="flex-1">{children}</div>
                    </div>
                </div>
            </div>
        );

        const PublicScienceChapterList = (props) => <PublicChapterList {...props} />;

        const PublicReligionOptionList = ({ options, onSelect }) => (
            <ArtPanelGrid className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                {options.map((option) => (
                    <button
                        key={option.key}
                        onClick={() => onSelect(option)}
                        className="text-left transition-all duration-300 group"
                    >
                        <div className="space-y-2 h-full">
                            <div className={cardSurfaceClass + ' flex items-center justify-center'}>
                                <div className="text-center px-3 card-art-media">
                                    <div className="text-lg font-semibold text-slate-900">{option.label}</div>
                                    <div className="text-xs text-slate-500 mt-2 font-bangla">{option.subtitle}</div>
                                </div>
                            </div>
                        </div>
                    </button>
                ))}
            </ArtPanelGrid>
        );

        const PublicScienceTopicList = ({ topics, onSelectTopic }) => (
            <div className={'grid justify-items-center ' + cardGridGapClass + ' sm:grid-cols-2 lg:grid-cols-3'}>
                {topics.map((topic) => (
                    <button
                        key={topic.id}
                        onClick={() => onSelectTopic(topic)}
                        className="w-full border border-slate-200 rounded-md p-4 text-center hover:border-slate-300 hover:bg-slate-50 transition font-bangla"
                    >
                        <div className="text-xs uppercase tracking-[0.2em] text-slate-400">টপিক</div>
                        <div className="text-lg font-semibold text-slate-900 mt-2">{topic.name}</div>
                        <p className="text-sm text-slate-500 mt-2">নোট, CQ এবং MCQ দেখুন</p>
                    </button>
                ))}
                {topics.length === 0 && (
                    <div className="border border-dashed border-slate-200 rounded-md p-6 text-sm text-slate-400 font-bangla text-center">
                        এখনো কোনো টপিক যোগ করা হয়নি।
                    </div>
                )}
            </div>
        );

        const PublicScienceTopicDetail = ({
            subjectLabel,
            classLabel,
            chapterName,
            topicName,
            noteKey,
            notesByItem,
            cqQuestions,
            mcqList,
            onBack,
            backRoute,
            onNavigateCq,
            onNavigateMcq,
            onOpenVideos,
            onNavigate
        }) => {
            const notes = (notesByItem || {})[noteKey] || [];
            const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            const toBanglaNumber = (value) => String(value)
                .split('')
                .map((digit) => banglaDigits[Number(digit)] ?? digit)
                .join('');
            const actionCards = [
                { key: 'cq', label: 'CQ', onClick: onNavigateCq },
                { key: 'mcq', label: 'MCQ', onClick: onNavigateMcq },
                {
                    key: 'videos',
                    label: 'Videos',
                    onClick: () =>
                        onOpenVideos &&
                        onOpenVideos({
                            noteKey,
                            title: topicName || 'টপিক নির্বাচন করুন',
                            subtitle: chapterName || '',
                            backRoute
                        })
                },
                { key: 'practice', label: 'Practice', disabled: true }
            ];

            return (
                <PublicSimpleShell
                    backgroundClass="bg-[#ecfdf3]"
                    title={topicName || 'টপিক নির্বাচন করুন'}
                    subtitle={chapterName || ''}
                    onBack={onBack}
                    onNavigate={onNavigate}
                >
                    <div className="space-y-6 font-bangla">
                        <div className="flex flex-wrap gap-2">
                            {actionCards.map((card) => (
                                <button
                                    key={card.key}
                                    onClick={card.disabled ? undefined : card.onClick}
                                    disabled={card.disabled}
                                    className={
                                        'rounded-lg border text-xs font-semibold transition px-3 py-1.5 ' +
                                        (card.disabled
                                            ? 'border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed'
                                            : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50')
                                    }
                                >
                                    {card.label}
                                </button>
                            ))}
                        </div>
                        <div className="space-y-2 text-sm text-slate-700">
                            {notes.length === 0 && (
                                <div className="text-sm text-slate-400">এখনো কোন নোট যোগ করা হয়নি।</div>
                            )}
                            {notes.map((note, index) => (
                                <div key={noteKey + '-' + index}>
                                    {toBanglaNumber(index + 1)}. {note}
                                </div>
                            ))}
                        </div>
                    </div>
                </PublicSimpleShell>
            );
        };

        const PublicScienceCqDetail = ({ subjectLabel, classLabel, chapterName, topicName, questions, onBack, onNavigate }) => {
            const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            const toBanglaNumber = (value) => String(value)
                .split('')
                .map((digit) => banglaDigits[Number(digit)] ?? digit)
                .join('');
            const cqTypes = [
                { key: 'gyan', label: 'জ্ঞান (ক)' },
                { key: 'onudhabon', label: 'অনুধাবন (খ)' }
            ];

            return (
                <PublicScienceShell
                    subjectLabel={subjectLabel}
                    classLabel={classLabel}
                    title="সৃজনশীল প্রশ্ন"
                    subtitle={chapterName ? chapterName + ' • ' + (topicName || '') : topicName || ''}
                    onBack={onBack}
                    onNavigate={onNavigate}
                >
                    <div className="space-y-6 font-bangla">
                        {cqTypes.map((type) => {
                            const list = questions[type.key] || [];
                            return (
                                <div key={type.key} className={flatSectionClass}>
                                    <div className="text-sm font-semibold text-slate-900">{type.label}</div>
                                    {list.length === 0 ? (
                                        <div className="text-sm text-slate-400 mt-3">এখনো কোন প্রশ্ন যোগ করা হয়নি।</div>
                                    ) : (
                                        <div className="mt-4 space-y-4">
                                            {list.map((entry, index) => (
                                                <div key={entry.question + '-' + index} className="space-y-2">
                                                    <div className="text-sm font-semibold text-slate-800">
                                                        {toBanglaNumber(index + 1)}. {entry.question}
                                                    </div>
                                                    <div className="text-sm text-slate-600 border-l-2 border-slate-200 pl-3">
                                                        {entry.answer}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </PublicScienceShell>
            );
        };

        const PublicScienceMcqDetail = ({ subjectLabel, classLabel, chapterName, topicName, mcqList, onBack, onNavigate }) => (
            <PublicScienceShell
                subjectLabel={subjectLabel}
                classLabel={classLabel}
                title="বহুনির্বাচনী প্রশ্ন"
                subtitle={chapterName ? chapterName + ' • ' + (topicName || '') : topicName || ''}
                onBack={onBack}
                onNavigate={onNavigate}
            >
                <div className="space-y-6 font-bangla">
                    <PublicMcqList mcqList={mcqList} />
                </div>
            </PublicScienceShell>
        );

        const formatDuration = (value) => {
            if (value === null || value === undefined) return '';
            const total = Math.floor(Number(value));
            if (Number.isNaN(total)) return '';
            const minutes = Math.floor(total / 60);
            const seconds = total % 60;
            return String(minutes) + ':' + String(seconds).padStart(2, '0');
        };

        const getYoutubeEmbedUrl = (url) => {
            if (!url) return '';
            const match = url.match(/(?:youtube\\.com\\/(?:watch\\?v=|embed\\/)|youtu\\.be\\/)([\\w-]+)/);
            return match ? 'https://www.youtube.com/embed/' + match[1] : '';
        };

        const getVideoSource = (video) => {
            if (!video) return '';
            if (video.sourceType === 'upload') {
                return video.url || (video.fileKey ? '/api/videos/' + encodeURIComponent(video.fileKey) : '');
            }
            return video.url || '';
        };

        const PublicVideoPlayer = ({ video, progress, onProgress, onDuration, className }) => {
            const videoRef = useRef(null);
            const embedUrl = video?.sourceType === 'link' ? getYoutubeEmbedUrl(video.url) : '';
            const source = getVideoSource(video);
            const frameClassName = className || 'w-full aspect-video rounded-md border border-slate-200';

            useEffect(() => {
                if (!videoRef.current) return;
                const node = videoRef.current;
                const handleLoaded = () => {
                    if (progress?.currentTime && progress.currentTime < node.duration) {
                        node.currentTime = progress.currentTime;
                    }
                };
                node.addEventListener('loadedmetadata', handleLoaded);
                return () => node.removeEventListener('loadedmetadata', handleLoaded);
            }, [video?.id]);

            if (embedUrl) {
                return (
                    <iframe
                        title={video.title}
                        src={embedUrl}
                        className={frameClassName}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                );
            }

            return (
                <video
                    ref={videoRef}
                    src={source}
                    controls
                    playsInline
                    className={frameClassName + ' bg-black'}
                    onLoadedMetadata={(event) => {
                        if (onDuration) {
                            onDuration(event.currentTarget.duration || 0);
                        }
                        if (onProgress) {
                            onProgress(event.currentTarget.currentTime || 0, event.currentTarget.duration || 0);
                        }
                    }}
                    onTimeUpdate={(event) => {
                        if (!onProgress) return;
                        onProgress(event.currentTarget.currentTime, event.currentTarget.duration || 0);
                    }}
                />
            );
        };

        const PublicVideoList = ({ context, videosByItem, onBack, onNavigate, onSelectVideo }) => {
            const { videoProgress, recentVideo, updateVideoProgress } = useVideoProgress();
            const resolvedContext = context || recentVideo?.context;
            const videos = resolvedContext ? (videosByItem?.[resolvedContext.noteKey] || []) : [];
            const [durationMap, setDurationMap] = useState({});
            const resolvedBack =
                onBack || (resolvedContext?.backRoute ? () => onNavigate(resolvedContext.backRoute) : null);

            const handleSelect = (video) => {
                updateVideoProgress({
                    id: video.id,
                    title: video.title,
                    context: resolvedContext,
                    route: 'public-video-player',
                    currentTime: videoProgress?.[video.id]?.currentTime || 0,
                    duration: durationMap[video.id] || videoProgress?.[video.id]?.duration || 0
                });
                if (onSelectVideo) {
                    onSelectVideo(video, resolvedContext);
                }
            };

            const backgroundClass = resolvedContext?.backgroundClass || 'bg-white';
            const title = resolvedContext?.title || 'ভিডিও';
            const subtitle = resolvedContext?.subtitle || '';

            return (
                <PublicSimpleShell
                    backgroundClass={backgroundClass}
                    title={title}
                    subtitle={subtitle}
                    onBack={resolvedBack}
                    onNavigate={onNavigate}
                >
                    <div className="space-y-4 font-bangla text-left">
                        <div className="text-xs uppercase tracking-[0.3em] text-slate-400">ভিডিও লিস্ট</div>
                        <div className="space-y-3">
                            {videos.length === 0 && (
                                <div className="text-sm text-slate-400">এখনো কোনো ভিডিও যোগ করা হয়নি।</div>
                            )}
                            {videos.map((video) => {
                                const progress = videoProgress?.[video.id];
                                const previewUrl = getVideoSource(video);
                                const embedUrl = video.sourceType === 'link' ? getYoutubeEmbedUrl(video.url) : '';
                                const durationValue = durationMap[video.id] || progress?.duration || 0;
                                const durationLabel = durationValue ? formatDuration(durationValue) : 'Unavailable';
                                return (
                                    <button
                                        key={video.id}
                                        onClick={() => handleSelect(video)}
                                        className="w-full text-left border-b border-slate-200 last:border-b-0 px-2 py-3 hover:bg-slate-50 transition"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-20 h-12 shrink-0">
                                                {embedUrl ? (
                                                    <iframe
                                                        title={video.title}
                                                        src={embedUrl}
                                                        className="w-20 h-12 rounded-md border border-slate-200"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    ></iframe>
                                                ) : previewUrl ? (
                                                    <video
                                                        src={previewUrl}
                                                        muted
                                                        playsInline
                                                        preload="metadata"
                                                        className="w-20 h-12 rounded-md border border-slate-200 bg-black object-cover"
                                                        onLoadedMetadata={(event) => {
                                                            const nextDuration = event.currentTarget.duration || 0;
                                                            setDurationMap((prev) => ({ ...prev, [video.id]: nextDuration }));
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-20 h-12 rounded-md border border-slate-200 bg-slate-100 flex items-center justify-center text-[10px] text-slate-400">
                                                        Preview unavailable
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="text-sm font-semibold text-slate-900 truncate">{video.title}</div>
                                                <div className="text-xs text-slate-500">
                                                    <span className="font-semibold text-slate-600">Channel:</span>{' '}
                                                    {video.channelName ? (
                                                        video.channelUrl ? (
                                                            <a href={video.channelUrl} target="_blank" rel="noreferrer" className="text-indigo-500">
                                                                {video.channelName}
                                                            </a>
                                                        ) : (
                                                            video.channelName
                                                        )
                                                    ) : (
                                                        'Unavailable'
                                                    )}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    <span className="font-semibold text-slate-600">Duration:</span> {durationLabel}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </PublicSimpleShell>
            );
        };

        const PublicVideoDetail = ({ context, videoId, videosByItem, onBack, onNavigate }) => {
            const { videoProgress, recentVideo, updateVideoProgress } = useVideoProgress();
            const resolvedContext = context || recentVideo?.context;
            const videos = resolvedContext ? (videosByItem?.[resolvedContext.noteKey] || []) : [];
            const fallbackVideoId = videoId || recentVideo?.id;
            const activeVideo = videos.find((video) => video.id === fallbackVideoId) || videos[0];
            const progress = activeVideo ? videoProgress?.[activeVideo.id] : null;
            const [duration, setDuration] = useState(progress?.duration || 0);
            const resolvedBack = onBack || (() => onNavigate('public-videos'));
            const backgroundClass = resolvedContext?.backgroundClass || 'bg-white';
            const title = resolvedContext?.title || 'ভিডিও';
            const subtitle = resolvedContext?.subtitle || '';

            return (
                <PublicSimpleShell
                    backgroundClass={backgroundClass}
                    title={title}
                    subtitle={subtitle}
                    onBack={resolvedBack}
                    onNavigate={onNavigate}
                >
                    {activeVideo ? (
                        <div className="space-y-4 font-bangla text-left">
                            <div className="space-y-1">
                                <div className="text-base font-semibold text-slate-900">{activeVideo.title}</div>
                                <div className="text-sm text-slate-600">
                                    <span className="font-semibold">Channel:</span>{' '}
                                    {activeVideo.channelName ? (
                                        activeVideo.channelUrl ? (
                                            <a href={activeVideo.channelUrl} target="_blank" rel="noreferrer" className="text-indigo-500">
                                                {activeVideo.channelName}
                                            </a>
                                        ) : (
                                            activeVideo.channelName
                                        )
                                    ) : (
                                        'Unavailable'
                                    )}
                                </div>
                                <div className="text-sm text-slate-600">
                                    <span className="font-semibold">Duration:</span>{' '}
                                    {duration ? formatDuration(duration) : 'Unavailable'}
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <PublicVideoPlayer
                                    video={activeVideo}
                                    progress={progress}
                                    className="w-full max-w-3xl aspect-video rounded-md border border-slate-200"
                                    onDuration={(nextDuration) => {
                                        if (nextDuration) {
                                            setDuration(nextDuration);
                                        }
                                    }}
                                    onProgress={(currentTime, nextDuration) => {
                                        if (nextDuration) {
                                            setDuration(nextDuration);
                                        }
                                        updateVideoProgress({
                                            id: activeVideo.id,
                                            title: activeVideo.title,
                                            context: resolvedContext,
                                            route: 'public-video-player',
                                            currentTime,
                                            duration: nextDuration
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm text-slate-400 font-bangla">এখনো কোনো ভিডিও যোগ করা হয়নি।</div>
                    )}
                </PublicSimpleShell>
            );
        };

        const PublicEnglishShell = ({ title, subtitle, onBack, onNavigate, children }) => (
            <div className="flex-1 bg-[#eef2ff]">
                <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-8 space-y-5">
                    <div className="grid grid-cols-[auto,1fr,auto] items-center gap-4 border-b border-slate-200 pb-4">
                        {onBack ? (
                            <button
                                onClick={onBack}
                                className="w-10 h-10 rounded-md border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800 transition flex items-center justify-center"
                                aria-label="Go back"
                            >
                                <i className="fa-solid fa-arrow-left"></i>
                            </button>
                        ) : (
                            <div className="w-10 h-10" />
                        )}
                        <div className="text-center">
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">English 1st Paper</div>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-2">{title}</h2>
                            {subtitle && <p className="text-sm text-slate-500 mt-2">{subtitle}</p>}
                        </div>
                        <button
                            onClick={() => onNavigate('landing')}
                            className="px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-[0.2em] border border-slate-200 text-slate-600 hover:border-slate-300 transition justify-self-end"
                        >
                            Home
                        </button>
                    </div>
                    <div className="lg:flex lg:gap-8">
                        <PublicSidebar title={title} subtitle={subtitle} onBack={onBack} onNavigate={onNavigate} />
                        <div className="flex-1">{children}</div>
                    </div>
                </div>
            </div>
        );

        const PublicEnglishCardGrid = ({ items, onNavigate }) => (
            <div className={'grid justify-items-center ' + cardGridGapClass + ' sm:grid-cols-2'}>
                {items.map((item) => (
                    <button
                        key={item.key}
                        onClick={() => item.route && onNavigate(item.route)}
                        className="w-full border border-slate-200 rounded-md p-4 text-center hover:border-slate-300 hover:bg-slate-50 transition"
                    >
                        <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Section</div>
                        <div className="text-lg font-semibold text-slate-900 mt-2">{item.title}</div>
                        <p className="text-sm text-slate-500 mt-2">{item.description}</p>
                    </button>
                ))}
            </div>
        );

        const PublicEnglishTypeList = ({ items, onSelect }) => (
            <div className="border-y border-slate-200 divide-y">
                {items.map((item) => (
                    <button
                        key={item.key}
                        onClick={() => onSelect(item)}
                        className="w-full flex items-center justify-between px-2 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition text-left"
                    >
                        <div className="text-left space-y-1">
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Question type</div>
                            <div className="text-base font-semibold text-slate-900">{item.label}</div>
                            {item.description && <p className="text-xs text-slate-500">{item.description}</p>}
                            {item.children?.length > 0 && (
                                <p className="text-xs text-indigo-500">
                                    Includes {item.children.map((child) => child.label).join(', ')}
                                </p>
                            )}
                        </div>
                        <span className="text-xs uppercase tracking-[0.2em] text-indigo-600">Open</span>
                    </button>
                ))}
                {items.length === 0 && (
                    <div className="px-2 py-4 text-sm text-slate-400">No question types available yet.</div>
                )}
            </div>
        );

        const PublicEnglishQuestionList = ({ questions }) => (
            <div className="space-y-4 text-left">
                {questions.length === 0 && (
                    <div className="text-sm text-slate-400">No questions have been added yet.</div>
                )}
                {questions.map((entry, index) => (
                    <div key={index} className={flatSectionClass + ' space-y-2'}>
                        <div className="text-sm font-semibold text-slate-900">Q{index + 1}. {entry.question}</div>
                        <div className="text-sm text-slate-600 border-l-2 border-slate-200 pl-3">
                            Answer: {entry.answer}
                        </div>
                    </div>
                ))}
            </div>
        );

        const StudentLanding = ({ onNavigate }) => {
            const [quoteIndex, setQuoteIndex] = useState(0);
            const [quickQuery, setQuickQuery] = useState('');
            const thumbnailMap = useThumbnails('/api/thumbnails', 'subjectKey');
            const { readMap, recentRead } = useReadingProgress();
            const { recentVideo } = useVideoProgress();

            useEffect(() => {
                const timer = setInterval(() => {
                    setQuoteIndex((prev) => (prev + 1) % quoteItems.length);
                }, 9000);
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
                        addEntry({
                            type: 'Content',
                            title: note,
                            subtitle: parentLabel + ' • Note ' + (index + 1),
                            keywords: [note, parentLabel, 'note', 'content'].join(' '),
                            onSelect
                        });
                    });
                    const videos = (videosByItem || {})[noteKey] || [];
                    videos.forEach((video) => {
                        addEntry({
                            type: 'Video',
                            title: video.title,
                            subtitle: parentLabel + ' • Video',
                            keywords: [video.title, parentLabel, 'video'].join(' '),
                            onSelect: () => {
                                setSelectedVideoContext({
                                    ...videoContext,
                                    noteKey
                                });
                                setSelectedVideoId(video.id);
                                onNavigate('public-video-player');
                            }
                        });
                    });
                };

                [...sscSubjects, ...hscSubjects].forEach((subject) => {
                    if (!subject.route) return;
                    addEntry({
                        type: 'Subject',
                        title: subject.title,
                        subtitle: subject.classLabel + ' • ' + subject.groupLabel,
                        keywords: [subject.title, subject.subtitle, subject.classLabel, subject.groupLabel].join(' '),
                        onSelect: () => onNavigate(subject.route)
                    });
                });

                const scienceConfigs = [
                    {
                        classLabel: 'SSC',
                        subjectLabel: 'Physics',
                        chapters: sscPhysicsChapters,
                        listRoute: 'public-ssc-physics-topics',
                        topicRoute: 'public-ssc-physics-topic'
                    },
                    {
                        classLabel: 'SSC',
                        subjectLabel: 'Chemistry',
                        chapters: sscChemistryChapters,
                        listRoute: 'public-ssc-chemistry-topics',
                        topicRoute: 'public-ssc-chemistry-topic'
                    },
                    {
                        classLabel: 'SSC',
                        subjectLabel: 'Biology',
                        chapters: sscBiologyChapters,
                        listRoute: 'public-ssc-biology-topics',
                        topicRoute: 'public-ssc-biology-topic'
                    },
                    {
                        classLabel: 'SSC',
                        subjectLabel: 'Bangladesh and Global Studies',
                        chapters: sscBangladeshGlobalChapters,
                        listRoute: 'public-ssc-bangladesh-global-studies-topics',
                        topicRoute: 'public-ssc-bangladesh-global-studies-topic'
                    },
                    {
                        classLabel: 'HSC',
                        subjectLabel: 'Physics 1st Paper',
                        chapters: hscPhysics1stChapters,
                        listRoute: 'public-hsc-physics-1st-topics',
                        topicRoute: 'public-hsc-physics-1st-topic'
                    },
                    {
                        classLabel: 'HSC',
                        subjectLabel: 'Physics 2nd Paper',
                        chapters: hscPhysics2ndChapters,
                        listRoute: 'public-hsc-physics-2nd-topics',
                        topicRoute: 'public-hsc-physics-2nd-topic'
                    },
                    {
                        classLabel: 'HSC',
                        subjectLabel: 'Chemistry 1st Paper',
                        chapters: hscChemistry1stChapters,
                        listRoute: 'public-hsc-chemistry-1st-topics',
                        topicRoute: 'public-hsc-chemistry-1st-topic'
                    },
                    {
                        classLabel: 'HSC',
                        subjectLabel: 'Chemistry 2nd Paper',
                        chapters: hscChemistry2ndChapters,
                        listRoute: 'public-hsc-chemistry-2nd-topics',
                        topicRoute: 'public-hsc-chemistry-2nd-topic'
                    },
                    {
                        classLabel: 'HSC',
                        subjectLabel: 'Biology 1st Paper',
                        chapters: hscBiology1stChapters,
                        listRoute: 'public-hsc-biology-1st-topics',
                        topicRoute: 'public-hsc-biology-1st-topic'
                    },
                    {
                        classLabel: 'HSC',
                        subjectLabel: 'Biology 2nd Paper',
                        chapters: hscBiology2ndChapters,
                        listRoute: 'public-hsc-biology-2nd-topics',
                        topicRoute: 'public-hsc-biology-2nd-topic'
                    },
                    {
                        classLabel: 'HSC',
                        subjectLabel: 'Information and Communication Technology',
                        chapters: hscIctChapters,
                        listRoute: 'public-hsc-ict-topics',
                        topicRoute: 'public-hsc-ict-topic',
                        questionKey: 'ICT'
                    }
                ];

                scienceConfigs.forEach((config) => {
                    (config.chapters || []).forEach((chapter) => {
                        addEntry({
                            type: 'Chapter',
                            title: chapter.name,
                            subtitle: config.subjectLabel + ' • ' + config.classLabel,
                            keywords: [chapter.name, config.subjectLabel, config.classLabel, 'chapter'].join(' '),
                            onSelect: () => {
                                setSelectedScienceChapter(chapter);
                                setSelectedScienceSubject({
                                    classLabel: config.classLabel,
                                    subjectLabel: config.subjectLabel,
                                    questionKey: config.questionKey
                                });
                                setSelectedScienceTopic(null);
                                onNavigate(config.listRoute);
                            }
                        });
                        (chapter.topics || []).forEach((topic) => {
                            const topicKey = getScienceTopicKey(chapter.id, topic.id);
                            const noteKey = [config.classLabel, config.subjectLabel, topicKey].join('-');
                            const topicAction = () => {
                                setSelectedScienceChapter(chapter);
                                setSelectedScienceSubject({
                                    classLabel: config.classLabel,
                                    subjectLabel: config.subjectLabel,
                                    questionKey: config.questionKey
                                });
                                setSelectedScienceTopic(topic);
                                onNavigate(config.topicRoute);
                            };
                            const parentLabel = topic.name + ' • ' + chapter.name;
                            addEntry({
                                type: 'Topic',
                                title: topic.name,
                                subtitle: config.subjectLabel + ' • ' + chapter.name,
                                keywords: [topic.name, chapter.name, config.subjectLabel, 'topic'].join(' '),
                                onSelect: topicAction
                            });
                            addContentEntries({
                                noteKey,
                                parentLabel,
                                onSelect: topicAction,
                                videoContext: {
                                    title: topic.name,
                                    subtitle: chapter.name,
                                    backRoute: config.topicRoute,
                                    backgroundClass: 'bg-[#ecfdf3]'
                                }
                            });
                        });
                    });
                });

                (sscIctChapters || []).forEach((chapter) => {
                    addEntry({
                        type: 'Chapter',
                        title: chapter.name,
                        subtitle: 'ICT • SSC',
                        keywords: [chapter.name, 'ICT', 'SSC', 'chapter'].join(' '),
                        onSelect: () => {
                            setSelectedIctChapter(chapter);
                            setSelectedIctClass('SSC');
                            onNavigate('public-ssc-ict-mcq');
                        }
                    });
                });

                religionOptions.forEach((option) => {
                    const chapters = (sscReligionChapters || {})[option.key] || [];
                    chapters.forEach((chapter) => {
                        addEntry({
                            type: 'Chapter',
                            title: chapter.name,
                            subtitle: option.label + ' • Religion',
                            keywords: [chapter.name, option.label, option.subtitle, 'religion', 'chapter'].join(' '),
                            onSelect: () => {
                                setSelectedReligion(option);
                                setSelectedScienceChapter(chapter);
                                setSelectedScienceSubject({
                                    classLabel: 'SSC',
                                    subjectLabel: 'Religion and Moral Education',
                                    religionKey: option.key
                                });
                                setSelectedScienceTopic(null);
                                onNavigate('public-ssc-religion-topics');
                            }
                        });
                        (chapter.topics || []).forEach((topic) => {
                            const topicKey = getScienceTopicKey(chapter.id, topic.id);
                            const noteKey = ['SSC', getReligionSubjectKey(option), topicKey].join('-');
                            const topicAction = () => {
                                setSelectedReligion(option);
                                setSelectedScienceChapter(chapter);
                                setSelectedScienceSubject({
                                    classLabel: 'SSC',
                                    subjectLabel: 'Religion and Moral Education',
                                    religionKey: option.key
                                });
                                setSelectedScienceTopic(topic);
                                onNavigate('public-ssc-religion-topic');
                            };
                            const parentLabel = topic.name + ' • ' + chapter.name;
                            addEntry({
                                type: 'Topic',
                                title: topic.name,
                                subtitle: option.label + ' • ' + chapter.name,
                                keywords: [topic.name, chapter.name, option.label, 'religion', 'topic'].join(' '),
                                onSelect: topicAction
                            });
                            addContentEntries({
                                noteKey,
                                parentLabel,
                                onSelect: topicAction,
                                videoContext: {
                                    title: topic.name,
                                    subtitle: chapter.name,
                                    backRoute: 'public-ssc-religion-topic',
                                    backgroundClass: 'bg-[#ecfdf3]'
                                }
                            });
                        });
                    });
                });

                const addBanglaItems = (classLabel, categoryLabel, items, itemRoute) => {
                    (items || []).forEach((item) => {
                        const itemName = typeof item === 'string' ? item : item.name;
                        const label = typeof item === 'string' ? categoryLabel : item.type;
                        if (!itemName || !label) return;
                        const noteKey = [classLabel, label, itemName].join('-');
                        const itemAction = () => {
                            storeBanglaSelection({
                                classLabel,
                                categoryName: label,
                                itemName
                            });
                            setSelectedBanglaItem(itemName);
                            setSelectedBanglaCategory(label);
                            onNavigate(itemRoute);
                        };
                        const parentLabel = itemName + ' • ' + label;
                        addEntry({
                            type: 'Content',
                            title: itemName,
                            subtitle: classLabel + ' Bangla • ' + label,
                            keywords: [itemName, label, classLabel, 'bangla', 'content'].join(' '),
                            onSelect: itemAction
                        });
                        addContentEntries({
                            noteKey,
                            parentLabel,
                            onSelect: itemAction,
                            videoContext: {
                                title: itemName,
                                subtitle: label,
                                backRoute: itemRoute,
                                backgroundClass: 'bg-[#fff7ed]'
                            }
                        });
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

            const quickResults = normalizedQuickQuery
                ? buildQuickSearchEntries().filter((entry) => {
                    const haystack = (entry.keywords || entry.title || '').toLowerCase();
                    return haystack.includes(normalizedQuickQuery);
                }).slice(0, 10)
                : [];

            const handleQuickSelect = (entry) => {
                if (!entry?.onSelect) return;
                entry.onSelect();
            };

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
                                        <svg viewBox="0 0 24 24" className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3.5 9.5L12 5l8.5 4.5L12 14 3.5 9.5z" />
                                            <path d="M6.5 11.2V16c0 .7.4 1.4 1.1 1.7C9 18.4 10.4 19 12 19s3-.6 4.4-1.3c.7-.3 1.1-1 1.1-1.7v-4.8" />
                                            <path d="M20.5 9.7V14" />
                                            <path d="M21.5 14h-2" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-3xl sm:text-4xl font-semibold text-white">Freeducation</div>
                                        <div className="text-sm text-white/80 uppercase tracking-[0.2em] mt-1">
                                            Serve education with clarity
                                        </div>
                                    </div>
                                </div>
                                <div className="max-w-xl bg-indigo-600 border border-indigo-500 rounded-md p-6 text-white">
                                    <p className="text-base sm:text-lg font-serif italic leading-relaxed">
                                        “{activeQuote.text}”
                                    </p>
                                    <p className="text-sm font-semibold text-white/90 mt-3">— {activeQuote.author}</p>
                                </div>
                            </div>
                            <div className="mt-6">
                                <div className="relative">
                                    <label className="text-[11px] uppercase tracking-[0.3em] text-white/70">Quick Search</label>
                                    <input
                                        value={quickQuery}
                                        onChange={(event) => setQuickQuery(event.target.value)}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter' && quickResults[0]) {
                                                handleQuickSelect(quickResults[0]);
                                            }
                                        }}
                                        placeholder="Search subjects, chapters, topics, notes, videos..."
                                        className="mt-2 w-full rounded-lg border border-white/30 bg-white/95 py-2.5 pl-11 pr-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-white"
                                    />
                                    <i className="fa-solid fa-magnifying-glass absolute left-4 top-[calc(50%+12px)] -translate-y-1/2 text-slate-400"></i>
                                    {normalizedQuickQuery && (
                                        <div className="absolute left-0 right-0 mt-2 z-[100] rounded-lg border border-white/40 bg-white/95 text-slate-700 max-h-72 overflow-y-auto shadow-2xl">
                                            {quickResults.length === 0 && (
                                                <div className="px-4 py-3 text-sm text-slate-400 text-left">
                                                    No matches found.
                                                </div>
                                            )}
                                            {quickResults.map((entry, index) => (
                                                <button
                                                    key={entry.title + '-' + entry.type + '-' + index}
                                                    onClick={() => handleQuickSelect(entry)}
                                                    className="w-full text-left px-4 py-3 hover:bg-slate-50 transition"
                                                >
                                                    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{entry.type}</div>
                                                    <div className="text-sm font-semibold text-slate-900">{entry.title}</div>
                                                    {entry.subtitle && (
                                                        <div className="text-xs text-slate-500 mt-1">{entry.subtitle}</div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {continueLabel && continueRoute && (
                                <div className="mt-6">
                                    <button
                                        onClick={() => onNavigate(continueRoute)}
                                        className="w-full sm:w-auto inline-flex items-center gap-3 rounded-md bg-emerald-400/90 text-emerald-950 px-5 py-3 text-sm font-semibold shadow-sm hover:bg-emerald-300 transition"
                                    >
                                        <i className="fa-solid fa-play"></i>
                                        Continue Reading: {continueLabel}
                                    </button>
                                </div>
                            )}
                            {continueVideoTitle && (
                                <div className="mt-3">
                                    <button
                                        onClick={() => onNavigate(continueVideoRoute)}
                                        className="w-full sm:w-auto inline-flex items-center gap-3 rounded-md bg-indigo-500/90 text-white px-5 py-3 text-sm font-semibold shadow-sm hover:bg-indigo-400 transition"
                                    >
                                        <i className="fa-solid fa-circle-play"></i>
                                        Continue Watching: {continueVideoTitle}
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-10 space-y-6 bg-white relative z-0">
                        <div className="text-center">
                            <div className="text-xs uppercase tracking-[0.2em] text-indigo-500">Academic</div>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-2">Academic</h2>
                        </div>
                        <SubjectRow
                            title="SSC"
                            subjects={sscFeaturedSubjects}
                            onNavigate={onNavigate}
                            onAll={() => onNavigate('ssc-subjects')}
                            thumbnailMap={thumbnailMap}
                            readMap={readMap}
                        />
                        <SubjectRow
                            title="HSC"
                            subjects={hscFeaturedSubjects}
                            onNavigate={onNavigate}
                            onAll={() => onNavigate('hsc-subjects')}
                            thumbnailMap={thumbnailMap}
                            readMap={readMap}
                        />
                    </section>
                </div>
            );
        };
        return {
            StudentLanding,
            SubjectIndexPage,
            PublicBanglaShell,
            PublicBanglaTopicGrid,
            PublicBanglaTextList,
            PublicBanglaShohopathList,
            PublicBanglaItemDetail,
            PublicBanglaSrijonshilDetail,
            PublicBanglaMcqDetail,
            PublicIctShell,
            PublicIctChapterList,
            PublicIctMcqDetail,
            PublicScienceShell,
            PublicScienceChapterList,
            PublicScienceTopicList,
            PublicScienceTopicDetail,
            PublicScienceCqDetail,
            PublicScienceMcqDetail,
            PublicVideoList,
            PublicVideoDetail,
            PublicReligionOptionList,
            PublicEnglishShell,
            PublicEnglishCardGrid,
            PublicEnglishTypeList,
            PublicEnglishQuestionList,
            sscSubjects,
            hscSubjects,
            religionOptions
        };
        })();
        const {
            StudentLanding,
            SubjectIndexPage,
            PublicBanglaShell,
            PublicBanglaTopicGrid,
            PublicBanglaTextList,
            PublicBanglaShohopathList,
            PublicBanglaItemDetail,
            PublicBanglaSrijonshilDetail,
            PublicBanglaMcqDetail,
            PublicIctShell,
            PublicIctChapterList,
            PublicIctMcqDetail,
            PublicScienceShell,
            PublicScienceChapterList,
            PublicScienceTopicList,
            PublicScienceTopicDetail,
            PublicScienceCqDetail,
            PublicScienceMcqDetail,
            PublicVideoList,
            PublicVideoDetail,
            PublicReligionOptionList,
            PublicEnglishShell,
            PublicEnglishCardGrid,
            PublicEnglishTypeList,
            PublicEnglishQuestionList,
            sscSubjects,
            hscSubjects,
            religionOptions
        } = LandingModule;
`;
