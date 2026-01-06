export const  PublicEnglishTypeList =`
const PublicEnglishTypeList = ({ items, onSelect }) => (
            <div className="border-y border-slate-200 divide-y">
                {items.map((item) => (
                    <button
                        key={item.key}
                        onClick={() => onSelect(item)}
                        className="w-full flex items-center justify-between px-2 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition text-left"
                    >
                        <div className="text-left space-y-1">
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Question type</div>
                            <div className="text-base font-semibold text-slate-900">{item.label}</div>
                            {item.description && <p className="text-xs text-slate-500">{item.description}</p>}
                            {item.children?.length > 0 && (
                                <p className="text-xs text-indigo-500">
                                    Includes {item.children.map((child) => child.label).join(', ')}
                                </p>
                            )}
                        </div>
                        <span className="text-xs uppercase tracking-[0.2em] text-indigo-600">Open</span>
                    </button>
                ))}
                {items.length === 0 && (
                    <div className="px-2 py-4 text-sm text-slate-400">No question types available yet.</div>
                )}
            </div>
        );

`;
