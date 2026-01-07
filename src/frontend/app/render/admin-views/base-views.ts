export const baseViews = `
{view === 'login' && (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#f3f6ff] px-4 py-12">
        <AuthForm mode="login" onSubmit={handleLogin} />
        <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
                Don't have an account?{' '}
                <button 
                    onClick={() => navigate('student-register')} 
                    className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                    Create Free Student Account
                </button>
            </p>
        </div>
    </div>
)}
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
