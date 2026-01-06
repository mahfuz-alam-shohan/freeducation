export const ChapterCard =`
const ChapterCard = ({ title, subtitle, thumbnailUrl, onClick, className = '', isRead = false }) => (
            <button
                onClick={onClick}
                className={className + ' block text-left transition-all duration-300 group'}
            >
                <div className="space-y-2 h-full text-center">
                    <div className={cardSurfaceClass + (isRead ? ' ring-1 ring-emerald-200' : '')}>
                        {isRead && (
                            <div className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-1 text-[10px] font-semibold text-white shadow-sm">
                                <i className="fa-solid fa-check text-[10px]"></i>
                                Read
                            </div>
                        )}
                        {thumbnailUrl ? (
                            <img
                                src={thumbnailUrl}
                                alt={title + ' thumbnail'}
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 card-art-media"
                            />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 text-[9px] uppercase tracking-[0.3em] card-art-media">
                                <span>No thumbnail</span>
                            </div>
                        )}
                    </div>
                    <div className="text-center">
                        <div className="text-xs sm:text-sm font-semibold text-slate-900">{title}</div>
                        {subtitle && <div className="text-[11px] text-slate-500 mt-1">{subtitle}</div>}
                    </div>
                </div>
            </button>
        );

`;
