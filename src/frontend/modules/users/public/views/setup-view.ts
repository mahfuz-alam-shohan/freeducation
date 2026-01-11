export const setupComponents = `
const SetupView = ({ onNavigate }) => {
const [adminName, setAdminName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState('');
const [successMessage, setSuccessMessage] = useState('');

useEffect(() => {
const checkStatus = async () => {
try {
const res = await fetch('/api/system/status');
const data = await res.json();
if (data.initialized) {
onNavigate('login', { replace: true });
}
} catch (err) {
setError('Unable to verify system status.');
}
};
checkStatus();
}, []);

const handleSubmit = async (e) => {
e.preventDefault();
if (password !== confirmPassword) {
setError('Passwords do not match.');
return;
}
setIsLoading(true);
setError('');
try {
const res = await fetch('/api/system/init', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ adminName, email, password, confirmPassword })
});
const data = await res.json();
if (!data.success) {
setError(data.error || 'Setup failed.');
return;
}
setSuccessMessage('Setup Complete! Redirecting...');
setTimeout(() => {
window.location.href = '/admin/dashboard';
}, 1200);
} catch (err) {
setError('Setup failed. Please try again.');
} finally {
setIsLoading(false);
}
};

return (
<div className="flex-1 flex items-center justify-center bg-[#f3f6ff] px-4 py-12">
<div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
<div className="text-center mb-8">
<div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mb-4">
<i className="fa-solid fa-screwdriver-wrench"></i>
</div>
<h2 className="text-2xl font-bold text-slate-900">First Run Setup</h2>
<p className="text-sm text-slate-500 mt-2">Create your admin account to get started.</p>
</div>

{error && (
<div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
<i className="fa-solid fa-circle-exclamation text-red-500 mt-0.5"></i>
<div className="text-sm text-red-600">{error}</div>
</div>
)}

{successMessage && (
<div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3">
<i className="fa-solid fa-circle-check text-emerald-500 mt-0.5"></i>
<div className="text-sm text-emerald-600">{successMessage}</div>
</div>
)}

<form onSubmit={handleSubmit} className="space-y-5">
<div>
<label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Admin Name</label>
<input
type="text"
value={adminName}
onChange={(e) => setAdminName(e.target.value)}
className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
placeholder="Enter admin name"
required
/>
</div>

<div>
<label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Admin Email</label>
<input
type="email"
value={email}
onChange={(e) => setEmail(e.target.value)}
className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
placeholder="admin@example.com"
required
/>
</div>

<div>
<label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Admin Password</label>
<input
type="password"
value={password}
onChange={(e) => setPassword(e.target.value)}
className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
placeholder="••••••••"
required
/>
</div>

<div>
<label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Confirm Password</label>
<input
type="password"
value={confirmPassword}
onChange={(e) => setConfirmPassword(e.target.value)}
className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
placeholder="••••••••"
required
/>
</div>

<button
type="submit"
disabled={isLoading}
className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
>
{isLoading ? (
<>
<i className="fa-solid fa-circle-notch fa-spin"></i>
<span>Setting up...</span>
</>
) : (
<span>Complete Setup</span>
)}
</button>
</form>
</div>
</div>
);
};
`;

export const setupView = `
{view === 'setup' && <SetupView onNavigate={navigate} />}
`;
