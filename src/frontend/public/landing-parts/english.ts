export const landingEnglish = `
        const PublicEnglishShell = ({ title, subtitle, onBack, onNavigate, children }) => (
            // Reusing the upgraded PublicSimpleShell for consistency
            <PublicSimpleShell 
                title={title} 
                subtitle={subtitle} 
                onBack={onBack} 
                onNavigate={onNavigate} 
                backgroundClass="bg-slate-50"
            >
                 <div className="mb-6 flex justify-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-blue-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-blue-600 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        English 1st Paper
                    </div>
                </div>
                {children}
            </PublicSimpleShell>
        );

        const PublicEnglishCardGrid = ({ items, onNavigate }) => (
            <ArtPanelGrid className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                {items.map((item) => (
                    <button 
                        key={item.key} 
                        onClick={() => item.route && onNavigate(item.route)} 
                        className="text-left transition-all duration-300 group w-full"
                    >
                        <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-slate-100 bg-white hover:shadow-xl hover:shadow-indigo-100/50 hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col items-center justify-center text-center">
                            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <i className="fa-solid fa-book-open text-lg"></i>
                            </div>
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">Section</div>
                            <div className="text-lg font-bold text-slate-900 font-serif mb-2">{item.title}</div>
                            <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
                            
                            {/* Decorative Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-indigo-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        </div>
                    </button>
                ))}
            </ArtPanelGrid>
        );

        const PublicEnglishTypeList = ({ items, onSelect }) => (
            <div className="grid gap-4 sm:grid-cols-2">
                {items.map((item) => (
                    <button key={item.key} onClick={() => onSelect(item)} className="relative w-full bg-white border border-slate-200 rounded-2xl p-6 text-left hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-50/50 hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-xs uppercase tracking-[0.2em] text-slate-400 font-bold">Question Type</div>
                                <i className="fa-solid fa-arrow-right text-indigo-300 group-hover:text-indigo-600 transition-colors"></i>
                            </div>
                            <div className="text-lg font-bold text-slate-900 font-serif mb-1 group-hover:text-indigo-700 transition-colors">{item.label}</div>
                            {item.description && <p className="text-sm text-slate-500">{item.description}</p>}
                            {item.children?.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-1">
                                    {item.children.map((child) => (
                                        <span key={child.key} className="inline-block px-2 py-0.5 bg-slate-50 text-slate-500 text-[10px] rounded border border-slate-100">{child.label}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                         {/* Decorative BG */}
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-indigo-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
                    </button>
                ))}
                {items.length === 0 && <div className="col-span-full py-12 text-center text-slate-400 italic">No question types available yet.</div>}
            </div>
        );

        const PublicEnglishQuestionList = ({ questions }) => (
            <div className="space-y-6 text-left">
                {questions.length === 0 && <div className="text-center py-12 text-slate-400 italic">No questions have been added yet.</div>}
                {questions.map((entry, index) => (
                    <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:border-indigo-200 transition-colors">
                        <div className="flex gap-3 mb-4">
                            <span className="flex-none w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm flex items-center justify-center">
                                Q{index + 1}
                            </span>
                            <div className="text-base font-semibold text-slate-800 pt-1">{entry.question}</div>
                        </div>
                        <div className="pl-11">
                            <div className="text-sm text-slate-600 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/50">
                                <span className="font-bold text-emerald-700 block mb-1 uppercase tracking-wide text-[10px]">Answer</span>
                                {entry.answer}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
`;
