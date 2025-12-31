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

        const sscSubjects = [
            {
                title: 'Bangla 1st Paper',
                subtitle: 'বাংলা ১ম পত্র',
                icon: 'fa-book-open',
                gradient: 'from-rose-500 via-red-500 to-orange-400',
                route: 'bangla-ssc-1st-paper'
            },
            {
                title: 'English 1st Paper',
                subtitle: 'ইংরেজি ১ম পত্র',
                icon: 'fa-language',
                gradient: 'from-sky-500 via-blue-500 to-indigo-500'
            },
            {
                title: 'Mathematics',
                subtitle: 'গণিত',
                icon: 'fa-calculator',
                gradient: 'from-emerald-500 via-teal-500 to-cyan-500'
            },
            {
                title: 'General Science',
                subtitle: 'সাধারণ বিজ্ঞান',
                icon: 'fa-flask',
                gradient: 'from-violet-500 via-purple-500 to-fuchsia-500'
            },
            {
                title: 'Bangladesh & Global Studies',
                subtitle: 'বাংলাদেশ ও বিশ্বপরিচয়',
                icon: 'fa-globe',
                gradient: 'from-amber-500 via-orange-500 to-rose-500'
            }
        ];

        const hscSubjects = [
            {
                title: 'Bangla 1st Paper',
                subtitle: 'বাংলা ১ম পত্র',
                icon: 'fa-book-open',
                gradient: 'from-blue-600 via-sky-500 to-teal-400',
                route: 'bangla-hsc-1st-paper'
            },
            {
                title: 'English 1st Paper',
                subtitle: 'ইংরেজি ১ম পত্র',
                icon: 'fa-pen-nib',
                gradient: 'from-slate-500 via-gray-500 to-zinc-400'
            },
            {
                title: 'ICT',
                subtitle: 'আইসিটি',
                icon: 'fa-laptop-code',
                gradient: 'from-cyan-500 via-sky-500 to-indigo-500'
            },
            {
                title: 'Statistics',
                subtitle: 'পরিসংখ্যান',
                icon: 'fa-chart-line',
                gradient: 'from-emerald-500 via-lime-500 to-yellow-400'
            },
            {
                title: 'Civics',
                subtitle: 'নাগরিকতা',
                icon: 'fa-landmark',
                gradient: 'from-rose-500 via-pink-500 to-amber-400'
            }
        ];

        const SubjectCard = ({ subject, onNavigate, className = '' }) => {
            const isActive = Boolean(subject.route);
            return (
                <button
                    onClick={() => isActive && onNavigate(subject.route)}
                    className={\`\${className} text-left transition-transform duration-200 hover:-translate-y-1 \${isActive ? '' : 'opacity-60 cursor-default'}\`}
                    disabled={!isActive}
                >
                    <div className={\`h-28 sm:h-32 rounded-2xl bg-gradient-to-br \${subject.gradient} flex items-center justify-center text-white shadow-lg\`}>
                        <i className={\`fa-solid \${subject.icon} text-3xl\`}></i>
                    </div>
                    <div className="mt-3">
                        <div className="text-sm font-semibold text-slate-900">{subject.title}</div>
                        <div className="text-xs text-slate-500 font-bangla">{subject.subtitle}</div>
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
                        All <i className="fa-solid fa-angle-right"></i>
                    </button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-3">
                    {subjects.map((subject) => (
                        <SubjectCard
                            key={subject.title}
                            subject={subject}
                            onNavigate={onNavigate}
                            className="flex-shrink-0 w-44 sm:w-52"
                        />
                    ))}
                </div>
            </section>
        );

        const SubjectIndexPage = ({ classLabel, subjects, onNavigate }) => (
            <div className="flex-1 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Academic</div>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-2">{classLabel} Subjects</h2>
                        </div>
                        <button
                            onClick={() => onNavigate('landing')}
                            className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
                        >
                            Back to Home
                        </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
                        {subjects.map((subject) => (
                            <div key={subject.title} className="flex flex-col gap-3">
                                <SubjectCard subject={subject} onNavigate={onNavigate} className="w-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );

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
                    <section className="bg-sky-100">
                        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-12">
                            <div className="glass-panel rounded-3xl px-6 sm:px-10 py-8 sm:py-10 shadow-xl">
                                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-white/80 flex items-center justify-center shadow-md">
                                            <svg viewBox="0 0 24 24" className="w-8 h-8 text-slate-900" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M3.5 9.5L12 5l8.5 4.5L12 14 3.5 9.5z" />
                                                <path d="M6.5 11.2V16c0 .7.4 1.4 1.1 1.7C9 18.4 10.4 19 12 19s3-.6 4.4-1.3c.7-.3 1.1-1 1.1-1.7v-4.8" />
                                                <path d="M20.5 9.7V14" />
                                                <path d="M21.5 14h-2" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-3xl sm:text-4xl font-semibold text-slate-900">Freeducation</div>
                                            <div className="text-sm text-slate-500 uppercase tracking-[0.2em] mt-1">Serve education with clarity</div>
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
                        </div>
                    </section>

                    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10 space-y-10">
                        <div>
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Academic</div>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-2">Academic</h2>
                        </div>
                        <SubjectRow
                            title="SSC"
                            subjects={sscSubjects}
                            onNavigate={onNavigate}
                            onAll={() => onNavigate('ssc-subjects')}
                        />
                        <SubjectRow
                            title="HSC"
                            subjects={hscSubjects}
                            onNavigate={onNavigate}
                            onAll={() => onNavigate('hsc-subjects')}
                        />
                    </section>
                </div>
            );
        };
`;
