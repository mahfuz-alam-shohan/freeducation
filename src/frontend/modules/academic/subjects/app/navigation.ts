export const navigationHelpers = `
            const syncRoutesFromLocation = () => {
                const { pathname } = window.location;
                setView(getViewFromPath(pathname));
            };

            const navigate = (nextView, options = {}) => {
                const { replace = false, path } = options;
                setView(nextView);
                const nextPath = path || viewToPath[nextView] || '/';
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
`;
