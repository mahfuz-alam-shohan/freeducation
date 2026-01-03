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
                    subjectMap.set(subject, {
                        title: subject,
                        subtitle: isBanglaFirst ? 'বাংলা ১ম পত্র' : '',
                        icon: subjectIconMap[subject] || 'fa-book',
                        accent,
                        groups: new Set([group]),
                        subjectKey: makeThumbnailKey(subject, classLabel),
                        route: isBanglaFirst
                            ? (classLabel === 'SSC' ? 'public-bangla-ssc-1st-paper' : 'public-bangla-hsc-1st-paper')
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
                                url: item.url,
                                zoom: typeof item.zoom === 'number' ? item.zoom : 1
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

        const SubjectCard = ({ subject, onNavigate, className = '', showGroup = false }) => {
            const isActive = Boolean(subject.route);
            const zoom = typeof subject.thumbnailZoom === 'number' ? subject.thumbnailZoom : 1;
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
                                    className="w-full h-full object-contain transition-transform duration-300"
                                    style={{ transform: 'scale(' + zoom + ')' }}
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
                <div className="flex items-stretch gap-3 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory">
                    {subjects.map((subject) => {
                        const thumbnail = thumbnailMap[subject.subjectKey];
                        return (
                            <SubjectCard
                                key={subject.subjectKey}
                                subject={{
                                    ...subject,
                                    thumbnailUrl: thumbnail?.url,
                                    thumbnailZoom: thumbnail?.zoom
                                }}
                                onNavigate={onNavigate}
                                className="flex-shrink-0 w-40 sm:w-48 md:w-52 snap-start"
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
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mt-4">
                            {filteredSubjects.map((subject) => {
                                const thumbnail = thumbnailMap[subject.subjectKey];
                                return (
                                    <SubjectCard
                                        key={subject.subjectKey}
                                        subject={{
                                            ...subject,
                                            thumbnailUrl: thumbnail?.url,
                                            thumbnailZoom: thumbnail?.zoom
                                        }}
                                        onNavigate={onNavigate}
                                        className="w-full"
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

        const PublicBanglaTopicGrid = ({ topics, onNavigate }) => (
            <div className="grid gap-3 sm:grid-cols-2">
                {topics.map((topic) => (
                    <button
                        key={topic.title}
                        onClick={() => topic.route && onNavigate(topic.route)}
                        className="border border-slate-200 rounded-xl p-5 text-left hover:border-slate-300 hover:bg-slate-50 transition font-bangla"
                    >
                        <div className="text-xs uppercase tracking-[0.2em] text-slate-400">বিষয়</div>
                        <div className="text-lg font-semibold text-slate-900 mt-2">{topic.title}</div>
                        <p className="text-sm text-slate-500 mt-2">{topic.description}</p>
                    </button>
                ))}
            </div>
        );

        const PublicBanglaTextList = ({ title, subtitle, items, onSelectItem }) => (
            <div className="space-y-4 font-bangla">
                <div className="border border-slate-200 rounded-xl p-5">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400">পাঠ তালিকা</div>
                    <div className="text-lg font-semibold text-slate-900 mt-2">{title}</div>
                    {subtitle && <p className="text-sm text-slate-500 mt-2">{subtitle}</p>}
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {items.length === 0 && (
                        <div className="text-sm text-slate-400">এই অংশে এখনও কোন পাঠ যোগ করা হয়নি।</div>
                    )}
                    {items.map((item) => (
                        <button
                            key={item}
                            onClick={() => onSelectItem(item)}
                            className="border border-slate-200 rounded-xl p-4 text-left hover:border-slate-300 hover:bg-slate-50 transition"
                        >
                            <div className="text-sm font-semibold text-slate-900">{item}</div>
                        </button>
                    ))}
                </div>
            </div>
        );

        const PublicBanglaShohopathList = ({ items, onSelectItem }) => (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 font-bangla">
                {items.length === 0 && (
                    <div className="text-sm text-slate-400">এই অংশে এখনও কোন সহপাঠ যোগ করা হয়নি।</div>
                )}
                {items.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onSelectItem(item)}
                        className="border border-slate-200 rounded-xl p-4 text-left hover:border-slate-300 hover:bg-slate-50 transition"
                    >
                        <div className="text-sm font-semibold text-slate-900">{item.name}</div>
                        <div className="text-xs text-slate-500 mt-2">{item.type}</div>
                    </button>
                ))}
            </div>
        );

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

            const srijonshilRoute = classLabel === 'SSC'
                ? 'public-bangla-ssc-item-srijonshil'
                : 'public-bangla-hsc-item-srijonshil';
            const mcqRoute = classLabel === 'SSC'
                ? 'public-bangla-ssc-item-mcq'
                : 'public-bangla-hsc-item-mcq';
            const noteKey = [classLabel, categoryName || 'general', itemName || ''].join('-');
            const notes = (notesByItem || {})[noteKey] || [];
            const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            const toBanglaNumber = (value) => String(value)
                .split('')
                .map((digit) => banglaDigits[Number(digit)] ?? digit)
                .join('');

            return (
                <PublicBanglaShell
                    title={itemName || 'পাঠ নির্বাচন করুন'}
                    subtitle={categoryName ? 'বিভাগ: ' + categoryName : ''}
                    onBack={() => onNavigate(categoryRoute)}
                    onNavigate={onNavigate}
                >
                    <section className="space-y-6 font-bangla">
                        <div className="text-center">
                            <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900">{itemName || 'পাঠ নির্বাচন করুন'}</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                            <button
                                onClick={() => onNavigate(srijonshilRoute)}
                                className="aspect-square rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 text-sm font-semibold hover:bg-slate-100 transition"
                            >
                                সৃজনশীল
                            </button>
                            <button
                                onClick={() => onNavigate(mcqRoute)}
                                className="aspect-square rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 text-sm font-semibold hover:bg-slate-100 transition"
                            >
                                বহুনির্বাচনী
                            </button>
                        </div>

                        <div className="border border-slate-200 rounded-xl overflow-hidden">
                            <div className="px-4 py-3 border-b border-slate-100">
                                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">নোটস</div>
                                <div className="text-sm font-semibold text-slate-700 mt-1">গুরুত্বপূর্ণ লাইন</div>
                            </div>
                            <ul className="divide-y">
                                {notes.length === 0 && (
                                    <li className="px-4 py-3 text-sm text-slate-400">এখনো কোন নোট যুক্ত হয়নি।</li>
                                )}
                                {notes.map((note, index) => (
                                    <li key={`${noteKey}-${index}`} className="px-4 py-3 flex gap-3">
                                        <span className="text-sm font-semibold text-slate-500">
                                            {toBanglaNumber(index + 1)}.
                                        </span>
                                        <span className="text-sm text-slate-700">{note}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                </PublicBanglaShell>
            );
        };

        const PublicBanglaSrijonshilQuestions = ({
            classLabel,
            itemName,
            categoryName,
            srijonshilQuestions,
            getQuestionKey,
            onNavigate
        }) => {
            const itemRoute = classLabel === 'SSC' ? 'public-bangla-ssc-item' : 'public-bangla-hsc-item';
            const srijonshilTypes = [
                { key: 'gyan', label: 'জ্ঞান (ক)' },
                { key: 'onudhabon', label: 'অনুধাবন (খ)' }
            ];
            const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            const toBanglaNumber = (value) => String(value)
                .split('')
                .map((digit) => banglaDigits[Number(digit)] ?? digit)
                .join('');

            return (
                <PublicBanglaShell
                    title={itemName || 'সৃজনশীল প্রশ্ন'}
                    subtitle={categoryName ? `বিভাগ: ${categoryName}` : 'সৃজনশীল প্রশ্নসমূহ দেখুন'}
                    onBack={() => onNavigate(itemRoute)}
                    onNavigate={onNavigate}
                >
                    <section className="space-y-4 font-bangla">
                        {srijonshilTypes.map((type) => {
                            const list = srijonshilQuestions[getQuestionKey(classLabel, categoryName, itemName, type.key)] || [];
                            return (
                                <div key={type.key} className="border border-slate-200 rounded-xl p-5">
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
                    </section>
                </PublicBanglaShell>
            );
        };

        const PublicBanglaMcqQuestions = ({
            classLabel,
            itemName,
            categoryName,
            mcqQuestions,
            getQuestionKey,
            onNavigate
        }) => {
            const itemRoute = classLabel === 'SSC' ? 'public-bangla-ssc-item' : 'public-bangla-hsc-item';
            const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            const toBanglaNumber = (value) => String(value)
                .split('')
                .map((digit) => banglaDigits[Number(digit)] ?? digit)
                .join('');
            const mcqList = mcqQuestions[getQuestionKey(classLabel, categoryName, itemName, 'mcq')] || [];

            return (
                <PublicBanglaShell
                    title={itemName || 'বহুনির্বাচনী প্রশ্ন'}
                    subtitle={categoryName ? `বিভাগ: ${categoryName}` : 'MCQ প্রশ্নসমূহ দেখুন'}
                    onBack={() => onNavigate(itemRoute)}
                    onNavigate={onNavigate}
                >
                    <section className="space-y-4 font-bangla">
                        {mcqList.length === 0 ? (
                            <div className="text-sm text-slate-400">এখনো কোন MCQ প্রশ্ন যোগ করা হয়নি।</div>
                        ) : (
                            <div className="grid gap-4">
                                {mcqList.map((entry, index) => (
                                    <div key={entry.question + '-' + index} className="border border-slate-200 rounded-xl p-5">
                                        <div className="text-sm font-semibold text-slate-900">
                                            {toBanglaNumber(index + 1)}. {entry.question}
                                        </div>
                                        <div className="mt-3 grid gap-2">
                                            {(entry.options || []).map((option, optionIndex) => (
                                                <div
                                                    key={entry.question + '-' + optionIndex}
                                                    className={
                                                        'text-sm rounded-lg px-3 py-2 border ' +
                                                        (optionIndex === entry.answerIndex
                                                            ? 'border-emerald-200 text-emerald-700 bg-emerald-50'
                                                            : 'border-slate-200 text-slate-600')
                                                    }
                                                >
                                                    {option}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </PublicBanglaShell>
            );
        };

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
            sscSubjects,
            hscSubjects
        } = LandingModule;
`;
