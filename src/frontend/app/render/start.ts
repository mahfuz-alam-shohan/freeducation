export const renderStart = `
            if (isLoading || hasAdmin === null) return <Loading />;
            const teacherSubjectConfig = getTeacherSubjectConfig(user?.assignment);

            return (
                <div className="min-h-screen flex flex-col">
                    <NavBar user={user} hasAdmin={hasAdmin} onNavigate={navigate} onLogout={handleLogout} />
                    <main className="flex-grow bg-gray-50 flex flex-col">
`;
