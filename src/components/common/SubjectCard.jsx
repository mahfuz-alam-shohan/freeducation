export const SubjectCard = ({ subject, onNavigate, className = '', showGroup = false }) => {
  const isActive = Boolean(subject.route);
  const chapterCount = getSubjectChapterCount(subject);
  
  return (
    <button 
      onClick={() => isActive && onNavigate(subject.route)} 
      className={`block text-left transition-all duration-300 group ${className} ${!isActive ? 'cursor-not-allowed opacity-60' : 'hover:scale-105'}`}
      disabled={!isActive}
    >
      <div className="space-y-2 h-full text-center">
        <div className={`card-surface rounded-xl p-4 h-32 flex flex-col items-center justify-center relative overflow-hidden ${isActive ? 'hover:shadow-lg' : ''}`}>
          {/* Thumbnail or Icon */}
          {subject.thumbnailUrl ? (
            <img 
              src={subject.thumbnailUrl} 
              alt={subject.title}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${subject.accent || 'bg-indigo-500'}`}>
              <i className={`fas ${subject.icon || 'fa-book'} text-lg`}></i>
            </div>
          )}
          
          {/* Read indicator */}
          {subject.isRead && (
            <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
              <i className="fas fa-check text-white text-xs"></i>
            </div>
          )}
        </div>
        
        {/* Title and metadata */}
        <div className="px-2">
          <h3 className="font-semibold text-slate-900 text-sm line-clamp-2">{subject.title}</h3>
          {showGroup && subject.groups && (
            <div className="flex flex-wrap gap-1 mt-1 justify-center">
              {Array.from(subject.groups).map(group => (
                <span key={group} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                  {group}
                </span>
              ))}
            </div>
          )}
          {chapterCount > 0 && (
            <p className="text-xs text-slate-500 mt-1">{chapterCount} chapters</p>
          )}
        </div>
      </div>
    </button>
  );
};

// Helper function to get chapter count
const getSubjectChapterCount = (subject) => {
  // This would typically come from the subject data
  return subject.chapterCount || 0;
};
