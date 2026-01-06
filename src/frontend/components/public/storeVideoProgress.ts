export const storeVideoProgress =`
const storeVideoProgress = (entry) => {
            const current = loadVideoProgress();
            const updated = {
                ...current,
                [entry.id]: {
                    title: entry.title,
                    context: entry.context,
                    route: entry.route,
                    currentTime: entry.currentTime,
                    duration: entry.duration,
                    updatedAt: entry.updatedAt
                }
            };
            try {
                localStorage.setItem(VIDEO_PROGRESS_KEY, JSON.stringify(updated));
                localStorage.setItem(RECENT_VIDEO_KEY, JSON.stringify({
                    id: entry.id,
                    title: entry.title,
                    context: entry.context,
                    route: entry.route,
                    currentTime: entry.currentTime,
                    duration: entry.duration,
                    updatedAt: entry.updatedAt
                }));
            } catch (error) {
                console.warn('Failed to store video progress', error);
            }
            return updated;
        };

`;
