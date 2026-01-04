export const adminShellComponent = `
        const AdminShell = ({ title, subtitle, activeTab, onNavigate, children }) => {
            return (
                <div className="flex flex-col lg:flex-row flex-1 bg-gray-50">
                    <AdminSidebar activeTab={activeTab} onNavigate={onNavigate} />

                    <main className="relative overflow-hidden flex-1 px-4 sm:px-6 lg:px-10 py-8 pb-24 lg:pb-8 flex flex-col gap-6 bg-gradient-to-br from-slate-50 via-white to-blue-50 bg-pan-slow">
                        <div className="admin-art-layer" aria-hidden="true"></div>
                        <div className="admin-art-layer secondary" aria-hidden="true"></div>
                        {(title || subtitle) && <AdminPageHeader title={title} subtitle={subtitle} />}
                        <section className="relative flex flex-col gap-6">
                            {children}
                        </section>
                        <footer className="border-t border-gray-200 pt-4 text-xs text-gray-400">
                            Freeducation Admin • Manage classes and content responsibly.
                        </footer>
                    </main>

                    <AdminMobileNav activeTab={activeTab} onNavigate={onNavigate} />
                </div>
            );
        };
`;
