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

        const makeAdminSubjectKey = (classLabel, group, subject) =>
            (classLabel + '-' + group + '-' + subject)
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');

        const buildAdminSubjectList = (classLabel) => {
            const groupMap = adminSubjectGroups[classLabel] || {};
            return Object.entries(groupMap).flatMap(([group, subjects]) =>
                subjects.map((subject) => ({
                    title: subject,
                    group,
                    classLabel,
                    subjectKey: makeAdminSubjectKey(classLabel, group, subject)
                }))
            );
        };

        const thumbnailSubjects = [...buildAdminSubjectList('SSC'), ...buildAdminSubjectList('HSC')];

        const ThumbnailPreviewCard = ({ subject, thumbnail }) => {
            const zoom = typeof thumbnail?.zoom === 'number' ? thumbnail.zoom : 1;
            return (
                <div className="space-y-3">
                    <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 shadow-sm">
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
                    <div>
                        <div className="text-sm font-semibold text-gray-900">{subject.title}</div>
                        <div className="text-xs text-gray-500">{subject.classLabel} • {subject.group}</div>
                    </div>
                </div>
            );
        };

        const ThumbnailRow = ({ subject, storedThumbnail, onSaved }) => {
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
                <div className="border border-gray-200 rounded-2xl p-4 bg-white flex flex-col lg:flex-row gap-5">
                    <div className="w-full lg:w-48">
                        <ThumbnailPreviewCard subject={subject} thumbnail={displayedThumbnail} />
                    </div>
                    <div className="flex-1 space-y-4">
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
                            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">Zoom to fit (no crop)</label>
                            <div className="flex items-center gap-3 mt-2">
                                <input
                                    type="range"
                                    min="0.8"
                                    max="1"
                                    step="0.02"
                                    value={zoom}
                                    onChange={(event) => setZoom(Number(event.target.value))}
                                    className="w-full"
                                />
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
            );
        };

        const ThumbnailSettings = ({ onNavigate, onBack }) => {
            const [thumbnailMap, setThumbnailMap] = useState({});
            const [statusMessage, setStatusMessage] = useState(null);

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
                    <div className="space-y-8">
                        {['SSC', 'HSC'].map((classLabel) => (
                            <div key={classLabel} className="space-y-4">
                                <div>
                                    <div className="text-xs uppercase tracking-[0.3em] text-gray-400">{classLabel}</div>
                                    <h3 className="text-lg font-semibold text-gray-900 mt-2">{classLabel} Subjects</h3>
                                </div>
                                <div className="space-y-4">
                                    {thumbnailSubjects
                                        .filter((subject) => subject.classLabel === classLabel)
                                        .map((subject) => (
                                            <ThumbnailRow
                                                key={subject.subjectKey}
                                                subject={subject}
                                                storedThumbnail={thumbnailMap[subject.subjectKey]}
                                                onSaved={handleSaved}
                                            />
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
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
