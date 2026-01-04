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
                videoResources: {}
            };

            const applyContentState = (content) => {
                const merged = { ...defaultContent, ...(content || {}) };
                setSscGoddoItems(Array.isArray(merged.sscGoddoItems) ? merged.sscGoddoItems : []);
                setSscPoddoItems(Array.isArray(merged.sscPoddoItems) ? merged.sscPoddoItems : []);
                setHscGoddoItems(Array.isArray(merged.hscGoddoItems) ? merged.hscGoddoItems : []);
                setHscPoddoItems(Array.isArray(merged.hscPoddoItems) ? merged.hscPoddoItems : []);
                setSscShohopathItems(Array.isArray(merged.sscShohopathItems) ? merged.sscShohopathItems : []);
                setHscShohopathItems(Array.isArray(merged.hscShohopathItems) ? merged.hscShohopathItems : []);
                setSscIctChapters(Array.isArray(merged.sscIctChapters) ? merged.sscIctChapters : []);
                setHscIctChapters(Array.isArray(merged.hscIctChapters) ? merged.hscIctChapters : []);
                setSscPhysicsChapters(Array.isArray(merged.sscPhysicsChapters) ? merged.sscPhysicsChapters : []);
                setSscChemistryChapters(Array.isArray(merged.sscChemistryChapters) ? merged.sscChemistryChapters : []);
                setSscBiologyChapters(Array.isArray(merged.sscBiologyChapters) ? merged.sscBiologyChapters : []);
                setSscBangladeshGlobalChapters(
                    Array.isArray(merged.sscBangladeshGlobalChapters) ? merged.sscBangladeshGlobalChapters : []
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
                    ...religionChapters
                });
                setHscPhysics1stChapters(Array.isArray(merged.hscPhysics1stChapters) ? merged.hscPhysics1stChapters : []);
                setHscPhysics2ndChapters(Array.isArray(merged.hscPhysics2ndChapters) ? merged.hscPhysics2ndChapters : []);
                setHscChemistry1stChapters(Array.isArray(merged.hscChemistry1stChapters) ? merged.hscChemistry1stChapters : []);
                setHscChemistry2ndChapters(Array.isArray(merged.hscChemistry2ndChapters) ? merged.hscChemistry2ndChapters : []);
                setHscBiology1stChapters(Array.isArray(merged.hscBiology1stChapters) ? merged.hscBiology1stChapters : []);
                setHscBiology2ndChapters(Array.isArray(merged.hscBiology2ndChapters) ? merged.hscBiology2ndChapters : []);
                setSrijonshilQuestions(merged.srijonshilQuestions || {});
                setMcqQuestions(merged.mcqQuestions || {});
                setEnglishQuestions(merged.englishQuestions || {});
                setNotesByItem(merged.notesByItem || {});
                setVideoResources(merged.videoResources || {});
            };
`;
