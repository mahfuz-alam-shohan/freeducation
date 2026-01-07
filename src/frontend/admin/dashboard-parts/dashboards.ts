export const dashboardMain = `
        const TeacherDashboard = ({ assignment, subjectConfig, onNavigate }) => {
            const hasAssignment = assignment && assignment.level && assignment.subject;
            return (
                <TeacherShell title="Teacher Portal" subtitle="" activeTab="subject" onNavigate={onNavigate}>
                    <div className="min-h-full bg-[#eaeded] p-6 flex flex-col items-center justify-center animate-in fade-in">
                        {!hasAssignment && (
                            <div className="w-full max-w-lg bg-white border border-slate-300 p-8 text-center shadow-sm">
                                <i className="fa-solid fa-chalkboard-user text-3xl text-slate-400 mb-4"></i>
                                <h3 className="text-xl font-serif font-bold text-slate-800">No Assignment</h3>
                                <p className="text-slate-600 mt-2 font-serif italic text-sm">Contact administration.</p>
                            </div>
                        )}

                        {hasAssignment && (
                            <div className="w-full max-w-3xl bg-white border border-slate-400 shadow-sm">
                                {/* Classic Header */}
                                <div className="bg-[#2c3e50] p-6 text-center border-b-4 border-[#34495e]">
                                    <h2 className="text-3xl font-serif font-bold text-white tracking-wide">{assignment.subject}</h2>
                                    <div className="mt-2 inline-block px-3 py-0.5 bg-white text-[#2c3e50] text-xs font-bold uppercase tracking-widest">
                                        {assignment.level}
                                    </div>
                                </div>
                                
                                <div className="p-10 text-center bg-white">
                                    <p className="text-slate-700 mb-8 font-serif text-lg leading-relaxed">
                                        {subjectConfig?.description || 'Curriculum management and content tools.'}
                                    </p>
                                    
                                    {subjectConfig?.route ? (
                                        <button onClick={() => onNavigate(subjectConfig.route)} className="px-10 py-3 bg-[#2980b9] hover:bg-[#2573a7] text-white font-serif font-bold uppercase tracking-widest transition-none border border-[#1a5276] shadow-sm active:translate-y-px">
                                            Manage Content
                                        </button>
                                    ) : (
                                        <div className="inline-block px-6 py-2 bg-slate-100 text-slate-500 font-serif font-bold border border-slate-300">
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

            // Classic Flat Colors
            const getTheme = (name) => {
                return name.toUpperCase() === 'SSC' 
                    ? 'bg-[#1abc9c] hover:bg-[#16a085] border-[#16a085]' // Teal
                    : 'bg-[#3498db] hover:bg-[#2980b9] border-[#2980b9]'; // Blue
            };

            return (
                <AdminShell title="Administration" subtitle="" activeTab="classes" onNavigate={onNavigate}>
                    <div className="min-h-full bg-[#eaeded] flex flex-col items-center justify-center p-6 animate-in fade-in">
                        
                        {/* Legacy Headline - Centered & Serif */}
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-serif font-bold text-[#2c3e50] uppercase tracking-widest border-b-2 border-[#bdc3c7] pb-2 px-8 inline-block">
                                Academic Control
                            </h2>
                        </div>

                        {/* Content */}
                        {loading && (
                            <div className="py-12">
                                <i className="fa-solid fa-spinner fa-spin text-slate-400 text-2xl"></i>
                            </div>
                        )}

                        {!loading && filteredClasses.length === 0 && (
                            <div className="p-8 border border-slate-300 bg-white shadow-sm text-center">
                                <p className="text-slate-500 font-serif italic">No academic programs available.</p>
                            </div>
                        )}

                        {/* Compact Grid */}
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
                                            className={\`group relative h-32 px-6 flex items-center justify-between transition-none shadow-sm border-b-4 active:border-b-0 active:translate-y-1 active:shadow-inner \${themeClass}\`}
                                        >
                                            <div className="flex flex-col items-start">
                                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 mb-1">Select Program</span>
                                                <span className="text-4xl font-serif font-bold text-white tracking-wide">{item.name}</span>
                                            </div>
                                            
                                            {isActive && (
                                                <div className="w-10 h-10 flex items-center justify-center bg-white/20 text-white rounded-sm group-hover:bg-white group-hover:text-[#2c3e50] transition-colors">
                                                     <i className="fa-solid fa-arrow-right"></i>
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
