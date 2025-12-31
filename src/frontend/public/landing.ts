export const landingComponents = `
        const StudentLanding = () => (
            <div className="flex-1">
                <section className="bg-gradient-to-b from-white via-slate-50 to-slate-100 border-b border-slate-200">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
                        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
                            <div className="space-y-5">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-[0.2em]">
                                    Smooth learning for every student
                                </div>
                                <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 leading-tight">
                                    Find your subject instantly and learn with confidence.
                                </h1>
                                <p className="text-sm sm:text-base text-slate-600 max-w-xl">
                                    Freeducation keeps every subject simple to read, easy to browse, and beautifully organized for SSC and HSC learners.
                                    Jump right into Bangla, English, Math, and more with color-rich guides and clear navigation.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <button className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition">
                                        Start Learning
                                    </button>
                                    <button className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-600 hover:bg-white transition">
                                        Browse Subjects
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                        Simple reading flow
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                                        Instant subject access
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                                        Cultural design cues
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xl space-y-4">
                                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-[0.2em]">
                                    <span>Learning paths</span>
                                    <span className="text-blue-600">Updated weekly</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="rounded-2xl border border-slate-200 p-4 bg-gradient-to-br from-emerald-50 via-white to-emerald-100">
                                        <div className="text-xs font-semibold text-emerald-600 uppercase tracking-[0.2em]">SSC</div>
                                        <div className="text-lg font-semibold text-slate-900 mt-2">Secondary School</div>
                                        <p className="text-sm text-slate-600 mt-2">Lessons, notes, and model questions.</p>
                                    </div>
                                    <div className="rounded-2xl border border-slate-200 p-4 bg-gradient-to-br from-blue-50 via-white to-indigo-100">
                                        <div className="text-xs font-semibold text-blue-600 uppercase tracking-[0.2em]">HSC</div>
                                        <div className="text-lg font-semibold text-slate-900 mt-2">Higher Secondary</div>
                                        <p className="text-sm text-slate-600 mt-2">Syllabus-aligned content and practice sets.</p>
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                                    Choose a path to unlock curated chapters, quizzes, and revision tools.
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-12">
                    <div className="flex flex-col gap-6 sm:gap-8">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">Browse by subject — color-coded and easy.</h2>
                            <p className="text-sm text-slate-500 max-w-2xl">
                                Every subject has its own cultural feel and visual guidance so students can find what they need quickly.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            <div className="rounded-3xl border border-rose-200 bg-gradient-to-br from-rose-50 via-amber-50 to-emerald-50 p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold text-rose-600 font-bangla">বাংলা</div>
                                    <span className="text-xs text-rose-500 uppercase tracking-[0.2em]">Bangla</span>
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mt-3">Bangladeshi cultural flow</h3>
                                <p className="text-sm text-slate-600 mt-2">
                                    Stories, poems, and heritage-focused explanations with a warm, traditional palette.
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2 text-xs text-rose-700">
                                    <span className="px-2 py-1 rounded-full bg-rose-100">Literature map</span>
                                    <span className="px-2 py-1 rounded-full bg-rose-100">Theme highlights</span>
                                    <span className="px-2 py-1 rounded-full bg-rose-100">Reading guides</span>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-50 p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold text-blue-600">English</div>
                                    <span className="text-xs text-blue-500 uppercase tracking-[0.2em]">Global</span>
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mt-3">English-rated clarity</h3>
                                <p className="text-sm text-slate-600 mt-2">
                                    Grammar, comprehension, and writing journeys with clean lines and easy references.
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2 text-xs text-blue-700">
                                    <span className="px-2 py-1 rounded-full bg-blue-100">Vocabulary builder</span>
                                    <span className="px-2 py-1 rounded-full bg-blue-100">Writing frames</span>
                                    <span className="px-2 py-1 rounded-full bg-blue-100">Reading cues</span>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-purple-50 to-slate-50 p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold text-indigo-600">Math</div>
                                    <span className="text-xs text-indigo-500 uppercase tracking-[0.2em]">Logic</span>
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mt-3">Math-wise patterns</h3>
                                <p className="text-sm text-slate-600 mt-2">
                                    Step-by-step problem solving with formula cards, shortcuts, and visual cues.
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2 text-xs text-indigo-700">
                                    <span className="px-2 py-1 rounded-full bg-indigo-100">Formula cards</span>
                                    <span className="px-2 py-1 rounded-full bg-indigo-100">Practice sets</span>
                                    <span className="px-2 py-1 rounded-full bg-indigo-100">Quick checks</span>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-50 p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold text-emerald-600">Science</div>
                                    <span className="text-xs text-emerald-500 uppercase tracking-[0.2em]">Discover</span>
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mt-3">Experiment-ready visuals</h3>
                                <p className="text-sm text-slate-600 mt-2">
                                    Concepts mapped with diagrams, lab notes, and revision summaries.
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2 text-xs text-emerald-700">
                                    <span className="px-2 py-1 rounded-full bg-emerald-100">Lab notes</span>
                                    <span className="px-2 py-1 rounded-full bg-emerald-100">Concept maps</span>
                                    <span className="px-2 py-1 rounded-full bg-emerald-100">Quick recap</span>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50 to-slate-50 p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold text-amber-600">ICT</div>
                                    <span className="text-xs text-amber-500 uppercase tracking-[0.2em]">Digital</span>
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mt-3">Tech-first learning</h3>
                                <p className="text-sm text-slate-600 mt-2">
                                    Coding basics, flowcharts, and modern tools explained with simple visuals.
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2 text-xs text-amber-700">
                                    <span className="px-2 py-1 rounded-full bg-amber-100">Flowcharts</span>
                                    <span className="px-2 py-1 rounded-full bg-amber-100">Short tutorials</span>
                                    <span className="px-2 py-1 rounded-full bg-amber-100">Practice labs</span>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold text-slate-700">Humanities</div>
                                    <span className="text-xs text-slate-500 uppercase tracking-[0.2em]">Culture</span>
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mt-3">Story-led subjects</h3>
                                <p className="text-sm text-slate-600 mt-2">
                                    History, civics, and geography with timelines, maps, and narrative guides.
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
                                    <span className="px-2 py-1 rounded-full bg-slate-100">Timeline cards</span>
                                    <span className="px-2 py-1 rounded-full bg-slate-100">Map visuals</span>
                                    <span className="px-2 py-1 rounded-full bg-slate-100">Key facts</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-white border-t border-slate-200">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-12">
                        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
                            <div className="space-y-4">
                                <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">A buttery-smooth learning journey.</h2>
                                <p className="text-sm text-slate-500">
                                    Every page is designed for quick reading and less scrolling. Students can see summaries, steps, and practice tools at a glance.
                                </p>
                                <div className="space-y-3">
                                    <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
                                        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Step 1</div>
                                        <div className="text-sm font-semibold text-slate-900 mt-2">Pick subject + chapter</div>
                                        <p className="text-xs text-slate-500 mt-1">Quick filters show chapters, topics, and difficulty levels.</p>
                                    </div>
                                    <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
                                        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Step 2</div>
                                        <div className="text-sm font-semibold text-slate-900 mt-2">Read the visual summary</div>
                                        <p className="text-xs text-slate-500 mt-1">Short notes, highlights, and examples guide the focus.</p>
                                    </div>
                                    <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
                                        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Step 3</div>
                                        <div className="text-sm font-semibold text-slate-900 mt-2">Practice immediately</div>
                                        <p className="text-xs text-slate-500 mt-1">MCQs, creative questions, and revision sheets are ready.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-3xl border border-slate-200 p-6 bg-gradient-to-br from-slate-50 via-white to-blue-50 shadow-sm">
                                <h3 className="text-lg font-semibold text-slate-900">Quick Access Panel</h3>
                                <p className="text-sm text-slate-500 mt-2">Find everything in two taps.</p>
                                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                    <div className="rounded-2xl bg-white border border-slate-200 p-4">
                                        <div className="font-semibold text-slate-900">Subject Index</div>
                                        <p className="text-xs text-slate-500 mt-1">Alphabetical and color-coded.</p>
                                    </div>
                                    <div className="rounded-2xl bg-white border border-slate-200 p-4">
                                        <div className="font-semibold text-slate-900">Smart Search</div>
                                        <p className="text-xs text-slate-500 mt-1">Type one word to jump in.</p>
                                    </div>
                                    <div className="rounded-2xl bg-white border border-slate-200 p-4">
                                        <div className="font-semibold text-slate-900">Daily Revision</div>
                                        <p className="text-xs text-slate-500 mt-1">Fresh practice every day.</p>
                                    </div>
                                    <div className="rounded-2xl bg-white border border-slate-200 p-4">
                                        <div className="font-semibold text-slate-900">Exam Ready</div>
                                        <p className="text-xs text-slate-500 mt-1">Model questions & MCQs.</p>
                                    </div>
                                </div>
                                <button className="mt-6 w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition">
                                    Explore the learning hub
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
`;
