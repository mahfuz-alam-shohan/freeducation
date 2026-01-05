export const derivedState = `
            const englishQuestionKey = getEnglishQuestionKey(
                selectedEnglishSection,
                selectedEnglishType?.key,
                selectedEnglishSubtype?.key
            );
            const englishQuestionEntries = englishQuestions[englishQuestionKey] || [];
            const englishQuestionTitle = selectedEnglishSubtype
                ? (selectedEnglishType?.label || '') + ' • ' + selectedEnglishSubtype.label
                : selectedEnglishType?.label || 'English 1st Paper';
            const englishQuestionSubtitle = selectedEnglishSection
                ? selectedEnglishSection + ' section questions'
                : 'English 1st Paper questions';

            const activeScienceTopicKey = getScienceTopicKey(selectedScienceChapter?.id, selectedScienceTopic?.id);

            const sumLengths = (...lists) =>
                lists.reduce((total, list) => total + (Array.isArray(list) ? list.length : 0), 0);
            const sscReligionCount = Object.values(sscReligionChapters || {}).reduce(
                (total, list) => total + (Array.isArray(list) ? list.length : 0),
                0
            );
            const subjectChapterCounts = {
                [makeThumbnailKey('Bangla 1st Paper', 'SSC')]: sumLengths(sscGoddoItems, sscPoddoItems, sscShohopathItems),
                [makeThumbnailKey('Bangla 1st Paper', 'HSC')]: sumLengths(hscGoddoItems, hscPoddoItems, hscShohopathItems),
                [makeThumbnailKey('Information and Communication Technology', 'SSC')]: sumLengths(sscIctChapters),
                [makeThumbnailKey('Information and Communication Technology', 'HSC')]: sumLengths(hscIctChapters),
                [makeThumbnailKey('Physics', 'SSC')]: sumLengths(sscPhysicsChapters),
                [makeThumbnailKey('Chemistry', 'SSC')]: sumLengths(sscChemistryChapters),
                [makeThumbnailKey('Biology', 'SSC')]: sumLengths(sscBiologyChapters),
                [makeThumbnailKey('Bangladesh and Global Studies', 'SSC')]: sumLengths(sscBangladeshGlobalChapters),
                [makeThumbnailKey('Religion and Moral Education', 'SSC')]: sscReligionCount,
                [makeThumbnailKey('Physics 1st Paper', 'HSC')]: sumLengths(hscPhysics1stChapters),
                [makeThumbnailKey('Physics 2nd Paper', 'HSC')]: sumLengths(hscPhysics2ndChapters),
                [makeThumbnailKey('Chemistry 1st Paper', 'HSC')]: sumLengths(hscChemistry1stChapters),
                [makeThumbnailKey('Chemistry 2nd Paper', 'HSC')]: sumLengths(hscChemistry2ndChapters),
                [makeThumbnailKey('Biology 1st Paper', 'HSC')]: sumLengths(hscBiology1stChapters),
                [makeThumbnailKey('Biology 2nd Paper', 'HSC')]: sumLengths(hscBiology2ndChapters)
            };
`;
