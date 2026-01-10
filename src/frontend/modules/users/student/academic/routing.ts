import { matchEntries, viewToPath } from '../../../../routing/routes';

const viewToPathJson = JSON.stringify(viewToPath);
const matchEntriesJson = JSON.stringify(matchEntries);

export const appRouting = `
            const viewToPath = ${viewToPathJson};
            const routeEntries = ${matchEntriesJson};
            const getViewFromPath = (path) => {
                for (const [routePath, view] of routeEntries) {
                    if (path.startsWith(routePath)) {
                        return view;
                    }
                }
                return 'landing';
            };
`;
