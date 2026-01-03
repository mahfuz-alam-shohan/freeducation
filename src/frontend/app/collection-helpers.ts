export const collectionHelpers = `
            const addStringItem = (setItems) => (value) => {
                setItems((prev) => [...prev, value]);
            };

            const updateStringItem = (setItems) => (prevValue, nextValue) => {
                setItems((prev) => prev.map((item) => (item === prevValue ? nextValue : item)));
            };

            const removeStringItem = (setItems) => (value) => {
                setItems((prev) => prev.filter((item) => item !== value));
            };

            const addShohopathItem = (setItems) => (nextItem) => {
                setItems((prev) => [...prev, nextItem]);
            };

            const updateShohopathItem = (setItems) => (itemId, updates) => {
                setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, ...updates } : item)));
            };

            const removeShohopathItem = (setItems) => (itemId) => {
                setItems((prev) => prev.filter((item) => item.id !== itemId));
            };

            const addChapterItem = (setItems) => (entry) => {
                setItems((prev) => [...prev, entry]);
            };

            const updateChapterItem = (setItems) => (chapterId, name) => {
                setItems((prev) => prev.map((item) => (item.id === chapterId ? { ...item, name } : item)));
            };

            const removeChapterItem = (setItems) => (chapterId) => {
                setItems((prev) => prev.filter((item) => item.id !== chapterId));
            };

            const addTopicItem = (setItems) => (chapterId, topic) => {
                setItems((prev) =>
                    prev.map((chapter) =>
                        chapter.id === chapterId
                            ? { ...chapter, topics: [...(chapter.topics || []), topic] }
                            : chapter
                    )
                );
            };

            const updateTopicItem = (setItems) => (chapterId, topicId, name) => {
                setItems((prev) =>
                    prev.map((chapter) =>
                        chapter.id === chapterId
                            ? {
                                ...chapter,
                                topics: (chapter.topics || []).map((topic) =>
                                    topic.id === topicId ? { ...topic, name } : topic
                                )
                            }
                            : chapter
                    )
                );
            };

            const removeTopicItem = (setItems) => (chapterId, topicId) => {
                setItems((prev) =>
                    prev.map((chapter) =>
                        chapter.id === chapterId
                            ? { ...chapter, topics: (chapter.topics || []).filter((topic) => topic.id !== topicId) }
                            : chapter
                    )
                );
            };
`;
