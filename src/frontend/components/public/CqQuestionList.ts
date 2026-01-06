export const CqQuestionList  =`
  const CqQuestionList = ({ sections }) => {
            const [openMap, setOpenMap] = useState({});
            const toggleAnswer = (sectionKey, index) => {
                setOpenMap((prev) => ({
                    ...prev,
                    [sectionKey + '-' + index]: !prev[sectionKey + '-' + index]
                }));
            };
            if (!sections.length) {
                return <div className="text-sm text-slate-400">এখনো কোন প্রশ্ন যোগ করা হয়নি।</div>;
            }
            return (
                <div className="space-y-4">
                    {sections.map((section) => (
                        <div key={section.key} className={flatSectionClass}>
                            <div className="text-sm font-semibold text-slate-900">{section.label}</div>
                            {section.items.length === 0 ? (
                                <div className="text-sm text-slate-400 mt-3">এখনো কোন প্রশ্ন যোগ করা হয়নি।</div>
                            ) : (
                                <div className="mt-4 space-y-4">
                                    {section.items.map((entry, index) => {
                                        const openKey = section.key + '-' + index;
                                        const isOpen = Boolean(openMap[openKey]);
                                        return (
                                            <div key={entry.question + '-' + index} className="space-y-2">
                                                <div className="text-sm font-semibold text-slate-800">
                                                    {section.prefix(index)}. {entry.question}
                                                </div>
                                                <button
                                                    onClick={() => toggleAnswer(section.key, index)}
                                                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition"
                                                >
                                                    {isOpen ? 'উত্তর লুকান' : 'উত্তর দেখুন'}
                                                </button>
                                                {isOpen && (
                                                    <div className="text-sm text-slate-600 border-l-2 border-slate-200 pl-3">
                                                        {entry.answer}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            );
        };

`;
