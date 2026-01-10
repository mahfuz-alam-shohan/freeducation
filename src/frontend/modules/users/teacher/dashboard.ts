export const teacherDashboardComponents = `
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
`;
