export const navBarComponent = `
        const NavBar = ({ user, hasAdmin, onNavigate, onLogout }) => {
            const [isMenuOpen, setIsMenuOpen] = useState(false);
            const closeMenu = () => setIsMenuOpen(false);
            const openMenu = () => setIsMenuOpen(true);

            return (
                <>
                    <nav className="bg-white sticky top-0 z-50 border-b border-gray-200">
                        <div className="w-full px-3 sm:px-6 lg:px-10 h-16 flex items-center justify-between py-2 sm:py-0 gap-2 sm:gap-3">
                            <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
                                <div className="cursor-pointer group" onClick={() => onNavigate('landing')}>
                                    <LogoMark className="transition-transform group-hover:scale-[1.02]" compact={true} />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 sm:gap-3 w-full sm:w-auto">
                                <button
                                    onClick={openMenu}
                                    className="sm:hidden w-9 h-9 rounded-full border border-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-50 transition"
                                    aria-label="Open menu"
                                >
                                    <i className="fa-solid fa-bars"></i>
                                </button>
                                {user ? (
                                    <div className="hidden sm:flex items-center gap-3">
                                        <button
                                            onClick={() => onNavigate('dashboard')}
                                            className="flex items-center gap-2 px-2 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition"
                                            aria-label={user?.role === 'teacher' ? 'Open teacher dashboard' : 'Open admin dashboard'}
                                        >
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-semibold text-gray-700 text-sm hidden sm:block">
                                                {user.username}
                                            </span>
                                        </button>
                                        <button
                                            onClick={onLogout}
                                            className="text-xs font-semibold text-red-600 hover:text-red-700 transition px-3 py-2 rounded-full border border-red-200 hover:border-red-300 bg-white"
                                        >
                                            Log Out
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => onNavigate(hasAdmin ? 'login' : 'register')}
                                        className="hidden sm:inline-flex text-sm font-semibold text-blue-700 hover:text-blue-800 transition px-4 py-2 rounded-full bg-[#eef2ff] hover:bg-[#e0e7ff]"
                                    >
                                        {hasAdmin ? 'User Login' : 'User Signup'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </nav>

                    {isMenuOpen && (
                        <div className="fixed inset-0 z-[60] sm:hidden">
                            <button
                                onClick={closeMenu}
                                className="absolute inset-0 bg-slate-900/40"
                                aria-label="Close menu"
                            ></button>
                            <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-xl p-5 flex flex-col">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold text-slate-700 uppercase tracking-[0.2em]">Menu</div>
                                    <button
                                        onClick={closeMenu}
                                        className="w-8 h-8 rounded-full border border-slate-200 text-slate-500 flex items-center justify-center"
                                    >
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                </div>
                                <div className="mt-5 space-y-4 flex-1 overflow-y-auto">
                                    {user ? (
                                        <div className="rounded-2xl border border-slate-200 p-4 space-y-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                                    {user.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-slate-900">{user.username}</div>
                                                    <div className="text-xs text-slate-500 capitalize">{user.role}</div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    closeMenu();
                                                    onNavigate('dashboard');
                                                }}
                                                className="w-full text-left text-sm font-semibold text-blue-600"
                                            >
                                                Open Dashboard
                                            </button>
                                            <button
                                                onClick={() => {
                                                    closeMenu();
                                                    onLogout();
                                                }}
                                                className="w-full text-left text-sm font-semibold text-red-500"
                                            >
                                                Log Out
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="rounded-2xl border border-slate-200 p-4 space-y-2">
                                            <div className="text-sm font-semibold text-slate-700">Welcome</div>
                                            <button
                                                onClick={() => {
                                                    closeMenu();
                                                    onNavigate(hasAdmin ? 'login' : 'register');
                                                }}
                                                className="w-full text-left text-sm font-semibold text-blue-600"
                                            >
                                                {hasAdmin ? 'User Login' : 'User Signup'}
                                            </button>
                                        </div>
                                    )}
                                    <div className="rounded-2xl border border-slate-200 p-4 space-y-2">
                                        <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Shortcuts</div>
                                        <button
                                            onClick={() => {
                                                closeMenu();
                                                onNavigate('landing');
                                            }}
                                            className="w-full text-left text-sm text-slate-600"
                                        >
                                            Home
                                        </button>
                                        <button
                                            onClick={() => {
                                                closeMenu();
                                                onNavigate('public-videos');
                                            }}
                                            className="w-full text-left text-sm text-slate-600"
                                        >
                                            Videos
                                        </button>
                                        <button
                                            onClick={() => {
                                                closeMenu();
                                                onNavigate('ssc-subjects');
                                            }}
                                            className="w-full text-left text-sm text-slate-600"
                                        >
                                            SSC Subjects
                                        </button>
                                        <button
                                            onClick={() => {
                                                closeMenu();
                                                onNavigate('hsc-subjects');
                                            }}
                                            className="w-full text-left text-sm text-slate-600"
                                        >
                                            HSC Subjects
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            );
        };
`;
