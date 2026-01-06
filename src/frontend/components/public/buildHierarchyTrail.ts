export const buildHierarchyTrail =`
 const buildHierarchyTrail = () => {
            const { pathname } = window.location;
            const parts = pathname.split('/').filter(Boolean);
            const trail = [{ label: 'Home', path: '/' }];
            let currentPath = '';
            parts.forEach((part) => {
                currentPath += '/' + part;
                trail.push({
                    label: formatHierarchyLabel(part),
                    path: currentPath
                });
            });
            return trail;
        };


`;
