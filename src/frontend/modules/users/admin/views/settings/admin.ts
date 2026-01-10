export const settingsAdminPanels = `
        // 4. Main Admin Settings Controller
        const AdminSettings = ({ onNavigate }) => {
            const [activePanel, setActivePanel] = useState('main'); // 'main', 'profile', 'danger'

            // Render Sub-Panels
            if (activePanel === 'profile') {
                return <ProfileManagement onNavigate={onNavigate} onBack={() => setActivePanel('main')} />;
            }
            if (activePanel === 'danger') {
                return <DangerZonePanel onNavigate={onNavigate} onBack={() => setActivePanel('main')} />;
            }

            // Render Main List View - Compact "Clean Type" Visual
            return (
                <AdminShell title="Settings" subtitle="System preferences" activeTab="settings" onNavigate={onNavigate}>
                    <div className="max-w-xl bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm animate-fade-in">
                        
                        {/* Profile Option - Narrow & Clean */}
                        <button 
                            onClick={() => setActivePanel('profile')} 
                            className="w-full flex items-center gap-3 px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition text-left group"
                        >
                            <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
                                    <i className="fa-solid fa-user-gear text-sm"></i>
                            </div>
                            <div className="flex-1">
                                    <div className="font-medium text-slate-700 text-sm">Profile Settings</div>
                            </div>
                            <i className="fa-solid fa-chevron-right text-xs text-slate-300 group-hover:text-indigo-400"></i>
                        </button>

                        {/* Danger Zone Option - Narrow & Clean */}
                        <button 
                            onClick={() => setActivePanel('danger')} 
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-rose-50/30 transition text-left group"
                        >
                            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
                                    <i className="fa-solid fa-triangle-exclamation text-sm"></i>
                            </div>
                            <div className="flex-1">
                                    <div className="font-medium text-slate-700 text-sm">Danger Zone</div>
                            </div>
                            <i className="fa-solid fa-chevron-right text-xs text-slate-300 group-hover:text-rose-400"></i>
                        </button>

                    </div>
                </AdminShell>
            );
        };

        const TeacherSettings = ({ onNavigate }) => {
            return <ProfileManagement onNavigate={onNavigate} shell="teacher" />;
        };
`;
