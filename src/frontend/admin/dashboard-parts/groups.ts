export const dashboardGroups = `
        const AdminGroupSelection = ({ classLabel, onNavigate }) => {
            const groups = [{ title: 'Science', description: 'Physics, Chemistry, Biology' }, { title: 'Humanities', description: 'Arts, Social Science' }, { title: 'Business Studies', description: 'Commerce, Finance' }];
            const getGroupRoute = (groupTitle) => {
                const base = String(classLabel || '').toLowerCase();
                const groupKey = String(groupTitle || '').toLowerCase().replace(/\\s+/g, '-');
                return \`admin-\${base}-\${groupKey}\`;
            };
            return (
                <AdminShell title={"Class " + classLabel} subtitle="Choose a group to manage materials." activeTab="classes" onNavigate={onNavigate}>
                    <div className="flex justify-end"><button onClick={() => onNavigate('dashboard')} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Back to Dashboard</button></div>
                    <div className="grid card-grid-gap sm:grid-cols-2 lg:grid-cols-3">
                        {groups.map((group) => (
                            <button key={group.title} onClick={() => onNavigate(getGroupRoute(group.title))} className="border border-gray-200 rounded-2xl p-5 text-left bg-white shadow-sm hover:border-gray-300 hover:bg-gray-50 transition">
                                <div className="text-left"><div className="text-xs uppercase tracking-[0.2em] text-gray-400">Group</div><div className="text-base font-semibold text-gray-900 mt-1">{group.title}</div><p className="text-xs text-gray-500 mt-2">{group.description}</p></div><div className="mt-4 text-xs uppercase tracking-[0.2em] text-blue-600">Open</div>
                            </button>
                        ))}
                    </div>
                </AdminShell>
            );
        };

        const AdminGroupDetail = ({ classLabel, groupLabel, onNavigate, canManageThumbnails }) => {
            const subjectMap = {
                SSC: {
                    Science: ['Bangla 1st Paper', 'Bangla 2nd Paper', 'English 1st Paper', 'English 2nd Paper', 'General Mathematics', 'Physics', 'Chemistry', 'Biology', 'Higher Mathematics', 'Bangladesh and Global Studies', 'Information and Communication Technology', 'Religion and Moral Education'],
                    Humanities: ['Bangla 1st Paper', 'Bangla 2nd Paper', 'English 1st Paper', 'English 2nd Paper', 'General Mathematics', 'Bangladesh and Global Studies', 'Information and Communication Technology', 'Geography and Environment', 'History of Bangladesh and World Civilization', 'Civics and Citizenship', 'Religion and Moral Education'],
                    'Business Studies': ['Bangla 1st Paper', 'Bangla 2nd Paper', 'English 1st Paper', 'English 2nd Paper', 'General Mathematics', 'Bangladesh and Global Studies', 'Information and Communication Technology', 'Accounting', 'Business Entrepreneurship', 'Finance and Banking', 'Religion and Moral Education']
                },
                HSC: {
                    Science: ['Bangla 1st Paper', 'Bangla 2nd Paper', 'English 1st Paper', 'English 2nd Paper', 'Information and Communication Technology', 'Physics 1st Paper', 'Physics 2nd Paper', 'Chemistry 1st Paper', 'Chemistry 2nd Paper', 'Biology 1st Paper', 'Biology 2nd Paper', 'Higher Mathematics 1st Paper', 'Higher Mathematics 2nd Paper'],
                    Humanities: ['Bangla 1st Paper', 'Bangla 2nd Paper', 'English 1st Paper', 'English 2nd Paper', 'Information and Communication Technology', 'Economics 1st Paper', 'Economics 2nd Paper', 'History 1st Paper', 'History 2nd Paper', 'Civics and Good Governance 1st Paper', 'Civics and Good Governance 2nd Paper', 'Logic 1st Paper', 'Logic 2nd Paper'],
                    'Business Studies': ['Bangla 1st Paper', 'Bangla 2nd Paper', 'English 1st Paper', 'English 2nd Paper', 'Information and Communication Technology', 'Accounting 1st Paper', 'Accounting 2nd Paper', 'Business Organization and Management 1st Paper', 'Business Organization and Management 2nd Paper', 'Finance, Banking and Insurance 1st Paper', 'Finance, Banking and Insurance 2nd Paper', 'Production Management and Marketing 1st Paper', 'Production Management and Marketing 2nd Paper']
                }
            };
            const [subjectThumbnails, setSubjectThumbnails] = useThumbnailMap('/api/thumbnails', 'subjectKey');
            const [activeThumbnail, setActiveThumbnail] = useState(null);
            const subjects = subjectMap[classLabel]?.[groupLabel] || [];
            const groupRoute = classLabel === 'SSC' ? 'admin-groups-ssc' : 'admin-groups-hsc';
            const banglaRoute = classLabel === 'SSC' ? 'bangla-ssc-1st-paper' : 'bangla-hsc-1st-paper';
            const englishRoute = classLabel === 'HSC' ? 'english-hsc-1st-paper' : null;
            const ictRoute = classLabel === 'SSC' ? 'admin-ssc-ict' : null;
            const hscIctRoute = classLabel === 'HSC' ? 'admin-hsc-ict' : null;
            const bangladeshGlobalRoute = classLabel === 'SSC' ? 'admin-ssc-bangladesh-global-studies' : null;
            const religionRoute = classLabel === 'SSC' ? 'admin-ssc-religion' : null;
            const physicsRoute = classLabel === 'SSC' ? 'admin-ssc-physics' : null;
            const chemistryRoute = classLabel === 'SSC' ? 'admin-ssc-chemistry' : null;
            const biologyRoute = classLabel === 'SSC' ? 'admin-ssc-biology' : null;
            const hscPhysics1Route = classLabel === 'HSC' ? 'admin-hsc-physics-1st' : null;
            const hscPhysics2Route = classLabel === 'HSC' ? 'admin-hsc-physics-2nd' : null;
            const hscChem1Route = classLabel === 'HSC' ? 'admin-hsc-chemistry-1st' : null;
            const hscChem2Route = classLabel === 'HSC' ? 'admin-hsc-chemistry-2nd' : null;
            const hscBio1Route = classLabel === 'HSC' ? 'admin-hsc-biology-1st' : null;
            const hscBio2Route = classLabel === 'HSC' ? 'admin-hsc-biology-2nd' : null;

            return (
                <AdminShell title={\`\${classLabel} - \${groupLabel}\`} subtitle="Manage the subject list for this group." activeTab="classes" onNavigate={onNavigate}>
                    <div className="flex justify-between items-center">
                        <button onClick={() => onNavigate(groupRoute)} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Back to Groups</button>
                        <button onClick={() => onNavigate('dashboard')} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Back to Dashboard</button>
                    </div>
                    {subjects.length === 0 && <div className="px-5 py-4 text-sm text-gray-400">No subjects configured.</div>}
                    {subjects.length > 0 && (
                        <div className="grid card-grid-gap sm:grid-cols-2 lg:grid-cols-3">
                            {subjects.map((subject) => {
                                const isBanglaFirst = subject === 'Bangla 1st Paper';
                                const isEnglishFirst = subject === 'English 1st Paper' && classLabel === 'HSC';
                                const isIct = subject === 'Information and Communication Technology';
                                const isPhysics = subject === 'Physics' && classLabel === 'SSC';
                                const isChemistry = subject === 'Chemistry' && classLabel === 'SSC';
                                const isBiology = subject === 'Biology' && classLabel === 'SSC';
                                const isBangladeshGlobal = subject === 'Bangladesh and Global Studies' && classLabel === 'SSC';
                                const isReligionMoral = subject === 'Religion and Moral Education' && classLabel === 'SSC';
                                const isHscPhysics1 = subject === 'Physics 1st Paper' && classLabel === 'HSC';
                                const isHscPhysics2 = subject === 'Physics 2nd Paper' && classLabel === 'HSC';
                                const isHscChem1 = subject === 'Chemistry 1st Paper' && classLabel === 'HSC';
                                const isHscChem2 = subject === 'Chemistry 2nd Paper' && classLabel === 'HSC';
                                const isHscBio1 = subject === 'Biology 1st Paper' && classLabel === 'HSC';
                                const isHscBio2 = subject === 'Biology 2nd Paper' && classLabel === 'HSC';
                                const displayLabel = isBanglaFirst ? 'বাংলা ১ম পত্র' : isIct ? 'আইসিটি' : subject;
                                const route = isBanglaFirst ? banglaRoute : isEnglishFirst ? englishRoute : isIct ? (classLabel === 'SSC' ? ictRoute : hscIctRoute) : isBangladeshGlobal ? bangladeshGlobalRoute : isReligionMoral ? religionRoute : isPhysics ? physicsRoute : isChemistry ? chemistryRoute : isBiology ? biologyRoute : isHscPhysics1 ? hscPhysics1Route : isHscPhysics2 ? hscPhysics2Route : isHscChem1 ? hscChem1Route : isHscChem2 ? hscChem2Route : isHscBio1 ? hscBio1Route : hscBio2Route;
                                const subjectKey = makeThumbnailKey(subject, classLabel);
                                const thumbnailUrl = subjectThumbnails[subjectKey]?.url;
                                const canOpen = Boolean(route);
                                return (
                                    <div key={subject} className="border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden">
                                        <div className="h-36 bg-gray-100 border-b border-gray-200">
                                            {thumbnailUrl ? <img src={thumbnailUrl} alt={subject} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-[0.3em] text-gray-300">No image</div>}
                                        </div>
                                        <div className="p-4">
                                            <div className="text-xs uppercase tracking-[0.2em] text-gray-400">Subject</div>
                                            <div className={\`text-base font-semibold text-gray-900 mt-2 \${isBanglaFirst ? 'font-bangla' : ''}\`}>{displayLabel}</div>
                                            <p className="text-xs text-gray-500 mt-2">Manage chapters, topics, and content tools.</p>
                                            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                                                <button onClick={() => route && onNavigate(route)} className={\`px-3 py-1.5 rounded-md border transition \${canOpen ? 'border-gray-200 text-gray-600 hover:bg-gray-50' : 'border-gray-100 text-gray-300 cursor-not-allowed'}\`} disabled={!canOpen}>Open</button>
                                                {canManageThumbnails && <button onClick={() => setActiveThumbnail({ title: subject, subjectKey })} className="px-3 py-1.5 rounded-md border border-blue-100 text-blue-600 hover:bg-blue-50 transition">Thumbnail</button>}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {activeThumbnail && canManageThumbnails && <ThumbnailUploadModal title={activeThumbnail.title} description="Upload a subject thumbnail for public cards." uploadUrl="/api/thumbnails" keyField="subjectKey" itemKey={activeThumbnail.subjectKey} existingUrl={subjectThumbnails[activeThumbnail.subjectKey]?.url} onSaved={(thumbnail) => { setSubjectThumbnails((prev) => ({ ...prev, [thumbnail.subjectKey]: { url: thumbnail.url } })); setActiveThumbnail(null); }} onClose={() => setActiveThumbnail(null)} />}
                </AdminShell>
            );
        };
`;
