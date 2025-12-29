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
        ::-webkit-scrollbar { width: 8px; }
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
                <i className="fas fa-circle-notch fa-spin text-4xl"></i>
            </div>
        );

        const Button = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
            const variants = {
                primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md",
                secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
                danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100",
                ghost: "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
            };
            return (
                <button 
                    onClick={onClick} 
                    className={\`px-4 py-2 rounded-lg font-medium transition-all transform active:scale-95 \${variants[variant]} \${className}\`} 
                    {...props}
                >
                    {children}
                </button>
            );
        };

        const Input = ({ label, ...props }) => (
            <div className="mb-4">
                {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
                <input 
                    {...props} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white" 
                />
            </div>
        );

        const Modal = ({ isOpen, onClose, title, children }) => {
            if (!isOpen) return null;
            return (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animate-fade-in">
                        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto">
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
                    <main className="flex-grow bg-gray-50">
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
                <div className="animate-fade-in">
                    {/* Hero Section */}
                    <LandingHeader
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        searchResults={searchResults}
                    />

                    {/* Class Browser */}
                    <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20 pb-20">
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                                <i className="fas fa-layer-group text-blue-600 mr-3"></i> Available Classes
                            </h2>
                            {classes.length === 0 ? (
                                <div className="text-center py-12 text-gray-400">No classes added yet.</div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {classes.map(cls => (
                                        <div 
                                            key={cls.id} 
                                            onClick={() => setSelectedClass(cls)} 
                                            className="bg-gray-50 rounded-xl p-6 hover:bg-blue-50 cursor-pointer border border-transparent hover:border-blue-200 hover:-translate-y-1 transition-all group shadow-sm hover:shadow-md"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-blue-600 text-xl font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                    {cls.name.replace(/[^0-9]/g,'') || cls.name[0]}
                                                </div>
                                                {cls.program_label && (
                                                    <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full uppercase tracking-wider">
                                                        {cls.program_label}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="font-bold text-lg text-gray-900 mb-1">{cls.name}</h3>
                                            <p className="text-xs text-gray-500 flex items-center">
                                                {cls.parent_class_id ? (
                                                    <><i className="fas fa-link mr-1"></i> Linked Content</>
                                                ) : (
                                                    <><i className="fas fa-database mr-1"></i> Full Curriculum</>
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
                    // API handles fetching from parent class if linked
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

            // Filter subjects based on selection
            const displayedSubjects = subjects.filter(s => s.is_common || (selectedGroupId && s.group_id === selectedGroupId));

            return (
                <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in min-h-screen">
                    <button onClick={onBack} className="flex items-center text-gray-500 hover:text-blue-600 mb-8 font-medium transition">
                        <i className="fas fa-arrow-left mr-2"></i> Back to Classes
                    </button>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Sidebar: Groups */}
                        <ClassSidebar
                            cls={cls}
                            groups={groups}
                            selectedGroupId={selectedGroupId}
                            onSelectGroup={setSelectedGroupId}
                        />

                        {/* Main Grid: Subjects */}
                        <div className="flex-1">
                            <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm min-h-[500px]">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Subjects</h2>
                                {displayedSubjects.length === 0 ? (
                                    <div className="text-gray-400 italic text-center py-20">No subjects found. Select a group from the left.</div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                        {displayedSubjects.map(sub => (
                                            <div 
                                                key={sub.id} 
                                                onClick={() => setSelectedSubject(sub)} 
                                                className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg cursor-pointer transition-all hover:-translate-y-1 group"
                                            >
                                                <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                    <i className="fas fa-book text-xl"></i>
                                                </div>
                                                <h3 className="font-bold text-gray-800 group-hover:text-indigo-600 transition">{sub.name}</h3>
                                                <p className="text-xs text-gray-500 mt-2">Tap to view chapters</p>
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
            const [isLoadingTopics, setIsLoadingTopics] = useState(false);

            useEffect(() => {
                fetch(\`/api/chapters?subject_id=\${subject.id}\`).then(r => r.json()).then(setChapters);
            }, [subject]);

            const loadTopicsForChapter = async (chapter) => {
                setIsLoadingTopics(true);
                const res = await fetch(\`/api/topics?chapter_id=\${chapter.id}\`);
                const data = await res.json();
                setTopics(data);
                if (data.length > 0) setActiveTopic(data[0]);
                else setActiveTopic(null);
                setIsLoadingTopics(false);
            };

            return (
                <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row bg-white fixed inset-0 top-16 z-30">
                    {/* Chapter Sidebar */}
                    <div className="w-full md:w-80 bg-gray-50 border-r flex flex-col h-full">
                        <div className="p-4 border-b bg-white flex items-center justify-between">
                            <div className="flex items-center overflow-hidden">
                                <button onClick={onBack} className="mr-3 text-gray-400 hover:text-blue-600 transition">
                                    <i className="fas fa-arrow-left"></i>
                                </button>
                                <h2 className="font-bold text-gray-800 truncate">{subject.name}</h2>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
                            {chapters.length === 0 && <p className="text-center text-gray-400 text-sm mt-10">No chapters yet.</p>}
                            {chapters.map((ch, idx) => (
                                <div key={ch.id}>
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">
                                        Chapter {ch.order_num}
                                    </div>
                                    <button 
                                        onClick={() => loadTopicsForChapter(ch)} 
                                        className="w-full text-left bg-white p-3 rounded-lg border shadow-sm hover:shadow-md hover:border-blue-300 transition group"
                                    >
                                        <span className="font-medium text-gray-700 group-hover:text-blue-600">{ch.title}</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Topic & Content Area */}
                    <div className="flex-1 overflow-y-auto bg-white custom-scrollbar relative">
                        {topics.length > 0 && activeTopic ? (
                            <div className="max-w-4xl mx-auto p-8 pb-24">
                                {/* Topic Navigation (Tabs) */}
                                <div className="flex overflow-x-auto space-x-2 mb-8 pb-2 border-b">
                                    {topics.map((t, idx) => (
                                        <button 
                                            key={t.id}
                                            onClick={() => setActiveTopic(t)}
                                            className={\`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition \${activeTopic.id === t.id ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}\`}
                                        >
                                            {idx + 1}. {t.title}
                                        </button>
                                    ))}
                                </div>

                                <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">{activeTopic.title}</h1>
                                
                                {/* Study Notes */}
                                <div className="prose max-w-none mb-12">
                                    <div className="bg-amber-50 p-8 rounded-2xl border border-amber-100 relative shadow-sm">
                                        <i className="fas fa-lightbulb text-amber-300 absolute top-6 right-6 text-3xl"></i>
                                        <h4 className="font-bold text-amber-800 mb-4 uppercase text-xs tracking-widest">Study Notes</h4>
                                        <div className="whitespace-pre-wrap text-gray-800 leading-relaxed text-lg">
                                            {activeTopic.content || "No detailed notes available for this topic."}
                                        </div>
                                    </div>
                                </div>

                                {/* Questions */}
                                <InteractiveQuestions topicId={activeTopic.id} />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <i className="fas fa-book-open text-6xl mb-4 opacity-20"></i>
                                <p className="text-lg">Select a chapter from the sidebar to start studying.</p>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        function InteractiveQuestions({ topicId }) {
            const [questions, setQuestions] = useState([]);
            const [revealed, setRevealed] = useState({}); // Stores user answers/reveal state

            useEffect(() => {
                fetch(\`/api/questions?topic_id=\${topicId}\`).then(r => r.json()).then(setQuestions);
                setRevealed({});
            }, [topicId]);

            const handleMCQSelect = (qId, option, correctAnswer) => {
                if (revealed[qId]) return; // Prevent changing answer
                setRevealed(prev => ({ ...prev, [qId]: option }));
            };

            const toggleCQAnswer = (qId) => {
                setRevealed(prev => ({ ...prev, [qId]: !prev[qId] }));
            };

            if (questions.length === 0) return null;

            return (
                <div className="space-y-8 border-t pt-10">
                    <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                        <i className="fas fa-clipboard-question text-blue-600 mr-3"></i> Practice Questions
                    </h3>
                    
                    {questions.map((q, idx) => (
                        <div key={q.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition">
                            <div className="flex justify-between mb-3">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                                    Question {idx + 1} • {q.type}
                                </span>
                                {JSON.parse(q.metadata).board && (
                                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded font-medium border border-blue-100">
                                        {JSON.parse(q.metadata).board}
                                    </span>
                                )}
                            </div>
                            
                            <p className="font-medium text-gray-800 mb-6 text-lg">{q.question_text}</p>

                            {q.type === 'MCQ' ? (
                                <div className="grid gap-3">
                                    {JSON.parse(q.options).map((opt, i) => {
                                        const isSelected = revealed[q.id] === opt;
                                        const isCorrect = opt === q.answer;
                                        const hasAnswered = revealed[q.id] !== undefined;
                                        
                                        let btnClass = "p-4 rounded-lg border text-left transition relative font-medium ";
                                        if (!hasAnswered) {
                                            btnClass += "bg-white hover:bg-gray-50 hover:border-blue-300 cursor-pointer";
                                        } else {
                                            if (isCorrect) btnClass += "bg-green-50 border-green-400 text-green-800";
                                            else if (isSelected) btnClass += "bg-red-50 border-red-400 text-red-800";
                                            else btnClass += "bg-gray-50 opacity-60";
                                        }

                                        return (
                                            <div 
                                                key={i} 
                                                onClick={() => handleMCQSelect(q.id, opt, q.answer)}
                                                className={btnClass}
                                            >
                                                <span className="font-bold mr-3 opacity-50">{String.fromCharCode(65+i)}.</span> {opt}
                                                {hasAnswered && isCorrect && <i className="fas fa-check absolute right-4 top-4 text-green-600"></i>}
                                                {hasAnswered && isSelected && !isCorrect && <i className="fas fa-times absolute right-4 top-4 text-red-600"></i>}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div>
                                    <button 
                                        onClick={() => toggleCQAnswer(q.id)} 
                                        className="text-blue-600 font-semibold hover:underline flex items-center"
                                    >
                                        {revealed[q.id] ? 'Hide Answer' : 'Show Answer'}
                                        <i className={\`fas fa-chevron-\${revealed[q.id] ? 'up' : 'down'} ml-2\`}></i>
                                    </button>
                                    {revealed[q.id] && (
                                        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-100 text-green-900 animate-fade-in">
                                            <span className="font-bold mr-2">Answer:</span> {q.answer}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            );
        }

        // --- AUTH FORMS ---

        function AuthForm({ mode, onSubmit }) {
            const [username, setUsername] = useState('');
            const [password, setPassword] = useState('');

            return (
                <div className="flex items-center justify-center min-h-[80vh]">
                    <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-serif font-bold text-gray-800 mb-2">
                                {mode === 'login' ? 'Welcome Back' : 'System Setup'}
                            </h2>
                            <p className="text-gray-500">Secure Admin Access</p>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); onSubmit(username, password); }}>
                            <Input label="Username" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username" />
                            <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                            <Button className="w-full mt-4 py-3 text-lg">{mode === 'login' ? 'Sign In' : 'Create Admin'}</Button>
                        </form>
                    </div>
                </div>
            );
        }

        // --- ADMIN DASHBOARD ---

        function AdminDashboard({ user, logout }) {
            const [activeTab, setActiveTab] = useState('classes');

            return (
                <div className="flex h-[calc(100vh-64px)] overflow-hidden">
                    {/* Admin Sidebar */}
                    <div className="w-64 bg-white border-r hidden md:flex flex-col">
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                                    {user.username[0].toUpperCase()}
                                </div>
                                <div className="overflow-hidden">
                                    <h4 className="font-bold text-gray-800 truncate">{user.username}</h4>
                                    <p className="text-xs text-green-600 font-semibold">● Online</p>
                                </div>
                            </div>
                            
                            <nav className="space-y-1">
                                <AdminNavItem icon="fas fa-book" label="Classes & Content" active={activeTab === 'classes'} onClick={() => setActiveTab('classes')} />
                                <AdminNavItem icon="fas fa-cog" label="System Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                            </nav>
                        </div>
                        <div className="mt-auto p-6 border-t">
                            <button onClick={logout} className="flex items-center text-red-600 hover:text-red-700 font-medium transition">
                                <i className="fas fa-sign-out-alt mr-3"></i> Logout
                            </button>
                        </div>
                    </div>

                    {/* Admin Content */}
                    <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
                        {activeTab === 'classes' && <ClassManager />}
                        {activeTab === 'settings' && <SettingsManager />}
                    </div>
                </div>
            );
        }

        const AdminNavItem = ({ icon, label, active, onClick }) => (
            <button 
                onClick={onClick} 
                className={\`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all \${active ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}\`}
            >
                <i className={\`\${icon} w-6 text-center mr-2 \${active ? 'text-blue-600' : 'text-gray-400'}\`}></i>
                {label}
            </button>
        );

        // --- ADMIN CONTENT MANAGERS (Drill-Down) ---

        function ClassManager() {
            const [classes, setClasses] = useState([]);
            const [newClassName, setNewClassName] = useState('');
            const [selectedClass, setSelectedClass] = useState(null);
            const [linkModalClass, setLinkModalClass] = useState(null); // For linking functionality

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
                    body: JSON.stringify({ 
                        id: linkModalClass.id, 
                        parent_class_id: parentId, 
                        program_label: label 
                    }) 
                });
                setLinkModalClass(null);
                loadClasses();
            };

            if (selectedClass) {
                return <ClassDetail cls={selectedClass} onBack={() => setSelectedClass(null)} />;
            }

            return (
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">Class Management</h2>
                        <div className="flex gap-3">
                            <input 
                                value={newClassName} 
                                onChange={e => setNewClassName(e.target.value)} 
                                placeholder="New Class Name" 
                                className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Button onClick={createClass}><i className="fas fa-plus mr-2"></i> Add Class</Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {classes.map(cls => (
                            <div key={cls.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">{cls.name}</h3>
                                        {cls.parent_class_id ? (
                                            <span className="inline-flex items-center mt-2 px-2 py-1 rounded-md text-xs font-bold bg-orange-100 text-orange-700">
                                                <i className="fas fa-link mr-1"></i> Linked to {cls.parent_name}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center mt-2 px-2 py-1 rounded-md text-xs font-bold bg-green-100 text-green-700">
                                                <i className="fas fa-database mr-1"></i> Source Content
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex space-x-2">
                                        <button onClick={() => setLinkModalClass(cls)} className="text-gray-400 hover:text-blue-600 p-1" title="Link/Alias">
                                            <i className="fas fa-link"></i>
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="mt-6">
                                    {!cls.parent_class_id ? (
                                        <Button variant="secondary" className="w-full" onClick={() => setSelectedClass(cls)}>
                                            Manage Content
                                        </Button>
                                    ) : (
                                        <div className="text-center text-sm text-gray-500 italic py-2">
                                            Content inherited from parent class.
                                        </div>
                                    )}
                                </div>
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
                <Modal isOpen={true} onClose={onClose} title={\`Link \${cls.name} to Content\`}>
                    <p className="text-gray-600 text-sm mb-6">
                        Linking allows this class to inherit all subjects, chapters, and questions from another class. 
                        Useful for grouping classes (e.g., Class 9 & 10 both using SSC content).
                    </p>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Content Source (Parent Class)</label>
                        <select 
                            className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            value={parentId}
                            onChange={e => setParentId(e.target.value)}
                        >
                            <option value="">-- No Link (Use Own Content) --</option>
                            {allClasses.filter(c => c.id !== cls.id).map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    {parentId && (
                        <Input 
                            label="Program Label (e.g. SSC, HSC)" 
                            value={label} 
                            onChange={e => setLabel(e.target.value)} 
                            placeholder="SSC"
                        />
                    )}
                    <div className="flex justify-end mt-6">
                        <Button onClick={() => onSave(parentId, label)}>Save Configuration</Button>
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
                <div className="animate-fade-in">
                    <button onClick={onBack} className="text-gray-500 hover:text-blue-600 mb-6 font-medium">
                        <i className="fas fa-arrow-left mr-2"></i> Back to Classes
                    </button>
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">{cls.name} Content Manager</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Groups Panel */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="font-bold text-gray-800 mb-4 text-lg">Student Groups</h3>
                            <div className="flex gap-2 mb-6">
                                <input className="border rounded-lg px-3 py-2 flex-1" placeholder="e.g. Science" value={newGroupName} onChange={e => setNewGroupName(e.target.value)} />
                                <Button onClick={addGroup}>Add</Button>
                            </div>
                            <div className="space-y-2">
                                {groups.map(g => (
                                    <div key={g.id} className="p-3 bg-gray-50 rounded-lg flex items-center">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                                        {g.name}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Subjects Panel */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="font-bold text-gray-800 mb-4 text-lg">Subjects</h3>
                            <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-100">
                                <input className="border rounded-lg px-3 py-2 w-full mb-3" placeholder="Subject Name" value={newSubject.name} onChange={e => setNewSubject({...newSubject, name: e.target.value})} />
                                <div className="flex items-center gap-4 mb-3">
                                    <label className="flex items-center cursor-pointer">
                                        <input type="checkbox" className="mr-2" checked={newSubject.is_common} onChange={e => setNewSubject({...newSubject, is_common: e.target.checked})} />
                                        <span className="text-sm">Common Subject</span>
                                    </label>
                                    {!newSubject.is_common && (
                                        <select className="border rounded px-2 py-1 text-sm flex-1" value={newSubject.group_id} onChange={e => setNewSubject({...newSubject, group_id: e.target.value})}>
                                            <option value="">Select Group...</option>
                                            {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                                        </select>
                                    )}
                                </div>
                                <Button className="w-full" onClick={addSubject}>Add Subject</Button>
                            </div>
                            
                            <div className="max-h-96 overflow-y-auto space-y-2 custom-scrollbar">
                                {subjects.map(s => (
                                    <div key={s.id} onClick={() => setSelectedSubject(s)} className="p-3 border rounded-lg hover:bg-blue-50 cursor-pointer flex justify-between items-center transition">
                                        <span className="font-medium">{s.name}</span>
                                        <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">
                                            {s.is_common ? 'Common' : (groups.find(g => g.id == s.group_id)?.name || 'Group')}
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
                <div className="animate-fade-in">
                    <button onClick={onBack} className="text-gray-500 hover:text-blue-600 mb-6 font-medium">
                        <i className="fas fa-arrow-left mr-2"></i> Back to {subject.name}
                    </button>
                    <h2 className="text-2xl font-bold mb-6">Chapters</h2>
                    
                    <div className="bg-white p-4 rounded-xl border mb-6 flex gap-4 items-center">
                        <input className="border rounded-lg px-3 py-2 w-20 text-center" placeholder="No." type="number" value={newChapter.order} onChange={e => setNewChapter({...newChapter, order: e.target.value})} />
                        <input className="border rounded-lg px-3 py-2 flex-1" placeholder="Chapter Title" value={newChapter.title} onChange={e => setNewChapter({...newChapter, title: e.target.value})} />
                        <Button onClick={addChapter}>Add Chapter</Button>
                    </div>

                    <div className="space-y-3">
                        {chapters.map(ch => (
                            <div key={ch.id} onClick={() => setSelectedChapter(ch)} className="bg-white p-4 rounded-lg border hover:border-blue-400 cursor-pointer flex items-center shadow-sm transition">
                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-500 mr-4">{ch.order_num}</div>
                                <div className="flex-1 font-semibold text-gray-800">{ch.title}</div>
                                <i className="fas fa-chevron-right text-gray-300"></i>
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
                <div className="animate-fade-in">
                    <button onClick={onBack} className="text-gray-500 hover:text-blue-600 mb-6 font-medium">
                        <i className="fas fa-arrow-left mr-2"></i> Back to Chapters
                    </button>
                    <h2 className="text-2xl font-bold mb-6">Topics in {chapter.title}</h2>
                    
                    <div className="bg-white p-6 rounded-xl border mb-6">
                        <Input label="Topic Title" value={newTopic.title} onChange={e => setNewTopic({...newTopic, title: e.target.value})} />
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notes / Content</label>
                            <textarea 
                                className="w-full border rounded-lg p-3 h-32" 
                                placeholder="Enter study notes here..." 
                                value={newTopic.content} 
                                onChange={e => setNewTopic({...newTopic, content: e.target.value})}
                            ></textarea>
                        </div>
                        <Button onClick={addTopic}>Add Topic</Button>
                    </div>

                    <div className="space-y-3">
                        {topics.map(t => (
                            <div key={t.id} onClick={() => setSelectedTopic(t)} className="bg-white p-4 rounded-lg border hover:border-blue-400 cursor-pointer shadow-sm">
                                <h4 className="font-bold text-gray-800">{t.title}</h4>
                                <p className="text-sm text-gray-500 truncate mt-1">{t.content}</p>
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
                <div className="animate-fade-in pb-20">
                    <button onClick={onBack} className="text-gray-500 hover:text-blue-600 mb-6 font-medium">
                        <i className="fas fa-arrow-left mr-2"></i> Back to Topics
                    </button>
                    <h2 className="text-2xl font-bold mb-6">Question Bank: {topic.title}</h2>

                    <div className="bg-white p-6 rounded-xl border shadow-sm mb-8">
                        {/* Type Toggle */}
                        <div className="flex bg-gray-100 p-1 rounded-lg mb-4 w-fit">
                            {['MCQ', 'CQ'].map(t => (
                                <button 
                                    key={t}
                                    onClick={() => setQType(t)}
                                    className={\`px-4 py-1 rounded-md text-sm font-bold transition \${qType === t ? 'bg-white shadow text-blue-600' : 'text-gray-500'}\`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>

                        {/* Metadata */}
                        <div className="flex gap-4 mb-4">
                            <div className="flex-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Board</label>
                                <input className="w-full border rounded px-2 py-1" value={newQ.metadata.board} onChange={e => setNewQ({...newQ, metadata: {...newQ.metadata, board: e.target.value}})} placeholder="e.g. Dhaka" />
                            </div>
                            <div className="flex-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Year</label>
                                <input className="w-full border rounded px-2 py-1" value={newQ.metadata.year} onChange={e => setNewQ({...newQ, metadata: {...newQ.metadata, year: e.target.value}})} placeholder="2023" />
                            </div>
                        </div>

                        {/* Question Text */}
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-1">Question</label>
                            <textarea className="w-full border rounded p-2" rows="3" value={newQ.text} onChange={e => setNewQ({...newQ, text: e.target.value})}></textarea>
                        </div>

                        {/* Options / Answer */}
                        {qType === 'MCQ' ? (
                            <div className="space-y-2 mb-6">
                                <label className="block text-sm font-bold">Options (Select Correct)</label>
                                {newQ.options.map((opt, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <span className="w-6 font-bold text-gray-400">{String.fromCharCode(65+i)}</span>
                                        <input className="flex-1 border rounded px-2 py-1" value={opt} onChange={e => updateOption(i, e.target.value)} />
                                        <input type="radio" name="correct" checked={newQ.answer === opt && opt !== ''} onChange={() => setNewQ({...newQ, answer: opt})} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="mb-6">
                                <label className="block text-sm font-bold mb-1">Answer Key / Solution</label>
                                <textarea className="w-full border rounded p-2" rows="3" value={newQ.answer} onChange={e => setNewQ({...newQ, answer: e.target.value})}></textarea>
                            </div>
                        )}

                        <Button className="w-full" onClick={saveQuestion}>Save Question</Button>
                    </div>

                    <div className="space-y-4">
                        {questions.map((q, i) => (
                            <div key={q.id} className="bg-white p-4 rounded-lg border shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded">{q.type}</span>
                                    <span className="text-xs text-gray-500">
                                        {JSON.parse(q.metadata).board} {JSON.parse(q.metadata).year}
                                    </span>
                                </div>
                                <p className="font-medium text-gray-800">{q.question_text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        function SettingsManager() {
            const handleReset = async () => {
                if (confirm("WARNING: This will delete ALL data (Admins, Classes, Questions). Are you sure?")) {
                    await fetch('/api/reset-db', { method: 'POST' });
                    window.location.reload();
                }
            };

            return (
                <div className="max-w-2xl bg-white p-8 rounded-xl shadow-sm">
                    <h2 className="text-xl font-bold mb-6">System Settings</h2>
                    
                    <div className="border border-red-200 bg-red-50 rounded-xl p-6">
                        <h3 className="text-red-800 font-bold mb-2 flex items-center">
                            <i className="fas fa-exclamation-triangle mr-2"></i> Danger Zone
                        </h3>
                        <p className="text-red-600 text-sm mb-6">
                            Resetting the database will permanently wipe all users, classes, subjects, notes, and questions. This action is irreversible.
                        </p>
                        <Button variant="danger" onClick={handleReset}>
                            Reset Database & Start Fresh
                        </Button>
                    </div>
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
