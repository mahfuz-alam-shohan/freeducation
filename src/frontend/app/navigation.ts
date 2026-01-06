export const navigationHelpers = `
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

            // FIX: This helper replaces the history entry instead of pushing a new one,
            // preventing the "infinite loop" feeling when going back.
            const goBack = (fallbackView) => {
                navigate(fallbackView, { replace: true });
            };

            useEffect(() => {
                const handlePopState = () => {
                    syncRoutesFromLocation();
                };
                window.addEventListener('popstate', handlePopState);
                return () => window.removeEventListener('popstate', handlePopState);
            }, []);
`;
