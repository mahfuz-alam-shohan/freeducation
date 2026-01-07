export const landingBangla = `
        const PublicBanglaShell = ({ title, subtitle, onBack, onNavigate, children }) => (
            <div className="flex-1 bg-[#fff7ed]">
                <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-8 space-y-5">
                    <div className="space-y-6">
                        <div className="border-b border-slate-200 pb-4">
                            <div className="grid grid-cols-[auto,1fr,auto] items-center gap-4">
                                {onBack ? <button onClick={onBack} className="w-10 h-10 rounded-md border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800 transition flex items-center justify-center" aria-label="Go back"><i className="fa-solid fa-arrow-left"></i></button> : <div className="w-10 h-10" />}
                                <div className="text-center">
                                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Bangla 1st Paper</div>
                                    <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-2 font-bangla">{title}</h2>
                                    {subtitle && <p className="text-sm text-slate-600 mt-2 font-bangla">{subtitle}</p>}
                                </div>
                                <button onClick={() => onNavigate('landing')} className="px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-[0.2em] border border-slate-200 text-slate-600 hover:border-slate-300 transition justify-self-end">Home</button>
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

        const PublicBanglaTopicGrid = ({ classLabel, subjectLabel, topics, onNavigate }) => {
            const chapterThumbnails = useThumbnails('/api/chapter-thumbnails', 'chapterKey');
            const { readMap, markRead } = useReadingProgress();
            return (
                <ArtPanelGrid className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 font-bangla">
                    {topics.map((topic) => {
                        const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, topic.thumbnailKey || topic.title);
                        return (
                            <ChapterCard
                                key={topic.title}
                                title={topic.title}
                                subtitle={topic.description}
                                thumbnailUrl={chapterThumbnails[chapterKey]?.url}
                                isRead={Boolean(readMap[chapterKey])}
                                onClick={() => {
                                    markRead({ key: chapterKey, label: topic.title, subjectLabel, route: topic.route });
                                    topic.route && onNavigate(topic.route);
                                }}
                                className={cardWidthClass}
                            />
                        );
                    })}
                </ArtPanelGrid>
            );
        };

        const PublicBanglaTextList = ({ classLabel, subjectLabel, categoryLabel, subtitle, items, onSelectItem }) => {
            const chapterThumbnails = useThumbnails('/api/chapter-thumbnails', 'chapterKey');
            const { readMap, markRead } = useReadingProgress();
            return (
                <div className="space-y-4 font-bangla">
                    {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
                    <ArtPanelGrid className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                        {items.length === 0 && <div className="text-sm text-slate-400">এই অংশে এখনও কোন পাঠ যোগ করা হয়নি।</div>}
                        {items.map((item) => {
                            const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, item + '-' + categoryLabel);
                            return (
                                <ChapterCard
                                    key={item}
                                    title={item}
                                    subtitle={categoryLabel}
                                    thumbnailUrl={chapterThumbnails[chapterKey]?.url}
                                    isRead={Boolean(readMap[chapterKey])}
                                    onClick={() => {
                                        storeBanglaSelection({ classLabel, categoryName: categoryLabel, itemName: item });
                                        markRead({ key: chapterKey, label: item, subjectLabel, route: classLabel === 'SSC' ? 'public-bangla-ssc-item' : 'public-bangla-hsc-item' });
                                        onSelectItem(item);
                                    }}
                                    className={cardWidthClass}
                                />
                            );
                        })}
                    </ArtPanelGrid>
                </div>
            );
        };

        const PublicBanglaShohopathList = ({ classLabel, subjectLabel, items, onSelectItem }) => {
            const chapterThumbnails = useThumbnails('/api/chapter-thumbnails', 'chapterKey');
            const { readMap, markRead } = useReadingProgress();
            return (
                <ArtPanelGrid className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 font-bangla">
                    {items.length === 0 && <div className="text-sm text-slate-400">এই অংশে এখনও কোন সহপাঠ যোগ করা হয়নি।</div>}
                    {items.map((item) => {
                        const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, (item.id || item.name) + '-সহপাঠ');
                        return (
                            <ChapterCard
                                key={item.id}
                                title={item.name}
                                subtitle={item.type}
                                thumbnailUrl={chapterThumbnails[chapterKey]?.url}
                                isRead={Boolean(readMap[chapterKey])}
                                onClick={() => {
                                    storeBanglaSelection({ classLabel, categoryName: item.type, itemName: item.name });
                                    markRead({ key: chapterKey, label: item.name, subjectLabel, route: classLabel === 'SSC' ? 'public-bangla-ssc-item' : 'public-bangla-hsc-item' });
                                    onSelectItem(item);
                                }}
                                className={cardWidthClass}
                            />
                        );
                    })}
                </ArtPanelGrid>
            );
        };

        const PublicBanglaItemDetail = ({ classLabel, itemName, categoryName, notesByItem, onNavigate, onOpenVideos }) => {
            const categoryRoute = classLabel === 'SSC' ? (categoryName === 'পদ্য' ? 'public-bangla-ssc-poddo' : categoryName === 'নাটক' || categoryName === 'উপন্যাস' ? 'public-bangla-ssc-shohopath' : 'public-bangla-ssc-goddo')
                : (categoryName === 'পদ্য' ? 'public-bangla-hsc-poddo' : categoryName === 'নাটক' || categoryName === 'উপন্যাস' ? 'public-bangla-hsc-shohopath' : 'public-bangla-hsc-goddo');
            const srijonshilRoute = classLabel === 'SSC' ? 'public-bangla-ssc-srijonshil' : 'public-bangla-hsc-srijonshil';
            const mcqRoute = classLabel === 'SSC' ? 'public-bangla-ssc-mcq' : 'public-bangla-hsc-mcq';
            const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            const toBanglaNumber = (value) => String(value).split('').map((digit) => banglaDigits[Number(digit)] ?? digit).join('');
            const noteKey = [classLabel, categoryName || 'general', itemName || ''].join('-');
            const notes = (notesByItem || {})[noteKey] || [];
            const chapterTitle = itemName || 'পাঠ নির্বাচন করুন';
            const actionCards = [
                { key: 'cq', label: 'CQ', onClick: () => onNavigate(srijonshilRoute) },
                { key: 'mcq', label: 'MCQ', onClick: () => onNavigate(mcqRoute) },
                { key: 'videos', label: 'Videos', onClick: () => onOpenVideos && onOpenVideos({ noteKey, title: chapterTitle, subtitle: '', backRoute: categoryRoute }) },
                { key: 'practice', label: 'Practice', disabled: true }
            ];

            return (
                <PublicSimpleShell backgroundClass="bg-[#fff7ed]" title={chapterTitle} onBack={() => onNavigate(categoryRoute)} onNavigate={onNavigate}>
                    <div className="space-y-6 font-bangla text-left">
                        <div className="flex flex-wrap gap-2">
                            {actionCards.map((card) => (
                                <button key={card.key} onClick={card.disabled ? undefined : card.onClick} disabled={card.disabled} className={'rounded-md border text-xs font-semibold transition px-3 py-1.5 ' + (card.disabled ? 'border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed' : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50')}>{card.label}</button>
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

        const PublicBanglaSrijonshilDetail = ({ classLabel, itemName, categoryName, srijonshilQuestions, getQuestionKey, onNavigate }) => {
            const itemRoute = classLabel === 'SSC' ? 'public-bangla-ssc-item' : 'public-bangla-hsc-item';
            const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            const toBanglaNumber = (value) => String(value).split('').map((digit) => banglaDigits[Number(digit)] ?? digit).join('');
            const srijonshilTypes = [{ key: 'gyan', label: 'জ্ঞান (ক)' }, { key: 'onudhabon', label: 'অনুধাবন (খ)' }];
            const chapterTitle = itemName || 'পাঠ নির্বাচন করুন';
            return (
                <PublicBanglaShell title="সৃজনশীল প্রশ্ন" subtitle={categoryName ? 'বিভাগ: ' + categoryName : ''} onBack={() => onNavigate(itemRoute)} onNavigate={onNavigate}>
                    <div className="space-y-6 font-bangla text-left">
                        <div className="text-center">
                            <div className="text-xs uppercase tracking-[0.3em] text-slate-400">অধ্যায়</div>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-2">{chapterTitle}</h2>
                        </div>
                        {srijonshilTypes.map((type) => {
                            const list = srijonshilQuestions[getQuestionKey(classLabel, categoryName, itemName, type.key)] || [];
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
                </PublicBanglaShell>
            );
        };

        const PublicBanglaMcqDetail = ({ classLabel, itemName, categoryName, mcqQuestions, getQuestionKey, onNavigate }) => {
            const itemRoute = classLabel === 'SSC' ? 'public-bangla-ssc-item' : 'public-bangla-hsc-item';
            const mcqList = mcqQuestions[getQuestionKey(classLabel, categoryName, itemName, 'mcq')] || [];
            const chapterTitle = itemName || 'পাঠ নির্বাচন করুন';
            return (
                <PublicBanglaShell title="বহুনির্বাচনী প্রশ্ন" subtitle={categoryName ? 'বিভাগ: ' + categoryName : ''} onBack={() => onNavigate(itemRoute)} onNavigate={onNavigate}>
                    <div className="space-y-6 font-bangla">
                        <div className="text-center">
                            <div className="text-xs uppercase tracking-[0.3em] text-slate-400">অধ্যায়</div>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-2">{chapterTitle}</h2>
                        </div>
                        <PublicMcqList mcqList={mcqList} />
                    </div>
                </PublicBanglaShell>
            );
        };
`;
