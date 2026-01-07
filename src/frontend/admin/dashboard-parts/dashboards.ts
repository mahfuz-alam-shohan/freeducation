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

            return (
                <AdminShell activeTab="classes" onNavigate={onNavigate}>
                    <div className="flex flex-col items-center justify-center py-12 animate-in fade-in slide-in-from-bottom-4">
                        
                        {/* Legacy Headline */}
                        <div className="text-center mb-12">
                            <h2 className="text-4xl sm:text-5xl font-black text-stone-800 font-serif tracking-tight uppercase mb-3">Academic Programs</h2>
                            <div className="h-1 w-24 bg-stone-800 mx-auto opacity-20"></div>
                            <p className="mt-4 text-stone-500 font-serif italic text-lg">Select a curriculum level to proceed</p>
                        </div>

                        {/* Content Area */}
                        {loading && (
                            <div className="flex justify-center py-12">
                                <i className="fa-solid fa-circle-notch fa-spin text-stone-400 text-2xl"></i>
                            </div>
                        )}

                        {!loading && filteredClasses.length > 0 && (
                            <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
                                {filteredClasses.map((item) => {
                                    const route = getClassRoute(item.name);
                                    const isActive = Boolean(route);
                                    const isSSC = item.name === 'SSC';
                                    // Deep academic colors
                                    const bgClass = isSSC ? 'bg-[#0f766e]' : 'bg-[#1e3a8a]'; // Teal-700 vs Blue-900
                                    
                                    return (
                                        <button 
                                            key={item.id} 
                                            onClick={() => route && onNavigate(route)} 
                                            disabled={!route}
                                            className={\`relative group overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl \${bgClass} \${isActive ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'}\`}
                                        >
                                            {/* Decorative Corner */}
                                            <div className="absolute top-0 right-0 p-3 opacity-20">
                                                <i className="fa-solid fa-graduation-cap text-4xl text-white"></i>
                                            </div>

                                            <div className="relative p-6 sm:p-8 flex flex-col items-center justify-center text-center h-full min-h-[160px]">
                                                <div className="font-serif italic text-white/70 text-xs tracking-[0.2em] mb-2 border-b border-white/20 pb-1">PROGRAM</div>
                                                <div className="text-4xl sm:text-5xl font-black text-white font-serif">{item.name}</div>
                                                
                                                {isActive ? (
                                                     <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold bg-white text-slate-900 px-3 py-1 rounded uppercase tracking-wider">
                                                        Enter Panel
                                                     </div>
                                                ) : (
                                                    <div className="mt-4 text-white/40 text-xs"><i className="fa-solid fa-lock"></i></div>
                                                )}
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
