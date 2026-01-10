import { landingViews } from '../../../../users/public/views/landing-views';
import { studentAuthViews } from '../../../../users/public/views/student-auth-views';
import { subjectPublicViews } from '../../registry';

export const renderPublic = landingViews + subjectPublicViews + studentAuthViews;
