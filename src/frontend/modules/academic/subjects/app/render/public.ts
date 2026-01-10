import { authViews } from '../../../../users/public/views/auth-views';
import { landingViews } from '../../../../users/public/views/landing-views';
import { setupView } from '../../../../users/public/views/setup-view';
import { studentAuthViews } from '../../../../users/public/views/student-auth-views';
import { subjectPublicViews } from '../../registry';

export const renderPublic = authViews + landingViews + setupView + subjectPublicViews + studentAuthViews;
