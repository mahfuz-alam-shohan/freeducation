export const keyHelpers = `
            const getQuestionKey = (classLabel, categoryName, itemName, extra = '') => {
                return [classLabel, categoryName || 'general', itemName || 'general', extra].join('-');
            };
            const getScienceTopicKey = (chapterId, topicId) => {
                return [chapterId || 'chapter', topicId || 'topic'].join(':');
            };
            const getEnglishQuestionKey = (section, typeKey, subtypeKey) => {
                return ['HSC', section || 'general', typeKey || 'general', subtypeKey || 'general'].join('-');
            };
            const getReligionSubjectKey = (religion) => {
                const label = religion?.label || religion?.key || '';
                return ['Religion and Moral Education', label].filter(Boolean).join(' - ');
            };
`;
