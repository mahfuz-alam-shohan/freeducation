export const landingScience = `
        const PublicIctShell = ({ title, subtitle, classLabel, onBack, onNavigate, children }) => {
            // Reusing the upgraded PublicSimpleShell
            return (
                <PublicSimpleShell 
                    title={title} 
                    subtitle={subtitle} 
                    onBack={onBack} 
                    onNavigate={onNavigate} 
                    backgroundClass="bg-slate-50"
                >
                    <div className="mb-6 flex justify-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-cyan-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-cyan-600 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                            {classLabel} ICT
                        </div>
                    </div>
                    {children}
                </PublicSimpleShell>
            );
        };
        const PublicIctChapterList = (props) => <PublicChapterList {...props} />;
        const PublicIctMcqDetail = ({ classLabel, chapter, mcqQuestions, getQuestionKey, onBack, onNavigate }) => {
            const chapterKey = chapter?.id || '';
            const mcqList = mcqQuestions[getQuestionKey(classLabel, 'ICT', chapterKey, 'mcq')] || [];
            const chapterTitle = chapter?.name || 'অধ্যায় নির্বাচন করুন';
            return (
                <PublicIctShell title="আইসিটি বহুনির্বাচনী" subtitle={chapterTitle} classLabel={classLabel} onBack={onBack} onNavigate={onNavigate}>
                    <div className="space-y-8 font-bangla bg-white/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-slate-200/50 shadow-sm">
                        <div className="text-center">
                            <div className="text-xs uppercase tracking-[0.3em] text-slate-400 font-bold mb-2">Selected Chapter</div>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">{chapterTitle}</h2>
                        </div>
                        <PublicMcqList mcqList={mcqList} />
                    </div>
                </PublicIctShell>
            );
        };

        const PublicScienceShell = ({ title, subtitle, subjectLabel, classLabel, onBack, onNavigate, children }) => {
            return (
                <PublicSimpleShell 
                    title={title} 
                    subtitle={subtitle} 
                    onBack={onBack} 
                    onNavigate={onNavigate} 
                    backgroundClass="bg-slate-50"
                >
                    <div className="mb-6 flex justify-center">
                         <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-emerald-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-emerald-600 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            {classLabel} {subjectLabel}
                        </div>
                    </div>
                    {children}
                </PublicSimpleShell>
            );
        };
        
        const PublicScienceChapterList = (props) => <PublicChapterList {...props} />;
        
        const PublicReligionOptionList = ({ options, onSelect }) => (
            <ArtPanelGrid className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                {options.map((option) => (
                    <button key={option.key} onClick={() => onSelect(option)} className="text-left transition-all duration-300 group">
                         <div className={cardSurfaceClass + ' flex items-center justify-center'}>
                            <div className="text-center px-4 card-art-media z-10">
                                <div className="text-lg font-bold text-slate-900 font-serif mb-1 group-hover:text-indigo-700 transition-colors">{option.label}</div>
                                <div className="text-xs text-slate-500 font-bangla opacity-80">{option.subtitle}</div>
                            </div>
                            {/* Decorative Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-amber-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                    </button>
                ))}
            </ArtPanelGrid>
        );

        const PublicScienceTopicList = ({ topics, onSelectTopic }) => (
            <div className={'grid justify-items-center ' + cardGridGapClass + ' sm:grid-cols-2 lg:grid-cols-3'}>
                {topics.map((topic) => (
                    <button 
                        key={topic.id} 
                        onClick={() => onSelectTopic(topic)} 
                        className="w-full relative group bg-white border border-slate-200 rounded-2xl p-6 text-center hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden font-bangla"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                            <div className="inline-block px-2 py-0.5 rounded text-[9px] uppercase tracking-[0.25em] text-slate-400 bg-slate-50 mb-3 font-bold group-hover:bg-white transition-colors">Topic</div>
                            <div className="text-lg font-bold text-slate-800 group-hover:text-indigo-700 transition-colors mb-2">{topic.name}</div>
                            <p className="text-xs text-slate-500">View Notes, CQ & MCQ</p>
                        </div>
                    </button>
                ))}
                {topics.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-400 font-bangla">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-3"><i className="fa-regular fa-folder-open text-xl"></i></div>
                        <p>এখনো কোনো টপিক যোগ করা হয়নি।</p>
                    </div>
                )}
            </div>
        );

        const PublicScienceTopicDetail = ({ subjectLabel, classLabel, chapterName, topicName, noteKey, notesByItem, cqQuestions, mcqList, onBack, backRoute, onNavigateCq, onNavigateMcq, onOpenVideos, onNavigate }) => {
            const notes = (notesByItem || {})[noteKey] || [];
            const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            const toBanglaNumber = (value) => String(value).split('').map((digit) => banglaDigits[Number(digit)] ?? digit).join('');
            const normalizedNote = (note) => {
                if (!note) return { text: '', stars: 0 };
                if (typeof note === 'string') return { text: note, stars: 0 };
                return { text: note.text || note.note || '', stars: Math.max(0, Math.min(5, Number(note.stars) || 0)) };
            };
            const renderStars = (value) => (
                <div className="flex items-center gap-1 text-[10px]">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={star <= value ? 'text-amber-400' : 'text-slate-200'}>★</span>
                    ))}
                </div>
            );
            const actionCards = [
                { key: 'cq', label: 'CQ Questions', icon: 'fa-pen-to-square', onClick: onNavigateCq },
                { key: 'mcq', label: 'MCQ Practice', icon: 'fa-list-check', onClick: onNavigateMcq },
                { key: 'videos', label: 'Video Lessons', icon: 'fa-play', onClick: () => onOpenVideos && onOpenVideos({ noteKey, title: topicName || 'টপিক নির্বাচন করুন', subtitle: chapterName || '', backRoute }) },
            ];
            return (
                <PublicSimpleShell title={topicName || 'টপিক নির্বাচন করুন'} subtitle={chapterName || ''} onBack={onBack} onNavigate={onNavigate}>
                     <div className="mb-6 flex justify-center">
                         <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-indigo-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-indigo-500 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                            Topic Details
                        </div>
                    </div>
                    
                    <div className="space-y-8 font-bangla">
                        {/* Action Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {actionCards.map((card) => (
                                <button key={card.key} onClick={card.onClick} className="flex items-center justify-center gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md hover:text-indigo-700 transition group">
                                    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                                        <i className={'fa-solid ' + card.icon + ' text-sm'}></i>
                                    </div>
                                    <span className="font-semibold text-sm">{card.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Notes Section */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm">
                            <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Study Notes</div>
                            <div className="space-y-6 text-base text-slate-700 leading-relaxed">
                                {notes.length === 0 && <div className="text-center py-8 text-slate-400 italic">এখনো কোন নোট যোগ করা হয়নি।</div>}
                                {notes.map((note, index) => {
                                    const resolved = normalizedNote(note);
                                    return (
                                        <div key={noteKey + '-' + index} className="flex gap-4">
                                            <div className="flex-none w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center justify-center mt-1">
                                                {toBanglaNumber(index + 1)}
                                            </div>
                                            <div>
                                                <div>{resolved.text}</div>
                                                {resolved.stars > 0 && <div className="mt-2">{renderStars(resolved.stars)}</div>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </PublicSimpleShell>
            );
        };

        const PublicScienceCqDetail = ({ subjectLabel, classLabel, chapterName, topicName, questions, onBack, onNavigate }) => {
            const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            const toBanglaNumber = (value) => String(value).split('').map((digit) => banglaDigits[Number(digit)] ?? digit).join('');
            const cqTypes = [{ key: 'gyan', label: 'জ্ঞানমূলক (ক)' }, { key: 'onudhabon', label: 'অনুধাবনমূলক (খ)' }];
            return (
                <PublicScienceShell subjectLabel={subjectLabel} classLabel={classLabel} title="সৃজনশীল প্রশ্ন" subtitle={chapterName ? chapterName + ' • ' + (topicName || '') : topicName || ''} onBack={onBack} onNavigate={onNavigate}>
                    <div className="space-y-6 font-bangla">
                        {cqTypes.map((type) => {
                            const list = questions[type.key] || [];
                            return (
                                <div key={type.key} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm">
                                    <div className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">{type.label}</div>
                                    {list.length === 0 ? <div className="text-sm text-slate-400 italic">এখনো কোন প্রশ্ন যোগ করা হয়নি।</div> : (
                                        <div className="space-y-6">
                                            {list.map((entry, index) => (
                                                <div key={entry.question + '-' + index} className="space-y-3">
                                                    <div className="flex gap-3">
                                                        <span className="font-bold text-indigo-600">{toBanglaNumber(index + 1)}.</span>
                                                        <div className="font-semibold text-slate-800">{entry.question}</div>
                                                    </div>
                                                    <div className="text-sm text-slate-600 bg-slate-50/50 p-4 rounded-xl border border-slate-100 leading-relaxed">
                                                        {entry.answer}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </PublicScienceShell>
            );
        };
        const PublicScienceMcqDetail = ({ subjectLabel, classLabel, chapterName, topicName, mcqList, onBack, onNavigate }) => (
            <PublicScienceShell subjectLabel={subjectLabel} classLabel={classLabel} title="বহুনির্বাচনী প্রশ্ন" subtitle={chapterName ? chapterName + ' • ' + (topicName || '') : topicName || ''} onBack={onBack} onNavigate={onNavigate}>
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm font-bangla">
                    <PublicMcqList mcqList={mcqList} />
                </div>
            </PublicScienceShell>
        );
`;
