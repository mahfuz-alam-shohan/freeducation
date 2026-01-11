export const landingBangla = `
        const PublicBanglaShell = ({ title, subtitle, onBack, onNavigate, children }) => (
            <PublicSimpleShell 
                title={title} 
                subtitle={subtitle} 
                onBack={onBack} 
                onNavigate={onNavigate} 
                backgroundClass="bg-slate-50"
                badge={
                    /* LEGACY UPDATE: Square Badge */
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-rose-100 text-[10px] font-bold uppercase tracking-widest text-rose-600 shadow-sm">
                        <span className="w-1.5 h-1.5 bg-rose-500"></span>
                        Bangla 1st Paper
                    </div>
                }
            >
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
            const normalizedNote = (note) => {
                if (!note) return { text: '', stars: 0 };
                if (typeof note === 'string') return { text: note, stars: 0 };
                return { text: note.text || note.note || '', stars: Math.max(0, Math.min(5, Number(note.stars) || 0)) };
            };
            const renderStars = (value) => (
                <div className="flex items-center gap-1 text-[10px] text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={star <= value ? 'text-amber-400' : 'text-slate-200'}>★</span>
                    ))}
                </div>
            );
            
            const actionCards = [
                { key: 'cq', label: 'CQ Questions', icon: 'fa-pen-to-square', onClick: () => onNavigate(srijonshilRoute) },
                { key: 'mcq', label: 'MCQ Practice', icon: 'fa-list-check', onClick: () => onNavigate(mcqRoute) },
                { key: 'videos', label: 'Video Lessons', icon: 'fa-play', onClick: () => onOpenVideos && onOpenVideos({ noteKey, title: itemName, subtitle: '', backRoute: categoryRoute }) },
            ];

            return (
                <PublicBanglaShell title={itemName || 'পাঠ নির্বাচন করুন'} onBack={() => onNavigate(categoryRoute)} onNavigate={onNavigate}>
                    <div className="space-y-8 font-bangla text-left max-w-4xl mx-auto">
                        
                        {/* LEGACY UPDATE: Square Action Buttons */}
                        <div className="flex flex-wrap justify-center gap-4">
                            {actionCards.map((card) => (
                                <button key={card.key} onClick={card.onClick} className="flex items-center gap-3 px-5 py-3 bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md hover:text-indigo-700 transition group shadow-sm">
                                    <i className={'fa-solid ' + card.icon + ' text-indigo-400 group-hover:text-indigo-600'}></i>
                                    <span className="font-bold text-sm">{card.label}</span>
                                </button>
                            ))}
                        </div>

                        <BookReader>
                            {notes.length === 0 && <div className="text-center py-8 text-slate-400 italic">এখনো কোন নোট যোগ করা হয়নি।</div>}
                            {notes.map((note, index) => {
                                const resolved = normalizedNote(note);
                                return (
                                    <div key={noteKey + '-' + index} className="relative pl-8">
                                        <span className="absolute left-0 top-0 font-bold text-indigo-900/40 select-none">{toBanglaNumber(index + 1)}.</span>
                                        <p className="text-slate-900 font-bangla leading-loose text-lg">{resolved.text}</p>
                                        {resolved.stars > 0 && <div className="mt-2">{renderStars(resolved.stars)}</div>}
                                    </div>
                                );
                            })}
                        </BookReader>

                    </div>
                </PublicBanglaShell>
            );
        };

        const PublicBanglaSrijonshilDetail = ({ classLabel, itemName, categoryName, srijonshilQuestions, getQuestionKey, onNavigate }) => {
            const itemRoute = classLabel === 'SSC' ? 'public-bangla-ssc-item' : 'public-bangla-hsc-item';
            const srijonshilTypes = [{ key: 'gyan', label: 'জ্ঞানমূলক (ক)' }, { key: 'onudhabon', label: 'অনুধাবনমূলক (খ)' }];
            return (
                <PublicBanglaShell title="সৃজনশীল প্রশ্ন" subtitle={itemName ? itemName : ''} onBack={() => onNavigate(itemRoute)} onNavigate={onNavigate}>
                    <div className="space-y-12 font-bangla text-left max-w-4xl mx-auto">
                        {srijonshilTypes.map((type) => {
                            const list = srijonshilQuestions[getQuestionKey(classLabel, categoryName, itemName, type.key)] || [];
                            return (
                                <div key={type.key}>
                                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                        {/* LEGACY UPDATE: Square marker */}
                                        <span className="w-8 h-1 bg-indigo-500"></span>
                                        {type.label}
                                    </h3>
                                    <BookReader>
                                        {list.length === 0 ? <div className="text-sm text-slate-400 italic">এখনো কোন প্রশ্ন যোগ করা হয়নি।</div> : (
                                            <div className="space-y-8">
                                                {list.map((entry, index) => (
                                                    <div key={entry.question + '-' + index} className="space-y-3">
                                                        <div className="font-bold text-slate-900">{index + 1}. {entry.question}</div>
                                                        <div className="text-slate-800 leading-relaxed pl-4 border-l-2 border-indigo-200/50">{entry.answer}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </BookReader>
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
            return (
                <PublicBanglaShell title="বহুনির্বাচনী প্রশ্ন" subtitle={itemName ? itemName : ''} onBack={() => onNavigate(itemRoute)} onNavigate={onNavigate}>
                     {/* LEGACY UPDATE: Removed rounded container */}
                     <div className="max-w-4xl mx-auto bg-white/60 backdrop-blur-md p-8 border border-white shadow-sm font-bangla">
                        <PublicMcqList mcqList={mcqList} />
                    </div>
                </PublicBanglaShell>
            );
        };
`;
