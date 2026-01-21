import { baseStyles } from './base';
import { componentStyles } from './components';
import { pageStyles } from './pages';

// Modular theme styles - combining all style modules
export const themeStyles = `
  ${baseStyles}
  ${componentStyles}
  ${pageStyles}
`;
