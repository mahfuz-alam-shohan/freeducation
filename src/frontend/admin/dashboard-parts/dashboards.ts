export const dashboardMain = `
        const TeacherDashboard = ({ assignment, subjectConfig, onNavigate }) => {
            const hasAssignment = assignment && assignment.level && assignment.subject;
            return (
                <TeacherShell title="Teacher Portal" subtitle="" activeTab="subject" onNavigate={onNavigate}>
                    {/* FULL HEIGHT GRAY BACKGROUND */}
                    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#eaeded] flex flex-col items-center pt-10 px-6">
                        
                        {!hasAssignment && (
                            <div className="w-full max-w-lg bg-white border border-slate-400 p-10 text-center shadow-sm rounded-sm">
                                <i className="fa-solid fa-chalkboard-user text-4xl text-slate-400 mb-6"></i>
                                <h3 className="text-xl font-serif font-bold text-slate-800 uppercase tracking-widest border-b pb-2 mb-2">No Assignment</h3>
                                <p className="text-slate-600 font-serif italic text-sm">Please contact the administration.</p>
                            </div>
                        )}

                        {hasAssignment && (
                            <div className="w-full max-w-3xl bg-white border-2 border-slate-300 shadow-md">
                                {/* LEGACY HEADER INSIDE THE CARD */}
                                <div className="bg-[#2c3e50] p-6 text-center border-b-4 border-[#34495e]">
                                    <h2 className="text-3xl font-serif font-bold text-white tracking-wider">{assignment.subject}</h2>
                                    <div className="mt-2 inline-block px-4 py-0.5 bg-white text-[#2c3e50] text-xs font-bold uppercase tracking-[0.2em]">
                                        {assignment.level}
                                    </div>
                                </div>
                                
                                <div className="p-12 text-center">
                                    <p className="text-slate-700 mb-10 font-serif text-lg leading-relaxed">
                                        {subjectConfig?.description || 'Curriculum management and content tools.'}
                                    </p>
                                    
                                    {subjectConfig?.route ? (
                                        <button onClick={() => onNavigate(subjectConfig.route)} className="px-12 py-3 bg-[#2980b9] hover:bg-[#2573a7] text-white font-serif font-bold uppercase tracking-widest transition-none border-b-4 border-[#1a5276] active:border-b-0 active:translate-y-1 active:shadow-inner">
                                            Manage Content
                                        </button>
                                    ) : (
                                        <div className="inline-block px-8 py-2 bg-slate-100 text-slate-500 font-serif font-bold border border-slate-300 uppercase tracking-wider text-xs">
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

            // LEGACY FLAT THEME COLORS
            const getTheme = (name) => {
                return name.toUpperCase() === 'SSC' 
                    ? 'bg-[#1abc9c] hover:bg-[#16a085] border-[#117a65]' // Flat Teal
                    : 'bg-[#3498db] hover:bg-[#2980b9] border-[#2980b9]'; // Flat Blue
            };

            return (
                <AdminShell title="Administration" subtitle="" activeTab="classes" onNavigate={onNavigate}>
                    {/* FULL PAGE GRAY BACKGROUND */}
                    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#eaeded] flex flex-col items-center pt-12 px-6">
                        
                        {/* SINGLE HEADLINE - INSIDE THE GRAY AREA */}
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-serif font-bold text-[#2c3e50] uppercase tracking-[0.2em] border-b-2 border-[#bdc3c7] pb-4 px-10 inline-block">
                                Academic Control
                            </h2>
                        </div>

                        {/* CONTENT */}
                        {loading && (
                            <div className="py-12">
                                <i className="fa-solid fa-spinner fa-spin text-slate-400 text-3xl"></i>
                            </div>
                        )}

                        {!loading && filteredClasses.length === 0 && (
                            <div className="p-10 border-2 border-dashed border-slate-300 bg-white/50 text-center rounded-sm">
                                <p className="text-slate-500 font-serif italic text-lg">No academic programs configured.</p>
                            </div>
                        )}

                        {/* COMPACT BUTTONS GRID */}
                        {!loading && filteredClasses.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-2xl">
                                {filteredClasses.map((item) => {
                                    const route = getClassRoute(item.name);
                                    const isActive = Boolean(route);
                                    const themeClass = isActive ? getTheme(item.name) : 'bg-slate-300 border-slate-400 cursor-not-allowed';
                                    
                                    return (
                                        <button 
                                            key={item.id} 
                                            onClick={() => route && onNavigate(route)} 
                                            disabled={!route}
                                            className={\`group relative h-32 px-8 flex items-center justify-between transition-none shadow-sm border-b-[6px] active:border-b-0 active:translate-y-[6px] rounded-sm \${themeClass}\`}
                                        >
                                            <div className="flex flex-col items-start">
                                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/90 mb-2">
                                                    Program
                                                </span>
                                                <span className="text-4xl font-serif font-bold text-white tracking-widest">
                                                    {item.name}
                                                </span>
                                            </div>
                                            
                                            {isActive && (
                                                <div className="w-12 h-12 flex items-center justify-center bg-white/20 text-white rounded-sm group-hover:bg-white group-hover:text-[#2c3e50] transition-colors">
                                                     <i className="fa-solid fa-chevron-right text-lg"></i>
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
