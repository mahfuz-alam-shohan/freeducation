export const authComponents = `
        function AuthForm({ mode, onSubmit }) {
            const [username, setUsername] = useState('');
            const [password, setPassword] = useState('');
            const [loading, setLoading] = useState(false);

            const handleSubmit = async (e) => {
                e.preventDefault();
                setLoading(true);
                await onSubmit(username, password);
                setLoading(false);
            };

            const handleEmergencyReset = async () => {
                if (confirm("EMERGENCY RESET: This will wipe ALL database data (Admins, Classes, Questions). Use this if you cannot login due to system updates. Are you sure?")) {
                    try {
                        const res = await fetch('/api/reset-db', { method: 'POST' });
                        const data = await res.json();
                        if (data.success) {
                            alert("System reset complete. Please reload the page to register a new admin.");
                            window.location.reload();
                        } else {
                            alert("Reset failed: " + data.error);
                        }
                    } catch (e) {
                        alert("Reset failed: " + e.message);
                    }
                }
            };

            return (
                <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 animate-fade-in">
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-50 w-full max-w-md">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4 text-white text-2xl font-bold">
                                <i className={mode === 'login' ? 'fas fa-shield-alt' : 'fas fa-user-plus'}></i>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {mode === 'login' ? 'Admin Access' : 'System Setup'}
                            </h2>
                            <p className="text-gray-500 text-sm mt-2">
                                {mode === 'login' ? 'Enter your credentials to manage content.' : 'Create the master administrator account.'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Username</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3.5 text-gray-400"><i className="fas fa-user"></i></span>
                                    <input 
                                        type="text" 
                                        required 
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium"
                                        placeholder="Enter username"
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Password</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3.5 text-gray-400"><i className="fas fa-lock"></i></span>
                                    <input 
                                        type="password" 
                                        required 
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? <i className="fas fa-spinner fa-spin"></i> : (mode === 'login' ? 'Login Dashboard' : 'Create Admin')}
                            </button>
                        </form>

                        {/* Emergency Reset Button - Only shown on Login screen */}
                        {mode === 'login' && (
                            <div className="mt-6 text-center pt-6 border-t border-gray-100">
                                <button 
                                    onClick={handleEmergencyReset}
                                    className="text-xs text-red-400 hover:text-red-600 font-medium flex items-center justify-center mx-auto transition-colors"
                                >
                                    <i className="fas fa-exclamation-triangle mr-1.5"></i> Emergency System Reset
                                </button>
                                <p className="text-[10px] text-gray-300 mt-1 max-w-xs mx-auto">
                                    Use this if you are locked out due to system updates.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            );
        }
`;
