export const englishTypes = `
            const englishReadingTypes = [
                {
                    key: 'reading-mcq',
                    label: '1. A. MCQ',
                    description: 'Multiple choice questions based on passages.'
                },
                {
                    key: 'reading-qa',
                    label: '1. B. Question and Answer',
                    description: 'Short answer comprehension questions.'
                },
                {
                    key: 'information-transfer-flow-chart',
                    label: '2. Information Transfer / Flow Chart',
                    description: 'Data or passage-based transfer tasks.',
                    children: [
                        { key: 'information-transfer', label: 'Information Transfer' },
                        { key: 'flow-chart', label: 'Flow Chart' }
                    ]
                },
                {
                    key: 'summarizing',
                    label: '3. Summarizing of a passage',
                    description: 'Summarize the given passage.'
                },
                {
                    key: 'cloze-test-with-clues',
                    label: '4. Cloze test with clues',
                    description: 'Fill in the blanks with guiding clues.'
                },
                {
                    key: 'cloze-test-without-clues',
                    label: '5. Cloze test without clues',
                    description: 'Fill in the blanks without clues.'
                },
                {
                    key: 'rearranging-passage',
                    label: '6. Rearranging the passage',
                    description: 'Arrange jumbled sentences into the correct order.'
                }
            ];

            const englishWritingTypes = [
                {
                    key: 'writing-paragraph',
                    label: '7. Writing paragraph',
                    description: 'Write a focused paragraph on a topic.'
                },
                {
                    key: 'completing-story',
                    label: '8. Completing a story',
                    description: 'Finish a story with a logical ending.'
                },
                {
                    key: 'informal-letters-emails',
                    label: '9. Informal letters / Emails',
                    description: 'Personal letters and email writing.',
                    children: [
                        { key: 'informal-letters', label: 'Informal letters' },
                        { key: 'emails', label: 'Emails' }
                    ]
                },
                {
                    key: 'analyzing-maps-graphs-charts',
                    label: '10. Analyzing maps / Graphs / Charts',
                    description: 'Describe and analyze visual data.',
                    children: [
                        { key: 'maps', label: 'Analyzing maps' },
                        { key: 'graphs', label: 'Analyzing graphs' },
                        { key: 'charts', label: 'Analyzing charts' }
                    ]
                },
                {
                    key: 'theme-writing',
                    label: '11. Theme writing',
                    description: 'Write on a theme or idea.'
                }
            ];
`;
