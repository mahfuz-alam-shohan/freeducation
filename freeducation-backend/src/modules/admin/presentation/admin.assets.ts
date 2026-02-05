import indexHtml from '../../../admin-ui/index.asset.html';
import stylesCss from '../../../admin-ui/styles.asset.css';
import stylesVarsCss from '../../../admin-ui/styles/vars.asset.css';
import stylesBaseCss from '../../../admin-ui/styles/base.asset.css';
import stylesLayoutCss from '../../../admin-ui/styles/layout.asset.css';
import stylesComponentsCss from '../../../admin-ui/styles/components.asset.css';
import stylesFeaturesCss from '../../../admin-ui/styles/features.asset.css';
import stylesResponsiveCss from '../../../admin-ui/styles/responsive.asset.css';
import appJs from '../../../admin-ui/app.asset.js';
import appCoreDomJs from '../../../admin-ui/app/core/dom.asset.js';
import appCoreStateJs from '../../../admin-ui/app/core/state.asset.js';
import appCoreCacheJs from '../../../admin-ui/app/core/cache.asset.js';
import appCoreLoadingJs from '../../../admin-ui/app/core/loading.asset.js';
import appCoreHelpersJs from '../../../admin-ui/app/core/helpers.asset.js';
import appCoreRouterJs from '../../../admin-ui/app/core/router.asset.js';
import appApiClientJs from '../../../admin-ui/app/api/client.asset.js';
import appApiAuthJs from '../../../admin-ui/app/api/auth.asset.js';
import appApiUsersJs from '../../../admin-ui/app/api/users.asset.js';
import appApiDatabaseJs from '../../../admin-ui/app/api/database.asset.js';
import appApiModulesJs from '../../../admin-ui/app/api/modules.asset.js';
import appApiSubjectsJs from '../../../admin-ui/app/api/subjects.asset.js';
import appApiMediaJs from '../../../admin-ui/app/api/media.asset.js';
import appApiManagementJs from '../../../admin-ui/app/api/api-management.asset.js';
import appApiIndexJs from '../../../admin-ui/app/api/index.asset.js';
import appModalsUsersJs from '../../../admin-ui/app/modals/users.asset.js';
import appModalsSubjectsJs from '../../../admin-ui/app/modals/subjects.asset.js';
import appModalsChaptersJs from '../../../admin-ui/app/modals/chapters.asset.js';
import appModalsTopicsJs from '../../../admin-ui/app/modals/topics.asset.js';
import appModalsApiJs from '../../../admin-ui/app/modals/api.asset.js';
import layoutJs from '../../../admin-ui/components/layout.asset.js';
import sidebarJs from '../../../admin-ui/components/sidebar.asset.js';
import topbarJs from '../../../admin-ui/components/topbar.asset.js';
import cardsJs from '../../../admin-ui/components/cards.asset.js';
import dashboardJs from '../../../admin-ui/components/dashboard.asset.js';
import tableJs from '../../../admin-ui/components/table.asset.js';
import formJs from '../../../admin-ui/components/form.asset.js';
import toastJs from '../../../admin-ui/components/toast.asset.js';
import maintenanceJs from '../../../admin-ui/components/maintenance.asset.js';
import dbJs from '../../../admin-ui/components/db.asset.js';
import apiJs from '../../../admin-ui/components/api.asset.js';
import modulesCategoriesJs from '../../../admin-ui/components/modules.categories.asset.js';
import modulesSubjectsJs from '../../../admin-ui/components/modules.subjects.asset.js';
import modulesSubjectDetailJs from '../../../admin-ui/components/modules.subject.detail.asset.js';
import modulesSubjectCurriculumJs from '../../../admin-ui/components/modules.subject.curriculum.asset.js';
import modulesSubjectExamJs from '../../../admin-ui/components/modules.subject.exam.asset.js';
import subjectsListJs from '../../../admin-ui/components/subjects.list.asset.js';
import subjectsDetailJs from '../../../admin-ui/components/subjects.detail.asset.js';
import subjectsChaptersJs from '../../../admin-ui/components/subjects.chapters.asset.js';
import subjectsChapterDetailJs from '../../../admin-ui/components/subjects.chapter.detail.asset.js';
import subjectsChapterConstantsJs from '../../../admin-ui/components/subjects/chapter/constants.asset.js';
import subjectsChapterRowsJs from '../../../admin-ui/components/subjects/chapter/rows.asset.js';
import subjectsChapterFormsJs from '../../../admin-ui/components/subjects/chapter/forms.asset.js';
import subjectsChapterOverviewJs from '../../../admin-ui/components/subjects/chapter/overview.asset.js';
import subjectsChapterNotesJs from '../../../admin-ui/components/subjects/chapter/notes.asset.js';
import subjectsChapterVideosJs from '../../../admin-ui/components/subjects/chapter/videos.asset.js';
import subjectsChapterQuestionsJs from '../../../admin-ui/components/subjects/chapter/questions.asset.js';
import subjectsChapterModalsJs from '../../../admin-ui/components/subjects/chapter/modals.asset.js';
import subjectsNodeJs from '../../../admin-ui/components/subjects.node.asset.js';
import subjectsTopicsJs from '../../../admin-ui/components/subjects.topics.asset.js';
import subjectsTopicDetailJs from '../../../admin-ui/components/subjects.topic.detail.asset.js';
import subjectsTopicConstantsJs from '../../../admin-ui/components/subjects/topic/constants.asset.js';
import subjectsTopicRowsJs from '../../../admin-ui/components/subjects/topic/rows.asset.js';
import subjectsTopicFormsJs from '../../../admin-ui/components/subjects/topic/forms.asset.js';
import subjectsTopicOverviewJs from '../../../admin-ui/components/subjects/topic/overview.asset.js';
import subjectsTopicNotesJs from '../../../admin-ui/components/subjects/topic/notes.asset.js';
import subjectsTopicVideosJs from '../../../admin-ui/components/subjects/topic/videos.asset.js';
import subjectsTopicQuestionsJs from '../../../admin-ui/components/subjects/topic/questions.asset.js';

interface AssetEntry {
  body: string;
  contentType: string;
}

const assetMap = new Map<string, AssetEntry>([
  ['/admin', { body: indexHtml, contentType: 'text/html; charset=UTF-8' }],
  ['/admin/', { body: indexHtml, contentType: 'text/html; charset=UTF-8' }],
  ['/admin/assets/styles.css', { body: stylesCss, contentType: 'text/css; charset=UTF-8' }],
  ['/admin/assets/styles/vars.css', { body: stylesVarsCss, contentType: 'text/css; charset=UTF-8' }],
  ['/admin/assets/styles/base.css', { body: stylesBaseCss, contentType: 'text/css; charset=UTF-8' }],
  ['/admin/assets/styles/layout.css', { body: stylesLayoutCss, contentType: 'text/css; charset=UTF-8' }],
  ['/admin/assets/styles/components.css', { body: stylesComponentsCss, contentType: 'text/css; charset=UTF-8' }],
  ['/admin/assets/styles/features.css', { body: stylesFeaturesCss, contentType: 'text/css; charset=UTF-8' }],
  ['/admin/assets/styles/responsive.css', { body: stylesResponsiveCss, contentType: 'text/css; charset=UTF-8' }],
  ['/admin/assets/app.js', { body: appJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/app/core/dom.js', { body: appCoreDomJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/app/core/state.js', { body: appCoreStateJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/app/core/cache.js', { body: appCoreCacheJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/app/core/loading.js', { body: appCoreLoadingJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/app/core/helpers.js', { body: appCoreHelpersJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/app/core/router.js', { body: appCoreRouterJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/app/api/client.js', { body: appApiClientJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/app/api/auth.js', { body: appApiAuthJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/app/api/users.js', { body: appApiUsersJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/app/api/database.js', { body: appApiDatabaseJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/app/api/modules.js', { body: appApiModulesJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/app/api/subjects.js', { body: appApiSubjectsJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/app/api/media.js', { body: appApiMediaJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/app/api/api-management.js', { body: appApiManagementJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/app/api/index.js', { body: appApiIndexJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/app/modals/users.js', { body: appModalsUsersJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/app/modals/subjects.js', { body: appModalsSubjectsJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/app/modals/chapters.js', { body: appModalsChaptersJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/app/modals/topics.js', { body: appModalsTopicsJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/app/modals/api.js', { body: appModalsApiJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/layout.js', { body: layoutJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/sidebar.js', { body: sidebarJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/topbar.js', { body: topbarJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/cards.js', { body: cardsJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/dashboard.js', { body: dashboardJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/table.js', { body: tableJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/form.js', { body: formJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/toast.js', { body: toastJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/maintenance.js', { body: maintenanceJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/db.js', { body: dbJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/api.js', { body: apiJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/modules.categories.js', { body: modulesCategoriesJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/modules.subjects.js', { body: modulesSubjectsJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/modules.subject.detail.js', { body: modulesSubjectDetailJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/modules.subject.curriculum.js', { body: modulesSubjectCurriculumJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/modules.subject.exam.js', { body: modulesSubjectExamJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/subjects.list.js', { body: subjectsListJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/subjects.detail.js', { body: subjectsDetailJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/subjects.chapters.js', { body: subjectsChaptersJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/subjects.chapter.detail.js', { body: subjectsChapterDetailJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/subjects/chapter/constants.js', { body: subjectsChapterConstantsJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/subjects/chapter/rows.js', { body: subjectsChapterRowsJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/subjects/chapter/forms.js', { body: subjectsChapterFormsJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/subjects/chapter/overview.js', { body: subjectsChapterOverviewJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/subjects/chapter/notes.js', { body: subjectsChapterNotesJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/subjects/chapter/videos.js', { body: subjectsChapterVideosJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/subjects/chapter/questions.js', { body: subjectsChapterQuestionsJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/subjects/chapter/modals.js', { body: subjectsChapterModalsJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/subjects.node.js', { body: subjectsNodeJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/subjects.topics.js', { body: subjectsTopicsJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/subjects.topic.detail.js', { body: subjectsTopicDetailJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/subjects/topic/constants.js', { body: subjectsTopicConstantsJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/subjects/topic/rows.js', { body: subjectsTopicRowsJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/subjects/topic/forms.js', { body: subjectsTopicFormsJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/subjects/topic/overview.js', { body: subjectsTopicOverviewJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/subjects/topic/notes.js', { body: subjectsTopicNotesJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/subjects/topic/videos.js', { body: subjectsTopicVideosJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/subjects/topic/questions.js', { body: subjectsTopicQuestionsJs, contentType: 'application/javascript; charset=UTF-8' }]
]);

export function getAdminAsset(pathname: string): Response | null {
  if (assetMap.has(pathname)) {
    const asset = assetMap.get(pathname)!;
    return new Response(asset.body, {
      status: 200,
      headers: { 'Content-Type': asset.contentType }
    });
  }

  if (pathname.startsWith('/admin/assets/')) {
    return new Response('Not found', { status: 404 });
  }

  if (pathname.startsWith('/admin')) {
    return new Response(indexHtml, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=UTF-8' }
    });
  }

  return null;
}
