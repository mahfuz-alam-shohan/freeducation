export const  PublicEnglishCardGrid =`
 const PublicEnglishCardGrid = ({ items, onNavigate }) => (
            <div className={'grid justify-items-center ' + cardGridGapClass + ' sm:grid-cols-2'}>
                {items.map((item) => (
                    <button
                        key={item.key}
                        onClick={() => item.route && onNavigate(item.route)}
                        className="w-full border border-slate-200 rounded-md p-4 text-center hover:border-slate-300 hover:bg-slate-50 transition"
                    >
                        <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Section</div>
                        <div className="text-lg font-semibold text-slate-900 mt-2">{item.title}</div>
                        <p className="text-sm text-slate-500 mt-2">{item.description}</p>
                    </button>
                ))}
            </div>
        );

`;
