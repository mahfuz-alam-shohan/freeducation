export const useThumbnails =`
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
                            acc[key] = {
                                url: item.url
                            };
                            return acc;
                        }, {});
                        setThumbnailMap(map);
                    } catch (error) {
                        console.warn('Failed to load thumbnails', error);
                    }
                };
                loadThumbnails();
                return () => {
                    isActive = false;
                };
            }, []);

            return thumbnailMap;
        };

`;
