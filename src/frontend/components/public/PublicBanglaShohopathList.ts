export const PublicBanglaShohopathList  =`
const PublicBanglaShohopathList = ({ classLabel, subjectLabel, items, onSelectItem }) => {
            const chapterThumbnails = useThumbnails('/api/chapter-thumbnails', 'chapterKey');
            const { readMap, markRead } = useReadingProgress();

            return (
                <ArtPanelGrid className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 font-bangla">
                    {items.length === 0 && (
                        <div className="text-sm text-slate-400">এই অংশে এখনও কোন সহপাঠ যোগ করা হয়নি।</div>
                    )}
                    {items.map((item) => {
                        const chapterKey = makeChapterThumbnailKey(
                            classLabel,
                            subjectLabel,
                            (item.id || item.name) + '-সহপাঠ'
                        );
                        return (
                            <ChapterCard
                                key={item.id}
                                title={item.name}
                                subtitle={item.type}
                                thumbnailUrl={chapterThumbnails[chapterKey]?.url}
                                isRead={Boolean(readMap[chapterKey])}
                                onClick={() => {
                                    storeBanglaSelection({
                                        classLabel,
                                        categoryName: item.type,
                                        itemName: item.name
                                    });
                                    markRead({
                                        key: chapterKey,
                                        label: item.name,
                                        subjectLabel,
                                        route: classLabel === 'SSC' ? 'public-bangla-ssc-item' : 'public-bangla-hsc-item'
                                    });
                                    onSelectItem(item);
                                }}
                                className={cardWidthClass}
                            />
                        );
                    })}
                </ArtPanelGrid>
            );
        };

`;
