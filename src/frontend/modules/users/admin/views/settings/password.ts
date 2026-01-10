export const settingsPasswordPanel = `
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
`;
