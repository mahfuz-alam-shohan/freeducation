export const  =`
const buildSubjectList = (classLabel) => {
            const groupMap = subjectGroups[classLabel] || {};
            let paletteIndex = 0;
            const subjectMap = new Map();
            Object.entries(groupMap).forEach(([group, subjects]) => {
                subjects.forEach((subject) => {
                    if (subjectMap.has(subject)) {
                        subjectMap.get(subject).groups.add(group);
                        return;
                    }
                    const accent = accentPalette[paletteIndex % accentPalette.length];
                    paletteIndex += 1;
                    const isBanglaFirst = subject === 'Bangla 1st Paper';
                    const isEnglishFirst = subject === 'English 1st Paper' && classLabel === 'HSC';
                    const isIct = subject === 'Information and Communication Technology' && classLabel === 'SSC';
                    const isHscIct = subject === 'Information and Communication Technology' && classLabel === 'HSC';
                    const isSscPhysics = subject === 'Physics' && classLabel === 'SSC';
                    const isSscChemistry = subject === 'Chemistry' && classLabel === 'SSC';
                    const isSscBiology = subject === 'Biology' && classLabel === 'SSC';
                    const isBangladeshGlobal = subject === 'Bangladesh and Global Studies' && classLabel === 'SSC';
                    const isReligionMoral = subject === 'Religion and Moral Education' && classLabel === 'SSC';
                    const isHscPhysics1 = subject === 'Physics 1st Paper' && classLabel === 'HSC';
                    const isHscPhysics2 = subject === 'Physics 2nd Paper' && classLabel === 'HSC';
                    const isHscChemistry1 = subject === 'Chemistry 1st Paper' && classLabel === 'HSC';
                    const isHscChemistry2 = subject === 'Chemistry 2nd Paper' && classLabel === 'HSC';
                    const isHscBiology1 = subject === 'Biology 1st Paper' && classLabel === 'HSC';
                    const isHscBiology2 = subject === 'Biology 2nd Paper' && classLabel === 'HSC';
                    subjectMap.set(subject, {
                        title: subject,
                        subtitle: isBanglaFirst ? 'বাংলা ১ম পত্র' : '',
                        icon: subjectIconMap[subject] || 'fa-book',
                        accent,
                        groups: new Set([group]),
                        classLabel,
                        subjectKey: makeThumbnailKey(subject, classLabel),
                        route: isBanglaFirst
                            ? (classLabel === 'SSC' ? 'public-bangla-ssc-1st-paper' : 'public-bangla-hsc-1st-paper')
                            : isEnglishFirst
                                ? 'public-english-hsc-1st-paper'
                                : isIct
                                    ? 'public-ssc-ict'
                                    : isHscIct
                                        ? 'public-hsc-ict'
                                        : isSscPhysics
                                            ? 'public-ssc-physics'
                                            : isSscChemistry
                                                ? 'public-ssc-chemistry'
                                                : isSscBiology
                                                    ? 'public-ssc-biology'
                                                    : isBangladeshGlobal
                                                        ? 'public-ssc-bangladesh-global-studies'
                                                        : isReligionMoral
                                                            ? 'public-ssc-religion'
                                                    : isHscPhysics1
                                                        ? 'public-hsc-physics-1st'
                                                        : isHscPhysics2
                                                        ? 'public-hsc-physics-2nd'
                                                        : isHscChemistry1
                                                            ? 'public-hsc-chemistry-1st'
                                                            : isHscChemistry2
                                                                ? 'public-hsc-chemistry-2nd'
                                                                : isHscBiology1
                                                                    ? 'public-hsc-biology-1st'
                                                                    : isHscBiology2
                                                                        ? 'public-hsc-biology-2nd'
                                                                        : ''
                    });
                });
            });
            return Array.from(subjectMap.values()).map((subject) => {
                const groups = Array.from(subject.groups);
                return {
                    ...subject,
                    groups,
                    groupLabel: groups.length > 1 ? 'Common' : groups[0]
                };
            });
        };

`;
