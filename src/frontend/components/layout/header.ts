export const navBarComponent = `
        const NavBar = ({ user, hasAdmin, onNavigate, onLogout }) => {
            const [isMenuOpen, setIsMenuOpen] = useState(false);
            const [profile, setProfile] = useState(null);
            const closeMenu = () => setIsMenuOpen(false);
            const openMenu = () => setIsMenuOpen(true);

            const appendTokenToAvatarUrl = (avatarUrl, token) => {
                if (!avatarUrl || !token) return avatarUrl;
                try {
                    const resolved = new URL(avatarUrl, window.location.origin);
                    resolved.searchParams.set('token', token);
                    return resolved.pathname + resolved.search;
                } catch (error) {
                    return avatarUrl;
                }
            };

            useEffect(() => {
                if (!user) {
                    setProfile(null);
                    return;
                }
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    setProfile(null);
                    return;
                }
                let isActive = true;
                const loadProfile = async () => {
                    try {
                        const response = await fetch('/api/profile', {
                            headers: { Authorization: 'Bearer ' + token }
                        });
                        const data = await response.json();
                        if (!isActive) return;
                        if (data.success) {
                            setProfile({
                                ...data.profile,
                                avatarUrl: appendTokenToAvatarUrl(data.profile?.avatarUrl, token)
                            });
                        }
                    } catch (error) {
                        if (isActive) {
                            setProfile(null);
                        }
                    }
                };
                loadProfile();
                return () => {
                    isActive = false;
                };
            }, [user?.username, user?.role]);

            // Helper to get initials
            const getInitials = () => (profile?.name || user?.username || '?').charAt(0).toUpperCase();

            return (
                <>
                    {/* Main Header Bar - Solid Indigo Color */}
                    <nav className="bg-indigo-700 sticky top-0 z-50 shadow-md">
                        <div className="w-full px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
                            
                            {/* Logo Section */}
                            <div className="flex items-center gap-4">
                                <div className="cursor-pointer group text-white" onClick={() => onNavigate('landing')}>
                                    <LogoMark 
                                        className="transition-opacity hover:opacity-90" 
                                        textClassName="text-white" 
                                        compact={true} 
                                    />
                                </div>
                            </div>

                            {/* Right Side Actions */}
                            <div className="flex items-center gap-4">
                                
                                {/* Mobile Menu Button (Hamburger) */}
                                <button
                                    onClick={openMenu}
                                    className="sm:hidden w-10 h-10 rounded-md text-white hover:bg-indigo-600 flex items-center justify-center transition"
                                    aria-label="Open menu"
                                >
                                    <i className="fa-solid fa-bars text-xl"></i>
                                </button>

                                {/* Desktop User Controls */}
                                {user ? (
                                    <div className="hidden sm:flex items-center gap-5">
                                        {/* User Profile - No Box, Direct Placement */}
                                        <button
                                            onClick={() => onNavigate('dashboard')}
                                            className="flex items-center gap-3 group focus:outline-none"
                                            title={user?.role === 'teacher' ? 'Open teacher dashboard' : 'Open admin dashboard'}
                                        >
                                            <div className="w-9 h-9 rounded-full bg-indigo-500 border-2 border-indigo-400 text-white flex items-center justify-center font-bold text-sm overflow-hidden shadow-sm group-hover:border-white transition-colors">
                                                {profile?.avatarUrl ? (
                                                    <img src={profile.avatarUrl} alt={profile?.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span>{getInitials()}</span>
                                                )}
                                            </div>
                                            <span className="font-medium text-white group-hover:text-indigo-100 transition-colors">
                                                {profile?.name || user.username}
                                            </span>
                                        </button>

                                        {/* Separator */}
                                        <div className="h-6 w-px bg-indigo-500"></div>

                                        {/* Logout Icon Button */}
                                        <button
                                            onClick={onLogout}
                                            className="text-indigo-200 hover:text-white transition-colors p-2"
                                            title="Log Out"
                                        >
                                            <i className="fa-solid fa-right-from-bracket text-lg"></i>
                                        </button>
                                    </div>
                                ) : (
                                    /* Desktop Guest Controls - Straight Buttons */
                                    <div className="hidden sm:flex items-center gap-3">
                                        <button
                                            onClick={() => onNavigate(hasAdmin ? 'login' : 'register')}
                                            className="text-sm font-medium text-indigo-100 hover:text-white transition px-4 py-2"
                                        >
                                            {hasAdmin ? 'Log In' : 'Sign Up'}
                                        </button>
                                        <button
                                            onClick={() => onNavigate(hasAdmin ? 'login' : 'login')}
                                            className="text-sm font-bold text-indigo-700 bg-white hover:bg-indigo-50 transition px-5 py-2 rounded-md shadow-sm"
                                        >
                                            Log In
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </nav>

                    {/* Mobile Menu Overlay */}
                    {isMenuOpen && (
                        <div className="fixed inset-0 z-[60] sm:hidden">
                            <button
                                onClick={closeMenu}
                                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                                aria-label="Close menu"
                            ></button>
                            
                            <div className="absolute right-0 top-0 h-full w-[80%] max-w-sm bg-white shadow-2xl p-6 flex flex-col animate-slide-in">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="text-sm font-bold text-slate-900 uppercase tracking-widest">Menu</div>
                                    <button
                                        onClick={closeMenu}
                                        className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition"
                                    >
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto">
                                    {user ? (
                                        <div className="mb-8 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-12 h-12 rounded-full overflow-hidden bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-lg">
                                                    {profile?.avatarUrl ? (
                                                        <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        getInitials()
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 leading-tight">
                                                        {profile?.name || user.username}
                                                    </div>
                                                    <div className="text-xs text-slate-500 mt-0.5">
                                                        {profile?.email || user.username}
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    closeMenu();
                                                    onNavigate('dashboard');
                                                }}
                                                className="w-full py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition text-center"
                                            >
                                                Go to Dashboard
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                                            <p className="text-slate-600 text-sm mb-4">Join Freeducation today.</p>
                                            <div className="grid grid-cols-2 gap-3">
                                                 <button
                                                    onClick={() => { closeMenu(); onNavigate(hasAdmin ? 'login' : 'register'); }}
                                                    className="py-2.5 rounded-lg border border-indigo-600 text-indigo-600 font-semibold text-sm hover:bg-indigo-50 transition"
                                                >
                                                    Sign Up
                                                </button>
                                                <button
                                                    onClick={() => { closeMenu(); onNavigate('login'); }}
                                                    className="py-2.5 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition"
                                                >
                                                    Log In
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-1">
                                        <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 px-2">Navigation</div>
                                        <button onClick={() => { closeMenu(); onNavigate('landing'); }} className="w-full text-left px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition font-medium flex items-center justify-between group">
                                            <span>Home</span>
                                            <i className="fa-solid fa-chevron-right text-xs text-slate-300 group-hover:text-indigo-400"></i>
                                        </button>
                                        <button onClick={() => { closeMenu(); onNavigate('public-videos'); }} className="w-full text-left px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition font-medium flex items-center justify-between group">
                                            <span>Videos</span>
                                            <i className="fa-solid fa-chevron-right text-xs text-slate-300 group-hover:text-indigo-400"></i>
                                        </button>
                                        <button onClick={() => { closeMenu(); onNavigate('ssc-subjects'); }} className="w-full text-left px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition font-medium flex items-center justify-between group">
                                            <span>SSC Subjects</span>
                                            <i className="fa-solid fa-chevron-right text-xs text-slate-300 group-hover:text-indigo-400"></i>
                                        </button>
                                        <button onClick={() => { closeMenu(); onNavigate('hsc-subjects'); }} className="w-full text-left px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition font-medium flex items-center justify-between group">
                                            <span>HSC Subjects</span>
                                            <i className="fa-solid fa-chevron-right text-xs text-slate-300 group-hover:text-indigo-400"></i>
                                        </button>
                                    </div>
                                </div>

                                {user && (
                                    <div className="pt-6 mt-4 border-t border-slate-100">
                                        <button
                                            onClick={() => {
                                                closeMenu();
                                                onLogout();
                                            }}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition"
                                        >
                                            <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                            <span>Log Out</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </>
            );
        };
`;
