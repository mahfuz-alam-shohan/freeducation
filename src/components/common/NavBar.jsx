export const NavBar = ({ user, hasAdmin, onNavigate, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  // NEW: Toggle state for sketch/animations
  const [sketchEnabled, setSketchEnabled] = useState(typeof localStorage !== 'undefined' ? localStorage.getItem('sketch_enabled') !== 'false' : true);

  const closeMenu = () => setIsMenuOpen(false);
  const openMenu = () => setIsMenuOpen(true);

  // NEW: Toggle Handler
  const toggleSketch = () => {
    const newState = !sketchEnabled;
    setSketchEnabled(newState);
    localStorage.setItem('sketch_enabled', newState);
    window.dispatchEvent(new Event('sketch-toggle'));
  };

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
    // Sync state with local storage on mount/change
    const handleStorage = () => setSketchEnabled(localStorage.getItem('sketch_enabled') !== 'false');
    window.addEventListener('sketch-toggle', handleStorage);
    
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
      window.removeEventListener('sketch-toggle', handleStorage);
    };
  }, [user?.username, user?.role]);

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

            {/* NEW: Desktop Animation Toggle (Magic Wand) */}
            <button
              onClick={toggleSketch}
              className={'hidden sm:flex w-9 h-9 rounded-full items-center justify-center transition ' + (sketchEnabled ? 'text-amber-300 hover:text-white bg-white/10' : 'text-indigo-300 hover:text-white')}
              title={sketchEnabled ? "Disable Magic Effects" : "Enable Magic Effects"}
            >
              <i className="fa-solid fa-wand-magic-sparkles"></i>
            </button>

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

                <div className="h-6 w-px bg-indigo-500"></div>

                <button
                  onClick={onLogout}
                  className="text-indigo-200 hover:text-white transition-colors p-2"
                  title="Log Out"
                >
                  <i className="fa-solid fa-right-from-bracket text-lg"></i>
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <button
                  onClick={() => onNavigate('student-register')}
                  className="text-sm font-medium text-indigo-100 hover:text-white transition px-4 py-2"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => onNavigate('login')}
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

          <div className="absolute right-0 top-0 h-full w-80 max-w-[80vw] bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="text-sm font-bold text-slate-900 uppercase tracking-widest">Menu</div>
              <button
                onClick={closeMenu}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="p-4 space-y-4">
              {user ? (
                <>
                  <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
                      {profile?.avatarUrl ? (
                        <img src={profile.avatarUrl} alt={profile?.name} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <span>{getInitials()}</span>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{profile?.name || user.username}</div>
                      <div className="text-sm text-slate-600 capitalize">{user.role}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      closeMenu();
                      onNavigate('dashboard');
                    }}
                    className="w-full py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition text-center shadow-sm"
                  >
                    Go to Dashboard
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => { closeMenu(); onNavigate('student-register'); }}
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
                </>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => { closeMenu(); onNavigate('student-register'); }}
                    className="w-full py-2.5 rounded-lg border border-indigo-600 text-indigo-600 font-semibold text-sm hover:bg-indigo-50 transition"
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={() => { closeMenu(); onNavigate('login'); }}
                    className="w-full py-2.5 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition"
                  >
                    Log In
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
