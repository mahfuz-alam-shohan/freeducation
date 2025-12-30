export const mainApp = `
        function App() {
            const initialRoute = parseRoute(window.location.pathname);
            const initialView = window.__INITIAL_VIEW || initialRoute.view;
            const [view, setView] = useState(initialView);
            const [isLoading, setIsLoading] = useState(true);
            const [user, setUser] = useState(null);
            const [hasAdmin, setHasAdmin] = useState(null);
            const [routeState, setRouteState] = useState(initialRoute);

            const navigate = (nextView, options = {}) => {
                const { replace = false } = options;
                setView(nextView);
                let nextPath = '/';
                if (nextView === 'admin') {
                    nextPath = buildAdminPath(routeState.admin);
                } else if (nextView === 'landing') {
                    nextPath = buildStudentPath(routeState.student);
                } else if (nextView === 'login') {
                    nextPath = '/login';
                } else if (nextView === 'register') {
                    nextPath = '/register';
                }
                if (window.location.pathname !== nextPath) {
                    const method = replace ? 'replaceState' : 'pushState';
                    window.history[method]({ view: nextView }, '', nextPath);
                }
            };

            useEffect(() => {
                const handlePopState = () => {
                    const nextRoute = parseRoute(window.location.pathname);
                    setRouteState(nextRoute);
                    setView(nextRoute.view);
                };
                window.addEventListener('popstate', handlePopState);
                return () => window.removeEventListener('popstate', handlePopState);
            }, []);

            useEffect(() => {
                const nextRoute = parseRoute(window.location.pathname);
                setRouteState(nextRoute);
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
                                if (view === 'admin') {
                                    navigate(data.hasAdmin ? 'login' : 'register', { replace: true });
                                }
                            }
                        } catch (e) {
                            localStorage.removeItem('auth_token');
                            if (view === 'admin') {
                                navigate(data.hasAdmin ? 'login' : 'register', { replace: true });
                            }
                        }
                    } else if (view === 'admin') {
                        navigate(data.hasAdmin ? 'login' : 'register', { replace: true });
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
                    navigate('admin');
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
                    alert("Admin created successfully. Please login.");
                    setHasAdmin(true);
                    navigate('login');
                } else {
                    alert(data.error);
                }
            };

            if (isLoading || hasAdmin === null) return <Loading />;

            return (
                <div className="min-h-screen flex flex-col">
                    <NavBar user={user} hasAdmin={hasAdmin} onNavigate={navigate} activeView={view} />
                    <main className="flex-grow bg-gray-50 flex flex-col">
                        {view === 'landing' && <StudentLandingPage routeState={routeState} setRouteState={setRouteState} />}
                        {view === 'login' && <AuthForm mode="login" onSubmit={handleLogin} />}
                        {view === 'register' && <AuthForm mode="register" onSubmit={handleRegister} />}
                        {view === 'admin' && user && (
                            <AdminDashboard user={user} logout={handleLogout} routeState={routeState} setRouteState={setRouteState} />
                        )}
                    </main>
                </div>
            );
        }
`;
