export const appState = `
            const loadBanglaSelection = () => {
                try {
                    const raw = localStorage.getItem('freeducation.bangla-selection');
                    return raw ? JSON.parse(raw) : { itemName: '', categoryName: '' };
                } catch (error) {
                    console.warn('Failed to load Bangla selection', error);
                    return { itemName: '', categoryName: '' };
                }
            };
            const initialBanglaSelection = loadBanglaSelection();
            const initialView = window.__INITIAL_VIEW || getViewFromPath(window.location.pathname);
            const [view, setView] = useState(initialView);
            const [isLoading, setIsLoading] = useState(true);
            const [user, setUser] = useState(null);
            const [hasAdmin, setHasAdmin] = useState(null);
            const [selectedBanglaItem, setSelectedBanglaItem] = useState(initialBanglaSelection.itemName || '');
            const [selectedBanglaCategory, setSelectedBanglaCategory] = useState(initialBanglaSelection.categoryName || '');
            const [selectedSrijonshilType, setSelectedSrijonshilType] = useState(null);
            const [selectedIctChapter, setSelectedIctChapter] = useState(null);
            const [selectedIctClass, setSelectedIctClass] = useState('SSC');
            const [selectedScienceChapter, setSelectedScienceChapter] = useState(null);
            const [selectedScienceTopic, setSelectedScienceTopic] = useState(null);
            const [selectedScienceCqType, setSelectedScienceCqType] = useState(null);
            const [selectedScienceSubject, setSelectedScienceSubject] = useState(null);
            const [selectedReligion, setSelectedReligion] = useState(null);
            const [selectedEnglishSection, setSelectedEnglishSection] = useState('');
            const [selectedEnglishType, setSelectedEnglishType] = useState(null);
            const [selectedEnglishSubtype, setSelectedEnglishSubtype] = useState(null);
            const [sscGoddoItems, setSscGoddoItems] = useState([]);
            const [sscPoddoItems, setSscPoddoItems] = useState([]);
            const [hscGoddoItems, setHscGoddoItems] = useState([]);
            const [hscPoddoItems, setHscPoddoItems] = useState([]);
            const [sscShohopathItems, setSscShohopathItems] = useState([]);
            const [hscShohopathItems, setHscShohopathItems] = useState([]);
            const [sscIctChapters, setSscIctChapters] = useState([]);
            const [hscIctChapters, setHscIctChapters] = useState([]);
            const [sscPhysicsChapters, setSscPhysicsChapters] = useState([]);
            const [sscChemistryChapters, setSscChemistryChapters] = useState([]);
            const [sscBiologyChapters, setSscBiologyChapters] = useState([]);
            const [sscBangladeshGlobalChapters, setSscBangladeshGlobalChapters] = useState([]);
            const [sscReligionChapters, setSscReligionChapters] = useState({
                Islam: [],
                Hinduism: [],
                Buddhism: [],
                Christianity: []
            });
            const [hscPhysics1stChapters, setHscPhysics1stChapters] = useState([]);
            const [hscPhysics2ndChapters, setHscPhysics2ndChapters] = useState([]);
            const [hscChemistry1stChapters, setHscChemistry1stChapters] = useState([]);
            const [hscChemistry2ndChapters, setHscChemistry2ndChapters] = useState([]);
            const [hscBiology1stChapters, setHscBiology1stChapters] = useState([]);
            const [hscBiology2ndChapters, setHscBiology2ndChapters] = useState([]);
            const [srijonshilQuestions, setSrijonshilQuestions] = useState({});
            const [mcqQuestions, setMcqQuestions] = useState({});
            const [englishQuestions, setEnglishQuestions] = useState({});
            const [notesByItem, setNotesByItem] = useState({});
            const [videosByItem, setVideosByItem] = useState({});
            const [contentLoaded, setContentLoaded] = useState(false);
`;
