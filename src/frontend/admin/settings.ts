export const settingsComponents = `
        const AdminSettingsModule = (() => {
        // ... (Keep existing helpers like resizeImageFile, useProfileData, etc. They are safe) ...
        const adminSubjectGroups = {
            SSC: { Science: ['Bangla 1st', 'Bangla 2nd', 'English 1st', 'English 2nd', 'Math', 'Physics', 'Chemistry', 'Biology', 'BGS', 'ICT', 'Religion'], Humanities: ['Bangla 1st', 'Bangla 2nd', 'English 1st', 'English 2nd', 'Math', 'BGS', 'ICT', 'Geography', 'History', 'Civics', 'Religion'], 'Business Studies': ['Bangla 1st', 'Bangla 2nd', 'English 1st', 'English 2nd', 'Math', 'BGS', 'ICT', 'Accounting', 'Business Ent', 'Finance', 'Religion'] },
            HSC: { Science: ['Bangla 1st', 'Bangla 2nd', 'English 1st', 'English 2nd', 'ICT', 'Physics 1st', 'Physics 2nd', 'Chemistry 1st', 'Chemistry 2nd', 'Biology 1st', 'Biology 2nd', 'Higher Math 1st', 'Higher Math 2nd'], Humanities: ['Bangla 1st', 'Bangla 2nd', 'English 1st', 'English 2nd', 'ICT', 'Economics 1st', 'Economics 2nd', 'History 1st', 'History 2nd', 'Civics 1st', 'Civics 2nd', 'Logic 1st', 'Logic 2nd'], 'Business Studies': ['Bangla 1st', 'Bangla 2nd', 'English 1st', 'English 2nd', 'ICT', 'Accounting 1st', 'Accounting 2nd', 'Business Org 1st', 'Business Org 2nd', 'Finance 1st', 'Finance 2nd', 'Marketing 1st', 'Marketing 2nd'] }
        };

        const resizeImageFile = (file, { maxWidth = 520, maxHeight = 650, quality = 0.82 } = {}) =>
            new Promise((resolve) => {
                if (!file || !(file instanceof File)) { resolve(file); return; }
                const image = new Image();
                const objectUrl = URL.createObjectURL(file);
                image.onload = () => {
                    const ratio = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
                    const targetWidth = Math.max(1, Math.round(image.width * ratio));
                    const targetHeight = Math.max(1, Math.round(image.height * ratio));
                    const canvas = document.createElement('canvas');
                    canvas.width = targetWidth; canvas.height = targetHeight;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
                    canvas.toBlob((blob) => { URL.revokeObjectURL(objectUrl); resolve(new File([blob], file.name, { type: 'image/jpeg' })); }, 'image/jpeg', quality);
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
                if (!token) { setIsLoading(false); return; }
                try {
                    const [profileRes, historyRes] = await Promise.all([ fetch('/api/profile', { headers: { Authorization: 'Bearer ' + token } }), fetch('/api/profile/history', { headers: { Authorization: 'Bearer ' + token } }) ]);
                    const pData = await profileRes.json(); const hData = await historyRes.json();
                    if (pData.success) setProfile(pData.profile);
                    if (hData.success) setHistory(hData.entries || []);
                } catch (e) {} finally { setIsLoading(false); }
            };
            useEffect(() => { loadProfile(); }, []);
            return { profile, history, isLoading, refreshProfile: loadProfile, setProfile };
        };

        const ProfileManagement = ({ onNavigate, onBack, showHistory, shell = 'admin' }) => {
            const { profile, history, refreshProfile, setProfile } = useProfileData();
            const [statusMessage, setStatusMessage] = useState(null);
            const [nameInput, setNameInput] = useState('');
            const [isSaving, setIsSaving] = useState(false);
            const [avatarFile, setAvatarFile] = useState(null);
            const [avatarPreview, setAvatarPreview] = useState('');
            const ShellComponent = shell === 'teacher' ? TeacherShell : AdminShell;

            useEffect(() => { if (profile?.name) setNameInput(profile.name); }, [profile?.name]);
            useEffect(() => { if (avatarFile) setAvatarPreview(URL.createObjectURL(avatarFile)); }, [avatarFile]);

            const handleNameSave = async () => {
                setIsSaving(true);
                const token = localStorage.getItem('auth_token');
                const response = await fetch('/api/profile', { method: 'PUT', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: JSON.stringify({ name: nameInput.trim() }) });
                const data = await response.json();
                if (data.success) { setStatusMessage('Profile updated.'); setProfile(p => ({...p, name: nameInput})); }
                setIsSaving(false);
            };

            const handleAvatarUpload = async () => {
                setIsSaving(true);
                const token = localStorage.getItem('auth_token');
                const resized = await resizeImageFile(avatarFile, { maxWidth: 480, maxHeight: 480, quality: 0.8 });
                const formData = new FormData(); formData.append('file', resized || avatarFile);
                const response = await fetch('/api/profile/avatar', { method: 'POST', headers: { Authorization: 'Bearer ' + token }, body: formData });
                const data = await response.json();
                if (data.success) { setStatusMessage('Picture updated.'); setAvatarFile(null); await refreshProfile(); }
                setIsSaving(false);
            };

            return (
                <ShellComponent title="Profile" subtitle="Update your personal details." activeTab="settings" onNavigate={onNavigate}>
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-2xl">
                        <div className="flex gap-6 items-start">
                            <div className="w-24 h-24 bg-slate-100 rounded-full border overflow-hidden flex-shrink-0">
                                <img src={avatarPreview || profile?.avatarUrl} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 space-y-4">
                                <input type="file" onChange={e => setAvatarFile(e.target.files[0])} className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                                <input type="text" value={nameInput} onChange={e => setNameInput(e.target.value)} className="w-full p-3 border rounded-lg text-sm" placeholder="Display Name"/>
                                <button onClick={() => { if(avatarFile) handleAvatarUpload(); else handleNameSave(); }} disabled={isSaving} className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold">{isSaving ? 'Saving...' : 'Save Changes'}</button>
                                {statusMessage && <p className="text-xs text-slate-500">{statusMessage}</p>}
                            </div>
                        </div>
                    </div>
                    {onBack && <button onClick={onBack} className="mt-4 text-sm text-slate-500 hover:text-slate-800">← Back to settings</button>}
                </ShellComponent>
            );
        };

        const AdminSettings = ({ onNavigate }) => {
            const [statusMessage, setStatusMessage] = useState(null);
            const [isResetting, setIsResetting] = useState(false);
            const [activePanel, setActivePanel] = useState('main');
            const [hardResetPassword, setHardResetPassword] = useState('');

            // --- REMOVED USER MANAGEMENT PANEL HERE ---
            if (activePanel === 'profile') {
                return <ProfileManagement onNavigate={onNavigate} onBack={() => setActivePanel('main')} />;
            }

            const handleReset = async () => {
                if(!confirm('Reset settings? Clears fonts and thumbnails.')) return;
                setIsResetting(true);
                const token = localStorage.getItem('auth_token');
                await fetch('/api/settings/reset', { method: 'POST', headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' }, body: JSON.stringify({ confirm: true }) });
                setIsResetting(false);
                setStatusMessage('Reset complete.');
            };

            const handleHardReset = async () => {
                if (!hardResetPassword) return setStatusMessage('Password required.');
                if(!confirm('HARD RESET: Wipes ALL data. Cannot be undone.')) return;
                const token = localStorage.getItem('auth_token');
                const res = await fetch('/api/settings/hard-reset', { method: 'POST', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: JSON.stringify({ password: hardResetPassword }) });
                const data = await res.json();
                if (data.success) { localStorage.removeItem('auth_token'); window.location.href = '/register'; }
                else setStatusMessage(data.error);
            };

            return (
                <AdminShell title="Settings" subtitle="System preferences and maintenance." activeTab="settings" onNavigate={onNavigate}>
                    <div className="max-w-2xl space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <button onClick={() => setActivePanel('profile')} className="p-6 bg-white border border-slate-200 rounded-xl text-left hover:border-indigo-300 transition shadow-sm group">
                                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition"><i className="fa-solid fa-user-circle text-xl"></i></div>
                                <div className="font-bold text-slate-900">Profile</div>
                                <div className="text-xs text-slate-500 mt-1">Edit name & photo</div>
                            </button>
                            <button onClick={handleReset} disabled={isResetting} className="p-6 bg-white border border-slate-200 rounded-xl text-left hover:border-amber-300 transition shadow-sm group">
                                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition"><i className="fa-solid fa-rotate-right text-xl"></i></div>
                                <div className="font-bold text-slate-900">Soft Reset</div>
                                <div className="text-xs text-slate-500 mt-1">Clear visuals only</div>
                            </button>
                        </div>

                        <div className="bg-rose-50 border border-rose-100 rounded-xl p-6">
                            <h3 className="text-rose-700 font-bold mb-2"><i className="fa-solid fa-triangle-exclamation mr-2"></i>Danger Zone</h3>
                            <p className="text-xs text-rose-600 mb-4">Hard Reset wipes the entire database. Users, content, everything.</p>
                            <div className="flex gap-2">
                                <input type="password" value={hardResetPassword} onChange={e => setHardResetPassword(e.target.value)} className="flex-1 p-2 text-sm border border-rose-200 rounded bg-white" placeholder="Admin Password"/>
                                <button onClick={handleHardReset} className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded hover:bg-rose-700">NUKE SITE</button>
                            </div>
                            {statusMessage && <p className="text-xs text-rose-600 mt-2">{statusMessage}</p>}
                        </div>
                    </div>
                </AdminShell>
            );
        };

        const TeacherSettings = ({ onNavigate }) => {
            // Simplified for brevity - reuse ProfileManagement
            return <ProfileManagement onNavigate={onNavigate} shell="teacher" />;
        };

        return { AdminSettings, TeacherSettings };
        })();
        const { AdminSettings, TeacherSettings } = AdminSettingsModule;
`;
