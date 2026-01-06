export const useReadingProgress =`
const useReadingProgress = () => {
            const [readMap, setReadMap] = useState(() => loadReadProgress());
            const [recentRead, setRecentRead] = useState(() => loadRecentRead());

            const markRead = (entry) => {
                const timestamped = {
                    ...entry,
                    updatedAt: Date.now()
                };
                const updated = storeReadProgress(timestamped);
                setReadMap(updated);
                setRecentRead({
                    label: entry.label,
                    route: entry.route,
                    updatedAt: timestamped.updatedAt
                });
            };

            return { readMap, recentRead, markRead };
        };


`;
