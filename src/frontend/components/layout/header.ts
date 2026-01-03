export const navBarComponent = `
        const NavBar = ({ user, hasAdmin, onNavigate, onLogout }) => (
            <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
                <div className="w-full px-3 sm:px-6 lg:px-10 h-16 flex items-center justify-between py-2 sm:py-0 gap-2 sm:gap-3">
                    <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
                        <div className="cursor-pointer group" onClick={() => onNavigate('landing')}>
                            <LogoMark className="transition-transform group-hover:scale-[1.02]" compact={true} />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 sm:gap-3 w-full sm:w-auto">
                        {user ? (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => onNavigate('dashboard')}
                                    className="flex items-center gap-2 px-2 py-1.5 rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100 transition"
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
                                    className="text-xs font-semibold text-red-600 hover:text-red-700 transition px-3 py-2 rounded-full border border-red-200 hover:border-red-300 bg-red-50"
                                >
                                    Log Out
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={() => onNavigate(hasAdmin ? 'login' : 'register')} 
                                className="text-sm font-semibold text-blue-700 hover:text-blue-800 transition px-4 py-2 rounded-full bg-blue-50 hover:bg-blue-100"
                            >
                                {hasAdmin ? 'User Login' : 'User Signup'}
                            </button>
                        )}
                    </div>
                </div>
            </nav>
        );
`;
