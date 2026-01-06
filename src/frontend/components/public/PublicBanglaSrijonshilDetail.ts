export const PublicBanglaSrijonshilDetail =`
const PublicBanglaSrijonshilDetail = ({
            classLabel,
            itemName,
            categoryName,
            srijonshilQuestions,
            getQuestionKey,
            onNavigate
        }) => {
            const itemRoute = classLabel === 'SSC' ? 'public-bangla-ssc-item' : 'public-bangla-hsc-item';
            const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            const toBanglaNumber = (value) => String(value)
                .split('')
                .map((digit) => banglaDigits[Number(digit)] ?? digit)
                .join('');
            const srijonshilTypes = [
                { key: 'gyan', label: 'জ্ঞান (ক)' },
                { key: 'onudhabon', label: 'অনুধাবন (খ)' }
            ];
            const chapterTitle = itemName || 'পাঠ নির্বাচন করুন';

            return (
                <PublicBanglaShell
                    title="সৃজনশীল প্রশ্ন"
                    subtitle={categoryName ? 'বিভাগ: ' + categoryName : ''}
                    onBack={() => onNavigate(itemRoute)}
                    onNavigate={onNavigate}
                >
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
                </PublicBanglaShell>
            );
        };


`;
