export const landingEnglish = `
        const PublicEnglishShell = ({ title, subtitle, onBack, onNavigate, children }) => (
            <div className="flex-1 bg-[#eef2ff]">
                <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-8 space-y-5">
                    <div className="grid grid-cols-[auto,1fr,auto] items-center gap-4 border-b border-slate-200 pb-4">
                        {onBack ? <button onClick={onBack} className="w-10 h-10 rounded-md border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800 transition flex items-center justify-center" aria-label="Go back"><i className="fa-solid fa-arrow-left"></i></button> : <div className="w-10 h-10" />}
                        <div className="text-center">
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">English 1st Paper</div>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-2">{title}</h2>
                            {subtitle && <p className="text-sm text-slate-500 mt-2">{subtitle}</p>}
                        </div>
                        <button onClick={() => onNavigate('landing')} className="px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-[0.2em] border border-slate-200 text-slate-600 hover:border-slate-300 transition justify-self-end">Home</button>
                    </div>
                    <div className="lg:flex lg:gap-8">
                        <PublicSidebar title={title} subtitle={subtitle} onBack={onBack} onNavigate={onNavigate} />
                        <div className="flex-1">{children}</div>
                    </div>
                </div>
            </div>
        );

        const PublicEnglishCardGrid = ({ items, onNavigate }) => (
            <div className={'grid justify-items-center ' + cardGridGapClass + ' sm:grid-cols-2'}>
                {items.map((item) => (
                    <button key={item.key} onClick={() => item.route && onNavigate(item.route)} className="w-full border border-slate-200 rounded-md p-4 text-center hover:border-slate-300 hover:bg-slate-50 transition">
                        <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Section</div>
                        <div className="text-lg font-semibold text-slate-900 mt-2">{item.title}</div>
                        <p className="text-sm text-slate-500 mt-2">{item.description}</p>
                    </button>
                ))}
            </div>
        );

        const PublicEnglishTypeList = ({ items, onSelect }) => (
            <div className="border-y border-slate-200 divide-y">
                {items.map((item) => (
                    <button key={item.key} onClick={() => onSelect(item)} className="w-full flex items-center justify-between px-2 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition text-left">
                        <div className="text-left space-y-1">
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Question type</div>
                            <div className="text-base font-semibold text-slate-900">{item.label}</div>
                            {item.description && <p className="text-xs text-slate-500">{item.description}</p>}
                            {item.children?.length > 0 && <p className="text-xs text-indigo-500">Includes {item.children.map((child) => child.label).join(', ')}</p>}
                        </div>
                        <span className="text-xs uppercase tracking-[0.2em] text-indigo-600">Open</span>
                    </button>
                ))}
                {items.length === 0 && <div className="px-2 py-4 text-sm text-slate-400">No question types available yet.</div>}
            </div>
        );

        const PublicEnglishQuestionList = ({ questions }) => (
            <div className="space-y-4 text-left">
                {questions.length === 0 && <div className="text-sm text-slate-400">No questions have been added yet.</div>}
                {questions.map((entry, index) => (
                    <div key={index} className={flatSectionClass + ' space-y-2'}>
                        <div className="text-sm font-semibold text-slate-900">Q{index + 1}. {entry.question}</div>
                        <div className="text-sm text-slate-600 border-l-2 border-slate-200 pl-3">Answer: {entry.answer}</div>
                    </div>
                ))}
            </div>
        );
`;
