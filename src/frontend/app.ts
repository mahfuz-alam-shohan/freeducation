import { appRouting } from './modules/users/student/academic/routing';
import { appState } from './modules/users/student/academic/state';
import { keyHelpers } from './modules/users/student/academic/key-helpers';
import { teacherConfig } from './modules/users/student/academic/teacher-config';
import { contentState } from './modules/users/student/academic/content-state';
import { banglaTopics } from './modules/users/student/academic/bangla-topics';
import { englishTypes } from './modules/users/student/academic/english-types';
import { derivedState } from './modules/users/student/academic/derived-state';
import { questionHelpers } from './modules/users/student/academic/question-helpers';
import { collectionHelpers } from './modules/users/student/academic/collection-helpers';
import { navigationHelpers } from './modules/users/student/academic/navigation';
import { appEffects } from './modules/users/student/academic/effects';
import { authHandlers } from './modules/users/student/academic/auth';
import { teacherGuard } from './modules/users/student/academic/teacher-guard';
import { appRender } from './modules/users/student/academic/render';
import { uiComponents } from './shared/components/ui';
import { landingComponents } from './modules/users/public/landing';

const appModules = [
  appRouting,
  appState,
  keyHelpers,
  teacherConfig,
  contentState,
  banglaTopics,
  englishTypes,
  derivedState,
  questionHelpers,
  collectionHelpers,
  navigationHelpers,
  appEffects,
  authHandlers,
  teacherGuard,
  uiComponents,
  landingComponents,
  appRender,
];

export const mainApp = `
        function App() {
${appModules.join('\n')}
        }
`;
