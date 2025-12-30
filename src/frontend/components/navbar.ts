export const navBarComponent = `
        const NavBar = ({ user, hasAdmin, onNavigate, activeView }) => (
            <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
                <div className="w-full px-4 sm:px-6 lg:px-10 h-18 flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 sm:py-0 gap-3">
                    <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto">
                        <div className="cursor-pointer group" onClick={() => onNavigate('landing')}>
                            <LogoMark className="transition-transform group-hover:scale-[1.02]" compact={true} />
                        </div>
                        <div className="sm:hidden text-right">
                            <span className="text-xs uppercase tracking-[0.3em] text-gray-400">Dashboard</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <i className="fas fa-sparkles text-blue-500"></i>
                            <span className="hidden md:block">Everything you need to learn or manage in one place.</span>
                        </div>
                        {user ? (
                            activeView === 'admin' ? (
                                <div className="flex items-center gap-2 px-2 py-1.5 rounded-full border border-gray-200 bg-gray-50">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-semibold text-gray-700 text-sm hidden sm:block">
                                        {user.username}
                                    </span>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => onNavigate('admin')}
                                    className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all text-sm font-semibold text-gray-700"
                                    title="Go to Admin Dashboard"
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="hidden sm:block">Admin Workspace</span>
                                </button>
                            )
                        ) : (
                            <button 
                                onClick={() => onNavigate(hasAdmin ? 'login' : 'register')} 
                                className="text-sm font-semibold text-blue-700 hover:text-blue-800 transition px-4 py-2 rounded-full bg-blue-50 hover:bg-blue-100"
                            >
                                {hasAdmin ? 'Staff Login' : 'System Setup'}
                            </button>
                        )}
                    </div>
                </div>
            </nav>
        );
`;
