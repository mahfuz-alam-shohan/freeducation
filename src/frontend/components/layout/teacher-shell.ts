export const teacherShellComponent = `
        const TeacherShell = ({ title, subtitle, activeTab, onNavigate, children }) => {
            return (
                <div className="flex flex-col lg:flex-row flex-1 bg-gray-50">
                    <TeacherSidebar activeTab={activeTab} onNavigate={onNavigate} />

                    <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8 pb-24 lg:pb-8 flex flex-col gap-6 bg-gradient-to-br from-slate-50 via-white to-sky-50 bg-pan-slow">
                        {(title || subtitle) && <AdminPageHeader title={title} subtitle={subtitle} />}
                        <section className="flex flex-col gap-6">
                            {children}
                        </section>
                        <footer className="border-t border-gray-200 pt-4 text-xs text-gray-400">
                            Freeducation Teacher • Manage your assigned subject content.
                        </footer>
                    </main>

                    <TeacherMobileNav activeTab={activeTab} onNavigate={onNavigate} />
                </div>
            );
        };
`;
