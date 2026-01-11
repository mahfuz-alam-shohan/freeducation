export const dashboardShared = `
        const ThumbnailUploadModal = ({ title, description, uploadUrl, keyField, itemKey, existingUrl, onSaved, onClose }) => {
            const [file, setFile] = useState(null);
            const [previewUrl, setPreviewUrl] = useState('');
            const [status, setStatus] = useState(null);
            const [isSaving, setIsSaving] = useState(false);
            const canSave = Boolean(file || existingUrl);

            useEffect(() => {
                if (!file) return undefined;
                const nextUrl = URL.createObjectURL(file);
                setPreviewUrl(nextUrl);
                return () => { URL.revokeObjectURL(nextUrl); };
            }, [file]);

            const handleSave = async () => {
                setStatus(null);
                const token = localStorage.getItem('auth_token');
                if (!token) { setStatus('You must be logged in to upload thumbnails.'); return; }
                setIsSaving(true);
                try {
                    const formData = new FormData();
                    formData.append(keyField, itemKey);
                    if (file) { formData.append('file', file); }
                    const response = await fetch(uploadUrl, {
                        method: 'POST',
                        headers: { Authorization: 'Bearer ' + token },
                        body: formData
                    });
                    const data = await response.json();
                    if (!response.ok || !data.success) { setStatus(data.error || 'Upload failed.'); }
                    else {
                        onSaved(data.thumbnail);
                        setStatus('Thumbnail saved.');
                        setFile(null);
                        setPreviewUrl('');
                    }
                } catch (error) { setStatus('Upload failed. Please try again.'); }
                finally { setIsSaving(false); }
            };

            return (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="text-xs uppercase tracking-[0.3em] text-gray-400">Thumbnail</div>
                            <div className="text-lg font-semibold text-gray-900 mt-2">{title}</div>
                            {description && <div className="text-sm text-gray-500 mt-1">{description}</div>}
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="relative w-32 sm:w-40 aspect-[4/5] rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shadow-sm mx-auto">
                                {previewUrl || existingUrl ? (
                                    <img src={previewUrl || existingUrl} alt={title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 text-xs uppercase tracking-[0.3em]"><span>No thumbnail</span></div>
                                )}
                            </div>
                            <div>
                                <label className="text-xs uppercase tracking-[0.3em] text-gray-400">Upload image</label>
                                <input type="file" accept="image/*" onChange={async (event) => { const selected = event.target.files?.[0]; if (!selected) { setFile(null); return; } const resized = await resizeImageFile(selected); setFile(resized || null); }} className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-xs" />
                            </div>
                            {status && <div className="text-sm text-gray-500">{status}</div>}
                        </div>
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
                            <button onClick={onClose} className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-[0.3em] border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Close</button>
                            <button onClick={handleSave} disabled={!canSave || isSaving} className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-[0.3em] bg-blue-600 text-white hover:bg-blue-500 transition disabled:opacity-60">{isSaving ? 'Saving...' : 'Save thumbnail'}</button>
                        </div>
                    </div>
                </div>
            );
        };

        const VideoManager = ({ noteKey, videosByItem, onUpdateVideos }) => {
            const [isModalOpen, setIsModalOpen] = useState(false);
            const [formState, setFormState] = useState({ title: '', sourceType: 'link', url: '', file: null, channelName: '', channelUrl: '', duration: '' });
            const videos = (videosByItem || {})[noteKey] || [];
            const formatDuration = (value) => {
                if (value === null || value === undefined) return '';
                const total = Math.floor(Number(value));
                if (Number.isNaN(total)) return '';
                const minutes = Math.floor(total / 60);
                const seconds = total % 60;
                return String(minutes) + ':' + String(seconds).padStart(2, '0');
            };
            const resetForm = () => { setFormState({ title: '', sourceType: 'link', url: '', file: null, channelName: '', channelUrl: '', duration: '' }); };
            const handleSave = async () => {
                const trimmedTitle = formState.title.trim();
                if (!trimmedTitle) return;
                let url = formState.url.trim();
                let fileKey = '';
                if (formState.sourceType === 'upload') {
                    const token = localStorage.getItem('auth_token');
                    if (!token || !(formState.file instanceof File)) return;
                    const formData = new FormData();
                    formData.append('file', formState.file);
                    const response = await fetch('/api/videos', { method: 'POST', headers: { Authorization: 'Bearer ' + token }, body: formData });
                    const data = await response.json();
                    if (!response.ok || !data.success) return;
                    url = data.url;
                    fileKey = data.fileKey;
                }
                if (!url) return;
                const nextEntry = { id: crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(16).slice(2), title: trimmedTitle, sourceType: formState.sourceType, url, fileKey, channelName: formState.channelName.trim(), channelUrl: formState.channelUrl.trim(), duration: formState.duration.trim() };
                if (onUpdateVideos) { onUpdateVideos((prev) => { const current = prev && prev[noteKey] ? [...prev[noteKey]] : []; current.push(nextEntry); return { ...prev, [noteKey]: current }; }); }
                setIsModalOpen(false);
                resetForm();
            };
            const handleRemove = (entryId) => { if (!onUpdateVideos) return; onUpdateVideos((prev) => { const current = prev && prev[noteKey] ? [...prev[noteKey]] : []; return { ...prev, [noteKey]: current.filter((entry) => entry.id !== entryId) }; }); };

            return (
                <div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
                    <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
                        <div><div className="text-xs uppercase tracking-[0.2em] text-gray-300">ভিডিও</div><div className="text-sm font-semibold text-gray-700 mt-1">ভিডিও যোগ করুন বা লিংক দিন</div></div>
                        <button onClick={() => setIsModalOpen(true)} className="px-3 py-2 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">ভিডিও যোগ করুন</button>
                    </div>
                    <div className="divide-y">
                        {videos.length === 0 && <div className="px-4 py-3 text-sm text-gray-400">এখনো কোন ভিডিও যোগ করা হয়নি।</div>}
                        {videos.map((video) => (
                            <div key={video.id} className="px-4 py-3 flex items-center justify-between gap-3">
                                <div className="space-y-1">
                                    <div className="text-sm font-semibold text-gray-900">{video.title}</div>
                                    <div className="text-xs text-gray-500">{video.channelName && <span>{video.channelName}</span>}{video.duration && <span className="ml-2">Duration: {video.duration}</span>}</div>
                                    {video.channelUrl && <a href={video.channelUrl} className="text-xs text-blue-500" target="_blank" rel="noreferrer">{video.channelUrl}</a>}
                                </div>
                                <button onClick={() => handleRemove(video.id)} className="px-2 py-1 rounded-md border border-red-100 text-red-500 text-xs hover:bg-red-50 transition">Remove</button>
                            </div>
                        ))}
                    </div>
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center px-4 py-6 z-50">
                            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 font-bangla">
                                <h3 className="text-lg font-semibold text-gray-900">ভিডিও যোগ করুন</h3>
                                <p className="text-sm text-gray-500 mt-1">ভিডিও ফাইল আপলোড করুন অথবা লিংক দিন।</p>
                                <div className="mt-4 space-y-3">
                                    <input value={formState.title} onChange={(event) => setFormState((prev) => ({ ...prev, title: event.target.value }))} placeholder="ভিডিও শিরোনাম" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                                    <div className="flex gap-3 text-xs font-semibold">
                                        {['link', 'upload'].map((type) => (
                                            <button key={type} onClick={() => setFormState((prev) => ({ ...prev, sourceType: type, duration: type === 'link' ? '' : prev.duration }))} className={'px-3 py-2 rounded-lg border ' + (formState.sourceType === type ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600')}>{type === 'link' ? 'লিংক' : 'আপলোড'}</button>
                                        ))}
                                    </div>
                                    {formState.sourceType === 'link' ? (
                                        <input value={formState.url} onChange={(event) => setFormState((prev) => ({ ...prev, url: event.target.value }))} placeholder="ভিডিও লিংক" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                                    ) : (
                                        <input type="file" accept="video/*" onChange={(event) => { const selected = event.target.files?.[0] || null; setFormState((prev) => ({ ...prev, file: selected, duration: '' })); if (!selected) return; const previewUrl = URL.createObjectURL(selected); const video = document.createElement('video'); video.preload = 'metadata'; video.src = previewUrl; video.onloadedmetadata = () => { const nextDuration = formatDuration(video.duration); setFormState((prev) => ({ ...prev, duration: nextDuration })); URL.revokeObjectURL(previewUrl); }; }} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                                    )}
                                    <input value={formState.channelName} onChange={(event) => setFormState((prev) => ({ ...prev, channelName: event.target.value }))} placeholder="চ্যানেল নাম (ঐচ্ছিক)" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                                    <input value={formState.channelUrl} onChange={(event) => setFormState((prev) => ({ ...prev, channelUrl: event.target.value }))} placeholder="চ্যানেল লিংক (ঐচ্ছিক)" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                                </div>
                                <div className="mt-5 flex justify-end gap-2">
                                    <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Cancel</button>
                                    <button onClick={handleSave} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition">Save</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            );
        };

        const DashboardViewToggle = ({ viewMode, onChange, options = dashboardViewOptions }) => (
            <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 text-xs font-semibold">
                {options.map((option) => (
                    <button key={option.key} onClick={() => onChange(option.key)} className={'px-3 py-1 rounded-md transition ' + (viewMode === option.key ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50')}>{option.label}</button>
                ))}
            </div>
        );
`;
