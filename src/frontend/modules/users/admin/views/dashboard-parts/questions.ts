export const dashboardQuestions = `
        const SrijonshilTypeList = ({ classLabel, itemName, onSelectType, onNavigate, itemRoute, questionRoute, title, subtitle }) => {
            const resolvedItemRoute = itemRoute || (classLabel === 'SSC' ? 'bangla-ssc-item' : 'bangla-hsc-item');
            const resolvedQuestionRoute = questionRoute || (classLabel === 'SSC' ? 'bangla-ssc-srijonshil-questions' : 'bangla-hsc-srijonshil-questions');
            const types = [{ key: 'gyan', label: 'জ্ঞান (ক)', description: 'জ্ঞানমূলক প্রশ্ন যোগ করুন' }, { key: 'onudhabon', label: 'অনুধাবন (খ)', description: 'অনুধাবনমূলক প্রশ্ন যোগ করুন' }];
            return (
                <AdminShell title={title || 'সৃজনশীল প্রশ্ন'} subtitle={subtitle || \`\${itemName} অধ্যায়ের প্রশ্নের ধরন নির্বাচন করুন।\`} activeTab="classes" onNavigate={onNavigate}>
                    <div className="flex justify-between items-center font-bangla">
                        <button onClick={() => onNavigate(resolvedItemRoute)} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Back</button>
                        <button onClick={() => onNavigate('dashboard')} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Dashboard</button>
                    </div>
                    <div className="mt-4 grid card-grid-gap sm:grid-cols-2 font-bangla">
                        {types.map((type) => (
                            <button key={type.key} onClick={() => { onSelectType(type); onNavigate(resolvedQuestionRoute); }} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 text-left hover:bg-gray-50 transition">
                                <div className="text-xs uppercase tracking-[0.2em] text-gray-300">ধরণ</div><div className="text-lg font-semibold text-gray-900 mt-2">{type.label}</div><p className="text-sm text-gray-500 mt-2">{type.description}</p>
                            </button>
                        ))}
                    </div>
                </AdminShell>
            );
        };

        const SrijonshilQuestionList = ({ classLabel, itemName, typeLabel, questions, onAdd, onUpdate, onDelete, onNavigate, typeRoute }) => {
            const resolvedTypeRoute = typeRoute || (classLabel === 'SSC' ? 'bangla-ssc-srijonshil-types' : 'bangla-hsc-srijonshil-types');
            const [isModalOpen, setIsModalOpen] = useState(false);
            const [questionInput, setQuestionInput] = useState('');
            const [answerInput, setAnswerInput] = useState('');
            const [editingIndex, setEditingIndex] = useState(null);
            const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            const toBanglaNumber = (value) => String(value).split('').map((digit) => banglaDigits[Number(digit)] ?? digit).join('');
            const resetForm = () => { setQuestionInput(''); setAnswerInput(''); setEditingIndex(null); };
            const handleSave = () => {
                const trimmedQuestion = questionInput.trim();
                const trimmedAnswer = answerInput.trim();
                if (!trimmedQuestion || !trimmedAnswer) return;
                if (editingIndex === null) { onAdd({ question: trimmedQuestion, answer: trimmedAnswer }); } else { onUpdate(editingIndex, { question: trimmedQuestion, answer: trimmedAnswer }); }
                resetForm(); setIsModalOpen(false);
            };
            return (
                <AdminShell title={typeLabel} subtitle={\`\${itemName} অধ্যায়ের প্রশ্ন যোগ করুন।\`} activeTab="classes" onNavigate={onNavigate}>
                    <div className="flex flex-wrap gap-3 justify-between items-center font-bangla">
                        <button onClick={() => onNavigate(resolvedTypeRoute)} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Back</button>
                        <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition">প্রশ্ন যোগ করুন</button>
                    </div>
                    <div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-sm divide-y font-bangla">
                        {questions.length === 0 && <div className="px-5 py-4 text-sm text-gray-400">এখনো কোন প্রশ্ন যোগ করা হয়নি।</div>}
                        {questions.map((entry, index) => (
                            <div key={\`\${entry.question}-\${index}\`} className="px-5 py-4">
                                <div className="flex flex-wrap gap-3 items-start justify-between">
                                    <div className="flex-1">
                                        <div className="text-sm font-semibold text-gray-800">{toBanglaNumber(index + 1)}. {entry.question}</div>
                                        <details className="mt-2 text-sm text-gray-600"><summary className="cursor-pointer text-blue-600">উত্তর দেখুন</summary><div className="mt-2 border-l-2 border-blue-100 pl-3 text-gray-700">{entry.answer}</div></details>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-semibold">
                                        <button onClick={() => { setEditingIndex(index); setQuestionInput(entry.question); setAnswerInput(entry.answer); setIsModalOpen(true); }} className="px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Edit</button>
                                        <button onClick={() => { const shouldRemove = window.confirm('আপনি কি এই প্রশ্নটি মুছে ফেলতে চান?'); if (shouldRemove) { onDelete(index); } }} className="px-2 py-1 rounded-md border border-red-100 text-red-500 hover:bg-red-50 transition">Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center px-4 py-6 z-50">
                            <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 font-bangla">
                                <h3 className="text-lg font-semibold text-gray-900">{editingIndex === null ? 'নতুন প্রশ্ন যোগ করুন' : 'প্রশ্ন সম্পাদনা করুন'}</h3>
                                <div className="mt-4"><label className="text-xs uppercase tracking-[0.2em] text-gray-400">প্রশ্ন</label><textarea value={questionInput} onChange={(event) => setQuestionInput(event.target.value)} placeholder="প্রশ্ন লিখুন" className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[100px]" /></div>
                                <div className="mt-4"><label className="text-xs uppercase tracking-[0.2em] text-gray-400">উত্তর</label><textarea value={answerInput} onChange={(event) => setAnswerInput(event.target.value)} placeholder="উত্তর লিখুন" className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[100px]" /></div>
                                <div className="mt-5 flex justify-end gap-2"><button onClick={() => { setIsModalOpen(false); resetForm(); }} className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Cancel</button><button onClick={handleSave} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition">Save</button></div>
                            </div>
                        </div>
                    )}
                </AdminShell>
            );
        };

        const McqQuestionList = ({ classLabel, itemName, questions, onAdd, onUpdate, onDelete, onNavigate, itemRoute }) => {
            const backRoute = itemRoute || (classLabel === 'SSC' ? 'bangla-ssc-item' : 'bangla-hsc-item');
            const [isModalOpen, setIsModalOpen] = useState(false);
            const [questionInput, setQuestionInput] = useState('');
            const [optionsInput, setOptionsInput] = useState(['', '', '', '']);
            const [answerIndex, setAnswerIndex] = useState(0);
            const [starRating, setStarRating] = useState(0);
            const [editingIndex, setEditingIndex] = useState(null);
            const optionLabels = ['ক', 'খ', 'গ', 'ঘ'];
            const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            const toBanglaNumber = (value) => String(value).split('').map((digit) => banglaDigits[Number(digit)] ?? digit).join('');
            const resetForm = () => { setQuestionInput(''); setOptionsInput(['', '', '', '']); setAnswerIndex(0); setStarRating(0); setEditingIndex(null); };
            const normalizeStars = (value) => Math.max(0, Math.min(5, Number(value) || 0));
            const renderStars = (value) => (
                <div className="flex items-center gap-1 text-[10px]">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={star <= value ? 'text-amber-400' : 'text-slate-200'}>★</span>
                    ))}
                </div>
            );
            const handleSave = () => {
                const trimmedQuestion = questionInput.trim();
                const trimmedOptions = optionsInput.map((option) => option.trim());
                if (!trimmedQuestion || trimmedOptions.some((option) => !option)) return;
                const payload = { question: trimmedQuestion, options: trimmedOptions, answerIndex, stars: normalizeStars(starRating) };
                if (editingIndex === null) { onAdd(payload); } else { onUpdate(editingIndex, payload); }
                resetForm(); setIsModalOpen(false);
            };
            return (
                <AdminShell title="বহুনির্বাচনী" subtitle={\`\${itemName} অধ্যায়ের MCQ যোগ করুন।\`} activeTab="classes" onNavigate={onNavigate}>
                    <div className="flex flex-wrap gap-3 justify-between items-center font-bangla">
                        <button onClick={() => onNavigate(backRoute)} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Back</button>
                        <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition">MCQ যোগ করুন</button>
                    </div>
                    <div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-sm divide-y font-bangla">
                        {questions.length === 0 && <div className="px-5 py-4 text-sm text-gray-400">এখনো কোন MCQ যোগ করা হয়নি।</div>}
                        {questions.map((entry, index) => (
                            <div key={\`\${entry.question}-\${index}\`} className="px-5 py-4">
                                <div className="flex flex-wrap gap-3 items-start justify-between">
                                    <div className="flex-1">
                                        <div className="text-sm font-semibold text-gray-800">{toBanglaNumber(index + 1)}. {entry.question}</div>
                                        {normalizeStars(entry.stars) > 0 && <div className="mt-1">{renderStars(normalizeStars(entry.stars))}</div>}
                                        <div className="mt-2 grid gap-1 text-sm text-gray-600">{entry.options.map((option, optionIndex) => (<div key={\`\${option}-\${optionIndex}\`}>{optionLabels[optionIndex]}. {option}</div>))}</div>
                                        <div className="mt-2 text-sm text-gray-700">উত্তর: {optionLabels[entry.answerIndex]}। {entry.options[entry.answerIndex]}</div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-semibold">
                                        <button onClick={() => { setEditingIndex(index); setQuestionInput(entry.question); setOptionsInput(entry.options); setAnswerIndex(entry.answerIndex); setStarRating(normalizeStars(entry.stars)); setIsModalOpen(true); }} className="px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Edit</button>
                                        <button onClick={() => { const shouldRemove = window.confirm('আপনি কি এই MCQ মুছে ফেলতে চান?'); if (shouldRemove) { onDelete(index); } }} className="px-2 py-1 rounded-md border border-red-100 text-red-500 hover:bg-red-50 transition">Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center px-4 py-6 z-50">
                            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-4 font-bangla">
                                <h3 className="text-lg font-semibold text-gray-900">{editingIndex === null ? 'নতুন MCQ যোগ করুন' : 'MCQ সম্পাদনা করুন'}</h3>
                                <div className="mt-3"><label className="text-xs uppercase tracking-[0.2em] text-gray-400">প্রশ্ন</label><textarea value={questionInput} onChange={(event) => setQuestionInput(event.target.value)} placeholder="প্রশ্ন লিখুন" className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[60px]" /></div>
                                <div className="mt-3 grid gap-2 sm:grid-cols-2">{optionsInput.map((option, optionIndex) => (<div key={\`option-\${optionIndex}\`} className="flex flex-col gap-1"><label className="text-[10px] uppercase tracking-[0.2em] text-gray-400">অপশন {optionLabels[optionIndex]}</label><input value={option} onChange={(event) => { const nextOptions = [...optionsInput]; nextOptions[optionIndex] = event.target.value; setOptionsInput(nextOptions); }} placeholder={\`অপশন \${optionLabels[optionIndex]}\`} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" /></div>))}</div>
                                <div className="mt-3"><label className="text-xs uppercase tracking-[0.2em] text-gray-400">সঠিক উত্তর</label><div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-600">{optionLabels.map((label, optionIndex) => (<label key={label} className="flex items-center gap-2"><input type="radio" name="mcq-answer" checked={answerIndex === optionIndex} onChange={() => setAnswerIndex(optionIndex)} />{label}</label>))}</div></div>
                                <div className="mt-3">
                                    <label className="text-xs uppercase tracking-[0.2em] text-gray-400">গুরুত্ব (স্টার)</label>
                                    <div className="mt-2 flex items-center gap-2">
                                        <button onClick={() => setStarRating(0)} className={`text-xs px-2 py-1 rounded-md border ${starRating === 0 ? 'border-amber-400 text-amber-600' : 'border-gray-200 text-gray-500'}`}>No Star</button>
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
