import { baseViews } from './admin-views/base-views';
import { settingsViews } from './admin-views/settings-views';
import { usersViews } from './admin-views/users-views'; // <--- NEW IMPORT
import { subjectAdminViews } from '../../registry';

export const renderAdmin = baseViews +
    subjectAdminViews +
    settingsViews +
    usersViews; // <--- ADDED HERE
