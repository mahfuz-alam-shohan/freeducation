export const landingHeaderComponent = `
        const LandingHeader = ({ searchQuery, onSearchChange, searchResults }) => (
            <div className="bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700 text-white py-16 px-4 text-center relative overflow-visible z-30">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_60%)]"></div>
                <div className="relative z-10 max-w-5xl mx-auto">
                    <div className="flex justify-center mb-6">
                        <LogoMark className="scale-110" textClassName="text-white" subtitle="Confidence in every lesson." />
                    </div>
                    <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">Learning that feels effortless.</h1>
                    <p className="text-lg md:text-xl text-blue-100 mb-8 font-light max-w-2xl mx-auto">
                        A focused platform for quick access to notes, question banks, and learning paths tailored to every class.
                    </p>

                    <div className="max-w-2xl mx-auto relative group text-left">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <i className="fas fa-search text-gray-300 group-focus-within:text-white transition"></i>
                        </div>
                        <input 
                            className="w-full py-3.5 pl-12 pr-6 rounded-full text-gray-900 shadow-2xl focus:ring-4 focus:ring-blue-400/50 outline-none text-base transition bg-white/95"
                            placeholder="Search topics, chapters, or subjects..." 
                            value={searchQuery} 
                            onChange={e => onSearchChange(e.target.value)} 
                        />
                        {searchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 bg-white rounded-2xl shadow-2xl mt-3 overflow-hidden z-50 border border-gray-100 max-h-80 overflow-y-auto">
                                {searchResults.map((res, idx) => (
                                    <div key={idx} className="p-3 hover:bg-blue-50 border-b last:border-0 cursor-pointer flex items-center justify-between group/item">
                                        <span className="font-medium text-sm text-gray-700">{res.title}</span>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-1 rounded-full group-hover/item:bg-blue-100 group-hover/item:text-blue-600 transition">
                                            {res.type}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                        {[
                            { icon: 'fa-graduation-cap', title: 'Structured Learning', desc: 'Keep chapters, topics, and questions organized by class.' },
                            { icon: 'fa-bolt', title: 'Fast Navigation', desc: 'Jump straight into what you need with smart filters.' },
                            { icon: 'fa-users-gear', title: 'Admin Ready', desc: 'Manage content, notes, and banks with clarity.' }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white/10 rounded-2xl p-4 border border-white/10">
                                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-3">
                                    <i className={\`fas \${item.icon}\`}></i>
                                </div>
                                <h3 className="font-semibold text-base">{item.title}</h3>
                                <p className="text-sm text-blue-100 mt-1">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
`;
