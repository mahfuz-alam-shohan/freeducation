export const dashboardMain = `
        const TeacherDashboard = ({ assignment, subjectConfig, onNavigate }) => {
            const hasAssignment = assignment && assignment.level && assignment.subject;
            return (
                <TeacherShell title="" subtitle="" activeTab="subject" onNavigate={onNavigate}>
                    {/* FULL SCREEN GRAY BACKGROUND */}
                    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#eaeded] flex flex-col items-center justify-center p-6">
                        
                        {!hasAssignment && (
                            <div className="w-full max-w-md bg-white border border-slate-400 p-8 text-center shadow-sm rounded-sm">
                                <i className="fa-solid fa-circle-exclamation text-3xl text-slate-400 mb-4"></i>
                                <p className="text-slate-600 font-serif font-bold text-sm uppercase tracking-widest">No Assignment Found</p>
                            </div>
                        )}

                        {hasAssignment && (
                            <div className="w-full max-w-2xl bg-white border-2 border-slate-400 shadow-md rounded-sm overflow-hidden">
                                {/* FLUSH HEADER - NO TITLE TEXT ABOVE */}
                                <div className="bg-[#2c3e50] p-5 text-center border-b-4 border-[#34495e]">
                                    <h2 className="text-2xl font-serif font-bold text-white tracking-widest uppercase">{assignment.subject}</h2>
                                    <div className="mt-2 inline-block px-3 py-0.5 bg-white text-[#2c3e50] text-[10px] font-bold uppercase tracking-[0.2em]">
                                        {assignment.level}
                                    </div>
                                </div>
                                
                                <div className="p-10 text-center bg-white">
                                    {subjectConfig?.route ? (
                                        <button onClick={() => onNavigate(subjectConfig.route)} className="px-10 py-3 bg-[#2980b9] hover:bg-[#2573a7] text-white font-serif font-bold uppercase tracking-widest transition-none border-b-4 border-[#1a5276] active:border-b-0 active:translate-y-1 active:shadow-inner rounded-sm">
                                            Manage Content
                                        </button>
                                    ) : (
                                        <div className="inline-block px-6 py-2 bg-slate-100 text-slate-500 font-serif font-bold border border-slate-300 uppercase tracking-wider text-xs">
                                            Locked
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </TeacherShell>
            );
        };

        const AdminDashboard = ({ onNavigate }) => {
            const [classes, setClasses] = useState([]);
            const [loading, setLoading] = useState(true);
            const allowedClasses = ['SSC', 'HSC'];

            const fetchClasses = async () => {
                const token = localStorage.getItem('auth_token');
                if (!token) { setLoading(false); return; }
                const response = await fetch('/api/classes', { headers: { 'Authorization': 'Bearer ' + token } });
                const data = await response.json();
                if (data.success) { setClasses(data.classes || []); }
                setLoading(false);
            };

            useEffect(() => { fetchClasses(); }, []);

            const allowedLookup = new Set(allowedClasses.map((name) => name.toUpperCase()));
            const filteredClasses = classes.filter((item) => allowedLookup.has(String(item.name || '').toUpperCase()));

            const getClassRoute = (name) => {
                const upper = String(name || '').toUpperCase();
                if (upper === 'SSC') return 'admin-groups-ssc';
                if (upper === 'HSC') return 'admin-groups-hsc';
                return null;
            };

            // STRICT FLAT COLORS (No Gradients)
            const getTheme = (name) => {
                return name.toUpperCase() === 'SSC' 
                    ? 'bg-[#16a085] hover:bg-[#117a65] border-[#0e6655]' // Teal
                    : 'bg-[#2980b9] hover:bg-[#2573a7] border-[#1a5276]'; // Blue
            };

            return (
                <AdminShell title="" subtitle="" activeTab="classes" onNavigate={onNavigate}>
                    {/* FULL SCREEN GRAY BACKGROUND - NO HEADLINES */}
                    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#eaeded] flex items-center justify-center p-6">
                        
                        {loading && (
                             <i className="fa-solid fa-spinner fa-spin text-slate-400 text-3xl"></i>
                        )}

                        {!loading && filteredClasses.length === 0 && (
                            <div className="p-8 border-2 border-dashed border-slate-300 bg-white/50 text-center rounded-sm">
                                <p className="text-slate-500 font-serif italic">No programs available.</p>
                            </div>
                        )}

                        {/* CENTERED BUTTON GRID - NO TITLE ABOVE */}
                        {!loading && filteredClasses.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
                                {filteredClasses.map((item) => {
                                    const route = getClassRoute(item.name);
                                    const isActive = Boolean(route);
                                    const themeClass = isActive ? getTheme(item.name) : 'bg-slate-300 border-slate-400 cursor-not-allowed';
                                    
                                    return (
                                        <button 
                                            key={item.id} 
                                            onClick={() => route && onNavigate(route)} 
                                            disabled={!route}
                                            className={\`group h-32 px-8 flex items-center justify-between transition-none shadow-sm border-b-[6px] active:border-b-0 active:translate-y-[6px] rounded-sm bg-white \${themeClass}\`}
                                        >
                                            <div className="flex flex-col items-start">
                                                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/80 mb-1">
                                                    Program
                                                </span>
                                                <span className="text-4xl font-serif font-bold text-white tracking-widest">
                                                    {item.name}
                                                </span>
                                            </div>
                                            
                                            {isActive && (
                                                <div className="w-12 h-12 flex items-center justify-center bg-black/10 text-white rounded-sm group-hover:bg-white group-hover:text-[#2c3e50] transition-colors">
                                                     <i className="fa-solid fa-arrow-right text-lg"></i>
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </AdminShell>
            );
        };
`;
