export const landingComponents = `
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
            return Object.entries(groupMap).flatMap(([group, subjects]) =>
                subjects.map((subject) => {
                    const accent = accentPalette[paletteIndex % accentPalette.length];
                    paletteIndex += 1;
                    const isBanglaFirst = subject === 'Bangla 1st Paper';
                    return {
                        title: subject,
                        subtitle: isBanglaFirst ? 'বাংলা ১ম পত্র' : '',
                        icon: subjectIconMap[subject] || 'fa-book',
                        accent,
                        group,
                        route: isBanglaFirst
                            ? (classLabel === 'SSC' ? 'public-bangla-ssc-1st-paper' : 'public-bangla-hsc-1st-paper')
                            : ''
                    };
                })
            );
        };

        const sscSubjects = buildSubjectList('SSC');
        const hscSubjects = buildSubjectList('HSC');
        const sscFeaturedSubjects = sscSubjects.slice(0, 5);
        const hscFeaturedSubjects = hscSubjects.slice(0, 5);

        const SubjectCard = ({ subject, onNavigate, className = '', showGroup = false }) => {
            const isActive = Boolean(subject.route);
            return (
                <button
                    onClick={() => isActive && onNavigate(subject.route)}
                    className={
                        className +
                        ' text-left transition-all duration-200 border border-slate-200 rounded-xl p-4 hover:border-slate-300 hover:bg-slate-50 ' +
                        (isActive ? 'cursor-pointer' : 'opacity-60 cursor-default')
                    }
                    disabled={!isActive}
                >
                    <div className="flex items-start gap-4">
                        <div className={'h-11 w-11 rounded-xl ' + subject.accent + ' text-white flex items-center justify-center'}>
                            <i className={'fa-solid ' + subject.icon + ' text-lg'}></i>
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-semibold text-slate-900">{subject.title}</div>
                            {subject.subtitle && (
                                <div className="text-xs text-slate-500 font-bangla mt-1">{subject.subtitle}</div>
                            )}
                            {showGroup && (
                                <div className="mt-2 inline-flex items-center text-[11px] uppercase tracking-[0.2em] text-slate-400">
                                    {subject.group}
                                </div>
                            )}
                        </div>
                    </div>
                </button>
            );
        };

        const SubjectRow = ({ title, onAll, subjects, onNavigate }) => (
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-900">{title}</h3>
                    <button
                        onClick={onAll}
                        className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition flex items-center gap-2"
                    >
                        See all <i className="fa-solid fa-angle-right"></i>
                    </button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-3">
                    {subjects.map((subject) => (
                        <SubjectCard
                            key={subject.group + '-' + subject.title}
                            subject={subject}
                            onNavigate={onNavigate}
                            className="flex-shrink-0 w-56 sm:w-64"
                        />
                    ))}
                </div>
            </section>
        );

        const SubjectIndexPage = ({ classLabel, subjects, onNavigate }) => {
            const [activeGroup, setActiveGroup] = useState('All');
            const [query, setQuery] = useState('');
            const normalizedQuery = query.trim().toLowerCase();
            const groups = ['All', ...new Set(subjects.map((subject) => subject.group))];
            const filteredSubjects = subjects.filter((subject) => {
                const matchesGroup = activeGroup === 'All' || subject.group === activeGroup;
                const matchesQuery =
                    !normalizedQuery ||
                    subject.title.toLowerCase().includes(normalizedQuery) ||
                    subject.subtitle.toLowerCase().includes(normalizedQuery);
                return matchesGroup && matchesQuery;
            });

            return (
                <div className="flex-1 bg-white">
                    <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-10">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div>
                                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Academic</div>
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
                        <div className="mt-8 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                            <div className="flex flex-wrap gap-2">
                                {groups.map((group) => (
                                    <button
                                        key={group}
                                        onClick={() => setActiveGroup(group)}
                                        className={
                                            'px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.2em] border transition ' +
                                            (activeGroup === group
                                                ? 'border-slate-900 text-slate-900'
                                                : 'border-slate-200 text-slate-500 hover:border-slate-300')
                                        }
                                    >
                                        {group}
                                    </button>
                                ))}
                            </div>
                            <div className="relative w-full lg:max-w-sm">
                                <input
                                    value={query}
                                    onChange={(event) => setQuery(event.target.value)}
                                    placeholder="Search subjects"
                                    className="w-full border border-slate-200 rounded-full py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                                />
                                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                            </div>
                        </div>
                        <div className="mt-8 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
                            <span>Showing</span>
                            <span>{filteredSubjects.length} subjects</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
                            {filteredSubjects.map((subject) => (
                                <SubjectCard
                                    key={subject.group + '-' + subject.title}
                                    subject={subject}
                                    onNavigate={onNavigate}
                                    className="w-full"
                                    showGroup
                                />
                            ))}
                        </div>
                    </div>
                </div>
            );
        };

        const PublicBanglaShell = ({ title, subtitle, onBack, onNavigate, children }) => (
            <div className="flex-1 bg-white">
                <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-10 space-y-6">
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
            <div className="grid gap-4 sm:grid-cols-2">
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
            const srijonshilTypes = [
                { key: 'gyan', label: 'জ্ঞান (ক)' },
                { key: 'onudhabon', label: 'অনুধাবন (খ)' }
            ];
            const mcqList = mcqQuestions[getQuestionKey(classLabel, categoryName, itemName, 'mcq')] || [];

            return (
                <PublicBanglaShell
                    title={itemName || 'পাঠ নির্বাচন করুন'}
                    subtitle={categoryName ? 'বিভাগ: ' + categoryName : ''}
                    onBack={() => onNavigate(categoryRoute)}
                    onNavigate={onNavigate}
                >
                    <section className="space-y-4 font-bangla">
                        <div className="border border-slate-200 rounded-xl p-5">
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">সৃজনশীল প্রশ্ন</div>
                            <div className="text-lg font-semibold text-slate-900 mt-2">প্রশ্ন ও উত্তর</div>
                            <p className="text-sm text-slate-500 mt-2">উপস্থাপিত প্রশ্নসমূহ ও উত্তরগুলো পড়ুন।</p>
                        </div>
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

                    <section className="space-y-4 font-bangla">
                        <div className="border border-slate-200 rounded-xl p-5">
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">বহুনির্বাচনী</div>
                            <div className="text-lg font-semibold text-slate-900 mt-2">MCQ প্রশ্ন</div>
                            <p className="text-sm text-slate-500 mt-2">প্রশ্ন, অপশন এবং সঠিক উত্তর দেখুন।</p>
                        </div>
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

            useEffect(() => {
                const timer = setInterval(() => {
                    setQuoteIndex((prev) => (prev + 1) % quoteItems.length);
                }, 6500);
                return () => clearInterval(timer);
            }, []);

            const activeQuote = quoteItems[quoteIndex];

            return (
                <div className="flex-1 bg-white">
                    <section className="bg-slate-50">
                        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-12">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center">
                                        <svg viewBox="0 0 24 24" className="w-8 h-8 text-slate-900" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3.5 9.5L12 5l8.5 4.5L12 14 3.5 9.5z" />
                                            <path d="M6.5 11.2V16c0 .7.4 1.4 1.1 1.7C9 18.4 10.4 19 12 19s3-.6 4.4-1.3c.7-.3 1.1-1 1.1-1.7v-4.8" />
                                            <path d="M20.5 9.7V14" />
                                            <path d="M21.5 14h-2" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-3xl sm:text-4xl font-semibold text-slate-900">Freeducation</div>
                                        <div className="text-sm text-slate-500 uppercase tracking-[0.2em] mt-1">
                                            Serve education with clarity
                                        </div>
                                    </div>
                                </div>
                                <div className="max-w-xl text-slate-700">
                                    <p className="text-base sm:text-lg font-serif italic leading-relaxed">
                                        “{activeQuote.text}”
                                    </p>
                                    <p className="text-sm font-semibold text-slate-600 mt-3">— {activeQuote.author}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-10 space-y-10">
                        <div>
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Academic</div>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-2">Academic</h2>
                        </div>
                        <SubjectRow
                            title="SSC"
                            subjects={sscFeaturedSubjects}
                            onNavigate={onNavigate}
                            onAll={() => onNavigate('ssc-subjects')}
                        />
                        <SubjectRow
                            title="HSC"
                            subjects={hscFeaturedSubjects}
                            onNavigate={onNavigate}
                            onAll={() => onNavigate('hsc-subjects')}
                        />
                    </section>
                </div>
            );
        };
`;
