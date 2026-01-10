import { adminRouteViews } from '../../../../users/admin/views/routes';
import { studentRouteViews } from '../../../../users/student/views/routes';
import { teacherRouteViews } from '../../../../users/teacher/views/routes';
import { subjectAdminViews } from '../../registry';

export const renderAdmin = teacherRouteViews +
    studentRouteViews +
    adminRouteViews +
    subjectAdminViews;
