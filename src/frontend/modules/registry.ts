import { appRouting } from './academic/subjects/app/routing';
import { appState } from './academic/subjects/app/state';
import { keyHelpers } from './academic/subjects/app/key-helpers';
import { teacherConfig } from './academic/subjects/app/teacher-config';
import { contentState } from './academic/subjects/app/content-state';
import { derivedState } from './academic/subjects/app/derived-state';
import { questionHelpers } from './academic/subjects/app/question-helpers';
import { collectionHelpers } from './academic/subjects/app/collection-helpers';
import { navigationHelpers } from './academic/subjects/app/navigation';
import { appEffects } from './academic/subjects/app/effects';
import { authHandlers } from './academic/subjects/app/auth';
import { teacherGuard } from './academic/subjects/app/teacher-guard';
import { appRender } from './academic/subjects/app/render';
import { subjectStates, subjectTypes } from './academic/subjects/registry';
import { uiComponents } from '../shared/components/ui';
import { landingComponents } from './users/public';
import { publicState } from './users/public/state';
import { teacherState } from './users/teacher/state';
import { studentState } from './users/student/state';

export const frontendModules = [
  appRouting,
  appState,
  publicState,
  ...subjectStates,
  contentState,
  teacherState,
  studentState,
  ...subjectTypes,
  keyHelpers,
  teacherConfig,
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
