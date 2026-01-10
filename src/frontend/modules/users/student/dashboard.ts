export const studentDashboardComponents = `
    const StudentDashboard = ({ onNavigate }) => (
        <div className="min-h-screen bg-[#f3f6ff] px-4 py-10 sm:px-8">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Student Dashboard</h1>
                    <p className="text-slate-600">Pick up where you left off or explore new lessons.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <button onClick={() => onNavigate('ssc-subjects')} className="bg-white border border-slate-200 rounded-2xl p-6 text-left shadow-sm hover:shadow-md transition">
                        <div className="text-xs font-semibold uppercase tracking-widest text-indigo-600">SSC</div>
                        <div className="mt-3 text-lg font-semibold text-slate-900">SSC Subjects</div>
                        <div className="mt-1 text-sm text-slate-500">Explore SSC course materials.</div>
                    </button>
                    <button onClick={() => onNavigate('hsc-subjects')} className="bg-white border border-slate-200 rounded-2xl p-6 text-left shadow-sm hover:shadow-md transition">
                        <div className="text-xs font-semibold uppercase tracking-widest text-indigo-600">HSC</div>
                        <div className="mt-3 text-lg font-semibold text-slate-900">HSC Subjects</div>
                        <div className="mt-1 text-sm text-slate-500">Jump into HSC learning paths.</div>
                    </button>
                    <button onClick={() => onNavigate('public-videos')} className="bg-white border border-slate-200 rounded-2xl p-6 text-left shadow-sm hover:shadow-md transition">
                        <div className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Videos</div>
                        <div className="mt-3 text-lg font-semibold text-slate-900">Watch Lectures</div>
                        <div className="mt-1 text-sm text-slate-500">Review lessons with video content.</div>
                    </button>
                </div>
            </div>
        </div>
    );
`;
