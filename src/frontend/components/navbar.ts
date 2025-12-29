export const navBarComponent = `
        const NavBar = ({ user, hasAdmin, onNavigate }) => (
            <nav className="glass-panel sticky top-0 z-40 border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('landing')}>
                        <div className="bg-blue-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold font-serif text-2xl shadow-lg">F</div>
                        <span className="font-bold text-2xl tracking-tight text-gray-800 font-serif">Freeducation</span>
                    </div>
                    <div className="flex items-center gap-4">
                        {user ? (
                            <Button variant="ghost" onClick={() => onNavigate('admin')}>
                                <i className="fas fa-columns mr-2"></i> Dashboard
                            </Button>
                        ) : (
                            <button 
                                onClick={() => onNavigate(hasAdmin ? 'login' : 'register')} 
                                className="text-sm font-medium text-gray-500 hover:text-blue-600 transition"
                            >
                                {hasAdmin ? 'Staff Login' : 'System Setup'}
                            </button>
                        )}
                    </div>
                </div>
            </nav>
        );
`;
