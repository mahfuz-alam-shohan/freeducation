export const mainApp = `
        function App() {
            const [view, setView] = useState(window.__INITIAL_VIEW || 'landing'); // 'landing', 'login', 'register', 'admin'
            const [user, setUser] = useState(null);
            const [hasAdmin, setHasAdmin] = useState(null);

            useEffect(() => {
                const initSystem = async () => {
                    await fetch('/api/init', { method: 'POST' });
                    const res = await fetch('/api/setup-status');
                    const data = await res.json();
                    setHasAdmin(data.hasAdmin);
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
                    setUser({ username: data.username });
                    setView('admin');
                } else {
                    alert(data.error);
                }
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

            if (hasAdmin === null) return <Loading />;

            return (
                <div className="min-h-screen flex flex-col">
                    <NavBar user={user} hasAdmin={hasAdmin} onNavigate={setView} activeView={view} />
                    <main className="flex-grow bg-gray-50 flex flex-col">
                        {view === 'landing' && <StudentLandingPage />}
                        {view === 'login' && <AuthForm mode="login" onSubmit={handleLogin} />}
                        {view === 'register' && <AuthForm mode="register" onSubmit={handleRegister} />}
                        {view === 'admin' && user && (
                            <AdminDashboard user={user} logout={() => { setUser(null); setView('landing'); }} />
                        )}
                    </main>
                </div>
            );
        }
`;
