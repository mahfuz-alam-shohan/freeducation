export const classSidebarComponent = `
        const ClassSidebar = ({ cls, groups, selectedGroupId, onSelectGroup }) => (
            <div className="w-full lg:w-72 flex-shrink-0 lg:sticky lg:top-24 h-fit">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-2 text-xl">{cls.name}</h3>
                    <p className="text-xs text-gray-500 mb-6 uppercase tracking-wider font-bold">Filter Content</p>

                    <div className="space-y-2">
                        <button 
                            onClick={() => onSelectGroup(null)}
                            className={\`w-full text-left px-4 py-3.5 rounded-xl text-sm font-bold transition-all flex justify-between items-center \${selectedGroupId === null ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}\`}
                        >
                            <span className="flex items-center"><i className="fas fa-th-large mr-3 opacity-70"></i> All Subjects</span>
                            {selectedGroupId === null && <i className="fas fa-check-circle"></i>}
                        </button>
                        {groups.map(g => (
                            <button 
                                key={g.id}
                                onClick={() => onSelectGroup(g.id)}
                                className={\`w-full text-left px-4 py-3.5 rounded-xl text-sm font-bold transition-all flex justify-between items-center \${selectedGroupId === g.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}\`}
                            >
                                <span className="flex items-center"><i className="fas fa-user-group mr-3 opacity-70"></i> {g.name}</span>
                                {selectedGroupId === g.id && <i className="fas fa-check-circle"></i>}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
`;

