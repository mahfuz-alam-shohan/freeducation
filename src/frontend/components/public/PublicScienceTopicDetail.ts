export const PublicScienceTopicDetail =`
const PublicScienceTopicDetail = ({
            subjectLabel,
            classLabel,
            chapterName,
            topicName,
            noteKey,
            notesByItem,
            cqQuestions,
            mcqList,
            onBack,
            backRoute,
            onNavigateCq,
            onNavigateMcq,
            onOpenVideos,
            onNavigate
        }) => {
            const notes = (notesByItem || {})[noteKey] || [];
            const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            const toBanglaNumber = (value) => String(value)
                .split('')
                .map((digit) => banglaDigits[Number(digit)] ?? digit)
                .join('');
            const actionCards = [
                { key: 'cq', label: 'CQ', onClick: onNavigateCq },
                { key: 'mcq', label: 'MCQ', onClick: onNavigateMcq },
                {
                    key: 'videos',
                    label: 'Videos',
                    onClick: () =>
                        onOpenVideos &&
                        onOpenVideos({
                            noteKey,
                            title: topicName || 'টপিক নির্বাচন করুন',
                            subtitle: chapterName || '',
                            backRoute
                        })
                },
                { key: 'practice', label: 'Practice', disabled: true }
            ];

            return (
                <PublicSimpleShell
                    backgroundClass="bg-[#ecfdf3]"
                    title={topicName || 'টপিক নির্বাচন করুন'}
                    subtitle={chapterName || ''}
                    onBack={onBack}
                    onNavigate={onNavigate}
                >
                    <div className="space-y-6 font-bangla">
                        <div className="flex flex-wrap gap-2">
                            {actionCards.map((card) => (
                                <button
                                    key={card.key}
                                    onClick={card.disabled ? undefined : card.onClick}
                                    disabled={card.disabled}
                                    className={
                                        'rounded-lg border text-xs font-semibold transition px-3 py-1.5 ' +
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
