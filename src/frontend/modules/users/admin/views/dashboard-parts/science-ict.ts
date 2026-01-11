export const dashboardScience = `
        const IctChapterList = ({ classLabel, subjectLabel, chapters, onAdd, onUpdate, onDelete, onSelect, onBack, onNavigate, canManageStructure, canManageThumbnails }) => {
            const [chapterThumbnails, setChapterThumbnails] = useThumbnailMap('/api/chapter-thumbnails', 'chapterKey');
            const [activeThumbnail, setActiveThumbnail] = useState(null);
            const [isModalOpen, setIsModalOpen] = useState(false);
            const [chapterName, setChapterName] = useState('');
            const [chapterStars, setChapterStars] = useState(0);
            const [editingChapter, setEditingChapter] = useState(null);
            const [thumbnailFile, setThumbnailFile] = useState(null);
            const resetForm = () => { setChapterName(''); setChapterStars(0); setEditingChapter(null); setThumbnailFile(null); };
            const handleSave = async () => {
                const trimmed = chapterName.trim();
                if (!trimmed) return;
                const token = localStorage.getItem('auth_token');
                const uploadThumbnail = async (chapterKey) => {
                    if (!thumbnailFile || !token) return;
                    const formData = new FormData();
                    formData.append('chapterKey', chapterKey);
                    formData.append('file', thumbnailFile);
                    const response = await fetch('/api/chapter-thumbnails', { method: 'POST', headers: { Authorization: 'Bearer ' + token }, body: formData });
                    const data = await response.json();
                    if (response.ok && data.success) { setChapterThumbnails((prev) => ({ ...prev, [data.thumbnail.chapterKey]: { url: data.thumbnail.url } })); }
                };
                if (editingChapter) {
                    onUpdate(editingChapter.id, { name: trimmed, stars: Math.max(0, Math.min(5, Number(chapterStars) || 0)) });
                    const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, editingChapter.id);
                    await uploadThumbnail(chapterKey);
                } else {
                    const nextId = \`\${Date.now()}-\${Math.random().toString(16).slice(2)}\`;
                    onAdd({ id: nextId, name: trimmed, stars: Math.max(0, Math.min(5, Number(chapterStars) || 0)) });
                    const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, nextId);
                    await uploadThumbnail(chapterKey);
                }
                resetForm(); setIsModalOpen(false);
            };
            return (
                <AdminShell title={classLabel + ' ICT'} subtitle={classLabel + ' আইসিটি অধ্যায় যোগ করুন এবং MCQ তৈরি করুন।'} activeTab="classes" onNavigate={onNavigate}>
                    <div className="flex flex-wrap gap-3 justify-between items-center font-bangla"><button onClick={onBack} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Back</button>{canManageStructure && <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition">অধ্যায় যোগ করুন</button>}</div>
                    <div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-sm divide-y font-bangla">
                        {chapters.length === 0 && <div className="px-5 py-4 text-sm text-gray-400">এখনো কোন অধ্যায় যোগ করা হয়নি।</div>}
                        {chapters.map((chapter) => (
                            <div key={chapter.id} className="w-full flex flex-wrap gap-3 items-center justify-between px-5 py-4 text-sm font-semibold text-gray-700">
                                <div>
                                    <div>{chapter.name}</div>
                                    {Number(chapter.stars) > 0 && (
                                        <div className="mt-1 text-[10px] text-amber-500">{'★'.repeat(Math.min(5, Number(chapter.stars)))}</div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-xs font-semibold">
                                    {canManageStructure && <button onClick={() => { setEditingChapter(chapter); setChapterName(chapter.name); setChapterStars(Number(chapter.stars) || 0); setIsModalOpen(true); }} className="px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Rename</button>}
                                    {canManageThumbnails && <button onClick={() => setActiveThumbnail({ title: chapter.name, chapterKey: makeChapterThumbnailKey(classLabel, subjectLabel, chapter.id) })} className="px-2 py-1 rounded-md border border-blue-100 text-blue-600 hover:bg-blue-50 transition">Thumbnail</button>}
                                    {canManageStructure && <button onClick={() => { const shouldRemove = window.confirm('আপনি কি এই অধ্যায়টি মুছে ফেলতে চান?'); if (shouldRemove) { onDelete(chapter.id); } }} className="px-2 py-1 rounded-md border border-red-100 text-red-500 hover:bg-red-50 transition">Delete</button>}
                                    <button onClick={() => onSelect(chapter)} className="text-xs uppercase tracking-[0.2em] text-blue-600 hover:text-blue-500 transition">MCQ যোগ করুন</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {isModalOpen && canManageStructure && (
                        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center px-4 py-6 z-50">
                            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 font-bangla">
                                <h3 className="text-lg font-semibold text-gray-900">{editingChapter ? 'অধ্যায় সম্পাদনা করুন' : 'নতুন অধ্যায় যোগ করুন'}</h3>
                                <p className="text-sm text-gray-500 mt-1">আইসিটি অধ্যায়ের নাম লিখুন।</p>
                                <input value={chapterName} onChange={(event) => setChapterName(event.target.value)} placeholder="উদাহরণ: তথ্য ও যোগাযোগ প্রযুক্তি" className="mt-4 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
                                <div className="mt-4">
                                    <label className="text-xs uppercase tracking-[0.2em] text-gray-400">স্টার</label>
                                    <div className="mt-2 flex items-center gap-2 text-xs">
                                        <button onClick={() => setChapterStars(0)} className={'px-2 py-1 rounded-md border ' + (chapterStars === 0 ? 'border-amber-400 text-amber-600' : 'border-gray-200 text-gray-500')}>No Star</button>
                                        <div className="flex items-center gap-1 text-sm">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button key={star} onClick={() => setChapterStars(star)} className={star <= chapterStars ? 'text-amber-400' : 'text-slate-200'}>★</button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {canManageThumbnails && (<div className="mt-4"><label className="text-xs uppercase tracking-[0.2em] text-gray-400">Thumbnail</label><input type="file" accept="image/*" onChange={async (event) => { const selected = event.target.files?.[0]; if (!selected) { setThumbnailFile(null); return; } const resized = await resizeImageFile(selected); setThumbnailFile(resized || null); }} className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" /><p className="text-xs text-gray-400 mt-2">Upload now or edit later from the chapter list.</p></div>)}
                                <div className="mt-5 flex justify-end gap-2"><button onClick={() => { setIsModalOpen(false); resetForm(); }} className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Cancel</button><button onClick={handleSave} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition">Save</button></div>
                            </div>
                        </div>
                    )}
                    {activeThumbnail && canManageThumbnails && <ThumbnailUploadModal title={activeThumbnail.title} description="Upload a thumbnail for this ICT chapter." uploadUrl="/api/chapter-thumbnails" keyField="chapterKey" itemKey={activeThumbnail.chapterKey} existingUrl={chapterThumbnails[activeThumbnail.chapterKey]?.url} onSaved={(thumbnail) => { setChapterThumbnails((prev) => ({ ...prev, [thumbnail.chapterKey]: { url: thumbnail.url } })); setActiveThumbnail(null); }} onClose={() => setActiveThumbnail(null)} />}
                </AdminShell>
            );
        };

        const ReligionSelectionList = ({ classLabel, options, onSelect, onBack, onNavigate }) => (
            <AdminShell title="Religion and Moral Education" subtitle="ধর্ম নির্বাচন করুন এবং অধ্যায় পরিচালনা করুন।" activeTab="classes" onNavigate={onNavigate}>
                <div className="flex justify-between items-center"><button onClick={onBack} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Back</button><div className="text-xs uppercase tracking-[0.2em] text-gray-400">{classLabel}</div></div>
                <div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-sm divide-y font-bangla">
                    {options.map((option) => (
                        <button key={option.key} onClick={() => onSelect(option)} className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
                            <div className="text-left"><div className="text-xs uppercase tracking-[0.2em] text-gray-300">ধর্ম</div><div className="text-base font-semibold text-gray-900 mt-1">{option.label}</div><p className="text-xs text-gray-500 mt-2">{option.subtitle}</p></div><span className="text-xs uppercase tracking-[0.2em] text-blue-600">Open</span>
                        </button>
                    ))}
                </div>
            </AdminShell>
        );

        const ScienceChapterList = ({ classLabel, subjectLabel, chapters, onAdd, onUpdate, onDelete, onSelect, onNavigate, onBack, canManageStructure, canManageThumbnails }) => {
            const [chapterThumbnails, setChapterThumbnails] = useThumbnailMap('/api/chapter-thumbnails', 'chapterKey');
            const [activeThumbnail, setActiveThumbnail] = useState(null);
            const [isModalOpen, setIsModalOpen] = useState(false);
            const [chapterName, setChapterName] = useState('');
            const [chapterStars, setChapterStars] = useState(0);
            const [editingChapter, setEditingChapter] = useState(null);
            const [thumbnailFile, setThumbnailFile] = useState(null);
            const resetForm = () => { setChapterName(''); setChapterStars(0); setEditingChapter(null); setThumbnailFile(null); };
            const handleSave = async () => {
                const trimmed = chapterName.trim();
                if (!trimmed) return;
                const token = localStorage.getItem('auth_token');
                const uploadThumbnail = async (chapterKey) => {
                    if (!thumbnailFile || !token) return;
                    const formData = new FormData();
                    formData.append('chapterKey', chapterKey);
                    formData.append('file', thumbnailFile);
                    const response = await fetch('/api/chapter-thumbnails', { method: 'POST', headers: { Authorization: 'Bearer ' + token }, body: formData });
                    const data = await response.json();
                    if (response.ok && data.success) { setChapterThumbnails((prev) => ({ ...prev, [data.thumbnail.chapterKey]: { url: data.thumbnail.url } })); }
                };
                if (editingChapter) {
                    onUpdate(editingChapter.id, { name: trimmed, stars: Math.max(0, Math.min(5, Number(chapterStars) || 0)) });
                    const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, editingChapter.id);
                    await uploadThumbnail(chapterKey);
                } else {
                    const nextId = Date.now() + '-' + Math.random().toString(16).slice(2);
                    onAdd({ id: nextId, name: trimmed, topics: [], stars: Math.max(0, Math.min(5, Number(chapterStars) || 0)) });
                    const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, nextId);
                    await uploadThumbnail(chapterKey);
                }
                resetForm(); setIsModalOpen(false);
            };
            return (
                <AdminShell title={classLabel + ' ' + subjectLabel} subtitle={subjectLabel + ' অধ্যায় যোগ করুন এবং টপিক সেট করুন।'} activeTab="classes" onNavigate={onNavigate}>
                    <div className="flex flex-wrap gap-3 justify-between items-center font-bangla"><button onClick={onBack || (() => onNavigate(classLabel === 'SSC' ? 'admin-groups-ssc' : 'admin-groups-hsc'))} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Back</button>{canManageStructure && <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition">অধ্যায় যোগ করুন</button>}</div>
                    <div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-sm divide-y font-bangla">
                        {chapters.length === 0 && <div className="px-5 py-4 text-sm text-gray-400">এখনো কোন অধ্যায় যোগ করা হয়নি।</div>}
                        {chapters.map((chapter) => (
                            <div key={chapter.id} className="px-5 py-4">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <div className="text-sm font-semibold text-gray-900">{chapter.name}</div>
                                        {Number(chapter.stars) > 0 && (
                                            <div className="mt-1 text-[10px] text-amber-500">{'★'.repeat(Math.min(5, Number(chapter.stars)))}</div>
                                        )}
                                        <div className="text-xs text-gray-400 mt-1">টপিক: {(chapter.topics || []).length}</div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-semibold">
                                        {canManageStructure && <button onClick={() => { setEditingChapter(chapter); setChapterName(chapter.name); setChapterStars(Number(chapter.stars) || 0); setIsModalOpen(true); }} className="px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Edit</button>}
                                        {canManageThumbnails && <button onClick={() => setActiveThumbnail({ title: chapter.name, chapterKey: makeChapterThumbnailKey(classLabel, subjectLabel, chapter.id) })} className="px-2 py-1 rounded-md border border-blue-100 text-blue-600 hover:bg-blue-50 transition">Thumbnail</button>}
                                        {canManageStructure && <button onClick={() => { const shouldRemove = window.confirm('আপনি কি এই অধ্যায়টি মুছে ফেলতে চান?'); if (shouldRemove) { onDelete(chapter.id); } }} className="px-2 py-1 rounded-md border border-red-100 text-red-500 hover:bg-red-50 transition">Delete</button>}
                                        <button onClick={() => onSelect(chapter)} className="text-xs uppercase tracking-[0.2em] text-blue-600 hover:text-blue-500 transition">Open</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {isModalOpen && canManageStructure && (
                        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center px-4 py-6 z-50">
                            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 font-bangla">
                                <h3 className="text-lg font-semibold text-gray-900">{editingChapter ? 'অধ্যায় সম্পাদনা করুন' : 'নতুন অধ্যায় যোগ করুন'}</h3>
                                <p className="text-sm text-gray-500 mt-1">অধ্যায়ের নাম লিখুন।</p>
                                <input value={chapterName} onChange={(event) => setChapterName(event.target.value)} placeholder="উদাহরণ: অধ্যায় ১" className="mt-4 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
                                <div className="mt-4">
                                    <label className="text-xs uppercase tracking-[0.2em] text-gray-400">স্টার</label>
                                    <div className="mt-2 flex items-center gap-2 text-xs">
                                        <button onClick={() => setChapterStars(0)} className={'px-2 py-1 rounded-md border ' + (chapterStars === 0 ? 'border-amber-400 text-amber-600' : 'border-gray-200 text-gray-500')}>No Star</button>
                                        <div className="flex items-center gap-1 text-sm">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button key={star} onClick={() => setChapterStars(star)} className={star <= chapterStars ? 'text-amber-400' : 'text-slate-200'}>★</button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {canManageThumbnails && (<div className="mt-4"><label className="text-xs uppercase tracking-[0.2em] text-gray-400">Thumbnail</label><input type="file" accept="image/*" onChange={async (event) => { const selected = event.target.files?.[0]; if (!selected) { setThumbnailFile(null); return; } const resized = await resizeImageFile(selected); setThumbnailFile(resized || null); }} className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" /><p className="text-xs text-gray-400 mt-2">Upload now or edit later from the chapter list.</p></div>)}
                                <div className="mt-5 flex justify-end gap-2"><button onClick={() => { setIsModalOpen(false); resetForm(); }} className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Cancel</button><button onClick={handleSave} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition">Save</button></div>
                            </div>
                        </div>
                    )}
                    {activeThumbnail && canManageThumbnails && <ThumbnailUploadModal title={activeThumbnail.title} description="Upload a thumbnail for this chapter." uploadUrl="/api/chapter-thumbnails" keyField="chapterKey" itemKey={activeThumbnail.chapterKey} existingUrl={chapterThumbnails[activeThumbnail.chapterKey]?.url} onSaved={(thumbnail) => { setChapterThumbnails((prev) => ({ ...prev, [thumbnail.chapterKey]: { url: thumbnail.url } })); setActiveThumbnail(null); }} onClose={() => setActiveThumbnail(null)} />}
                </AdminShell>
            );
        };

        const ScienceTopicList = ({ classLabel, subjectLabel, chapter, onAddTopic, onUpdateTopic, onDeleteTopic, onSelectTopic, onBack, onNavigate, canManageStructure }) => {
            const [isModalOpen, setIsModalOpen] = useState(false);
            const [topicName, setTopicName] = useState('');
            const [topicStars, setTopicStars] = useState(0);
            const [editingTopic, setEditingTopic] = useState(null);
            const topics = chapter?.topics || [];
            const resetForm = () => { setTopicName(''); setTopicStars(0); setEditingTopic(null); };
            const handleSave = () => {
                const trimmed = topicName.trim();
                if (!trimmed || !chapter) return;
                const starsValue = Math.max(0, Math.min(5, Number(topicStars) || 0));
                if (editingTopic) { onUpdateTopic(chapter.id, editingTopic.id, { name: trimmed, stars: starsValue }); } else { const nextId = Date.now() + '-' + Math.random().toString(16).slice(2); onAddTopic(chapter.id, { id: nextId, name: trimmed, stars: starsValue }); }
                resetForm(); setIsModalOpen(false);
            };
            return (
                <AdminShell title={subjectLabel + ' টপিকসমূহ'} subtitle={(chapter?.name || 'অধ্যায়') + ' এর টপিক নির্বাচন করুন।'} activeTab="classes" onNavigate={onNavigate}>
                    <div className="flex flex-wrap gap-3 justify-between items-center font-bangla"><button onClick={onBack} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Back</button>{canManageStructure && <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition">টপিক যোগ করুন</button>}</div>
                    <div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-sm divide-y font-bangla">
                        {topics.length === 0 && <div className="px-5 py-4 text-sm text-gray-400">এখনো কোন টপিক যোগ করা হয়নি।</div>}
                        {topics.map((topic) => (
                            <div key={topic.id} className="px-5 py-4">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <div className="text-sm font-semibold text-gray-900">{topic.name}</div>
                                        {Number(topic.stars) > 0 && (
                                            <div className="mt-1 text-[10px] text-amber-500">{'★'.repeat(Math.min(5, Number(topic.stars)))}</div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-semibold">
                                        {canManageStructure && <button onClick={() => { setEditingTopic(topic); setTopicName(topic.name); setTopicStars(Number(topic.stars) || 0); setIsModalOpen(true); }} className="px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Edit</button>}
                                        {canManageStructure && <button onClick={() => { const shouldRemove = window.confirm('আপনি কি এই টপিকটি মুছে ফেলতে চান?'); if (shouldRemove && chapter) { onDeleteTopic(chapter.id, topic.id); } }} className="px-2 py-1 rounded-md border border-red-100 text-red-500 hover:bg-red-50 transition">Delete</button>}
                                        <button onClick={() => onSelectTopic(topic)} className="text-xs uppercase tracking-[0.2em] text-blue-600 hover:text-blue-500 transition">Open</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {isModalOpen && canManageStructure && (
                        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center px-4 py-6 z-50">
                            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 font-bangla">
                                <h3 className="text-lg font-semibold text-gray-900">{editingTopic ? 'টপিক সম্পাদনা করুন' : 'নতুন টপিক যোগ করুন'}</h3>
                                <p className="text-sm text-gray-500 mt-1">টপিকের নাম লিখুন।</p>
                                <input value={topicName} onChange={(event) => setTopicName(event.target.value)} placeholder="উদাহরণ: বল এবং গতি" className="mt-4 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
                                <div className="mt-4">
                                    <label className="text-xs uppercase tracking-[0.2em] text-gray-400">স্টার</label>
                                    <div className="mt-2 flex items-center gap-2 text-xs">
                                        <button onClick={() => setTopicStars(0)} className={'px-2 py-1 rounded-md border ' + (topicStars === 0 ? 'border-amber-400 text-amber-600' : 'border-gray-200 text-gray-500')}>No Star</button>
                                        <div className="flex items-center gap-1 text-sm">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button key={star} onClick={() => setTopicStars(star)} className={star <= topicStars ? 'text-amber-400' : 'text-slate-200'}>★</button>
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

        const ScienceTopicDetail = ({ classLabel, subjectLabel, chapter, topic, noteKey, notesByItem, videosByItem, onUpdateNotes, onUpdateVideos, onBack, onNavigateCq, onNavigateMcq, onNavigate }) => {
            const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
            const [noteInput, setNoteInput] = useState('');
            const [noteStars, setNoteStars] = useState(0);
            const [editingNoteIndex, setEditingNoteIndex] = useState(null);
            const notes = (notesByItem || {})[noteKey] || [];
            const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            const toBanglaNumber = (value) => String(value).split('').map((digit) => banglaDigits[Number(digit)] ?? digit).join('');
            const normalizedNote = (note) => {
                if (!note) return { text: '', stars: 0 };
                if (typeof note === 'string') return { text: note, stars: 0 };
                return { text: note.text || note.note || '', stars: Math.max(0, Math.min(5, Number(note.stars) || 0)) };
            };
            const openNoteModal = (index = null) => {
                const resolved = index === null ? { text: '', stars: 0 } : normalizedNote(notes[index]);
                setEditingNoteIndex(index);
                setNoteInput(resolved.text);
                setNoteStars(resolved.stars);
                setIsNoteModalOpen(true);
            };
            const handleNoteSave = () => {
                const trimmed = noteInput.trim();
                if (!trimmed) return;
                const payload = { text: trimmed, stars: Math.max(0, Math.min(5, Number(noteStars) || 0)) };
                if (onUpdateNotes) { onUpdateNotes((prev) => { const current = prev && prev[noteKey] ? [...prev[noteKey]] : []; if (editingNoteIndex === null) { current.push(payload); } else { current[editingNoteIndex] = payload; } return { ...prev, [noteKey]: current }; }); }
                setIsNoteModalOpen(false); setNoteInput(''); setNoteStars(0); setEditingNoteIndex(null);
            };
            const renderStars = (value) => (
                <div className="flex items-center gap-1 text-[10px]">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={star <= value ? 'text-amber-400' : 'text-slate-200'}>★</span>
                    ))}
                </div>
            );
            return (
                <AdminShell title={subjectLabel + ' • ' + (topic?.name || 'টপিক')} subtitle={chapter?.name ? 'অধ্যায়: ' + chapter.name : 'টপিকের তথ্য যোগ করুন।'} activeTab="classes" onNavigate={onNavigate}>
                    <div className="flex flex-wrap gap-3 justify-between items-center font-bangla"><button onClick={onBack} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Back</button><button onClick={() => onNavigate('dashboard')} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Dashboard</button></div>
                    <div className="mt-4 grid card-grid-gap sm:grid-cols-2 font-bangla">
                        <button onClick={onNavigateCq} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 text-left hover:bg-gray-50 transition"><div className="text-xs uppercase tracking-[0.2em] text-gray-300">ধরণ</div><div className="text-lg font-semibold text-gray-900 mt-2">সৃজনশীল (CQ)</div><p className="text-sm text-gray-500 mt-2">জ্ঞান ও অনুধাবন প্রশ্ন যোগ করুন</p></button>
                        <button onClick={onNavigateMcq} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 text-left hover:bg-gray-50 transition"><div className="text-xs uppercase tracking-[0.2em] text-gray-300">ধরণ</div><div className="text-lg font-semibold text-gray-900 mt-2">বহুনির্বাচনী (MCQ)</div><p className="text-sm text-gray-500 mt-2">MCQ প্রশ্ন তৈরি করুন</p></button>
                    </div>
                    <div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
                        <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100"><div><div className="text-xs uppercase tracking-[0.2em] text-gray-300">নোটস</div><div className="text-sm font-semibold text-gray-700 mt-1">টপিকের মূল তথ্য যোগ করুন</div></div><button onClick={() => openNoteModal()} className="px-3 py-2 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">নোট যোগ করুন</button></div>
                        <ul className="divide-y">{notes.length === 0 && <li className="px-4 py-3 text-sm text-gray-400">এখনো কোন নোট যোগ করা হয়নি।</li>}{notes.map((note, index) => { const resolved = normalizedNote(note); return (<li key={noteKey + '-' + index} className="px-4 py-3 flex items-start gap-3"><span className="text-sm font-semibold text-gray-500">{toBanglaNumber(index + 1)}.</span><div className="flex-1"><div className="text-sm text-gray-700">{resolved.text}</div>{resolved.stars > 0 && <div className="mt-1 text-[10px]">{renderStars(resolved.stars)}</div>}</div><button onClick={() => openNoteModal(index)} className="text-gray-400 hover:text-gray-600 transition" title="নোট সম্পাদনা করুন">✎</button></li>); })}</ul>
                    </div>
                    <VideoManager noteKey={noteKey} videosByItem={videosByItem} onUpdateVideos={onUpdateVideos} />
                    {isNoteModalOpen && (
                        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center px-4 py-6 z-50">
                            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 font-bangla">
                                <h3 className="text-lg font-semibold text-gray-900">{editingNoteIndex === null ? 'নোট যোগ করুন' : 'নোট সম্পাদনা করুন'}</h3>
                                <p className="text-sm text-gray-500 mt-1">গুরুত্বপূর্ণ তথ্য লিখুন।</p>
                                <textarea value={noteInput} onChange={(event) => setNoteInput(event.target.value)} placeholder="উদাহরণ: অধ্যায়ের মূল সূত্র..." className="mt-4 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[120px]" />
                                <div className="mt-3">
                                    <label className="text-xs uppercase tracking-[0.2em] text-gray-400">গুরুত্ব (স্টার)</label>
                                    <div className="mt-2 flex items-center gap-2">
                                        <button onClick={() => setNoteStars(0)} className={\`text-xs px-2 py-1 rounded-md border \${noteStars === 0 ? 'border-amber-400 text-amber-600' : 'border-gray-200 text-gray-500'}\`}>No Star</button>
                                        <div className="flex items-center gap-1 text-xs">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button key={star} onClick={() => setNoteStars(star)} className={star <= noteStars ? 'text-amber-400' : 'text-slate-200'}>★</button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 flex justify-end gap-2"><button onClick={() => { setIsNoteModalOpen(false); setNoteInput(''); setNoteStars(0); setEditingNoteIndex(null); }} className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Cancel</button><button onClick={handleNoteSave} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition">Save</button></div>
                            </div>
                        </div>
                    )}
                </AdminShell>
            );
        };
`;
