export const PublicEnglishQuestionList= `

const PublicEnglishQuestionList = ({ questions }) => (
            <div className="space-y-4 text-left">
                {questions.length === 0 && (
                    <div className="text-sm text-slate-400">No questions have been added yet.</div>
                )}
                {questions.map((entry, index) => (
                    <div key={index} className={flatSectionClass + ' space-y-2'}>
                        <div className="text-sm font-semibold text-slate-900">Q{index + 1}. {entry.question}</div>
                        <div className="text-sm text-slate-600 border-l-2 border-slate-200 pl-3">
                            Answer: {entry.answer}
                        </div>
                    </div>
                ))}
            </div>
        );
`;
