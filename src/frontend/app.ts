import { frontendModules } from './modules/registry';

export const mainApp = `
        function App() {
            const statusEndpoint = '/api/system/status';
${frontendModules.join('\n')}
        }
`;
