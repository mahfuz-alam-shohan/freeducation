export const dashboardMain = `
        const TeacherDashboard = ({ assignment, subjectConfig, onNavigate }) => {
            const hasAssignment = assignment && assignment.level && assignment.subject;
            return (
                <TeacherShell title="Teacher Portal" subtitle="Manage your assigned subject content." activeTab="subject" onNavigate={onNavigate}>
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        {!hasAssignment && (
                            <div className="bg-white p-8 border border-slate-300 text-center shadow-sm">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 text-slate-400 mb-4">
                                    <i className="fa-solid fa-chalkboard-user text-2xl"></i>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">No Assignment</h3>
                                <p className="text-slate-600 mt-2 text-sm">Contact an admin to assign a subject to your account.</p>
                            </div>
                        )}

                        {hasAssignment && (
                            <div className="bg-white shadow-sm border border-slate-200">
                                {/* Header Strip */}
                                <div className="bg-white border-b border-slate-200 p-6 sm:p-8 flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-600">
                                        <span className="w-2 h-2 bg-indigo-600"></span>
                                        Current Assignment
                                    </div>
                                    <h2 className="text-3xl font-bold text-slate-900">{assignment.subject}</h2>
                                    <div className="self-start px-3 py-1 bg-slate-100 text-slate-700 text-sm font-bold border border-slate-300">
                                        Class: {assignment.level}
                                    </div>
                                </div>
                                
                                <div className="p-6 sm:p-8 bg-slate-50/50">
                                    <p className="text-slate-600 mb-8 leading-relaxed max-w-2xl">
                                        {subjectConfig?.description || 'Manage chapters, videos, and quizzes for this subject.'}
                                    </p>
                                    
                                    {subjectConfig?.route ? (
                                        <button onClick={() => onNavigate(subjectConfig.route)} className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors shadow-sm flex items-center justify-center gap-3">
                                            <span>MANAGE CONTENT</span>
                                            <i className="fa-solid fa-arrow-right"></i>
                                        </button>
                                    ) : (
                                        <div className="p-4 bg-slate-100 text-slate-500 text-sm border border-slate-200 italic flex items-center gap-2">
                                            <i className="fa-solid fa-lock"></i> Content tools unavailable.
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

            // Helper for flat colors
            const getBorderColor = (name) => {
                return name.toUpperCase() === 'SSC' 
                    ? 'border-emerald-500' 
                    : 'border-blue-600';
            };

            return (
                <AdminShell title="" subtitle="" activeTab="classes" onNavigate={onNavigate}>
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        
                        {/* Welcome Banner - Light & Clean */}
                        <div className="bg-white border-l-4 border-indigo-600 p-6 sm:p-8 shadow-sm">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">ACADEMIC PROGRAMS</h2>
                            <p className="text-slate-500 max-w-lg text-sm sm:text-base">
                                Select a program level below to manage groups, subjects, and learning materials.
                            </p>
                        </div>

                        {/* Content Area */}
                        {loading && (
                            <div className="flex justify-center py-12">
                                <i className="fa-solid fa-circle-notch fa-spin text-slate-400 text-2xl"></i>
                            </div>
                        )}

                        {!loading && filteredClasses.length === 0 && (
                            <div className="text-center py-12 bg-white border border-slate-200">
                                <p className="text-slate-400">No active academic programs found.</p>
                            </div>
                        )}

                        {!loading && filteredClasses.length > 0 && (
                            <div className="grid grid-cols-2 gap-4 sm:gap-6">
                                {filteredClasses.map((item) => {
                                    const route = getClassRoute(item.name);
                                    const isActive = Boolean(route);
                                    const borderColor = isActive ? getBorderColor(item.name) : 'border-slate-200';
                                    
                                    return (
                                        <button 
                                            key={item.id} 
                                            onClick={() => route && onNavigate(route)} 
                                            disabled={!route}
                                            className={\`relative group p-6 sm:p-8 text-left bg-white border border-slate-200 border-l-4 transition-all duration-200 hover:shadow-md \${borderColor} \${isActive ? 'hover:bg-slate-50 cursor-pointer' : 'opacity-60 cursor-not-allowed'}\`}
                                        >
                                            <div className="flex flex-col h-full justify-between gap-6">
                                                <div>
                                                    <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Program</div>
                                                    <div className="text-3xl sm:text-5xl font-black text-slate-800">{item.name}</div>
                                                </div>
                                                
                                                <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                                                    <span className={\`text-[10px] sm:text-xs font-bold px-2 py-1 uppercase tracking-wider border \${isActive ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-100 text-slate-500 border-slate-200'}\`}>
                                                        {isActive ? 'ENTER PANEL' : 'LOCKED'}
                                                    </span>
                                                    {isActive && <i className="fa-solid fa-arrow-right text-slate-400 group-hover:text-slate-900 transition-colors"></i>}
                                                </div>
                                            </div>
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
