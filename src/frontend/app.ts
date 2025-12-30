export const mainApp = `
        function App() {
            const viewToPath = {
                landing: '/',
                login: '/login',
                register: '/register',
                admin: '/admin'
            };
            const getViewFromPath = (path) => {
                if (path.startsWith('/admin')) return 'admin';
                if (path.startsWith('/login')) return 'login';
                if (path.startsWith('/register')) return 'register';
                return 'landing';
            };
            const parseStudentRoute = (path) => {
                const segments = path.split('/').filter(Boolean);
                if (segments[0] !== 'classes') return { level: 'landing' };
                const classId = segments[1];
                if (!classId) return { level: 'landing' };
                if (segments[2] === 'subjects' && segments[3]) {
                    const subjectId = segments[3];
                    if (segments[4] === 'chapters' && segments[5]) {
                        const chapterId = segments[5];
                        if (segments[6] === 'topics' && segments[7]) {
                            return { level: 'topic', classId, subjectId, chapterId, topicId: segments[7] };
                        }
                        return { level: 'chapter', classId, subjectId, chapterId };
                    }
                    return { level: 'subject', classId, subjectId };
                }
                return { level: 'class', classId };
            };
            const parseAdminRoute = (path) => {
                if (!path.startsWith('/admin')) return { section: 'structure' };
                const segments = path.split('/').filter(Boolean);
                const section = segments[1] || 'structure';
                const route = { section };
                if (section === 'settings') return route;
                if (section === 'structure') {
                    if (segments[2] === 'classes' && segments[3]) route.classId = segments[3];
                    if (segments[4] === 'subjects' && segments[5]) route.subjectId = segments[5];
                    if (segments[6] === 'chapters' && segments[7]) route.chapterId = segments[7];
                    return route;
                }
                if (section === 'content') {
                    if (segments[2] === 'classes' && segments[3]) route.classId = segments[3];
                    if (segments[4] === 'subjects' && segments[5]) route.subjectId = segments[5];
                    if (segments[6] === 'questions') route.questionScope = 'subject';
                    if (segments[6] === 'chapters' && segments[7]) route.chapterId = segments[7];
                    if (segments[8] === 'questions') route.questionScope = 'chapter';
                    if (segments[8] === 'topics' && segments[9]) route.topicId = segments[9];
                    return route;
                }
                return route;
            };
            const buildStudentPath = (route) => {
                if (!route || route.level === 'landing') return '/';
                if (route.level === 'class') return \`/classes/\${route.classId}\`;
                if (route.level === 'subject') return \`/classes/\${route.classId}/subjects/\${route.subjectId}\`;
                if (route.level === 'chapter') return \`/classes/\${route.classId}/subjects/\${route.subjectId}/chapters/\${route.chapterId}\`;
                if (route.level === 'topic') return \`/classes/\${route.classId}/subjects/\${route.subjectId}/chapters/\${route.chapterId}/topics/\${route.topicId}\`;
                return '/';
            };
            const buildAdminPath = (route) => {
                if (!route || !route.section) return '/admin';
                if (route.section === 'settings') return '/admin/settings';
                if (route.section === 'structure') {
                    let path = '/admin/structure';
                    if (route.classId) path += \`/classes/\${route.classId}\`;
                    if (route.subjectId) path += \`/subjects/\${route.subjectId}\`;
                    if (route.chapterId) path += \`/chapters/\${route.chapterId}\`;
                    return path;
                }
                if (route.section === 'content') {
                    let path = '/admin/content';
                    if (route.classId) path += \`/classes/\${route.classId}\`;
                    if (route.subjectId) path += \`/subjects/\${route.subjectId}\`;
                    if (route.questionScope === 'subject') return \`\${path}/questions\`;
                    if (route.chapterId) path += \`/chapters/\${route.chapterId}\`;
                    if (route.questionScope === 'chapter') return \`\${path}/questions\`;
                    if (route.topicId) path += \`/topics/\${route.topicId}\`;
                    return path;
                }
                return '/admin';
            };
            const initialView = window.__INITIAL_VIEW || getViewFromPath(window.location.pathname);
            const [view, setView] = useState(initialView);
            const [studentRoute, setStudentRoute] = useState(parseStudentRoute(window.location.pathname));
            const [adminRoute, setAdminRoute] = useState(parseAdminRoute(window.location.pathname));
            const [isLoading, setIsLoading] = useState(true);
            const [user, setUser] = useState(null);
            const [hasAdmin, setHasAdmin] = useState(null);

            const syncRoutesFromLocation = () => {
                const { pathname } = window.location;
                setView(getViewFromPath(pathname));
                setStudentRoute(parseStudentRoute(pathname));
                setAdminRoute(parseAdminRoute(pathname));
            };

            const navigate = (nextView, options = {}) => {
                const { replace = false } = options;
                setView(nextView);
                const nextPath = viewToPath[nextView] || '/';
                if (window.location.pathname !== nextPath) {
                    const method = replace ? 'replaceState' : 'pushState';
                    window.history[method]({ view: nextView }, '', nextPath);
                }
                if (nextView === 'landing') setStudentRoute({ level: 'landing' });
                if (nextView === 'admin') setAdminRoute({ section: 'structure' });
            };

            const navigateStudent = (route, options = {}) => {
                const nextPath = buildStudentPath(route);
                const method = options.replace ? 'replaceState' : 'pushState';
                if (window.location.pathname !== nextPath) {
                    window.history[method]({ view: 'landing' }, '', nextPath);
                }
                setView('landing');
                setStudentRoute(route);
            };

            const navigateAdmin = (route, options = {}) => {
                const nextPath = buildAdminPath(route);
                const method = options.replace ? 'replaceState' : 'pushState';
                if (window.location.pathname !== nextPath) {
                    window.history[method]({ view: 'admin' }, '', nextPath);
                }
                setView('admin');
                setAdminRoute(route);
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
                        {view === 'landing' && <StudentLandingPage route={studentRoute} onNavigate={navigateStudent} />}
                        {view === 'login' && <AuthForm mode="login" onSubmit={handleLogin} />}
                        {view === 'register' && <AuthForm mode="register" onSubmit={handleRegister} />}
                        {view === 'admin' && user && (
                            <AdminDashboard user={user} logout={handleLogout} route={adminRoute} onNavigate={navigateAdmin} />
                        )}
                    </main>
                </div>
            );
        }
`;
