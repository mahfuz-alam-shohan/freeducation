export const loadRecentVideo =`
 const loadRecentVideo = () => {
            try {
                const raw = localStorage.getItem(RECENT_VIDEO_KEY);
                return raw ? JSON.parse(raw) : null;
            } catch (error) {
                console.warn('Failed to read recent video', error);
                return null;
            }
        };

`;
