import { baseViews } from './admin-views/base-views';
import { ictViews } from './admin-views/ict-views';
import { scienceSscViews } from './admin-views/science-ssc-views';
import { scienceHscViews } from './admin-views/science-hsc-views';
import { religionViews } from './admin-views/religion-views';
import { englishViews } from './admin-views/english-views';
import { banglaViews } from './admin-views/bangla-views';
import { settingsViews } from './admin-views/settings-views';
import { usersViews } from './admin-views/users-views'; // <--- NEW IMPORT

export const renderAdmin = baseViews +
    ictViews +
    scienceSscViews +
    scienceHscViews +
    religionViews +
    englishViews +
    banglaViews +
    settingsViews +
    usersViews; // <--- ADDED HERE
