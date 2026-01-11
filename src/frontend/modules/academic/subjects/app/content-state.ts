export const contentState = `
            const defaultContent = {
                sscGoddoItems: [],
                sscPoddoItems: [],
                hscGoddoItems: [],
                hscPoddoItems: [],
                sscShohopathItems: [],
                hscShohopathItems: [],
                sscIctChapters: [],
                hscIctChapters: [],
                sscPhysicsChapters: [],
                sscChemistryChapters: [],
                sscBiologyChapters: [],
                sscBangladeshGlobalChapters: [],
                sscReligionChapters: {
                    Islam: [],
                    Hinduism: [],
                    Buddhism: [],
                    Christianity: []
                },
                hscPhysics1stChapters: [],
                hscPhysics2ndChapters: [],
                hscChemistry1stChapters: [],
                hscChemistry2ndChapters: [],
                hscBiology1stChapters: [],
                hscBiology2ndChapters: [],
                srijonshilQuestions: {},
                mcqQuestions: {},
                englishQuestions: {},
                notesByItem: {},
                videosByItem: {}
            };

            const normalizeStars = (value) => Math.max(0, Math.min(5, Number(value) || 0));

            const normalizeTopic = (topic) => {
                if (!topic) return null;
                if (typeof topic === 'string') {
                    return { id: topic, name: topic, stars: 0 };
                }
                return { ...topic, stars: normalizeStars(topic.stars) };
            };

            const normalizeChapter = (chapter) => {
                if (!chapter) return null;
                if (typeof chapter === 'string') {
                    return { id: chapter, name: chapter, stars: 0, topics: [] };
                }
                const topics = Array.isArray(chapter.topics)
                    ? chapter.topics.map(normalizeTopic).filter(Boolean)
                    : [];
                return { ...chapter, stars: normalizeStars(chapter.stars), topics };
            };

            const normalizeBanglaItem = (item) => {
                if (!item) return null;
                if (typeof item === 'string') {
                    return { name: item, stars: 0 };
                }
                return { ...item, stars: normalizeStars(item.stars) };
            };

            const normalizeShohopathItem = (item) => {
                if (!item) return null;
                return { ...item, stars: normalizeStars(item.stars) };
            };

            const normalizeQuestionEntry = (entry) => {
                if (!entry) return null;
                return { ...entry, stars: normalizeStars(entry.stars) };
            };

            const normalizeScenarioEntry = (entry) => {
                if (!entry) return null;
                return {
                    ...entry,
                    gStars: normalizeStars(entry.gStars),
                    ghStars: normalizeStars(entry.ghStars)
                };
            };

            const normalizeQuestionMap = (questionMap) => {
                if (!questionMap || typeof questionMap !== 'object') return {};
                const normalized = {};
                Object.entries(questionMap).forEach(([key, list]) => {
                    if (!Array.isArray(list)) {
                        normalized[key] = [];
                        return;
                    }
                    if (key.endsWith('-scenario')) {
                        normalized[key] = list.map(normalizeScenarioEntry).filter(Boolean);
                    } else {
                        normalized[key] = list.map(normalizeQuestionEntry).filter(Boolean);
                    }
                });
                return normalized;
            };

            const applyContentState = (content) => {
                const merged = { ...defaultContent, ...(content || {}) };
                setSscGoddoItems((Array.isArray(merged.sscGoddoItems) ? merged.sscGoddoItems : []).map(normalizeBanglaItem).filter(Boolean));
                setSscPoddoItems((Array.isArray(merged.sscPoddoItems) ? merged.sscPoddoItems : []).map(normalizeBanglaItem).filter(Boolean));
                setHscGoddoItems((Array.isArray(merged.hscGoddoItems) ? merged.hscGoddoItems : []).map(normalizeBanglaItem).filter(Boolean));
                setHscPoddoItems((Array.isArray(merged.hscPoddoItems) ? merged.hscPoddoItems : []).map(normalizeBanglaItem).filter(Boolean));
                setSscShohopathItems((Array.isArray(merged.sscShohopathItems) ? merged.sscShohopathItems : []).map(normalizeShohopathItem).filter(Boolean));
                setHscShohopathItems((Array.isArray(merged.hscShohopathItems) ? merged.hscShohopathItems : []).map(normalizeShohopathItem).filter(Boolean));
                setSscIctChapters((Array.isArray(merged.sscIctChapters) ? merged.sscIctChapters : []).map(normalizeChapter).filter(Boolean));
                setHscIctChapters((Array.isArray(merged.hscIctChapters) ? merged.hscIctChapters : []).map(normalizeChapter).filter(Boolean));
                setSscPhysicsChapters((Array.isArray(merged.sscPhysicsChapters) ? merged.sscPhysicsChapters : []).map(normalizeChapter).filter(Boolean));
                setSscChemistryChapters((Array.isArray(merged.sscChemistryChapters) ? merged.sscChemistryChapters : []).map(normalizeChapter).filter(Boolean));
                setSscBiologyChapters((Array.isArray(merged.sscBiologyChapters) ? merged.sscBiologyChapters : []).map(normalizeChapter).filter(Boolean));
                setSscBangladeshGlobalChapters(
                    (Array.isArray(merged.sscBangladeshGlobalChapters) ? merged.sscBangladeshGlobalChapters : []).map(normalizeChapter).filter(Boolean)
                );
                const religionChapters =
                    merged.sscReligionChapters && typeof merged.sscReligionChapters === 'object'
                        ? merged.sscReligionChapters
                        : {};
                setSscReligionChapters({
                    Islam: [],
                    Hinduism: [],
                    Buddhism: [],
                    Christianity: [],
                    ...Object.fromEntries(
                        Object.entries(religionChapters).map(([key, chapters]) => [
                            key,
                            (Array.isArray(chapters) ? chapters : []).map(normalizeChapter).filter(Boolean)
                        ])
                    )
                });
                setHscPhysics1stChapters((Array.isArray(merged.hscPhysics1stChapters) ? merged.hscPhysics1stChapters : []).map(normalizeChapter).filter(Boolean));
                setHscPhysics2ndChapters((Array.isArray(merged.hscPhysics2ndChapters) ? merged.hscPhysics2ndChapters : []).map(normalizeChapter).filter(Boolean));
                setHscChemistry1stChapters((Array.isArray(merged.hscChemistry1stChapters) ? merged.hscChemistry1stChapters : []).map(normalizeChapter).filter(Boolean));
                setHscChemistry2ndChapters((Array.isArray(merged.hscChemistry2ndChapters) ? merged.hscChemistry2ndChapters : []).map(normalizeChapter).filter(Boolean));
                setHscBiology1stChapters((Array.isArray(merged.hscBiology1stChapters) ? merged.hscBiology1stChapters : []).map(normalizeChapter).filter(Boolean));
                setHscBiology2ndChapters((Array.isArray(merged.hscBiology2ndChapters) ? merged.hscBiology2ndChapters : []).map(normalizeChapter).filter(Boolean));
                setSrijonshilQuestions(normalizeQuestionMap(merged.srijonshilQuestions));
                setMcqQuestions(normalizeQuestionMap(merged.mcqQuestions));
                setEnglishQuestions(normalizeQuestionMap(merged.englishQuestions));
                setNotesByItem(merged.notesByItem || {});
                setVideosByItem(merged.videosByItem || {});
            };
`;
