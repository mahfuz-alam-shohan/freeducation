import { settingsAdminPanels } from './admin';
import { settingsDangerPanel } from './danger';
import { settingsHelpers } from './helpers';
import { settingsPasswordPanel } from './password';
import { settingsProfilePanel } from './profile';
import { settingsStudentPanels } from './student';

export const settingsComponents = `
        const AdminSettingsModule = (() => {
${settingsHelpers}
${settingsProfilePanel}
${settingsPasswordPanel}
${settingsDangerPanel}
${settingsAdminPanels}
${settingsStudentPanels}

        return { AdminSettings, TeacherSettings, StudentSettings };
        })();
        const { AdminSettings, TeacherSettings, StudentSettings } = AdminSettingsModule;
`;
