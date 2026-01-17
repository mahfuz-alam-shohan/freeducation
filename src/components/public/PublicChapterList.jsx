export const PublicChapterList = ({ classLabel, subjectLabel, chapters, onSelectChapter, recentRoute }) => {
  const chapterThumbnails = useThumbnails('/api/chapter-thumbnails', 'chapterKey');
  const { readMap, markRead } = useReadingProgress();
  
  const imageUrls = chapters.map(c => 
    chapterThumbnails[makeChapterThumbnailKey(classLabel, subjectLabel, c.id)]?.url
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {chapters.map((chapter, index) => {
          const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, chapter.id);
          const isRead = readMap[chapterKey];
          
          return (
            <ChapterCard
              key={chapter.id}
              title={chapter.name}
              subtitle={subjectLabel}
              thumbnailUrl={imageUrls[index]}
              onClick={() => {
                markRead(chapterKey);
                onSelectChapter(chapter);
              }}
              isRead={isRead}
              className="snap-start"
            />
          );
        })}
      </div>
      
      {recentRoute && (
        <div className="mt-8 text-center">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <i className="fas fa-arrow-left"></i>
            Back to {recentRoute}
          </button>
        </div>
      )}
    </div>
  );
};

// Utility functions
const makeChapterThumbnailKey = (classLabel, subjectLabel, chapterId) => {
  return `${classLabel}-${subjectLabel}-${chapterId}`;
};

// Custom hooks (simplified versions)
const useThumbnails = (endpoint, keyField) => {
  const [thumbnails, setThumbnails] = useState({});
  
  useEffect(() => {
    const fetchThumbnails = async () => {
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        const thumbnailMap = {};
        data.forEach(item => {
          thumbnailMap[item[keyField]] = item;
        });
        setThumbnails(thumbnailMap);
      } catch (error) {
        console.error('Failed to fetch thumbnails:', error);
      }
    };
    
    fetchThumbnails();
  }, [endpoint, keyField]);
  
  return thumbnails;
};

const useReadingProgress = () => {
  const [readMap, setReadMap] = useState({});
  
  useEffect(() => {
    const stored = localStorage.getItem('reading-progress');
    if (stored) {
      try {
        setReadMap(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse reading progress:', error);
      }
    }
  }, []);
  
  const markRead = (chapterKey) => {
    setReadMap(prev => {
      const updated = { ...prev, [chapterKey]: true };
      localStorage.setItem('reading-progress', JSON.stringify(updated));
      return updated;
    });
  };
  
  return { readMap, markRead };
};
