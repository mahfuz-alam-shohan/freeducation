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
        const makeThumbnailKey = (subject, classLabel) =>
            (classLabel + '-' + subject)
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        const makeChapterThumbnailKey = (classLabel, subjectLabel, chapterKey) =>
            (classLabel + '-' + subjectLabel + '-' + chapterKey)
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');

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
                    const isSscPhysics = subject === 'Physics' && classLabel === 'SSC';
                    const isSscChemistry = subject === 'Chemistry' && classLabel === 'SSC';
                    const isSscBiology = subject === 'Biology' && classLabel === 'SSC';
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
                                    : isSscPhysics
                                        ? 'public-ssc-physics'
                                        : isSscChemistry
                                            ? 'public-ssc-chemistry'
                                            : isSscBiology
                                                ? 'public-ssc-biology'
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

        const useSubjectThumbnails = () => {
            const [thumbnailMap, setThumbnailMap] = useState({});

            useEffect(() => {
                let isActive = true;
                const loadThumbnails = async () => {
                    try {
                        const response = await fetch('/api/thumbnails');
                        if (!response.ok) return;
                        const data = await response.json();
                        if (!isActive) return;
                        const map = (data.thumbnails || []).reduce((acc, item) => {
                            acc[item.subjectKey] = {
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

        const useChapterThumbnails = () => {
            const [thumbnailMap, setThumbnailMap] = useState({});

            useEffect(() => {
                let isActive = true;
                const loadThumbnails = async () => {
                    try {
                        const response = await fetch('/api/chapter-thumbnails');
                        if (!response.ok) return;
                        const data = await response.json();
                        if (!isActive) return;
                        const map = (data.thumbnails || []).reduce((acc, item) => {
                            acc[item.chapterKey] = {
                                url: item.url
                            };
                            return acc;
                        }, {});
                        setThumbnailMap(map);
                    } catch (error) {
                        console.warn('Failed to load chapter thumbnails', error);
                    }
                };
                loadThumbnails();
                return () => {
                    isActive = false;
                };
            }, []);

            return thumbnailMap;
        };

        const cardWidthClass = 'w-40 sm:w-48 md:w-52';

        const SubjectCard = ({ subject, onNavigate, className = '', showGroup = false }) => {
            const isActive = Boolean(subject.route);
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
                    <div className="space-y-2 h-full">
                        <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm group-hover:-translate-y-1 group-hover:shadow-md transition">
                            {subject.thumbnailUrl ? (
                                <img
                                    src={subject.thumbnailUrl}
                                    alt={subject.title + ' thumbnail'}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-300"
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-3">
                                    <div
                                        className={
                                            'h-10 w-10 rounded-lg text-white flex items-center justify-center shadow-sm ' +
                                            subject.accent
                                        }
                                    >
                                        <i className={'fa-solid ' + subject.icon + ' text-sm'}></i>
                                    </div>
                                    <div className="text-[9px] uppercase tracking-[0.3em]">Thumbnail</div>
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="text-xs sm:text-sm font-semibold text-slate-900">{subject.title}</div>
                            {subject.subtitle && <div className="text-xs text-slate-500 font-bangla mt-1">{subject.subtitle}</div>}
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

        const ChapterCard = ({ title, subtitle, thumbnailUrl, onClick, className = '' }) => (
            <button
                onClick={onClick}
                className={className + ' block text-left transition-all duration-300 group'}
            >
                <div className="space-y-2 h-full">
                    <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm group-hover:-translate-y-1 group-hover:shadow-md transition">
                        {thumbnailUrl ? (
                            <img
                                src={thumbnailUrl}
                                alt={title + ' thumbnail'}
                                loading="lazy"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 text-[9px] uppercase tracking-[0.3em]">
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

        const SubjectRow = ({ title, onAll, subjects, onNavigate, thumbnailMap }) => (
            <section className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-900">{title}</h3>
                    <button
                        onClick={onAll}
                        className="text-xs font-semibold uppercase tracking-[0.2em] text-white bg-slate-900 px-3 py-1.5 rounded-full transition hover:bg-slate-800 flex items-center gap-2"
                    >
                        See all <i className="fa-solid fa-angle-right"></i>
                    </button>
                </div>
                <div className="flex items-stretch gap-2 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory">
                    {subjects.map((subject) => {
                        const thumbnail = thumbnailMap[subject.subjectKey];
                        return (
                            <SubjectCard
                                key={subject.subjectKey}
                                subject={{
                                    ...subject,
                                    thumbnailUrl: thumbnail?.url
                                }}
                                onNavigate={onNavigate}
                                className={'flex-shrink-0 ' + cardWidthClass + ' snap-start'}
                            />
                        );
                    })}
                </div>
            </section>
        );

        const SubjectIndexPage = ({ classLabel, subjects, onNavigate }) => {
            const [activeGroup, setActiveGroup] = useState('All');
            const [query, setQuery] = useState('');
            const thumbnailMap = useSubjectThumbnails();
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
                <div className="flex-1 bg-gradient-to-br from-white via-sky-50 to-indigo-50">
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
                                    className="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
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
                                    className="mt-2 w-full border border-slate-200 rounded-lg py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                                />
                                <i className="fa-solid fa-magnifying-glass absolute left-4 top-[calc(50%+12px)] -translate-y-1/2 text-slate-400"></i>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
                            <span>Showing</span>
                            <span>{filteredSubjects.length} subjects</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 mt-4 justify-items-start">
                            {filteredSubjects.map((subject) => {
                                const thumbnail = thumbnailMap[subject.subjectKey];
                                return (
                                    <SubjectCard
                                        key={subject.subjectKey}
                                        subject={{
                                            ...subject,
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
            <div className="flex-1 bg-gradient-to-br from-white via-rose-50 to-amber-50">
                <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-8 space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Bangla 1st Paper</div>
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

        const PublicBanglaTopicGrid = ({ classLabel, subjectLabel, topics, onNavigate }) => {
            const chapterThumbnails = useChapterThumbnails();

            return (
                <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 font-bangla justify-items-start">
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
                                onClick={() => topic.route && onNavigate(topic.route)}
                                className={cardWidthClass}
                            />
                        );
                    })}
                </div>
            );
        };

        const PublicBanglaTextList = ({ classLabel, subjectLabel, categoryLabel, subtitle, items, onSelectItem }) => {
            const chapterThumbnails = useChapterThumbnails();

            return (
                <div className="space-y-4 font-bangla">
                    {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
                    <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 justify-items-start">
                        {items.length === 0 && (
                            <div className="text-sm text-slate-400">এই অংশে এখনও কোন পাঠ যোগ করা হয়নি।</div>
                        )}
                        {items.map((item) => {
                            const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, item + '-' + categoryLabel);
                            return (
                                <ChapterCard
                                    key={item}
                                    title={item}
                                    subtitle={categoryLabel}
                                    thumbnailUrl={chapterThumbnails[chapterKey]?.url}
                                    onClick={() => onSelectItem(item)}
                                    className={cardWidthClass}
                                />
                            );
                        })}
                    </div>
                </div>
            );
        };

        const PublicBanglaShohopathList = ({ classLabel, subjectLabel, items, onSelectItem }) => {
            const chapterThumbnails = useChapterThumbnails();

            return (
                <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 font-bangla justify-items-start">
                    {items.length === 0 && (
                        <div className="text-sm text-slate-400">এই অংশে এখনও কোন সহপাঠ যোগ করা হয়নি।</div>
                    )}
                    {items.map((item) => {
                        const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, (item.id || item.name) + '-সহপাঠ');
                        return (
                            <ChapterCard
                                key={item.id}
                                title={item.name}
                                subtitle={item.type}
                                thumbnailUrl={chapterThumbnails[chapterKey]?.url}
                                onClick={() => onSelectItem(item)}
                                className={cardWidthClass}
                            />
                        );
                    })}
                </div>
            );
        };

        const PublicBanglaItemDetail = ({
            classLabel,
            itemName,
            categoryName,
            notesByItem,
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
            const srijonshilRoute = classLabel === 'SSC' ? 'public-bangla-ssc-srijonshil' : 'public-bangla-hsc-srijonshil';
            const mcqRoute = classLabel === 'SSC' ? 'public-bangla-ssc-mcq' : 'public-bangla-hsc-mcq';
            const noteKey = [classLabel, categoryName || 'general', itemName || ''].join('-');
            const notes = (notesByItem || {})[noteKey] || [];
            const chapterTitle = itemName || 'পাঠ নির্বাচন করুন';

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

                        <div className="flex flex-wrap justify-center gap-3">
                            <button
                                onClick={() => onNavigate(srijonshilRoute)}
                                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border border-rose-100 bg-rose-50 text-rose-700 text-sm font-semibold hover:bg-rose-100 transition"
                            >
                                সৃজনশীল
                            </button>
                            <button
                                onClick={() => onNavigate(mcqRoute)}
                                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border border-amber-100 bg-amber-50 text-amber-700 text-sm font-semibold hover:bg-amber-100 transition"
                            >
                                বহুনির্বাচনী
                            </button>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
                            <div className="px-4 py-3 border-b border-slate-100">
                                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">নোটস</div>
                                <div className="text-sm font-semibold text-slate-700 mt-1">অধ্যায়ের গুরুত্বপূর্ণ নোট</div>
                            </div>
                            <ul className="divide-y">
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

        const PublicIctShell = ({ title, subtitle, onBack, onNavigate, children }) => (
            <div className="flex-1 bg-gradient-to-br from-white via-blue-50 to-amber-50">
                <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-8 space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">SSC ICT</div>
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

        const PublicIctChapterList = ({ chapters, onSelectChapter }) => {
            const chapterThumbnails = useChapterThumbnails();
            return (
                <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                    {chapters.map((chapter) => {
                        const chapterKey = makeChapterThumbnailKey('SSC', 'Information and Communication Technology', chapter.id);
                        return (
                            <ChapterCard
                                key={chapter.id}
                                title={chapter.name}
                                subtitle="ICT"
                                thumbnailUrl={chapterThumbnails[chapterKey]?.url}
                                onClick={() => onSelectChapter(chapter)}
                                className="w-full font-bangla"
                            />
                        );
                    })}
                    {chapters.length === 0 && (
                        <div className="border border-dashed border-slate-200 rounded-2xl p-6 text-sm text-slate-400 font-bangla">
                            এখনো কোনো অধ্যায় যোগ করা হয়নি।
                        </div>
                    )}
                </div>
            );
        };

        const PublicIctMcqDetail = ({ chapter, mcqQuestions, getQuestionKey, onBack, onNavigate }) => {
            const chapterKey = chapter?.id || '';
            const mcqList = mcqQuestions[getQuestionKey('SSC', 'ICT', chapterKey, 'mcq')] || [];
            const chapterTitle = chapter?.name || 'অধ্যায় নির্বাচন করুন';

            return (
                <PublicIctShell
                    title="আইসিটি বহুনির্বাচনী"
                    subtitle="অধ্যায় অনুযায়ী প্রশ্ন সমূহ"
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
            <div className="flex-1 bg-gradient-to-br from-white via-emerald-50 to-sky-50">
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

        const PublicScienceChapterList = ({ classLabel, subjectLabel, chapters, onSelectChapter }) => {
            const chapterThumbnails = useChapterThumbnails();
            return (
                <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                    {chapters.map((chapter) => {
                        const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, chapter.id);
                        return (
                            <ChapterCard
                                key={chapter.id}
                                title={chapter.name}
                                subtitle={subjectLabel}
                                thumbnailUrl={chapterThumbnails[chapterKey]?.url}
                                onClick={() => onSelectChapter(chapter)}
                                className="w-full font-bangla"
                            />
                        );
                    })}
                    {chapters.length === 0 && (
                        <div className="border border-dashed border-slate-200 rounded-2xl p-6 text-sm text-slate-400 font-bangla">
                            এখনো কোনো অধ্যায় যোগ করা হয়নি।
                        </div>
                    )}
                </div>
            );
        };

        const PublicScienceTopicList = ({ topics, onSelectTopic }) => (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {topics.map((topic) => (
                    <button
                        key={topic.id}
                        onClick={() => onSelectTopic(topic)}
                        className="border border-slate-200 rounded-2xl p-5 text-left hover:border-slate-300 hover:bg-slate-50 transition font-bangla"
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
            onBack,
            onNavigate,
            onNavigateCq,
            onNavigateMcq
        }) => {
            const notes = (notesByItem || {})[noteKey] || [];
            const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            const toBanglaNumber = (value) => String(value)
                .split('')
                .map((digit) => banglaDigits[Number(digit)] ?? digit)
                .join('');

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
                        <div className="flex flex-wrap justify-center gap-3">
                            <button
                                onClick={onNavigateCq}
                                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700 text-sm font-semibold hover:bg-emerald-100 transition"
                            >
                                সৃজনশীল (CQ)
                            </button>
                            <button
                                onClick={onNavigateMcq}
                                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border border-sky-100 bg-sky-50 text-sky-700 text-sm font-semibold hover:bg-sky-100 transition"
                            >
                                বহুনির্বাচনী (MCQ)
                            </button>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
                            <div className="px-4 py-3 border-b border-slate-100">
                                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">নোটস</div>
                                <div className="text-sm font-semibold text-slate-700 mt-1">টপিকের মূল ধারণা</div>
                            </div>
                            <ul className="divide-y">
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
            <div className="flex-1 bg-gradient-to-br from-white via-sky-50 to-indigo-50">
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
            <div className="grid gap-2 sm:grid-cols-2">
                {items.map((item) => (
                    <button
                        key={item.key}
                        onClick={() => item.route && onNavigate(item.route)}
                        className="border border-slate-200 rounded-2xl p-5 text-left hover:border-slate-300 hover:bg-slate-50 transition"
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
            const thumbnailMap = useSubjectThumbnails();

            useEffect(() => {
                const timer = setInterval(() => {
                    setQuoteIndex((prev) => (prev + 1) % quoteItems.length);
                }, 9000);
                return () => clearInterval(timer);
            }, []);

            const activeQuote = quoteItems[quoteIndex];

            return (
                <div className="flex-1 bg-white">
                    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-fuchsia-500 to-rose-500">
                        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/15 blur-3xl"></div>
                        <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-amber-300/30 blur-3xl"></div>
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
                                <div className="max-w-xl bg-white/15 border border-white/30 rounded-2xl p-6 text-white backdrop-blur">
                                    <p className="text-base sm:text-lg font-serif italic leading-relaxed">
                                        “{activeQuote.text}”
                                    </p>
                                    <p className="text-sm font-semibold text-white/90 mt-3">— {activeQuote.author}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-10 space-y-6 bg-gradient-to-br from-white via-indigo-50 to-rose-50">
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
                        />
                        <SubjectRow
                            title="HSC"
                            subjects={hscFeaturedSubjects}
                            onNavigate={onNavigate}
                            onAll={() => onNavigate('hsc-subjects')}
                            thumbnailMap={thumbnailMap}
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
            PublicEnglishShell,
            PublicEnglishCardGrid,
            PublicEnglishTypeList,
            PublicEnglishQuestionList,
            sscSubjects,
            hscSubjects
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
            PublicEnglishShell,
            PublicEnglishCardGrid,
            PublicEnglishTypeList,
            PublicEnglishQuestionList,
            sscSubjects,
            hscSubjects
        } = LandingModule;
`;
