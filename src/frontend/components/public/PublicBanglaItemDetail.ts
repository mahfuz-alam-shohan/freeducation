export const PublicBanglaItemDetail =`
const PublicBanglaItemDetail = ({
            classLabel,
            itemName,
            categoryName,
            notesByItem,
            onNavigate,
            onOpenVideos
        }) => {
            const categoryRoute = classLabel === 'SSC'
                ? (categoryName === 'পদ্য'
                    ? 'public-bangla-ssc-poddo'
                    : categoryName === 'নাটক' || categoryName === 'উপন্যাস'
                        ? 'public-bangla-ssc-shohopath'
                        : 'public-bangla-ssc-goddo')
                : (categoryName === 'পদ্য'
                    ? 'public-bangla-hsc-poddo'
                    : categoryName === 'নাটক' || categoryName === 'উপন্যাস'
                        ? 'public-bangla-hsc-shohopath'
                        : 'public-bangla-hsc-goddo');

            const srijonshilRoute = classLabel === 'SSC' ? 'public-bangla-ssc-srijonshil' : 'public-bangla-hsc-srijonshil';
            const mcqRoute = classLabel === 'SSC' ? 'public-bangla-ssc-mcq' : 'public-bangla-hsc-mcq';
            const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            const toBanglaNumber = (value) => String(value)
                .split('')
                .map((digit) => banglaDigits[Number(digit)] ?? digit)
                .join('');
            const noteKey = [classLabel, categoryName || 'general', itemName || ''].join('-');
            const notes = (notesByItem || {})[noteKey] || [];
            const chapterTitle = itemName || 'পাঠ নির্বাচন করুন';
            const actionCards = [
                { key: 'cq', label: 'CQ', onClick: () => onNavigate(srijonshilRoute) },
                { key: 'mcq', label: 'MCQ', onClick: () => onNavigate(mcqRoute) },
                {
                    key: 'videos',
                    label: 'Videos',
                    onClick: () =>
                        onOpenVideos &&
                        onOpenVideos({
                            noteKey,
                            title: chapterTitle,
                            subtitle: '',
                            backRoute: categoryRoute
                        })
                },
                { key: 'practice', label: 'Practice', disabled: true }
            ];

            return (
                <PublicSimpleShell
                    backgroundClass="bg-[#fff7ed]"
                    title={chapterTitle}
                    onBack={() => onNavigate(categoryRoute)}
                    onNavigate={onNavigate}
                >
                    <div className="space-y-6 font-bangla text-left">
                        <div className="flex flex-wrap gap-2">
                            {actionCards.map((card) => (
                            <button
                                key={card.key}
                                onClick={card.disabled ? undefined : card.onClick}
                                disabled={card.disabled}
                                className={
                                    'rounded-md border text-xs font-semibold transition px-3 py-1.5 ' +
                                    (card.disabled
                                        ? 'border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed'
                                        : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50')
                                }
                            >
                                {card.label}
                            </button>
                            ))}
                        </div>
                        <div className="space-y-2 text-sm text-slate-700">
                            {notes.length === 0 && (
                                <div className="text-sm text-slate-400">এখনো কোন নোট যোগ করা হয়নি।</div>
                            )}
                            {notes.map((note, index) => (
                                <div key={noteKey + '-' + index}>
                                    {toBanglaNumber(index + 1)}. {note}
                                </div>
                            ))}
                        </div>
                    </div>
                </PublicSimpleShell>
            );
        };

`;
