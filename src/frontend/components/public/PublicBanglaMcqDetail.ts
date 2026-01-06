export const PublicBanglaMcqDetail =`
const PublicBanglaMcqDetail = ({
            classLabel,
            itemName,
            categoryName,
            mcqQuestions,
            getQuestionKey,
            onNavigate
        }) => {
            const itemRoute = classLabel === 'SSC' ? 'public-bangla-ssc-item' : 'public-bangla-hsc-item';
            const mcqList = mcqQuestions[getQuestionKey(classLabel, categoryName, itemName, 'mcq')] || [];
            const chapterTitle = itemName || 'পাঠ নির্বাচন করুন';

            return (
                <PublicBanglaShell
                    title="বহুনির্বাচনী প্রশ্ন"
                    subtitle={categoryName ? 'বিভাগ: ' + categoryName : ''}
                    onBack={() => onNavigate(itemRoute)}
                    onNavigate={onNavigate}
                >
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
