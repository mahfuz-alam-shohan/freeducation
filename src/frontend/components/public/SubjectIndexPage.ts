export const SubjectIndexPageComponent = `
const SubjectIndexPage = ({ classLabel, subjects, onNavigate }) => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-12 text-center">
                 <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold mb-4">
                    {classLabel}
                 </span>
                 <h1 className="text-4xl font-extrabold text-gray-900 mb-4 font-serif">Select a Subject</h1>
                 <p className="text-lg text-gray-600">Choose your subject to start learning.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {subjects.map((subject, idx) => (
                    <div 
                        key={idx}
                        onClick={() => onNavigate(subject.route)}
                        className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg border border-gray-100 transition-all cursor-pointer group flex flex-col items-center text-center"
                    >
                        <div className={\`w-16 h-16 rounded-2xl \${subject.color || 'bg-blue-50 text-blue-600'} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform\`}>
                            <i className={\`fa-solid \${subject.icon || 'fa-book'}\`}></i>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{subject.name}</h3>
                        <p className="text-sm text-gray-500">Explore chapters & resources</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
`;
