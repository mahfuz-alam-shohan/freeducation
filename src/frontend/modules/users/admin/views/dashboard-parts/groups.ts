export const dashboardGroups = `
        const AdminGroupSelection = ({ classLabel, onNavigate }) => {
            const groups = [
                { title: 'Science', description: 'Physics, Chemistry, Biology' },
                { title: 'Humanities', description: 'Arts, Social Science' },
                { title: 'Business Studies', description: 'Commerce, Finance' }
            ];

            const getGroupRoute = (groupTitle) => {
                const base = String(classLabel || '').toLowerCase();
                const groupKey = String(groupTitle || '').toLowerCase().replace(/\\s+/g, '-');
                return \`admin-\${base}-\${groupKey}\`;
            };

            // Legacy Academic Colors
            const getBgColor = (title) => {
                const t = title.toLowerCase();
                if (t.includes('science')) return 'bg-[#1e3a8a]'; // Navy Blue
                if (t.includes('humanities')) return 'bg-[#7c2d12]'; // Sienna/Rust
                if (t.includes('business')) return 'bg-[#14532d]'; // Forest Green
                return 'bg-slate-700';
            };

            return (
                <AdminShell activeTab="classes" onNavigate={onNavigate}>
                    <div className="flex flex-col items-center justify-center py-8 fade-in">
                        
                        {/* Back Button */}
                        <div className="w-full max-w-4xl flex justify-start mb-4">
                            <button onClick={() => onNavigate('dashboard')} className="text-stone-500 hover:text-stone-800 font-serif italic flex items-center gap-2 transition-colors">
                                <i className="fa-solid fa-arrow-left text-xs"></i> Back to Dashboard
                            </button>
                        </div>

                        {/* Legacy Headline */}
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-black text-stone-800 font-serif tracking-tight uppercase mb-3">
                                Class {classLabel} Groups
                            </h2>
                            <div className="h-1 w-16 bg-stone-800 mx-auto opacity-20"></div>
                        </div>

                        {/* Compact Legacy Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl px-4">
                            {groups.map((group) => {
                                const bgClass = getBgColor(group.title);
                                return (
                                    <button 
                                        key={group.title} 
                                        onClick={() => onNavigate(getGroupRoute(group.title))} 
                                        className={\`relative group overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl \${bgClass}\`}
                                    >
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                                        
                                        <div className="relative p-6 flex flex-col items-center justify-center text-center h-full min-h-[140px]">
                                            <div className="font-serif italic text-white/70 text-[10px] uppercase tracking-[0.2em] mb-2">DIVISION</div>
                                            <div className="text-2xl font-bold text-white font-serif mb-1">{group.title}</div>
                                            <div className="h-px w-8 bg-white/30 my-3"></div>
                                            <p className="text-white/80 text-xs font-serif italic opacity-80">{group.description}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
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
            const { viewMode, setViewMode, viewOptions } = useDashboardViewPreference();
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
                <AdminShell activeTab="classes" onNavigate={onNavigate}>
                    <div className="flex flex-col items-center justify-center py-4 fade-in">
                        <div className="w-full max-w-6xl flex flex-wrap gap-3 justify-between items-center mb-8">
                            <button onClick={() => onNavigate(groupRoute)} className="text-stone-500 hover:text-stone-800 font-serif italic flex items-center gap-2 transition-colors">
                                <i className="fa-solid fa-arrow-left text-xs"></i> Back to Groups
                            </button>
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="text-stone-400 font-serif italic text-sm">{classLabel} • {groupLabel}</div>
                                <DashboardViewToggle viewMode={viewMode} onChange={setViewMode} options={viewOptions} />
                            </div>
                        </div>

                        {subjects.length === 0 && <div className="px-5 py-4 text-sm text-gray-400">No subjects configured.</div>}
                        
                        {subjects.length > 0 && (
                            viewMode === 'card' ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 w-full max-w-6xl justify-items-center">
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
                                            <div key={subject} className="group w-full max-w-[150px] aspect-[1/1.618] rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-stone-200 bg-stone-900 flex flex-col">
                                                <div className="p-2 flex flex-col gap-2">
                                                    <div>
                                                        <div className="text-[9px] font-bold text-stone-300 uppercase tracking-widest">Subject</div>
                                                        <h3 className={\`text-white font-semibold leading-tight mt-1 \${isBanglaFirst ? 'font-bangla text-sm' : 'text-[11px]'}\`}>{displayLabel}</h3>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => route && onNavigate(route)} disabled={!canOpen} className={\`flex-1 py-1 text-[9px] font-bold uppercase tracking-wider rounded text-center transition-colors \${canOpen ? 'bg-white/90 text-stone-900 hover:bg-white' : 'bg-white/10 text-stone-400 cursor-not-allowed'}\`}>{canOpen ? 'Open' : 'Locked'}</button>
                                                        {canManageThumbnails && <button onClick={() => setActiveThumbnail({ title: subject, subjectKey })} className="w-7 h-7 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white rounded border border-white/10 transition-colors"><i className="fa-solid fa-camera text-[10px]"></i></button>}
                                                    </div>
                                                </div>
                                                <div className="relative flex-1 bg-stone-800 border-t border-stone-700">
                                                    {thumbnailUrl ? (
                                                        <img src={thumbnailUrl} alt={subject} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90" />
                                                    ) : (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-stone-800">
                                                            <i className="fa-solid fa-book text-stone-700 text-3xl"></i>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="w-full max-w-6xl bg-white border border-gray-200 rounded-2xl shadow-sm divide-y font-bangla">
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
                                            <div key={subject} className="w-full flex flex-wrap gap-3 items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-11 rounded-md overflow-hidden border border-gray-200 bg-gray-100">
                                                        {thumbnailUrl ? <img src={thumbnailUrl} alt={subject} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[9px] uppercase tracking-[0.2em] text-gray-300">No image</div>}
                                                    </div>
                                                    <div className="text-left">
                                                        <div className="text-[10px] uppercase tracking-[0.2em] text-gray-300">Subject</div>
                                                        <div className={\`text-sm font-semibold text-gray-900 mt-1 \${isBanglaFirst ? 'font-bangla' : ''}\`}>{displayLabel}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-[11px] font-semibold">
                                                    <button onClick={() => route && onNavigate(route)} disabled={!canOpen} className={\`px-2 py-1 rounded-md border border-gray-200 transition \${canOpen ? 'text-gray-600 hover:bg-gray-50' : 'text-gray-300 cursor-not-allowed'}\`}>{canOpen ? 'Open' : 'Locked'}</button>
                                                    {canManageThumbnails && <button onClick={() => setActiveThumbnail({ title: subject, subjectKey })} className="px-2 py-1 rounded-md border border-blue-100 text-blue-600 hover:bg-blue-50 transition">Thumbnail</button>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )
                        )}

                        {activeThumbnail && canManageThumbnails && <ThumbnailUploadModal title={activeThumbnail.title} description="Upload a subject thumbnail for public cards." uploadUrl="/api/thumbnails" keyField="subjectKey" itemKey={activeThumbnail.subjectKey} existingUrl={subjectThumbnails[activeThumbnail.subjectKey]?.url} onSaved={(thumbnail) => { setSubjectThumbnails((prev) => ({ ...prev, [thumbnail.subjectKey]: { url: thumbnail.url } })); setActiveThumbnail(null); }} onClose={() => setActiveThumbnail(null)} />}
                    </div>
                </AdminShell>
            );
        };
`;
