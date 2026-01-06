export const useVideoProgress =`
const useVideoProgress = () => {
            const [videoProgress, setVideoProgress] = useState(() => loadVideoProgress());
            const [recentVideo, setRecentVideo] = useState(() => loadRecentVideo());

            const updateVideoProgress = (entry) => {
                const timestamped = {
                    ...entry,
                    updatedAt: Date.now()
                };
                const updated = storeVideoProgress(timestamped);
                setVideoProgress(updated);
                setRecentVideo({
                    id: entry.id,
                    title: entry.title,
                    context: entry.context,
                    route: entry.route,
                    currentTime: entry.currentTime,
                    duration: entry.duration,
                    updatedAt: timestamped.updatedAt
                });
            };

            return { videoProgress, recentVideo, updateVideoProgress };
        };

`;
