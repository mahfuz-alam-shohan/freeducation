export const studentDashboardComponents = `
    const StudentClassView = ({ user, onNavigate }) => {
        const classLabel = user?.classLabel || user?.class_label || '';
        const groupLabel = user?.groupLabel || user?.group_label || '';
        const hasClass = Boolean(classLabel);
        const classSubjects = classLabel === 'HSC' ? hscSubjects : sscSubjects;
        const subjectPool = Array.isArray(classSubjects) ? classSubjects : [];
        const normalizedGroup = groupLabel || 'Common';
        const filteredSubjects = subjectPool.filter((subject) => {
            if (!groupLabel) return true;
            const groups = subject.groups || [];
            return groups.includes(groupLabel) || subject.groupLabel === 'Common';
        });
        const classRoute = classLabel === 'HSC' ? 'hsc-subjects' : 'ssc-subjects';

        return (
            <StudentShell
                title="My Class"
                subtitle={hasClass ? classLabel + (groupLabel ? ' • ' + groupLabel : '') + ' learning space' : 'Connect your class to see content'}
                activeTab="class"
                onNavigate={onNavigate}
            >
                <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <div className="text-xs uppercase tracking-[0.25em] text-slate-400">Your Class</div>
                            <div className="mt-2 text-2xl font-semibold text-slate-900">
                                {hasClass ? classLabel : 'No class assigned'}
                            </div>
                            {hasClass && (
                                <div className="mt-1 text-sm text-slate-500">
                                    {groupLabel ? groupLabel + ' group' : 'General group'}
                                </div>
                            )}
                        </div>
                        {hasClass && (
                            <button
                                onClick={() => onNavigate(classRoute)}
                                className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-[0.2em] border border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600 transition"
                            >
                                View full library
                            </button>
                        )}
                    </div>
                    {!hasClass && (
                        <div className="text-sm text-slate-500">
                            Your account does not have a class assigned yet. Please contact your teacher or admin.
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    <div className="text-xs uppercase tracking-[0.3em] text-slate-400">Subjects</div>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {filteredSubjects.map((subject) => (
                            <button
                                key={subject.subjectKey}
                                onClick={() => subject.route && onNavigate(subject.route)}
                                className="group w-full text-left bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
                            >
                                <div className="flex items-start gap-4">
                                    <div className={'w-10 h-10 rounded-xl text-white flex items-center justify-center shadow-sm ' + subject.accent}>
                                        <i className={'fa-solid ' + subject.icon}></i>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-semibold text-slate-900">{subject.title}</div>
                                        {subject.subtitle && <div className="text-xs text-slate-500 mt-1">{subject.subtitle}</div>}
                                        <div className="text-xs text-slate-400 mt-2">
                                            {subject.groupLabel === 'Common' ? 'Common subject' : normalizedGroup + ' group'}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 text-xs font-semibold text-indigo-600">Open subject</div>
                            </button>
                        ))}
                        {filteredSubjects.length === 0 && (
                            <div className="col-span-full bg-white border border-dashed border-slate-200 rounded-2xl p-6 text-center text-sm text-slate-500">
                                No subjects available for this class yet.
                            </div>
                        )}
                    </div>
                </div>
            </StudentShell>
        );
    };
`;
