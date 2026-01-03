export const mainApp = `
        function App() {
            const viewToPath = {
                landing: '/',
                'ssc-subjects': '/ssc',
                'hsc-subjects': '/hsc',
                'public-bangla-ssc-1st-paper': '/ssc/bangla-1st-paper',
                'public-bangla-hsc-1st-paper': '/hsc/bangla-1st-paper',
                'public-bangla-ssc-shahitto': '/ssc/bangla-1st-paper/shahitto',
                'public-bangla-hsc-shahitto': '/hsc/bangla-1st-paper/shahitto',
                'public-bangla-ssc-shohopath': '/ssc/bangla-1st-paper/shohopath',
                'public-bangla-hsc-shohopath': '/hsc/bangla-1st-paper/shohopath',
                'public-bangla-ssc-goddo': '/ssc/bangla-1st-paper/goddo',
                'public-bangla-ssc-poddo': '/ssc/bangla-1st-paper/poddo',
                'public-bangla-hsc-goddo': '/hsc/bangla-1st-paper/goddo',
                'public-bangla-hsc-poddo': '/hsc/bangla-1st-paper/poddo',
                'public-bangla-ssc-item': '/ssc/bangla-1st-paper/item',
                'public-bangla-hsc-item': '/hsc/bangla-1st-paper/item',
                'public-bangla-ssc-srijonshil': '/ssc/bangla-1st-paper/item/srijonshil',
                'public-bangla-hsc-srijonshil': '/hsc/bangla-1st-paper/item/srijonshil',
                'public-bangla-ssc-mcq': '/ssc/bangla-1st-paper/item/mcq',
                'public-bangla-hsc-mcq': '/hsc/bangla-1st-paper/item/mcq',
                'public-english-hsc-1st-paper': '/hsc/english-1st-paper',
                'public-english-hsc-reading': '/hsc/english-1st-paper/reading',
                'public-english-hsc-writing': '/hsc/english-1st-paper/writing',
                'public-english-hsc-subtypes': '/hsc/english-1st-paper/subtypes',
                'public-english-hsc-questions': '/hsc/english-1st-paper/questions',
                login: '/login',
                register: '/register',
                dashboard: '/dashboard',
                'admin-groups-ssc': '/dashboard/ssc',
                'admin-groups-hsc': '/dashboard/hsc',
                'admin-ssc-science': '/dashboard/ssc/science',
                'admin-ssc-humanities': '/dashboard/ssc/humanities',
                'admin-ssc-business-studies': '/dashboard/ssc/business-studies',
                'admin-hsc-science': '/dashboard/hsc/science',
                'admin-hsc-humanities': '/dashboard/hsc/humanities',
                'admin-hsc-business-studies': '/dashboard/hsc/business-studies',
                'admin-settings': '/dashboard/settings',
                'bangla-ssc-1st-paper': '/dashboard/ssc/bangla-1st-paper',
                'bangla-hsc-1st-paper': '/dashboard/hsc/bangla-1st-paper',
                'bangla-ssc-shahitto': '/dashboard/ssc/bangla-1st-paper/shahitto',
                'bangla-hsc-shahitto': '/dashboard/hsc/bangla-1st-paper/shahitto',
                'bangla-ssc-shohopath': '/dashboard/ssc/bangla-1st-paper/shohopath',
                'bangla-hsc-shohopath': '/dashboard/hsc/bangla-1st-paper/shohopath',
                'bangla-ssc-goddo': '/dashboard/ssc/bangla-1st-paper/goddo',
                'bangla-ssc-poddo': '/dashboard/ssc/bangla-1st-paper/poddo',
                'bangla-hsc-goddo': '/dashboard/hsc/bangla-1st-paper/goddo',
                'bangla-hsc-poddo': '/dashboard/hsc/bangla-1st-paper/poddo',
                'bangla-ssc-item': '/dashboard/ssc/bangla-1st-paper/item',
                'bangla-hsc-item': '/dashboard/hsc/bangla-1st-paper/item',
                'bangla-ssc-srijonshil-types': '/dashboard/ssc/bangla-1st-paper/item/srijonshil',
                'bangla-hsc-srijonshil-types': '/dashboard/hsc/bangla-1st-paper/item/srijonshil',
                'bangla-ssc-srijonshil-questions': '/dashboard/ssc/bangla-1st-paper/item/srijonshil/questions',
                'bangla-hsc-srijonshil-questions': '/dashboard/hsc/bangla-1st-paper/item/srijonshil/questions',
                'bangla-ssc-mcq': '/dashboard/ssc/bangla-1st-paper/item/mcq',
                'bangla-hsc-mcq': '/dashboard/hsc/bangla-1st-paper/item/mcq',
                'english-hsc-1st-paper': '/dashboard/hsc/english-1st-paper',
                'english-hsc-reading': '/dashboard/hsc/english-1st-paper/reading',
                'english-hsc-writing': '/dashboard/hsc/english-1st-paper/writing',
                'english-hsc-subtypes': '/dashboard/hsc/english-1st-paper/subtypes',
                'english-hsc-questions': '/dashboard/hsc/english-1st-paper/questions'
            };
            const getViewFromPath = (path) => {
                if (path.startsWith('/hsc/english-1st-paper/questions')) return 'public-english-hsc-questions';
                if (path.startsWith('/hsc/english-1st-paper/subtypes')) return 'public-english-hsc-subtypes';
                if (path.startsWith('/hsc/english-1st-paper/reading')) return 'public-english-hsc-reading';
                if (path.startsWith('/hsc/english-1st-paper/writing')) return 'public-english-hsc-writing';
                if (path.startsWith('/hsc/english-1st-paper')) return 'public-english-hsc-1st-paper';
                if (path.startsWith('/ssc/bangla-1st-paper/item/srijonshil')) return 'public-bangla-ssc-srijonshil';
                if (path.startsWith('/hsc/bangla-1st-paper/item/srijonshil')) return 'public-bangla-hsc-srijonshil';
                if (path.startsWith('/ssc/bangla-1st-paper/item/mcq')) return 'public-bangla-ssc-mcq';
                if (path.startsWith('/hsc/bangla-1st-paper/item/mcq')) return 'public-bangla-hsc-mcq';
                if (path.startsWith('/ssc/bangla-1st-paper/item')) return 'public-bangla-ssc-item';
                if (path.startsWith('/hsc/bangla-1st-paper/item')) return 'public-bangla-hsc-item';
                if (path.startsWith('/ssc/bangla-1st-paper/goddo')) return 'public-bangla-ssc-goddo';
                if (path.startsWith('/ssc/bangla-1st-paper/poddo')) return 'public-bangla-ssc-poddo';
                if (path.startsWith('/hsc/bangla-1st-paper/goddo')) return 'public-bangla-hsc-goddo';
                if (path.startsWith('/hsc/bangla-1st-paper/poddo')) return 'public-bangla-hsc-poddo';
                if (path.startsWith('/ssc/bangla-1st-paper/shohopath')) return 'public-bangla-ssc-shohopath';
                if (path.startsWith('/hsc/bangla-1st-paper/shohopath')) return 'public-bangla-hsc-shohopath';
                if (path.startsWith('/ssc/bangla-1st-paper/shahitto')) return 'public-bangla-ssc-shahitto';
                if (path.startsWith('/hsc/bangla-1st-paper/shahitto')) return 'public-bangla-hsc-shahitto';
                if (path.startsWith('/ssc/bangla-1st-paper')) return 'public-bangla-ssc-1st-paper';
                if (path.startsWith('/hsc/bangla-1st-paper')) return 'public-bangla-hsc-1st-paper';
                if (path.startsWith('/ssc')) return 'ssc-subjects';
                if (path.startsWith('/hsc')) return 'hsc-subjects';
                if (path.startsWith('/login')) return 'login';
                if (path.startsWith('/register')) return 'register';
                if (path.startsWith('/dashboard/settings')) return 'admin-settings';
                if (path.startsWith('/dashboard/hsc/english-1st-paper/questions')) return 'english-hsc-questions';
                if (path.startsWith('/dashboard/hsc/english-1st-paper/subtypes')) return 'english-hsc-subtypes';
                if (path.startsWith('/dashboard/hsc/english-1st-paper/reading')) return 'english-hsc-reading';
                if (path.startsWith('/dashboard/hsc/english-1st-paper/writing')) return 'english-hsc-writing';
                if (path.startsWith('/dashboard/hsc/english-1st-paper')) return 'english-hsc-1st-paper';
                if (path.startsWith('/dashboard/ssc/bangla-1st-paper/item/srijonshil/questions')) return 'bangla-ssc-srijonshil-questions';
                if (path.startsWith('/dashboard/hsc/bangla-1st-paper/item/srijonshil/questions')) return 'bangla-hsc-srijonshil-questions';
                if (path.startsWith('/dashboard/ssc/bangla-1st-paper/item/srijonshil')) return 'bangla-ssc-srijonshil-types';
                if (path.startsWith('/dashboard/hsc/bangla-1st-paper/item/srijonshil')) return 'bangla-hsc-srijonshil-types';
                if (path.startsWith('/dashboard/ssc/bangla-1st-paper/item/mcq')) return 'bangla-ssc-mcq';
                if (path.startsWith('/dashboard/hsc/bangla-1st-paper/item/mcq')) return 'bangla-hsc-mcq';
                if (path.startsWith('/dashboard/ssc/bangla-1st-paper/item')) return 'bangla-ssc-item';
                if (path.startsWith('/dashboard/hsc/bangla-1st-paper/item')) return 'bangla-hsc-item';
                if (path.startsWith('/dashboard/ssc/bangla-1st-paper/goddo')) return 'bangla-ssc-goddo';
                if (path.startsWith('/dashboard/ssc/bangla-1st-paper/poddo')) return 'bangla-ssc-poddo';
                if (path.startsWith('/dashboard/ssc/bangla-1st-paper/natok') || path.startsWith('/dashboard/ssc/bangla-1st-paper/upannyas')) {
                    return 'bangla-ssc-shohopath';
                }
                if (path.startsWith('/dashboard/hsc/bangla-1st-paper/goddo')) return 'bangla-hsc-goddo';
                if (path.startsWith('/dashboard/hsc/bangla-1st-paper/poddo')) return 'bangla-hsc-poddo';
                if (path.startsWith('/dashboard/hsc/bangla-1st-paper/natok') || path.startsWith('/dashboard/hsc/bangla-1st-paper/upannyas')) {
                    return 'bangla-hsc-shohopath';
                }
                if (path.startsWith('/dashboard/ssc/bangla-1st-paper/shohopath')) return 'bangla-ssc-shohopath';
                if (path.startsWith('/dashboard/hsc/bangla-1st-paper/shohopath')) return 'bangla-hsc-shohopath';
                if (path.startsWith('/dashboard/ssc/bangla-1st-paper/shahitto')) return 'bangla-ssc-shahitto';
                if (path.startsWith('/dashboard/hsc/bangla-1st-paper/shahitto')) return 'bangla-hsc-shahitto';
                if (path.startsWith('/dashboard/ssc/bangla-1st-paper')) return 'bangla-ssc-1st-paper';
                if (path.startsWith('/dashboard/hsc/bangla-1st-paper')) return 'bangla-hsc-1st-paper';
                if (path.startsWith('/dashboard/ssc/science')) return 'admin-ssc-science';
                if (path.startsWith('/dashboard/ssc/humanities')) return 'admin-ssc-humanities';
                if (path.startsWith('/dashboard/ssc/business-studies')) return 'admin-ssc-business-studies';
                if (path.startsWith('/dashboard/hsc/science')) return 'admin-hsc-science';
                if (path.startsWith('/dashboard/hsc/humanities')) return 'admin-hsc-humanities';
                if (path.startsWith('/dashboard/hsc/business-studies')) return 'admin-hsc-business-studies';
                if (path.startsWith('/dashboard/ssc')) return 'admin-groups-ssc';
                if (path.startsWith('/dashboard/hsc')) return 'admin-groups-hsc';
                if (path.startsWith('/dashboard')) return 'dashboard';
                return 'landing';
            };
            const initialView = window.__INITIAL_VIEW || getViewFromPath(window.location.pathname);
            const [view, setView] = useState(initialView);
            const [isLoading, setIsLoading] = useState(true);
            const [user, setUser] = useState(null);
            const [hasAdmin, setHasAdmin] = useState(null);
            const [selectedBanglaItem, setSelectedBanglaItem] = useState('');
            const [selectedBanglaCategory, setSelectedBanglaCategory] = useState('');
            const [selectedSrijonshilType, setSelectedSrijonshilType] = useState(null);
            const [selectedEnglishSection, setSelectedEnglishSection] = useState('');
            const [selectedEnglishType, setSelectedEnglishType] = useState(null);
            const [selectedEnglishSubtype, setSelectedEnglishSubtype] = useState(null);
            const [sscGoddoItems, setSscGoddoItems] = useState([]);
            const [sscPoddoItems, setSscPoddoItems] = useState([]);
            const [hscGoddoItems, setHscGoddoItems] = useState([]);
            const [hscPoddoItems, setHscPoddoItems] = useState([]);
            const [sscShohopathItems, setSscShohopathItems] = useState([]);
            const [hscShohopathItems, setHscShohopathItems] = useState([]);
            const [srijonshilQuestions, setSrijonshilQuestions] = useState({});
            const [mcqQuestions, setMcqQuestions] = useState({});
            const [englishQuestions, setEnglishQuestions] = useState({});
            const [notesByItem, setNotesByItem] = useState({});
            const [contentLoaded, setContentLoaded] = useState(false);

            const getQuestionKey = (classLabel, categoryName, itemName, extra = '') => {
                return [classLabel, categoryName || 'general', itemName || 'general', extra].join('-');
            };
            const getEnglishQuestionKey = (section, typeKey, subtypeKey) => {
                return ['HSC', section || 'general', typeKey || 'general', subtypeKey || 'general'].join('-');
            };

            const defaultContent = {
                sscGoddoItems: [],
                sscPoddoItems: [],
                hscGoddoItems: [],
                hscPoddoItems: [],
                sscShohopathItems: [],
                hscShohopathItems: [],
                srijonshilQuestions: {},
                mcqQuestions: {},
                englishQuestions: {},
                notesByItem: {}
            };

            const applyContentState = (content) => {
                const merged = { ...defaultContent, ...(content || {}) };
                setSscGoddoItems(Array.isArray(merged.sscGoddoItems) ? merged.sscGoddoItems : []);
                setSscPoddoItems(Array.isArray(merged.sscPoddoItems) ? merged.sscPoddoItems : []);
                setHscGoddoItems(Array.isArray(merged.hscGoddoItems) ? merged.hscGoddoItems : []);
                setHscPoddoItems(Array.isArray(merged.hscPoddoItems) ? merged.hscPoddoItems : []);
                setSscShohopathItems(Array.isArray(merged.sscShohopathItems) ? merged.sscShohopathItems : []);
                setHscShohopathItems(Array.isArray(merged.hscShohopathItems) ? merged.hscShohopathItems : []);
                setSrijonshilQuestions(merged.srijonshilQuestions || {});
                setMcqQuestions(merged.mcqQuestions || {});
                setEnglishQuestions(merged.englishQuestions || {});
                setNotesByItem(merged.notesByItem || {});
            };

            const getBanglaTopics = (classLabel) => [
                {
                    title: 'বাংলা সাহিত্য',
                    description: 'গদ্য ও পদ্য অধ্যায় সমূহ',
                    route: classLabel === 'SSC' ? 'public-bangla-ssc-shahitto' : 'public-bangla-hsc-shahitto'
                },
                {
                    title: 'সহপাঠ',
                    description: 'নাটক ও উপন্যাস ভিত্তিক পাঠ',
                    route: classLabel === 'SSC' ? 'public-bangla-ssc-shohopath' : 'public-bangla-hsc-shohopath'
                }
            ];

            const getBanglaShahittoTopics = (classLabel) => [
                {
                    title: 'গদ্য',
                    description: 'গদ্য অধ্যায় সমূহ',
                    route: classLabel === 'SSC' ? 'public-bangla-ssc-goddo' : 'public-bangla-hsc-goddo'
                },
                {
                    title: 'পদ্য',
                    description: 'পদ্য অধ্যায় সমূহ',
                    route: classLabel === 'SSC' ? 'public-bangla-ssc-poddo' : 'public-bangla-hsc-poddo'
                }
            ];

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
                ? `${selectedEnglishSection} section questions`
                : 'English 1st Paper questions';

            const addQuestionEntry = (setter, key) => (entry) => {
                setter((prev) => {
                    const updated = prev[key] ? [...prev[key]] : [];
                    updated.push(entry);
                    return { ...prev, [key]: updated };
                });
            };

            const updateQuestionEntry = (setter, key) => (index, entry) => {
                setter((prev) => {
                    const updated = prev[key] ? [...prev[key]] : [];
                    updated[index] = entry;
                    return { ...prev, [key]: updated };
                });
            };

            const removeQuestionEntry = (setter, key) => (index) => {
                setter((prev) => {
                    const updated = prev[key] ? [...prev[key]] : [];
                    updated.splice(index, 1);
                    return { ...prev, [key]: updated };
                });
            };

            const addStringItem = (setItems) => (value) => {
                setItems((prev) => [...prev, value]);
            };

            const updateStringItem = (setItems) => (prevValue, nextValue) => {
                setItems((prev) => prev.map((item) => (item === prevValue ? nextValue : item)));
            };

            const removeStringItem = (setItems) => (value) => {
                setItems((prev) => prev.filter((item) => item !== value));
            };

            const addShohopathItem = (setItems) => (nextItem) => {
                setItems((prev) => [...prev, nextItem]);
            };

            const updateShohopathItem = (setItems) => (itemId, updates) => {
                setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, ...updates } : item)));
            };

            const removeShohopathItem = (setItems) => (itemId) => {
                setItems((prev) => prev.filter((item) => item.id !== itemId));
            };

            const syncRoutesFromLocation = () => {
                const { pathname } = window.location;
                setView(getViewFromPath(pathname));
            };

            const navigate = (nextView, options = {}) => {
                const { replace = false } = options;
                setView(nextView);
                const nextPath = viewToPath[nextView] || '/';
                if (window.location.pathname !== nextPath) {
                    const method = replace ? 'replaceState' : 'pushState';
                    window.history[method]({ view: nextView }, '', nextPath);
                }
            };

            useEffect(() => {
                const handlePopState = () => {
                    syncRoutesFromLocation();
                };
                window.addEventListener('popstate', handlePopState);
                return () => window.removeEventListener('popstate', handlePopState);
            }, []);

            // 1. Initial System Check & Session Restore
            useEffect(() => {
                const initSystem = async () => {
                    // A. Check Setup Status
                    await fetch('/api/init', { method: 'POST' });
                    const res = await fetch('/api/setup-status');
                    const data = await res.json();
                    setHasAdmin(data.hasAdmin);

                    // B. Try to Restore Session
                    const token = localStorage.getItem('auth_token');
                    if (token) {
                        try {
                            const meRes = await fetch('/api/me', {
                                headers: { 'Authorization': 'Bearer ' + token }
                            });
                            const meData = await meRes.json();
                            if (meData.user) {
                                setUser(meData.user);
                            } else {
                                // Invalid token
                                localStorage.removeItem('auth_token');
                            }
                        } catch (e) {
                            localStorage.removeItem('auth_token');
                        }
                    }

                    if (data.hasAdmin && view === 'register') {
                        navigate('login', { replace: true });
                    }
                    if (!data.hasAdmin && view === 'login') {
                        navigate('register', { replace: true });
                    }
                    if (!token && (view === 'dashboard' || view.startsWith('admin-groups') || view === 'admin-settings')) {
                        navigate('landing', { replace: true });
                    }
                    setIsLoading(false);
                };
                initSystem();
            }, []);

            useEffect(() => {
                const loadContent = async () => {
                    try {
                        const response = await fetch('/api/content');
                        const data = await response.json();
                        if (data.success && data.content) {
                            applyContentState(data.content);
                        }
                    } catch (e) {
                        console.warn('Failed to load content', e);
                    } finally {
                        setContentLoaded(true);
                    }
                };
                loadContent();
            }, []);

            useEffect(() => {
                if (!contentLoaded) return;
                if (!user || user.role !== 'admin') return;
                const token = localStorage.getItem('auth_token');
                if (!token) return;

                const payload = {
                    sscGoddoItems,
                    sscPoddoItems,
                    hscGoddoItems,
                    hscPoddoItems,
                    sscShohopathItems,
                    hscShohopathItems,
                    srijonshilQuestions,
                    mcqQuestions,
                    englishQuestions,
                    notesByItem
                };

                const timeout = setTimeout(async () => {
                    try {
                        await fetch('/api/content', {
                            method: 'PUT',
                            headers: {
                                'Authorization': 'Bearer ' + token,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(payload)
                        });
                    } catch (e) {
                        console.warn('Failed to save content', e);
                    }
                }, 600);

                return () => clearTimeout(timeout);
            }, [
                contentLoaded,
                user,
                sscGoddoItems,
                sscPoddoItems,
                hscGoddoItems,
                hscPoddoItems,
                sscShohopathItems,
                hscShohopathItems,
                srijonshilQuestions,
                mcqQuestions,
                englishQuestions,
                notesByItem
            ]);

            const handleLogin = async (username, password) => {
                const res = await fetch('/api/login', {
                    method: 'POST',
                    body: JSON.stringify({ username, password })
                });
                const data = await res.json();
                if (data.success) {
                    // SAVE TOKEN!
                    localStorage.setItem('auth_token', data.token);
                    setUser({
                        username: data.username,
                        role: data.role,
                        permissions: data.permissions || [],
                        assignment: data.assignment || null
                    });
                    navigate('dashboard');
                } else {
                    alert(data.error);
                }
            };

            const handleLogout = () => {
                localStorage.removeItem('auth_token');
                setUser(null);
                navigate('landing');
            };

            const handleRegister = async (username, password) => {
                const res = await fetch('/api/register-admin', {
                    method: 'POST',
                    body: JSON.stringify({ username, password })
                });
                const data = await res.json();
                if (data.success) {
                    alert("Account created successfully. Please login.");
                    setHasAdmin(true);
                    navigate('login');
                } else {
                    alert(data.error);
                }
            };

            if (isLoading || hasAdmin === null) return <Loading />;

            return (
                <div className="min-h-screen flex flex-col">
                    <NavBar user={user} hasAdmin={hasAdmin} onNavigate={navigate} onLogout={handleLogout} />
                    <main className="flex-grow bg-gray-50 flex flex-col">
                        {view === 'landing' && <StudentLanding onNavigate={navigate} />}
                        {view === 'ssc-subjects' && (
                            <SubjectIndexPage classLabel="SSC" subjects={sscSubjects} onNavigate={navigate} />
                        )}
                        {view === 'hsc-subjects' && (
                            <SubjectIndexPage classLabel="HSC" subjects={hscSubjects} onNavigate={navigate} />
                        )}
                        {view === 'public-bangla-ssc-1st-paper' && (
                            <PublicBanglaShell
                                title="বাংলা ১ম পত্র"
                                subtitle="SSC শ্রেণির পাঠ তালিকা নির্বাচন করুন।"
                                onBack={() => navigate('ssc-subjects')}
                                onNavigate={navigate}
                            >
                                <PublicBanglaTopicGrid topics={getBanglaTopics('SSC')} onNavigate={navigate} />
                            </PublicBanglaShell>
                        )}
                        {view === 'public-bangla-hsc-1st-paper' && (
                            <PublicBanglaShell
                                title="বাংলা ১ম পত্র"
                                subtitle="HSC শ্রেণির পাঠ তালিকা নির্বাচন করুন।"
                                onBack={() => navigate('hsc-subjects')}
                                onNavigate={navigate}
                            >
                                <PublicBanglaTopicGrid topics={getBanglaTopics('HSC')} onNavigate={navigate} />
                            </PublicBanglaShell>
                        )}
                        {view === 'public-bangla-ssc-shahitto' && (
                            <PublicBanglaShell
                                title="বাংলা সাহিত্য"
                                subtitle="গদ্য ও পদ্য অধ্যায় নির্বাচন করুন।"
                                onBack={() => navigate('public-bangla-ssc-1st-paper')}
                                onNavigate={navigate}
                            >
                                <PublicBanglaTopicGrid topics={getBanglaShahittoTopics('SSC')} onNavigate={navigate} />
                            </PublicBanglaShell>
                        )}
                        {view === 'public-bangla-hsc-shahitto' && (
                            <PublicBanglaShell
                                title="বাংলা সাহিত্য"
                                subtitle="গদ্য ও পদ্য অধ্যায় নির্বাচন করুন।"
                                onBack={() => navigate('public-bangla-hsc-1st-paper')}
                                onNavigate={navigate}
                            >
                                <PublicBanglaTopicGrid topics={getBanglaShahittoTopics('HSC')} onNavigate={navigate} />
                            </PublicBanglaShell>
                        )}
                        {view === 'public-bangla-ssc-goddo' && (
                            <PublicBanglaShell
                                title="গদ্য"
                                subtitle="SSC গদ্য পাঠের তালিকা।"
                                onBack={() => navigate('public-bangla-ssc-shahitto')}
                                onNavigate={navigate}
                            >
                                <PublicBanglaTextList
                                    title="গদ্য পাঠসমূহ"
                                    subtitle="আপনার পছন্দের পাঠ নির্বাচন করুন।"
                                    items={sscGoddoItems}
                                    onSelectItem={(item) => {
                                        setSelectedBanglaItem(item);
                                        setSelectedBanglaCategory('গদ্য');
                                        navigate('public-bangla-ssc-item');
                                    }}
                                />
                            </PublicBanglaShell>
                        )}
                        {view === 'public-bangla-ssc-poddo' && (
                            <PublicBanglaShell
                                title="পদ্য"
                                subtitle="SSC পদ্য পাঠের তালিকা।"
                                onBack={() => navigate('public-bangla-ssc-shahitto')}
                                onNavigate={navigate}
                            >
                                <PublicBanglaTextList
                                    title="পদ্য পাঠসমূহ"
                                    subtitle="আপনার পছন্দের পাঠ নির্বাচন করুন।"
                                    items={sscPoddoItems}
                                    onSelectItem={(item) => {
                                        setSelectedBanglaItem(item);
                                        setSelectedBanglaCategory('পদ্য');
                                        navigate('public-bangla-ssc-item');
                                    }}
                                />
                            </PublicBanglaShell>
                        )}
                        {view === 'public-bangla-hsc-goddo' && (
                            <PublicBanglaShell
                                title="গদ্য"
                                subtitle="HSC গদ্য পাঠের তালিকা।"
                                onBack={() => navigate('public-bangla-hsc-shahitto')}
                                onNavigate={navigate}
                            >
                                <PublicBanglaTextList
                                    title="গদ্য পাঠসমূহ"
                                    subtitle="আপনার পছন্দের পাঠ নির্বাচন করুন।"
                                    items={hscGoddoItems}
                                    onSelectItem={(item) => {
                                        setSelectedBanglaItem(item);
                                        setSelectedBanglaCategory('গদ্য');
                                        navigate('public-bangla-hsc-item');
                                    }}
                                />
                            </PublicBanglaShell>
                        )}
                        {view === 'public-bangla-hsc-poddo' && (
                            <PublicBanglaShell
                                title="পদ্য"
                                subtitle="HSC পদ্য পাঠের তালিকা।"
                                onBack={() => navigate('public-bangla-hsc-shahitto')}
                                onNavigate={navigate}
                            >
                                <PublicBanglaTextList
                                    title="পদ্য পাঠসমূহ"
                                    subtitle="আপনার পছন্দের পাঠ নির্বাচন করুন।"
                                    items={hscPoddoItems}
                                    onSelectItem={(item) => {
                                        setSelectedBanglaItem(item);
                                        setSelectedBanglaCategory('পদ্য');
                                        navigate('public-bangla-hsc-item');
                                    }}
                                />
                            </PublicBanglaShell>
                        )}
                        {view === 'public-bangla-ssc-shohopath' && (
                            <PublicBanglaShell
                                title="সহপাঠ"
                                subtitle="SSC সহপাঠ তালিকা নির্বাচন করুন।"
                                onBack={() => navigate('public-bangla-ssc-1st-paper')}
                                onNavigate={navigate}
                            >
                                <PublicBanglaShohopathList
                                    items={sscShohopathItems}
                                    onSelectItem={(item) => {
                                        setSelectedBanglaItem(item.name);
                                        setSelectedBanglaCategory(item.type);
                                        navigate('public-bangla-ssc-item');
                                    }}
                                />
                            </PublicBanglaShell>
                        )}
                        {view === 'public-bangla-hsc-shohopath' && (
                            <PublicBanglaShell
                                title="সহপাঠ"
                                subtitle="HSC সহপাঠ তালিকা নির্বাচন করুন।"
                                onBack={() => navigate('public-bangla-hsc-1st-paper')}
                                onNavigate={navigate}
                            >
                                <PublicBanglaShohopathList
                                    items={hscShohopathItems}
                                    onSelectItem={(item) => {
                                        setSelectedBanglaItem(item.name);
                                        setSelectedBanglaCategory(item.type);
                                        navigate('public-bangla-hsc-item');
                                    }}
                                />
                            </PublicBanglaShell>
                        )}
                        {view === 'public-bangla-ssc-item' && (
                            <PublicBanglaItemDetail
                                classLabel="SSC"
                                itemName={selectedBanglaItem}
                                categoryName={selectedBanglaCategory}
                                notesByItem={notesByItem}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-bangla-hsc-item' && (
                            <PublicBanglaItemDetail
                                classLabel="HSC"
                                itemName={selectedBanglaItem}
                                categoryName={selectedBanglaCategory}
                                notesByItem={notesByItem}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-bangla-ssc-srijonshil' && (
                            <PublicBanglaSrijonshilDetail
                                classLabel="SSC"
                                itemName={selectedBanglaItem}
                                categoryName={selectedBanglaCategory}
                                srijonshilQuestions={srijonshilQuestions}
                                getQuestionKey={getQuestionKey}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-bangla-hsc-srijonshil' && (
                            <PublicBanglaSrijonshilDetail
                                classLabel="HSC"
                                itemName={selectedBanglaItem}
                                categoryName={selectedBanglaCategory}
                                srijonshilQuestions={srijonshilQuestions}
                                getQuestionKey={getQuestionKey}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-bangla-ssc-mcq' && (
                            <PublicBanglaMcqDetail
                                classLabel="SSC"
                                itemName={selectedBanglaItem}
                                categoryName={selectedBanglaCategory}
                                mcqQuestions={mcqQuestions}
                                getQuestionKey={getQuestionKey}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-bangla-hsc-mcq' && (
                            <PublicBanglaMcqDetail
                                classLabel="HSC"
                                itemName={selectedBanglaItem}
                                categoryName={selectedBanglaCategory}
                                mcqQuestions={mcqQuestions}
                                getQuestionKey={getQuestionKey}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-english-hsc-1st-paper' && (
                            <PublicEnglishShell
                                title="English 1st Paper"
                                subtitle="Select Reading or Writing to explore HSC English 1st Paper."
                                onBack={() => navigate('hsc-subjects')}
                                onNavigate={navigate}
                            >
                                <PublicEnglishCardGrid
                                    items={[
                                        {
                                            key: 'reading',
                                            title: 'Reading',
                                            description: 'MCQ, comprehension, and passage-based tasks.',
                                            route: 'public-english-hsc-reading'
                                        },
                                        {
                                            key: 'writing',
                                            title: 'Writing',
                                            description: 'Paragraphs, stories, letters, and analysis tasks.',
                                            route: 'public-english-hsc-writing'
                                        }
                                    ]}
                                    onNavigate={navigate}
                                />
                            </PublicEnglishShell>
                        )}
                        {view === 'public-english-hsc-reading' && (
                            <PublicEnglishShell
                                title="Reading"
                                subtitle="Choose a question type from the reading section."
                                onBack={() => navigate('public-english-hsc-1st-paper')}
                                onNavigate={navigate}
                            >
                                <PublicEnglishTypeList
                                    items={englishReadingTypes}
                                    onSelect={(item) => {
                                        setSelectedEnglishSection('Reading');
                                        setSelectedEnglishType(item);
                                        setSelectedEnglishSubtype(null);
                                        if (item.children?.length) {
                                            navigate('public-english-hsc-subtypes');
                                        } else {
                                            navigate('public-english-hsc-questions');
                                        }
                                    }}
                                />
                            </PublicEnglishShell>
                        )}
                        {view === 'public-english-hsc-writing' && (
                            <PublicEnglishShell
                                title="Writing"
                                subtitle="Choose a question type from the writing section."
                                onBack={() => navigate('public-english-hsc-1st-paper')}
                                onNavigate={navigate}
                            >
                                <PublicEnglishTypeList
                                    items={englishWritingTypes}
                                    onSelect={(item) => {
                                        setSelectedEnglishSection('Writing');
                                        setSelectedEnglishType(item);
                                        setSelectedEnglishSubtype(null);
                                        if (item.children?.length) {
                                            navigate('public-english-hsc-subtypes');
                                        } else {
                                            navigate('public-english-hsc-questions');
                                        }
                                    }}
                                />
                            </PublicEnglishShell>
                        )}
                        {view === 'public-english-hsc-subtypes' && (
                            <PublicEnglishShell
                                title={selectedEnglishType?.label || 'Question type'}
                                subtitle="Select a specific option to view questions."
                                onBack={() =>
                                    navigate(
                                        selectedEnglishSection === 'Writing'
                                            ? 'public-english-hsc-writing'
                                            : 'public-english-hsc-reading'
                                    )
                                }
                                onNavigate={navigate}
                            >
                                <PublicEnglishTypeList
                                    items={selectedEnglishType?.children || []}
                                    onSelect={(child) => {
                                        setSelectedEnglishSubtype(child);
                                        navigate('public-english-hsc-questions');
                                    }}
                                />
                            </PublicEnglishShell>
                        )}
                        {view === 'public-english-hsc-questions' && (
                            <PublicEnglishShell
                                title={englishQuestionTitle}
                                subtitle={englishQuestionSubtitle}
                                onBack={() =>
                                    navigate(
                                        selectedEnglishType?.children?.length
                                            ? 'public-english-hsc-subtypes'
                                            : selectedEnglishSection === 'Writing'
                                                ? 'public-english-hsc-writing'
                                                : 'public-english-hsc-reading'
                                    )
                                }
                                onNavigate={navigate}
                            >
                                <PublicEnglishQuestionList questions={englishQuestionEntries} />
                            </PublicEnglishShell>
                        )}
                        {view === 'login' && <AuthForm mode="login" onSubmit={handleLogin} />}
                        {view === 'register' && <AuthForm mode="register" onSubmit={handleRegister} />}
                        {view === 'dashboard' && <AdminDashboard onNavigate={navigate} />}
                        {view === 'admin-groups-ssc' && (
                            <AdminGroupSelection classLabel="SSC" onNavigate={navigate} />
                        )}
                        {view === 'admin-groups-hsc' && (
                            <AdminGroupSelection classLabel="HSC" onNavigate={navigate} />
                        )}
                        {view === 'admin-ssc-science' && (
                            <AdminGroupDetail classLabel="SSC" groupLabel="Science" onNavigate={navigate} />
                        )}
                        {view === 'admin-ssc-humanities' && (
                            <AdminGroupDetail classLabel="SSC" groupLabel="Humanities" onNavigate={navigate} />
                        )}
                        {view === 'admin-ssc-business-studies' && (
                            <AdminGroupDetail classLabel="SSC" groupLabel="Business Studies" onNavigate={navigate} />
                        )}
                        {view === 'admin-hsc-science' && (
                            <AdminGroupDetail classLabel="HSC" groupLabel="Science" onNavigate={navigate} />
                        )}
                        {view === 'admin-hsc-humanities' && (
                            <AdminGroupDetail classLabel="HSC" groupLabel="Humanities" onNavigate={navigate} />
                        )}
                        {view === 'admin-hsc-business-studies' && (
                            <AdminGroupDetail classLabel="HSC" groupLabel="Business Studies" onNavigate={navigate} />
                        )}
                        {view === 'english-hsc-1st-paper' && (
                            <EnglishFirstPaperHome classLabel="HSC" onNavigate={navigate} />
                        )}
                        {view === 'english-hsc-reading' && (
                            <EnglishSectionList
                                title="Reading"
                                subtitle="Select a reading question type."
                                items={englishReadingTypes}
                                onBack={() => navigate('english-hsc-1st-paper')}
                                onSelect={(item) => {
                                    setSelectedEnglishSection('Reading');
                                    setSelectedEnglishType(item);
                                    setSelectedEnglishSubtype(null);
                                    if (item.children?.length) {
                                        navigate('english-hsc-subtypes');
                                    } else {
                                        navigate('english-hsc-questions');
                                    }
                                }}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'english-hsc-writing' && (
                            <EnglishSectionList
                                title="Writing"
                                subtitle="Select a writing question type."
                                items={englishWritingTypes}
                                onBack={() => navigate('english-hsc-1st-paper')}
                                onSelect={(item) => {
                                    setSelectedEnglishSection('Writing');
                                    setSelectedEnglishType(item);
                                    setSelectedEnglishSubtype(null);
                                    if (item.children?.length) {
                                        navigate('english-hsc-subtypes');
                                    } else {
                                        navigate('english-hsc-questions');
                                    }
                                }}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'english-hsc-subtypes' && (
                            <EnglishSectionList
                                title={selectedEnglishType?.label || 'Question type'}
                                subtitle="Choose a specific question variation."
                                items={selectedEnglishType?.children || []}
                                onBack={() =>
                                    navigate(selectedEnglishSection === 'Writing' ? 'english-hsc-writing' : 'english-hsc-reading')
                                }
                                onSelect={(child) => {
                                    setSelectedEnglishSubtype(child);
                                    navigate('english-hsc-questions');
                                }}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'english-hsc-questions' && (
                            <EnglishQuestionList
                                title={englishQuestionTitle}
                                subtitle={englishQuestionSubtitle}
                                questions={englishQuestionEntries}
                                onAdd={addQuestionEntry(setEnglishQuestions, englishQuestionKey)}
                                onUpdate={updateQuestionEntry(setEnglishQuestions, englishQuestionKey)}
                                onDelete={removeQuestionEntry(setEnglishQuestions, englishQuestionKey)}
                                onBack={() =>
                                    navigate(
                                        selectedEnglishType?.children?.length
                                            ? 'english-hsc-subtypes'
                                            : selectedEnglishSection === 'Writing'
                                                ? 'english-hsc-writing'
                                                : 'english-hsc-reading'
                                    )
                                }
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'bangla-ssc-1st-paper' && (
                            <BanglaFirstPaperTopics classLabel="SSC" onNavigate={navigate} />
                        )}
                        {view === 'bangla-hsc-1st-paper' && (
                            <BanglaFirstPaperTopics classLabel="HSC" onNavigate={navigate} />
                        )}
                        {view === 'bangla-ssc-shahitto' && (
                            <BanglaShahitto classLabel="SSC" onNavigate={navigate} />
                        )}
                        {view === 'bangla-hsc-shahitto' && (
                            <BanglaShahitto classLabel="HSC" onNavigate={navigate} />
                        )}
                        {view === 'bangla-ssc-shohopath' && (
                            <BanglaShohopath
                                classLabel="SSC"
                                items={sscShohopathItems}
                                onAddItem={addShohopathItem(setSscShohopathItems)}
                                onUpdateItem={updateShohopathItem(setSscShohopathItems)}
                                onRemoveItem={removeShohopathItem(setSscShohopathItems)}
                                onSelectItem={(item) => {
                                    setSelectedBanglaItem(item.name);
                                    setSelectedBanglaCategory(item.type);
                                    navigate('bangla-ssc-item');
                                }}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'bangla-hsc-shohopath' && (
                            <BanglaShohopath
                                classLabel="HSC"
                                items={hscShohopathItems}
                                onAddItem={addShohopathItem(setHscShohopathItems)}
                                onUpdateItem={updateShohopathItem(setHscShohopathItems)}
                                onRemoveItem={removeShohopathItem(setHscShohopathItems)}
                                onSelectItem={(item) => {
                                    setSelectedBanglaItem(item.name);
                                    setSelectedBanglaCategory(item.type);
                                    navigate('bangla-hsc-item');
                                }}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'bangla-ssc-goddo' && (
                            <BanglaTextList
                                classLabel="SSC"
                                typeLabel="গদ্য"
                                items={sscGoddoItems}
                                onAddItem={addStringItem(setSscGoddoItems)}
                                onUpdateItem={updateStringItem(setSscGoddoItems)}
                                onRemoveItem={removeStringItem(setSscGoddoItems)}
                                onSelectItem={(item) => {
                                    setSelectedBanglaItem(item);
                                    setSelectedBanglaCategory('গদ্য');
                                    navigate('bangla-ssc-item');
                                }}
                                onNavigate={navigate}
                                showAdd
                            />
                        )}
                        {view === 'bangla-ssc-poddo' && (
                            <BanglaTextList
                                classLabel="SSC"
                                typeLabel="পদ্য"
                                items={sscPoddoItems}
                                onAddItem={addStringItem(setSscPoddoItems)}
                                onUpdateItem={updateStringItem(setSscPoddoItems)}
                                onRemoveItem={removeStringItem(setSscPoddoItems)}
                                onSelectItem={(item) => {
                                    setSelectedBanglaItem(item);
                                    setSelectedBanglaCategory('পদ্য');
                                    navigate('bangla-ssc-item');
                                }}
                                onNavigate={navigate}
                                showAdd
                            />
                        )}
                        {view === 'bangla-hsc-goddo' && (
                            <BanglaTextList
                                classLabel="HSC"
                                typeLabel="গদ্য"
                                items={hscGoddoItems}
                                onAddItem={addStringItem(setHscGoddoItems)}
                                onUpdateItem={updateStringItem(setHscGoddoItems)}
                                onRemoveItem={removeStringItem(setHscGoddoItems)}
                                onSelectItem={(item) => {
                                    setSelectedBanglaItem(item);
                                    setSelectedBanglaCategory('গদ্য');
                                    navigate('bangla-hsc-item');
                                }}
                                onNavigate={navigate}
                                showAdd
                            />
                        )}
                        {view === 'bangla-hsc-poddo' && (
                            <BanglaTextList
                                classLabel="HSC"
                                typeLabel="পদ্য"
                                items={hscPoddoItems}
                                onAddItem={addStringItem(setHscPoddoItems)}
                                onUpdateItem={updateStringItem(setHscPoddoItems)}
                                onRemoveItem={removeStringItem(setHscPoddoItems)}
                                onSelectItem={(item) => {
                                    setSelectedBanglaItem(item);
                                    setSelectedBanglaCategory('পদ্য');
                                    navigate('bangla-hsc-item');
                                }}
                                onNavigate={navigate}
                                showAdd
                            />
                        )}
                        {view === 'bangla-ssc-item' && (
                            <BanglaItemDetail
                                classLabel="SSC"
                                itemName={selectedBanglaItem}
                                categoryName={selectedBanglaCategory}
                                notesByItem={notesByItem}
                                onUpdateNotes={setNotesByItem}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'bangla-hsc-item' && (
                            <BanglaItemDetail
                                classLabel="HSC"
                                itemName={selectedBanglaItem}
                                categoryName={selectedBanglaCategory}
                                notesByItem={notesByItem}
                                onUpdateNotes={setNotesByItem}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'bangla-ssc-srijonshil-types' && (
                            <SrijonshilTypeList
                                classLabel="SSC"
                                itemName={selectedBanglaItem}
                                onSelectType={setSelectedSrijonshilType}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'bangla-hsc-srijonshil-types' && (
                            <SrijonshilTypeList
                                classLabel="HSC"
                                itemName={selectedBanglaItem}
                                onSelectType={setSelectedSrijonshilType}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'bangla-ssc-srijonshil-questions' && (
                            <SrijonshilQuestionList
                                classLabel="SSC"
                                itemName={selectedBanglaItem}
                                typeLabel={selectedSrijonshilType?.label || 'সৃজনশীল'}
                                questions={srijonshilQuestions[getQuestionKey('SSC', selectedBanglaCategory, selectedBanglaItem, selectedSrijonshilType?.key)] || []}
                                onAdd={addQuestionEntry(setSrijonshilQuestions, getQuestionKey('SSC', selectedBanglaCategory, selectedBanglaItem, selectedSrijonshilType?.key))}
                                onUpdate={updateQuestionEntry(setSrijonshilQuestions, getQuestionKey('SSC', selectedBanglaCategory, selectedBanglaItem, selectedSrijonshilType?.key))}
                                onDelete={removeQuestionEntry(setSrijonshilQuestions, getQuestionKey('SSC', selectedBanglaCategory, selectedBanglaItem, selectedSrijonshilType?.key))}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'bangla-hsc-srijonshil-questions' && (
                            <SrijonshilQuestionList
                                classLabel="HSC"
                                itemName={selectedBanglaItem}
                                typeLabel={selectedSrijonshilType?.label || 'সৃজনশীল'}
                                questions={srijonshilQuestions[getQuestionKey('HSC', selectedBanglaCategory, selectedBanglaItem, selectedSrijonshilType?.key)] || []}
                                onAdd={addQuestionEntry(setSrijonshilQuestions, getQuestionKey('HSC', selectedBanglaCategory, selectedBanglaItem, selectedSrijonshilType?.key))}
                                onUpdate={updateQuestionEntry(setSrijonshilQuestions, getQuestionKey('HSC', selectedBanglaCategory, selectedBanglaItem, selectedSrijonshilType?.key))}
                                onDelete={removeQuestionEntry(setSrijonshilQuestions, getQuestionKey('HSC', selectedBanglaCategory, selectedBanglaItem, selectedSrijonshilType?.key))}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'bangla-ssc-mcq' && (
                            <McqQuestionList
                                classLabel="SSC"
                                itemName={selectedBanglaItem}
                                questions={mcqQuestions[getQuestionKey('SSC', selectedBanglaCategory, selectedBanglaItem, 'mcq')] || []}
                                onAdd={addQuestionEntry(setMcqQuestions, getQuestionKey('SSC', selectedBanglaCategory, selectedBanglaItem, 'mcq'))}
                                onUpdate={updateQuestionEntry(setMcqQuestions, getQuestionKey('SSC', selectedBanglaCategory, selectedBanglaItem, 'mcq'))}
                                onDelete={removeQuestionEntry(setMcqQuestions, getQuestionKey('SSC', selectedBanglaCategory, selectedBanglaItem, 'mcq'))}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'bangla-hsc-mcq' && (
                            <McqQuestionList
                                classLabel="HSC"
                                itemName={selectedBanglaItem}
                                questions={mcqQuestions[getQuestionKey('HSC', selectedBanglaCategory, selectedBanglaItem, 'mcq')] || []}
                                onAdd={addQuestionEntry(setMcqQuestions, getQuestionKey('HSC', selectedBanglaCategory, selectedBanglaItem, 'mcq'))}
                                onUpdate={updateQuestionEntry(setMcqQuestions, getQuestionKey('HSC', selectedBanglaCategory, selectedBanglaItem, 'mcq'))}
                                onDelete={removeQuestionEntry(setMcqQuestions, getQuestionKey('HSC', selectedBanglaCategory, selectedBanglaItem, 'mcq'))}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-settings' && <AdminSettings onNavigate={navigate} />}
                    </main>
                </div>
            );
        }
`;
