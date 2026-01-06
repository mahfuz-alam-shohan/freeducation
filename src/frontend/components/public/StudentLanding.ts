export const StudentLandingComponent = `
const StudentLanding = ({ onNavigate }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    // Mock search function - replace with real search logic or pass as prop
    useEffect(() => {
        if (searchTerm.length > 2) {
            // Simulate search
            const results = [
                { id: 1, title: 'Physics: Motion', type: 'chapter', route: 'public-ssc-physics-topic' },
                { id: 2, title: 'Bangla: Kobita', type: 'poem', route: 'public-bangla-ssc-poddo' },
                { id: 3, title: 'Chemistry: Periodic Table', type: 'chapter', route: 'public-ssc-chemistry-topic' }
            ].filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
            setSearchResults(results);
            setShowResults(true);
        } else {
            setSearchResults([]);
            setShowResults(false);
        }
    }, [searchTerm]);

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
            
            {/* Hero Section */}
            <div className="text-center space-y-6 py-12">
                <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight font-serif">
                    Welcome to <span className="text-blue-600">Freeducation</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Free, high-quality education for every student in Bangladesh. 
                    Master your SSC & HSC subjects with our comprehensive resources.
                </p>
                
                {/* Search Bar - FIXED Z-INDEX ISSUE */}
                <div className="max-w-xl mx-auto relative z-50">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search for subjects, topics, or questions..."
                            className="w-full px-6 py-4 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none text-lg shadow-sm transition-all pl-12"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onBlur={() => setTimeout(() => setShowResults(false), 200)}
                            onFocus={() => searchTerm.length > 2 && setShowResults(true)}
                        />
                        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"></i>
                    </div>

                    {/* Search Results Dropdown - High Z-Index to float above content */}
                    {showResults && searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                            {searchResults.map((result, idx) => (
                                <div 
                                    key={idx}
                                    className="px-6 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 flex items-center gap-3 transition-colors"
                                    onClick={() => onNavigate(result.route)}
                                >
                                    <span className="text-gray-400 text-sm bg-gray-100 px-2 py-1 rounded uppercase tracking-wider text-xs font-semibold">
                                        {result.type}
                                    </span>
                                    <span className="text-gray-700 font-medium">{result.title}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Academic Section Container - Lower Z-Index */}
            <div className="relative z-0">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <i className="fa-solid fa-graduation-cap text-blue-600 text-xl"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Academic Resources</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* SSC Card */}
                    <div 
                        onClick={() => onNavigate('ssc-subjects')}
                        className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 cursor-pointer overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                            <i className="fa-solid fa-school text-8xl text-blue-600"></i>
                        </div>
                        <div className="relative z-10">
                            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold mb-4">
                                Class 9-10
                            </span>
                            <h3 className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">SSC</h3>
                            <p className="text-gray-500 mb-6">Complete preparation for Secondary School Certificate.</p>
                            <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                                Explore Subjects <i className="fa-solid fa-arrow-right ml-2"></i>
                            </div>
                        </div>
                    </div>

                    {/* HSC Card */}
                    <div 
                        onClick={() => onNavigate('hsc-subjects')}
                        className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 cursor-pointer overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                            <i className="fa-solid fa-building-columns text-8xl text-emerald-600"></i>
                        </div>
                        <div className="relative z-10">
                            <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-sm font-semibold mb-4">
                                Class 11-12
                            </span>
                            <h3 className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">HSC</h3>
                            <p className="text-gray-500 mb-6">Complete preparation for Higher Secondary Certificate.</p>
                            <div className="flex items-center text-emerald-600 font-semibold group-hover:translate-x-2 transition-transform">
                                Explore Subjects <i className="fa-solid fa-arrow-right ml-2"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-gray-100">
                {[
                    { icon: 'fa-video', color: 'text-red-500', bg: 'bg-red-50', title: 'Video Lessons', desc: 'Detailed video explanations for complex topics.' },
                    { icon: 'fa-file-lines', color: 'text-orange-500', bg: 'bg-orange-50', title: 'Smart Notes', desc: 'Hand-crafted notes to help you revise quickly.' },
                    { icon: 'fa-circle-question', color: 'text-purple-500', bg: 'bg-purple-50', title: 'Practice Bank', desc: 'Thousands of MCQs and Creative Questions.' }
                ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-white hover:shadow-md transition-all">
                        <div className={\`p-3 rounded-lg \${feature.bg}\`}>
                            <i className={\`fa-solid \${feature.icon} \${feature.color} text-xl\`}></i>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-1">{feature.title}</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
`;
