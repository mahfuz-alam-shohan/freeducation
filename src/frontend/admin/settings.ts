export const settingsComponents = `
        const AdminSettingsModule = (() => {
        const adminSubjectGroups = {
            SSC: {
                Science: [
                    'Bangla 1st Paper',
                    'Bangla 2nd Paper',
                    'English 1st Paper',
                    'English 2nd Paper',
                    'General Mathematics',
                    'Physics',
                    'Chemistry',
                    'Biology',
                    'Higher Mathematics',
                    'Bangladesh and Global Studies',
                    'Information and Communication Technology',
                    'Religion and Moral Education'
                ],
                Humanities: [
                    'Bangla 1st Paper',
                    'Bangla 2nd Paper',
                    'English 1st Paper',
                    'English 2nd Paper',
                    'General Mathematics',
                    'Bangladesh and Global Studies',
                    'Information and Communication Technology',
                    'Geography and Environment',
                    'History of Bangladesh and World Civilization',
                    'Civics and Citizenship',
                    'Religion and Moral Education'
                ],
                'Business Studies': [
                    'Bangla 1st Paper',
                    'Bangla 2nd Paper',
                    'English 1st Paper',
                    'English 2nd Paper',
                    'General Mathematics',
                    'Bangladesh and Global Studies',
                    'Information and Communication Technology',
                    'Accounting',
                    'Business Entrepreneurship',
                    'Finance and Banking',
                    'Religion and Moral Education'
                ]
            },
            HSC: {
                Science: [
                    'Bangla 1st Paper',
                    'Bangla 2nd Paper',
                    'English 1st Paper',
                    'English 2nd Paper',
                    'Information and Communication Technology',
                    'Physics 1st Paper',
                    'Physics 2nd Paper',
                    'Chemistry 1st Paper',
                    'Chemistry 2nd Paper',
                    'Biology 1st Paper',
                    'Biology 2nd Paper',
                    'Higher Mathematics 1st Paper',
                    'Higher Mathematics 2nd Paper'
                ],
                Humanities: [
                    'Bangla 1st Paper',
                    'Bangla 2nd Paper',
                    'English 1st Paper',
                    'English 2nd Paper',
                    'Information and Communication Technology',
                    'Economics 1st Paper',
                    'Economics 2nd Paper',
                    'History 1st Paper',
                    'History 2nd Paper',
                    'Civics and Good Governance 1st Paper',
                    'Civics and Good Governance 2nd Paper',
                    'Logic 1st Paper',
                    'Logic 2nd Paper'
                ],
                'Business Studies': [
                    'Bangla 1st Paper',
                    'Bangla 2nd Paper',
                    'English 1st Paper',
                    'English 2nd Paper',
                    'Information and Communication Technology',
                    'Accounting 1st Paper',
                    'Accounting 2nd Paper',
                    'Business Organization and Management 1st Paper',
                    'Business Organization and Management 2nd Paper',
                    'Finance, Banking and Insurance 1st Paper',
                    'Finance, Banking and Insurance 2nd Paper',
                    'Production Management and Marketing 1st Paper',
                    'Production Management and Marketing 2nd Paper'
                ]
            }
        };

        const makeThumbnailKey = (subject, classLabel) =>
            (classLabel + '-' + subject)
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');

        const buildAdminSubjectList = () => {
            const subjectMap = new Map();
            Object.entries(adminSubjectGroups).forEach(([classLabel, groupMap]) => {
                Object.entries(groupMap).forEach(([group, subjects]) => {
                    subjects.forEach((subject) => {
                        const subjectKey = makeThumbnailKey(subject, classLabel);
                        if (!subjectMap.has(subjectKey)) {
                            subjectMap.set(subjectKey, {
                                title: subject,
                                subjectKey,
                                classLabel,
                                groups: new Set([group])
                            });
                        } else {
                            const entry = subjectMap.get(subjectKey);
                            entry.groups.add(group);
                        }
                    });
                });
            });
            return Array.from(subjectMap.values()).map((subject) => ({
                ...subject,
                groups: Array.from(subject.groups)
            }));
        };

        const thumbnailSubjects = buildAdminSubjectList();

        const ThumbnailPreviewCard = ({ subject, thumbnail, className = '', showMeta = true }) => {
            const zoom = typeof thumbnail?.zoom === 'number' ? thumbnail.zoom : 1;
            return (
                <div className={'space-y-3 ' + className}>
                    <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shadow-sm">
                        {thumbnail?.url ? (
                            <img
                                src={thumbnail.url}
                                alt={subject.title}
                                className="w-full h-full object-contain"
                                style={{ transform: 'scale(' + zoom + ')' }}
                            />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 text-xs uppercase tracking-[0.3em]">
                                <span>No thumbnail</span>
                            </div>
                        )}
                    </div>
                    {showMeta && (
                        <div>
                            <div className="text-sm font-semibold text-gray-900">{subject.title}</div>
                            <div className="text-xs text-gray-500">{subject.classLabel}</div>
                        </div>
                    )}
                </div>
            );
        };

        const ThumbnailModal = ({ subject, storedThumbnail, onSaved, onClose }) => {
            const [file, setFile] = useState(null);
            const [previewUrl, setPreviewUrl] = useState('');
            const [zoom, setZoom] = useState(storedThumbnail?.zoom ?? 1);
            const [status, setStatus] = useState(null);
            const [isSaving, setIsSaving] = useState(false);
            const canSave = Boolean(file || storedThumbnail?.url);

            useEffect(() => {
                setZoom(storedThumbnail?.zoom ?? 1);
            }, [storedThumbnail?.zoom]);

            useEffect(() => {
                if (!file) return undefined;
                const nextUrl = URL.createObjectURL(file);
                setPreviewUrl(nextUrl);
                return () => {
                    URL.revokeObjectURL(nextUrl);
                };
            }, [file]);

            const handleSave = async () => {
                setStatus(null);
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    setStatus('You must be logged in to upload thumbnails.');
                    return;
                }

                setIsSaving(true);
                try {
                    const formData = new FormData();
                    formData.append('subjectKey', subject.subjectKey);
                    formData.append('zoom', String(zoom));
                    if (file) {
                        formData.append('file', file);
                    }

                    const response = await fetch('/api/thumbnails', {
                        method: 'POST',
                        headers: {
                            Authorization: 'Bearer ' + token
                        },
                        body: formData
                    });
                    const data = await response.json();
                    if (!response.ok || !data.success) {
                        setStatus(data.error || 'Upload failed.');
                    } else {
                        onSaved(data.thumbnail);
                        setStatus('Thumbnail saved.');
                        setFile(null);
                        setPreviewUrl('');
                    }
                } catch (error) {
                    setStatus('Upload failed. Please try again.');
                } finally {
                    setIsSaving(false);
                }
            };

            const displayedThumbnail = previewUrl
                ? { url: previewUrl, zoom }
                : storedThumbnail
                    ? { ...storedThumbnail, zoom }
                    : { url: '', zoom };

            return (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
                    <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <div>
                                <div className="text-xs uppercase tracking-[0.3em] text-gray-400">Thumbnail</div>
                                <div className="text-lg font-semibold text-gray-900">{subject.title}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {subject.classLabel}
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition"
                                aria-label="Close"
                            >
                                <i className="fa-solid fa-xmark text-lg"></i>
                            </button>
                        </div>
                        <div className="p-6 grid gap-6 lg:grid-cols-[minmax(0,200px)_minmax(0,1fr)]">
                            <ThumbnailPreviewCard subject={subject} thumbnail={displayedThumbnail} />
                            <div className="space-y-5">
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">Upload image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(event) => setFile(event.target.files?.[0] || null)}
                                        className="mt-2 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-600 hover:file:bg-gray-200"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">Zoom</label>
                                    <div className="flex items-center gap-3 mt-3">
                                        <button
                                            type="button"
                                            onClick={() => setZoom((prev) => Math.max(0.7, Number((prev - 0.05).toFixed(2))))}
                                            className="h-9 w-9 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 transition"
                                            aria-label="Zoom out"
                                        >
                                            <i className="fa-solid fa-minus"></i>
                                        </button>
                                        <input
                                            type="range"
                                            min="0.7"
                                            max="1.2"
                                            step="0.02"
                                            value={zoom}
                                            onChange={(event) => setZoom(Number(event.target.value))}
                                            className="w-full"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setZoom((prev) => Math.min(1.2, Number((prev + 0.05).toFixed(2))))}
                                            className="h-9 w-9 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 transition"
                                            aria-label="Zoom in"
                                        >
                                            <i className="fa-solid fa-plus"></i>
                                        </button>
                                        <span className="text-xs text-gray-500 w-12 text-right">{zoom.toFixed(2)}x</span>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving || !canSave}
                                        className="px-4 py-2 rounded-lg bg-gray-900 text-white text-xs font-semibold uppercase tracking-[0.3em] hover:bg-gray-800 transition disabled:bg-gray-400"
                                    >
                                        {isSaving ? 'Saving...' : 'Save'}
                                    </button>
                                    {status && <span className="text-xs text-gray-500">{status}</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        const ThumbnailSettings = ({ onNavigate, onBack }) => {
            const [thumbnailMap, setThumbnailMap] = useState({});
            const [statusMessage, setStatusMessage] = useState(null);
            const [activeSubject, setActiveSubject] = useState(null);
            const [activeClass, setActiveClass] = useState(null);

            useEffect(() => {
                let isActive = true;
                const loadThumbnails = async () => {
                    try {
                        const response = await fetch('/api/thumbnails');
                        if (!response.ok) return;
                        const data = await response.json();
                        if (!isActive) return;
                        const map = (data.thumbnails || []).reduce((acc, item) => {
                            acc[item.subjectKey] = {
                                url: item.url,
                                zoom: typeof item.zoom === 'number' ? item.zoom : 1
                            };
                            return acc;
                        }, {});
                        setThumbnailMap(map);
                    } catch (error) {
                        console.warn('Failed to load thumbnails', error);
                    }
                };
                loadThumbnails();
                return () => {
                    isActive = false;
                };
            }, []);

            const handleSaved = (thumbnail) => {
                setThumbnailMap((prev) => ({
                    ...prev,
                    [thumbnail.subjectKey]: {
                        url: thumbnail.url,
                        zoom: thumbnail.zoom
                    }
                }));
                setStatusMessage('Thumbnail updated successfully.');
            };

            return (
                <AdminShell
                    title="Thumbnails"
                    subtitle="Upload subject thumbnails and preview the public cards."
                    activeTab="settings"
                    onNavigate={onNavigate}
                >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <button
                            onClick={onBack}
                            className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 hover:text-gray-700 transition"
                        >
                            Back to Settings
                        </button>
                        {statusMessage && <div className="text-xs text-gray-500">{statusMessage}</div>}
                    </div>
                    <div className="space-y-4">
                        <div>
                            <div className="text-xs uppercase tracking-[0.3em] text-gray-400">Subjects</div>
                            <h3 className="text-lg font-semibold text-gray-900 mt-2">Subject thumbnails</h3>
                            <p className="text-sm text-gray-500 mt-2">
                                Choose the class first, then select a subject to upload or fine-tune its thumbnail.
                            </p>
                        </div>
                        {!activeClass ? (
                            <div className="grid gap-3 sm:grid-cols-2">
                                {['SSC', 'HSC'].map((classLabel) => (
                                    <button
                                        key={classLabel}
                                        onClick={() => setActiveClass(classLabel)}
                                        className="border border-gray-200 rounded-2xl p-5 text-left hover:border-gray-300 hover:bg-gray-50 transition"
                                    >
                                        <div className="text-xs uppercase tracking-[0.3em] text-gray-400">Class</div>
                                        <div className="text-lg font-semibold text-gray-900 mt-2">{classLabel}</div>
                                        <div className="text-sm text-gray-500 mt-1">Upload thumbnails for {classLabel} subjects.</div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <button
                                    onClick={() => setActiveClass(null)}
                                    className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 hover:text-gray-700 transition"
                                >
                                    Change class
                                </button>
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {thumbnailSubjects.filter((subject) => subject.classLabel === activeClass).map((subject) => {
                                        const thumbnail = thumbnailMap[subject.subjectKey];
                                        return (
                                            <button
                                                key={subject.subjectKey}
                                                onClick={() => setActiveSubject(subject)}
                                                className="border border-gray-200 rounded-xl p-3 text-left hover:border-gray-300 hover:bg-gray-50 transition flex items-center gap-3"
                                            >
                                                <div className="w-14">
                                                    <ThumbnailPreviewCard
                                                        subject={subject}
                                                        thumbnail={thumbnail}
                                                        className="space-y-2"
                                                        showMeta={false}
                                                    />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-gray-900">{subject.title}</div>
                                                    <div className="text-xs text-gray-500 mt-1">{subject.classLabel}</div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                    {activeSubject && (
                        <ThumbnailModal
                            subject={activeSubject}
                            storedThumbnail={thumbnailMap[activeSubject.subjectKey]}
                            onSaved={(thumbnail) => {
                                handleSaved(thumbnail);
                                setActiveSubject(null);
                            }}
                            onClose={() => setActiveSubject(null)}
                        />
                    )}
                </AdminShell>
            );
        };

        const AdminSettings = ({ onNavigate }) => {
            const [statusMessage, setStatusMessage] = useState(null);
            const [isResetting, setIsResetting] = useState(false);
            const [activePanel, setActivePanel] = useState('main');

            if (activePanel === 'thumbnails') {
                return <ThumbnailSettings onNavigate={onNavigate} onBack={() => setActivePanel('main')} />;
            }

            const handleReset = async () => {
                const confirmed = window.confirm('Reset settings? This will restore default classes and clear uploaded fonts and thumbnails.');
                if (!confirmed) return;
                setIsResetting(true);
                setStatusMessage(null);

                const token = localStorage.getItem('auth_token');
                if (!token) {
                    setStatusMessage('You must be logged in to reset settings.');
                    setIsResetting(false);
                    return;
                }

                try {
                    const response = await fetch('/api/settings/reset', {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer ' + token,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ confirm: true })
                    });
                    const data = await response.json();
                    if (data.success) {
                        setStatusMessage('Settings reset completed.');
                        onNavigate('dashboard');
                    } else {
                        setStatusMessage(data.error || 'Reset failed.');
                    }
                } catch (error) {
                    setStatusMessage('Reset failed. Please try again.');
                } finally {
                    setIsResetting(false);
                }
            };

            return (
                <AdminShell
                    title="Settings"
                    subtitle="Manage system preferences and maintenance actions."
                    activeTab="settings"
                    onNavigate={onNavigate}
                >
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm divide-y divide-gray-200">
                        <button
                            onClick={() => setActivePanel('thumbnails')}
                            className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                        >
                            <span>Thumbnails</span>
                            <span className="text-xs text-gray-400">Upload subject poster images</span>
                        </button>
                        <button
                            onClick={handleReset}
                            disabled={isResetting}
                            className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition disabled:text-gray-400"
                        >
                            <span>Reset settings</span>
                            <span className="text-xs text-gray-400">{isResetting ? 'Working...' : ''}</span>
                        </button>
                    </div>
                    {statusMessage && (
                        <div className="text-sm text-gray-500">{statusMessage}</div>
                    )}
                </AdminShell>
            );
        };
        return { AdminSettings };
        })();
        const { AdminSettings } = AdminSettingsModule;
`;
