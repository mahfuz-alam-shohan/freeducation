import { landingData } from './landing-parts/data';
import { landingUi } from './landing-parts/ui-shared';
import { landingBangla } from './landing-parts/bangla';
import { landingScience } from './landing-parts/science';
import { landingEnglish } from './landing-parts/english';
import { landingVideo } from './landing-parts/video';
import { landingIndex } from './landing-parts/index-page';
import { landingHome } from './landing-parts/home-page';
import { landingExports } from './landing-parts/exports';
import { studentAuthLogic } from './landing-parts/student-auth'; // <--- NEW IMPORT

export const landingComponents = `
        const LandingModule = (() => {
` + landingData +
    landingUi +
    landingBangla +
    landingScience +
    landingEnglish +
    landingVideo +
    landingIndex +
    landingHome +
    landingExports + 
    studentAuthLogic; // <--- ADDED HERE
