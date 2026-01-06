export const PublicScienceCqDetail =`
const PublicScienceCqDetail = ({ subjectLabel, classLabel, chapterName, topicName, questions, onBack, onNavigate }) => {
            const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            const toBanglaNumber = (value) => String(value)
                .split('')
                .map((digit) => banglaDigits[Number(digit)] ?? digit)
                .join('');
            const cqTypes = [
                { key: 'gyan', label: 'জ্ঞান (ক)' },
                { key: 'onudhabon', label: 'অনুধাবন (খ)' }
            ];

            return (
                <PublicScienceShell
                    subjectLabel={subjectLabel}
                    classLabel={classLabel}
                    title="সৃজনশীল প্রশ্ন"
                    subtitle={chapterName ? chapterName + ' • ' + (topicName || '') : topicName || ''}
                    onBack={onBack}
                    onNavigate={onNavigate}
                >
                    <div className="space-y-6 font-bangla">
                        {cqTypes.map((type) => {
                            const list = questions[type.key] || [];
                            return (
                                <div key={type.key} className={flatSectionClass}>
                                    <div className="text-sm font-semibold text-slate-900">{type.label}</div>
                                    {list.length === 0 ? (
                                        <div className="text-sm text-slate-400 mt-3">এখনো কোন প্রশ্ন যোগ করা হয়নি।</div>
                                    ) : (
                                        <div className="mt-4 space-y-4">
                                            {list.map((entry, index) => (
                                                <div key={entry.question + '-' + index} className="space-y-2">
                                                    <div className="text-sm font-semibold text-slate-800">
                                                        {toBanglaNumber(index + 1)}. {entry.question}
                                                    </div>
                                                    <div className="text-sm text-slate-600 border-l-2 border-slate-200 pl-3">
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

`;
