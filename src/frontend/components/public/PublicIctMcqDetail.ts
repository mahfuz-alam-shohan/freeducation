export const PublicIctMcqDetail =`

        const PublicIctMcqDetail = ({ classLabel, chapter, mcqQuestions, getQuestionKey, onBack, onNavigate }) => {
            const chapterKey = chapter?.id || '';
            const mcqList = mcqQuestions[getQuestionKey(classLabel, 'ICT', chapterKey, 'mcq')] || [];
            const chapterTitle = chapter?.name || 'অধ্যায় নির্বাচন করুন';

            return (
                <PublicIctShell
                    title="আইসিটি বহুনির্বাচনী"
                    subtitle="অধ্যায় অনুযায়ী প্রশ্ন সমূহ"
                    classLabel={classLabel}
                    onBack={onBack}
                    onNavigate={onNavigate}
                >
                    <div className="space-y-6 font-bangla">
                        <div className="text-center">
                            <div className="text-xs uppercase tracking-[0.3em] text-slate-400">অধ্যায়</div>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-2">{chapterTitle}</h2>
                        </div>
                        <PublicMcqList mcqList={mcqList} />
                    </div>
                </PublicIctShell>
            );
        };

`;
