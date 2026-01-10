export const studentRouteViews = `
{view === 'dashboard' && user?.role === 'student' && (
    <StudentClassView user={user} onNavigate={navigate} />
)}
{view === 'student-class' && user?.role === 'student' && (
    <StudentClassView user={user} onNavigate={navigate} />
)}
{view === 'student-settings' && user?.role === 'student' && (
    <StudentSettings onNavigate={navigate} />
)}
`;
