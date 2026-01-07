export const dashboardMain = `
        const TeacherDashboard = ({ assignment, subjectConfig, onNavigate }) => {
            const hasAssignment = assignment && assignment.level && assignment.subject;
            return (
                <TeacherShell title="Teacher Portal" subtitle="Manage your assigned subject content." activeTab="subject" onNavigate={onNavigate}>
                    <div className="min-h-full bg-slate-50 p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4">
                        {!hasAssignment && (
                            <div className="bg-white border border-slate-200 p-12 text-center shadow-sm">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 text-slate-400 mb-6 rounded-sm">
                                    <i className="fa-solid fa-chalkboard-user text-2xl"></i>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">No Assignment</h3>
                                <p className="text-slate-500 mt-2">Contact an admin to assign a subject.</p>
                            </div>
                        )}

                        {hasAssignment && (
                            <div className="bg-white shadow-sm border border-slate-200">
                                {/* Header Strip - Sharp & Flat */}
                                <div className="bg-slate-900 p-8 flex flex-col gap-4 relative overflow-hidden">
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                                            <span className="w-2 h-2 bg-emerald-500 animate-pulse"></span>
                                            Active Session
                                        </div>
                                        <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mt-1">{assignment.subject}</h2>
                                        <div className="inline-flex mt-4 px-3 py-1 bg-white/10 text-white text-xs font-bold border border-white/20 uppercase tracking-wider">
                                            Level: {assignment.level}
                                        </div>
                                    </div>
                                    <i className="fa-solid fa-layer-group absolute -right-6 -bottom-8 text-9xl text-white opacity-5"></i>
                                </div>
                                
                                <div className="p-8 bg-white">
                                    <p className="text-slate-600 mb-8 text-lg leading-relaxed font-light">
                                        {subjectConfig?.description || 'Access content management tools, quizzes, and video lectures for this subject.'}
                                    </p>
                                    
                                    {subjectConfig?.route ? (
                                        <button onClick={() => onNavigate(subjectConfig.route)} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-widest transition-all shadow-sm flex items-center gap-3 rounded-sm">
                                            <span>Enter Classroom</span>
                                            <i className="fa-solid fa-arrow-right"></i>
                                        </button>
                                    ) : (
                                        <div className="px-4 py-3 bg-slate-100 text-slate-500 font-bold uppercase tracking-wider text-xs inline-flex items-center gap-2 border border-slate-200">
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

            // Flat, Vibrant Colors
            const getTheme = (name) => {
                return name.toUpperCase() === 'SSC' 
                    ? 'bg-teal-600 hover:bg-teal-700 text-white border-teal-800' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-800';
            };

            const getIcon = (name) => {
                 return name.toUpperCase() === 'SSC' ? 'fa-microscope' : 'fa-graduation-cap';
            };

            return (
                <AdminShell title="Academic Control" subtitle="Select a program to manage." activeTab="classes" onNavigate={onNavigate}>
                    <div className="min-h-full bg-slate-50 p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4">
                        
                        {/* Loading State */}
                        {loading && (
                            <div className="flex items-center justify-center h-64 border border-slate-200 bg-white">
                                <i className="fa-solid fa-circle-notch fa-spin text-slate-300 text-2xl"></i>
                            </div>
                        )}

                        {/* Empty State */}
                        {!loading && filteredClasses.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-64 bg-white border border-slate-200 text-center">
                                <i className="fa-solid fa-folder-open text-slate-300 text-4xl mb-4"></i>
                                <p className="text-slate-400 font-bold uppercase tracking-wider">No active programs</p>
                            </div>
                        )}

                        {/* Grid Area - Clean & Sharp */}
                        {!loading && filteredClasses.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredClasses.map((item, index) => {
                                    const route = getClassRoute(item.name);
                                    const isActive = Boolean(route);
                                    const themeClass = isActive ? getTheme(item.name) : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed';
                                    
                                    return (
                                        <button 
                                            key={item.id} 
                                            onClick={() => route && onNavigate(route)} 
                                            disabled={!route}
                                            className={\`relative group h-64 p-8 text-left transition-all duration-200 shadow-sm border-b-4 \${themeClass}\`}
                                        >
                                            <div className="relative z-10 flex flex-col h-full justify-between">
                                                <div>
                                                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 mb-2">
                                                        Program 0{index + 1}
                                                    </div>
                                                    <div className="text-5xl font-black tracking-tighter uppercase">
                                                        {item.name}
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-3">
                                                    <span className={\`text-[10px] font-bold px-3 py-1 uppercase tracking-wider \${isActive ? 'bg-white/20 backdrop-blur-sm border border-white/30' : 'bg-slate-300/50'}\`}>
                                                        {isActive ? 'Enter Panel' : 'Locked'}
                                                    </span>
                                                    {isActive && <i className="fa-solid fa-arrow-right opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"></i>}
                                                </div>
                                            </div>
                                            
                                            {/* Background Icon */}
                                            <i className={\`fa-solid \${getIcon(item.name)} absolute -right-6 -bottom-6 text-9xl opacity-10 rotate-12 group-hover:rotate-6 group-hover:scale-105 transition-all duration-500\`}></i>
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
