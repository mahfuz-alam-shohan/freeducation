export const teacherRouteViews = `
{view === 'dashboard' && user?.role === 'teacher' && (
    <TeacherDashboard assignment={user.assignment} subjectConfig={teacherSubjectConfig} onNavigate={navigate} />
)}
{view === 'admin-settings' && user?.role === 'teacher' && <TeacherSettings onNavigate={navigate} />}
`;
