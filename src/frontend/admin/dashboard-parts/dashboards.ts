export const dashboardMain = `
        const TeacherDashboard = ({ assignment, subjectConfig, onNavigate }) => {
            const hasAssignment = assignment && assignment.level && assignment.subject;
            return (
                <TeacherShell title="Teacher Portal" subtitle="Manage your assigned subject content." activeTab="subject" onNavigate={onNavigate}>
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        {!hasAssignment && (
                            <div className="bg-white p-8 border border-slate-200 text-center shadow-sm">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 text-slate-400 mb-4 rounded-md">
                                    <i className="fa-solid fa-chalkboard-user text-2xl"></i>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">No Assignment</h3>
                                <p className="text-slate-600 mt-2 text-sm">Contact an admin to assign a subject to your account.</p>
                            </div>
                        )}

                        {hasAssignment && (
                            <div className="bg-white shadow-sm border border-slate-200">
                                {/* Header Strip - Sharp Corners */}
                                <div className="bg-indigo-600 p-6 sm:p-8 flex flex-col gap-2 relative overflow-hidden">
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-200">
                                            <span className="w-2 h-2 bg-green-400 animate-pulse rounded-full"></span>
                                            Current Assignment
                                        </div>
                                        <h2 className="text-3xl font-bold text-white mt-1">{assignment.subject}</h2>
                                        <div className="inline-block mt-3 px-3 py-1 bg-indigo-500 text-white text-xs font-bold rounded-md uppercase tracking-wider">
                                            Class: {assignment.level}
                                        </div>
                                    </div>
                                    {/* Abstract BG Pattern */}
                                    <i className="fa-solid fa-book-open absolute -right-6 -bottom-6 text-9xl text-indigo-500 opacity-20 rotate-12"></i>
                                </div>
                                
                                <div className="p-6 sm:p-8 bg-white">
                                    <p className="text-slate-600 mb-8 leading-relaxed max-w-2xl text-lg">
                                        {subjectConfig?.description || 'Manage chapters, videos, and quizzes for this subject.'}
                                    </p>
                                    
                                    {subjectConfig?.route ? (
                                        <button onClick={() => onNavigate(subjectConfig.route)} className="w-full sm:w-auto px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all shadow-lg hover:shadow-xl rounded-md flex items-center justify-center gap-3">
                                            <span>MANAGE CONTENT</span>
                                            <i className="fa-solid fa-arrow-right"></i>
                                        </button>
                                    ) : (
                                        <div className="p-4 bg-slate-50 text-slate-500 text-sm border border-slate-200 italic flex items-center gap-2 rounded-md">
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

            // Previous Colors requested by user
            const getGradient = (name) => {
                return name.toUpperCase() === 'SSC' 
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-200' 
                    : 'bg-gradient-to-br from-blue-600 to-indigo-600 shadow-indigo-200';
            };

            const getIcon = (name) => {
                 return name.toUpperCase() === 'SSC' ? 'fa-flask' : 'fa-graduation-cap';
            };

            return (
                <AdminShell title="Academic Control" subtitle="Overview of your academy structure." activeTab="classes" onNavigate={onNavigate}>
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        
                        {/* Welcome Banner - Clean & Boxy */}
                        <div className="bg-white border-l-4 border-indigo-600 p-6 sm:p-8 shadow-sm">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2 uppercase tracking-tight">Academic Programs</h2>
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
                            <div className="text-center py-12 bg-white border border-slate-200 shadow-sm">
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
                                            className={\`relative group p-6 sm:p-8 text-left transition-all duration-300 hover:scale-[1.01] hover:shadow-xl rounded-sm \${gradientClass} \${isActive ? 'cursor-pointer' : 'cursor-not-allowed'}\`}
                                        >
                                            <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                                                <div>
                                                    <div className={\`text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2 opacity-80 \${textClass}\`}>Program</div>
                                                    <div className={\`text-3xl sm:text-5xl font-black tracking-tight \${textClass}\`}>{item.name}</div>
                                                </div>
                                                
                                                <div className="flex items-center justify-between">
                                                    <span className={\`text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wider \${isActive ? 'bg-white/20 text-white backdrop-blur-md border border-white/30' : 'bg-slate-200 text-slate-500'}\`}>
                                                        {isActive ? 'Enter Panel' : 'Locked'}
                                                    </span>
                                                    {isActive && <i className="fa-solid fa-arrow-right text-white/90 text-xl group-hover:translate-x-1 transition-transform"></i>}
                                                </div>
                                            </div>
                                            
                                            {/* Decorative Background Icon */}
                                            {isActive && (
                                                <i className={\`fa-solid \${getIcon(item.name)} absolute -bottom-6 -right-6 text-9xl text-white opacity-10 rotate-12 group-hover:rotate-6 transition-transform\`}></i>
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
