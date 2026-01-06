export const PublicBanglaTopicGrid =`
const PublicBanglaTopicGrid = ({ classLabel, subjectLabel, topics, onNavigate }) => {
            const chapterThumbnails = useThumbnails('/api/chapter-thumbnails', 'chapterKey');
            const { readMap, markRead } = useReadingProgress();

            return (
                <ArtPanelGrid className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 font-bangla">
                    {topics.map((topic) => {
                        const chapterKey = makeChapterThumbnailKey(
                            classLabel,
                            subjectLabel,
                            topic.thumbnailKey || topic.title
                        );
                        return (
                            <ChapterCard
                                key={topic.title}
                                title={topic.title}
                                subtitle={topic.description}
                                thumbnailUrl={chapterThumbnails[chapterKey]?.url}
                                isRead={Boolean(readMap[chapterKey])}
                                onClick={() => {
                                    markRead({
                                        key: chapterKey,
                                        label: topic.title,
                                        subjectLabel,
                                        route: topic.route
                                    });
                                    topic.route && onNavigate(topic.route);
                                }}
                                className={cardWidthClass}
                            />
                        );
                    })}
                </ArtPanelGrid>
            );
        };


`;
