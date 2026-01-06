export const PublicSidebar =`
 const PublicSidebar = ({ title, subtitle, onBack, onNavigate }) => {
            const [trail, setTrail] = useState(buildHierarchyTrail());

            useEffect(() => {
                setTrail(buildHierarchyTrail());
            }, [title, subtitle]);

            return (
                <aside className="hidden lg:flex lg:w-64 border-r border-gray-200 bg-white p-6 shrink-0">
                    <div className="flex flex-col gap-6 w-full">
                        <div>
                            <div className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Hierarchy</div>
                            <div className="mt-3 space-y-2">
                                {trail.map((item, index) => {
                                    const view = getViewFromPath(item.path);
                                    return (
                                        <button
                                            key={item.path}
                                            onClick={() => onNavigate(view)}
                                            className={\`w-full text-left text-sm font-semibold transition \${index === trail.length - 1 ? 'text-blue-700' : 'text-slate-600 hover:text-slate-900'}\`}
                                        >
                                            {item.label}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="mt-4 text-xs text-slate-500">
                                {title}
                                {subtitle ? \` · \${subtitle}\` : ''}
                            </div>
                        </div>
                        <div>
                            <div className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Shortcuts</div>
                            <div className="mt-3 space-y-2">
                                {onBack && (
                                    <button
                                        onClick={onBack}
                                        className="w-full text-left text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
                                    >
                                        Back
                                    </button>
                                )}
                                <button
                                    onClick={() => onNavigate('landing')}
                                    className="w-full text-left text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
                                >
                                    Home
                                </button>
                                <button
                                    onClick={() => onNavigate('public-videos')}
                                    className="w-full text-left text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
                                >
                                    Videos
                                </button>
                                <button
                                    onClick={() => onNavigate('ssc-subjects')}
                                    className="w-full text-left text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
                                >
                                    SSC Subjects
                                </button>
                                <button
                                    onClick={() => onNavigate('hsc-subjects')}
                                    className="w-full text-left text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
                                >
                                    HSC Subjects
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>
            );
        };

`;
