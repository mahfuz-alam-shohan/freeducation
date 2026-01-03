import { appRouting } from "./app/routing";
import { appState } from "./app/state";
import { keyHelpers } from "./app/key-helpers";
import { teacherConfig } from "./app/teacher-config";
import { contentState } from "./app/content-state";
import { banglaTopics } from "./app/bangla-topics";
import { englishTypes } from "./app/english-types";
import { derivedState } from "./app/derived-state";
import { questionHelpers } from "./app/question-helpers";
import { collectionHelpers } from "./app/collection-helpers";
import { navigationHelpers } from "./app/navigation";
import { appEffects } from "./app/effects";
import { authHandlers } from "./app/auth";
import { teacherGuard } from "./app/teacher-guard";
import { appRender } from "./app/render";

export const mainApp = `
        function App() {
${appRouting}${appState}${keyHelpers}${teacherConfig}${contentState}${banglaTopics}${englishTypes}${derivedState}${questionHelpers}${collectionHelpers}${navigationHelpers}${appEffects}${authHandlers}${teacherGuard}${appRender}
        }
`;
