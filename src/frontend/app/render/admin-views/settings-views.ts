export const settingsViews = `
{view === 'admin-settings' && user?.role === 'teacher' && <TeacherSettings onNavigate={navigate} />}
{view === 'admin-settings' && (!user || user.role !== 'teacher') && <AdminSettings onNavigate={navigate} />}
`;
