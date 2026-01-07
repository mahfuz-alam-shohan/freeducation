export const dashboardMain = `
        const TeacherDashboard = ({ assignment, subjectConfig, onNavigate }) => {
            const hasAssignment = assignment && assignment.level && assignment.subject;
            return (
                <TeacherShell title="Teacher Portal" subtitle="Manage your assigned subject content." activeTab="subject" onNavigate={onNavigate}>
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        {!hasAssignment && (
                            <div className="bg-white p-8 rounded-3xl border-2 border-dashed border-slate-200 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 text-slate-400 mb-4">
                                    <i className="fa-solid fa-chalkboard-user text-2xl"></i>
                                </div>
                                <h3 className="text-lg font-bold text-slate-700">No Assignment</h3>
                                <p className="text-slate-500 mt-2 text-sm">Contact an admin to assign a subject to your account.</p>
                            </div>
                        )}

                        {hasAssignment && (
                            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
                                <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
                                    {/* Decorative Background */}
                                    <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                                    <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-purple-500/30 rounded-full blur-2xl"></div>
                                    
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-200 mb-2">
                                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                            Current Assignment
                                        </div>
                                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{assignment.subject}</h2>
                                        <div className="inline-block mt-3 px-3 py-1 rounded-lg bg-indigo-500/50 text-sm font-medium border border-indigo-400/30 backdrop-blur-md">
                                            Class: {assignment.level}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 sm:p-8">
                                    <p className="text-slate-600 mb-8 leading-relaxed text-lg">
                                        {subjectConfig?.description || 'Manage chapters, videos, and quizzes for this subject.'}
                                    </p>
                                    {subjectConfig?.route ? (
                                        <button onClick={() => onNavigate(subjectConfig.route)} className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all shadow-lg shadow-slate-300 hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3">
                                            <span>Enter Classroom</span>
                                            <i className="fa-solid fa-arrow-right-long"></i>
                                        </button>
                                    ) : (
                                        <div className="p-4 bg-slate-50 text-slate-500 text-sm rounded-xl border border-slate-100 italic">
                                            <i className="fa-solid fa-lock mr-2"></i> Content tools unavailable.
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

            // Helpers for styling
            const getGradient = (name) => {
                return name.toUpperCase() === 'SSC' 
                    ? 'from-emerald-500 to-teal-600 shadow-teal-200' 
                    : 'from-blue-600 to-indigo-600 shadow-indigo-200';
            };

            return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        
                        {/* Welcome / Header Banner */}
                        <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 sm:p-10 shadow-2xl shadow-slate-200">
                            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
                            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-teal-500 rounded-full blur-3xl opacity-20"></div>
                            
                            <div className="relative z-10">
                                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Academic Programs</h2>
                                <p className="text-slate-400 max-w-lg text-sm sm:text-base leading-relaxed">
                                    Select a program level below to manage groups, subjects, and learning materials.
                                </p>
                            </div>
                        </div>

                        {/* Content Area */}
                        {loading && (
                            <div className="flex justify-center py-12">
                                <i className="fa-solid fa-circle-notch fa-spin text-slate-300 text-2xl"></i>
                            </div>
                        )}

                        {!loading && filteredClasses.length === 0 && (
                            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                                <p className="text-slate-400">No active academic programs found.</p>
                            </div>
                        )}

                        {!loading && filteredClasses.length > 0 && (
                            <div className="grid grid-cols-2 gap-4 sm:gap-6">
                                {filteredClasses.map((item) => {
                                    const route = getClassRoute(item.name);
                                    const isActive = Boolean(route);
                                    const gradientClass = isActive ? getGradient(item.name) : 'bg-slate-100 border border-slate-200';
                                    const textClass = isActive ? 'text-white' : 'text-slate-400';

                                    return (
                                        <button 
                                            key={item.id} 
                                            onClick={() => route && onNavigate(route)} 
                                            disabled={!route}
                                            className={\`relative group overflow-hidden rounded-3xl p-5 sm:p-8 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-xl \${isActive ? ('bg-gradient-to-br ' + gradientClass) : 'cursor-not-allowed'}\`}
                                        >
                                            <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                                                <div>
                                                    <div className={\`text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2 opacity-80 \${textClass}\`}>Program</div>
                                                    <div className={\`text-3xl sm:text-5xl font-black tracking-tighter \${textClass}\`}>{item.name}</div>
                                                </div>
                                                
                                                <div className="flex items-center justify-between">
                                                    <span className={\`text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider \${isActive ? 'bg-white/20 text-white backdrop-blur-md' : 'bg-slate-200 text-slate-500'}\`}>
                                                        {isActive ? 'Enter' : 'Locked'}
                                                    </span>
                                                    {isActive && <i className="fa-solid fa-circle-arrow-right text-white/90 text-xl group-hover:translate-x-1 transition-transform"></i>}
                                                </div>
                                            </div>
                                            
                                            {/* Decorative Background Icon */}
                                            {isActive && (
                                                <i className="fa-solid fa-graduation-cap absolute -bottom-6 -right-6 text-9xl opacity-10 rotate-12 group-hover:rotate-6 transition-transform"></i>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
        
            );
        };
`;
