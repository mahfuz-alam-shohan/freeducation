export const SubjectCard  =`
const SubjectCard = ({ subject, onNavigate, className = '', showGroup = false }) => {
            const isActive = Boolean(subject.route);
            const chapterCount = getSubjectChapterCount(subject);
            return (
                <button
                    onClick={() => isActive && onNavigate(subject.route)}
                    className={
                        className +
                        ' block h-full text-left transition-all duration-300 group ' +
                        (isActive ? 'cursor-pointer' : 'opacity-60 cursor-default')
                    }
                    disabled={!isActive}
                >
                    <div className="space-y-1.5 h-full text-center">
                        <div className={cardSurfaceClass}>
                            {subject.thumbnailUrl ? (
                                <img
                                    src={subject.thumbnailUrl}
                                    alt={subject.title + ' thumbnail'}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 card-art-media"
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-2 card-art-media">
                                    <div
                                        className={
                                            'h-9 w-9 rounded-lg text-white flex items-center justify-center shadow-sm ' +
                                            subject.accent
                                        }
                                    >
                                        <i className={'fa-solid ' + subject.icon + ' text-xs'}></i>
                                    </div>
                                    <div className="text-[9px] uppercase tracking-[0.3em]">Thumbnail</div>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 flex flex-col items-center text-center">
                            <div className="text-xs sm:text-sm font-semibold text-slate-900">{subject.title}</div>
                            {subject.subtitle && <div className="text-[11px] text-slate-500 font-bangla mt-1">{subject.subtitle}</div>}
                            <div className="mt-1 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                                {chapterCount !== null && (
                                    <span className="inline-flex items-center gap-1">
                                        <i className="fa-solid fa-layer-group text-[10px] text-slate-400"></i>
                                        {chapterCount} Chapters
                                    </span>
                                )}
                                {subject.lastRead && (
                                    <span className="inline-flex items-center gap-1 text-emerald-600">
                                        <i className="fa-solid fa-check text-[10px]"></i>
                                        Last read: {subject.lastRead}
                                    </span>
                                )}
                            </div>
                            {showGroup && (
                                <div className="mt-2 inline-flex items-center text-[10px] uppercase tracking-[0.2em] text-slate-400">
                                    {subject.groupLabel}
                                </div>
                            )}
                        </div>
                    </div>
                </button>
            );
        };

`;
