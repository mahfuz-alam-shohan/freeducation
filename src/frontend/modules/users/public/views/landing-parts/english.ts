export const landingEnglish = `
        const PublicEnglishShell = ({ title, subtitle, onBack, onNavigate, children }) => (
            <PublicSimpleShell 
                title={title} 
                subtitle={subtitle} 
                onBack={onBack} 
                onNavigate={onNavigate} 
                backgroundClass="bg-slate-50"
                badge={
                    /* LEGACY UPDATE: Square Badge */
                     <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-blue-100 text-[10px] font-bold uppercase tracking-widest text-blue-600 shadow-sm">
                        <span className="w-1.5 h-1.5 bg-blue-500"></span>
                        English 1st Paper
                    </div>
                }
            >
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
                        {/* LEGACY UPDATE: rounded-none */}
                        <div className="relative w-full aspect-[3/4] rounded-none overflow-hidden border border-slate-100 bg-white hover:shadow-xl hover:border-indigo-200 hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col items-center justify-center text-center">
                            {/* LEGACY UPDATE: Square Icon Box */}
                            <div className="w-12 h-12 bg-indigo-50 text-indigo-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <i className="fa-solid fa-book-open text-lg"></i>
                            </div>
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">Section</div>
                            <div className="text-lg font-bold text-slate-900 font-serif mb-2">{item.title}</div>
                            <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-indigo-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        </div>
                    </button>
                ))}
            </ArtPanelGrid>
        );

        const PublicEnglishTypeList = ({ items, onSelect }) => (
            <div className="grid gap-4 sm:grid-cols-2 max-w-5xl mx-auto">
                {items.map((item) => (
                    // LEGACY UPDATE: rounded-none
                    <button key={item.key} onClick={() => onSelect(item)} className="relative w-full bg-white border border-slate-200 rounded-none p-6 text-left hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-50/50 hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
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
                                        <span key={child.key} className="inline-block px-2 py-0.5 bg-slate-50 text-slate-500 text-[10px] border border-slate-100">{child.label}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </button>
                ))}
                {items.length === 0 && <div className="col-span-full py-12 text-center text-slate-400 italic">No question types available yet.</div>}
            </div>
        );

        const PublicEnglishQuestionList = ({ questions }) => {
            const renderStars = (value) => (
                <span className="inline-flex items-center gap-1 text-[10px]">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={star <= value ? 'text-amber-400' : 'text-slate-200'}>★</span>
                    ))}
                </span>
            );
            return (
                <div className="max-w-4xl mx-auto space-y-8">
                    {questions.length === 0 && <div className="text-center py-12 text-slate-400 italic">No questions have been added yet.</div>}
                    {questions.map((entry, index) => (
                        <BookReader key={index}>
                            <div className="flex gap-4">
                                {/* LEGACY UPDATE: Square Q Marker */}
                                <div className="flex-none w-8 h-8 bg-indigo-100 text-indigo-700 font-bold font-serif flex items-center justify-center -mt-1">
                                    Q{index + 1}
                                </div>
                                <div className="space-y-3 w-full">
                                    <div className="flex flex-wrap items-baseline gap-x-2 text-base font-semibold text-slate-900 font-serif">
                                        <span>{entry.question}</span>
                                        {Number(entry.stars) > 0 && renderStars(Math.min(5, Number(entry.stars)))}
                                    </div>
                                    <div className="bg-white/50 border-l-4 border-emerald-400 pl-4 py-2">
                                        <span className="block text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Answer</span>
                                        <div className="text-slate-800">{entry.answer}</div>
                                    </div>
                                </div>
                            </div>
                        </BookReader>
                    ))}
                </div>
            );
        };
`;
