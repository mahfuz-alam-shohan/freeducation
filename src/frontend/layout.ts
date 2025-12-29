import { landingHeaderComponent } from "./components/header";
import { navBarComponent } from "./components/navbar";
import { classSidebarComponent } from "./components/sidebar";

export function renderAppHtml(initialView: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Freeducation - Learning Platform</title>
    
    <!-- Dependencies -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">

    <style>
        body { font-family: 'Inter', sans-serif; background-color: #f8fafc; color: #1e293b; }
        .font-serif { font-family: 'Playfair Display', serif; }
        .glass-panel { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(8px); }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    </style>
</head>
<body>
    <div id="root"></div>

    <script>
        window.__INITIAL_VIEW = ${JSON.stringify(initialView)};
    </script>
    <script type="text/babel">
        const { useState, useEffect } = React;

        // --- SHARED UI COMPONENTS ---

        const Loading = () => (
            <div className="flex items-center justify-center h-screen text-blue-600">
                <i className="fas fa-circle-notch fa-spin text-3xl"></i>
            </div>
        );

        const Button = ({ children, onClick, variant = 'primary', className = '', size = 'md', ...props }) => {
            const variants = {
                primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
                secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
                danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100",
                ghost: "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
            };
            const sizes = {
                sm: "px-2 py-1 text-xs",
                md: "px-3 py-2 text-sm",
                lg: "px-4 py-3 text-base"
            };
            return (
                <button 
                    onClick={onClick} 
                    className={\`rounded-lg font-medium transition-all transform active:scale-95 \${variants[variant]} \${sizes[size]} \${className}\`} 
                    {...props}
                >
                    {children}
                </button>
            );
        };

        const Input = ({ label, ...props }) => (
            <div className="mb-3">
                {label && <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>}
                <input 
                    {...props} 
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white" 
                />
            </div>
        );

        const Modal = ({ isOpen, onClose, title, children }) => {
            if (!isOpen) return null;
            return (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col animate-fade-in">
                        <div className="px-4 py-3 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="text-md font-bold text-gray-800">{title}</h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto">
                            {children}
                        </div>
                    </div>
                </div>
            );
        };

        // --- LAYOUT COMPONENTS ---
${navBarComponent}
${landingHeaderComponent}
${classSidebarComponent}

        // --- MAIN APP CONTAINER ---

        function App() {
            const [view, setView] = useState(window.__INITIAL_VIEW || 'landing'); // 'landing', 'login', 'register', 'admin'
            const [user, setUser] = useState(null);
            const [hasAdmin, setHasAdmin] = useState(null);

            // Initial System Check
            useEffect(() => {
                const initSystem = async () => {
                    await fetch('/api/init', { method: 'POST' }); // Ensure DB is ready
                    const res = await fetch('/api/setup-status');
                    const data = await res.json();
                    setHasAdmin(data.hasAdmin);
                };
                initSystem();
            }, []);

            const handleLogin = async (username, password) => {
                const res = await fetch('/api/login', {
                    method: 'POST',
                    body: JSON.stringify({ username, password })
                });
                const data = await res.json();
                if (data.success) {
                    setUser({ username: data.username });
                    setView('admin');
                } else {
                    alert(data.error);
                }
            };

            const handleRegister = async (username, password) => {
                const res = await fetch('/api/register-admin', {
                    method: 'POST',
                    body: JSON.stringify({ username, password })
                });
                const data = await res.json();
                if (data.success) {
                    alert("Admin created successfully. Please login.");
                    setHasAdmin(true);
                    setView('login');
                } else {
                    alert(data.error);
                }
            };

            if (hasAdmin === null) return <Loading />;

            return (
                <div className="min-h-screen flex flex-col">
                    {/* Navigation Bar */}
                    <NavBar user={user} hasAdmin={hasAdmin} onNavigate={setView} />

                    {/* Main Content Area */}
                    <main className="flex-grow bg-gray-50 flex flex-col">
                        {view === 'landing' && <StudentLandingPage />}
                        {view === 'login' && <AuthForm mode="login" onSubmit={handleLogin} />}
                        {view === 'register' && <AuthForm mode="register" onSubmit={handleRegister} />}
                        {view === 'admin' && user && (
                            <AdminDashboard user={user} logout={() => { setUser(null); setView('landing'); }} />
                        )}
                    </main>
                </div>
            );
        }

        // --- STUDENT FRONTEND COMPONENTS ---

        function StudentLandingPage() {
            const [classes, setClasses] = useState([]);
            const [searchQuery, setSearchQuery] = useState('');
            const [searchResults, setSearchResults] = useState([]);
            const [selectedClass, setSelectedClass] = useState(null);

            useEffect(() => {
                fetch('/api/classes').then(res => res.json()).then(setClasses);
            }, []);

            useEffect(() => {
                if (searchQuery.length > 2) {
                    const timer = setTimeout(() => {
                        fetch(\`/api/search?q=\${searchQuery}\`).then(res => res.json()).then(setSearchResults);
                    }, 300);
                    return () => clearTimeout(timer);
                } else {
                    setSearchResults([]);
                }
            }, [searchQuery]);

            if (selectedClass) {
                return <StudentClassView cls={selectedClass} onBack={() => setSelectedClass(null)} />;
            }

            return (
                <div className="animate-fade-in pb-12">
                    {/* Hero Section */}
                    <LandingHeader
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        searchResults={searchResults}
                    />

                    {/* Class Browser */}
                    <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
                        <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                <i className="fas fa-layer-group text-blue-600 mr-2"></i> Available Classes
                            </h2>
                            {classes.length === 0 ? (
                                <div className="text-center py-10 text-gray-400 text-sm">No classes added yet.</div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {classes.map(cls => (
                                        <div 
                                            key={cls.id} 
                                            onClick={() => setSelectedClass(cls)} 
                                            className="bg-gray-50 rounded-lg p-4 hover:bg-blue-50 cursor-pointer border border-transparent hover:border-blue-200 hover:-translate-y-1 transition-all group shadow-sm"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-blue-600 text-lg font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                    {cls.name.replace(/[^0-9]/g,'') || cls.name[0]}
                                                </div>
                                                {cls.program_label && (
                                                    <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full uppercase">
                                                        {cls.program_label}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="font-bold text-sm md:text-base text-gray-900 mb-1">{cls.name}</h3>
                                            <p className="text-[10px] text-gray-500 flex items-center">
                                                {cls.parent_class_id ? (
                                                    <><i className="fas fa-link mr-1"></i> Linked Content</>
                                                ) : (
                                                    <><i className="fas fa-database mr-1"></i> Original</>
                                                )}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        function StudentClassView({ cls, onBack }) {
            const [groups, setGroups] = useState([]);
            const [subjects, setSubjects] = useState([]);
            const [selectedGroupId, setSelectedGroupId] = useState(null);
            const [selectedSubject, setSelectedSubject] = useState(null);

            useEffect(() => {
                const fetchData = async () => {
                    const [groupsRes, subjectsRes] = await Promise.all([
                        fetch(\`/api/groups?class_id=\${cls.id}\`),
                        fetch(\`/api/subjects?class_id=\${cls.id}\`)
                    ]);
                    setGroups(await groupsRes.json());
                    setSubjects(await subjectsRes.json());
                };
                fetchData();
            }, [cls]);

            if (selectedSubject) {
                return <StudentSubjectView subject={selectedSubject} onBack={() => setSelectedSubject(null)} />;
            }

            const displayedSubjects = subjects.filter(s => s.is_common || (selectedGroupId && s.group_id === selectedGroupId));

            return (
                <div className="max-w-6xl mx-auto px-4 py-6 animate-fade-in min-h-screen">
                    <button onClick={onBack} className="flex items-center text-gray-500 hover:text-blue-600 mb-6 text-sm font-medium transition">
                        <i className="fas fa-arrow-left mr-2"></i> Back to Classes
                    </button>

                    <div className="flex flex-col md:flex-row gap-6">
                        <ClassSidebar
                            cls={cls}
                            groups={groups}
                            selectedGroupId={selectedGroupId}
                            onSelectGroup={setSelectedGroupId}
                        />

                        <div className="flex-1">
                            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm min-h-[400px]">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Subjects</h2>
                                {displayedSubjects.length === 0 ? (
                                    <div className="text-gray-400 italic text-center py-16 text-sm">Select a group to see subjects.</div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {displayedSubjects.map(sub => (
                                            <div 
                                                key={sub.id} 
                                                onClick={() => setSelectedSubject(sub)} 
                                                className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md cursor-pointer transition-all hover:-translate-y-1 group text-center"
                                            >
                                                <div className="w-10 h-10 mx-auto rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                    <i className="fas fa-book text-lg"></i>
                                                </div>
                                                <h3 className="font-bold text-sm text-gray-800 group-hover:text-indigo-600 transition truncate">{sub.name}</h3>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        function StudentSubjectView({ subject, onBack }) {
            const [chapters, setChapters] = useState([]);
            const [activeTopic, setActiveTopic] = useState(null);
            const [topics, setTopics] = useState([]);
            const [mobileChapterMenu, setMobileChapterMenu] = useState(false);

            useEffect(() => {
                fetch(\`/api/chapters?subject_id=\${subject.id}\`).then(r => r.json()).then(setChapters);
            }, [subject]);

            const loadTopicsForChapter = async (chapter) => {
                const res = await fetch(\`/api/topics?chapter_id=\${chapter.id}\`);
                const data = await res.json();
                setTopics(data);
                if (data.length > 0) setActiveTopic(data[0]);
                else setActiveTopic(null);
                setMobileChapterMenu(false);
            };

            return (
                <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row bg-white relative">
                    {/* Mobile Chapter Toggle */}
                    <div className="md:hidden p-3 border-b bg-gray-50 flex justify-between items-center">
                        <button onClick={onBack} className="text-gray-500"><i className="fas fa-arrow-left"></i></button>
                        <span className="font-bold text-gray-800 text-sm truncate max-w-[200px]">{subject.name}</span>
                        <button onClick={() => setMobileChapterMenu(!mobileChapterMenu)} className="text-blue-600 font-medium text-sm">
                            <i className="fas fa-list mr-1"></i> Chapters
                        </button>
                    </div>

                    {/* Chapter Sidebar */}
                    <div className={\`absolute inset-y-0 left-0 z-30 w-72 bg-gray-50 border-r flex flex-col transform transition-transform md:translate-x-0 md:static \${mobileChapterMenu ? 'translate-x-0' : '-translate-x-full'}\`}>
                        <div className="p-3 border-b bg-white hidden md:flex items-center justify-between">
                             <div className="flex items-center overflow-hidden">
                                <button onClick={onBack} className="mr-2 text-gray-400 hover:text-blue-600 transition"><i className="fas fa-arrow-left"></i></button>
                                <h2 className="font-bold text-gray-800 text-sm truncate">{subject.name}</h2>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                            {chapters.length === 0 && <p className="text-center text-gray-400 text-xs mt-10">No chapters.</p>}
                            {chapters.map((ch) => (
                                <div key={ch.id}>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-2 mt-2">
                                        Chapter {ch.order_num}
                                    </div>
                                    <button 
                                        onClick={() => loadTopicsForChapter(ch)} 
                                        className="w-full text-left bg-white px-3 py-2 rounded-lg border shadow-sm hover:border-blue-300 transition text-sm font-medium text-gray-700"
                                    >
                                        {ch.title}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto bg-white custom-scrollbar" onClick={() => setMobileChapterMenu(false)}>
                        {topics.length > 0 && activeTopic ? (
                            <div className="max-w-4xl mx-auto p-4 md:p-8 pb-24">
                                <div className="flex overflow-x-auto space-x-2 mb-6 pb-2 border-b custom-scrollbar">
                                    {topics.map((t, idx) => (
                                        <button 
                                            key={t.id}
                                            onClick={() => setActiveTopic(t)}
                                            className={\`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition \${activeTopic.id === t.id ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-600'}\`}
                                        >
                                            {idx + 1}. {t.title}
                                        </button>
                                    ))}
                                </div>

                                <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-6">{activeTopic.title}</h1>
                                
                                <div className="prose max-w-none mb-10">
                                    <div className="bg-amber-50 p-6 rounded-xl border border-amber-100 shadow-sm text-sm md:text-base leading-relaxed text-gray-800 whitespace-pre-wrap">
                                        {activeTopic.content || "No detailed notes available."}
                                    </div>
                                </div>

                                <InteractiveQuestions topicId={activeTopic.id} />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
                                <i className="fas fa-book-open text-4xl mb-3 opacity-20"></i>
                                <p className="text-sm">Select a chapter to start studying.</p>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        function InteractiveQuestions({ topicId }) {
            const [questions, setQuestions] = useState([]);
            const [revealed, setRevealed] = useState({});

            useEffect(() => {
                fetch(\`/api/questions?topic_id=\${topicId}\`).then(r => r.json()).then(setQuestions);
                setRevealed({});
            }, [topicId]);

            const handleMCQSelect = (qId, option, correctAnswer) => {
                if (revealed[qId]) return;
                setRevealed(prev => ({ ...prev, [qId]: option }));
            };

            if (questions.length === 0) return null;

            return (
                <div className="space-y-6 border-t pt-8">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center">
                        <i className="fas fa-clipboard-question text-blue-600 mr-2"></i> Practice Questions
                    </h3>
                    
                    {questions.map((q, idx) => (
                        <div key={q.id} className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                            <div className="flex justify-between mb-2">
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Q{idx + 1} • {q.type}</span>
                                {JSON.parse(q.metadata).board && (
                                    <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100">
                                        {JSON.parse(q.metadata).board}
                                    </span>
                                )}
                            </div>
                            
                            <p className="font-medium text-gray-800 mb-4 text-base">{q.question_text}</p>

                            {q.type === 'MCQ' ? (
                                <div className="grid gap-2">
                                    {JSON.parse(q.options).map((opt, i) => {
                                        const isSelected = revealed[q.id] === opt;
                                        const isCorrect = opt === q.answer;
                                        const hasAnswered = revealed[q.id] !== undefined;
                                        
                                        let btnClass = "p-3 rounded border text-left text-sm transition relative ";
                                        if (!hasAnswered) btnClass += "bg-white hover:bg-gray-50 cursor-pointer";
                                        else if (isCorrect) btnClass += "bg-green-50 border-green-400 text-green-800";
                                        else if (isSelected) btnClass += "bg-red-50 border-red-400 text-red-800";
                                        else btnClass += "bg-gray-50 opacity-60";

                                        return (
                                            <div key={i} onClick={() => handleMCQSelect(q.id, opt, q.answer)} className={btnClass}>
                                                <span className="font-bold mr-2 opacity-50">{String.fromCharCode(65+i)}.</span> {opt}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div>
                                    <button onClick={() => setRevealed(p => ({...p, [q.id]: !p[q.id]}))} className="text-blue-600 text-sm font-semibold hover:underline">
                                        {revealed[q.id] ? 'Hide Answer' : 'Show Answer'}
                                    </button>
                                    {revealed[q.id] && (
                                        <div className="mt-2 p-3 bg-green-50 rounded border border-green-100 text-green-900 text-sm">
                                            <span className="font-bold">Ans:</span> {q.answer}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            );
        }

        function AuthForm({ mode, onSubmit }) {
            const [username, setUsername] = useState('');
            const [password, setPassword] = useState('');

            return (
                <div className="flex items-center justify-center flex-grow p-4">
                    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm border border-gray-100">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-serif font-bold text-gray-800">
                                {mode === 'login' ? 'Welcome Back' : 'System Setup'}
                            </h2>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); onSubmit(username, password); }}>
                            <Input label="Username" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
                            <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                            <Button className="w-full mt-2" size="md">{mode === 'login' ? 'Sign In' : 'Create Admin'}</Button>
                        </form>
                    </div>
                </div>
            );
        }

        // --- ADMIN DASHBOARD ---

        function AdminDashboard({ user, logout }) {
            const [activeTab, setActiveTab] = useState('classes');
            const [sidebarOpen, setSidebarOpen] = useState(false);

            return (
                <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden relative">
                    {/* Mobile Header */}
                    <div className="md:hidden bg-white border-b p-3 flex justify-between items-center z-20">
                        <div className="flex items-center gap-2">
                             <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                {user.username[0].toUpperCase()}
                            </div>
                            <span className="font-bold text-gray-700 text-sm">{user.username}</span>
                        </div>
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600 p-2">
                            <i className={\`fas \${sidebarOpen ? 'fa-times' : 'fa-bars'}\`}></i>
                        </button>
                    </div>

                    {/* Admin Sidebar */}
                    <div className={\`
                        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:flex flex-col
                        \${sidebarOpen ? 'translate-x-0 top-[64px]' : '-translate-x-full'}
                        md:top-0 h-full
                    \`}>
                        <div className="p-4 hidden md:block">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                                    {user.username[0].toUpperCase()}
                                </div>
                                <div className="overflow-hidden">
                                    <h4 className="font-bold text-gray-800 truncate text-sm">{user.username}</h4>
                                    <p className="text-[10px] text-green-600 font-semibold">● Online</p>
                                </div>
                            </div>
                        </div>
                        
                        <nav className="p-2 space-y-1 flex-1">
                            <AdminNavItem icon="fas fa-book" label="Classes & Content" active={activeTab === 'classes'} onClick={() => { setActiveTab('classes'); setSidebarOpen(false); }} />
                            <AdminNavItem icon="fas fa-cog" label="System Settings" active={activeTab === 'settings'} onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }} />
                        </nav>
                        
                        <div className="p-4 border-t">
                            <button onClick={logout} className="flex items-center text-red-600 hover:text-red-700 font-medium text-sm transition w-full">
                                <i className="fas fa-sign-out-alt mr-3"></i> Logout
                            </button>
                        </div>
                    </div>

                    {/* Overlay for mobile */}
                    {sidebarOpen && <div className="fixed inset-0 bg-black/20 z-30 md:hidden" onClick={() => setSidebarOpen(false)}></div>}

                    {/* Admin Content */}
                    <div className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6 w-full">
                        {activeTab === 'classes' && <ClassManager />}
                        {activeTab === 'settings' && <SettingsManager />}
                    </div>
                </div>
            );
        }

        const AdminNavItem = ({ icon, label, active, onClick }) => (
            <button 
                onClick={onClick} 
                className={\`w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all \${active ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}\`}
            >
                <i className={\`\${icon} w-5 text-center mr-2 \${active ? 'text-blue-600' : 'text-gray-400'}\`}></i>
                {label}
            </button>
        );

        // --- ADMIN CONTENT MANAGERS ---

        function ClassManager() {
            const [classes, setClasses] = useState([]);
            const [newClassName, setNewClassName] = useState('');
            const [selectedClass, setSelectedClass] = useState(null);
            const [linkModalClass, setLinkModalClass] = useState(null);

            const loadClasses = () => fetch('/api/classes').then(r => r.json()).then(setClasses);
            useEffect(() => { loadClasses(); }, []);

            const createClass = async () => {
                if (!newClassName) return;
                await fetch('/api/classes', { method: 'POST', body: JSON.stringify({ name: newClassName }) });
                setNewClassName('');
                loadClasses();
            };

            const saveLink = async (parentId, label) => {
                await fetch('/api/classes', { 
                    method: 'PUT', 
                    body: JSON.stringify({ id: linkModalClass.id, parent_class_id: parentId, program_label: label }) 
                });
                setLinkModalClass(null);
                loadClasses();
            };

            if (selectedClass) return <ClassDetail cls={selectedClass} onBack={() => setSelectedClass(null)} />;

            return (
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <h2 className="text-xl font-bold text-gray-800">Class Management</h2>
                        <div className="flex w-full sm:w-auto gap-2">
                            <input 
                                value={newClassName} 
                                onChange={e => setNewClassName(e.target.value)} 
                                placeholder="New Class Name" 
                                className="flex-1 sm:w-48 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Button size="md" onClick={createClass}><i className="fas fa-plus"></i></Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {classes.map(cls => (
                            <div 
                                key={cls.id} 
                                onClick={() => !cls.parent_class_id && setSelectedClass(cls)}
                                className={\`bg-white p-4 rounded-lg border border-gray-200 shadow-sm transition relative group \${!cls.parent_class_id ? 'cursor-pointer hover:border-blue-400 hover:shadow-md' : 'opacity-90'}\`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-gray-800 text-lg">{cls.name}</h3>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setLinkModalClass(cls); }} 
                                        className="text-gray-300 hover:text-blue-600 p-1" 
                                        title="Link Content"
                                    >
                                        <i className="fas fa-link text-xs"></i>
                                    </button>
                                </div>
                                
                                {cls.parent_class_id ? (
                                    <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded inline-block font-medium">
                                        <i className="fas fa-share mr-1"></i> Linked to {cls.parent_name}
                                    </div>
                                ) : (
                                    <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded inline-block font-medium">
                                        <i className="fas fa-database mr-1"></i> {classes.length} Items
                                    </div>
                                )}
                                
                                {!cls.parent_class_id && (
                                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 text-xs font-bold">
                                        Manage <i className="fas fa-arrow-right ml-1"></i>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {linkModalClass && (
                        <LinkClassModal 
                            cls={linkModalClass} 
                            allClasses={classes} 
                            onClose={() => setLinkModalClass(null)} 
                            onSave={saveLink} 
                        />
                    )}
                </div>
            );
        }

        function LinkClassModal({ cls, allClasses, onClose, onSave }) {
            const [parentId, setParentId] = useState(cls.parent_class_id || '');
            const [label, setLabel] = useState(cls.program_label || '');

            return (
                <Modal isOpen={true} onClose={onClose} title="Content Linking">
                    <p className="text-gray-500 text-xs mb-4">
                        Link <strong>{cls.name}</strong> to use content from another class.
                    </p>
                    <div className="mb-3">
                        <label className="block text-xs font-bold text-gray-700 mb-1">Source Class</label>
                        <select 
                            className="w-full border p-2 rounded-lg text-sm bg-white"
                            value={parentId}
                            onChange={e => setParentId(e.target.value)}
                        >
                            <option value="">-- Independent Class --</option>
                            {allClasses.filter(c => c.id !== cls.id).map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    {parentId && (
                        <Input label="Label (e.g. SSC)" value={label} onChange={e => setLabel(e.target.value)} placeholder="SSC" />
                    )}
                    <div className="flex justify-end mt-4">
                        <Button size="sm" onClick={() => onSave(parentId, label)}>Save</Button>
                    </div>
                </Modal>
            );
        }

        function ClassDetail({ cls, onBack }) {
            const [groups, setGroups] = useState([]);
            const [subjects, setSubjects] = useState([]);
            const [newGroupName, setNewGroupName] = useState('');
            const [newSubject, setNewSubject] = useState({ name: '', is_common: true, group_id: '' });
            const [selectedSubject, setSelectedSubject] = useState(null);

            const refreshData = async () => {
                const [gRes, sRes] = await Promise.all([
                    fetch(\`/api/groups?class_id=\${cls.id}\`),
                    fetch(\`/api/subjects?class_id=\${cls.id}\`)
                ]);
                setGroups(await gRes.json());
                setSubjects(await sRes.json());
            };

            useEffect(() => { refreshData(); }, [cls]);

            const addGroup = async () => {
                if (!newGroupName) return;
                await fetch('/api/groups', { method: 'POST', body: JSON.stringify({ name: newGroupName, class_id: cls.id }) });
                setNewGroupName(''); refreshData();
            };

            const addSubject = async () => {
                if (!newSubject.name) return;
                await fetch('/api/subjects', { method: 'POST', body: JSON.stringify({ ...newSubject, class_id: cls.id }) });
                setNewSubject({ name: '', is_common: true, group_id: '' }); refreshData();
            };

            if (selectedSubject) return <SubjectManager subject={selectedSubject} onBack={() => setSelectedSubject(null)} />;

            return (
                <div className="animate-fade-in max-w-5xl mx-auto">
                    <button onClick={onBack} className="text-gray-500 hover:text-blue-600 mb-4 font-medium text-sm">
                        <i className="fas fa-arrow-left mr-2"></i> {cls.name}
                    </button>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Groups Panel */}
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm h-fit">
                            <h3 className="font-bold text-gray-800 mb-3 text-sm">Groups</h3>
                            <div className="flex gap-2 mb-4">
                                <input className="border rounded px-2 py-1 text-sm flex-1" placeholder="e.g. Science" value={newGroupName} onChange={e => setNewGroupName(e.target.value)} />
                                <Button size="sm" onClick={addGroup}>+</Button>
                            </div>
                            <div className="space-y-1">
                                {groups.map(g => (
                                    <div key={g.id} className="px-3 py-2 bg-gray-50 rounded text-sm flex items-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></div>
                                        {g.name}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Subjects Panel */}
                        <div className="lg:col-span-2 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="font-bold text-gray-800 mb-3 text-sm">Subjects</h3>
                            <div className="bg-gray-50 p-3 rounded-lg mb-4 border border-gray-100 text-sm">
                                <div className="flex gap-2 mb-2">
                                    <input className="border rounded px-2 py-1 flex-1" placeholder="Subject Name" value={newSubject.name} onChange={e => setNewSubject({...newSubject, name: e.target.value})} />
                                    <Button size="sm" onClick={addSubject}>Add</Button>
                                </div>
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center cursor-pointer">
                                        <input type="checkbox" className="mr-2" checked={newSubject.is_common} onChange={e => setNewSubject({...newSubject, is_common: e.target.checked})} />
                                        <span className="text-xs text-gray-600">Common</span>
                                    </label>
                                    {!newSubject.is_common && (
                                        <select className="border rounded px-2 py-1 text-xs flex-1" value={newSubject.group_id} onChange={e => setNewSubject({...newSubject, group_id: e.target.value})}>
                                            <option value="">Select Group...</option>
                                            {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                                        </select>
                                    )}
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto custom-scrollbar">
                                {subjects.map(s => (
                                    <div key={s.id} onClick={() => setSelectedSubject(s)} className="px-3 py-2 border rounded hover:bg-blue-50 cursor-pointer flex justify-between items-center transition group">
                                        <span className="font-medium text-sm text-gray-700 group-hover:text-blue-700">{s.name}</span>
                                        <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">
                                            {s.is_common ? 'All' : (groups.find(g => g.id == s.group_id)?.name || 'Group')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        function SubjectManager({ subject, onBack }) {
            const [chapters, setChapters] = useState([]);
            const [selectedChapter, setSelectedChapter] = useState(null);
            const [newChapter, setNewChapter] = useState({ title: '', order: '' });

            const loadChapters = () => fetch(\`/api/chapters?subject_id=\${subject.id}\`).then(r => r.json()).then(setChapters);
            useEffect(() => { loadChapters(); }, [subject]);

            const addChapter = async () => {
                await fetch('/api/chapters', { 
                    method: 'POST', 
                    body: JSON.stringify({ 
                        title: newChapter.title, 
                        subject_id: subject.id, 
                        order_num: newChapter.order || chapters.length + 1 
                    }) 
                });
                setNewChapter({ title: '', order: '' });
                loadChapters();
            };

            if (selectedChapter) return <TopicManager chapter={selectedChapter} onBack={() => setSelectedChapter(null)} />;

            return (
                <div className="animate-fade-in max-w-4xl mx-auto">
                    <button onClick={onBack} className="text-gray-500 hover:text-blue-600 mb-4 font-medium text-sm">
                        <i className="fas fa-arrow-left mr-2"></i> {subject.name}
                    </button>
                    
                    <div className="bg-white p-3 rounded-xl border mb-4 flex gap-2 items-center text-sm">
                        <input className="border rounded px-2 py-1 w-16 text-center" placeholder="#" type="number" value={newChapter.order} onChange={e => setNewChapter({...newChapter, order: e.target.value})} />
                        <input className="border rounded px-2 py-1 flex-1" placeholder="Chapter Title" value={newChapter.title} onChange={e => setNewChapter({...newChapter, title: e.target.value})} />
                        <Button size="sm" onClick={addChapter}>Add</Button>
                    </div>

                    <div className="space-y-2">
                        {chapters.map(ch => (
                            <div key={ch.id} onClick={() => setSelectedChapter(ch)} className="bg-white px-4 py-3 rounded-lg border hover:border-blue-300 cursor-pointer flex items-center shadow-sm transition">
                                <span className="text-gray-400 font-bold mr-3 text-sm">{ch.order_num}.</span>
                                <div className="flex-1 font-semibold text-gray-800 text-sm">{ch.title}</div>
                                <i className="fas fa-chevron-right text-xs text-gray-300"></i>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        function TopicManager({ chapter, onBack }) {
            const [topics, setTopics] = useState([]);
            const [selectedTopic, setSelectedTopic] = useState(null);
            const [newTopic, setNewTopic] = useState({ title: '', content: '' });

            const loadTopics = () => fetch(\`/api/topics?chapter_id=\${chapter.id}\`).then(r => r.json()).then(setTopics);
            useEffect(() => { loadTopics(); }, [chapter]);

            const addTopic = async () => {
                await fetch('/api/topics', { 
                    method: 'POST', 
                    body: JSON.stringify({ 
                        ...newTopic, 
                        chapter_id: chapter.id, 
                        order_num: topics.length + 1 
                    }) 
                });
                setNewTopic({ title: '', content: '' });
                loadTopics();
            };

            if (selectedTopic) return <QuestionManager topic={selectedTopic} onBack={() => setSelectedTopic(null)} />;

            return (
                <div className="animate-fade-in max-w-4xl mx-auto">
                    <button onClick={onBack} className="text-gray-500 hover:text-blue-600 mb-4 font-medium text-sm">
                        <i className="fas fa-arrow-left mr-2"></i> {chapter.title}
                    </button>
                    
                    <div className="bg-white p-4 rounded-xl border mb-4 shadow-sm">
                        <Input label="Topic Title" value={newTopic.title} onChange={e => setNewTopic({...newTopic, title: e.target.value})} />
                        <div className="mb-3">
                            <label className="block text-xs font-bold text-gray-700 mb-1">Content / Notes</label>
                            <textarea 
                                className="w-full border rounded-lg p-2 h-24 text-sm" 
                                placeholder="Paste study notes here..." 
                                value={newTopic.content} 
                                onChange={e => setNewTopic({...newTopic, content: e.target.value})}
                            ></textarea>
                        </div>
                        <Button size="sm" onClick={addTopic}>Save Topic</Button>
                    </div>

                    <div className="space-y-2">
                        {topics.map(t => (
                            <div key={t.id} onClick={() => setSelectedTopic(t)} className="bg-white px-4 py-3 rounded-lg border hover:border-blue-400 cursor-pointer shadow-sm">
                                <h4 className="font-bold text-gray-800 text-sm">{t.title}</h4>
                                <p className="text-xs text-gray-500 truncate mt-1">{t.content || "No content preview"}</p>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        function QuestionManager({ topic, onBack }) {
            const [questions, setQuestions] = useState([]);
            const [qType, setQType] = useState('MCQ');
            const [newQ, setNewQ] = useState({ 
                text: '', 
                options: ['', '', '', ''], 
                answer: '', 
                metadata: { board: '', year: '' } 
            });

            const loadQs = () => fetch(\`/api/questions?topic_id=\${topic.id}\`).then(r => r.json()).then(setQuestions);
            useEffect(() => { loadQs(); }, [topic]);

            const saveQuestion = async () => {
                await fetch('/api/questions', { 
                    method: 'POST', 
                    body: JSON.stringify({
                        type: qType,
                        topic_id: topic.id,
                        question_text: newQ.text,
                        options: qType === 'MCQ' ? newQ.options : [],
                        answer: newQ.answer,
                        metadata: newQ.metadata
                    })
                });
                setNewQ({ text: '', options: ['', '', '', ''], answer: '', metadata: { board: '', year: '' } });
                loadQs();
            };

            const updateOption = (idx, val) => {
                const opts = [...newQ.options];
                opts[idx] = val;
                setNewQ({ ...newQ, options: opts });
            };

            return (
                <div className="animate-fade-in pb-20 max-w-3xl mx-auto">
                    <button onClick={onBack} className="text-gray-500 hover:text-blue-600 mb-4 font-medium text-sm">
                        <i className="fas fa-arrow-left mr-2"></i> {topic.title}
                    </button>

                    <div className="bg-white p-5 rounded-xl border shadow-sm mb-6">
                        <div className="flex justify-between items-center mb-4">
                             <div className="flex bg-gray-100 p-1 rounded-lg">
                                {['MCQ', 'CQ'].map(t => (
                                    <button 
                                        key={t}
                                        onClick={() => setQType(t)}
                                        className={\`px-3 py-1 rounded-md text-xs font-bold transition \${qType === t ? 'bg-white shadow text-blue-600' : 'text-gray-500'}\`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input className="w-20 border rounded px-2 py-1 text-xs" value={newQ.metadata.board} onChange={e => setNewQ({...newQ, metadata: {...newQ.metadata, board: e.target.value}})} placeholder="Board" />
                                <input className="w-16 border rounded px-2 py-1 text-xs" value={newQ.metadata.year} onChange={e => setNewQ({...newQ, metadata: {...newQ.metadata, year: e.target.value}})} placeholder="Year" />
                            </div>
                        </div>

                        <div className="mb-3">
                            <textarea className="w-full border rounded p-2 text-sm" rows="2" placeholder="Question Text" value={newQ.text} onChange={e => setNewQ({...newQ, text: e.target.value})}></textarea>
                        </div>

                        {qType === 'MCQ' ? (
                            <div className="space-y-2 mb-4">
                                {newQ.options.map((opt, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <span className="w-4 font-bold text-gray-400 text-xs">{String.fromCharCode(65+i)}</span>
                                        <input className="flex-1 border rounded px-2 py-1 text-sm" value={opt} onChange={e => updateOption(i, e.target.value)} placeholder={\`Option \${i+1}\`} />
                                        <input type="radio" name="correct" checked={newQ.answer === opt && opt !== ''} onChange={() => setNewQ({...newQ, answer: opt})} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="mb-4">
                                <textarea className="w-full border rounded p-2 text-sm" rows="2" placeholder="Answer Key" value={newQ.answer} onChange={e => setNewQ({...newQ, answer: e.target.value})}></textarea>
                            </div>
                        )}

                        <Button size="sm" className="w-full" onClick={saveQuestion}>Add Question</Button>
                    </div>

                    <div className="space-y-3">
                        {questions.map((q, i) => (
                            <div key={q.id} className="bg-white p-3 rounded-lg border shadow-sm">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] font-bold bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{q.type}</span>
                                    <span className="text-[10px] text-gray-400">
                                        {JSON.parse(q.metadata).board} {JSON.parse(q.metadata).year}
                                    </span>
                                </div>
                                <p className="font-medium text-gray-800 text-sm truncate">{q.question_text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        function SettingsManager() {
            const handleReset = async () => {
                if (confirm("Permanently delete ALL data?")) {
                    await fetch('/api/reset-db', { method: 'POST' });
                    window.location.reload();
                }
            };

            return (
                <div className="max-w-xl bg-white p-6 rounded-xl shadow-sm border border-red-100">
                    <h2 className="text-lg font-bold mb-4">System Danger Zone</h2>
                    <p className="text-gray-600 text-sm mb-4">
                        Resetting will delete all questions, subjects, and admin accounts.
                    </p>
                    <Button variant="danger" size="sm" onClick={handleReset}>
                        Reset Database
                    </Button>
                </div>
            );
        }

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>
  `;
}
