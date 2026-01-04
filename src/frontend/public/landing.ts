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
        const cardGridGapClass = 'gap-4 sm:gap-6';
        const cardSurfaceClass =
            'relative w-full aspect-[4/5] rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm transition group-hover:-translate-y-1 group-hover:shadow-lg group-hover:border-indigo-200 card-art-surface';
        const cardPanelClass = 'relative rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm';
        const ArtPanelGrid = ({ children, className = '' }) => (
            <div className={cardPanelClass}>
                <div className={'relative grid ' + cardGridGapClass + ' ' + className}>
                    {children}
                </div>
            </div>
        );

        const SubjectCard = ({ subject, onNavigate, className = '', showGroup = false }) => {
            const isActive = Boolean(subject.route);
            const chapterCount = subject.chapterCount || (subject.groups?.length || 1) * 4 + 6;
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
                    <div className="space-y-1.5 h-full">
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
                        <div className="flex-1">
                            <div className="text-xs sm:text-sm font-semibold text-slate-900">{subject.title}</div>
                            {subject.subtitle && <div className="text-[11px] text-slate-500 font-bangla mt-1">{subject.subtitle}</div>}
                            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500">
                                <span className="inline-flex items-center gap-1">
                                    <i className="fa-solid fa-layer-group text-[10px] text-slate-400"></i>
                                    {chapterCount} Chapters
                                </span>
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
                <div className="space-y-2 h-full">
                    <div className={cardSurfaceClass + (isRead ? ' ring-1 ring-emerald-200' : '')}>
                        {isRead && (
                            <div className="absolute top-2 right-2 z-10 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-1 text-[10px] font-semibold text-white shadow-sm">
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
                    <div>
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
                        <div className="border border-dashed border-slate-200 rounded-2xl p-6 text-sm text-slate-400 font-bangla">
                            এখনো কোনো অধ্যায় যোগ করা হয়নি।
                        </div>
                    )}
                </ArtPanelGrid>
            );
        };

        const SubjectRow = ({ title, onAll, subjects, onNavigate, thumbnailMap, readMap }) => (
            <section className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-900">{title}</h3>
                    <button
                        onClick={onAll}
                        className="text-xs font-semibold uppercase tracking-[0.2em] text-white bg-indigo-600 px-3 py-1.5 rounded-full transition hover:bg-indigo-500 hover:-translate-y-0.5 hover:shadow-md flex items-center gap-2"
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
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <div className="text-xs uppercase tracking-[0.2em] text-indigo-500">Academic</div>
                                <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-2">
                                    {classLabel} Subjects
                                </h2>
                                <p className="text-sm text-slate-500 mt-2">
                                    Browse the complete {classLabel} list by group or search for a subject.
                                </p>
                            </div>
                            <button
                                onClick={() => onNavigate('landing')}
                                className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
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
                        <div className="mt-6 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
                            <span>Showing</span>
                            <span>{filteredSubjects.length} subjects</span>
                        </div>
                        <div className={'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ' + cardGridGapClass + ' mt-4'}>
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

        const PublicBanglaShell = ({ title, subtitle, onBack, onNavigate, children }) => (
            <div className="flex-1 bg-[#fff7ed]">
                <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-8 space-y-5">
                    <div className="space-y-6">
                        <div className="rounded-3xl border border-rose-100 bg-white p-5 sm:p-7 shadow-sm">
                            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
                                <div>
                                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Bangla 1st Paper</div>
                                    <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-2 font-bangla">
                                        {title}
                                    </h2>
                                    {subtitle && <p className="text-sm text-slate-600 mt-2 font-bangla">{subtitle}</p>}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {onBack && (
                                        <button
                                            onClick={onBack}
                                            className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.2em] border border-slate-200 text-slate-600 hover:border-slate-300 transition"
                                        >
                                            Back
                                        </button>
                                    )}
                                    <button
                                        onClick={() => onNavigate('landing')}
                                        className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.2em] border border-slate-200 text-slate-600 hover:border-slate-300 transition"
                                    >
                                        Home
                                    </button>
                                </div>
                            </div>
                        </div>
                        {children}
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
                        <div key={section.key} className="border border-slate-200 rounded-2xl bg-white p-5 shadow-sm">
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
            srijonshilQuestions,
            mcqQuestions,
            getQuestionKey,
            onNavigate
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

            const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            const toBanglaNumber = (value) => String(value)
                .split('')
                .map((digit) => banglaDigits[Number(digit)] ?? digit)
                .join('');
            const noteKey = [classLabel, categoryName || 'general', itemName || ''].join('-');
            const notes = (notesByItem || {})[noteKey] || [];
            const chapterTitle = itemName || 'পাঠ নির্বাচন করুন';
            const [activeTab, setActiveTab] = useState('notes');
            const srijonshilTypes = [
                { key: 'gyan', label: 'জ্ঞান (ক)' },
                { key: 'onudhabon', label: 'অনুধাবন (খ)' }
            ];
            const cqSections = srijonshilTypes.map((type) => ({
                key: type.key,
                label: type.label,
                items: srijonshilQuestions?.[getQuestionKey(classLabel, categoryName, itemName, type.key)] || [],
                prefix: (index) => toBanglaNumber(index + 1)
            }));
            const mcqList = mcqQuestions?.[getQuestionKey(classLabel, categoryName, itemName, 'mcq')] || [];

            return (
                <PublicBanglaShell
                    title="পাঠ তথ্য"
                    subtitle={categoryName ? 'বিভাগ: ' + categoryName : ''}
                    onBack={() => onNavigate(categoryRoute)}
                    onNavigate={onNavigate}
                >
                    <div className="space-y-6 font-bangla">
                        <div className="text-center">
                            <div className="text-xs uppercase tracking-[0.3em] text-slate-400">অধ্যায়</div>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-2">{chapterTitle}</h2>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
                            <div className="border-b border-slate-100 px-4 pt-4">
                                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Learning tabs</div>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {[
                                        { key: 'notes', label: 'Read (Notes)' },
                                        { key: 'cq', label: 'Practice (CQ)' },
                                        { key: 'mcq', label: 'Test (MCQ)' }
                                    ].map((tab) => (
                                        <button
                                            key={tab.key}
                                            onClick={() => setActiveTab(tab.key)}
                                            className={
                                                'px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.2em] border transition ' +
                                                (activeTab === tab.key
                                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                    : 'border-slate-200 text-slate-500 hover:border-slate-300')
                                            }
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="px-4 py-5">
                                {activeTab === 'notes' && (
                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">নোটস</div>
                                            <div className="text-sm font-semibold text-slate-700 mt-1">অধ্যায়ের গুরুত্বপূর্ণ নোট</div>
                                        </div>
                                        <ul className="divide-y border border-slate-100 rounded-xl">
                                            {notes.length === 0 && (
                                                <li className="px-4 py-3 text-sm text-slate-400">এখনো কোন নোট যোগ করা হয়নি।</li>
                                            )}
                                            {notes.map((note, index) => (
                                                <li key={noteKey + '-' + index} className="px-4 py-3 flex items-start gap-3">
                                                    <span className="text-sm font-semibold text-slate-500">
                                                        {toBanglaNumber(index + 1)}.
                                                    </span>
                                                    <div className="text-sm text-slate-700">{note}</div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {activeTab === 'cq' && (
                                    <CqQuestionList sections={cqSections} />
                                )}
                                {activeTab === 'mcq' && (
                                    <PublicMcqList mcqList={mcqList} />
                                )}
                            </div>
                        </div>
                    </div>
                </PublicBanglaShell>
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
                    <div className="space-y-6 font-bangla">
                        <div className="text-center">
                            <div className="text-xs uppercase tracking-[0.3em] text-slate-400">অধ্যায়</div>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-2">{chapterTitle}</h2>
                        </div>
                        {srijonshilTypes.map((type) => {
                            const list = srijonshilQuestions[getQuestionKey(classLabel, categoryName, itemName, type.key)] || [];
                            return (
                                <div key={type.key} className="border border-slate-200 rounded-2xl bg-white p-5 shadow-sm">
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
                                className="px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition"
                            >
                                সকল উত্তর দেখুন
                            </button>
                            <button
                                onClick={hideAll}
                                className="px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition"
                            >
                                সকল উত্তর লুকান
                            </button>
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm divide-y">
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
                                        className="px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition"
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
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{classLabel} ICT</div>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-2 font-bangla">{title}</h2>
                            {subtitle && <p className="text-sm text-slate-500 mt-2 font-bangla">{subtitle}</p>}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {onBack && (
                                <button
                                    onClick={onBack}
                                    className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.2em] border border-slate-200 text-slate-600 hover:border-slate-300 transition"
                                >
                                    Back
                                </button>
                            )}
                            <button
                                onClick={() => onNavigate('landing')}
                                className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.2em] border border-slate-200 text-slate-600 hover:border-slate-300 transition"
                            >
                                Home
                            </button>
                        </div>
                    </div>
                    {children}
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
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{classLabel} {subjectLabel}</div>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-2 font-bangla">{title}</h2>
                            {subtitle && <p className="text-sm text-slate-500 mt-2 font-bangla">{subtitle}</p>}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {onBack && (
                                <button
                                    onClick={onBack}
                                    className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.2em] border border-slate-200 text-slate-600 hover:border-slate-300 transition"
                                >
                                    Back
                                </button>
                            )}
                            <button
                                onClick={() => onNavigate('landing')}
                                className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.2em] border border-slate-200 text-slate-600 hover:border-slate-300 transition"
                            >
                                Home
                            </button>
                        </div>
                    </div>
                    {children}
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
            <div className={'grid ' + cardGridGapClass + ' sm:grid-cols-2 lg:grid-cols-3'}>
                {topics.map((topic) => (
                    <button
                        key={topic.id}
                        onClick={() => onSelectTopic(topic)}
                        className="w-full border border-slate-200 rounded-2xl p-5 text-left hover:border-slate-300 hover:bg-slate-50 transition font-bangla"
                    >
                        <div className="text-xs uppercase tracking-[0.2em] text-slate-400">টপিক</div>
                        <div className="text-lg font-semibold text-slate-900 mt-2">{topic.name}</div>
                        <p className="text-sm text-slate-500 mt-2">নোট, CQ এবং MCQ দেখুন</p>
                    </button>
                ))}
                {topics.length === 0 && (
                    <div className="border border-dashed border-slate-200 rounded-2xl p-6 text-sm text-slate-400 font-bangla">
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
            onNavigate
        }) => {
            const notes = (notesByItem || {})[noteKey] || [];
            const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            const toBanglaNumber = (value) => String(value)
                .split('')
                .map((digit) => banglaDigits[Number(digit)] ?? digit)
                .join('');
            const [activeTab, setActiveTab] = useState('notes');
            const cqSections = [
                {
                    key: 'gyan',
                    label: 'জ্ঞান (ক)',
                    items: cqQuestions?.gyan || [],
                    prefix: (index) => toBanglaNumber(index + 1)
                },
                {
                    key: 'onudhabon',
                    label: 'অনুধাবন (খ)',
                    items: cqQuestions?.onudhabon || [],
                    prefix: (index) => toBanglaNumber(index + 1)
                }
            ];

            return (
                <PublicScienceShell
                    subjectLabel={subjectLabel}
                    classLabel={classLabel}
                    title={topicName || 'টপিক নির্বাচন করুন'}
                    subtitle={chapterName ? 'অধ্যায়: ' + chapterName : ''}
                    onBack={onBack}
                    onNavigate={onNavigate}
                >
                    <div className="space-y-6 font-bangla">
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
                            <div className="border-b border-slate-100 px-4 pt-4">
                                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Learning tabs</div>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {[
                                        { key: 'notes', label: 'Read (Notes)' },
                                        { key: 'cq', label: 'Practice (CQ)' },
                                        { key: 'mcq', label: 'Test (MCQ)' }
                                    ].map((tab) => (
                                        <button
                                            key={tab.key}
                                            onClick={() => setActiveTab(tab.key)}
                                            className={
                                                'px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.2em] border transition ' +
                                                (activeTab === tab.key
                                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                                    : 'border-slate-200 text-slate-500 hover:border-slate-300')
                                            }
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="px-4 py-5">
                                {activeTab === 'notes' && (
                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">নোটস</div>
                                            <div className="text-sm font-semibold text-slate-700 mt-1">টপিকের মূল ধারণা</div>
                                        </div>
                                        <ul className="divide-y border border-slate-100 rounded-xl">
                                            {notes.length === 0 && (
                                                <li className="px-4 py-3 text-sm text-slate-400">এখনো কোন নোট যোগ করা হয়নি।</li>
                                            )}
                                            {notes.map((note, index) => (
                                                <li key={noteKey + '-' + index} className="px-4 py-3 flex items-start gap-3">
                                                    <span className="text-sm font-semibold text-slate-500">
                                                        {toBanglaNumber(index + 1)}.
                                                    </span>
                                                    <div className="text-sm text-slate-700">{note}</div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {activeTab === 'cq' && (
                                    <CqQuestionList sections={cqSections} />
                                )}
                                {activeTab === 'mcq' && (
                                    <PublicMcqList mcqList={mcqList} />
                                )}
                            </div>
                        </div>
                    </div>
                </PublicScienceShell>
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
                                <div key={type.key} className="border border-slate-200 rounded-2xl bg-white p-5 shadow-sm">
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

        const PublicEnglishShell = ({ title, subtitle, onBack, onNavigate, children }) => (
            <div className="flex-1 bg-[#eef2ff]">
                <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-8 space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">English 1st Paper</div>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-2">{title}</h2>
                            {subtitle && <p className="text-sm text-slate-500 mt-2">{subtitle}</p>}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {onBack && (
                                <button
                                    onClick={onBack}
                                    className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.2em] border border-slate-200 text-slate-600 hover:border-slate-300 transition"
                                >
                                    Back
                                </button>
                            )}
                            <button
                                onClick={() => onNavigate('landing')}
                                className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.2em] border border-slate-200 text-slate-600 hover:border-slate-300 transition"
                            >
                                Home
                            </button>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        );

        const PublicEnglishCardGrid = ({ items, onNavigate }) => (
            <div className={'grid ' + cardGridGapClass + ' sm:grid-cols-2'}>
                {items.map((item) => (
                    <button
                        key={item.key}
                        onClick={() => item.route && onNavigate(item.route)}
                        className="w-full border border-slate-200 rounded-2xl p-5 text-left hover:border-slate-300 hover:bg-slate-50 transition"
                    >
                        <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Section</div>
                        <div className="text-lg font-semibold text-slate-900 mt-2">{item.title}</div>
                        <p className="text-sm text-slate-500 mt-2">{item.description}</p>
                    </button>
                ))}
            </div>
        );

        const PublicEnglishTypeList = ({ items, onSelect }) => (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm divide-y">
                {items.map((item) => (
                    <button
                        key={item.key}
                        onClick={() => onSelect(item)}
                        className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
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
                    <div className="px-5 py-4 text-sm text-slate-400">No question types available yet.</div>
                )}
            </div>
        );

        const PublicEnglishQuestionList = ({ questions }) => (
            <div className="space-y-4">
                {questions.length === 0 && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 text-sm text-slate-400">
                        No questions have been added yet.
                    </div>
                )}
                {questions.map((entry, index) => (
                    <div key={index} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
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

            useEffect(() => {
                const timer = setInterval(() => {
                    setQuoteIndex((prev) => (prev + 1) % quoteItems.length);
                }, 9000);
                return () => clearInterval(timer);
            }, []);

            const activeQuote = quoteItems[quoteIndex];
            const continueLabel = recentRead?.label;
            const continueRoute = recentRead?.route;

            const handleQuickSearch = () => {
                const normalized = quickQuery.trim().toLowerCase();
                if (!normalized) return;
                const candidates = [...sscSubjects, ...hscSubjects];
                const match = candidates.find((subject) => {
                    const title = subject.title.toLowerCase();
                    const subtitle = subject.subtitle?.toLowerCase() || '';
                    return title.includes(normalized) || subtitle.includes(normalized);
                });
                if (match?.route) {
                    onNavigate(match.route);
                }
            };

            return (
                <div className="flex-1 bg-[#f3f6ff]">
                    <section className="relative overflow-hidden bg-indigo-700">
                        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-indigo-600/60"></div>
                        <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-amber-400/40"></div>
                        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-14 relative">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-white/90 border border-white/60 flex items-center justify-center shadow-lg">
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
                                <div className="max-w-xl bg-indigo-600 border border-indigo-500 rounded-2xl p-6 text-white">
                                    <p className="text-base sm:text-lg font-serif italic leading-relaxed">
                                        “{activeQuote.text}”
                                    </p>
                                    <p className="text-sm font-semibold text-white/90 mt-3">— {activeQuote.author}</p>
                                </div>
                            </div>
                            <div className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-center">
                                <div className="relative">
                                    <label className="text-[11px] uppercase tracking-[0.3em] text-white/70">Quick Search</label>
                                    <input
                                        value={quickQuery}
                                        onChange={(event) => setQuickQuery(event.target.value)}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter') handleQuickSearch();
                                        }}
                                        placeholder="Search Bangla, Physics, ICT..."
                                        className="mt-2 w-full rounded-2xl border border-white/30 bg-white/95 py-2.5 pl-11 pr-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-white"
                                    />
                                    <i className="fa-solid fa-magnifying-glass absolute left-4 top-[calc(50%+12px)] -translate-y-1/2 text-slate-400"></i>
                                </div>
                                <button
                                    onClick={handleQuickSearch}
                                    className="mt-6 lg:mt-7 inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700 shadow-sm transition hover:bg-indigo-50"
                                >
                                    Find subject
                                    <i className="fa-solid fa-arrow-right"></i>
                                </button>
                            </div>
                            {continueLabel && continueRoute && (
                                <div className="mt-6">
                                    <button
                                        onClick={() => onNavigate(continueRoute)}
                                        className="w-full sm:w-auto inline-flex items-center gap-3 rounded-2xl bg-emerald-400/90 text-emerald-950 px-5 py-3 text-sm font-semibold shadow-sm hover:bg-emerald-300 transition"
                                    >
                                        <i className="fa-solid fa-play"></i>
                                        Continue Reading: {continueLabel}
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-10 space-y-6 bg-white">
                        <div>
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
