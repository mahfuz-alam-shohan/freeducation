export const PublicSimpleShell =`
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


`;
