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

            return (
                <div className="min-h-[80vh] px-4 md:px-6 py-8 md:py-10 animate-fade-in font-sans">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-6 items-center">
                        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white rounded-3xl p-7 lg:p-9 shadow-2xl">
                            <LogoMark className="mb-6" textClassName="text-white" subtitle="Account access starts here." />
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">Access your account securely.</h2>
                            <p className="text-blue-100 text-sm md:text-base mb-6">
                                Create your account or sign in to continue.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                <div className="bg-white/10 rounded-2xl p-3">
                                    <div className="font-semibold mb-1">Quick Access</div>
                                    <p className="text-blue-100">Sign in with your credentials anytime.</p>
                                </div>
                                <div className="bg-white/10 rounded-2xl p-3">
                                    <div className="font-semibold mb-1">Secure</div>
                                    <p className="text-blue-100">Your login stays protected.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-7 lg:p-9 rounded-3xl shadow-xl border border-gray-200">
                            <div className="mb-8">
                                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-sm mb-4 text-white text-xl">
                                    <i className={mode === 'login' ? 'fas fa-shield-alt' : 'fas fa-user-plus'}></i>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {mode === 'login' ? 'User Login' : 'User Signup'}
                                </h2>
                                <p className="text-gray-500 text-sm mt-2">
                                    {mode === 'login' ? 'Enter your credentials to continue.' : 'Create your account.'}
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
                                            className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-base"
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
                                            className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-base"
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
                                    {loading ? <i className="fas fa-spinner fa-spin"></i> : (mode === 'login' ? 'Login' : 'Create Account')}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            );
        }
`;
