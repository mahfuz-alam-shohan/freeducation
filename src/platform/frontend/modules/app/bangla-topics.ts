export const banglaTopics = `
            const getBanglaTopics = (classLabel) => [
                {
                    title: 'বাংলা সাহিত্য',
                    description: 'গদ্য ও পদ্য অধ্যায় সমূহ',
                    route: classLabel === 'SSC' ? 'public-bangla-ssc-shahitto' : 'public-bangla-hsc-shahitto',
                    thumbnailKey: 'shahitto'
                },
                {
                    title: 'সহপাঠ',
                    description: 'নাটক ও উপন্যাস ভিত্তিক পাঠ',
                    route: classLabel === 'SSC' ? 'public-bangla-ssc-shohopath' : 'public-bangla-hsc-shohopath',
                    thumbnailKey: 'shohopath'
                }
            ];

            const getBanglaShahittoTopics = (classLabel) => [
                {
                    title: 'গদ্য',
                    description: 'গদ্য অধ্যায় সমূহ',
                    route: classLabel === 'SSC' ? 'public-bangla-ssc-goddo' : 'public-bangla-hsc-goddo',
                    thumbnailKey: 'goddo'
                },
                {
                    title: 'পদ্য',
                    description: 'পদ্য অধ্যায় সমূহ',
                    route: classLabel === 'SSC' ? 'public-bangla-ssc-poddo' : 'public-bangla-hsc-poddo',
                    thumbnailKey: 'poddo'
                }
            ];
`;
