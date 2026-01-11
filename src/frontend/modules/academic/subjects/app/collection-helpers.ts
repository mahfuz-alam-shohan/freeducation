export const collectionHelpers = `
            const resolveItemName = (item) => {
                if (!item) return '';
                if (typeof item === 'string') return item;
                return item.name || item.title || '';
            };

            const normalizeStars = (value) => Math.max(0, Math.min(5, Number(value) || 0));

            const mergeItemUpdates = (item, updates) => {
                if (!updates) return item;
                if (typeof updates === 'string') {
                    return { ...(typeof item === 'object' ? item : { name: String(item) }), name: updates };
                }
                const base = typeof item === 'object' ? item : { name: resolveItemName(item), stars: 0 };
                return { ...base, ...updates, stars: normalizeStars(updates.stars ?? base.stars) };
            };

            const addStringItem = (setItems) => (value) => {
                const resolved = typeof value === 'string' ? { name: value, stars: 0 } : mergeItemUpdates(value, value);
                setItems((prev) => [...prev, resolved]);
            };

            const updateStringItem = (setItems) => (prevValue, nextValue) => {
                const prevName = resolveItemName(prevValue);
                setItems((prev) =>
                    prev.map((item) => (resolveItemName(item) === prevName ? mergeItemUpdates(item, nextValue) : item))
                );
            };

            const removeStringItem = (setItems) => (value) => {
                const name = resolveItemName(value);
                setItems((prev) => prev.filter((item) => resolveItemName(item) !== name));
            };

            const addShohopathItem = (setItems) => (nextItem) => {
                setItems((prev) => [...prev, nextItem]);
            };

            const updateShohopathItem = (setItems) => (itemId, updates) => {
                setItems((prev) =>
                    prev.map((item) =>
                        item.id === itemId
                            ? { ...item, ...updates, stars: normalizeStars(updates.stars ?? item.stars) }
                            : item
                    )
                );
            };

            const removeShohopathItem = (setItems) => (itemId) => {
                setItems((prev) => prev.filter((item) => item.id !== itemId));
            };

            const addChapterItem = (setItems) => (entry) => {
                setItems((prev) => [...prev, entry]);
            };

            const updateChapterItem = (setItems) => (chapterId, name) => {
                const updates = typeof name === 'string' ? { name } : name;
                setItems((prev) =>
                    prev.map((item) =>
                        item.id === chapterId
                            ? { ...item, ...updates, stars: normalizeStars(updates?.stars ?? item.stars) }
                            : item
                    )
                );
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
                const updates = typeof name === 'string' ? { name } : name;
                setItems((prev) =>
                    prev.map((chapter) =>
                        chapter.id === chapterId
                            ? {
                                ...chapter,
                                topics: (chapter.topics || []).map((topic) =>
                                    topic.id === topicId
                                        ? { ...topic, ...updates, stars: normalizeStars(updates?.stars ?? topic.stars) }
                                        : topic
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

            const addReligionChapterItem = (setItems) => (religionKey, chapter) => {
                setItems((prev) => ({
                    ...prev,
                    [religionKey]: [...(prev[religionKey] || []), chapter]
                }));
            };

            const updateReligionChapterItem = (setItems) => (religionKey, chapterId, name) => {
                const updates = typeof name === 'string' ? { name } : name;
                setItems((prev) => ({
                    ...prev,
                    [religionKey]: (prev[religionKey] || []).map((chapter) =>
                        chapter.id === chapterId
                            ? { ...chapter, ...updates, stars: normalizeStars(updates?.stars ?? chapter.stars) }
                            : chapter
                    )
                }));
            };

            const removeReligionChapterItem = (setItems) => (religionKey, chapterId) => {
                setItems((prev) => ({
                    ...prev,
                    [religionKey]: (prev[religionKey] || []).filter((chapter) => chapter.id !== chapterId)
                }));
            };

            const addReligionTopicItem = (setItems) => (religionKey, chapterId, topic) => {
                setItems((prev) => ({
                    ...prev,
                    [religionKey]: (prev[religionKey] || []).map((chapter) =>
                        chapter.id === chapterId
                            ? { ...chapter, topics: [...(chapter.topics || []), topic] }
                            : chapter
                    )
                }));
            };

            const updateReligionTopicItem = (setItems) => (religionKey, chapterId, topicId, name) => {
                const updates = typeof name === 'string' ? { name } : name;
                setItems((prev) => ({
                    ...prev,
                    [religionKey]: (prev[religionKey] || []).map((chapter) =>
                        chapter.id === chapterId
                            ? {
                                ...chapter,
                                topics: (chapter.topics || []).map((topic) =>
                                    topic.id === topicId
                                        ? { ...topic, ...updates, stars: normalizeStars(updates?.stars ?? topic.stars) }
                                        : topic
                                )
                            }
                            : chapter
                    )
                }));
            };

            const removeReligionTopicItem = (setItems) => (religionKey, chapterId, topicId) => {
                setItems((prev) => ({
                    ...prev,
                    [religionKey]: (prev[religionKey] || []).map((chapter) =>
                        chapter.id === chapterId
                            ? { ...chapter, topics: (chapter.topics || []).filter((topic) => topic.id !== topicId) }
                            : chapter
                    )
                }));
            };
`;
