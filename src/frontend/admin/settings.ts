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

        const resizeImageFile = (file, { maxWidth = 520, maxHeight = 650, quality = 0.82 } = {}) =>
            new Promise((resolve) => {
                if (!file || !(file instanceof File)) {
                    resolve(file);
                    return;
                }
                const image = new Image();
                const objectUrl = URL.createObjectURL(file);
                image.onload = () => {
                    const ratio = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
                    const targetWidth = Math.max(1, Math.round(image.width * ratio));
                    const targetHeight = Math.max(1, Math.round(image.height * ratio));
                    const canvas = document.createElement('canvas');
                    canvas.width = targetWidth;
                    canvas.height = targetHeight;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        URL.revokeObjectURL(objectUrl);
                        resolve(file);
                        return;
                    }
                    ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
                    canvas.toBlob(
                        (blob) => {
                            URL.revokeObjectURL(objectUrl);
                            if (!blob) {
                                resolve(file);
                                return;
                            }
                            const baseName = file.name.replace(/\\.[^/.]+$/, '') || 'thumbnail';
                            resolve(
                                new File([blob], \`\${baseName}.jpg\`, {
                                    type: 'image/jpeg'
                                })
                            );
                        },
                        'image/jpeg',
                        quality
                    );
                };
                image.onerror = () => {
                    URL.revokeObjectURL(objectUrl);
                    resolve(file);
                };
                image.src = objectUrl;
            });

        const formatRoleLabel = (role) => (role === 'teacher' ? 'Teacher' : 'Admin');

        const useProfileData = () => {
            const [profile, setProfile] = useState(null);
            const [history, setHistory] = useState([]);
            const [isLoading, setIsLoading] = useState(true);

            const loadProfile = async () => {
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    setIsLoading(false);
                    return;
                }
                try {
                    const [profileRes, historyRes] = await Promise.all([
                        fetch('/api/profile', {
                            headers: { Authorization: 'Bearer ' + token }
                        }),
                        fetch('/api/profile/history', {
                            headers: { Authorization: 'Bearer ' + token }
                        })
                    ]);
                    const profileData = await profileRes.json();
                    const historyData = await historyRes.json();
                    if (profileData.success) {
                        setProfile(profileData.profile);
                    }
                    if (historyData.success) {
                        setHistory(historyData.entries || []);
                    }
                } catch (error) {
                    console.warn('Failed to load profile', error);
                } finally {
                    setIsLoading(false);
                }
            };

            useEffect(() => {
                loadProfile();
            }, []);

            return {
                profile,
                history,
                isLoading,
                refreshProfile: loadProfile,
                setProfile
            };
        };

        const ProfileSummary = ({ profile, compact = false }) => {
            if (!profile) return null;
            return (
                <div className={\`flex \${compact ? 'flex-col items-center text-center' : 'items-center'} gap-4\`}>
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                        {profile.avatarUrl ? (
                            <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-sm font-semibold text-slate-400">
                                {(profile.name || profile.username || '?').slice(0, 1).toUpperCase()}
                            </span>
                        )}
                    </div>
                    <div className={compact ? 'space-y-1' : ''}>
                        <div className="text-sm font-semibold text-slate-900">{profile.name || profile.username}</div>
                        <div className="text-xs text-slate-500">{profile.email || profile.username}</div>
                        <div className="text-[11px] uppercase tracking-[0.3em] text-slate-400">
                            {formatRoleLabel(profile.role)}
                        </div>
                    </div>
                </div>
            );
        };

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
            return (
                <div className={'space-y-3 ' + className}>
                    <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shadow-sm">
                        {thumbnail?.url ? (
                            <img
                                src={thumbnail.url}
                                alt={subject.title}
                                className="w-full h-full object-cover"
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

        const ThumbnailModal = ({
            subject,
            storedThumbnail,
            onSaved,
            onClose,
            modeLabel = 'Thumbnail',
            uploadUrl = '/api/thumbnails',
            keyField = 'subjectKey'
        }) => {
            const [file, setFile] = useState(null);
            const [previewUrl, setPreviewUrl] = useState('');
            const [status, setStatus] = useState(null);
            const [isSaving, setIsSaving] = useState(false);
            const canSave = Boolean(file || storedThumbnail?.url);

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
                    formData.append(keyField, subject.subjectKey);
                    if (file) {
                        formData.append('file', file);
                    }

                    const response = await fetch(uploadUrl, {
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
                ? { url: previewUrl }
                : storedThumbnail
                    ? { ...storedThumbnail }
                    : { url: '' };

            return (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <div>
                                <div className="text-xs uppercase tracking-[0.3em] text-gray-400">{modeLabel}</div>
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
                        <div className="p-4 grid gap-4 sm:grid-cols-[minmax(0,120px)_minmax(0,1fr)]">
                            <ThumbnailPreviewCard subject={subject} thumbnail={displayedThumbnail} className="space-y-2" />
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">Upload image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={async (event) => {
                                            const selected = event.target.files?.[0];
                                            if (!selected) {
                                                setFile(null);
                                                return;
                                            }
                                            const resized = await resizeImageFile(selected);
                                            setFile(resized || null);
                                        }}
                                        className="mt-2 block w-full text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-600 hover:file:bg-gray-200"
                                    />
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
            const [chapterThumbnailMap, setChapterThumbnailMap] = useState({});
            const [statusMessage, setStatusMessage] = useState(null);
            const [activeSubject, setActiveSubject] = useState(null);
            const [activeClass, setActiveClass] = useState(null);
            const [activeMode, setActiveMode] = useState('subject');
            const [chapterEntries, setChapterEntries] = useState([]);

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
                                url: item.url
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

            useEffect(() => {
                let isActive = true;
                const loadChapterThumbnails = async () => {
                    try {
                        const response = await fetch('/api/chapter-thumbnails');
                        if (!response.ok) return;
                        const data = await response.json();
                        if (!isActive) return;
                        const map = (data.thumbnails || []).reduce((acc, item) => {
                            acc[item.chapterKey] = {
                                url: item.url
                            };
                            return acc;
                        }, {});
                        setChapterThumbnailMap(map);
                    } catch (error) {
                        console.warn('Failed to load chapter thumbnails', error);
                    }
                };
                loadChapterThumbnails();
                return () => {
                    isActive = false;
                };
            }, []);

            useEffect(() => {
                let isActive = true;
                const loadChapters = async () => {
                    try {
                        const response = await fetch('/api/content');
                        if (!response.ok) return;
                        const data = await response.json();
                        if (!isActive) return;
                        const content = data.content || {};
                        const entries = [];
                        const pushEntry = (classLabel, subjectLabel, chapter, suffix = '') => {
                            const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, chapter.key);
                            entries.push({
                                subjectKey: chapterKey,
                                title: chapter.title,
                                subjectLabel,
                                classLabel,
                                description: suffix
                            });
                        };

                        const addChapterList = (classLabel, subjectLabel, list, suffix = '') => {
                            (list || []).forEach((chapter) => {
                                const key = chapter.id || chapter.key || chapter.name || chapter;
                                const chapterKey = suffix ? key + '-' + suffix : key;
                                const title = chapter.name || chapter.title || chapter;
                                pushEntry(classLabel, subjectLabel, { key: chapterKey, title }, suffix);
                            });
                        };

                        addChapterList('SSC', 'Information and Communication Technology', content.sscIctChapters, 'ICT');
                        addChapterList('HSC', 'Information and Communication Technology', content.hscIctChapters, 'ICT');
                        addChapterList('SSC', 'Physics', content.sscPhysicsChapters);
                        addChapterList('SSC', 'Chemistry', content.sscChemistryChapters);
                        addChapterList('SSC', 'Biology', content.sscBiologyChapters);
                        addChapterList('SSC', 'Bangladesh and Global Studies', content.sscBangladeshGlobalChapters);

                        Object.entries(content.sscReligionChapters || {}).forEach(([religionKey, list]) => {
                            addChapterList('SSC', 'Religion and Moral Education', list, religionKey);
                        });

                        addChapterList('HSC', 'Physics 1st Paper', content.hscPhysics1stChapters);
                        addChapterList('HSC', 'Physics 2nd Paper', content.hscPhysics2ndChapters);
                        addChapterList('HSC', 'Chemistry 1st Paper', content.hscChemistry1stChapters);
                        addChapterList('HSC', 'Chemistry 2nd Paper', content.hscChemistry2ndChapters);
                        addChapterList('HSC', 'Biology 1st Paper', content.hscBiology1stChapters);
                        addChapterList('HSC', 'Biology 2nd Paper', content.hscBiology2ndChapters);

                        addChapterList('SSC', 'Bangla 1st Paper', content.sscGoddoItems, 'গদ্য');
                        addChapterList('SSC', 'Bangla 1st Paper', content.sscPoddoItems, 'পদ্য');
                        addChapterList('SSC', 'Bangla 1st Paper', content.sscShohopathItems, 'সহপাঠ');
                        addChapterList('HSC', 'Bangla 1st Paper', content.hscGoddoItems, 'গদ্য');
                        addChapterList('HSC', 'Bangla 1st Paper', content.hscPoddoItems, 'পদ্য');
                        addChapterList('HSC', 'Bangla 1st Paper', content.hscShohopathItems, 'সহপাঠ');

                        setChapterEntries(entries);
                    } catch (error) {
                        console.warn('Failed to load chapters', error);
                    }
                };
                loadChapters();
                return () => {
                    isActive = false;
                };
            }, []);

            const handleSaved = (thumbnail) => {
                setThumbnailMap((prev) => ({
                    ...prev,
                    [thumbnail.subjectKey]: {
                        url: thumbnail.url
                    }
                }));
                setStatusMessage('Thumbnail updated successfully.');
            };

            const handleChapterSaved = (thumbnail) => {
                setChapterThumbnailMap((prev) => ({
                    ...prev,
                    [thumbnail.chapterKey]: {
                        url: thumbnail.url
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
                        <div className="flex flex-wrap gap-2">
                            {['subject', 'chapter'].map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => {
                                        setActiveMode(mode);
                                        setActiveClass(null);
                                        setActiveSubject(null);
                                    }}
                                    className={
                                        'px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.3em] border transition ' +
                                        (activeMode === mode
                                            ? 'border-gray-900 text-gray-900'
                                            : 'border-gray-200 text-gray-500 hover:border-gray-300')
                                    }
                                >
                                    {mode === 'subject' ? 'Subject thumbnails' : 'Chapter thumbnails'}
                                </button>
                            ))}
                        </div>
                        <div>
                            <div className="text-xs uppercase tracking-[0.3em] text-gray-400">Library</div>
                            <h3 className="text-lg font-semibold text-gray-900 mt-2">
                                {activeMode === 'subject' ? 'Subject thumbnails' : 'Chapter thumbnails'}
                            </h3>
                            <p className="text-sm text-gray-500 mt-2">
                                {activeMode === 'subject'
                                    ? 'Choose the class first, then select a subject to upload a thumbnail.'
                                    : 'Choose the class first, then select a chapter to upload a thumbnail.'}
                            </p>
                        </div>
                        {!activeClass ? (
                            <div className="grid card-grid-gap sm:grid-cols-2">
                                {['SSC', 'HSC'].map((classLabel) => (
                                    <button
                                        key={classLabel}
                                        onClick={() => setActiveClass(classLabel)}
                                        className="border border-gray-200 rounded-2xl p-5 text-left hover:border-gray-300 hover:bg-gray-50 transition"
                                    >
                                        <div className="text-xs uppercase tracking-[0.3em] text-gray-400">Class</div>
                                        <div className="text-lg font-semibold text-gray-900 mt-2">{classLabel}</div>
                                        <div className="text-sm text-gray-500 mt-1">
                                            {activeMode === 'subject'
                                                ? 'Upload thumbnails for ' + classLabel + ' subjects.'
                                                : 'Upload thumbnails for ' + classLabel + ' chapters.'}
                                        </div>
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
                                <div className="grid card-grid-gap sm:grid-cols-2 lg:grid-cols-3">
                                    {(activeMode === 'subject'
                                        ? thumbnailSubjects.filter((subject) => subject.classLabel === activeClass)
                                        : chapterEntries.filter((entry) => entry.classLabel === activeClass)
                                    ).map((subject) => {
                                        const thumbnail =
                                            activeMode === 'subject'
                                                ? thumbnailMap[subject.subjectKey]
                                                : chapterThumbnailMap[subject.subjectKey];
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
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {subject.subjectLabel || subject.classLabel}
                                                    </div>
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
                            storedThumbnail={
                                activeMode === 'subject'
                                    ? thumbnailMap[activeSubject.subjectKey]
                                    : chapterThumbnailMap[activeSubject.subjectKey]
                            }
                            uploadUrl={activeMode === 'subject' ? '/api/thumbnails' : '/api/chapter-thumbnails'}
                            keyField={activeMode === 'subject' ? 'subjectKey' : 'chapterKey'}
                            modeLabel={activeMode === 'subject' ? 'Subject thumbnail' : 'Chapter thumbnail'}
                            onSaved={(thumbnail) => {
                                if (activeMode === 'subject') {
                                    handleSaved(thumbnail);
                                } else {
                                    handleChapterSaved(thumbnail);
                                }
                                setActiveSubject(null);
                            }}
                            onClose={() => setActiveSubject(null)}
                        />
                    )}
                </AdminShell>
            );
        };

        const UserManagementSettings = ({ onNavigate, onBack }) => {
            const [activePanel, setActivePanel] = useState('menu');
            const [teachers, setTeachers] = useState([]);
            const [admins, setAdmins] = useState([]);
            const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
            const [isTeacherEditOpen, setIsTeacherEditOpen] = useState(false);
            const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
            const [statusMessage, setStatusMessage] = useState(null);
            const [teacherForm, setTeacherForm] = useState({
                name: '',
                email: '',
                password: '',
                level: 'SSC',
                subject: '',
                permissions: {
                    structure: false
                }
            });
            const [teacherEdit, setTeacherEdit] = useState({
                id: null,
                name: '',
                email: '',
                level: 'SSC',
                subject: '',
                permissions: {
                    structure: false
                }
            });
            const [adminForm, setAdminForm] = useState({
                name: '',
                email: '',
                password: '',
                permissions: {
                    dashboard: true,
                    classes: true,
                    settings: true,
                    thumbnails: false,
                    userManagement: false
                }
            });

            const teacherSubjects = Array.from(
                Object.entries(adminSubjectGroups)
                    .flatMap(([level, groups]) =>
                        Object.values(groups).flatMap((subjects) => subjects.map((subject) => ({ level, subject })))
                    )
                    .filter((entry) => entry.level === teacherForm.level)
                    .reduce((map, entry) => {
                        if (!map.has(entry.subject)) {
                            map.set(entry.subject, entry);
                        }
                        return map;
                    }, new Map())
                    .values()
            );

            const resetTeacherForm = () => {
                setTeacherForm({
                    name: '',
                    email: '',
                    password: '',
                    level: 'SSC',
                    subject: '',
                    permissions: {
                        structure: false
                    }
                });
            };
            const resetTeacherEdit = () => {
                setTeacherEdit({
                    id: null,
                    name: '',
                    email: '',
                    level: 'SSC',
                    subject: '',
                    permissions: {
                        structure: false
                    }
                });
            };

            const resetAdminForm = () => {
                setAdminForm({
                    name: '',
                    email: '',
                    password: '',
                    permissions: {
                        dashboard: true,
                        classes: true,
                        settings: true,
                        thumbnails: false,
                        userManagement: false
                    }
                });
            };

            const fetchUsers = async () => {
                const token = localStorage.getItem('auth_token');
                if (!token) return;
                try {
                    const response = await fetch('/api/users', {
                        headers: { 'Authorization': 'Bearer ' + token }
                    });
                    const data = await response.json();
                    if (data.success) {
                        setTeachers(data.teachers || []);
                        setAdmins(data.admins || []);
                        setStatusMessage(null);
                    } else {
                        setStatusMessage(data.error || 'Unable to load users.');
                    }
                } catch (error) {
                    setStatusMessage('Unable to load users.');
                }
            };

            useEffect(() => {
                if (activePanel === 'teachers' || activePanel === 'admins') {
                    fetchUsers();
                }
            }, [activePanel]);

            const handleAddTeacher = async () => {
                if (!teacherForm.name || !teacherForm.email || !teacherForm.password || !teacherForm.subject) return;
                const token = localStorage.getItem('auth_token');
                if (!token) return;
                const permissionList = Object.entries(teacherForm.permissions)
                    .filter(([, enabled]) => enabled)
                    .map(([key]) => key);
                try {
                    const response = await fetch('/api/users', {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer ' + token,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            role: 'teacher',
                            name: teacherForm.name,
                            email: teacherForm.email,
                            password: teacherForm.password,
                            level: teacherForm.level,
                            subject: teacherForm.subject,
                            permissions: permissionList
                        })
                    });
                    const data = await response.json();
                    if (data.success) {
                        await fetchUsers();
                        resetTeacherForm();
                        setIsTeacherModalOpen(false);
                    } else {
                        setStatusMessage(data.error || 'Unable to add teacher.');
                    }
                } catch (error) {
                    setStatusMessage('Unable to add teacher.');
                }
            };

            const handleAddAdmin = async () => {
                if (!adminForm.name || !adminForm.email || !adminForm.password) return;
                const token = localStorage.getItem('auth_token');
                if (!token) return;
                const permissionList = Object.entries(adminForm.permissions)
                    .filter(([, enabled]) => enabled)
                    .map(([key]) => key);
                try {
                    const response = await fetch('/api/users', {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer ' + token,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            role: 'admin',
                            name: adminForm.name,
                            email: adminForm.email,
                            password: adminForm.password,
                            permissions: permissionList
                        })
                    });
                    const data = await response.json();
                    if (data.success) {
                        await fetchUsers();
                        resetAdminForm();
                        setIsAdminModalOpen(false);
                    } else {
                        setStatusMessage(data.error || 'Unable to add admin.');
                    }
                } catch (error) {
                    setStatusMessage('Unable to add admin.');
                }
            };

            const permissionLabels = {
                dashboard: 'Dashboard',
                classes: 'Classes',
                settings: 'Settings',
                thumbnails: 'Thumbnails',
                userManagement: 'User management'
            };
            const teacherPermissionLabels = {
                structure: 'Structure edits'
            };
            const handleEditTeacher = (teacher) => {
                setTeacherEdit({
                    id: teacher.id,
                    name: teacher.name,
                    email: teacher.email,
                    level: teacher.level || 'SSC',
                    subject: teacher.subject || '',
                    permissions: {
                        structure: teacher.permissions?.includes('structure') || false
                    }
                });
                setIsTeacherEditOpen(true);
            };
            const handleUpdateTeacher = async () => {
                if (!teacherEdit.id || !teacherEdit.subject) return;
                const token = localStorage.getItem('auth_token');
                if (!token) return;
                const permissionList = Object.entries(teacherEdit.permissions)
                    .filter(([, enabled]) => enabled)
                    .map(([key]) => key);
                try {
                    const response = await fetch('/api/users', {
                        method: 'PUT',
                        headers: {
                            'Authorization': 'Bearer ' + token,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            id: teacherEdit.id,
                            role: 'teacher',
                            level: teacherEdit.level,
                            subject: teacherEdit.subject,
                            permissions: permissionList
                        })
                    });
                    const data = await response.json();
                    if (data.success) {
                        await fetchUsers();
                        resetTeacherEdit();
                        setIsTeacherEditOpen(false);
                        setStatusMessage(null);
                    } else {
                        setStatusMessage(data.error || 'Unable to update teacher.');
                    }
                } catch (error) {
                    setStatusMessage('Unable to update teacher.');
                }
            };

            return (
                <AdminShell
                    title="User management"
                    subtitle="Assign teachers and admins with access scope."
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
                        {activePanel !== 'menu' && (
                            <button
                                onClick={() => setActivePanel('menu')}
                                className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 hover:text-gray-700 transition"
                            >
                                User management menu
                            </button>
                        )}
                    </div>

                    {statusMessage && (
                        <div className="mt-3 text-sm text-gray-500">{statusMessage}</div>
                    )}

                    {activePanel === 'menu' && (
                        <div className="grid card-grid-gap md:grid-cols-2 mt-4">
                            <button
                                onClick={() => setActivePanel('teachers')}
                                className="border border-gray-200 rounded-2xl p-5 text-left hover:border-gray-300 hover:bg-gray-50 transition"
                            >
                                <div className="text-xs uppercase tracking-[0.3em] text-gray-400">Assign</div>
                                <div className="text-lg font-semibold text-gray-900 mt-2">Teacher</div>
                                <div className="text-sm text-gray-500 mt-1">Create teachers with level and subject access.</div>
                            </button>
                            <button
                                onClick={() => setActivePanel('admins')}
                                className="border border-gray-200 rounded-2xl p-5 text-left hover:border-gray-300 hover:bg-gray-50 transition"
                            >
                                <div className="text-xs uppercase tracking-[0.3em] text-gray-400">Assign</div>
                                <div className="text-lg font-semibold text-gray-900 mt-2">Admin</div>
                                <div className="text-sm text-gray-500 mt-1">Create admins with menu and settings access.</div>
                            </button>
                        </div>
                    )}

                    {activePanel === 'teachers' && (
                        <div className="space-y-4 mt-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xs uppercase tracking-[0.3em] text-gray-400">Teachers</div>
                                    <h3 className="text-lg font-semibold text-gray-900 mt-2">Assigned teachers</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Teachers will see only the class and subject assigned here.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsTeacherModalOpen(true)}
                                    className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-[0.3em] bg-gray-900 text-white hover:bg-gray-800 transition"
                                >
                                    Add teacher
                                </button>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-[0.2em]">
                                        <tr>
                                            <th className="text-left px-4 py-3">Name</th>
                                            <th className="text-left px-4 py-3">Email</th>
                                            <th className="text-left px-4 py-3">Level</th>
                                            <th className="text-left px-4 py-3">Subject</th>
                                            <th className="text-left px-4 py-3">Permissions</th>
                                            <th className="text-left px-4 py-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {teachers.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="px-4 py-6 text-center text-gray-400">
                                                    No teachers assigned yet.
                                                </td>
                                            </tr>
                                        )}
                                        {teachers.map((teacher) => (
                                            <tr key={teacher.id} className="border-t border-gray-100">
                                                <td className="px-4 py-3 font-semibold text-gray-800">{teacher.name}</td>
                                                <td className="px-4 py-3 text-gray-500">{teacher.email}</td>
                                                <td className="px-4 py-3 text-gray-500">{teacher.level}</td>
                                                <td className="px-4 py-3 text-gray-500">{teacher.subject}</td>
                                                <td className="px-4 py-3 text-gray-500 capitalize">
                                                    {teacher.permissions?.length ? teacher.permissions.join(', ') : 'None'}
                                                </td>
                                                <td className="px-4 py-3 text-gray-500">
                                                    <button
                                                        onClick={() => handleEditTeacher(teacher)}
                                                        className="px-3 py-1.5 rounded-md text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                                                    >
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activePanel === 'admins' && (
                        <div className="space-y-4 mt-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xs uppercase tracking-[0.3em] text-gray-400">Admins</div>
                                    <h3 className="text-lg font-semibold text-gray-900 mt-2">Assigned admins</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Control which menus and settings each admin can access.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsAdminModalOpen(true)}
                                    className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-[0.3em] bg-gray-900 text-white hover:bg-gray-800 transition"
                                >
                                    Add admin
                                </button>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-[0.2em]">
                                        <tr>
                                            <th className="text-left px-4 py-3">Name</th>
                                            <th className="text-left px-4 py-3">Email</th>
                                            <th className="text-left px-4 py-3">Permissions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {admins.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className="px-4 py-6 text-center text-gray-400">
                                                    No admins assigned yet.
                                                </td>
                                            </tr>
                                        )}
                                        {admins.map((admin) => (
                                            <tr key={admin.id} className="border-t border-gray-100">
                                                <td className="px-4 py-3 font-semibold text-gray-800">{admin.name}</td>
                                                <td className="px-4 py-3 text-gray-500">{admin.email}</td>
                                                <td className="px-4 py-3 text-gray-500 capitalize">
                                                    {admin.permissions.length ? admin.permissions.join(', ') : 'None'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {isTeacherModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
                            <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <div className="text-xs uppercase tracking-[0.3em] text-gray-400">Add teacher</div>
                                    <div className="text-lg font-semibold text-gray-900 mt-2">Assign teacher access</div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        Provide login details and the subject they manage.
                                    </div>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="text-xs uppercase tracking-[0.3em] text-gray-400">Name</label>
                                        <input
                                            value={teacherForm.name}
                                            onChange={(event) =>
                                                setTeacherForm((prev) => ({ ...prev, name: event.target.value }))
                                            }
                                            className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                                            placeholder="Teacher name"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs uppercase tracking-[0.3em] text-gray-400">Email</label>
                                        <input
                                            value={teacherForm.email}
                                            onChange={(event) =>
                                                setTeacherForm((prev) => ({ ...prev, email: event.target.value }))
                                            }
                                            className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                                            placeholder="teacher@email.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs uppercase tracking-[0.3em] text-gray-400">Password</label>
                                        <input
                                            type="password"
                                            value={teacherForm.password}
                                            onChange={(event) =>
                                                setTeacherForm((prev) => ({ ...prev, password: event.target.value }))
                                            }
                                            className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                                            placeholder="Temporary password"
                                        />
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="text-xs uppercase tracking-[0.3em] text-gray-400">Level</label>
                                            <select
                                                value={teacherForm.level}
                                                onChange={(event) =>
                                                    setTeacherForm((prev) => ({
                                                        ...prev,
                                                        level: event.target.value,
                                                        subject: ''
                                                    }))
                                                }
                                                className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-200"
                                            >
                                                <option value="SSC">SSC</option>
                                                <option value="HSC">HSC</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs uppercase tracking-[0.3em] text-gray-400">Subject</label>
                                            <select
                                                value={teacherForm.subject}
                                                onChange={(event) =>
                                                    setTeacherForm((prev) => ({ ...prev, subject: event.target.value }))
                                                }
                                                className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-200"
                                            >
                                                <option value="">Select subject</option>
                                                {teacherSubjects.map((entry) => (
                                                    <option key={entry.level + '-' + entry.subject} value={entry.subject}>
                                                        {entry.subject}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs uppercase tracking-[0.3em] text-gray-400">Permissions</div>
                                        <div className="mt-3 space-y-2">
                                            {Object.entries(teacherPermissionLabels).map(([key, label]) => (
                                                <label key={key} className="flex items-center gap-2 text-sm text-gray-600">
                                                    <input
                                                        type="checkbox"
                                                        checked={teacherForm.permissions[key]}
                                                        onChange={(event) =>
                                                            setTeacherForm((prev) => ({
                                                                ...prev,
                                                                permissions: {
                                                                    ...prev.permissions,
                                                                    [key]: event.target.checked
                                                                }
                                                            }))
                                                        }
                                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-200"
                                                    />
                                                    {label}
                                                </label>
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-2">
                                            Enable structure edits only when teachers should change chapters or topics.
                                        </p>
                                    </div>
                                </div>
                                <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
                                    <button
                                        onClick={() => {
                                            setIsTeacherModalOpen(false);
                                            resetTeacherForm();
                                        }}
                                        className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-[0.3em] border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddTeacher}
                                        className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-[0.3em] bg-gray-900 text-white hover:bg-gray-800 transition"
                                    >
                                        Save teacher
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {isTeacherEditOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
                            <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <div className="text-xs uppercase tracking-[0.3em] text-gray-400">Edit teacher</div>
                                    <div className="text-lg font-semibold text-gray-900 mt-2">Update teacher access</div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        Adjust the assigned subject and permissions for this teacher.
                                    </div>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="text-xs uppercase tracking-[0.3em] text-gray-400">Name</label>
                                            <div className="mt-2 text-sm font-semibold text-gray-700">
                                                {teacherEdit.name}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs uppercase tracking-[0.3em] text-gray-400">Email</label>
                                            <div className="mt-2 text-sm text-gray-500">{teacherEdit.email}</div>
                                        </div>
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="text-xs uppercase tracking-[0.3em] text-gray-400">Level</label>
                                            <select
                                                value={teacherEdit.level}
                                                onChange={(event) =>
                                                    setTeacherEdit((prev) => ({
                                                        ...prev,
                                                        level: event.target.value,
                                                        subject: ''
                                                    }))
                                                }
                                                className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-200"
                                            >
                                                <option value="SSC">SSC</option>
                                                <option value="HSC">HSC</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs uppercase tracking-[0.3em] text-gray-400">Subject</label>
                                            <select
                                                value={teacherEdit.subject}
                                                onChange={(event) =>
                                                    setTeacherEdit((prev) => ({ ...prev, subject: event.target.value }))
                                                }
                                                className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-200"
                                            >
                                                <option value="">Select subject</option>
                                                {Array.from(
                                                    Object.entries(adminSubjectGroups)
                                                        .flatMap(([level, groups]) =>
                                                            Object.values(groups).flatMap((subjects) =>
                                                                subjects.map((subject) => ({ level, subject }))
                                                            )
                                                        )
                                                        .filter((entry) => entry.level === teacherEdit.level)
                                                        .reduce((map, entry) => {
                                                            if (!map.has(entry.subject)) {
                                                                map.set(entry.subject, entry);
                                                            }
                                                            return map;
                                                        }, new Map())
                                                        .values()
                                                ).map((entry) => (
                                                    <option key={entry.level + '-' + entry.subject} value={entry.subject}>
                                                        {entry.subject}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs uppercase tracking-[0.3em] text-gray-400">Permissions</div>
                                        <div className="mt-3 space-y-2">
                                            {Object.entries(teacherPermissionLabels).map(([key, label]) => (
                                                <label key={key} className="flex items-center gap-2 text-sm text-gray-600">
                                                    <input
                                                        type="checkbox"
                                                        checked={teacherEdit.permissions[key]}
                                                        onChange={(event) =>
                                                            setTeacherEdit((prev) => ({
                                                                ...prev,
                                                                permissions: {
                                                                    ...prev.permissions,
                                                                    [key]: event.target.checked
                                                                }
                                                            }))
                                                        }
                                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-200"
                                                    />
                                                    {label}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
                                    <button
                                        onClick={() => {
                                            setIsTeacherEditOpen(false);
                                            resetTeacherEdit();
                                        }}
                                        className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-[0.3em] border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleUpdateTeacher}
                                        className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-[0.3em] bg-gray-900 text-white hover:bg-gray-800 transition"
                                    >
                                        Save changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {isAdminModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
                            <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <div className="text-xs uppercase tracking-[0.3em] text-gray-400">Add admin</div>
                                    <div className="text-lg font-semibold text-gray-900 mt-2">Assign admin access</div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        Choose which menus and settings this admin can access.
                                    </div>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="text-xs uppercase tracking-[0.3em] text-gray-400">Name</label>
                                        <input
                                            value={adminForm.name}
                                            onChange={(event) =>
                                                setAdminForm((prev) => ({ ...prev, name: event.target.value }))
                                            }
                                            className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                                            placeholder="Admin name"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs uppercase tracking-[0.3em] text-gray-400">Email</label>
                                        <input
                                            value={adminForm.email}
                                            onChange={(event) =>
                                                setAdminForm((prev) => ({ ...prev, email: event.target.value }))
                                            }
                                            className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                                            placeholder="admin@email.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs uppercase tracking-[0.3em] text-gray-400">Password</label>
                                        <input
                                            type="password"
                                            value={adminForm.password}
                                            onChange={(event) =>
                                                setAdminForm((prev) => ({ ...prev, password: event.target.value }))
                                            }
                                            className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                                            placeholder="Temporary password"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs uppercase tracking-[0.3em] text-gray-400">Permissions</label>
                                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                            {Object.entries(adminForm.permissions).map(([key, enabled]) => (
                                                <label key={key} className="flex items-center gap-2 text-sm text-gray-600">
                                                    <input
                                                        type="checkbox"
                                                        checked={enabled}
                                                        onChange={(event) =>
                                                            setAdminForm((prev) => ({
                                                                ...prev,
                                                                permissions: {
                                                                    ...prev.permissions,
                                                                    [key]: event.target.checked
                                                                }
                                                            }))
                                                        }
                                                    />
                                                    {permissionLabels[key]}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
                                    <button
                                        onClick={() => {
                                            setIsAdminModalOpen(false);
                                            resetAdminForm();
                                        }}
                                        className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-[0.3em] border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddAdmin}
                                        className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-[0.3em] bg-gray-900 text-white hover:bg-gray-800 transition"
                                    >
                                        Save admin
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </AdminShell>
            );
        };

        const ProfileManagement = ({ onNavigate, onBack, showHistory, shell = 'admin' }) => {
            const { profile, history, refreshProfile, setProfile } = useProfileData();
            const [statusMessage, setStatusMessage] = useState(null);
            const [nameInput, setNameInput] = useState('');
            const [isSaving, setIsSaving] = useState(false);
            const [avatarFile, setAvatarFile] = useState(null);
            const [avatarPreview, setAvatarPreview] = useState('');
            const ShellComponent = shell === 'teacher' ? TeacherShell : AdminShell;
            const formatHistoryDetails = (details) => {
                if (!details) return '';
                try {
                    const parsed = JSON.parse(details);
                    if (parsed && typeof parsed === 'object') {
                        return Object.entries(parsed)
                            .map(([key, value]) => \`\${key}: \${value}\`)
                            .join(' • ');
                    }
                } catch (error) {
                    return details;
                }
                return details;
            };

            useEffect(() => {
                if (profile?.name) {
                    setNameInput(profile.name);
                }
            }, [profile?.name]);

            useEffect(() => {
                if (!avatarFile) {
                    setAvatarPreview('');
                    return undefined;
                }
                const nextUrl = URL.createObjectURL(avatarFile);
                setAvatarPreview(nextUrl);
                return () => URL.revokeObjectURL(nextUrl);
            }, [avatarFile]);

            const handleNameSave = async () => {
                if (!nameInput.trim()) {
                    setStatusMessage('Please enter a display name.');
                    return;
                }
                setIsSaving(true);
                setStatusMessage(null);
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    setStatusMessage('You must be logged in to update your profile.');
                    setIsSaving(false);
                    return;
                }
                try {
                    const response = await fetch('/api/profile', {
                        method: 'PUT',
                        headers: {
                            Authorization: 'Bearer ' + token,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ name: nameInput.trim() })
                    });
                    const data = await response.json();
                    if (data.success) {
                        setStatusMessage('Profile updated.');
                        setProfile((prev) => ({ ...prev, name: nameInput.trim() }));
                    } else {
                        setStatusMessage(data.error || 'Profile update failed.');
                    }
                } catch (error) {
                    setStatusMessage('Profile update failed.');
                } finally {
                    setIsSaving(false);
                }
            };

            const handleAvatarUpload = async () => {
                if (!avatarFile) {
                    setStatusMessage('Please select an image to upload.');
                    return;
                }
                setIsSaving(true);
                setStatusMessage(null);
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    setStatusMessage('You must be logged in to update your picture.');
                    setIsSaving(false);
                    return;
                }
                try {
                    const resized = await resizeImageFile(avatarFile, { maxWidth: 480, maxHeight: 480, quality: 0.8 });
                    const formData = new FormData();
                    formData.append('file', resized || avatarFile);
                    const response = await fetch('/api/profile/avatar', {
                        method: 'POST',
                        headers: {
                            Authorization: 'Bearer ' + token
                        },
                        body: formData
                    });
                    const data = await response.json();
                    if (data.success) {
                        setStatusMessage('Profile picture updated.');
                        setAvatarFile(null);
                        await refreshProfile();
                    } else {
                        setStatusMessage(data.error || 'Upload failed.');
                    }
                } catch (error) {
                    setStatusMessage('Upload failed.');
                } finally {
                    setIsSaving(false);
                }
            };

            const resolvedPreview = avatarPreview || profile?.avatarUrl;

            return (
                <ShellComponent
                    title="Profile management"
                    subtitle="Review your account details and update your profile."
                    activeTab="settings"
                    onNavigate={onNavigate}
                >
                    <div className="space-y-6">
                        <div className="flex items-start gap-6 flex-col md:flex-row">
                            <div className="w-full md:w-60 space-y-3">
                                <div className="text-xs uppercase tracking-[0.3em] text-gray-400">Profile picture</div>
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-2xl border border-gray-200 bg-gray-100 overflow-hidden flex items-center justify-center">
                                        {resolvedPreview ? (
                                            <img src={resolvedPreview} alt="Profile preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-xs font-semibold text-gray-400 uppercase">No photo</span>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-[0.2em] border border-gray-200 text-gray-600 cursor-pointer hover:bg-gray-50 transition">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(event) => setAvatarFile(event.target.files?.[0] || null)}
                                                className="hidden"
                                            />
                                            {profile?.avatarUrl ? 'Change picture' : 'Upload picture'}
                                        </label>
                                        <button
                                            onClick={handleAvatarUpload}
                                            disabled={isSaving || !avatarFile}
                                            className="block px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-[0.2em] bg-gray-900 text-white hover:bg-gray-800 transition disabled:opacity-50"
                                        >
                                            {isSaving ? 'Saving...' : 'Save picture'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 space-y-4">
                                <div className="text-xs uppercase tracking-[0.3em] text-gray-400">Profile details</div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="text-xs uppercase tracking-[0.3em] text-gray-400">Display name</label>
                                        <input
                                            type="text"
                                            value={nameInput}
                                            onChange={(event) => setNameInput(event.target.value)}
                                            className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                    <div className="text-sm text-gray-600 space-y-2">
                                        <div>
                                            <div className="text-xs uppercase tracking-[0.3em] text-gray-400">Email</div>
                                            <div className="mt-2">{profile?.email || profile?.username || '—'}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs uppercase tracking-[0.3em] text-gray-400">Role</div>
                                            <div className="mt-2">{formatRoleLabel(profile?.role)}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleNameSave}
                                        disabled={isSaving}
                                        className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-[0.3em] bg-blue-600 text-white hover:bg-blue-500 transition disabled:opacity-60"
                                    >
                                        {isSaving ? 'Saving...' : 'Save changes'}
                                    </button>
                                </div>
                                {statusMessage && <div className="text-sm text-gray-500">{statusMessage}</div>}
                            </div>
                        </div>
                        {showHistory && (
                            <div className="border border-gray-200 rounded-2xl p-5 space-y-3">
                                <div className="text-xs uppercase tracking-[0.3em] text-gray-400">Recent activity</div>
                                <div className="space-y-3">
                                    {history.length === 0 ? (
                                        <div className="text-sm text-gray-500">No recent edits yet.</div>
                                    ) : (
                                        history.map((entry, index) => (
                                            <div key={index} className="text-sm text-gray-600">
                                                <div className="font-semibold text-gray-800">{entry.action}</div>
                                                <div className="text-xs text-gray-400">
                                                    {entry.createdAt ? new Date(entry.createdAt).toLocaleString() : ''}
                                                </div>
                                                {entry.details && (
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {formatHistoryDetails(entry.details)}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                        {onBack && (
                            <button
                                onClick={onBack}
                                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 hover:text-gray-800 transition"
                            >
                                <i className="fa-solid fa-arrow-left"></i>
                                Back to settings
                            </button>
                        )}
                    </div>
                </ShellComponent>
            );
        };

        const AdminSettings = ({ onNavigate }) => {
            const [statusMessage, setStatusMessage] = useState(null);
            const [isResetting, setIsResetting] = useState(false);
            const [activePanel, setActivePanel] = useState('main');
            const [isHardResetting, setIsHardResetting] = useState(false);
            const [hardResetPassword, setHardResetPassword] = useState('');
            const { profile } = useProfileData();

            if (activePanel === 'users') {
                return <UserManagementSettings onNavigate={onNavigate} onBack={() => setActivePanel('main')} />;
            }
            if (activePanel === 'profile') {
                return (
                    <ProfileManagement
                        onNavigate={onNavigate}
                        onBack={() => setActivePanel('main')}
                        showHistory
                    />
                );
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

            const handleHardReset = async () => {
                if (!hardResetPassword) {
                    setStatusMessage('Enter your password to continue.');
                    return;
                }
                const confirmed = window.confirm(
                    'Hard reset will wipe all data, users, and content. This cannot be undone. Continue?'
                );
                if (!confirmed) return;
                setIsHardResetting(true);
                setStatusMessage(null);

                const token = localStorage.getItem('auth_token');
                if (!token) {
                    setStatusMessage('You must be logged in to reset the site.');
                    setIsHardResetting(false);
                    return;
                }

                try {
                    const response = await fetch('/api/settings/hard-reset', {
                        method: 'POST',
                        headers: {
                            Authorization: 'Bearer ' + token,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ password: hardResetPassword })
                    });
                    const data = await response.json();
                    if (data.success) {
                        localStorage.removeItem('auth_token');
                        window.location.href = '/register';
                        return;
                    }
                    setStatusMessage(data.error || 'Hard reset failed.');
                } catch (error) {
                    setStatusMessage('Hard reset failed. Please try again.');
                } finally {
                    setIsHardResetting(false);
                }
            };

            return (
                <AdminShell
                    title="Settings"
                    subtitle="Manage system preferences and maintenance actions."
                    activeTab="settings"
                    onNavigate={onNavigate}
                >
                    <div className="space-y-6">
                        <div className="border border-gray-200 rounded-2xl divide-y divide-gray-200">
                            <button
                                onClick={() => setActivePanel('profile')}
                                className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                            >
                                <span>Profile management</span>
                                <span className="text-xs text-gray-400">Update picture and name</span>
                            </button>
                            <button
                                onClick={() => setActivePanel('users')}
                                className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                            >
                                <span>User management</span>
                                <span className="text-xs text-gray-400">Assign teacher and admin access</span>
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
                        <div className="border border-rose-200 rounded-2xl p-5 space-y-3 bg-rose-50/40">
                            <div className="text-xs uppercase tracking-[0.3em] text-rose-400">Hard reset</div>
                            <p className="text-sm text-rose-600">
                                This will remove all data, drop every table, and reset the site to first setup.
                            </p>
                            <input
                                type="password"
                                value={hardResetPassword}
                                onChange={(event) => setHardResetPassword(event.target.value)}
                                className="w-full border border-rose-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 bg-white"
                                placeholder="Confirm with your password"
                            />
                            <div className="flex justify-end">
                                <button
                                    onClick={handleHardReset}
                                    disabled={isHardResetting}
                                    className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-[0.3em] bg-rose-600 text-white hover:bg-rose-500 transition disabled:opacity-60"
                                >
                                    {isHardResetting ? 'Resetting...' : 'Hard reset'}
                                </button>
                            </div>
                        </div>
                    </div>
                    {statusMessage && (
                        <div className="text-sm text-gray-500">{statusMessage}</div>
                    )}
                </AdminShell>
            );
        };
        const TeacherSettings = ({ onNavigate }) => {
            const [statusMessage, setStatusMessage] = useState(null);
            const [isSaving, setIsSaving] = useState(false);
            const [formState, setFormState] = useState({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            const [activePanel, setActivePanel] = useState('main');
            const { profile } = useProfileData();

            if (activePanel === 'profile') {
                return (
                    <ProfileManagement
                        onNavigate={onNavigate}
                        onBack={() => setActivePanel('main')}
                        showHistory={false}
                        shell="teacher"
                    />
                );
            }

            const handleChangePassword = async () => {
                if (!formState.currentPassword || !formState.newPassword || !formState.confirmPassword) {
                    setStatusMessage('Please fill in all password fields.');
                    return;
                }
                if (formState.newPassword !== formState.confirmPassword) {
                    setStatusMessage('New passwords do not match.');
                    return;
                }
                setIsSaving(true);
                setStatusMessage(null);

                const token = localStorage.getItem('auth_token');
                if (!token) {
                    setStatusMessage('You must be logged in to update your password.');
                    setIsSaving(false);
                    return;
                }

                try {
                    const response = await fetch('/api/change-password', {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer ' + token,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            currentPassword: formState.currentPassword,
                            newPassword: formState.newPassword,
                            confirmPassword: formState.confirmPassword
                        })
                    });
                    const data = await response.json();
                    if (data.success) {
                        setStatusMessage('Password updated successfully.');
                        setFormState({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    } else {
                        setStatusMessage(data.error || 'Unable to update password.');
                    }
                } catch (error) {
                    setStatusMessage('Unable to update password.');
                } finally {
                    setIsSaving(false);
                }
            };

            return (
                <TeacherShell
                    title="Settings"
                    subtitle="Manage your profile details and security."
                    activeTab="settings"
                    onNavigate={onNavigate}
                >
                    {activePanel === 'main' ? (
                        <div className="space-y-6 max-w-xl">
                            <div className="border border-gray-200 rounded-2xl divide-y divide-gray-200">
                                <button
                                    onClick={() => setActivePanel('profile')}
                                    className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                                >
                                    <span>Profile management</span>
                                    <span className="text-xs text-gray-400">Update picture and name</span>
                                </button>
                                <button
                                    onClick={() => setActivePanel('password')}
                                    className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                                >
                                    <span>Change password</span>
                                    <span className="text-xs text-gray-400">Update your login credentials</span>
                                </button>
                            </div>
                            {statusMessage && <div className="text-sm text-gray-500">{statusMessage}</div>}
                        </div>
                    ) : (
                        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4 max-w-xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xs uppercase tracking-[0.3em] text-gray-400">Change password</div>
                                    <div className="text-sm text-gray-500 mt-1">Use your current password to update it.</div>
                                </div>
                                <button
                                    onClick={() => setActivePanel('main')}
                                    className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 hover:text-gray-800 transition"
                                >
                                    Back
                                </button>
                            </div>
                            <div>
                                <label className="text-xs uppercase tracking-[0.3em] text-gray-400">Current password</label>
                                <input
                                    type="password"
                                    value={formState.currentPassword}
                                    onChange={(event) =>
                                        setFormState((prev) => ({ ...prev, currentPassword: event.target.value }))
                                    }
                                    className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                                    placeholder="Enter current password"
                                />
                            </div>
                            <div>
                                <label className="text-xs uppercase tracking-[0.3em] text-gray-400">New password</label>
                                <input
                                    type="password"
                                    value={formState.newPassword}
                                    onChange={(event) =>
                                        setFormState((prev) => ({ ...prev, newPassword: event.target.value }))
                                    }
                                    className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                                    placeholder="Create a new password"
                                />
                            </div>
                            <div>
                                <label className="text-xs uppercase tracking-[0.3em] text-gray-400">Confirm password</label>
                                <input
                                    type="password"
                                    value={formState.confirmPassword}
                                    onChange={(event) =>
                                        setFormState((prev) => ({ ...prev, confirmPassword: event.target.value }))
                                    }
                                    className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                                    placeholder="Re-enter the new password"
                                />
                            </div>
                            {statusMessage && <div className="text-sm text-gray-500">{statusMessage}</div>}
                            <div className="flex justify-end">
                                <button
                                    onClick={handleChangePassword}
                                    disabled={isSaving}
                                    className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-[0.3em] bg-blue-600 text-white hover:bg-blue-500 transition disabled:opacity-60"
                                >
                                    {isSaving ? 'Saving...' : 'Update password'}
                                </button>
                            </div>
                        </div>
                    )}
                </TeacherShell>
            );
        };
        return { AdminSettings, TeacherSettings };
        })();
        const { AdminSettings, TeacherSettings } = AdminSettingsModule;
`;
