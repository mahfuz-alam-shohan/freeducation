export const settingsHelpers = `
        // --- HELPERS ---
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
                    canvas.width = targetWidth; canvas.height = targetHeight;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
                    canvas.toBlob((blob) => { URL.revokeObjectURL(objectUrl); resolve(new File([blob], file.name, { type: 'image/jpeg' })); }, 'image/jpeg', quality);
                };
                image.src = objectUrl;
            });

        const appendTokenToAvatarUrl = (avatarUrl, token) => {
            if (!avatarUrl || !token) return avatarUrl;
            try {
                const resolved = new URL(avatarUrl, window.location.origin);
                resolved.searchParams.set('token', token);
                return resolved.pathname + resolved.search;
            } catch (error) {
                return avatarUrl;
            }
        };

        const parseApiResponse = async (response, fallbackMessage) => {
            const data = await response.json().catch(() => null);
            if (response.ok && data?.success) {
                return { ok: true, data };
            }
            const errorMessage = data?.error || data?.message || (fallbackMessage + ' (status ' + response.status + ')');
            return { ok: false, data, errorMessage };
        };

        const useProfileData = () => {
            const [profile, setProfile] = useState(null);
            const [history, setHistory] = useState([]);
            const [isLoading, setIsLoading] = useState(true);
            
            const loadProfile = async () => {
                const token = localStorage.getItem('auth_token');
                if (!token) { setIsLoading(false); return; }
                try {
                    const [profileRes, historyRes] = await Promise.all([ 
                        fetch('/api/profile', { headers: { Authorization: 'Bearer ' + token } }), 
                        fetch('/api/profile/history', { headers: { Authorization: 'Bearer ' + token } }) 
                    ]);
                    const pData = await profileRes.json(); 
                    const hData = await historyRes.json();
                    
                    if (pData.success) {
                        const profileWithToken = {
                            ...pData.profile,
                            avatarUrl: appendTokenToAvatarUrl(pData.profile?.avatarUrl, token)
                        };
                        setProfile(profileWithToken);
                    }
                    if (hData.success) setHistory(hData.entries || []);
                } catch (e) {} finally { setIsLoading(false); }
            };
            
            useEffect(() => { loadProfile(); }, []);
            return { profile, history, isLoading, refreshProfile: loadProfile, setProfile };
        };
`;
