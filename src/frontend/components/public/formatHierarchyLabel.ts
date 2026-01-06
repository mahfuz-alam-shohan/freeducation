export const  formatHierarchyLabel =`
const formatHierarchyLabel = (segment) => {
            if (!segment) return '';
            const normalized = segment.toLowerCase();
            const replacements = {
                ssc: 'SSC',
                hsc: 'HSC',
                ict: 'ICT',
                mcq: 'MCQ',
                cq: 'CQ',
                srijonshil: 'Srijonshil',
                shohopath: 'Shohopath',
                shahitto: 'Shahitto',
                goddo: 'Goddo',
                poddo: 'Poddo',
                topics: 'Topics',
                topic: 'Topic',
                chapters: 'Chapters',
                videos: 'Videos'
            };
            if (replacements[normalized]) return replacements[normalized];
            return segment
                .split('-')
                .map((part) => replacements[part] || part.charAt(0).toUpperCase() + part.slice(1))
                .join(' ');
        };

`;
