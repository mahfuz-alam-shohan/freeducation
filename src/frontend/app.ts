import { appRouting } from './modules/platforms/academic/subjects/app/routing';
import { appState } from './modules/platforms/academic/subjects/app/state';
import { keyHelpers } from './modules/platforms/academic/subjects/app/key-helpers';
import { teacherConfig } from './modules/platforms/academic/subjects/app/teacher-config';
import { contentState } from './modules/platforms/academic/subjects/app/content-state';
import { banglaTopics } from './modules/platforms/academic/subjects/app/bangla-topics';
import { englishTypes } from './modules/platforms/academic/subjects/app/english-types';
import { derivedState } from './modules/platforms/academic/subjects/app/derived-state';
import { questionHelpers } from './modules/platforms/academic/subjects/app/question-helpers';
import { collectionHelpers } from './modules/platforms/academic/subjects/app/collection-helpers';
import { navigationHelpers } from './modules/platforms/academic/subjects/app/navigation';
import { appEffects } from './modules/platforms/academic/subjects/app/effects';
import { authHandlers } from './modules/platforms/academic/subjects/app/auth';
import { teacherGuard } from './modules/platforms/academic/subjects/app/teacher-guard';
import { appRender } from './modules/platforms/academic/subjects/app/render';
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
