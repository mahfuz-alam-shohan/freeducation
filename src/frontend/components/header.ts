export const landingHeaderComponent = `
        const LandingHeader = ({ searchQuery, onSearchChange, searchResults }) => (
            <div className="bg-blue-600 text-white py-24 px-4 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 drop-shadow-md">Learn Without Limits.</h1>
                    <p className="text-xl md:text-2xl text-blue-100 mb-10 font-light max-w-2xl mx-auto">
                        High-quality notes, question banks, and resources for every student in Bangladesh.
                    </p>

                    <div className="max-w-xl mx-auto relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <i className="fas fa-search text-gray-400 group-focus-within:text-blue-500 transition"></i>
                        </div>
                        <input 
                            className="w-full py-4 pl-12 pr-6 rounded-full text-gray-800 shadow-xl focus:ring-4 focus:ring-blue-400/50 outline-none text-lg transition" 
                            placeholder="Search topics, chapters, or subjects..." 
                            value={searchQuery} 
                            onChange={e => onSearchChange(e.target.value)} 
                        />
                        {searchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 bg-white rounded-xl shadow-2xl mt-3 overflow-hidden text-left z-20 border border-gray-100">
                                {searchResults.map((res, idx) => (
                                    <div key={idx} className="p-4 hover:bg-gray-50 border-b last:border-0 cursor-pointer flex items-center justify-between group/item">
                                        <span className="font-medium text-gray-700">{res.title}</span>
                                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-1 rounded group-hover/item:bg-blue-100 group-hover/item:text-blue-600 transition">
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
