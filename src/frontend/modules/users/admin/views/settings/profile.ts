export const settingsProfilePanel = `
        // 1. Profile Editor Component
        const ProfileManagement = ({ onNavigate, onBack, showHistory, shell = 'admin' }) => {
            const { profile, history, refreshProfile, setProfile } = useProfileData();
            const [statusMessage, setStatusMessage] = useState(null);
            const [nameInput, setNameInput] = useState('');
            const [isSaving, setIsSaving] = useState(false);
            const [avatarFile, setAvatarFile] = useState(null);
            const [avatarPreview, setAvatarPreview] = useState('');
            const ShellComponent = shell === 'teacher' ? TeacherShell : shell === 'student' ? StudentShell : AdminShell;

            useEffect(() => { if (profile?.name) setNameInput(profile.name); }, [profile?.name]);
            useEffect(() => { if (avatarFile) setAvatarPreview(URL.createObjectURL(avatarFile)); }, [avatarFile]);

            const handleProfileSave = async () => {
                setIsSaving(true);
                setStatusMessage(null);
                const token = localStorage.getItem('auth_token');
                if (!token) { setStatusMessage('Please log in again.'); setIsSaving(false); return; }

                const messages = [];
                const errors = [];
                const trimmedName = nameInput.trim();
                const shouldUpdateName = trimmedName && trimmedName !== profile?.name;

                if (shouldUpdateName) {
                    const response = await fetch('/api/profile', {
                        method: 'PUT',
                        headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: trimmedName })
                    });
                    const { ok, errorMessage } = await parseApiResponse(response, 'Profile update failed.');
                    if (ok) {
                        messages.push('Name updated.');
                        setProfile(p => ({...p, name: trimmedName}));
                    } else {
                        errors.push(errorMessage);
                    }
                }

                if (avatarFile) {
                    const resized = await resizeImageFile(avatarFile, { maxWidth: 480, maxHeight: 480, quality: 0.8 });
                    const formData = new FormData(); formData.append('file', resized || avatarFile);
                    const response = await fetch('/api/profile/avatar', { method: 'POST', headers: { Authorization: 'Bearer ' + token }, body: formData });
                    const { ok, errorMessage } = await parseApiResponse(response, 'Avatar upload failed.');
                    if (ok) { 
                        messages.push('Picture updated.');
                        setAvatarFile(null);
                        setAvatarPreview('');
                        await refreshProfile(); 
                    } else {
                        errors.push(errorMessage);
                    }
                }

                if (errors.length) {
                    setStatusMessage(errors[0]);
                } else if (messages.length) {
                    setStatusMessage(messages.join(' '));
                } else {
                    setStatusMessage('No changes to save.');
                }
                setIsSaving(false);
            };

            return (
                <ShellComponent title="Edit Profile" subtitle="Update personal details" activeTab="settings" onNavigate={onNavigate}>
                    <div className="animate-fade-in bg-white border border-slate-200 rounded-xl p-6 max-w-2xl shadow-sm">
                        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                            <div className="w-28 h-28 sm:w-24 sm:h-24 bg-slate-100 rounded-full border-2 border-slate-100 overflow-hidden flex-shrink-0 shadow-sm">
                                <img 
                                    src={avatarPreview || profile?.avatarUrl} 
                                    className="w-full h-full object-cover" 
                                    alt="Profile"
                                    onError={(e) => { e.target.style.display = 'none'; }} 
                                />
                                {(!avatarPreview && !profile?.avatarUrl) && (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <i className="fa-solid fa-user text-4xl"></i>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 space-y-4 w-full text-center sm:text-left">
                                <div className="space-y-1">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Change Photo</label>
                                    <input 
                                        type="file" 
                                        onChange={e => setAvatarFile(e.target.files[0])} 
                                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition cursor-pointer mx-auto sm:mx-0"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Display Name</label>
                                    <input 
                                        type="text" 
                                        value={nameInput} 
                                        onChange={e => setNameInput(e.target.value)} 
                                        className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" 
                                        placeholder="Display Name"
                                    />
                                </div>

                                <div className="pt-2">
                                    <button 
                                        onClick={handleProfileSave} 
                                        disabled={isSaving} 
                                        className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>

                                {statusMessage && <div className="p-3 bg-green-50 text-green-700 rounded-lg text-xs font-medium animate-fade-in text-center sm:text-left">{statusMessage}</div>}
                            </div>
                        </div>
                    </div>
                    {onBack && <button onClick={onBack} className="mt-6 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition"><i className="fa-solid fa-arrow-left"></i> Back</button>}
                </ShellComponent>
            );
        };
`;
