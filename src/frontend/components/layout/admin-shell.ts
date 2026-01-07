export const adminShellComponent = `
        const AdminShell = ({ activeTab, onNavigate, children }) => {
            return (
                <div className="flex flex-col lg:flex-row flex-1 bg-[#fdfbf7]">
                    <AdminSidebar activeTab={activeTab} onNavigate={onNavigate} />

                    <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8 pb-24 lg:pb-8 flex flex-col gap-6 bg-[#fdfbf7]">
                        {/* Centered content wrapper for the legacy look */}
                        <section className="relative flex flex-col gap-6 w-full max-w-6xl mx-auto">
                            {children}
                        </section>
                        <footer className="border-t border-stone-200 pt-6 text-xs text-stone-500 text-center font-serif italic">
                            Freeducation Administration • Established 2024
                        </footer>
                    </main>

                    <AdminMobileNav activeTab={activeTab} onNavigate={onNavigate} />
                </div>
            );
        };
`;
