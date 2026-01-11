export const dashboardBangla = `
        const BanglaFirstPaperTopics = ({ classLabel, onNavigate, canManageThumbnails }) => {
            const groupRoute = classLabel === 'SSC' ? 'admin-groups-ssc' : 'admin-groups-hsc';
            const [chapterThumbnails, setChapterThumbnails] = useThumbnailMap('/api/chapter-thumbnails', 'chapterKey');
            const [activeThumbnail, setActiveThumbnail] = useState(null);
            const { viewMode, setViewMode, viewOptions } = useDashboardViewPreference();
            const subjectLabel = 'Bangla 1st Paper';
            const topics = [{ title: 'বাংলা সাহিত্য', description: 'গদ্য ও পদ্য অধ্যায় সমূহ', route: classLabel === 'SSC' ? 'bangla-ssc-shahitto' : 'bangla-hsc-shahitto', active: true, thumbnailKey: 'shahitto' }, { title: 'সহপাঠ', description: 'নাটক ও উপন্যাস ভিত্তিক পাঠ', route: classLabel === 'SSC' ? 'bangla-ssc-shohopath' : 'bangla-hsc-shohopath', active: true, thumbnailKey: 'shohopath' }];
            return (
                <AdminShell title="বাংলা ১ম পত্র" subtitle={\`\${classLabel} শ্রেণির পাঠ তালিকা নির্বাচন করুন।\`} activeTab="classes" onNavigate={onNavigate}>
                    <div className="flex flex-wrap gap-3 justify-between items-center">
                        <div className="flex flex-wrap items-center gap-2">
                            <button onClick={() => onNavigate(groupRoute)} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Back</button>
                            <button onClick={() => onNavigate('dashboard')} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Dashboard</button>
                        </div>
                        <DashboardViewToggle viewMode={viewMode} onChange={setViewMode} options={viewOptions} />
                    </div>
                    {viewMode === 'card' ? (
                        <div className="mt-4 grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 justify-items-center font-bangla">
                            {topics.map((topic) => {
                                const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, topic.thumbnailKey);
                                const thumbnailUrl = chapterThumbnails[chapterKey]?.url;
                                return (
                                    <div key={topic.title} className={`w-full max-w-[170px] bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col ${topic.active ? 'text-gray-700' : 'text-gray-300'}`}>
                                        <div className="aspect-[3/4] bg-gray-100 border-b border-gray-200">
                                            {thumbnailUrl ? <img src={thumbnailUrl} alt={topic.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[9px] uppercase tracking-[0.3em] text-gray-300">No image</div>}
                                        </div>
                                        <div className="p-3 flex flex-col gap-2">
                                            <div>
                                                <div className="text-[10px] uppercase tracking-[0.2em] text-gray-300">বিষয়</div>
                                                <div className="text-sm font-semibold text-gray-900 mt-1">{topic.title}</div>
                                                <p className="text-xs text-gray-500 mt-1">{topic.description}</p>
                                            </div>
                                            <div className="mt-auto flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                                                <button onClick={() => topic.active && topic.route && onNavigate(topic.route)} className={`px-2 py-1 rounded-md border border-gray-200 transition ${topic.active ? 'text-gray-600 hover:bg-gray-50' : 'text-gray-300 cursor-not-allowed'}`} disabled={!topic.active}>Open</button>
                                                {canManageThumbnails && <button onClick={() => setActiveThumbnail({ title: topic.title, chapterKey })} className="px-2 py-1 rounded-md border border-blue-100 text-blue-600 hover:bg-blue-50 transition">Thumbnail</button>}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-sm divide-y font-bangla">
                            {topics.map((topic) => {
                                const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, topic.thumbnailKey);
                                const thumbnailUrl = chapterThumbnails[chapterKey]?.url;
                                return (
                                    <div key={topic.title} className={`w-full flex flex-wrap gap-3 items-center justify-between px-4 py-3 text-sm font-semibold transition ${topic.active ? 'text-gray-700' : 'text-gray-300'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-12 rounded-md overflow-hidden border border-gray-200 bg-gray-100">{thumbnailUrl ? <img src={thumbnailUrl} alt={topic.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[9px] uppercase tracking-[0.2em] text-gray-300">No image</div>}</div>
                                            <div className="text-left"><div className="text-[10px] uppercase tracking-[0.2em] text-gray-300">বিষয়</div><div className="text-sm font-semibold text-gray-900 mt-1">{topic.title}</div><p className="text-xs text-gray-500 mt-1">{topic.description}</p></div>
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] font-semibold">
                                            <button onClick={() => topic.active && topic.route && onNavigate(topic.route)} className={`px-2 py-1 rounded-md border border-gray-200 transition ${topic.active ? 'text-gray-600 hover:bg-gray-50' : 'text-gray-300 cursor-not-allowed'}`} disabled={!topic.active}>Open</button>
                                            {canManageThumbnails && <button onClick={() => setActiveThumbnail({ title: topic.title, chapterKey })} className="px-2 py-1 rounded-md border border-blue-100 text-blue-600 hover:bg-blue-50 transition">Thumbnail</button>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {activeThumbnail && canManageThumbnails && <ThumbnailUploadModal title={activeThumbnail.title} description="Upload a category thumbnail for Bangla 1st Paper." uploadUrl="/api/chapter-thumbnails" keyField="chapterKey" itemKey={activeThumbnail.chapterKey} existingUrl={chapterThumbnails[activeThumbnail.chapterKey]?.url} onSaved={(thumbnail) => { setChapterThumbnails((prev) => ({ ...prev, [thumbnail.chapterKey]: { url: thumbnail.url } })); setActiveThumbnail(null); }} onClose={() => setActiveThumbnail(null)} />}
                </AdminShell>
            );
        };

        const BanglaShahitto = ({ classLabel, onNavigate, canManageThumbnails }) => {
            const baseRoute = classLabel === 'SSC' ? 'bangla-ssc-1st-paper' : 'bangla-hsc-1st-paper';
            const goddoRoute = classLabel === 'SSC' ? 'bangla-ssc-goddo' : 'bangla-hsc-goddo';
            const poddoRoute = classLabel === 'SSC' ? 'bangla-ssc-poddo' : 'bangla-hsc-poddo';
            const [chapterThumbnails, setChapterThumbnails] = useThumbnailMap('/api/chapter-thumbnails', 'chapterKey');
            const [activeThumbnail, setActiveThumbnail] = useState(null);
            const { viewMode, setViewMode, viewOptions } = useDashboardViewPreference();
            const subjectLabel = 'Bangla 1st Paper';
            const categoryCards = [{ title: 'গদ্য', description: 'গদ্য অধ্যায় সমূহ', route: goddoRoute, thumbnailKey: 'goddo' }, { title: 'পদ্য', description: 'পদ্য অধ্যায় সমূহ', route: poddoRoute, thumbnailKey: 'poddo' }];
            return (
                <AdminShell title="বাংলা সাহিত্য" subtitle="গদ্য ও পদ্য অধ্যায় নির্বাচন করুন।" activeTab="classes" onNavigate={onNavigate}>
                    <div className="flex flex-wrap gap-3 justify-between items-center">
                        <div className="flex flex-wrap items-center gap-2">
                            <button onClick={() => onNavigate(baseRoute)} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Back</button>
                            <button onClick={() => onNavigate('dashboard')} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Dashboard</button>
                        </div>
                        <DashboardViewToggle viewMode={viewMode} onChange={setViewMode} options={viewOptions} />
                    </div>
                    {viewMode === 'card' ? (
                        <div className="mt-4 grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 justify-items-center font-bangla">
                            {categoryCards.map((card) => {
                                const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, card.thumbnailKey);
                                const thumbnailUrl = chapterThumbnails[chapterKey]?.url;
                                return (
                                    <div key={card.title} className="w-full max-w-[170px] bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                                        <div className="aspect-[3/4] bg-gray-100 border-b border-gray-200">
                                            {thumbnailUrl ? <img src={thumbnailUrl} alt={card.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[9px] uppercase tracking-[0.3em] text-gray-300">No image</div>}
                                        </div>
                                        <div className="p-3 flex flex-col gap-2">
                                            <div>
                                                <div className="text-[10px] uppercase tracking-[0.2em] text-gray-300">ধারা</div>
                                                <div className="text-sm font-semibold text-gray-900 mt-1">{card.title}</div>
                                                <p className="text-xs text-gray-500 mt-1">{card.description}</p>
                                            </div>
                                            <div className="mt-auto flex items-center gap-2 text-[11px] font-semibold">
                                                <button onClick={() => onNavigate(card.route)} className="px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Open</button>
                                                {canManageThumbnails && <button onClick={() => setActiveThumbnail({ title: card.title, chapterKey })} className="px-2 py-1 rounded-md border border-blue-100 text-blue-600 hover:bg-blue-50 transition">Thumbnail</button>}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-sm divide-y font-bangla">
                            {categoryCards.map((card) => {
                                const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, card.thumbnailKey);
                                const thumbnailUrl = chapterThumbnails[chapterKey]?.url;
                                return (
                                    <div key={card.title} className="w-full flex flex-wrap gap-3 items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-12 rounded-md overflow-hidden border border-gray-200 bg-gray-100">{thumbnailUrl ? <img src={thumbnailUrl} alt={card.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[9px] uppercase tracking-[0.2em] text-gray-300">No image</div>}</div>
                                            <div className="text-left"><div className="text-[10px] uppercase tracking-[0.2em] text-gray-300">ধারা</div><div className="text-sm font-semibold text-gray-900 mt-1">{card.title}</div><p className="text-xs text-gray-500 mt-1">{card.description}</p></div>
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] font-semibold">
                                            <button onClick={() => onNavigate(card.route)} className="px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Open</button>
                                            {canManageThumbnails && <button onClick={() => setActiveThumbnail({ title: card.title, chapterKey })} className="px-2 py-1 rounded-md border border-blue-100 text-blue-600 hover:bg-blue-50 transition">Thumbnail</button>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {activeThumbnail && canManageThumbnails && <ThumbnailUploadModal title={activeThumbnail.title} description="Upload a category thumbnail for Bangla literature." uploadUrl="/api/chapter-thumbnails" keyField="chapterKey" itemKey={activeThumbnail.chapterKey} existingUrl={chapterThumbnails[activeThumbnail.chapterKey]?.url} onSaved={(thumbnail) => { setChapterThumbnails((prev) => ({ ...prev, [thumbnail.chapterKey]: { url: thumbnail.url } })); setActiveThumbnail(null); }} onClose={() => setActiveThumbnail(null)} />}
                </AdminShell>
            );
        };

        const BanglaShohopath = ({ classLabel, items, onAddItem, onUpdateItem, onRemoveItem, onSelectItem, onNavigate, canManageStructure, canManageThumbnails }) => {
            const baseRoute = classLabel === 'SSC' ? 'bangla-ssc-1st-paper' : 'bangla-hsc-1st-paper';
            const [chapterThumbnails, setChapterThumbnails] = useThumbnailMap('/api/chapter-thumbnails', 'chapterKey');
            const [activeThumbnail, setActiveThumbnail] = useState(null);
            const [isModalOpen, setIsModalOpen] = useState(false);
            const [newItemName, setNewItemName] = useState('');
            const [newItemType, setNewItemType] = useState('নাটক');
            const [editingItem, setEditingItem] = useState(null);
            const [thumbnailFile, setThumbnailFile] = useState(null);
            const typeOptions = ['নাটক', 'উপন্যাস'];
            const subjectLabel = 'Bangla 1st Paper';
            const resetForm = () => { setNewItemName(''); setNewItemType('নাটক'); setEditingItem(null); setThumbnailFile(null); };
            const { viewMode, setViewMode, viewOptions } = useDashboardViewPreference();
            const handleSave = async () => {
                const trimmed = newItemName.trim();
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
                if (editingItem) {
                    onUpdateItem(editingItem.id, { name: trimmed, type: newItemType });
                    const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, editingItem.id + '-সহপাঠ');
                    await uploadThumbnail(chapterKey);
                } else {
                    const nextId = \`\${Date.now()}-\${Math.random().toString(16).slice(2)}\`;
                    onAddItem({ id: nextId, name: trimmed, type: newItemType });
                    const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, nextId + '-সহপাঠ');
                    await uploadThumbnail(chapterKey);
                }
                resetForm(); setIsModalOpen(false);
            };
            return (
                <AdminShell title="সহপাঠ" subtitle="নাটক ও উপন্যাসের পাঠ যোগ করুন।" activeTab="classes" onNavigate={onNavigate}>
                    <div className="flex flex-wrap gap-3 justify-between items-center">
                        <button onClick={() => onNavigate(baseRoute)} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Back</button>
                        <div className="flex flex-wrap items-center gap-2">
                            <DashboardViewToggle viewMode={viewMode} onChange={setViewMode} options={viewOptions} />
                            {canManageStructure && <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition">Add</button>}
                        </div>
                    </div>
                    {viewMode === 'card' ? (
                        <div className="mt-4 grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 justify-items-center font-bangla">
                            {items.length === 0 && <div className="col-span-full px-5 py-4 text-sm text-gray-400 text-center bg-white border border-dashed border-gray-200 rounded-2xl">এখনও কোনো সহপাঠ যোগ করা হয়নি।</div>}
                            {items.map((item) => {
                                const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, item.id + '-সহপাঠ');
                                const thumbnailUrl = chapterThumbnails[chapterKey]?.url;
                                return (
                                    <div key={item.id} className="w-full max-w-[170px] bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                                        <div className="aspect-[3/4] bg-gray-100 border-b border-gray-200">
                                            {thumbnailUrl ? <img src={thumbnailUrl} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-[0.3em] text-gray-300">No image</div>}
                                        </div>
                                        <div className="p-3 flex-1 flex flex-col gap-2">
                                            <div>
                                                <div className="text-[10px] uppercase tracking-[0.2em] text-gray-300">সহপাঠ</div>
                                                <div className="text-sm font-semibold text-gray-900 mt-1">{item.name}</div>
                                                <div className="text-xs text-gray-500 mt-1">{item.type}</div>
                                            </div>
                                            <div className="mt-auto flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                                                <button onClick={() => onSelectItem(item)} className="px-2 py-1 rounded-md border border-blue-100 text-blue-600 hover:bg-blue-50 transition">Open</button>
                                                {canManageStructure && <button onClick={() => { setEditingItem(item); setNewItemName(item.name); setNewItemType(item.type); setIsModalOpen(true); }} className="px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Rename</button>}
                                                {canManageThumbnails && <button onClick={() => setActiveThumbnail({ title: item.name, chapterKey })} className="px-2 py-1 rounded-md border border-blue-100 text-blue-600 hover:bg-blue-50 transition">Thumbnail</button>}
                                                {canManageStructure && <button onClick={() => { const shouldRemove = window.confirm('আপনি কি এই পাঠটি মুছে ফেলতে চান?'); if (shouldRemove) { onRemoveItem(item.id); } }} className="px-2 py-1 rounded-md border border-red-100 text-red-500 hover:bg-red-50 transition">Delete</button>}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-sm divide-y font-bangla">
                            {items.length === 0 && <div className="px-5 py-4 text-sm text-gray-400">এখনও কোনো সহপাঠ যোগ করা হয়নি।</div>}
                            {items.map((item) => {
                                const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, item.id + '-সহপাঠ');
                                const thumbnailUrl = chapterThumbnails[chapterKey]?.url;
                                return (
                                    <div key={item.id} className="w-full flex flex-wrap gap-3 items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-11 rounded-md overflow-hidden border border-gray-200 bg-gray-100">{thumbnailUrl ? <img src={thumbnailUrl} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[9px] uppercase tracking-[0.2em] text-gray-300">No image</div>}</div>
                                            <div className="flex flex-col text-left"><span>{item.name}</span><span className="text-xs text-gray-500 mt-1">{item.type}</span></div>
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] font-semibold">
                                            {canManageStructure && <button onClick={() => { setEditingItem(item); setNewItemName(item.name); setNewItemType(item.type); setIsModalOpen(true); }} className="px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Rename</button>}
                                            {canManageThumbnails && <button onClick={() => setActiveThumbnail({ title: item.name, chapterKey })} className="px-2 py-1 rounded-md border border-blue-100 text-blue-600 hover:bg-blue-50 transition">Thumbnail</button>}
                                            {canManageStructure && <button onClick={() => { const shouldRemove = window.confirm('আপনি কি এই পাঠটি মুছে ফেলতে চান?'); if (shouldRemove) { onRemoveItem(item.id); } }} className="px-2 py-1 rounded-md border border-red-100 text-red-500 hover:bg-red-50 transition">Delete</button>}
                                            <button onClick={() => onSelectItem(item)} className="text-xs uppercase tracking-[0.2em] text-blue-600 hover:text-blue-500 transition">Open</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {isModalOpen && canManageStructure && (
                        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center px-4 py-6 z-50">
                            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 font-bangla">
                                <h3 className="text-lg font-semibold text-gray-900">{editingItem ? 'Rename entry' : 'নতুন সহপাঠ যোগ করুন'}</h3>
                                <p className="text-sm text-gray-500 mt-1">পাঠের নাম ও ধরণ নির্বাচন করুন।</p>
                                <input value={newItemName} onChange={(event) => setNewItemName(event.target.value)} placeholder="উদাহরণ: সিরাজউদ্দৌলা" className="mt-4 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
                                <div className="mt-4"><label className="text-xs uppercase tracking-[0.2em] text-gray-400">ধরণ</label><select value={newItemType} onChange={(event) => setNewItemType(event.target.value)} className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200">{typeOptions.map((option) => (<option key={option} value={option}>{option}</option>))}</select></div>
                                {canManageThumbnails && (<div className="mt-4"><label className="text-xs uppercase tracking-[0.2em] text-gray-400">Thumbnail</label><input type="file" accept="image/*" onChange={async (event) => { const selected = event.target.files?.[0]; if (!selected) { setThumbnailFile(null); return; } const resized = await resizeImageFile(selected); setThumbnailFile(resized || null); }} className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" /><p className="text-xs text-gray-400 mt-2">Upload now or edit later with the thumbnail button.</p></div>)}
                                <div className="mt-5 flex justify-end gap-2"><button onClick={() => { setIsModalOpen(false); resetForm(); }} className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Cancel</button><button onClick={handleSave} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition">{editingItem ? 'Update' : 'Add'}</button></div>
                            </div>
                        </div>
                    )}
                    {activeThumbnail && canManageThumbnails && <ThumbnailUploadModal title={activeThumbnail.title} description="Upload a thumbnail for this সহপাঠ chapter." uploadUrl="/api/chapter-thumbnails" keyField="chapterKey" itemKey={activeThumbnail.chapterKey} existingUrl={chapterThumbnails[activeThumbnail.chapterKey]?.url} onSaved={(thumbnail) => { setChapterThumbnails((prev) => ({ ...prev, [thumbnail.chapterKey]: { url: thumbnail.url } })); setActiveThumbnail(null); }} onClose={() => setActiveThumbnail(null)} />}
                </AdminShell>
            );
        };

        const BanglaTextList = ({ classLabel, typeLabel, items, onAddItem, onUpdateItem, onRemoveItem, onSelectItem, onNavigate, showAdd = false, baseRouteOverride, canManageStructure, canManageThumbnails }) => {
            const [chapterThumbnails, setChapterThumbnails] = useThumbnailMap('/api/chapter-thumbnails', 'chapterKey');
            const [activeThumbnail, setActiveThumbnail] = useState(null);
            const [isModalOpen, setIsModalOpen] = useState(false);
            const [newItem, setNewItem] = useState('');
            const [editingItem, setEditingItem] = useState(null);
            const [thumbnailFile, setThumbnailFile] = useState(null);
            const baseRoute = baseRouteOverride || (classLabel === 'SSC' ? 'bangla-ssc-shahitto' : 'bangla-hsc-shahitto');
            const subjectLabel = 'Bangla 1st Paper';
            const { viewMode, setViewMode, viewOptions } = useDashboardViewPreference();
            const handleSave = async () => {
                const trimmed = newItem.trim();
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
                if (editingItem) {
                    onUpdateItem(editingItem, trimmed);
                    const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, trimmed + '-' + typeLabel);
                    await uploadThumbnail(chapterKey);
                } else {
                    onAddItem(trimmed);
                    const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, trimmed + '-' + typeLabel);
                    await uploadThumbnail(chapterKey);
                }
                setNewItem(''); setEditingItem(null); setThumbnailFile(null); setIsModalOpen(false);
            };
            return (
                <AdminShell title={\`\${typeLabel} পাঠ তালিকা\`} subtitle="পাঠের নাম নির্বাচন করুন।" activeTab="classes" onNavigate={onNavigate}>
                    <div className="flex flex-wrap gap-3 justify-between items-center">
                        <button onClick={() => onNavigate(baseRoute)} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Back</button>
                        <div className="flex flex-wrap items-center gap-2">
                            <DashboardViewToggle viewMode={viewMode} onChange={setViewMode} options={viewOptions} />
                            {showAdd && canManageStructure && <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition">Add</button>}
                        </div>
                    </div>
                    {viewMode === 'card' ? (
                        <div className="mt-4 grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 justify-items-center font-bangla">
                            {items.length === 0 && <div className="col-span-full px-5 py-4 text-sm text-gray-400 text-center bg-white border border-dashed border-gray-200 rounded-2xl">এখনও কোনো পাঠ যোগ করা হয়নি।</div>}
                            {items.map((item) => {
                                const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, item + '-' + typeLabel);
                                const thumbnailUrl = chapterThumbnails[chapterKey]?.url;
                                return (
                                    <div key={item} className="w-full max-w-[170px] bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                                        <div className="aspect-[3/4] bg-gray-100 border-b border-gray-200">
                                            {thumbnailUrl ? <img src={thumbnailUrl} alt={item} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-[0.3em] text-gray-300">No image</div>}
                                        </div>
                                        <div className="p-3 flex-1 flex flex-col gap-2">
                                            <div>
                                                <div className="text-[10px] uppercase tracking-[0.2em] text-gray-300">পাঠ</div>
                                                <div className="text-sm font-semibold text-gray-900 mt-1">{item}</div>
                                                <div className="text-xs text-gray-500 mt-1">{typeLabel}</div>
                                            </div>
                                            <div className="mt-auto flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                                                <button onClick={() => onSelectItem(item)} className="px-2 py-1 rounded-md border border-blue-100 text-blue-600 hover:bg-blue-50 transition">Open</button>
                                                {canManageStructure && <button onClick={() => { setEditingItem(item); setNewItem(item); setIsModalOpen(true); }} className="px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Rename</button>}
                                                {canManageThumbnails && <button onClick={() => setActiveThumbnail({ title: item, chapterKey })} className="px-2 py-1 rounded-md border border-blue-100 text-blue-600 hover:bg-blue-50 transition">Thumbnail</button>}
                                                {canManageStructure && <button onClick={() => { const shouldRemove = window.confirm('আপনি কি এই পাঠটি মুছে ফেলতে চান?'); if (shouldRemove) { onRemoveItem(item); } }} className="px-2 py-1 rounded-md border border-red-100 text-red-500 hover:bg-red-50 transition">Delete</button>}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-sm divide-y font-bangla">
                            {items.length === 0 && <div className="px-5 py-4 text-sm text-gray-400">এখনও কোনো পাঠ যোগ করা হয়নি।</div>}
                            {items.map((item) => {
                                const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, item + '-' + typeLabel);
                                const thumbnailUrl = chapterThumbnails[chapterKey]?.url;
                                return (
                                    <div key={item} className="w-full flex flex-wrap gap-3 items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-11 rounded-md overflow-hidden border border-gray-200 bg-gray-100">{thumbnailUrl ? <img src={thumbnailUrl} alt={item} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[9px] uppercase tracking-[0.2em] text-gray-300">No image</div>}</div>
                                            <span>{item}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] font-semibold">
                                            {canManageStructure && <button onClick={() => { setEditingItem(item); setNewItem(item); setIsModalOpen(true); }} className="px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Rename</button>}
                                            {canManageThumbnails && <button onClick={() => setActiveThumbnail({ title: item, chapterKey })} className="px-2 py-1 rounded-md border border-blue-100 text-blue-600 hover:bg-blue-50 transition">Thumbnail</button>}
                                            {canManageStructure && <button onClick={() => { const shouldRemove = window.confirm('আপনি কি এই পাঠটি মুছে ফেলতে চান?'); if (shouldRemove) { onRemoveItem(item); } }} className="px-2 py-1 rounded-md border border-red-100 text-red-500 hover:bg-red-50 transition">Delete</button>}
                                            <button onClick={() => onSelectItem(item)} className="text-xs uppercase tracking-[0.2em] text-blue-600 hover:text-blue-500 transition">Open</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {isModalOpen && canManageStructure && (
                        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center px-4 py-6 z-50">
                            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 font-bangla">
                                <h3 className="text-lg font-semibold text-gray-900">{editingItem ? 'Rename entry' : 'নতুন পাঠ যোগ করুন'}</h3>
                                <p className="text-sm text-gray-500 mt-1">পাঠের নাম লিখুন।</p>
                                <input value={newItem} onChange={(event) => setNewItem(event.target.value)} placeholder="উদাহরণ: অপরিচিতা" className="mt-4 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
                                {canManageThumbnails && (<div className="mt-4"><label className="text-xs uppercase tracking-[0.2em] text-gray-400">Thumbnail</label><input type="file" accept="image/*" onChange={async (event) => { const selected = event.target.files?.[0]; if (!selected) { setThumbnailFile(null); return; } const resized = await resizeImageFile(selected); setThumbnailFile(resized || null); }} className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" /><p className="text-xs text-gray-400 mt-2">Upload now or edit later from the chapter list.</p></div>)}
                                <div className="mt-5 flex justify-end gap-2"><button onClick={() => { setIsModalOpen(false); setNewItem(''); setEditingItem(null); setThumbnailFile(null); }} className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Cancel</button><button onClick={handleSave} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition">{editingItem ? 'Update' : 'Add'}</button></div>
                            </div>
                        </div>
                    )}
                    {activeThumbnail && canManageThumbnails && <ThumbnailUploadModal title={activeThumbnail.title} description="Upload a thumbnail for this chapter." uploadUrl="/api/chapter-thumbnails" keyField="chapterKey" itemKey={activeThumbnail.chapterKey} existingUrl={chapterThumbnails[activeThumbnail.chapterKey]?.url} onSaved={(thumbnail) => { setChapterThumbnails((prev) => ({ ...prev, [thumbnail.chapterKey]: { url: thumbnail.url } })); setActiveThumbnail(null); }} onClose={() => setActiveThumbnail(null)} />}
                </AdminShell>
            );
        };

        const BanglaItemDetail = ({ classLabel, itemName, categoryName, notesByItem, videosByItem, onUpdateNotes, onUpdateVideos, onNavigate }) => {
            const baseRoute = classLabel === 'SSC' ? 'bangla-ssc-1st-paper' : 'bangla-hsc-1st-paper';
            const categoryRoute = classLabel === 'SSC' ? (categoryName === 'পদ্য' ? 'bangla-ssc-poddo' : categoryName === 'নাটক' || categoryName === 'উপন্যাস' ? 'bangla-ssc-shohopath' : 'bangla-ssc-goddo') : (categoryName === 'পদ্য' ? 'bangla-hsc-poddo' : categoryName === 'নাটক' || categoryName === 'উপন্যাস' ? 'bangla-hsc-shohopath' : 'bangla-hsc-goddo');
            const srijonshilRoute = classLabel === 'SSC' ? 'bangla-ssc-srijonshil-types' : 'bangla-hsc-srijonshil-types';
            const mcqRoute = classLabel === 'SSC' ? 'bangla-ssc-mcq' : 'bangla-hsc-mcq';
            const optionList = [{ label: 'সৃজনশীল', description: 'জ্ঞান ও অনুধাবন প্রশ্ন যোগ করুন', route: srijonshilRoute }, { label: 'বহুনির্বাচনী', description: 'MCQ প্রশ্ন তৈরি করুন', route: mcqRoute }];
            const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
            const [noteInput, setNoteInput] = useState('');
            const [noteStars, setNoteStars] = useState(0);
            const [editingNoteIndex, setEditingNoteIndex] = useState(null);
            const noteKey = [classLabel, categoryName || 'general', itemName || ''].join('-');
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
                <AdminShell title={null} subtitle={null} activeTab="classes" onNavigate={onNavigate}>
                    <div className="flex flex-col gap-2 font-bangla">
                        <div className="flex flex-wrap gap-3 justify-between items-center"><button onClick={() => onNavigate(categoryRoute)} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Back</button><button onClick={() => onNavigate(baseRoute)} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Subjects</button></div>
                        <div className="text-center"><h2 className="text-3xl sm:text-4xl font-semibold text-gray-900">{itemName || 'পাঠ নির্বাচন করুন'}</h2></div>
                        <div className="grid card-grid-gap sm:grid-cols-2">{optionList.map((option) => (<button key={option.label} onClick={() => option.route && onNavigate(option.route)} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 text-left hover:bg-gray-50 transition"><div className="text-xs uppercase tracking-[0.2em] text-gray-300">ধরণ</div><div className="text-lg font-semibold text-gray-900 mt-2">{option.label}</div><p className="text-sm text-gray-500 mt-2">{option.description}</p></button>))}</div>
                        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                            <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100"><div><div className="text-xs uppercase tracking-[0.2em] text-gray-300">নোটস</div><div className="text-sm font-semibold text-gray-700 mt-1">গুরুত্বপূর্ণ লাইন সংযুক্ত করুন</div></div><button onClick={() => openNoteModal()} className="px-3 py-2 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">নোট যোগ করুন</button></div>
                            <ul className="divide-y">{notes.length === 0 && <li className="px-4 py-3 text-sm text-gray-400">এখনো কোন নোট যুক্ত হয়নি।</li>}{notes.map((note, index) => { const resolved = normalizedNote(note); return (<li key={\`\${noteKey}-\${index}\`} className="px-4 py-3 flex items-start gap-3"><span className="text-sm font-semibold text-gray-500">{toBanglaNumber(index + 1)}.</span><div className="flex-1"><div className="text-sm text-gray-700">{resolved.text}</div>{resolved.stars > 0 && <div className="mt-1 text-[10px]">{renderStars(resolved.stars)}</div>}</div><button onClick={() => openNoteModal(index)} className="text-gray-400 hover:text-gray-600 transition" title="নোট সম্পাদনা করুন">✎</button></li>); })}</ul>
                        </div>
                        <VideoManager noteKey={noteKey} videosByItem={videosByItem} onUpdateVideos={onUpdateVideos} />
                    </div>
                    {isNoteModalOpen && (
                        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center px-4 py-6 z-50">
                            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 font-bangla">
                                <h3 className="text-lg font-semibold text-gray-900">{editingNoteIndex === null ? 'নোট যোগ করুন' : 'নোট সম্পাদনা করুন'}</h3>
                                <p className="text-sm text-gray-500 mt-1">গুরুত্বপূর্ণ লাইন লিখুন।</p>
                                <textarea value={noteInput} onChange={(event) => setNoteInput(event.target.value)} placeholder="উদাহরণ: পাঠের মূল বক্তব্য..." className="mt-4 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[120px]" />
                                <div className="mt-3">
                                    <label className="text-xs uppercase tracking-[0.2em] text-gray-400">গুরুত্ব (স্টার)</label>
                                    <div className="mt-2 flex items-center gap-2">
                                        <button onClick={() => setNoteStars(0)} className={'text-xs px-2 py-1 rounded-md border ' + (noteStars === 0 ? 'border-amber-400 text-amber-600' : 'border-gray-200 text-gray-500')}>No Star</button>
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
