export const teacherGuard = `
            useEffect(() => {
                if (!user || user.role !== 'teacher') return;
                const allowedViews = getTeacherAllowedViews(user.assignment);
                if (isDashboardView(view) && !allowedViews.has(view)) {
                    navigate('dashboard', { replace: true });
                }
            }, [user, view]);
`;
