export const settingsComponents = `
        const AdminSettingsModule = (() => {
        
        // --- DATA CONSTANTS ---
        const adminSubjectGroups = {
            SSC: { Science: ['Bangla 1st', 'Bangla 2nd', 'English 1st', 'English 2nd', 'Math', 'Physics', 'Chemistry', 'Biology', 'BGS', 'ICT', 'Religion'], Humanities: ['Bangla 1st', 'Bangla 2nd', 'English 1st', 'English 2nd', 'Math', 'BGS', 'ICT', 'Geography', 'History', 'Civics', 'Religion'], 'Business Studies': ['Bangla 1st', 'Bangla 2nd', 'English 1st', 'English 2nd', 'Math', 'BGS', 'ICT', 'Accounting', 'Business Ent', 'Finance', 'Religion'] },
            HSC: { Science: ['Bangla 1st', 'Bangla 2nd', 'English 1st', 'English 2nd', 'ICT', 'Physics 1st', 'Physics 2nd', 'Chemistry 1st', 'Chemistry 2nd', 'Biology 1st', 'Biology 2nd', 'Higher Math 1st', 'Higher Math 2nd'], Humanities: ['Bangla 1st', 'Bangla 2nd', 'English 1st', 'English 2nd', 'ICT', 'Economics 1st', 'Economics 2nd', 'History 1st', 'History 2nd', 'Civics 1st', 'Civics 2nd', 'Logic 1st', 'Logic 2nd'], 'Business Studies': ['Bangla 1st', 'Bangla 2nd', 'English 1st', 'English 2nd', 'ICT', 'Accounting 1st', 'Accounting 2nd', 'Business Org 1st', 'Business Org 2nd', 'Finance 1st', 'Finance 2nd', 'Marketing 1st', 'Marketing 2nd'] }
        };

        // --- HELPERS ---
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

        const appendTokenToAvatarUrl = (avatarUrl, token) => {
            if (!avatarUrl || !token) return avatarUrl;
            try {
                const resolved = new URL(avatarUrl, window.location.origin);
                resolved.searchParams.set('token', token);
                return resolved.pathname + resolved.search;
            } catch (error) {
                return avatarUrl;
            }
        };

        const useProfileData = () => {
            const [profile, setProfile] = useState(null);
            const [history, setHistory] = useState([]);
            const [isLoading, setIsLoading] = useState(true);
            
            const loadProfile = async () => {
                const token = localStorage.getItem('auth_token');
                if (!token) { setIsLoading(false); return; }
                try {
                    const [profileRes, historyRes] = await Promise.all([ 
                        fetch('/api/profile', { headers: { Authorization: 'Bearer ' + token } }), 
                        fetch('/api/profile/history', { headers: { Authorization: 'Bearer ' + token } }) 
                    ]);
                    const pData = await profileRes.json(); 
                    const hData = await historyRes.json();
                    
                    if (pData.success) {
                        const profileWithToken = {
                            ...pData.profile,
                            avatarUrl: appendTokenToAvatarUrl(pData.profile?.avatarUrl, token)
                        };
                        setProfile(profileWithToken);
                    }
                    if (hData.success) setHistory(hData.entries || []);
                } catch (e) {} finally { setIsLoading(false); }
            };
            
            useEffect(() => { loadProfile(); }, []);
            return { profile, history, isLoading, refreshProfile: loadProfile, setProfile };
        };

        // --- COMPONENTS ---
        
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
                if (data.success) { 
                    setStatusMessage('Picture updated.'); 
                    setAvatarFile(null); 
                    await refreshProfile(); 
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
                                        onClick={() => { if(avatarFile) handleAvatarUpload(); else handleNameSave(); }} 
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

        // 2. Change Password Component
        const ChangePasswordPanel = ({ onNavigate, onBack, shell = 'admin' }) => {
            const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
            const [statusMessage, setStatusMessage] = useState(null);
            const [isSaving, setIsSaving] = useState(false);
            const ShellComponent = shell === 'teacher' ? TeacherShell : shell === 'student' ? StudentShell : AdminShell;

            const handleSubmit = async () => {
                setIsSaving(true);
                setStatusMessage(null);
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    setStatusMessage('Please log in again.');
                    setIsSaving(false);
                    return;
                }
                const response = await fetch('/api/change-password', {
                    method: 'POST',
                    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
                    body: JSON.stringify(form)
                });
                const data = await response.json();
                if (data.success) {
                    setStatusMessage('Password updated successfully.');
                    setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                } else {
                    setStatusMessage(data.error || 'Password update failed.');
                }
                setIsSaving(false);
            };

            return (
                <ShellComponent title="Change Password" subtitle="Keep your account secure" activeTab="settings" onNavigate={onNavigate}>
                    <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-xl shadow-sm animate-fade-in">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Current Password</label>
                                <input
                                    type="password"
                                    value={form.currentPassword}
                                    onChange={e => setForm({ ...form, currentPassword: e.target.value })}
                                    className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                    placeholder="Enter current password"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">New Password</label>
                                <input
                                    type="password"
                                    value={form.newPassword}
                                    onChange={e => setForm({ ...form, newPassword: e.target.value })}
                                    className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Confirm Password</label>
                                <input
                                    type="password"
                                    value={form.confirmPassword}
                                    onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                                    className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                    placeholder="Re-enter new password"
                                />
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={isSaving}
                                className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? 'Saving...' : 'Update Password'}
                            </button>
                            {statusMessage && <div className="p-3 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium">{statusMessage}</div>}
                        </div>
                    </div>
                    {onBack && <button onClick={onBack} className="mt-6 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition"><i className="fa-solid fa-arrow-left"></i> Back</button>}
                </ShellComponent>
            );
        };

        // 3. Danger Zone Component
        const DangerZonePanel = ({ onBack, onNavigate }) => {
            const [statusMessage, setStatusMessage] = useState(null);
            const [hardResetPassword, setHardResetPassword] = useState('');

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
                 <AdminShell title="System Reset" subtitle="Danger Zone" activeTab="settings" onNavigate={onNavigate}>
                    <div className="animate-fade-in max-w-2xl">
                        <div className="bg-rose-50 border border-rose-100 rounded-xl p-6 shadow-sm">
                            <h3 className="text-rose-700 font-bold mb-4 flex items-center gap-2 text-lg">
                                <i className="fa-solid fa-triangle-exclamation"></i>
                                Danger Zone
                            </h3>
                            <p className="text-sm text-rose-800/80 mb-6 leading-relaxed">
                                You are about to perform a Hard Reset. This will <strong>permanently delete</strong> all database content, including users, classes, subjects, and files. This action is irreversible.
                            </p>
                            
                            <div className="space-y-4 bg-white p-5 rounded-lg border border-rose-100">
                                <div>
                                    <label className="block text-xs font-bold text-rose-500 uppercase tracking-wider mb-2">Admin Password</label>
                                    <input 
                                        type="password" 
                                        value={hardResetPassword} 
                                        onChange={e => setHardResetPassword(e.target.value)} 
                                        className="w-full p-3 text-sm border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" 
                                        placeholder="Enter password to confirm"
                                    />
                                </div>
                                
                                <button 
                                    onClick={handleHardReset} 
                                    className="w-full py-3 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 transition shadow-sm flex items-center justify-center gap-2"
                                >
                                    <i className="fa-solid fa-radiation"></i>
                                    NUKE SITE (Hard Reset)
                                </button>
                            </div>
                            
                            {statusMessage && <p className="text-sm text-rose-700 mt-4 font-medium text-center bg-rose-100 p-2 rounded">{statusMessage}</p>}
                        </div>
                        
                        <button onClick={onBack} className="mt-6 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition">
                            <i className="fa-solid fa-arrow-left"></i> Back
                        </button>
                    </div>
                </AdminShell>
            );
        };

        // 4. Main Admin Settings Controller
        const AdminSettings = ({ onNavigate }) => {
            const [activePanel, setActivePanel] = useState('main'); // 'main', 'profile', 'danger'

            // Render Sub-Panels
            if (activePanel === 'profile') {
                return <ProfileManagement onNavigate={onNavigate} onBack={() => setActivePanel('main')} />;
            }
            if (activePanel === 'danger') {
                return <DangerZonePanel onNavigate={onNavigate} onBack={() => setActivePanel('main')} />;
            }

            // Render Main List View - Compact "Clean Type" Visual
            return (
                <AdminShell title="Settings" subtitle="System preferences" activeTab="settings" onNavigate={onNavigate}>
                    <div className="max-w-xl bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm animate-fade-in">
                        
                        {/* Profile Option - Narrow & Clean */}
                        <button 
                            onClick={() => setActivePanel('profile')} 
                            className="w-full flex items-center gap-3 px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition text-left group"
                        >
                            <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
                                    <i className="fa-solid fa-user-gear text-sm"></i>
                            </div>
                            <div className="flex-1">
                                    <div className="font-medium text-slate-700 text-sm">Profile Settings</div>
                            </div>
                            <i className="fa-solid fa-chevron-right text-xs text-slate-300 group-hover:text-indigo-400"></i>
                        </button>

                        {/* Danger Zone Option - Narrow & Clean */}
                        <button 
                            onClick={() => setActivePanel('danger')} 
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-rose-50/30 transition text-left group"
                        >
                            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
                                    <i className="fa-solid fa-triangle-exclamation text-sm"></i>
                            </div>
                            <div className="flex-1">
                                    <div className="font-medium text-slate-700 text-sm">Danger Zone</div>
                            </div>
                            <i className="fa-solid fa-chevron-right text-xs text-slate-300 group-hover:text-rose-400"></i>
                        </button>

                    </div>
                </AdminShell>
            );
        };

        const TeacherSettings = ({ onNavigate }) => {
            return <ProfileManagement onNavigate={onNavigate} shell="teacher" />;
        };

        const StudentProfilePanel = ({ onNavigate, onBack }) => {
            const { profile, refreshProfile, setProfile } = useProfileData();
            const [statusMessage, setStatusMessage] = useState(null);
            const [nameInput, setNameInput] = useState('');
            const [isSaving, setIsSaving] = useState(false);
            const [avatarFile, setAvatarFile] = useState(null);
            const [avatarPreview, setAvatarPreview] = useState('');
            const [details, setDetails] = useState({
                email: '',
                religion: '',
                classLabel: '',
                groupLabel: '',
                dateOfBirth: '',
                batchYear: ''
            });
            const [isLoadingDetails, setIsLoadingDetails] = useState(true);
            const [detailsMessage, setDetailsMessage] = useState('');

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
                if (data.success) { 
                    setStatusMessage('Picture updated.'); 
                    setAvatarFile(null); 
                    await refreshProfile(); 
                }
                setIsSaving(false);
            };

            const computeAge = (dob) => {
                if (!dob) return '';
                const birthDate = new Date(dob);
                if (Number.isNaN(birthDate.getTime())) return '';
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age -= 1;
                }
                return age >= 0 ? String(age) : '';
            };

            const loadDetails = async () => {
                const token = localStorage.getItem('auth_token');
                if (!token) { setIsLoadingDetails(false); return; }
                try {
                    const res = await fetch('/api/student/profile', { headers: { Authorization: 'Bearer ' + token } });
                    const data = await res.json();
                    if (data.success) {
                        setDetails({
                            email: data.profile?.email || '',
                            religion: data.profile?.religion || '',
                            classLabel: data.profile?.classLabel || '',
                            groupLabel: data.profile?.groupLabel || '',
                            dateOfBirth: data.profile?.dateOfBirth || '',
                            batchYear: data.profile?.batchYear || ''
                        });
                    }
                } catch (e) {} finally { setIsLoadingDetails(false); }
            };

            useEffect(() => { loadDetails(); }, []);

            const handleDetailsSave = async () => {
                setIsSaving(true);
                setDetailsMessage('');
                const token = localStorage.getItem('auth_token');
                if (!token) { setIsSaving(false); return; }
                try {
                    const res = await fetch('/api/student/profile', {
                        method: 'PUT',
                        headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            religion: details.religion,
                            classLabel: details.classLabel,
                            groupLabel: details.classLabel === 'SSC' || details.classLabel === 'HSC' ? details.groupLabel : '',
                            dateOfBirth: details.dateOfBirth,
                            batchYear: details.classLabel === 'SSC' || details.classLabel === 'HSC' ? details.batchYear : ''
                        })
                    });
                    const data = await res.json();
                    if (data.success) {
                        setDetailsMessage(data.pointsAwarded ? 'Profile updated and 10 points added!' : 'Profile updated.');
                        const meRes = await fetch('/api/me', { headers: { Authorization: 'Bearer ' + token } });
                        const meData = await meRes.json();
                        if (meData.user) setUser(meData.user);
                    } else {
                        setDetailsMessage(data.error || 'Update failed.');
                    }
                } catch (e) {
                    setDetailsMessage('Update failed.');
                }
                setIsSaving(false);
            };

            const age = computeAge(details.dateOfBirth);
            const showGroup = details.classLabel === 'SSC' || details.classLabel === 'HSC';

            return (
                <StudentShell title="Profile" subtitle="Update your profile and details" activeTab="settings" onNavigate={onNavigate}>
                    <div className="space-y-6 animate-fade-in">
                        <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-2xl shadow-sm">
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
                                            onClick={() => { if(avatarFile) handleAvatarUpload(); else handleNameSave(); }} 
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

                        <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-2xl shadow-sm space-y-5">
                            {isLoadingDetails ? (
                                <div className="text-center text-sm text-slate-500"><i className="fa-solid fa-circle-notch fa-spin mr-2"></i>Loading profile...</div>
                            ) : (
                                <>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label>
                                            <input value={details.email} disabled className="w-full mt-1 p-3 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-500" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Religion</label>
                                            <select value={details.religion} onChange={e => setDetails({ ...details, religion: e.target.value })} className="w-full mt-1 p-3 border border-slate-200 rounded-lg text-sm bg-white">
                                                <option value="">Select religion</option>
                                                <option value="Islam">Islam</option>
                                                <option value="Hinduism">Hinduism</option>
                                                <option value="Buddhism">Buddhism</option>
                                                <option value="Christianity">Christianity</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Class Level</label>
                                            <select value={details.classLabel} onChange={e => setDetails({ ...details, classLabel: e.target.value, groupLabel: e.target.value === 'SSC' || e.target.value === 'HSC' ? details.groupLabel : '' })} className="w-full mt-1 p-3 border border-slate-200 rounded-lg text-sm bg-white">
                                                <option value="">Select class</option>
                                                <option value="SSC">SSC</option>
                                                <option value="HSC">HSC</option>
                                                <option value="6">Class 6</option>
                                                <option value="7">Class 7</option>
                                                <option value="8">Class 8</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Group</label>
                                            <select value={details.groupLabel} onChange={e => setDetails({ ...details, groupLabel: e.target.value })} disabled={!showGroup} className="w-full mt-1 p-3 border border-slate-200 rounded-lg text-sm bg-white disabled:bg-slate-50 disabled:text-slate-400">
                                                <option value="">Select group</option>
                                                <option value="Science">Science</option>
                                                <option value="Humanities">Humanities</option>
                                                <option value="Business Studies">Business Studies</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Date of Birth</label>
                                            <input type="date" value={details.dateOfBirth} onChange={e => setDetails({ ...details, dateOfBirth: e.target.value })} className="w-full mt-1 p-3 border border-slate-200 rounded-lg text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Age</label>
                                            <input value={age} disabled className="w-full mt-1 p-3 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-500" />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">SSC/HSC Batch Year</label>
                                            <input value={details.batchYear} onChange={e => setDetails({ ...details, batchYear: e.target.value })} disabled={!showGroup} className="w-full mt-1 p-3 border border-slate-200 rounded-lg text-sm disabled:bg-slate-50 disabled:text-slate-400" placeholder="e.g. 2026" />
                                        </div>
                                    </div>

                                    <div className="pt-2 flex flex-col sm:flex-row gap-3">
                                        <button onClick={handleDetailsSave} disabled={isSaving} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm transition disabled:opacity-50">
                                            {isSaving ? 'Saving...' : 'Save Details'}
                                        </button>
                                    </div>

                                    {detailsMessage && <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium">{detailsMessage}</div>}
                                </>
                            )}
                        </div>

                        {onBack && <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition"><i className="fa-solid fa-arrow-left"></i> Back</button>}
                    </div>
                </StudentShell>
            );
        };

        const StudentPointsPanel = ({ onNavigate, onBack }) => {
            const [points, setPoints] = useState(0);
            const [logs, setLogs] = useState([]);
            const [isLoading, setIsLoading] = useState(true);

            const loadPoints = async () => {
                const token = localStorage.getItem('auth_token');
                if (!token) { setIsLoading(false); return; }
                try {
                    const res = await fetch('/api/points', { headers: { Authorization: 'Bearer ' + token } });
                    const data = await res.json();
                    if (data.success) {
                        setPoints(data.points || 0);
                        setLogs(data.logs || []);
                    }
                } catch (e) {} finally { setIsLoading(false); }
            };

            useEffect(() => { loadPoints(); }, []);

            return (
                <StudentShell title="My Points" subtitle="Track your achievements" activeTab="settings" onNavigate={onNavigate}>
                    <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-3xl shadow-sm space-y-6 animate-fade-in">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <div className="text-xs uppercase tracking-wider text-slate-400">Total Points</div>
                                <div className="text-3xl font-semibold text-slate-900">{points}</div>
                            </div>
                            {onBack && <button onClick={onBack} className="px-5 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50">Back</button>}
                        </div>
                        {isLoading ? (
                            <div className="text-center text-sm text-slate-500"><i className="fa-solid fa-circle-notch fa-spin mr-2"></i>Loading points...</div>
                        ) : (
                            <div className="space-y-3">
                                {logs.length === 0 && <div className="text-sm text-slate-500">No points earned yet.</div>}
                                {logs.map((log, index) => (
                                    <div key={log.createdAt + '-' + index} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg">
                                        <div>
                                            <div className="text-sm font-semibold text-slate-800">{log.reason === 'profile_complete' ? 'Profile completed' : log.reason}</div>
                                            <div className="text-xs text-slate-400">{new Date(log.createdAt).toLocaleString()}</div>
                                        </div>
                                        <div className="text-sm font-bold text-emerald-600">+{log.points}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </StudentShell>
            );
        };

        const StudentSettings = ({ onNavigate }) => {
            const [activePanel, setActivePanel] = useState('main');

            if (activePanel === 'profile') {
                return <StudentProfilePanel onNavigate={onNavigate} onBack={() => setActivePanel('main')} />;
            }
            if (activePanel === 'points') {
                return <StudentPointsPanel onNavigate={onNavigate} onBack={() => setActivePanel('main')} />;
            }
            if (activePanel === 'password') {
                return <ChangePasswordPanel onNavigate={onNavigate} onBack={() => setActivePanel('main')} shell="student" />;
            }

            return (
                <StudentShell title="Settings" subtitle="Account preferences" activeTab="settings" onNavigate={onNavigate}>
                    <div className="max-w-xl bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm animate-fade-in">
                        <button
                            onClick={() => setActivePanel('profile')}
                            className="w-full flex items-center gap-3 px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition text-left group"
                        >
                            <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
                                <i className="fa-solid fa-user-gear text-sm"></i>
                            </div>
                            <div className="flex-1">
                                <div className="font-medium text-slate-700 text-sm">Profile</div>
                            </div>
                            <i className="fa-solid fa-chevron-right text-xs text-slate-300 group-hover:text-indigo-400"></i>
                        </button>

                        <button
                            onClick={() => setActivePanel('points')}
                            className="w-full flex items-center gap-3 px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition text-left group"
                        >
                            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
                                <i className="fa-solid fa-coins text-sm"></i>
                            </div>
                            <div className="flex-1">
                                <div className="font-medium text-slate-700 text-sm">My Points</div>
                            </div>
                            <i className="fa-solid fa-chevron-right text-xs text-slate-300 group-hover:text-emerald-400"></i>
                        </button>

                        <button
                            onClick={() => setActivePanel('password')}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition text-left group"
                        >
                            <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
                                <i className="fa-solid fa-key text-sm"></i>
                            </div>
                            <div className="flex-1">
                                <div className="font-medium text-slate-700 text-sm">Change Password</div>
                            </div>
                            <i className="fa-solid fa-chevron-right text-xs text-slate-300 group-hover:text-indigo-400"></i>
                        </button>
                    </div>
                </StudentShell>
            );
        };

        return { AdminSettings, TeacherSettings, StudentSettings };
        })();
        const { AdminSettings, TeacherSettings, StudentSettings } = AdminSettingsModule;
`;
