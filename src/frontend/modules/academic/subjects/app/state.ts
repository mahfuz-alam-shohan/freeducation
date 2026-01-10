export const appState = `
            const initialView = window.__INITIAL_VIEW || getViewFromPath(window.location.pathname);
            const [view, setView] = useState(initialView);
            const [isLoading, setIsLoading] = useState(true);
            const [user, setUser] = useState(null);
            const [hasAdmin, setHasAdmin] = useState(null);
            const [srijonshilQuestions, setSrijonshilQuestions] = useState({});
            const [mcqQuestions, setMcqQuestions] = useState({});
            const [notesByItem, setNotesByItem] = useState({});
            const [videosByItem, setVideosByItem] = useState({});
            const [contentLoaded, setContentLoaded] = useState(false);
            const [selectedVideoContext, setSelectedVideoContext] = useState(null);
            const [selectedVideoId, setSelectedVideoId] = useState(null);
`;
