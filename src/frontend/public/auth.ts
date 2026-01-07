export const authComponents = `
        const AuthForm = ({ mode, onSubmit, onNavigate }) => {
            const [username, setUsername] = useState('');
            const [password, setPassword] = useState('');
            const [isLoading, setIsLoading] = useState(false);
            const [error, setError] = useState('');

            const handleSubmit = async (e) => {
                e.preventDefault();
                setIsLoading(true);
                setError('');
                try {
                    await onSubmit({ username, password });
                } catch (err) {
                    setError('Authentication failed. Please check your credentials.');
                } finally {
                    setIsLoading(false);
                }
            };

            return (
                <div className="flex-1 flex items-center justify-center bg-[#f3f6ff] px-4 py-12">
                    <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mb-4">
                                <i className={mode === 'login' ? "fa-solid fa-lock" : "fa-solid fa-user-plus"}></i>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
                            <p className="text-sm text-slate-500 mt-2">
                                {mode === 'login' ? 'Please sign in to continue.' : 'Join us to start learning.'}
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                                <i className="fa-solid fa-circle-exclamation text-red-500 mt-0.5"></i>
                                <div className="text-sm text-red-600">{error}</div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                                    {mode === 'login' ? 'Email or Username' : 'Username'}
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    placeholder={mode === 'login' ? "Enter your email" : "Choose a username"}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                                )}
                            </button>
                        </form>

                        {mode === 'login' && (
                            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                                <p className="text-sm text-slate-500">
                                    Don't have an account?{' '}
                                    <button 
                                        onClick={() => onNavigate('student-register')} 
                                        className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
                                    >
                                        Create Free Student Account
                                    </button>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            );
        };
`;
