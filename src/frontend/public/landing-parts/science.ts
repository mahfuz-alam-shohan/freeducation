export const landingScience = `
        const PublicIctShell = ({ title, subtitle, classLabel, onBack, onNavigate, children }) => (
            <div className="flex-1 bg-[#ecfeff]">
                <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-8 space-y-5">
                    <div className="grid grid-cols-[auto,1fr,auto] items-center gap-4 border-b border-slate-200 pb-4">
                        {onBack ? <button onClick={onBack} className="w-10 h-10 rounded-md border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800 transition flex items-center justify-center" aria-label="Go back"><i className="fa-solid fa-arrow-left"></i></button> : <div className="w-10 h-10" />}
                        <div className="text-center">
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{classLabel} ICT</div>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-2 font-bangla">{title}</h2>
                            {subtitle && <p className="text-sm text-slate-500 mt-2 font-bangla">{subtitle}</p>}
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
        const PublicIctChapterList = (props) => <PublicChapterList {...props} />;
        const PublicIctMcqDetail = ({ classLabel, chapter, mcqQuestions, getQuestionKey, onBack, onNavigate }) => {
            const chapterKey = chapter?.id || '';
            const mcqList = mcqQuestions[getQuestionKey(classLabel, 'ICT', chapterKey, 'mcq')] || [];
            const chapterTitle = chapter?.name || 'অধ্যায় নির্বাচন করুন';
            return (
                <PublicIctShell title="আইসিটি বহুনির্বাচনী" subtitle="অধ্যায় অনুযায়ী প্রশ্ন সমূহ" classLabel={classLabel} onBack={onBack} onNavigate={onNavigate}>
                    <div className="space-y-6 font-bangla">
                        <div className="text-center"><div className="text-xs uppercase tracking-[0.3em] text-slate-400">অধ্যায়</div><h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-2">{chapterTitle}</h2></div>
                        <PublicMcqList mcqList={mcqList} />
                    </div>
                </PublicIctShell>
            );
        };

        const PublicScienceShell = ({ title, subtitle, subjectLabel, classLabel, onBack, onNavigate, children }) => (
            <div className="flex-1 bg-[#ecfdf3]">
                <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-8 space-y-5">
                    <div className="grid grid-cols-[auto,1fr,auto] items-center gap-4 border-b border-slate-200 pb-4">
                        {onBack ? <button onClick={onBack} className="w-10 h-10 rounded-md border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800 transition flex items-center justify-center" aria-label="Go back"><i className="fa-solid fa-arrow-left"></i></button> : <div className="w-10 h-10" />}
                        <div className="text-center">
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{classLabel} {subjectLabel}</div>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-2 font-bangla">{title}</h2>
                            {subtitle && <p className="text-sm text-slate-500 mt-2 font-bangla">{subtitle}</p>}
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
        const PublicScienceChapterList = (props) => <PublicChapterList {...props} />;
        const PublicReligionOptionList = ({ options, onSelect }) => (
            <ArtPanelGrid className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                {options.map((option) => (
                    <button key={option.key} onClick={() => onSelect(option)} className="text-left transition-all duration-300 group">
                        <div className="space-y-2 h-full">
                            <div className={cardSurfaceClass + ' flex items-center justify-center'}>
                                <div className="text-center px-3 card-art-media">
                                    <div className="text-lg font-semibold text-slate-900">{option.label}</div>
                                    <div className="text-xs text-slate-500 mt-2 font-bangla">{option.subtitle}</div>
                                </div>
                            </div>
                        </div>
                    </button>
                ))}
            </ArtPanelGrid>
        );

        const PublicScienceTopicList = ({ topics, onSelectTopic }) => (
            <div className={'grid justify-items-center ' + cardGridGapClass + ' sm:grid-cols-2 lg:grid-cols-3'}>
                {topics.map((topic) => (
                    <button key={topic.id} onClick={() => onSelectTopic(topic)} className="w-full border border-slate-200 rounded-md p-4 text-center hover:border-slate-300 hover:bg-slate-50 transition font-bangla">
                        <div className="text-xs uppercase tracking-[0.2em] text-slate-400">টপিক</div>
                        <div className="text-lg font-semibold text-slate-900 mt-2">{topic.name}</div>
                        <p className="text-sm text-slate-500 mt-2">নোট, CQ এবং MCQ দেখুন</p>
                    </button>
                ))}
                {topics.length === 0 && <div className="border border-dashed border-slate-200 rounded-md p-6 text-sm text-slate-400 font-bangla text-center">এখনো কোনো টপিক যোগ করা হয়নি।</div>}
            </div>
        );

        const PublicScienceTopicDetail = ({ subjectLabel, classLabel, chapterName, topicName, noteKey, notesByItem, cqQuestions, mcqList, onBack, backRoute, onNavigateCq, onNavigateMcq, onOpenVideos, onNavigate }) => {
            const notes = (notesByItem || {})[noteKey] || [];
            const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            const toBanglaNumber = (value) => String(value).split('').map((digit) => banglaDigits[Number(digit)] ?? digit).join('');
            const actionCards = [
                { key: 'cq', label: 'CQ', onClick: onNavigateCq },
                { key: 'mcq', label: 'MCQ', onClick: onNavigateMcq },
                { key: 'videos', label: 'Videos', onClick: () => onOpenVideos && onOpenVideos({ noteKey, title: topicName || 'টপিক নির্বাচন করুন', subtitle: chapterName || '', backRoute }) },
                { key: 'practice', label: 'Practice', disabled: true }
            ];
            return (
                <PublicSimpleShell backgroundClass="bg-[#ecfdf3]" title={topicName || 'টপিক নির্বাচন করুন'} subtitle={chapterName || ''} onBack={onBack} onNavigate={onNavigate}>
                    <div className="space-y-6 font-bangla">
                        <div className="flex flex-wrap gap-2">
                            {actionCards.map((card) => (
                                <button key={card.key} onClick={card.disabled ? undefined : card.onClick} disabled={card.disabled} className={'rounded-lg border text-xs font-semibold transition px-3 py-1.5 ' + (card.disabled ? 'border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed' : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50')}>{card.label}</button>
                            ))}
                        </div>
                        <div className="space-y-2 text-sm text-slate-700">
                            {notes.length === 0 && <div className="text-sm text-slate-400">এখনো কোন নোট যোগ করা হয়নি।</div>}
                            {notes.map((note, index) => <div key={noteKey + '-' + index}>{toBanglaNumber(index + 1)}. {note}</div>)}
                        </div>
                    </div>
                </PublicSimpleShell>
            );
        };

        const PublicScienceCqDetail = ({ subjectLabel, classLabel, chapterName, topicName, questions, onBack, onNavigate }) => {
            const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            const toBanglaNumber = (value) => String(value).split('').map((digit) => banglaDigits[Number(digit)] ?? digit).join('');
            const cqTypes = [{ key: 'gyan', label: 'জ্ঞান (ক)' }, { key: 'onudhabon', label: 'অনুধাবন (খ)' }];
            return (
                <PublicScienceShell subjectLabel={subjectLabel} classLabel={classLabel} title="সৃজনশীল প্রশ্ন" subtitle={chapterName ? chapterName + ' • ' + (topicName || '') : topicName || ''} onBack={onBack} onNavigate={onNavigate}>
                    <div className="space-y-6 font-bangla">
                        {cqTypes.map((type) => {
                            const list = questions[type.key] || [];
                            return (
                                <div key={type.key} className={flatSectionClass}>
                                    <div className="text-sm font-semibold text-slate-900">{type.label}</div>
                                    {list.length === 0 ? <div className="text-sm text-slate-400 mt-3">এখনো কোন প্রশ্ন যোগ করা হয়নি।</div> : (
                                        <div className="mt-4 space-y-4">
                                            {list.map((entry, index) => (
                                                <div key={entry.question + '-' + index} className="space-y-2">
                                                    <div className="text-sm font-semibold text-slate-800">{toBanglaNumber(index + 1)}. {entry.question}</div>
                                                    <div className="text-sm text-slate-600 border-l-2 border-slate-200 pl-3">{entry.answer}</div>
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
                <div className="space-y-6 font-bangla"><PublicMcqList mcqList={mcqList} /></div>
            </PublicScienceShell>
        );
`;
