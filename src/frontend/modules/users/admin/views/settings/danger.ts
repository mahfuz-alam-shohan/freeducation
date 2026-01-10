export const settingsDangerPanel = `
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
`;
