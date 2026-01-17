export const PublicSimpleShell = ({ 
  title, 
  subtitle, 
  backgroundClass = 'bg-slate-50', 
  badge, 
  onBack, 
  onNavigate, 
  children 
}) => (
  <div className={'flex-1 min-h-screen relative ' + backgroundClass}>
    <BackgroundArt />
    <InteractiveSketchOverlay />
    
    {/* Header */}
    <header className="relative z-30 bg-white/80 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            {onBack && (
              <button 
                onClick={onBack} 
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
              >
                <i className="fa-solid fa-arrow-left"></i> 
                Back
              </button>
            )}
            <div>
              <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
              {subtitle && (
                <p className="text-sm text-slate-600">{subtitle}</p>
              )}
            </div>
            {badge && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {badge}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate && onNavigate('landing')}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              <LogoMark compact={true} />
            </button>
          </div>
        </div>
      </div>
    </header>
    
    {/* Main Content */}
    <main className="relative z-20">
      {children}
    </main>
  </div>
);

// Interactive sketch overlay component
const InteractiveSketchOverlay = () => {
  const [isEnabled, setIsEnabled] = useState(() => {
    return typeof localStorage !== 'undefined' ? localStorage.getItem('sketch_enabled') !== 'false' : true;
  });

  useEffect(() => {
    const handleToggle = () => {
      setIsEnabled(localStorage.getItem('sketch_enabled') !== 'false');
    };
    
    window.addEventListener('sketch-toggle', handleToggle);
    return () => window.removeEventListener('sketch-toggle', handleToggle);
  }, []);

  if (!isEnabled) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      <canvas id="sketch-canvas" className="w-full h-full" />
    </div>
  );
};
