import { landingViews } from './public-views/landing-views';
import { ictViews } from './public-views/ict-views';
import { scienceSscViews } from './public-views/science-ssc-views';
import { scienceHscPhysicsViews } from './public-views/science-hsc-physics-views';
import { scienceHscChemistryViews } from './public-views/science-hsc-chemistry-views';
import { scienceHscBiologyViews } from './public-views/science-hsc-biology-views';
import { humanitiesViews } from './public-views/humanities-views';
import { banglaViews } from './public-views/bangla-views';
import { englishViews } from './public-views/english-views';
import { studentAuthViews } from './public-views/student-auth-views';

export const renderPublic = landingViews +
    ictViews +
    scienceSscViews +
    scienceHscPhysicsViews +
    scienceHscChemistryViews +
    scienceHscBiologyViews +
    humanitiesViews +
    banglaViews +
    englishViews +
    studentAuthViews;
