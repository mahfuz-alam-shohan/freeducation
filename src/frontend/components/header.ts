export const landingHeaderComponent = `
        const LandingHeader = ({ searchQuery, onSearchChange, searchResults }) => (
            <div className="bg-blue-600 text-white py-16 px-4 text-center relative overflow-visible z-30">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">Learn Without Limits.</h1>
                    <p className="text-lg md:text-xl text-blue-100 mb-8 font-light max-w-2xl mx-auto">
                        High-quality notes, question banks, and resources for every student in Bangladesh.
                    </p>

                    <div className="max-w-xl mx-auto relative group text-left">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <i className="fas fa-search text-gray-400 group-focus-within:text-blue-500 transition"></i>
                        </div>
                        <input 
                            className="w-full py-3 pl-12 pr-6 rounded-full text-gray-800 shadow-xl focus:ring-4 focus:ring-blue-400/50 outline-none text-base transition" 
                            placeholder="Search topics, chapters, or subjects..." 
                            value={searchQuery} 
                            onChange={e => onSearchChange(e.target.value)} 
                        />
                        {searchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 bg-white rounded-xl shadow-2xl mt-2 overflow-hidden z-50 border border-gray-100 max-h-80 overflow-y-auto">
                                {searchResults.map((res, idx) => (
                                    <div key={idx} className="p-3 hover:bg-gray-50 border-b last:border-0 cursor-pointer flex items-center justify-between group/item">
                                        <span className="font-medium text-sm text-gray-700">{res.title}</span>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-1 rounded group-hover/item:bg-blue-100 group-hover/item:text-blue-600 transition">
                                            {res.type}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
`;
