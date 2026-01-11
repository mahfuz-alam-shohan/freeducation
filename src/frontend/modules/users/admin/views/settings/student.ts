export const settingsStudentPanels = `
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
const data = await response.json();
if (response.ok && data.success) {
messages.push('Name updated.');
setProfile(p => ({...p, name: trimmedName}));
} else {
errors.push(data.error || 'Profile update failed.');
}
}

if (avatarFile) {
const resized = await resizeImageFile(avatarFile, { maxWidth: 480, maxHeight: 480, quality: 0.8 });
const formData = new FormData(); formData.append('file', resized || avatarFile);
const response = await fetch('/api/profile/avatar', { method: 'POST', headers: { Authorization: 'Bearer ' + token }, body: formData });
const data = await response.json();
if (response.ok && data.success) { 
messages.push('Picture updated.');
setAvatarFile(null);
setAvatarPreview('');
await refreshProfile(); 
} else {
errors.push(data.error || 'Avatar upload failed.');
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
const { ok, data, errorMessage } = await parseApiResponse(res, 'Update failed.');
if (ok) {
setDetailsMessage(data.pointsAwarded ? 'Profile updated and 10 points added!' : 'Profile updated.');
} else {
setDetailsMessage(errorMessage);
}
} catch (e) {
setDetailsMessage('Update failed. Please try again.');
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
`;
