/**
 * FREEDUCATION LMS - Cloudflare Worker
 * Single-file Full Stack Application
 * * Handles:
 * 1. Database Initialization (D1)
 * 2. API Routes (Auth, Classes, Content)
 * 3. Frontend Serving (React SPA via SSR/Embedded HTML)
 */

interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
  JWT_SECRET: string;
}

// --- WORKER ENTRY POINT ---
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS Headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // --- API ROUTES ---

    // 1. Initialize Database
    if (path === "/api/init" && request.method === "POST") {
      try {
        await initDatabase(env.DB);
        return Response.json({ success: true, message: "Database initialized" }, { headers: corsHeaders });
      } catch (e: any) {
        return Response.json({ success: false, error: e.message }, { status: 500, headers: corsHeaders });
      }
    }

    // 2. Check Setup (Is Admin Created?)
    if (path === "/api/setup-status") {
      const result = await env.DB.prepare("SELECT count(*) as count FROM admins").first();
      return Response.json({ hasAdmin: (result?.count as number) > 0 }, { headers: corsHeaders });
    }

    // 3. Admin Registration (Only allowed if no admins exist)
    if (path === "/api/register-admin" && request.method === "POST") {
      const { username, password } = await request.json() as any;
      const count = await env.DB.prepare("SELECT count(*) as count FROM admins").first();
      if ((count?.count as number) > 0) {
        return Response.json({ success: false, error: "Admin already exists" }, { status: 403, headers: corsHeaders });
      }
      const hash = await hashPassword(password);
      await env.DB.prepare("INSERT INTO admins (username, password_hash) VALUES (?, ?)").bind(username, hash).run();
      return Response.json({ success: true }, { headers: corsHeaders });
    }

    // 4. Login
    if (path === "/api/login" && request.method === "POST") {
      const { username, password } = await request.json() as any;
      const user = await env.DB.prepare("SELECT * FROM admins WHERE username = ?").bind(username).first();
      if (!user) return Response.json({ success: false, error: "Invalid credentials" }, { status: 401, headers: corsHeaders });
      
      const hash = await hashPassword(password);
      if (hash !== user.password_hash) return Response.json({ success: false, error: "Invalid credentials" }, { status: 401, headers: corsHeaders });

      // In a real app, generate a real JWT here. For this demo, we return a simple session marker.
      return Response.json({ success: true, token: "admin-session-active", username: user.username }, { headers: corsHeaders });
    }

    // 5. Manage Classes
    if (path === "/api/classes") {
      if (request.method === "GET") {
        const classes = await env.DB.prepare("SELECT * FROM classes ORDER BY created_at DESC").all();
        return Response.json(classes.results, { headers: corsHeaders });
      }
      if (request.method === "POST") {
        const { name } = await request.json() as any;
        await env.DB.prepare("INSERT INTO classes (name) VALUES (?)").bind(name).run();
        return Response.json({ success: true }, { headers: corsHeaders });
      }
    }

    // 6. Manage Groups
    if (path === "/api/groups") {
      if (request.method === "GET") {
        const { class_id } = Object.fromEntries(url.searchParams);
        const groups = await env.DB.prepare("SELECT * FROM groups WHERE class_id = ?").bind(class_id).all();
        return Response.json(groups.results, { headers: corsHeaders });
      }
      if (request.method === "POST") {
        const { name, class_id } = await request.json() as any;
        await env.DB.prepare("INSERT INTO groups (name, class_id) VALUES (?, ?)").bind(name, class_id).run();
        return Response.json({ success: true }, { headers: corsHeaders });
      }
    }

    // 7. Manage Subjects
    if (path === "/api/subjects") {
      if (request.method === "GET") {
        const { class_id } = Object.fromEntries(url.searchParams);
        const subjects = await env.DB.prepare("SELECT * FROM subjects WHERE class_id = ?").bind(class_id).all();
        return Response.json(subjects.results, { headers: corsHeaders });
      }
      if (request.method === "POST") {
        const { name, class_id, is_common, group_id } = await request.json() as any;
        await env.DB.prepare("INSERT INTO subjects (name, class_id, is_common, group_id) VALUES (?, ?, ?, ?)").bind(name, class_id, is_common ? 1 : 0, group_id || null).run();
        return Response.json({ success: true }, { headers: corsHeaders });
      }
    }

    // 8. Manage Chapters
    if (path === "/api/chapters") {
      if (request.method === "GET") {
        const { subject_id } = Object.fromEntries(url.searchParams);
        const chapters = await env.DB.prepare("SELECT * FROM chapters WHERE subject_id = ? ORDER BY order_num ASC").bind(subject_id).all();
        return Response.json(chapters.results, { headers: corsHeaders });
      }
      if (request.method === "POST") {
        const { title, subject_id, order_num } = await request.json() as any;
        await env.DB.prepare("INSERT INTO chapters (title, subject_id, order_num) VALUES (?, ?, ?)").bind(title, subject_id, order_num).run();
        return Response.json({ success: true }, { headers: corsHeaders });
      }
    }

    // 9. Manage Topics
    if (path === "/api/topics") {
      if (request.method === "GET") {
        const { chapter_id } = Object.fromEntries(url.searchParams);
        const topics = await env.DB.prepare("SELECT * FROM topics WHERE chapter_id = ? ORDER BY order_num ASC").bind(chapter_id).all();
        return Response.json(topics.results, { headers: corsHeaders });
      }
      if (request.method === "POST") {
        const { title, chapter_id, content, order_num } = await request.json() as any;
        await env.DB.prepare("INSERT INTO topics (title, chapter_id, content, order_num) VALUES (?, ?, ?, ?)").bind(title, chapter_id, content, order_num).run();
        return Response.json({ success: true }, { headers: corsHeaders });
      }
    }

    // 10. Manage Questions
    if (path === "/api/questions") {
        if (request.method === "GET") {
            const { topic_id } = Object.fromEntries(url.searchParams);
            const questions = await env.DB.prepare("SELECT * FROM questions WHERE topic_id = ?").bind(topic_id).all();
            return Response.json(questions.results, { headers: corsHeaders });
        }
        if (request.method === "POST") {
            const { type, topic_id, question_text, options, answer, metadata } = await request.json() as any;
            await env.DB.prepare(`
                INSERT INTO questions (type, topic_id, question_text, options, answer, metadata) 
                VALUES (?, ?, ?, ?, ?, ?)
            `).bind(type, topic_id, question_text, JSON.stringify(options), answer, JSON.stringify(metadata)).run();
            return Response.json({ success: true }, { headers: corsHeaders });
        }
    }


    // --- FRONTEND SERVING ---
    // Serve the HTML for any other route
    return new Response(getHtml(), {
      headers: { "Content-Type": "text/html" },
    });
  },
};

// --- DATABASE HELPERS ---
async function initDatabase(db: D1Database) {
  // SQLite D1 Batch Execution
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password_hash TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS classes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      class_id INTEGER,
      FOREIGN KEY(class_id) REFERENCES classes(id)
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      class_id INTEGER,
      is_common BOOLEAN,
      group_id INTEGER NULL,
      FOREIGN KEY(class_id) REFERENCES classes(id),
      FOREIGN KEY(group_id) REFERENCES groups(id)
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS chapters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      subject_id INTEGER,
      order_num INTEGER,
      FOREIGN KEY(subject_id) REFERENCES subjects(id)
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS topics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      chapter_id INTEGER,
      content TEXT,
      order_num INTEGER,
      FOREIGN KEY(chapter_id) REFERENCES chapters(id)
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT, -- 'MCQ' or 'CQ'
      topic_id INTEGER,
      question_text TEXT,
      options TEXT, -- JSON array for MCQ
      answer TEXT,
      metadata TEXT, -- JSON { board, year, college, type }
      FOREIGN KEY(topic_id) REFERENCES topics(id)
    )`),
  ]);
}

async function hashPassword(password: string) {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// --- FRONTEND HTML (Single Page App) ---
function getHtml() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Freeducation - Learning Platform</title>
    
    <!-- Scripts & Styles -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest"></script>
    <script src="https://unpkg.com/lucide-react@latest"></script>

    <style>
        body { font-family: 'Inter', sans-serif; background-color: #f3f4f6; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #888; border-radius: 3px; }
        .glass-panel { background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); }
    </style>
</head>
<body>
    <div id="root"></div>

    <script type="text/babel">
        const { useState, useEffect } = React;

        // --- COMPONENTS ---

        const Loading = () => (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );

        const Button = ({ children, onClick, variant = 'primary', className = '' }) => {
            const baseStyle = "px-4 py-2 rounded-lg font-medium transition duration-200 transform active:scale-95";
            const variants = {
                primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md",
                secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
                danger: "bg-red-500 text-white hover:bg-red-600",
                ghost: "bg-transparent text-gray-600 hover:bg-gray-100"
            };
            return (
                <button onClick={onClick} className={\`\${baseStyle} \${variants[variant]} \${className}\`}>
                    {children}
                </button>
            );
        };

        const Input = ({ label, ...props }) => (
            <div className="mb-4">
                {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
                <input {...props} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
            </div>
        );

        const Modal = ({ isOpen, onClose, title, children }) => {
            if (!isOpen) return null;
            return (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
                        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-red-500"><i className="fas fa-times"></i></button>
                        </div>
                        <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                            {children}
                        </div>
                    </div>
                </div>
            );
        };

        // --- APP LOGIC ---

        function App() {
            const [view, setView] = useState('landing'); // landing, login, register, admin, class-content
            const [user, setUser] = useState(null);
            const [hasAdmin, setHasAdmin] = useState(null);
            
            // Initialization Check
            useEffect(() => {
                const init = async () => {
                    // Initialize DB Tables
                    await fetch('/api/init', { method: 'POST' });
                    // Check Admin Status
                    const res = await fetch('/api/setup-status');
                    const data = await res.json();
                    setHasAdmin(data.hasAdmin);
                };
                init();
            }, []);

            const login = async (username, password) => {
                const res = await fetch('/api/login', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
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

            const register = async (username, password) => {
                const res = await fetch('/api/register-admin', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ username, password })
                });
                const data = await res.json();
                if (data.success) {
                    alert("Admin created! Please login.");
                    setHasAdmin(true);
                    setView('login');
                } else {
                    alert(data.error);
                }
            };

            if (hasAdmin === null) return <Loading />;

            return (
                <div className="min-h-screen flex flex-col">
                    {/* Navigation */}
                    <nav className="bg-white border-b sticky top-0 z-30 shadow-sm">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between h-16">
                                <div className="flex items-center cursor-pointer" onClick={() => setView('landing')}>
                                    <i className="fas fa-graduation-cap text-blue-600 text-2xl mr-2"></i>
                                    <span className="font-bold text-2xl tracking-tight text-gray-900" style={{fontFamily: "'Playfair Display', serif"}}>Freeducation</span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    {user ? (
                                        <button onClick={() => setView('admin')} className="text-gray-600 hover:text-blue-600 font-medium">Dashboard</button>
                                    ) : (
                                        <button onClick={() => setView(hasAdmin ? 'login' : 'register')} className="text-blue-600 font-medium hover:bg-blue-50 px-3 py-1 rounded">
                                            {hasAdmin ? 'Admin Login' : 'Setup Admin'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </nav>

                    {/* Main Content Switch */}
                    <main className="flex-grow bg-gray-50">
                        {view === 'landing' && <LandingPage setView={setView} />}
                        {view === 'login' && <AuthForm mode="login" onSubmit={login} />}
                        {view === 'register' && <AuthForm mode="register" onSubmit={register} />}
                        {view === 'admin' && user && <AdminDashboard user={user} logout={() => { setUser(null); setView('landing'); }} />}
                    </main>
                </div>
            );
        }

        // --- SUB-VIEWS ---

        function LandingPage({ setView }) {
            const [classes, setClasses] = useState([]);

            useEffect(() => {
                fetch('/api/classes').then(res => res.json()).then(setClasses);
            }, []);

            return (
                <div className="animate-fade-in">
                    {/* Hero */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Free Academic Resources for Everyone</h1>
                        <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">Master your curriculum with our comprehensive question banks, notes, and topic-wise breakdowns.</p>
                        <button className="bg-white text-blue-700 px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition">
                            Start Learning Now
                        </button>
                    </div>

                    {/* Featured Content */}
                    <div className="max-w-7xl mx-auto px-4 py-12">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            <i className="fas fa-star text-yellow-500 mr-2"></i> Featured Classes
                        </h2>
                        
                        {classes.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300 text-gray-500">
                                No classes uploaded yet. Check back soon!
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {classes.map(cls => (
                                    <div key={cls.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 overflow-hidden group">
                                        <div className="h-32 bg-blue-50 flex items-center justify-center">
                                            <i className="fas fa-book-open text-4xl text-blue-300 group-hover:text-blue-500 transition"></i>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-gray-800 mb-2">{cls.name}</h3>
                                            <p className="text-gray-500 text-sm mb-4">Access comprehensive notes and question banks.</p>
                                            <button className="w-full py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 font-medium">
                                                Browse Resources
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        function AuthForm({ mode, onSubmit }) {
            const [username, setUsername] = useState('');
            const [password, setPassword] = useState('');

            const handleSubmit = (e) => {
                e.preventDefault();
                onSubmit(username, password);
            };

            return (
                <div className="flex items-center justify-center h-[calc(100vh-64px)]">
                    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                            {mode === 'login' ? 'Admin Login' : 'Create Owner Account'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input label="Username" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username" />
                            <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                            <Button className="w-full">{mode === 'login' ? 'Sign In' : 'Create Account'}</Button>
                        </form>
                    </div>
                </div>
            );
        }

        function AdminDashboard({ user, logout }) {
            const [activeTab, setActiveTab] = useState('classes'); // classes, settings
            const [isSidebarOpen, setSidebarOpen] = useState(true);

            // Responsive Sidebar Toggle
            useEffect(() => {
                const handleResize = () => setSidebarOpen(window.innerWidth > 768);
                window.addEventListener('resize', handleResize);
                handleResize();
                return () => window.removeEventListener('resize', handleResize);
            }, []);

            return (
                <div className="flex h-[calc(100vh-64px)] overflow-hidden">
                    {/* Sidebar (Desktop) */}
                    <div className={\`bg-white border-r w-64 flex-shrink-0 transition-all duration-300 \${isSidebarOpen ? 'translate-x-0' : '-translate-x-64 hidden md:flex md:translate-x-0'}\`}>
                        <div className="p-4 w-full flex flex-col h-full">
                            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Main Menu</div>
                            <nav className="flex-1 space-y-2">
                                <NavItem icon="fas fa-chalkboard-teacher" label="Classes & Content" active={activeTab === 'classes'} onClick={() => setActiveTab('classes')} />
                                <NavItem icon="fas fa-cog" label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                            </nav>
                            <div className="pt-4 border-t">
                                <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                                        {user.username[0].toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{user.username}</p>
                                        <p className="text-xs text-gray-500">Administrator</p>
                                    </div>
                                    <button onClick={logout} className="text-gray-400 hover:text-red-500"><i className="fas fa-sign-out-alt"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8 custom-scrollbar pb-20 md:pb-8">
                        {activeTab === 'classes' && <ClassManager />}
                        {activeTab === 'settings' && (
                            <div className="max-w-2xl bg-white p-6 rounded-xl shadow-sm">
                                <h2 className="text-xl font-bold mb-4">Settings</h2>
                                <p className="text-gray-600">Platform configuration would go here.</p>
                                <div className="mt-4 p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm">
                                    <i className="fas fa-info-circle mr-2"></i> Version 1.0.0 - Cloudflare Worker Edition
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile Bottom Nav */}
                    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-3 z-40">
                         <MobileNavItem icon="fas fa-chalkboard-teacher" label="Classes" active={activeTab === 'classes'} onClick={() => setActiveTab('classes')} />
                         <MobileNavItem icon="fas fa-cog" label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                    </div>
                </div>
            );
        }

        const NavItem = ({ icon, label, active, onClick }) => (
            <button onClick={onClick} className={\`w-full flex items-center px-4 py-3 rounded-lg transition-colors \${active ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}\`}>
                <i className={\`\${icon} w-6 text-center mr-3 \${active ? 'text-blue-600' : 'text-gray-400'}\`}></i>
                {label}
            </button>
        );

        const MobileNavItem = ({ icon, label, active, onClick }) => (
            <button onClick={onClick} className={\`flex flex-col items-center justify-center w-full \${active ? 'text-blue-600' : 'text-gray-400'}\`}>
                <i className={\`\${icon} text-xl mb-1\`}></i>
                <span className="text-[10px] font-medium">{label}</span>
            </button>
        );

        // --- CONTENT MANAGEMENT (The Complex Part) ---

        function ClassManager() {
            const [classes, setClasses] = useState([]);
            const [selectedClass, setSelectedClass] = useState(null);
            const [isCreateModalOpen, setCreateModalOpen] = useState(false);
            const [newClassName, setNewClassName] = useState('');

            const loadClasses = () => fetch('/api/classes').then(res => res.json()).then(setClasses);

            useEffect(() => { loadClasses(); }, []);

            const handleCreateClass = async () => {
                if (!newClassName) return;
                await fetch('/api/classes', { method: 'POST', body: JSON.stringify({ name: newClassName }) });
                setNewClassName('');
                setCreateModalOpen(false);
                loadClasses();
            };

            if (selectedClass) {
                return <ClassDetail cls={selectedClass} onBack={() => setSelectedClass(null)} />;
            }

            return (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Classes Management</h2>
                        <Button onClick={() => setCreateModalOpen(true)}><i className="fas fa-plus mr-2"></i> Add Class</Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {classes.map(cls => (
                            <div key={cls.id} onClick={() => setSelectedClass(cls)} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-blue-300 transition group">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-bold text-gray-800">{cls.name}</h3>
                                    <i className="fas fa-chevron-right text-gray-300 group-hover:text-blue-500"></i>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">Manage subjects, groups, and questions.</p>
                            </div>
                        ))}
                    </div>

                    <Modal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} title="Create New Class">
                        <Input label="Class Name" placeholder="e.g., Class 11, HSC 2025" value={newClassName} onChange={e => setNewClassName(e.target.value)} />
                        <div className="flex justify-end mt-4">
                            <Button onClick={handleCreateClass}>Create Class</Button>
                        </div>
                    </Modal>
                </div>
            );
        }

        function ClassDetail({ cls, onBack }) {
            // State for Groups, Subjects, etc.
            const [groups, setGroups] = useState([]);
            const [subjects, setSubjects] = useState([]);
            const [activeTab, setActiveTab] = useState('structure'); // structure, subjects
            const [isGroupModalOpen, setGroupModalOpen] = useState(false);
            const [newGroupName, setNewGroupName] = useState('');
            const [isSubjectModalOpen, setSubjectModalOpen] = useState(false);
            const [newSubject, setNewSubject] = useState({ name: '', is_common: true, group_id: '' });
            
            const [selectedSubject, setSelectedSubject] = useState(null); // For drilling down

            const refreshData = async () => {
                const [gRes, sRes] = await Promise.all([
                    fetch(\`/api/groups?class_id=\${cls.id}\`),
                    fetch(\`/api/subjects?class_id=\${cls.id}\`)
                ]);
                setGroups(await gRes.json());
                setSubjects(await sRes.json());
            };

            useEffect(() => { refreshData(); }, [cls]);

            const createGroup = async () => {
                await fetch('/api/groups', { method: 'POST', body: JSON.stringify({ name: newGroupName, class_id: cls.id }) });
                setGroupModalOpen(false); setNewGroupName(''); refreshData();
            };

            const createSubject = async () => {
                await fetch('/api/subjects', { method: 'POST', body: JSON.stringify({ ...newSubject, class_id: cls.id }) });
                setSubjectModalOpen(false); setNewSubject({ name: '', is_common: true, group_id: '' }); refreshData();
            };

            if (selectedSubject) {
                return <SubjectManager subject={selectedSubject} onBack={() => setSelectedSubject(null)} />;
            }

            return (
                <div className="animate-fade-in">
                    <button onClick={onBack} className="text-gray-500 hover:text-blue-600 mb-4 flex items-center text-sm font-medium">
                        <i className="fas fa-arrow-left mr-2"></i> Back to Classes
                    </button>
                    
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">{cls.name} <span className="text-lg font-normal text-gray-500">/ Dashboard</span></h2>

                    {/* Stats / Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl border shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-gray-700">Groups</h3>
                                <Button variant="ghost" onClick={() => setGroupModalOpen(true)} className="text-xs">+ Add Group</Button>
                            </div>
                            <div className="space-y-2">
                                {groups.length === 0 && <p className="text-sm text-gray-400 italic">No groups (e.g., Science, Arts)</p>}
                                {groups.map(g => (
                                    <div key={g.id} className="flex items-center text-sm bg-gray-50 p-2 rounded">
                                        <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div> {g.name}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-gray-700">Subjects</h3>
                                <Button variant="ghost" onClick={() => setSubjectModalOpen(true)} className="text-xs">+ Add Subject</Button>
                            </div>
                            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                                {subjects.length === 0 && <p className="text-sm text-gray-400 italic">No subjects added.</p>}
                                {subjects.map(s => {
                                    const groupName = groups.find(g => g.id === s.group_id)?.name;
                                    return (
                                        <div key={s.id} onClick={() => setSelectedSubject(s)} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded cursor-pointer hover:bg-blue-50 transition">
                                            <span className="font-medium">{s.name}</span>
                                            <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-600">
                                                {s.is_common ? 'Common' : groupName || 'Group Specific'}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <Modal isOpen={isGroupModalOpen} onClose={() => setGroupModalOpen(false)} title="Add Class Group">
                        <Input label="Group Name" placeholder="e.g. Science, Commerce" value={newGroupName} onChange={e => setNewGroupName(e.target.value)} />
                        <div className="flex justify-end"><Button onClick={createGroup}>Save</Button></div>
                    </Modal>

                    <Modal isOpen={isSubjectModalOpen} onClose={() => setSubjectModalOpen(false)} title="Add Subject">
                        <Input label="Subject Name" placeholder="e.g. Physics 1st Paper" value={newSubject.name} onChange={e => setNewSubject({...newSubject, name: e.target.value})} />
                        
                        <div className="mb-4">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input type="checkbox" checked={newSubject.is_common} onChange={e => setNewSubject({...newSubject, is_common: e.target.checked})} className="form-checkbox h-4 w-4 text-blue-600" />
                                <span className="text-sm text-gray-700">This is a common subject (for all groups)</span>
                            </label>
                        </div>

                        {!newSubject.is_common && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Group</label>
                                <select 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
                                    value={newSubject.group_id}
                                    onChange={e => setNewSubject({...newSubject, group_id: parseInt(e.target.value)})}
                                >
                                    <option value="">Select Group...</option>
                                    {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                                </select>
                            </div>
                        )}
                        <div className="flex justify-end"><Button onClick={createSubject}>Save Subject</Button></div>
                    </Modal>
                </div>
            );
        }

        function SubjectManager({ subject, onBack }) {
            const [chapters, setChapters] = useState([]);
            const [selectedChapter, setSelectedChapter] = useState(null);
            const [isChapterModalOpen, setChapterModalOpen] = useState(false);
            const [newChapterTitle, setNewChapterTitle] = useState('');

            const loadChapters = () => fetch(\`/api/chapters?subject_id=\${subject.id}\`).then(res => res.json()).then(setChapters);
            useEffect(() => { loadChapters(); }, [subject]);

            const createChapter = async () => {
                await fetch('/api/chapters', { method: 'POST', body: JSON.stringify({ title: newChapterTitle, subject_id: subject.id, order_num: chapters.length + 1 }) });
                setChapterModalOpen(false); setNewChapterTitle(''); loadChapters();
            };

            if (selectedChapter) {
                return <TopicManager chapter={selectedChapter} onBack={() => setSelectedChapter(null)} />;
            }

            return (
                <div className="animate-fade-in">
                    <button onClick={onBack} className="text-gray-500 hover:text-blue-600 mb-4 flex items-center text-sm font-medium">
                        <i className="fas fa-arrow-left mr-2"></i> Back to Subject
                    </button>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">{subject.name} <span className="text-gray-400">/ Chapters</span></h2>
                        <Button onClick={() => setChapterModalOpen(true)}>+ Add Chapter</Button>
                    </div>

                    <div className="space-y-3">
                        {chapters.map((ch, idx) => (
                            <div key={ch.id} onClick={() => setSelectedChapter(ch)} className="bg-white p-4 rounded-lg border hover:border-blue-400 cursor-pointer flex justify-between items-center shadow-sm">
                                <div className="flex items-center">
                                    <span className="bg-blue-100 text-blue-700 font-bold w-8 h-8 flex items-center justify-center rounded-lg mr-4">{idx + 1}</span>
                                    <span className="font-semibold text-gray-800">{ch.title}</span>
                                </div>
                                <i className="fas fa-chevron-right text-gray-300"></i>
                            </div>
                        ))}
                    </div>

                    <Modal isOpen={isChapterModalOpen} onClose={() => setChapterModalOpen(false)} title="New Chapter">
                        <Input label="Chapter Title" value={newChapterTitle} onChange={e => setNewChapterTitle(e.target.value)} />
                        <div className="flex justify-end"><Button onClick={createChapter}>Add Chapter</Button></div>
                    </Modal>
                </div>
            );
        }

        function TopicManager({ chapter, onBack }) {
            const [topics, setTopics] = useState([]);
            const [selectedTopic, setSelectedTopic] = useState(null);
            const [isTopicModalOpen, setTopicModalOpen] = useState(false);
            const [newTopic, setNewTopic] = useState({ title: '', content: '' });

            const loadTopics = () => fetch(\`/api/topics?chapter_id=\${chapter.id}\`).then(res => res.json()).then(setTopics);
            useEffect(() => { loadTopics(); }, [chapter]);

            const createTopic = async () => {
                await fetch('/api/topics', { method: 'POST', body: JSON.stringify({ ...newTopic, chapter_id: chapter.id, order_num: topics.length + 1 }) });
                setTopicModalOpen(false); setNewTopic({ title: '', content: '' }); loadTopics();
            };

            if (selectedTopic) return <QuestionManager topic={selectedTopic} onBack={() => setSelectedTopic(null)} />;

            return (
                <div className="animate-fade-in">
                     <button onClick={onBack} className="text-gray-500 hover:text-blue-600 mb-4 flex items-center text-sm font-medium">
                        <i className="fas fa-arrow-left mr-2"></i> Back to Chapters
                    </button>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">{chapter.title} <span className="text-gray-400">/ Topics</span></h2>
                        <Button onClick={() => setTopicModalOpen(true)}>+ Add Topic</Button>
                    </div>
                    <div className="space-y-3">
                        {topics.map((t, idx) => (
                            <div key={t.id} onClick={() => setSelectedTopic(t)} className="bg-white p-4 rounded-lg border hover:border-blue-400 cursor-pointer shadow-sm">
                                <h4 className="font-bold text-gray-800 mb-1">{idx + 1}. {t.title}</h4>
                                <p className="text-sm text-gray-500 truncate">{t.content}</p>
                            </div>
                        ))}
                    </div>

                    <Modal isOpen={isTopicModalOpen} onClose={() => setTopicModalOpen(false)} title="New Topic">
                        <Input label="Topic Title" value={newTopic.title} onChange={e => setNewTopic({...newTopic, title: e.target.value})} />
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Content (Brief Note)</label>
                            <textarea className="w-full border rounded-lg p-2" rows="3" value={newTopic.content} onChange={e => setNewTopic({...newTopic, content: e.target.value})}></textarea>
                        </div>
                        <div className="flex justify-end"><Button onClick={createTopic}>Add Topic</Button></div>
                    </Modal>
                </div>
            )
        }

        function QuestionManager({ topic, onBack }) {
            const [questions, setQuestions] = useState([]);
            const [isQModalOpen, setQModalOpen] = useState(false);
            const [qType, setQType] = useState('MCQ'); // MCQ or CQ
            const [newQ, setNewQ] = useState({
                question_text: '',
                options: ['', '', '', ''],
                answer: '',
                metadata: { board: '', year: '', college: '', type: 'NCTB' } // type: NCTB, Custom
            });

            const loadQuestions = () => fetch(\`/api/questions?topic_id=\${topic.id}\`).then(res => res.json()).then(setQuestions);
            useEffect(() => { loadQuestions(); }, [topic]);

            const saveQuestion = async () => {
                await fetch('/api/questions', { 
                    method: 'POST', 
                    body: JSON.stringify({ 
                        type: qType, 
                        topic_id: topic.id, 
                        question_text: newQ.question_text, 
                        options: qType === 'MCQ' ? newQ.options : [], 
                        answer: newQ.answer, 
                        metadata: newQ.metadata 
                    }) 
                });
                setQModalOpen(false); 
                // Reset form slightly but keep metadata for speed
                setNewQ({ ...newQ, question_text: '', options: ['', '', '', ''], answer: '' });
                loadQuestions();
            };

            const updateOption = (idx, val) => {
                const newOpts = [...newQ.options];
                newOpts[idx] = val;
                setNewQ({ ...newQ, options: newOpts });
            };

            return (
                <div className="animate-fade-in">
                    <button onClick={onBack} className="text-gray-500 hover:text-blue-600 mb-4 flex items-center text-sm font-medium">
                        <i className="fas fa-arrow-left mr-2"></i> Back to Topics
                    </button>
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{topic.title}</h2>
                            <p className="text-sm text-gray-500">Question Bank Manager</p>
                        </div>
                        <Button onClick={() => setQModalOpen(true)}>+ Add Question</Button>
                    </div>

                    <div className="space-y-4">
                        {questions.map((q, i) => (
                            <div key={q.id} className="bg-white p-5 rounded-lg border shadow-sm">
                                <div className="flex justify-between mb-2">
                                    <span className={\`text-xs font-bold px-2 py-1 rounded \${q.type === 'MCQ' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}\`}>{q.type}</span>
                                    <div className="text-xs text-gray-400 space-x-2">
                                        {JSON.parse(q.metadata).board && <span>{JSON.parse(q.metadata).board}</span>}
                                        {JSON.parse(q.metadata).year && <span>{JSON.parse(q.metadata).year}</span>}
                                    </div>
                                </div>
                                <p className="font-medium text-gray-800 mb-3">{q.question_text}</p>
                                {q.type === 'MCQ' && (
                                    <div className="grid grid-cols-2 gap-2">
                                        {JSON.parse(q.options).map((opt, idx) => (
                                            <div key={idx} className={\`text-sm p-2 rounded border \${opt === q.answer ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-100 text-gray-500'}\`}>
                                                {String.fromCharCode(65+idx)}. {opt}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {q.type === 'CQ' && <div className="text-sm text-gray-500 italic border-l-2 border-gray-300 pl-3">Answer Key: {q.answer}</div>}
                            </div>
                        ))}
                    </div>

                    <Modal isOpen={isQModalOpen} onClose={() => setQModalOpen(false)} title="Add Question">
                        <div className="flex space-x-4 mb-4">
                            <button onClick={() => setQType('MCQ')} className={\`flex-1 py-2 rounded-lg font-bold text-sm \${qType === 'MCQ' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}\`}>MCQ</button>
                            <button onClick={() => setQType('CQ')} className={\`flex-1 py-2 rounded-lg font-bold text-sm \${qType === 'CQ' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}\`}>Creative Question (CQ)</button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <Input label="Board Name" placeholder="Dhaka Board" value={newQ.metadata.board} onChange={e => setNewQ({...newQ, metadata: {...newQ.metadata, board: e.target.value}})} />
                            <Input label="Year" placeholder="2023" value={newQ.metadata.year} onChange={e => setNewQ({...newQ, metadata: {...newQ.metadata, year: e.target.value}})} />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
                            <textarea className="w-full border rounded-lg p-2" rows="3" value={newQ.question_text} onChange={e => setNewQ({...newQ, question_text: e.target.value})}></textarea>
                        </div>

                        {qType === 'MCQ' && (
                            <div className="space-y-2 mb-4">
                                <label className="block text-sm font-medium text-gray-700">Options</label>
                                {newQ.options.map((opt, idx) => (
                                    <div key={idx} className="flex items-center">
                                        <span className="w-6 font-bold text-gray-400">{String.fromCharCode(65+idx)}</span>
                                        <input className="flex-1 border rounded px-2 py-1" value={opt} onChange={e => updateOption(idx, e.target.value)} placeholder={\`Option \${idx+1}\`} />
                                        <input type="radio" name="correct_ans" className="ml-2" onChange={() => setNewQ({...newQ, answer: opt})} checked={newQ.answer === opt && opt !== ''} />
                                    </div>
                                ))}
                            </div>
                        )}

                        {qType === 'CQ' && (
                             <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Answer Key / Hints</label>
                                <textarea className="w-full border rounded-lg p-2" rows="2" value={newQ.answer} onChange={e => setNewQ({...newQ, answer: e.target.value})}></textarea>
                            </div>
                        )}

                        <div className="flex justify-end"><Button onClick={saveQuestion}>Save Question</Button></div>
                    </Modal>
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
