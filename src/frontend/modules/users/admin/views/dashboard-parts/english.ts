export const dashboardEnglish = `
        const EnglishFirstPaperHome = ({ classLabel, onNavigate }) => {
            const groupRoute = classLabel === 'SSC' ? 'admin-groups-ssc' : 'admin-groups-hsc';
            const readingRoute = classLabel === 'SSC' ? 'english-ssc-reading' : 'english-hsc-reading';
            const writingRoute = classLabel === 'SSC' ? 'english-ssc-writing' : 'english-hsc-writing';
            return (
                <AdminShell title="English 1st Paper" subtitle={\`\${classLabel} section overview for Reading and Writing.\`} activeTab="classes" onNavigate={onNavigate}>
                    <div className="flex justify-between items-center">
                        <button onClick={() => onNavigate(groupRoute)} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Back</button>
                        <button onClick={() => onNavigate('dashboard')} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Dashboard</button>
                    </div>
                    <div className="grid card-grid-gap sm:grid-cols-2">
                        <button onClick={() => onNavigate(readingRoute)} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 text-left hover:bg-gray-50 transition"><div className="text-xs uppercase tracking-[0.2em] text-gray-400">Section</div><div className="text-lg font-semibold text-gray-900 mt-2">Reading</div><p className="text-sm text-gray-500 mt-2">MCQ, comprehension, and passage-based tasks.</p></button>
                        <button onClick={() => onNavigate(writingRoute)} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 text-left hover:bg-gray-50 transition"><div className="text-xs uppercase tracking-[0.2em] text-gray-400">Section</div><div className="text-lg font-semibold text-gray-900 mt-2">Writing</div><p className="text-sm text-gray-500 mt-2">Paragraphs, stories, letters, and analysis tasks.</p></button>
                    </div>
                </AdminShell>
            );
        };

        const EnglishSectionList = ({ title, subtitle, items, onBack, onSelect, onNavigate }) => (
            <AdminShell title={title} subtitle={subtitle} activeTab="classes" onNavigate={onNavigate}>
                <div className="flex justify-between items-center">
                    <button onClick={onBack} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Back</button>
                    <button onClick={() => onNavigate('dashboard')} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Dashboard</button>
                </div>
                <div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-sm divide-y">
                    {items.map((item) => (
                        <button key={item.key} onClick={() => onSelect(item)} className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
                            <div className="text-left space-y-1"><div className="text-xs uppercase tracking-[0.2em] text-gray-400">Question Type</div><div className="text-base font-semibold text-gray-900">{item.label}</div>{item.description && <p className="text-xs text-gray-500">{item.description}</p>}{item.children?.length > 0 && <p className="text-xs text-blue-500">Includes {item.children.map((child) => child.label).join(', ')}</p>}</div><span className="text-xs uppercase tracking-[0.2em] text-blue-600">Open</span>
                        </button>
                    ))}
                    {items.length === 0 && <div className="px-5 py-4 text-sm text-gray-400">No question types configured yet.</div>}
                </div>
            </AdminShell>
        );

        const EnglishQuestionList = ({ title, subtitle, questions, onAdd, onUpdate, onDelete, onBack, onNavigate }) => {
            const [questionInput, setQuestionInput] = useState('');
            const [answerInput, setAnswerInput] = useState('');
            const [starRating, setStarRating] = useState(0);
            const [editingIndex, setEditingIndex] = useState(null);
            const [isModalOpen, setIsModalOpen] = useState(false);
            const resetForm = () => { setQuestionInput(''); setAnswerInput(''); setStarRating(0); setEditingIndex(null); };
            const normalizeStars = (value) => Math.max(0, Math.min(5, Number(value) || 0));
            const handleSave = () => {
                const trimmedQuestion = questionInput.trim();
                const trimmedAnswer = answerInput.trim();
                if (!trimmedQuestion || !trimmedAnswer) return;
                const payload = { question: trimmedQuestion, answer: trimmedAnswer, stars: normalizeStars(starRating) };
                if (editingIndex === null) { onAdd(payload); } else { onUpdate(editingIndex, payload); }
                resetForm(); setIsModalOpen(false);
            };
            return (
                <AdminShell title={title} subtitle={subtitle} activeTab="classes" onNavigate={onNavigate}>
                    <div className="flex flex-wrap gap-3 justify-between items-center">
                        <button onClick={onBack} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Back</button>
                        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition">Add Question</button>
                    </div>
                    <div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-sm divide-y">
                        {questions.length === 0 && <div className="px-5 py-4 text-sm text-gray-400">No questions added yet.</div>}
                        {questions.map((entry, index) => (
                            <div key={index} className="px-5 py-4 text-sm text-gray-700 space-y-2">
                                <div className="font-semibold text-gray-900">Q{index + 1}. {entry.question}</div>
                                {normalizeStars(entry.stars) > 0 && <div className="text-[10px] text-amber-500">{'★'.repeat(normalizeStars(entry.stars))}</div>}
                                <div className="text-sm text-gray-600">Answer: {entry.answer}</div>
                                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                                    <button onClick={() => { setEditingIndex(index); setQuestionInput(entry.question); setAnswerInput(entry.answer); setStarRating(normalizeStars(entry.stars)); setIsModalOpen(true); }} className="px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Edit</button>
                                    <button onClick={() => { const shouldDelete = window.confirm('Delete this question?'); if (shouldDelete) { onDelete(index); } }} className="px-2 py-1 rounded-md border border-red-100 text-red-500 hover:bg-red-50 transition">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center px-4 py-6 z-50">
                            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900">{editingIndex === null ? 'Add question' : 'Update question'}</h3>
                                <p className="text-sm text-gray-500 mt-1">Provide the question prompt and answer.</p>
                                <textarea value={questionInput} onChange={(event) => setQuestionInput(event.target.value)} placeholder="Question prompt" rows={3} className="mt-4 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
                                <textarea value={answerInput} onChange={(event) => setAnswerInput(event.target.value)} placeholder="Answer" rows={3} className="mt-4 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
                                <div className="mt-4">
                                    <label className="text-xs uppercase tracking-[0.2em] text-gray-400">Importance (Stars)</label>
                                    <div className="mt-2 flex items-center gap-2 text-xs">
                                        <button onClick={() => setStarRating(0)} className={'text-xs px-2 py-1 rounded-md border ' + (starRating === 0 ? 'border-amber-400 text-amber-600' : 'border-gray-200 text-gray-500')}>No Star</button>
                                        <div className="flex items-center gap-1 text-xs">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button key={star} onClick={() => setStarRating(star)} className={star <= starRating ? 'text-amber-400' : 'text-slate-200'}>★</button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 flex justify-end gap-2"><button onClick={() => { setIsModalOpen(false); resetForm(); }} className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Cancel</button><button onClick={handleSave} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition">Save</button></div>
                            </div>
                        </div>
                    )}
                </AdminShell>
            );
        };
`;
