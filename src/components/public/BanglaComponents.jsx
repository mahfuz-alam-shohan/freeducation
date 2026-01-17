// Bangla-specific components for the Freeducation platform

export const PublicBanglaShell = ({ title, subtitle, onBack, onNavigate, children }) => (
  <PublicSimpleShell 
    title={title} 
    subtitle={subtitle} 
    onBack={onBack}
    onNavigate={onNavigate}
  >
    {children}
  </PublicSimpleShell>
);

export const PublicBanglaTopicGrid = ({ classLabel, subjectLabel, topics, onNavigate }) => {
  const chapterThumbnails = useThumbnails('/api/chapter-thumbnails', 'chapterKey');
  const { readMap, markRead } = useReadingProgress();
  
  return (
    <ArtPanelGrid className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 font-bangla">
      {topics.map((topic) => {
        const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, topic.thumbnailKey || topic.title);
        return (
          <ChapterCard
            key={topic.title}
            title={topic.title}
            subtitle={topic.description}
            thumbnailUrl={chapterThumbnails[chapterKey]?.url}
            onClick={() => {
              markRead({ chapterKey, title: topic.title, subjectLabel });
              onNavigate(topic.route);
            }}
            isRead={readMap[chapterKey]}
            className="font-bangla"
          />
        );
      })}
    </ArtPanelGrid>
  );
};

export const PublicBanglaTextList = ({ classLabel, subjectLabel, categoryLabel, subtitle, items, onSelectItem }) => {
  const chapterThumbnails = useThumbnails('/api/chapter-thumbnails', 'chapterKey');
  const { readMap, markRead } = useReadingProgress();
  
  return (
    <div className="space-y-4 font-bangla">
      <ArtPanelGrid className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {items.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 italic">
            কোনো তথ্য সূচনায় পাওয় না
          </div>
        )}
        {items.map((item) => {
          const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, item + '-' + categoryLabel);
          return (
            <ChapterCard
              key={item}
              title={item}
              subtitle={categoryLabel}
              thumbnailUrl={chapterThumbnails[chapterKey]?.url}
              onClick={() => {
                markRead({ chapterKey, title: item, subjectLabel });
                onSelectItem(item);
              }}
              isRead={readMap[chapterKey]}
              className="font-bangla"
            />
          );
        })}
      </ArtPanelGrid>
    </div>
  );
};

export const PublicBanglaShohopathList = ({ classLabel, subjectLabel, items, onSelectItem }) => {
  const chapterThumbnails = useThumbnails('/api/chapter-thumbnails', 'chapterKey');
  const { readMap, markRead } = useReadingProgress();
  
  return (
    <div className="space-y-4 font-bangla">
      <ArtPanelGrid className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 font-bangla">
        {items.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 italic">
            কোনো তথ্য সূচনায় পাওয় না
          </div>
        )}
        {items.map((item) => {
          const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, (item.id || item.name) + '-সহওপাথ');
          return (
            <ChapterCard
              key={item.id}
              title={item.name}
              subtitle={item.type}
              thumbnailUrl={chapterThumbnails[chapterKey]?.url}
              onClick={() => {
                markRead({ chapterKey, title: item.name, subjectLabel });
                onSelectItem(item);
              }}
              isRead={readMap[chapterKey]}
              className="font-bangla"
            />
          );
        })}
      </ArtPanelGrid>
    </div>
  );
};

export const PublicBanglaItemDetail = ({ classLabel, itemName, categoryName, notesByItem, onNavigate, onOpenVideos }) => {
  const categoryRoute = classLabel === 'SSC' 
    ? (categoryName === 'পদ' ? 'public-bangla-ssc-poddo' : categoryName === 'সাধারণ' || categoryName === 'ব্যাকরণ' ? 'public-bangla-ssc-shohopath' : categoryName === 'গদ্য' || categoryName === 'বিচার' ? 'public-bangla-ssc-goddo' : 'public-bangla-ssc-boddo')
    : (categoryName === 'পদ' ? 'public-bangla-hsc-poddo' : categoryName === 'সাধারণ' || categoryName === 'ব্যাকরণ' ? 'public-bangla-hsc-shohopath' : categoryName === 'গদ্য' || categoryName === 'বিচার' ? 'public-bangla-hsc-goddo' : 'public-bangla-hsc-boddo');
  
  const srijonshilRoute = classLabel === 'SSC' ? 'public-bangla-ssc-srijonshil' : 'public-bangla-hsc-srijonshil';
  
  return (
    <PublicSimpleShell title={itemName} subtitle={categoryName} onBack={() => onNavigate(categoryRoute)} onNavigate={onNavigate}>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in font-bangla">
        {/* Content Header */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{itemName}</h1>
          <p className="text-slate-600">{categoryName}</p>
        </div>

        {/* Notes Content */}
        {notesByItem && notesByItem[itemName] && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <BookReader>
              {notesByItem[itemName]}
            </BookReader>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => onNavigate(srijonshilRoute)}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <i className="fas fa-pen-nib mr-2"></i>
            সৃজনশীল
          </button>
          
          <button
            onClick={onOpenVideos}
            className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
          >
            <i className="fas fa-video mr-2"></i>
            ভিডিও
          </button>
        </div>
      </div>
    </PublicSimpleShell>
  );
};
