export const dashboardMain = `
        const TeacherDashboard = ({ assignment, subjectConfig, onNavigate }) => {
            const hasAssignment = assignment && assignment.level && assignment.subject;
            return (
                <TeacherShell title="Teacher Portal" subtitle="Manage your assigned subject content." activeTab="subject" onNavigate={onNavigate}>
                    <div className="min-h-full bg-[#f8f9fa] p-6 sm:p-10 flex flex-col items-center animate-in fade-in">
                        {!hasAssignment && (
                            <div className="max-w-lg w-full bg-white border border-slate-300 p-8 text-center shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
                                <div className="inline-block p-4 bg-slate-100 rounded-full mb-4 text-slate-400">
                                    <i className="fa-solid fa-chalkboard-user text-2xl"></i>
                                </div>
                                <h3 className="text-xl font-serif font-bold text-slate-800">No Active Assignment</h3>
                                <p className="text-slate-600 mt-2 font-serif italic">Please contact an administrator.</p>
                            </div>
                        )}

                        {hasAssignment && (
                            <div className="max-w-3xl w-full bg-white border border-slate-300 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.1)]">
                                {/* Legacy Header Strip */}
                                <div className="bg-[#2c3e50] p-6 text-center border-b-4 border-[#34495e]">
                                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#bdc3c7]">Academic Session</span>
                                    <h2 className="text-3xl font-serif font-bold text-white mt-2 tracking-wide">{assignment.subject}</h2>
                                    <div className="mt-3 inline-block px-4 py-1 bg-[#34495e] text-white text-xs font-bold uppercase tracking-wider border border-[#4a6278]">
                                        Level: {assignment.level}
                                    </div>
                                </div>
                                
                                <div className="p-8 text-center">
                                    <p className="text-slate-600 mb-8 font-serif text-lg leading-relaxed">
                                        {subjectConfig?.description || 'Access content management tools and curriculum settings.'}
                                    </p>
                                    
                                    {subjectConfig?.route ? (
                                        <button onClick={() => onNavigate(subjectConfig.route)} className="inline-flex items-center gap-3 px-8 py-3 bg-[#2980b9] hover:bg-[#3498db] text-white font-bold uppercase tracking-widest transition-colors shadow-sm border-b-4 border-[#1f618d] active:border-b-0 active:translate-y-1">
                                            <span>Enter Classroom</span>
                                            <i className="fa-solid fa-arrow-right"></i>
                                        </button>
                                    ) : (
                                        <div className="inline-flex items-center gap-2 px-6 py-2 bg-slate-100 text-slate-500 font-bold uppercase text-xs border border-slate-300">
                                            <i className="fa-solid fa-lock"></i> Locked
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

            // Classic, Solid Colors (Legacy Feel)
            const getTheme = (name) => {
                return name.toUpperCase() === 'SSC' 
                    ? 'bg-[#16a085] hover:bg-[#1abc9c] border-[#117a65]' // Flat Teal
                    : 'bg-[#2980b9] hover:bg-[#3498db] border-[#1c5980]'; // Flat Blue
            };

            return (
                <AdminShell title="Administration" subtitle="System Overview" activeTab="classes" onNavigate={onNavigate}>
                    <div className="min-h-full bg-[#f0f2f5] p-6 sm:p-10 flex flex-col items-center animate-in fade-in">
                        
                        {/* Legacy Headline - Centered & Serif */}
                        <div className="text-center mb-10">
                            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-800 tracking-tight border-b-4 border-slate-300 pb-2 inline-block px-8">
                                ACADEMIC CONTROL
                            </h2>
                            <p className="text-slate-500 mt-4 font-serif italic text-sm">Select a program to manage curriculum.</p>
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="py-12">
                                <i className="fa-solid fa-spinner fa-spin text-slate-400 text-3xl"></i>
                            </div>
                        )}

                        {/* Empty State */}
                        {!loading && filteredClasses.length === 0 && (
                            <div className="text-center py-12 px-8 border-2 border-dashed border-slate-300 rounded-sm bg-white/50">
                                <p className="text-slate-500 font-serif font-bold">No academic programs configured.</p>
                            </div>
                        )}

                        {/* Buttons Grid - Compact & Centered */}
                        {!loading && filteredClasses.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
                                {filteredClasses.map((item) => {
                                    const route = getClassRoute(item.name);
                                    const isActive = Boolean(route);
                                    const themeClass = isActive ? getTheme(item.name) : 'bg-slate-300 border-slate-400 cursor-not-allowed';
                                    
                                    return (
                                        <button 
                                            key={item.id} 
                                            onClick={() => route && onNavigate(route)} 
                                            disabled={!route}
                                            className={\`group relative p-6 text-left transition-all duration-200 shadow-md border-b-4 active:border-b-0 active:translate-y-1 \${themeClass}\`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 mb-1">
                                                        Program
                                                    </div>
                                                    <div className="text-4xl font-serif font-bold text-white tracking-wide">
                                                        {item.name}
                                                    </div>
                                                </div>
                                                <div className="w-12 h-12 flex items-center justify-center bg-white/20 rounded-full text-white">
                                                     <i className={\`fa-solid \${item.name === 'SSC' ? 'fa-flask' : 'fa-book'} text-xl group-hover:scale-110 transition-transform\`}></i>
                                                </div>
                                            </div>
                                            
                                            {isActive && (
                                                <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/90">
                                                    <span>Enter Panel</span>
                                                    <i className="fa-solid fa-chevron-right text-xs group-hover:translate-x-1 transition-transform"></i>
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
