export const landingBangla = `
        const PublicBanglaShell = ({ title, subtitle, onBack, onNavigate, children }) => (
            // Reusing the upgraded PublicSimpleShell for consistency with the Landing Page
            <PublicSimpleShell 
                title={title} 
                subtitle={subtitle} 
                onBack={onBack} 
                onNavigate={onNavigate} 
                backgroundClass="bg-slate-50"
            >
                <div className="mb-6 flex justify-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-rose-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-rose-600 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        Bangla 1st Paper
                    </div>
                </div>
                {children}
            </PublicSimpleShell>
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
                    {subtitle && <p className="text-sm text-slate-500 text-center mb-6 font-serif italic">{subtitle}</p>}
                    <ArtPanelGrid className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                        {items.length === 0 && <div className="col-span-full py-12 text-center text-slate-400 italic">এই অংশে এখনও কোন পাঠ যোগ করা হয়নি।</div>}
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
                    {items.length === 0 && <div className="col-span-full py-12 text-center text-slate-400 italic">এই অংশে এখনও কোন সহপাঠ যোগ করা হয়নি।</div>}
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
                { key: 'cq', label: 'CQ Questions', icon: 'fa-pen-to-square', onClick: () => onNavigate(srijonshilRoute) },
                { key: 'mcq', label: 'MCQ Practice', icon: 'fa-list-check', onClick: () => onNavigate(mcqRoute) },
                { key: 'videos', label: 'Video Lessons', icon: 'fa-play', onClick: () => onOpenVideos && onOpenVideos({ noteKey, title: chapterTitle, subtitle: '', backRoute: categoryRoute }) },
            ];

            return (
                <PublicSimpleShell backgroundClass="bg-slate-50" title={chapterTitle} onBack={() => onNavigate(categoryRoute)} onNavigate={onNavigate}>
                    <div className="space-y-8 font-bangla text-left">
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
                                {notes.map((note, index) => (
                                    <div key={noteKey + '-' + index} className="flex gap-4">
                                        <div className="flex-none w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center justify-center mt-1">
                                            {toBanglaNumber(index + 1)}
                                        </div>
                                        <div>{note}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </PublicSimpleShell>
            );
        };

        const PublicBanglaSrijonshilDetail = ({ classLabel, itemName, categoryName, srijonshilQuestions, getQuestionKey, onNavigate }) => {
            const itemRoute = classLabel === 'SSC' ? 'public-bangla-ssc-item' : 'public-bangla-hsc-item';
            const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            const toBanglaNumber = (value) => String(value).split('').map((digit) => banglaDigits[Number(digit)] ?? digit).join('');
            const srijonshilTypes = [{ key: 'gyan', label: 'জ্ঞানমূলক (ক)' }, { key: 'onudhabon', label: 'অনুধাবনমূলক (খ)' }];
            const chapterTitle = itemName || 'পাঠ নির্বাচন করুন';
            return (
                <PublicBanglaShell title="সৃজনশীল প্রশ্ন" subtitle={categoryName ? 'বিভাগ: ' + categoryName : ''} onBack={() => onNavigate(itemRoute)} onNavigate={onNavigate}>
                    <div className="space-y-6 font-bangla text-left">
                        <div className="text-center mb-8">
                            <div className="text-xs uppercase tracking-[0.3em] text-slate-400 font-bold">Selected Chapter</div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">{chapterTitle}</h2>
                        </div>
                        {srijonshilTypes.map((type) => {
                            const list = srijonshilQuestions[getQuestionKey(classLabel, categoryName, itemName, type.key)] || [];
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
                </PublicBanglaShell>
            );
        };

        const PublicBanglaMcqDetail = ({ classLabel, itemName, categoryName, mcqQuestions, getQuestionKey, onNavigate }) => {
            const itemRoute = classLabel === 'SSC' ? 'public-bangla-ssc-item' : 'public-bangla-hsc-item';
            const mcqList = mcqQuestions[getQuestionKey(classLabel, categoryName, itemName, 'mcq')] || [];
            const chapterTitle = itemName || 'পাঠ নির্বাচন করুন';
            return (
                <PublicBanglaShell title="বহুনির্বাচনী প্রশ্ন" subtitle={categoryName ? 'বিভাগ: ' + categoryName : ''} onBack={() => onNavigate(itemRoute)} onNavigate={onNavigate}>
                     <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-slate-200/60 shadow-sm font-bangla">
                        <div className="text-center mb-8">
                            <div className="text-xs uppercase tracking-[0.3em] text-slate-400 font-bold">Selected Chapter</div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">{chapterTitle}</h2>
                        </div>
                        <PublicMcqList mcqList={mcqList} />
                    </div>
                </PublicBanglaShell>
            );
        };
`;
