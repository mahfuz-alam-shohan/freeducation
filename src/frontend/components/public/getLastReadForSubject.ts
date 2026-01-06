export const  getLastReadForSubject  =`

        const getLastReadForSubject = (readMap, subjectLabel) => {
            const entries = Object.values(readMap || {}).filter((entry) => entry.subjectLabel === subjectLabel);
            if (entries.length === 0) return '';
            entries.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
            return entries[0]?.label || '';
        };

`;
