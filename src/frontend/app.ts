export const mainApp = `
        function App() {
            const [view, setView] = useState('loading'); // Start with loading state
            const [user, setUser] = useState(null);
            const [hasAdmin, setHasAdmin] = useState(null);

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
                                headers: { 'Authorization': \`Bearer \${token}\` }
                            });
                            const meData = await meRes.json();
                            if (meData.user) {
                                setUser(meData.user);
                                setView('admin'); // Restore to admin view
                            } else {
                                // Invalid token
                                localStorage.removeItem('auth_token');
                                setView('landing');
                            }
                        } catch (e) {
                            localStorage.removeItem('auth_token');
                            setView('landing');
                        }
                    } else {
                        setView('landing');
                    }
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
                    setView('admin');
                } else {
                    alert(data.error);
                }
            };

            const handleLogout = () => {
                localStorage.removeItem('auth_token');
                setUser(null);
                setView('landing');
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
                    setView('login');
                } else {
                    alert(data.error);
                }
            };

            if (view === 'loading' || hasAdmin === null) return <Loading />;

            return (
                <div className="min-h-screen flex flex-col">
                    <NavBar user={user} hasAdmin={hasAdmin} onNavigate={setView} activeView={view} />
                    <main className="flex-grow bg-gray-50 flex flex-col">
                        {view === 'landing' && <StudentLandingPage />}
                        {view === 'login' && <AuthForm mode="login" onSubmit={handleLogin} />}
                        {view === 'register' && <AuthForm mode="register" onSubmit={handleRegister} />}
                        {view === 'admin' && user && (
                            <AdminDashboard user={user} logout={handleLogout} />
                        )}
                    </main>
                </div>
            );
        }
`;


