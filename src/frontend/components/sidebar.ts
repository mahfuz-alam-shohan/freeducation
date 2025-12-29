export const classSidebarComponent = `
        const ClassSidebar = ({ cls, groups, selectedGroupId, onSelectGroup }) => (
            <div className="w-full md:w-72 flex-shrink-0">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                    <h3 className="font-bold text-gray-900 mb-1 text-lg">{cls.name}</h3>
                    <p className="text-xs text-gray-500 mb-6 uppercase tracking-wider">Filter by Group</p>

                    <div className="space-y-2">
                        <button 
                            onClick={() => onSelectGroup(null)}
                            className={\`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition flex justify-between items-center \${selectedGroupId === null ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}\`}
                        >
                            Common / All
                            {selectedGroupId === null && <i className="fas fa-check"></i>}
                        </button>
                        {groups.map(g => (
                            <button 
                                key={g.id}
                                onClick={() => onSelectGroup(g.id)}
                                className={\`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition flex justify-between items-center \${selectedGroupId === g.id ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}\`}
                            >
                                {g.name}
                                {selectedGroupId === g.id && <i className="fas fa-check"></i>}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
`;
