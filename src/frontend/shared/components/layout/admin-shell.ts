export const adminShellComponent = `
        const AdminShell = ({ activeTab, onNavigate, children }) => {
            return (
                <div className="relative flex flex-col lg:flex-row flex-1 bg-[#fdfbf7] overflow-hidden">
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute -top-32 -right-24 h-80 w-80 rounded-full bg-indigo-100/70 blur-3xl"></div>
                        <div className="absolute bottom-0 left-10 h-72 w-72 rounded-full bg-amber-100/60 blur-3xl"></div>
                        <div className="absolute top-1/3 right-1/3 h-24 w-24 rounded-full bg-rose-100/70 blur-2xl"></div>
                    </div>
                    <AdminSidebar activeTab={activeTab} onNavigate={onNavigate} />

                    <main className="relative z-10 flex-1 px-4 sm:px-6 lg:px-10 py-8 pb-24 lg:pb-8 flex flex-col gap-6 bg-transparent">
                        {/* Centered content wrapper for the legacy look */}
                        <section className="relative flex flex-col gap-6 w-full max-w-6xl mx-auto">
                            {children}
                        </section>
                        <footer className="border-t border-stone-200/60 pt-6 text-xs text-stone-500 text-center font-serif italic">
                            Freeducation Administration • Established 2024
                        </footer>
                    </main>

                    <AdminMobileNav activeTab={activeTab} onNavigate={onNavigate} />
                </div>
            );
        };
`;
