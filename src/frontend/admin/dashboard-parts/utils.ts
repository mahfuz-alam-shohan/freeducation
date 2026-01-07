export const dashboardUtils = `
        const resizeImageFile = (file, { maxWidth = 520, maxHeight = 650, quality = 0.82 } = {}) =>
            new Promise((resolve) => {
                if (!file || !(file instanceof File)) { resolve(file); return; }
                const image = new Image();
                const objectUrl = URL.createObjectURL(file);
                image.onload = () => {
                    const ratio = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
                    const targetWidth = Math.max(1, Math.round(image.width * ratio));
                    const targetHeight = Math.max(1, Math.round(image.height * ratio));
                    const canvas = document.createElement('canvas');
                    canvas.width = targetWidth;
                    canvas.height = targetHeight;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) { URL.revokeObjectURL(objectUrl); resolve(file); return; }
                    ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
                    canvas.toBlob((blob) => {
                        URL.revokeObjectURL(objectUrl);
                        if (!blob) { resolve(file); return; }
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
`;
