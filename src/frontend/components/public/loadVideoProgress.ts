export const loadVideoProgress =`
const loadVideoProgress = () => {
            try {
                const raw = localStorage.getItem(VIDEO_PROGRESS_KEY);
                return raw ? JSON.parse(raw) : {};
            } catch (error) {
                console.warn('Failed to read video progress', error);
                return {};
            }
        };

`;
