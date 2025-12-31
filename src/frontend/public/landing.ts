export const landingComponents = `
        const StudentLanding = () => (
            <div className="flex-1">
                <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
                    <div className="flex flex-col gap-6 sm:gap-8">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Welcome to Freeducation</h1>
                            <p className="text-sm text-gray-500 mt-1">Student learning spaces for SSC and HSC.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col gap-4">
                                <div>
                                    <div className="text-sm uppercase tracking-[0.2em] text-gray-400">SSC</div>
                                    <div className="text-lg sm:text-xl font-semibold text-gray-900 mt-2">Secondary School</div>
                                    <p className="text-sm text-gray-500 mt-2">Access lessons, notes, and model questions.</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="px-4 py-2 rounded-lg text-sm font-semibold border border-blue-200 text-blue-700 hover:bg-blue-50 transition">
                                        Explore SSC
                                    </button>
                                    <button className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
                                        View Subjects
                                    </button>
                                </div>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col gap-4">
                                <div>
                                    <div className="text-sm uppercase tracking-[0.2em] text-gray-400">HSC</div>
                                    <div className="text-lg sm:text-xl font-semibold text-gray-900 mt-2">Higher Secondary</div>
                                    <p className="text-sm text-gray-500 mt-2">Find syllabus-aligned content and practice sets.</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="px-4 py-2 rounded-lg text-sm font-semibold border border-blue-200 text-blue-700 hover:bg-blue-50 transition">
                                        Explore HSC
                                    </button>
                                    <button className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
                                        View Subjects
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
`;
