export const PublicBanglaShell =`
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

`;
