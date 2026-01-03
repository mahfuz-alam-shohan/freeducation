export const questionHelpers = `
            const addQuestionEntry = (setter, key) => (entry) => {
                setter((prev) => {
                    const updated = prev[key] ? [...prev[key]] : [];
                    updated.push(entry);
                    return { ...prev, [key]: updated };
                });
            };

            const updateQuestionEntry = (setter, key) => (index, entry) => {
                setter((prev) => {
                    const updated = prev[key] ? [...prev[key]] : [];
                    updated[index] = entry;
                    return { ...prev, [key]: updated };
                });
            };

            const removeQuestionEntry = (setter, key) => (index) => {
                setter((prev) => {
                    const updated = prev[key] ? [...prev[key]] : [];
                    updated.splice(index, 1);
                    return { ...prev, [key]: updated };
                });
            };
`;
