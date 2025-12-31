export const mainApp = `
        function App() {
            const viewToPath = {
                landing: '/',
                login: '/login',
                register: '/register',
                dashboard: '/dashboard',
                'admin-groups-ssc': '/dashboard/ssc',
                'admin-groups-hsc': '/dashboard/hsc',
                'admin-ssc-science': '/dashboard/ssc/science',
                'admin-ssc-humanities': '/dashboard/ssc/humanities',
                'admin-ssc-business-studies': '/dashboard/ssc/business-studies',
                'admin-hsc-science': '/dashboard/hsc/science',
                'admin-hsc-humanities': '/dashboard/hsc/humanities',
                'admin-hsc-business-studies': '/dashboard/hsc/business-studies',
                'admin-settings': '/dashboard/settings',
                'bangla-ssc-1st-paper': '/dashboard/ssc/bangla-1st-paper',
                'bangla-hsc-1st-paper': '/dashboard/hsc/bangla-1st-paper',
                'bangla-ssc-shahitto': '/dashboard/ssc/bangla-1st-paper/shahitto',
                'bangla-hsc-shahitto': '/dashboard/hsc/bangla-1st-paper/shahitto',
                'bangla-ssc-shohopath': '/dashboard/ssc/bangla-1st-paper/shohopath',
                'bangla-hsc-shohopath': '/dashboard/hsc/bangla-1st-paper/shohopath',
                'bangla-ssc-goddo': '/dashboard/ssc/bangla-1st-paper/goddo',
                'bangla-ssc-poddo': '/dashboard/ssc/bangla-1st-paper/poddo',
                'bangla-hsc-goddo': '/dashboard/hsc/bangla-1st-paper/goddo',
                'bangla-hsc-poddo': '/dashboard/hsc/bangla-1st-paper/poddo',
                'bangla-ssc-item': '/dashboard/ssc/bangla-1st-paper/item',
                'bangla-hsc-item': '/dashboard/hsc/bangla-1st-paper/item'
            };
            const getViewFromPath = (path) => {
                if (path.startsWith('/login')) return 'login';
                if (path.startsWith('/register')) return 'register';
                if (path.startsWith('/dashboard/settings')) return 'admin-settings';
                if (path.startsWith('/dashboard/ssc/bangla-1st-paper/item')) return 'bangla-ssc-item';
                if (path.startsWith('/dashboard/hsc/bangla-1st-paper/item')) return 'bangla-hsc-item';
                if (path.startsWith('/dashboard/ssc/bangla-1st-paper/goddo')) return 'bangla-ssc-goddo';
                if (path.startsWith('/dashboard/ssc/bangla-1st-paper/poddo')) return 'bangla-ssc-poddo';
                if (path.startsWith('/dashboard/hsc/bangla-1st-paper/goddo')) return 'bangla-hsc-goddo';
                if (path.startsWith('/dashboard/hsc/bangla-1st-paper/poddo')) return 'bangla-hsc-poddo';
                if (path.startsWith('/dashboard/ssc/bangla-1st-paper/shohopath')) return 'bangla-ssc-shohopath';
                if (path.startsWith('/dashboard/hsc/bangla-1st-paper/shohopath')) return 'bangla-hsc-shohopath';
                if (path.startsWith('/dashboard/ssc/bangla-1st-paper/shahitto')) return 'bangla-ssc-shahitto';
                if (path.startsWith('/dashboard/hsc/bangla-1st-paper/shahitto')) return 'bangla-hsc-shahitto';
                if (path.startsWith('/dashboard/ssc/bangla-1st-paper')) return 'bangla-ssc-1st-paper';
                if (path.startsWith('/dashboard/hsc/bangla-1st-paper')) return 'bangla-hsc-1st-paper';
                if (path.startsWith('/dashboard/ssc/science')) return 'admin-ssc-science';
                if (path.startsWith('/dashboard/ssc/humanities')) return 'admin-ssc-humanities';
                if (path.startsWith('/dashboard/ssc/business-studies')) return 'admin-ssc-business-studies';
                if (path.startsWith('/dashboard/hsc/science')) return 'admin-hsc-science';
                if (path.startsWith('/dashboard/hsc/humanities')) return 'admin-hsc-humanities';
                if (path.startsWith('/dashboard/hsc/business-studies')) return 'admin-hsc-business-studies';
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
            const [selectedBanglaItem, setSelectedBanglaItem] = useState('');
            const [selectedBanglaCategory, setSelectedBanglaCategory] = useState('');
            const [goddoItems, setGoddoItems] = useState(['অপরিচিতা', 'পহেলা বৈশাখ']);
            const [poddoItems, setPoddoItems] = useState(['বিদ্রোহী', 'সোনার তরী']);
            const [natokName, setNatokName] = useState('');
            const [upannyasName, setUpannyasName] = useState('');

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
                        {view === 'admin-ssc-science' && (
                            <AdminGroupDetail classLabel="SSC" groupLabel="Science" onNavigate={navigate} />
                        )}
                        {view === 'admin-ssc-humanities' && (
                            <AdminGroupDetail classLabel="SSC" groupLabel="Humanities" onNavigate={navigate} />
                        )}
                        {view === 'admin-ssc-business-studies' && (
                            <AdminGroupDetail classLabel="SSC" groupLabel="Business Studies" onNavigate={navigate} />
                        )}
                        {view === 'admin-hsc-science' && (
                            <AdminGroupDetail classLabel="HSC" groupLabel="Science" onNavigate={navigate} />
                        )}
                        {view === 'admin-hsc-humanities' && (
                            <AdminGroupDetail classLabel="HSC" groupLabel="Humanities" onNavigate={navigate} />
                        )}
                        {view === 'admin-hsc-business-studies' && (
                            <AdminGroupDetail classLabel="HSC" groupLabel="Business Studies" onNavigate={navigate} />
                        )}
                        {view === 'bangla-ssc-1st-paper' && (
                            <BanglaFirstPaperTopics classLabel="SSC" onNavigate={navigate} />
                        )}
                        {view === 'bangla-hsc-1st-paper' && (
                            <BanglaFirstPaperTopics classLabel="HSC" onNavigate={navigate} />
                        )}
                        {view === 'bangla-ssc-shahitto' && (
                            <BanglaShahitto classLabel="SSC" onNavigate={navigate} />
                        )}
                        {view === 'bangla-hsc-shahitto' && (
                            <BanglaShahitto classLabel="HSC" onNavigate={navigate} />
                        )}
                        {view === 'bangla-ssc-shohopath' && (
                            <BanglaShohopath
                                classLabel="SSC"
                                natokName={natokName}
                                upannyasName={upannyasName}
                                onUpdateNatok={setNatokName}
                                onUpdateUpannyas={setUpannyasName}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'bangla-hsc-shohopath' && (
                            <BanglaShohopath
                                classLabel="HSC"
                                natokName={natokName}
                                upannyasName={upannyasName}
                                onUpdateNatok={setNatokName}
                                onUpdateUpannyas={setUpannyasName}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'bangla-ssc-goddo' && (
                            <BanglaTextList
                                classLabel="SSC"
                                typeLabel="গদ্য"
                                items={goddoItems}
                                onAddItem={setGoddoItems}
                                onSelectItem={(item) => {
                                    setSelectedBanglaItem(item);
                                    setSelectedBanglaCategory('গদ্য');
                                    navigate('bangla-ssc-item');
                                }}
                                onNavigate={navigate}
                                showAdd
                            />
                        )}
                        {view === 'bangla-ssc-poddo' && (
                            <BanglaTextList
                                classLabel="SSC"
                                typeLabel="পদ্য"
                                items={poddoItems}
                                onAddItem={setPoddoItems}
                                onSelectItem={(item) => {
                                    setSelectedBanglaItem(item);
                                    setSelectedBanglaCategory('পদ্য');
                                    navigate('bangla-ssc-item');
                                }}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'bangla-hsc-goddo' && (
                            <BanglaTextList
                                classLabel="HSC"
                                typeLabel="গদ্য"
                                items={goddoItems}
                                onAddItem={setGoddoItems}
                                onSelectItem={(item) => {
                                    setSelectedBanglaItem(item);
                                    setSelectedBanglaCategory('গদ্য');
                                    navigate('bangla-hsc-item');
                                }}
                                onNavigate={navigate}
                                showAdd
                            />
                        )}
                        {view === 'bangla-hsc-poddo' && (
                            <BanglaTextList
                                classLabel="HSC"
                                typeLabel="পদ্য"
                                items={poddoItems}
                                onAddItem={setPoddoItems}
                                onSelectItem={(item) => {
                                    setSelectedBanglaItem(item);
                                    setSelectedBanglaCategory('পদ্য');
                                    navigate('bangla-hsc-item');
                                }}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'bangla-ssc-item' && (
                            <BanglaItemDetail
                                classLabel="SSC"
                                itemName={selectedBanglaItem}
                                categoryName={selectedBanglaCategory}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'bangla-hsc-item' && (
                            <BanglaItemDetail
                                classLabel="HSC"
                                itemName={selectedBanglaItem}
                                categoryName={selectedBanglaCategory}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-settings' && <AdminSettings onNavigate={navigate} />}
                    </main>
                </div>
            );
        }
`;
