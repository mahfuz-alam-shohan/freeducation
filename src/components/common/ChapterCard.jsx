export const ChapterCard = ({ 
  title, 
  subtitle, 
  thumbnailUrl, 
  onClick, 
  className = '', 
  isRead = false, 
  stars = 0 
}) => (
  <button 
    onClick={onClick} 
    className={className + ' block text-left transition-all duration-300 group'}
  >
    <div className="space-y-2 h-full text-center">
      <div className={`card-surface rounded-xl p-4 h-24 flex items-center justify-center relative overflow-hidden group-hover:shadow-lg transition-shadow ${isRead ? 'ring-2 ring-emerald-400' : ''}`}>
        {thumbnailUrl ? (
          <img 
            src={thumbnailUrl} 
            alt={title}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-slate-200 flex items-center justify-center">
            <i className="fas fa-file-alt text-slate-400 text-lg"></i>
          </div>
        )}
        
        {/* Read indicator */}
        {isRead && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
            <i className="fas fa-check text-white text-xs"></i>
          </div>
        )}
        
        {/* Stars rating */}
        {stars > 0 && (
          <div className="absolute bottom-2 left-2 flex gap-1">
            {Array.from({ length: Math.min(stars, 5) }).map((_, i) => (
              <i key={i} className="fas fa-star text-amber-400 text-xs"></i>
            ))}
          </div>
        )}
      </div>
      
      {/* Title and subtitle */}
      <div className="px-2">
        <h4 className="font-semibold text-slate-900 text-sm line-clamp-2">{title}</h4>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  </button>
);
