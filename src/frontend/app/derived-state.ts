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
`;
