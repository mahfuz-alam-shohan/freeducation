export const banglaState = `
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
            const [selectedBanglaItem, setSelectedBanglaItem] = useState(initialBanglaSelection.itemName || '');
            const [selectedBanglaCategory, setSelectedBanglaCategory] = useState(initialBanglaSelection.categoryName || '');
            const [selectedSrijonshilType, setSelectedSrijonshilType] = useState(null);
            const [sscGoddoItems, setSscGoddoItems] = useState([]);
            const [sscPoddoItems, setSscPoddoItems] = useState([]);
            const [hscGoddoItems, setHscGoddoItems] = useState([]);
            const [hscPoddoItems, setHscPoddoItems] = useState([]);
            const [sscShohopathItems, setSscShohopathItems] = useState([]);
            const [hscShohopathItems, setHscShohopathItems] = useState([]);
`;
