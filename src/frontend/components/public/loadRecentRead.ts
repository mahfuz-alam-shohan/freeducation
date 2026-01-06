export const loadRecentRead =`
 const loadRecentRead = () => {
            try {
                const raw = localStorage.getItem(RECENT_READ_KEY);
                return raw ? JSON.parse(raw) : null;
            } catch (error) {
                console.warn('Failed to read recent chapter', error);
                return null;
            }
        };


`;
