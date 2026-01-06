export const PublicBanglaTextList =`
const PublicBanglaTextList = ({ classLabel, subjectLabel, categoryLabel, subtitle, items, onSelectItem }) => {
            const chapterThumbnails = useThumbnails('/api/chapter-thumbnails', 'chapterKey');
            const { readMap, markRead } = useReadingProgress();

            return (
                <div className="space-y-4 font-bangla">
                    {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
                    <ArtPanelGrid className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                        {items.length === 0 && (
                            <div className="text-sm text-slate-400">এই অংশে এখনও কোন পাঠ যোগ করা হয়নি।</div>
                        )}
                        {items.map((item) => {
                            const chapterKey = makeChapterThumbnailKey(
                                classLabel,
                                subjectLabel,
                                item + '-' + categoryLabel
                            );
                            return (
                                <ChapterCard
                                    key={item}
                                    title={item}
                                    subtitle={categoryLabel}
                                    thumbnailUrl={chapterThumbnails[chapterKey]?.url}
                                    isRead={Boolean(readMap[chapterKey])}
                                    onClick={() => {
                                        storeBanglaSelection({
                                            classLabel,
                                            categoryName: categoryLabel,
                                            itemName: item
                                        });
                                        markRead({
                                            key: chapterKey,
                                            label: item,
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
                </div>
            );
        };

`;
