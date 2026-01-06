export const storeReadProgress  =`
const storeReadProgress = (entry) => {
            const current = loadReadProgress();
            const updated = {
                ...current,
                [entry.key]: {
                    label: entry.label,
                    subjectLabel: entry.subjectLabel,
                    updatedAt: entry.updatedAt
                }
            };
            try {
                localStorage.setItem(READ_PROGRESS_KEY, JSON.stringify(updated));
                localStorage.setItem(
                    RECENT_READ_KEY,
                    JSON.stringify({
                        label: entry.label,
                        route: entry.route,
                        updatedAt: entry.updatedAt
                    })
                );
            } catch (error) {
                console.warn('Failed to store reading progress', error);
            }
            return updated;
        };

`;
