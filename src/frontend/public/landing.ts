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
                                    Choose a subject to get started with SSC and HSC learning.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <button className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition">
                                        Start Learning
                                    </button>
                                    <button className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-600 hover:bg-white transition">
                                        Browse Subjects
                                    </button>
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
                                    </div>
                                    <div className="rounded-2xl border border-slate-200 p-4 bg-gradient-to-br from-blue-50 via-white to-indigo-100">
                                        <div className="text-xs font-semibold text-blue-600 uppercase tracking-[0.2em]">HSC</div>
                                        <div className="text-lg font-semibold text-slate-900 mt-2">Higher Secondary</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
`;
