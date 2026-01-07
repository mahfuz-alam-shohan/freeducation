import { landingViews } from './public-views/landing-views';
import { scienceSscViews } from './public-views/science-ssc-views';
import { scienceHscPhysicsViews } from './public-views/science-hsc-physics-views';
import { scienceHscChemistryViews } from './public-views/science-hsc-chemistry-views';
import { scienceHscBiologyViews } from './public-views/science-hsc-biology-views';
import { ictViews } from './public-views/ict-views';
import { humanitiesViews } from './public-views/humanities-views';
import { englishViews } from './public-views/english-views';
import { banglaViews } from './public-views/bangla-views';
import { studentAuthViews } from './public-views/student-auth-views'; // <--- IMPORT THIS

export const renderPublic = 
    landingViews +
    scienceSscViews +
    scienceHscPhysicsViews +
    scienceHscChemistryViews +
    scienceHscBiologyViews +
    ictViews +
    humanitiesViews +
    englishViews +
    banglaViews +
    studentAuthViews + // <--- ADD THIS
    `
    {view === 'student-register' && <StudentRegister onNavigate={navigate} />}
    `;
