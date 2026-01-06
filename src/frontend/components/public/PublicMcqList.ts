export const PublicMcqList  =`
 const PublicMcqList = ({ mcqList }) => {
            const optionLabels = ['ক', 'খ', 'গ', 'ঘ'];
            const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            const toBanglaNumber = (value) => String(value)
                .split('')
                .map((digit) => banglaDigits[Number(digit)] ?? digit)
                .join('');
            const [globalOpen, setGlobalOpen] = useState(false);
            const [openOverrides, setOpenOverrides] = useState({});

            const isOpen = (index) => {
                if (openOverrides[index] !== undefined) {
                    return openOverrides[index];
                }
                return globalOpen;
            };

            const toggleAnswer = (index) => {
                setOpenOverrides((prev) => ({
                    ...prev,
                    [index]: !isOpen(index)
                }));
            };

            const showAll = () => {
                setGlobalOpen(true);
                setOpenOverrides({});
            };

            const hideAll = () => {
                setGlobalOpen(false);
                setOpenOverrides({});
            };

            if (mcqList.length === 0) {
                return <div className="text-sm text-slate-400">এখনো কোন MCQ প্রশ্ন যোগ করা হয়নি।</div>;
            }

            return (
                <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-500">
                        <span>মোট প্রশ্ন: {toBanglaNumber(mcqList.length)}</span>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={showAll}
                                className="px-3 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition"
                            >
                                সকল উত্তর দেখুন
                            </button>
                            <button
                                onClick={hideAll}
                                className="px-3 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition"
                            >
                                সকল উত্তর লুকান
                            </button>
                        </div>
                    </div>
                    <div className="border-y border-slate-200 divide-y">
                        {mcqList.map((entry, index) => (
                            <div key={entry.question + '-' + index} className="px-4 py-4">
                                <div className="text-sm font-semibold text-slate-900">
                                    {toBanglaNumber(index + 1)}. {entry.question}
                                </div>
                                <div className="mt-2 grid gap-1 text-sm text-slate-700">
                                    {(entry.options || []).map((option, optionIndex) => (
                                        <div key={entry.question + '-' + optionIndex}>
                                            {optionLabels[optionIndex]}. {option}
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                                    <button
                                        onClick={() => toggleAnswer(index)}
                                        className="px-3 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition"
                                    >
                                        {isOpen(index) ? 'উত্তর লুকান' : 'উত্তর দেখুন'}
                                    </button>
                                    {isOpen(index) && (
                                        <div className="text-emerald-700 font-semibold">
                                            উত্তর: {optionLabels[entry.answerIndex]}। {entry.options?.[entry.answerIndex]}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        };


`;
