import { frontendModules } from './modules/registry';

export const mainApp = `
        function App() {
${frontendModules.join('\n')}
        }
`;
