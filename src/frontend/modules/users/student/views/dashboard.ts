export const studentDashboardComponents = `
const StudentClassView = ({ user, onNavigate }) => {
const [profile, setProfile] = useState(null);
const [showPrompt, setShowPrompt] = useState(false);
const [isLoadingProfile, setIsLoadingProfile] = useState(true);

const classLabel = profile?.classLabel || user?.classLabel || user?.class_label || '';
const groupLabel = profile?.groupLabel || user?.groupLabel || user?.group_label || '';
const isAcademicClass = classLabel === 'SSC' || classLabel === 'HSC';
const hasClass = Boolean(classLabel);
const classSubjects = classLabel === 'HSC' ? hscSubjects : sscSubjects;
const subjectPool = Array.isArray(classSubjects) ? classSubjects : [];
const normalizedGroup = groupLabel || 'Common';
const filteredSubjects = subjectPool.filter((subject) => {
if (!groupLabel) return subject.groupLabel === 'Common';
const groups = subject.groups || [];
return groups.includes(groupLabel) || subject.groupLabel === 'Common';
});
const classRoute = classLabel === 'HSC' ? 'hsc-subjects' : 'ssc-subjects';

useEffect(() => {
const loadProfile = async () => {
const token = localStorage.getItem('auth_token');
if (!token) { setIsLoadingProfile(false); return; }
try {
const res = await fetch('/api/student/profile', { headers: { Authorization: 'Bearer ' + token } });
const data = await res.json();
if (data.success) {
setProfile(data.profile);
const needsClass = !data.profile?.classLabel;
const needsGroup = (data.profile?.classLabel === 'SSC' || data.profile?.classLabel === 'HSC') && !data.profile?.groupLabel;
const needsBatch = (data.profile?.classLabel === 'SSC' || data.profile?.classLabel === 'HSC') && !data.profile?.batchYear;
const needsReligion = !data.profile?.religion;
const needsDob = !data.profile?.dateOfBirth;
if (needsClass || needsGroup || needsBatch || needsReligion || needsDob) {
setShowPrompt(true);
}
}
} catch (e) {} finally { setIsLoadingProfile(false); }
};
loadProfile();
}, []);

return (
<StudentShell
title="My Class"
subtitle={hasClass ? classLabel + (groupLabel ? ' • ' + groupLabel : '') + ' learning space' : 'Complete your profile to see content'}
activeTab="class"
onNavigate={onNavigate}
>
<div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
<div className="flex flex-wrap items-center justify-between gap-4">
<div>
<div className="text-xs uppercase tracking-[0.25em] text-slate-400">Your Class</div>
<div className="mt-2 text-2xl font-semibold text-slate-900">
{hasClass ? classLabel : 'Profile incomplete'}
</div>
{hasClass && (
<div className="mt-1 text-sm text-slate-500">
{groupLabel ? groupLabel + ' group' : 'General group'}
</div>
)}
</div>
{hasClass && isAcademicClass && (
<button
onClick={() => onNavigate(classRoute)}
className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-[0.2em] border border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600 transition"
>
View full library
</button>
)}
</div>
{!hasClass && (
<div className="text-sm text-slate-500">
Add your class, group, and other details to unlock your learning dashboard.
</div>
)}
{hasClass && !isAcademicClass && (
<div className="text-sm text-slate-500">
Content for this class level is on the way. Keep your profile updated for new releases.
</div>
)}
</div>

{hasClass && isAcademicClass && (
<div className="space-y-3">
<div className="text-xs uppercase tracking-[0.3em] text-slate-400">Subjects</div>
<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
{filteredSubjects.map((subject) => (
<button
key={subject.subjectKey}
onClick={() => subject.route && onNavigate(subject.route)}
className="group w-full text-left bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
>
<div className="flex items-start gap-4">
<div className={'w-10 h-10 rounded-xl text-white flex items-center justify-center shadow-sm ' + subject.accent}>
<i className={'fa-solid ' + subject.icon}></i>
</div>
<div className="flex-1">
<div className="text-sm font-semibold text-slate-900">{subject.title}</div>
{subject.subtitle && <div className="text-xs text-slate-500 mt-1">{subject.subtitle}</div>}
<div className="text-xs text-slate-400 mt-2">
{subject.groupLabel === 'Common' ? 'Common subject' : normalizedGroup + ' group'}
</div>
</div>
</div>
<div className="mt-4 text-xs font-semibold text-indigo-600">Open subject</div>
</button>
))}
{filteredSubjects.length === 0 && (
<div className="col-span-full bg-white border border-dashed border-slate-200 rounded-2xl p-6 text-center text-sm text-slate-500">
Select your group in settings to see your subjects.
</div>
)}
</div>
</div>
)}

{showPrompt && !isLoadingProfile && (
<div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
<div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
<i className="fa-solid fa-star"></i>
</div>
<div>
<div className="text-lg font-semibold text-slate-900">Complete your profile</div>
<div className="text-sm text-slate-500">Finish your details and earn 10 points.</div>
</div>
</div>
<div className="mt-5 flex flex-col sm:flex-row gap-3">
<button onClick={() => { setShowPrompt(false); onNavigate('student-settings'); }} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold">
Update now
</button>
<button onClick={() => setShowPrompt(false)} className="flex-1 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50">
Remind me later
</button>
</div>
</div>
</div>
)}
</StudentShell>
);
};
`;
