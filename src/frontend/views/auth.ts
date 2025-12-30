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
                <div className="min-h-[80vh] px-4 py-10 animate-fade-in font-sans">
                    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 items-center">
                        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white rounded-3xl p-8 lg:p-10 shadow-2xl">
                            <LogoMark className="mb-6" textClassName="text-white" subtitle="Admin clarity starts here." />
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">Run your learning system with confidence.</h2>
                            <p className="text-blue-100 text-sm md:text-base mb-6">
                                Manage classes, chapters, and question banks in one organized workspace. Create a smooth experience for learners and admins alike.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div className="bg-white/10 rounded-2xl p-4">
                                    <div className="font-semibold mb-1">Structured Content</div>
                                    <p className="text-blue-100">Keep subjects, topics, and questions grouped for fast access.</p>
                                </div>
                                <div className="bg-white/10 rounded-2xl p-4">
                                    <div className="font-semibold mb-1">Admin Friendly</div>
                                    <p className="text-blue-100">Clean layouts help you focus on what matters.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 lg:p-10 rounded-3xl shadow-xl border border-gray-200">
                            <div className="mb-8">
                                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-sm mb-4 text-white text-xl">
                                    <i className={mode === 'login' ? 'fas fa-shield-alt' : 'fas fa-user-plus'}></i>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {mode === 'login' ? 'Admin Access' : 'System Setup'}
                                </h2>
                                <p className="text-gray-500 text-sm mt-2">
                                    {mode === 'login' ? 'Enter your credentials to manage content.' : 'Create the master administrator account.'}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Username</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3 text-gray-400 text-sm"><i className="fas fa-user"></i></span>
                                        <input 
                                            type="text" 
                                            required 
                                            className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                                            placeholder="Enter username"
                                            value={username}
                                            onChange={e => setUsername(e.target.value)}
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Password</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3 text-gray-400 text-sm"><i className="fas fa-lock"></i></span>
                                        <input 
                                            type="password" 
                                            required 
                                            className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-sm transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed text-sm mt-2"
                                >
                                    {loading ? <i className="fas fa-spinner fa-spin"></i> : (mode === 'login' ? 'Login' : 'Create Admin')}
                                </button>
                            </form>

                            {/* Emergency Reset Button - Only shown on Login screen */}
                            {mode === 'login' && (
                                <div className="mt-6 text-center pt-4 border-t border-gray-100">
                                    <button 
                                        onClick={handleEmergencyReset}
                                        className="text-[11px] text-red-400 hover:text-red-600 font-bold flex items-center justify-center mx-auto transition-colors uppercase tracking-wider"
                                    >
                                        <i className="fas fa-exclamation-triangle mr-1.5"></i> Emergency Reset
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }
`;

