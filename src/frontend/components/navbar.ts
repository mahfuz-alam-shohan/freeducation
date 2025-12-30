export const navBarComponent = `
        const NavBar = ({ user, hasAdmin, onNavigate }) => (
            <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
                <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                    {/* Logo Area */}
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('landing')}>
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold font-serif text-2xl shadow-lg group-hover:scale-105 transition-transform">
                            F
                        </div>
                        <span className="font-bold text-2xl tracking-tight text-gray-800 font-serif group-hover:text-blue-600 transition-colors">
                            Freeducation
                        </span>
                    </div>

                    {/* Actions Area */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <button 
                                onClick={() => onNavigate('admin')}
                                className="flex items-center gap-2 pl-1 pr-3 py-1.5 rounded-full hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all"
                                title="Go to Admin Dashboard"
                            >
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-bold text-gray-700 text-sm hidden sm:block">
                                    {user.username}
                                </span>
                            </button>
                        ) : (
                            <button 
                                onClick={() => onNavigate(hasAdmin ? 'login' : 'register')} 
                                className="text-sm font-semibold text-gray-500 hover:text-blue-600 transition px-3 py-2 rounded-lg hover:bg-gray-50"
                            >
                                {hasAdmin ? 'Staff Login' : 'System Setup'}
                            </button>
                        )}
                    </div>
                </div>
            </nav>
        );
`;


