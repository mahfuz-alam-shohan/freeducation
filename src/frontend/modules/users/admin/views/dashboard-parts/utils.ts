export const dashboardUtils = `
        const resizeImageFile = (file, { maxWidth = 400, maxHeight = 500, quality = 0.7 } = {}) =>
            new Promise((resolve) => {
                if (!file || !(file instanceof File)) { resolve(file); return; }
                
                // If it's not an image, don't touch it
                if (!file.type.startsWith('image/')) { resolve(file); return; }

                const image = new Image();
                const objectUrl = URL.createObjectURL(file);
                
                image.onload = () => {
                    // Calculate new size keeping aspect ratio
                    let targetWidth = image.width;
                    let targetHeight = image.height;

                    if (targetWidth > maxWidth || targetHeight > maxHeight) {
                        const ratio = Math.min(maxWidth / targetWidth, maxHeight / targetHeight);
                        targetWidth = Math.round(targetWidth * ratio);
                        targetHeight = Math.round(targetHeight * ratio);
                    }

                    const canvas = document.createElement('canvas');
                    canvas.width = targetWidth;
                    canvas.height = targetHeight;
                    
                    const ctx = canvas.getContext('2d');
                    if (!ctx) { URL.revokeObjectURL(objectUrl); resolve(file); return; }
                    
                    // smooth drawing
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';
                    
                    ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
                    
                    canvas.toBlob((blob) => {
                        URL.revokeObjectURL(objectUrl);
                        if (!blob) { resolve(file); return; }
                        
                        // Create new file with same name but .jpg extension (efficient compression)
                        const baseName = file.name.replace(/\\.[^/.]+$/, '') || 'thumbnail';
                        resolve(new File([blob], \`\${baseName}.jpg\`, { type: 'image/jpeg' }));
                    }, 'image/jpeg', quality);
                };
                
                image.onerror = () => { URL.revokeObjectURL(objectUrl); resolve(file); };
                image.src = objectUrl;
            });

        const useThumbnailMap = (url, keyField) => {
            const [thumbnailMap, setThumbnailMap] = useState({});
            useEffect(() => {
                let isActive = true;
                const loadThumbnails = async () => {
                    try {
                        const response = await fetch(url);
                        if (!response.ok) return;
                        const data = await response.json();
                        if (!isActive) return;
                        const map = (data.thumbnails || []).reduce((acc, item) => {
                            acc[item[keyField]] = { url: item.url };
                            return acc;
                        }, {});
                        setThumbnailMap(map);
                    } catch (error) { console.warn('Failed to load thumbnails', error); }
                };
                loadThumbnails();
                return () => { isActive = false; };
            }, [url, keyField]);
            return [thumbnailMap, setThumbnailMap];
        };

        const dashboardViewOptions = [
            { key: 'card', label: 'Card' },
            { key: 'list', label: 'List' }
        ];

        const useDashboardViewPreference = (initial = 'card') => {
            const [viewMode, setViewMode] = useState(initial);
            const [profileId, setProfileId] = useState(null);

            useEffect(() => {
                const cached = localStorage.getItem('dashboard_view');
                if (cached === 'card' || cached === 'list') {
                    setViewMode(cached);
                }
            }, []);

            useEffect(() => {
                let isActive = true;
                const token = localStorage.getItem('auth_token');
                if (!token) return undefined;
                const loadPreference = async () => {
                    try {
                        const response = await fetch('/api/profile', { headers: { Authorization: 'Bearer ' + token } });
                        if (!response.ok) return;
                        const data = await response.json();
                        if (!isActive) return;
                        const profile = data.profile || {};
                        if (profile.id) {
                            setProfileId(profile.id);
                            const cached = localStorage.getItem('dashboard_view_' + profile.id);
                            const resolved = cached || profile.dashboardView;
                            if (resolved === 'card' || resolved === 'list') {
                                setViewMode(resolved);
                            }
                            if (profile.dashboardView === 'card' || profile.dashboardView === 'list') {
                                localStorage.setItem('dashboard_view_' + profile.id, profile.dashboardView);
                                localStorage.setItem('dashboard_view', profile.dashboardView);
                            }
                        }
                    } catch (error) {
                        console.warn('Failed to load dashboard view preference', error);
                    }
                };
                loadPreference();
                return () => { isActive = false; };
            }, []);

            const updateViewMode = async (nextMode) => {
                if (nextMode !== 'card' && nextMode !== 'list') return;
                setViewMode(nextMode);
                const key = profileId ? 'dashboard_view_' + profileId : 'dashboard_view';
                localStorage.setItem(key, nextMode);
                localStorage.setItem('dashboard_view', nextMode);
                const token = localStorage.getItem('auth_token');
                if (!token) return;
                try {
                    await fetch('/api/profile', {
                        method: 'PUT',
                        headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
                        body: JSON.stringify({ dashboardView: nextMode })
                    });
                } catch (error) {
                    console.warn('Failed to save dashboard view preference', error);
                }
            };

            return { viewMode, setViewMode: updateViewMode, viewOptions: dashboardViewOptions };
        };
`;
