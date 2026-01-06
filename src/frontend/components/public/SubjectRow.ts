export const SubjectRow  =`
const SubjectRow = ({ title, onAll, subjects, onNavigate, thumbnailMap, readMap }) => (
            <section className="space-y-3">
                <div className="flex flex-col items-center gap-2 text-center">
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-900">{title}</h3>
                    <button
                        onClick={onAll}
                        className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-md transition hover:border-indigo-300 hover:text-indigo-700 flex items-center gap-2"
                    >
                        See all <i className="fa-solid fa-angle-right"></i>
                    </button>
                </div>
                <div className={'flex items-stretch ' + cardGridGapClass + ' pb-4 overflow-x-auto snap-x scrollbar-hide'}>
                    {subjects.map((subject) => {
                        const thumbnail = thumbnailMap[subject.subjectKey];
                        const lastRead = getLastReadForSubject(readMap, subject.title);
                        return (
                            <SubjectCard
                                key={subject.subjectKey}
                                subject={{
                                    ...subject,
                                    lastRead,
                                    thumbnailUrl: thumbnail?.url
                                }}
                                onNavigate={onNavigate}
                                className={'flex-shrink-0 snap-start ' + cardWidthClass}
                            />
                        );
                    })}
                </div>
            </section>
        );
        

`;
