import { appRouting } from './modules/app/routing';
import { appState } from './modules/app/state';
import { keyHelpers } from './modules/app/key-helpers';
import { teacherConfig } from './modules/app/teacher-config';
import { contentState } from './modules/app/content-state';
import { banglaTopics } from './modules/app/bangla-topics';
import { englishTypes } from './modules/app/english-types';
import { derivedState } from './modules/app/derived-state';
import { questionHelpers } from './modules/app/question-helpers';
import { collectionHelpers } from './modules/app/collection-helpers';
import { navigationHelpers } from './modules/app/navigation';
import { appEffects } from './modules/app/effects';
import { authHandlers } from './modules/app/auth';
import { teacherGuard } from './modules/app/teacher-guard';
import { appRender } from './modules/app/render';
import { uiComponents } from './shared/components/ui';
import { landingComponents } from './modules/public/landing';

export const mainApp = `
  ${appRouting}
  ${appState}
  ${keyHelpers}
  ${teacherConfig}
  ${contentState}
  ${banglaTopics}
  ${englishTypes}
  ${derivedState}
  ${questionHelpers}
  ${collectionHelpers}
  ${navigationHelpers}
  ${appEffects}
  ${authHandlers}
  ${teacherGuard}
  ${appRender}
  ${uiComponents}
  ${landingComponents}
`;
