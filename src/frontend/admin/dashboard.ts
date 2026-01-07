import { dashboardUtils } from './dashboard-parts/utils';
import { dashboardShared } from './dashboard-parts/shared-components';
import { dashboardQuestions } from './dashboard-parts/questions';
import { dashboardMain } from './dashboard-parts/dashboards';
import { dashboardGroups } from './dashboard-parts/groups';
import { dashboardBangla } from './dashboard-parts/bangla';
import { dashboardScience } from './dashboard-parts/science-ict';
import { dashboardEnglish } from './dashboard-parts/english';
import { dashboardExports } from './dashboard-parts/exports';
import { dashboardUsers } from './dashboard-parts/users'; // <--- NEW IMPORT (You need to create the file first)

export const dashboardComponents = `
    /* -- Dashboard Module -- */
    const DashboardModule = (() => {
` + dashboardUtils +
    dashboardShared +
    dashboardQuestions +
    dashboardMain +
    dashboardGroups +
    dashboardBangla +
    dashboardScience +
    dashboardEnglish +
    dashboardUsers + // <--- ADDED HERE
    dashboardExports +
    `
    })();

    const {
        TeacherDashboard,
        AdminDashboard,
        AdminGroupSelection,
        AdminGroupDetail,
        AdminUserList, // <--- EXPORTED HERE
        BanglaFirstPaperTopics,
        BanglaShahitto,
        BanglaShohopath,
        BanglaTextList,
        BanglaItemDetail,
        SrijonshilTypeList,
        SrijonshilQuestionList,
        McqQuestionList,
        IctChapterList,
        ReligionSelectionList,
        ScienceChapterList,
        ScienceTopicList,
        ScienceTopicDetail,
        VideoManager,
        EnglishFirstPaperHome,
        EnglishSectionList,
        EnglishQuestionList
    } = DashboardModule;
`;
