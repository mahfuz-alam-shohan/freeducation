export const loadReadProgress  =`
  const loadReadProgress = () => {
            try {
                const raw = localStorage.getItem(READ_PROGRESS_KEY);
                return raw ? JSON.parse(raw) : {};
            } catch (error) {
                console.warn('Failed to read progress data', error);
                return {};
            }
        };

`;
