export const PublicSidebar = ({ title, subtitle, onBack, onNavigate }) => {
  const [trail, setTrail] = useState(buildHierarchyTrail());
  
  useEffect(() => { 
    setTrail(buildHierarchyTrail()); 
  }, [title, subtitle]);

  const buildHierarchyTrail = () => {
    // This would build a breadcrumb trail based on current navigation state
    const trail = [];
    
    if (title) {
      trail.push({ label: title, type: 'page' });
    }
    
    if (subtitle) {
      trail.push({ label: subtitle, type: 'section' });
    }
    
    return trail;
  };

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-slate-200 lg:bg-white/50 lg:backdrop-blur-sm lg:z-40">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center gap-3 p-6 border-b border-slate-200">
          <button
            onClick={() => onNavigate && onNavigate('landing')}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <LogoMark compact={true} />
          </button>
        </div>

        {/* Navigation Trail */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {trail.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && (
                  <i className="fas fa-chevron-right text-xs text-slate-400"></i>
                )}
                <span className={`text-sm ${
                  index === trail.length - 1 
                    ? 'font-medium text-slate-900' 
                    : 'text-slate-600'
                }`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200">
          <div className="text-xs text-slate-500 text-center">
            Learning Platform
          </div>
        </div>
      </div>
    </aside>
  );
};
