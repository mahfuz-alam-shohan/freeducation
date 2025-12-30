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
                <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 animate-fade-in font-sans">
                    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 w-full max-w-sm">
                        <div className="text-center mb-8">
                            <div className="w-12 h-12 bg-blue-600 rounded-lg mx-auto flex items-center justify-center shadow-sm mb-4 text-white text-xl font-bold">
                                <i className={mode === 'login' ? 'fas fa-shield-alt' : 'fas fa-user-plus'}></i>
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">
                                {mode === 'login' ? 'Admin Access' : 'System Setup'}
                            </h2>
                            <p className="text-gray-500 text-xs mt-2">
                                {mode === 'login' ? 'Enter your credentials to manage content.' : 'Create the master administrator account.'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Username</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-400 text-sm"><i className="fas fa-user"></i></span>
                                    <input 
                                        type="text" 
                                        required 
                                        className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm"
                                        placeholder="Enter username"
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Password</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-400 text-sm"><i className="fas fa-lock"></i></span>
                                    <input 
                                        type="password" 
                                        required 
                                        className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded shadow-sm transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed text-sm mt-2"
                            >
                                {loading ? <i className="fas fa-spinner fa-spin"></i> : (mode === 'login' ? 'Login' : 'Create Admin')}
                            </button>
                        </form>

                        {/* Emergency Reset Button - Only shown on Login screen */}
                        {mode === 'login' && (
                            <div className="mt-6 text-center pt-4 border-t border-gray-100">
                                <button 
                                    onClick={handleEmergencyReset}
                                    className="text-[10px] text-red-400 hover:text-red-600 font-bold flex items-center justify-center mx-auto transition-colors uppercase tracking-wider"
                                >
                                    <i className="fas fa-exclamation-triangle mr-1.5"></i> Emergency Reset
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            );
        }
`;


