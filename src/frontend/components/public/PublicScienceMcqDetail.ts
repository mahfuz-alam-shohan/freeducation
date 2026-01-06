export const PublicScienceMcqDetail =`
        const PublicScienceMcqDetail = ({ subjectLabel, classLabel, chapterName, topicName, mcqList, onBack, onNavigate }) => (
            <PublicScienceShell
                subjectLabel={subjectLabel}
                classLabel={classLabel}
                title="বহুনির্বাচনী প্রশ্ন"
                subtitle={chapterName ? chapterName + ' • ' + (topicName || '') : topicName || ''}
                onBack={onBack}
                onNavigate={onNavigate}
            >
                <div className="space-y-6 font-bangla">
                    <PublicMcqList mcqList={mcqList} />
                </div>
            </PublicScienceShell>
        );

`;
