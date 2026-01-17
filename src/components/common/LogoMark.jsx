export const LogoMark = ({ 
  className = '', 
  textClassName = '', 
  subtitle = 'Learning that feels effortless.', 
  compact = false 
}) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div className="relative w-11 h-11 flex items-center justify-center">
      {/* Changed text-black to text-current so it adapts to the header color */}
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
        F
      </div>
      {/* Small decorative dot */}
      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-white shadow-sm"></div>
    </div>
    {!compact && (
      <div className="flex flex-col">
        <span className={`font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent ${textClassName}`}>
          Freeducation
        </span>
        <span className={`text-xs text-slate-500 ${textClassName}`}>{subtitle}</span>
      </div>
    )}
  </div>
);
