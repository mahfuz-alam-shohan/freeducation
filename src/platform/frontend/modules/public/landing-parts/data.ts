export const landingData = `
        const quoteItems = [
            { text: 'Education is the most powerful weapon which you can use to change the world.', author: 'Nelson Mandela' },
            { text: 'The roots of education are bitter, but the fruit is sweet.', author: 'Aristotle' },
            { text: 'An investment in knowledge pays the best interest.', author: 'Benjamin Franklin' },
            { text: 'Education is not the filling of a pail, but the lighting of a fire.', author: 'William Butler Yeats' },
            { text: 'The beautiful thing about learning is that no one can take it away from you.', author: 'B.B. King' },
            { text: 'Education is the passport to the future, for tomorrow belongs to those who prepare for it today.', author: 'Malcolm X' },
            { text: 'Service to others is the rent you pay for your room here on earth.', author: 'Muhammad Ali' },
            { text: 'Knowledge will bring you the opportunity to make a difference.', author: 'Claire Fagin' },
            { text: 'The purpose of education is to replace an empty mind with an open one.', author: 'Malcolm Forbes' },
            { text: 'We serve others best when we empower them to learn for themselves.', author: 'Education proverb' }
        ];

        const subjectGroups = {
            SSC: {
                Science: [
                    'Bangla 1st Paper', 'Bangla 2nd Paper', 'English 1st Paper', 'English 2nd Paper',
                    'General Mathematics', 'Physics', 'Chemistry', 'Biology', 'Higher Mathematics',
                    'Bangladesh and Global Studies', 'Information and Communication Technology', 'Religion and Moral Education'
                ],
                Humanities: [
                    'Bangla 1st Paper', 'Bangla 2nd Paper', 'English 1st Paper', 'English 2nd Paper',
                    'General Mathematics', 'Bangladesh and Global Studies', 'Information and Communication Technology',
                    'Geography and Environment', 'History of Bangladesh and World Civilization', 'Civics and Citizenship', 'Religion and Moral Education'
                ],
                'Business Studies': [
                    'Bangla 1st Paper', 'Bangla 2nd Paper', 'English 1st Paper', 'English 2nd Paper',
                    'General Mathematics', 'Bangladesh and Global Studies', 'Information and Communication Technology',
                    'Accounting', 'Business Entrepreneurship', 'Finance and Banking', 'Religion and Moral Education'
                ]
            },
            HSC: {
                Science: [
                    'Bangla 1st Paper', 'Bangla 2nd Paper', 'English 1st Paper', 'English 2nd Paper',
                    'Information and Communication Technology', 'Physics 1st Paper', 'Physics 2nd Paper',
                    'Chemistry 1st Paper', 'Chemistry 2nd Paper', 'Biology 1st Paper', 'Biology 2nd Paper',
                    'Higher Mathematics 1st Paper', 'Higher Mathematics 2nd Paper'
                ],
                Humanities: [
                    'Bangla 1st Paper', 'Bangla 2nd Paper', 'English 1st Paper', 'English 2nd Paper',
                    'Information and Communication Technology', 'Economics 1st Paper', 'Economics 2nd Paper',
                    'History 1st Paper', 'History 2nd Paper', 'Civics and Good Governance 1st Paper',
                    'Civics and Good Governance 2nd Paper', 'Logic 1st Paper', 'Logic 2nd Paper'
                ],
                'Business Studies': [
                    'Bangla 1st Paper', 'Bangla 2nd Paper', 'English 1st Paper', 'English 2nd Paper',
                    'Information and Communication Technology', 'Accounting 1st Paper', 'Accounting 2nd Paper',
                    'Business Organization and Management 1st Paper', 'Business Organization and Management 2nd Paper',
                    'Finance, Banking and Insurance 1st Paper', 'Finance, Banking and Insurance 2nd Paper',
                    'Production Management and Marketing 1st Paper', 'Production Management and Marketing 2nd Paper'
                ]
            }
        };

        const subjectIconMap = {
            'Bangla 1st Paper': 'fa-book-open', 'Bangla 2nd Paper': 'fa-book',
            'English 1st Paper': 'fa-language', 'English 2nd Paper': 'fa-pen-nib',
            'General Mathematics': 'fa-calculator', Mathematics: 'fa-calculator',
            Physics: 'fa-atom', Chemistry: 'fa-flask', Biology: 'fa-dna',
            'Higher Mathematics': 'fa-square-root-variable', 'Higher Mathematics 1st Paper': 'fa-square-root-variable',
            'Higher Mathematics 2nd Paper': 'fa-square-root-variable', 'Bangladesh and Global Studies': 'fa-globe',
            'Information and Communication Technology': 'fa-laptop-code', Religion: 'fa-hands-praying',
            'Religion and Moral Education': 'fa-hands-praying', 'Geography and Environment': 'fa-mountain-sun',
            'History of Bangladesh and World Civilization': 'fa-landmark', 'Civics and Citizenship': 'fa-scale-balanced',
            Accounting: 'fa-receipt', 'Business Entrepreneurship': 'fa-briefcase', 'Finance and Banking': 'fa-coins',
            'Physics 1st Paper': 'fa-atom', 'Physics 2nd Paper': 'fa-atom', 'Chemistry 1st Paper': 'fa-flask',
            'Chemistry 2nd Paper': 'fa-flask', 'Biology 1st Paper': 'fa-dna', 'Biology 2nd Paper': 'fa-dna',
            'Economics 1st Paper': 'fa-chart-line', 'Economics 2nd Paper': 'fa-chart-line',
            'History 1st Paper': 'fa-landmark', 'History 2nd Paper': 'fa-landmark',
            'Civics and Good Governance 1st Paper': 'fa-scale-balanced', 'Civics and Good Governance 2nd Paper': 'fa-scale-balanced',
            'Logic 1st Paper': 'fa-lightbulb', 'Logic 2nd Paper': 'fa-lightbulb',
            'Accounting 1st Paper': 'fa-receipt', 'Accounting 2nd Paper': 'fa-receipt',
            'Business Organization and Management 1st Paper': 'fa-briefcase', 'Business Organization and Management 2nd Paper': 'fa-briefcase',
            'Finance, Banking and Insurance 1st Paper': 'fa-coins', 'Finance, Banking and Insurance 2nd Paper': 'fa-coins',
            'Production Management and Marketing 1st Paper': 'fa-industry', 'Production Management and Marketing 2nd Paper': 'fa-industry'
        };

        const accentPalette = ['bg-sky-500', 'bg-indigo-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500', 'bg-violet-500', 'bg-teal-500'];

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
                            : isEnglishFirst ? 'public-english-hsc-1st-paper'
                            : isIct ? 'public-ssc-ict'
                            : isHscIct ? 'public-hsc-ict'
                            : isSscPhysics ? 'public-ssc-physics'
                            : isSscChemistry ? 'public-ssc-chemistry'
                            : isSscBiology ? 'public-ssc-biology'
                            : isBangladeshGlobal ? 'public-ssc-bangladesh-global-studies'
                            : isReligionMoral ? 'public-ssc-religion'
                            : isHscPhysics1 ? 'public-hsc-physics-1st'
                            : isHscPhysics2 ? 'public-hsc-physics-2nd'
                            : isHscChemistry1 ? 'public-hsc-chemistry-1st'
                            : isHscChemistry2 ? 'public-hsc-chemistry-2nd'
                            : isHscBiology1 ? 'public-hsc-biology-1st'
                            : isHscBiology2 ? 'public-hsc-biology-2nd' : ''
                    });
                });
            });
            return Array.from(subjectMap.values()).map((subject) => {
                const groups = Array.from(subject.groups);
                return { ...subject, groups, groupLabel: groups.length > 1 ? 'Common' : groups[0] };
            });
        };

        const sscSubjects = buildSubjectList('SSC');
        const hscSubjects = buildSubjectList('HSC');
        const sscFeaturedSubjects = sscSubjects.slice(0, 8);
        const hscFeaturedSubjects = hscSubjects.slice(0, 8);
        const religionOptions = [
            { key: 'Islam', label: 'Islam', subtitle: 'ইসলাম' },
            { key: 'Hinduism', label: 'Hinduism', subtitle: 'হিন্দু ধর্ম' },
            { key: 'Buddhism', label: 'Buddhism', subtitle: 'বৌদ্ধ ধর্ম' },
            { key: 'Christianity', label: 'Christianity', subtitle: 'খ্রিষ্টান ধর্ম' }
        ];

        const useThumbnails = (endpoint, keyField) => {
            const [thumbnailMap, setThumbnailMap] = useState({});
            useEffect(() => {
                let isActive = true;
                const loadThumbnails = async () => {
                    try {
                        const response = await fetch(endpoint);
                        if (!response.ok) return;
                        const data = await response.json();
                        if (!isActive) return;
                        const map = (data.thumbnails || []).reduce((acc, item) => {
                            const key = item[keyField];
                            if (!key) return acc;
                            acc[key] = { url: item.url };
                            return acc;
                        }, {});
                        setThumbnailMap(map);
                    } catch (error) { console.warn('Failed to load thumbnails', error); }
                };
                loadThumbnails();
                return () => { isActive = false; };
            }, []);
            return thumbnailMap;
        };

        const READ_PROGRESS_KEY = 'freeducation.read-progress';
        const RECENT_READ_KEY = 'freeducation.recent-read';
        const VIDEO_PROGRESS_KEY = 'freeducation.video-progress';
        const RECENT_VIDEO_KEY = 'freeducation.recent-video';

        const loadVideoProgress = () => {
            try { const raw = localStorage.getItem(VIDEO_PROGRESS_KEY); return raw ? JSON.parse(raw) : {}; }
            catch (error) { console.warn('Failed to read video progress', error); return {}; }
        };

        const loadRecentVideo = () => {
            try { const raw = localStorage.getItem(RECENT_VIDEO_KEY); return raw ? JSON.parse(raw) : null; }
            catch (error) { console.warn('Failed to read recent video', error); return null; }
        };

        const storeVideoProgress = (entry) => {
            const current = loadVideoProgress();
            const updated = {
                ...current,
                [entry.id]: {
                    title: entry.title, context: entry.context, route: entry.route,
                    currentTime: entry.currentTime, duration: entry.duration, updatedAt: entry.updatedAt
                }
            };
            try {
                localStorage.setItem(VIDEO_PROGRESS_KEY, JSON.stringify(updated));
                localStorage.setItem(RECENT_VIDEO_KEY, JSON.stringify({
                    id: entry.id, title: entry.title, context: entry.context, route: entry.route,
                    currentTime: entry.currentTime, duration: entry.duration, updatedAt: entry.updatedAt
                }));
            } catch (error) { console.warn('Failed to store video progress', error); }
            return updated;
        };

        const useVideoProgress = () => {
            const [videoProgress, setVideoProgress] = useState(() => loadVideoProgress());
            const [recentVideo, setRecentVideo] = useState(() => loadRecentVideo());
            const updateVideoProgress = (entry) => {
                const timestamped = { ...entry, updatedAt: Date.now() };
                const updated = storeVideoProgress(timestamped);
                setVideoProgress(updated);
                setRecentVideo({
                    id: entry.id, title: entry.title, context: entry.context, route: entry.route,
                    currentTime: entry.currentTime, duration: entry.duration, updatedAt: timestamped.updatedAt
                });
            };
            return { videoProgress, recentVideo, updateVideoProgress };
        };

        const loadReadProgress = () => {
            try { const raw = localStorage.getItem(READ_PROGRESS_KEY); return raw ? JSON.parse(raw) : {}; }
            catch (error) { console.warn('Failed to read progress data', error); return {}; }
        };
        const loadRecentRead = () => {
            try { const raw = localStorage.getItem(RECENT_READ_KEY); return raw ? JSON.parse(raw) : null; }
            catch (error) { console.warn('Failed to read recent chapter', error); return null; }
        };
        const storeReadProgress = (entry) => {
            const current = loadReadProgress();
            const updated = { ...current, [entry.key]: { label: entry.label, subjectLabel: entry.subjectLabel, updatedAt: entry.updatedAt } };
            try {
                localStorage.setItem(READ_PROGRESS_KEY, JSON.stringify(updated));
                localStorage.setItem(RECENT_READ_KEY, JSON.stringify({ label: entry.label, route: entry.route, updatedAt: entry.updatedAt }));
            } catch (error) { console.warn('Failed to store reading progress', error); }
            return updated;
        };
        const storeBanglaSelection = ({ classLabel, categoryName, itemName }) => {
            try { localStorage.setItem('freeducation.bangla-selection', JSON.stringify({ classLabel, categoryName, itemName })); }
            catch (error) { console.warn('Failed to store Bangla selection', error); }
        };
        const getLastReadForSubject = (readMap, subjectLabel) => {
            const entries = Object.values(readMap || {}).filter((entry) => entry.subjectLabel === subjectLabel);
            if (entries.length === 0) return '';
            entries.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
            return entries[0]?.label || '';
        };
        const useReadingProgress = () => {
            const [readMap, setReadMap] = useState(() => loadReadProgress());
            const [recentRead, setRecentRead] = useState(() => loadRecentRead());
            const markRead = (entry) => {
                const timestamped = { ...entry, updatedAt: Date.now() };
                const updated = storeReadProgress(timestamped);
                setReadMap(updated);
                setRecentRead({ label: entry.label, route: entry.route, updatedAt: timestamped.updatedAt });
            };
            return { readMap, recentRead, markRead };
        };
`;
