export const baseViews = `
{view === 'login' && <AuthForm mode="login" onSubmit={handleLogin} onNavigate={navigate} />}
{view === 'register' && <AuthForm mode="register" onSubmit={handleRegister} />}
{view === 'dashboard' && user?.role === 'teacher' && (
    <TeacherDashboard assignment={user.assignment} subjectConfig={teacherSubjectConfig} onNavigate={navigate} />
)}
{view === 'dashboard' && (!user || user.role !== 'teacher') && (
    <AdminDashboard onNavigate={navigate} />
)}
{view === 'admin-groups-ssc' && (
    <AdminGroupSelection classLabel="SSC" onNavigate={navigate} />
)}
{view === 'admin-groups-hsc' && (
    <AdminGroupSelection classLabel="HSC" onNavigate={navigate} />
)}
{view === 'admin-ssc-science' && (
    <AdminGroupDetail classLabel="SSC" groupLabel="Science" onNavigate={navigate} canManageThumbnails={canManageThumbnails} />
)}
{view === 'admin-ssc-humanities' && (
    <AdminGroupDetail classLabel="SSC" groupLabel="Humanities" onNavigate={navigate} canManageThumbnails={canManageThumbnails} />
)}
{view === 'admin-ssc-business-studies' && (
    <AdminGroupDetail classLabel="SSC" groupLabel="Business Studies" onNavigate={navigate} canManageThumbnails={canManageThumbnails} />
)}
{view === 'admin-hsc-science' && (
    <AdminGroupDetail classLabel="HSC" groupLabel="Science" onNavigate={navigate} canManageThumbnails={canManageThumbnails} />
)}
{view === 'admin-hsc-humanities' && (
    <AdminGroupDetail classLabel="HSC" groupLabel="Humanities" onNavigate={navigate} canManageThumbnails={canManageThumbnails} />
)}
{view === 'admin-hsc-business-studies' && (
    <AdminGroupDetail classLabel="HSC" groupLabel="Business Studies" onNavigate={navigate} canManageThumbnails={canManageThumbnails} />
)}
`;
