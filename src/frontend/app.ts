export const mainApp = `
        function App() {
            const viewToPath = {
                landing: '/',
                login: '/login',
                register: '/register',
                dashboard: '/dashboard',
                'admin-groups-ssc': '/dashboard/ssc',
                'admin-groups-hsc': '/dashboard/hsc',
                'admin-settings': '/dashboard/settings'
            };
            const getViewFromPath = (path) => {
                if (path.startsWith('/login')) return 'login';
                if (path.startsWith('/register')) return 'register';
                if (path.startsWith('/dashboard/settings')) return 'admin-settings';
                if (path.startsWith('/dashboard/ssc')) return 'admin-groups-ssc';
                if (path.startsWith('/dashboard/hsc')) return 'admin-groups-hsc';
                if (path.startsWith('/dashboard')) return 'dashboard';
                return 'landing';
            };
            const initialView = window.__INITIAL_VIEW || getViewFromPath(window.location.pathname);
            const [view, setView] = useState(initialView);
            const [isLoading, setIsLoading] = useState(true);
            const [user, setUser] = useState(null);
            const [hasAdmin, setHasAdmin] = useState(null);

            const syncRoutesFromLocation = () => {
                const { pathname } = window.location;
                setView(getViewFromPath(pathname));
            };

            const navigate = (nextView, options = {}) => {
                const { replace = false } = options;
                setView(nextView);
                const nextPath = viewToPath[nextView] || '/';
                if (window.location.pathname !== nextPath) {
                    const method = replace ? 'replaceState' : 'pushState';
                    window.history[method]({ view: nextView }, '', nextPath);
                }
            };

            useEffect(() => {
                const handlePopState = () => {
                    syncRoutesFromLocation();
                };
                window.addEventListener('popstate', handlePopState);
                return () => window.removeEventListener('popstate', handlePopState);
            }, []);

            // 1. Initial System Check & Session Restore
            useEffect(() => {
                const initSystem = async () => {
                    // A. Check Setup Status
                    await fetch('/api/init', { method: 'POST' });
                    const res = await fetch('/api/setup-status');
                    const data = await res.json();
                    setHasAdmin(data.hasAdmin);

                    // B. Try to Restore Session
                    const token = localStorage.getItem('auth_token');
                    if (token) {
                        try {
                            const meRes = await fetch('/api/me', {
                                headers: { 'Authorization': 'Bearer ' + token }
                            });
                            const meData = await meRes.json();
                            if (meData.user) {
                                setUser(meData.user);
                            } else {
                                // Invalid token
                                localStorage.removeItem('auth_token');
                            }
                        } catch (e) {
                            localStorage.removeItem('auth_token');
                        }
                    }

                    if (data.hasAdmin && view === 'register') {
                        navigate('login', { replace: true });
                    }
                    if (!data.hasAdmin && view === 'login') {
                        navigate('register', { replace: true });
                    }
                    if (!token && (view === 'dashboard' || view.startsWith('admin-groups') || view === 'admin-settings')) {
                        navigate('landing', { replace: true });
                    }
                    setIsLoading(false);
                };
                initSystem();
            }, []);

            const handleLogin = async (username, password) => {
                const res = await fetch('/api/login', {
                    method: 'POST',
                    body: JSON.stringify({ username, password })
                });
                const data = await res.json();
                if (data.success) {
                    // SAVE TOKEN!
                    localStorage.setItem('auth_token', data.token);
                    setUser({ username: data.username });
                    navigate('dashboard');
                } else {
                    alert(data.error);
                }
            };

            const handleLogout = () => {
                localStorage.removeItem('auth_token');
                setUser(null);
                navigate('landing');
            };

            const handleRegister = async (username, password) => {
                const res = await fetch('/api/register-admin', {
                    method: 'POST',
                    body: JSON.stringify({ username, password })
                });
                const data = await res.json();
                if (data.success) {
                    alert("Account created successfully. Please login.");
                    setHasAdmin(true);
                    navigate('login');
                } else {
                    alert(data.error);
                }
            };

            if (isLoading || hasAdmin === null) return <Loading />;

            return (
                <div className="min-h-screen flex flex-col">
                    <NavBar user={user} hasAdmin={hasAdmin} onNavigate={navigate} onLogout={handleLogout} />
                    <main className="flex-grow bg-gray-50 flex flex-col">
                        {view === 'landing' && <StudentLanding />}
                        {view === 'login' && <AuthForm mode="login" onSubmit={handleLogin} />}
                        {view === 'register' && <AuthForm mode="register" onSubmit={handleRegister} />}
                        {view === 'dashboard' && <AdminDashboard onNavigate={navigate} />}
                        {view === 'admin-groups-ssc' && (
                            <AdminGroupSelection classLabel="SSC" onNavigate={navigate} />
                        )}
                        {view === 'admin-groups-hsc' && (
                            <AdminGroupSelection classLabel="HSC" onNavigate={navigate} />
                        )}
                        {view === 'admin-settings' && <AdminSettings onNavigate={navigate} />}
                    </main>
                </div>
            );
        }
`;
