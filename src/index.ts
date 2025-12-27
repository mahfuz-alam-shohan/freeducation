export interface Env {
    DB: D1Database;
    BUCKET: R2Bucket;
    JWT_SECRET: string;
}

// --- 1. PROFESSIONAL DATABASE SCHEMA (Version 2.0) ---
const REPAIR_SQL = [
    "PRAGMA foreign_keys = OFF;",
    // Drop in correct order to avoid constraint errors
    "DROP TABLE IF EXISTS exam_questions;",
    "DROP TABLE IF EXISTS exams;",
    "DROP TABLE IF EXISTS questions;",
    "DROP TABLE IF EXISTS topics;",
    "DROP TABLE IF EXISTS chapters;",
    "DROP TABLE IF EXISTS subjects;",
    "DROP TABLE IF EXISTS groups;",
    "DROP TABLE IF EXISTS classes;",
    "DROP TABLE IF EXISTS programs;", 
    "DROP TABLE IF EXISTS users;",
    "PRAGMA foreign_keys = ON;",

    // Auth
    `CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        email TEXT UNIQUE NOT NULL, 
        password_hash TEXT NOT NULL, 
        name TEXT NOT NULL, 
        role TEXT DEFAULT 'student', 
        created_at INTEGER DEFAULT (unixepoch())
    );`,

    // Structure Level 1: Programs (SSC, HSC)
    `CREATE TABLE programs (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        name TEXT NOT NULL UNIQUE, 
        slug TEXT UNIQUE NOT NULL
    );`,

    // Structure Level 2: Classes (9, 10)
    `CREATE TABLE classes (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        program_id INTEGER NOT NULL,
        name TEXT NOT NULL, 
        FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE
    );`,

    // Structure Level 3: Groups (Science, Arts)
    `CREATE TABLE groups (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        name TEXT NOT NULL
    );`,

    // Structure Level 4: Subjects (Physics)
    `CREATE TABLE subjects (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        class_id INTEGER NOT NULL,
        group_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        code TEXT, 
        icon TEXT,
        FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
        FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
    );`,

    // Structure Level 5: Chapters (Vector)
    `CREATE TABLE chapters (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        subject_id INTEGER NOT NULL, 
        title TEXT NOT NULL, 
        sort_order INTEGER DEFAULT 0, 
        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
    );`,

    // Structure Level 6: Topics (Scalar Product) - THE CORE UNIT
    `CREATE TABLE topics (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        chapter_id INTEGER NOT NULL, 
        title TEXT NOT NULL, 
        FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
    );`,

    // Question Bank (Tagged by Topic)
    `CREATE TABLE questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        topic_id INTEGER NOT NULL, 
        type TEXT DEFAULT 'mcq', 
        content TEXT NOT NULL, -- JSON: { question: "", options: [], correct: 0, explanation: "" }
        difficulty TEXT DEFAULT 'medium',
        FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
    );`,

    // Exam Engine (Generated Papers)
    `CREATE TABLE exams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        subject_id INTEGER NOT NULL,
        duration_minutes INTEGER DEFAULT 25,
        total_marks INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        created_at INTEGER DEFAULT (unixepoch()),
        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
    );`,

    `CREATE TABLE exam_questions (
        exam_id INTEGER NOT NULL,
        question_id INTEGER NOT NULL,
        FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
        FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
    );`,

    // SEED DATA
    "INSERT INTO groups (name) VALUES ('Common'), ('Science'), ('Humanities (Arts)'), ('Business Studies (Commerce)');",
    "INSERT INTO programs (name, slug) VALUES ('SSC (Secondary)', 'ssc'), ('HSC (Higher Secondary)', 'hsc');",
    
    // Seed Classes
    "INSERT INTO classes (program_id, name) SELECT id, 'Class 9' FROM programs WHERE slug='ssc';",
    "INSERT INTO classes (program_id, name) SELECT id, 'Class 10' FROM programs WHERE slug='ssc';",
    "INSERT INTO classes (program_id, name) SELECT id, 'Class 11' FROM programs WHERE slug='hsc';",
    "INSERT INTO classes (program_id, name) SELECT id, 'Class 12' FROM programs WHERE slug='hsc';"
];

// --- UTILS ---
async function hashPassword(password: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const jsonResponse = (data: any, status = 200) => 
    new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });

// --- PROFESSIONAL ADMIN UI ---
const ADMIN_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Freeducation Admin Suite</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        body { background-color: #f8fafc; font-family: 'Inter', sans-serif; }
        .sidebar-link { display: flex; align-items: center; padding: 12px 16px; color: #94a3b8; border-radius: 8px; margin-bottom: 4px; cursor: pointer; transition: all 0.2s; font-weight: 500; }
        .sidebar-link:hover { background-color: #1e293b; color: white; }
        .sidebar-link.active { background-color: #2563eb; color: white; }
        .card { background: white; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    </style>
</head>
<body class="h-screen flex overflow-hidden">

    <!-- SIDEBAR -->
    <aside class="w-72 bg-gray-900 text-white flex flex-col shadow-2xl z-50">
        <div class="h-16 flex items-center px-6 border-b border-gray-800">
            <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">F</div>
                <span class="text-lg font-bold tracking-tight">Freeducation</span>
            </div>
        </div>
        
        <nav class="flex-1 px-4 py-6 overflow-y-auto space-y-1">
            <div onclick="switchView('dashboard')" id="nav-dashboard" class="sidebar-link active">
                <i data-lucide="layout-grid" class="w-5 h-5 mr-3"></i> Dashboard
            </div>
            
            <div class="mt-6 mb-2 text-xs font-bold text-gray-500 uppercase tracking-wider px-2">Academic Management</div>
            <div onclick="switchView('curriculum')" id="nav-curriculum" class="sidebar-link">
                <i data-lucide="book-open" class="w-5 h-5 mr-3"></i> Curriculum Tree
            </div>
            <div onclick="switchView('topics')" id="nav-topics" class="sidebar-link">
                <i data-lucide="layers" class="w-5 h-5 mr-3"></i> Topics & Content
            </div>
            
            <div class="mt-6 mb-2 text-xs font-bold text-gray-500 uppercase tracking-wider px-2">Exams & Results</div>
            <div onclick="switchView('exam-builder')" id="nav-exam-builder" class="sidebar-link">
                <i data-lucide="file-plus" class="w-5 h-5 mr-3"></i> Exam Generator
            </div>
             <div onclick="switchView('questions')" id="nav-questions" class="sidebar-link">
                <i data-lucide="database" class="w-5 h-5 mr-3"></i> Question Bank
            </div>
        </nav>
        
        <div class="p-4 border-t border-gray-800 bg-gray-900">
            <button onclick="logout()" class="flex items-center text-red-400 hover:text-red-300 text-sm font-medium transition w-full px-2 py-2 rounded hover:bg-gray-800">
                <i data-lucide="log-out" class="w-4 h-4 mr-2"></i> Sign Out
            </button>
        </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="flex-1 flex flex-col h-screen overflow-hidden relative bg-gray-50">
        
        <!-- HEADER -->
        <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-40">
            <h2 id="page-title" class="text-xl font-bold text-gray-800">Dashboard</h2>
            <div class="flex items-center gap-4">
                <div class="text-right hidden md:block">
                    <p class="text-sm font-medium text-gray-900" id="admin-name-display">Administrator</p>
                    <p class="text-xs text-gray-500">Super Admin</p>
                </div>
                <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">A</div>
            </div>
        </header>

        <!-- SCROLLABLE CONTENT AREA -->
        <div class="flex-1 overflow-auto p-8 relative" id="main-container">

            <!-- LOADER -->
            <div id="loader" class="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p class="mt-4 text-gray-500 font-medium">Connecting to secure backend...</p>
            </div>

            <!-- LOGIN VIEW -->
            <div id="view-login" class="hidden flex items-center justify-center h-full">
                <div class="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <div class="text-center mb-8">
                        <div class="w-12 h-12 bg-blue-600 rounded-xl mx-auto flex items-center justify-center text-white font-bold text-xl mb-4">F</div>
                        <h2 class="text-2xl font-bold text-gray-900">Admin Portal</h2>
                        <p class="text-gray-500">Secure access required</p>
                    </div>
                    <div class="space-y-4">
                        <input type="email" id="email" placeholder="Email Address" class="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition">
                        <input type="password" id="password" placeholder="Password" class="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition">
                        <button onclick="login()" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-blue-500/30">Login</button>
                    </div>
                </div>
            </div>

            <!-- SETUP VIEW -->
            <div id="view-setup" class="hidden max-w-lg mx-auto mt-10">
                <div class="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-green-500">
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">System Setup</h2>
                    <p class="text-gray-500 mb-6">Welcome to Freeducation. Create the root administrator.</p>
                    <div class="space-y-4">
                        <input type="text" id="setupName" placeholder="Full Name" class="w-full p-3 border rounded-lg">
                        <input type="email" id="setupEmail" placeholder="Email" class="w-full p-3 border rounded-lg">
                        <input type="password" id="setupPass" placeholder="Strong Password" class="w-full p-3 border rounded-lg">
                        <button onclick="performSetup()" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-lg">Complete Installation</button>
                    </div>
                </div>
            </div>

            <!-- DASHBOARD VIEW -->
            <div id="view-dashboard" class="hidden space-y-6">
                <!-- Repair Alert -->
                <div id="repair-alert" class="hidden bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex justify-between items-center">
                    <div>
                        <h3 class="text-red-800 font-bold">Schema Mismatch Detected</h3>
                        <p class="text-red-600 text-sm">Database needs to be updated for the new Exam Engine.</p>
                    </div>
                    <button onclick="repairSystem()" class="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 shadow-md">🛠️ Repair Database</button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div class="card p-6 border-l-4 border-blue-500">
                        <p class="text-gray-500 text-xs font-bold uppercase">Total Subjects</p>
                        <h3 class="text-3xl font-bold text-gray-800 mt-2" id="dash-subjects">-</h3>
                    </div>
                    <div class="card p-6 border-l-4 border-purple-500">
                        <p class="text-gray-500 text-xs font-bold uppercase">Topics</p>
                        <h3 class="text-3xl font-bold text-gray-800 mt-2" id="dash-topics">-</h3>
                    </div>
                    <div class="card p-6 border-l-4 border-green-500">
                        <p class="text-gray-500 text-xs font-bold uppercase">Questions</p>
                        <h3 class="text-3xl font-bold text-gray-800 mt-2" id="dash-questions">-</h3>
                    </div>
                    <div class="card p-6 border-l-4 border-orange-500">
                        <p class="text-gray-500 text-xs font-bold uppercase">Exams Generated</p>
                        <h3 class="text-3xl font-bold text-gray-800 mt-2" id="dash-exams">-</h3>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="card p-6">
                        <h3 class="font-bold text-lg mb-4 text-gray-800">Quick Actions</h3>
                        <div class="grid grid-cols-2 gap-4">
                            <button onclick="switchView('exam-builder')" class="p-4 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition text-center font-medium border border-blue-100">
                                <i data-lucide="file-plus" class="mx-auto mb-2 w-6 h-6"></i>
                                Generate Exam
                            </button>
                            <button onclick="switchView('questions')" class="p-4 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition text-center font-medium border border-green-100">
                                <i data-lucide="database" class="mx-auto mb-2 w-6 h-6"></i>
                                Add Question
                            </button>
                        </div>
                    </div>
                     <div class="card p-6 flex flex-col justify-center items-center text-center">
                        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <i data-lucide="graduation-cap" class="w-8 h-8 text-gray-400"></i>
                        </div>
                        <h3 class="text-gray-900 font-bold">Student Portal Status</h3>
                        <p class="text-green-500 font-medium text-sm mt-1">● Online & Active</p>
                    </div>
                </div>
            </div>

            <!-- EXAM BUILDER VIEW (NEW) -->
            <div id="view-exam-builder" class="hidden h-full flex flex-col">
                <div class="card p-6 mb-6">
                    <h2 class="text-lg font-bold mb-4">Step 1: Exam Configuration</h2>
                    <div class="grid grid-cols-3 gap-4 mb-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                            <select id="exam-subject" class="w-full p-2 border rounded-lg bg-gray-50" onchange="loadTopicsForExam(this.value)">
                                <option>Select Subject...</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Exam Title</label>
                            <input type="text" id="exam-title" placeholder="e.g. Weekly Test on Motion" class="w-full p-2 border rounded-lg">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Duration (Min)</label>
                            <input type="number" id="exam-duration" value="30" class="w-full p-2 border rounded-lg">
                        </div>
                    </div>
                </div>

                <div class="flex-1 flex gap-6 overflow-hidden">
                    <!-- Topics List -->
                    <div class="w-1/2 card flex flex-col">
                        <div class="p-4 border-b bg-gray-50 rounded-t-xl">
                            <h3 class="font-bold text-gray-700">Step 2: Select Topics</h3>
                            <p class="text-xs text-gray-500">Check topics to include in this exam</p>
                        </div>
                        <div id="exam-topic-list" class="p-4 overflow-y-auto flex-1 space-y-3">
                            <p class="text-gray-400 text-sm text-center mt-10">Select a subject first to see topics.</p>
                        </div>
                    </div>

                    <!-- Generate Action -->
                    <div class="w-1/2 card p-8 flex flex-col items-center justify-center text-center">
                        <div class="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                            <i data-lucide="wand-2" class="w-10 h-10 text-blue-600"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-2">Ready to Generate?</h3>
                        <p class="text-gray-500 mb-8 max-w-xs">Our engine will randomly select questions from your selected topics to create a unique paper.</p>
                        <button onclick="generateExam()" class="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-xl shadow-blue-500/30 transition transform hover:scale-105">
                            Generate Exam Paper
                        </button>
                    </div>
                </div>
            </div>

            <!-- CURRICULUM VIEW -->
            <div id="view-curriculum" class="hidden">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-gray-500 font-medium">Academic Hierarchy</h3>
                    <button onclick="openModal('modal-subject')" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">+ Add Subject</button>
                </div>
                <div id="curriculum-tree" class="space-y-6"></div>
            </div>

            <!-- TOPICS & CONTENT VIEW -->
            <div id="view-topics" class="hidden">
                <div class="card p-6 h-full flex flex-col">
                    <div class="flex gap-4 mb-6">
                        <select id="content-subject-select" class="flex-1 p-2 border rounded-lg" onchange="loadChapters(this.value)">
                            <option>Select Subject to Manage Content...</option>
                        </select>
                        <button onclick="addChapter()" class="bg-gray-800 text-white px-4 py-2 rounded-lg font-medium">+ New Chapter</button>
                    </div>
                    <div id="content-area" class="flex-1 overflow-y-auto space-y-4">
                        <p class="text-center text-gray-400 mt-20">Select a subject to view chapters and topics.</p>
                    </div>
                </div>
            </div>

        </div>
    </main>

    <!-- MODAL: ADD SUBJECT -->
    <div id="modal-subject" class="hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100">
            <h3 class="text-xl font-bold mb-4">Add New Subject</h3>
            <div class="space-y-4">
                <select id="new-sub-class" class="w-full p-3 border rounded-lg bg-gray-50"></select>
                <select id="new-sub-group" class="w-full p-3 border rounded-lg bg-gray-50"></select>
                <input type="text" id="new-sub-name" placeholder="Subject Name" class="w-full p-3 border rounded-lg">
                <input type="text" id="new-sub-code" placeholder="Code (e.g. 101)" class="w-full p-3 border rounded-lg">
            </div>
            <div class="mt-6 flex justify-end gap-3">
                <button onclick="document.getElementById('modal-subject').classList.add('hidden')" class="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancel</button>
                <button onclick="submitSubject()" class="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Create Subject</button>
            </div>
        </div>
    </div>

    <script>
        const API = window.location.origin;
        let token = localStorage.getItem('token');
        let globalData = {}; // Stores fetched programs/classes for reuse

        // --- INIT ---
        window.onload = async () => {
            lucide.createIcons();
            try {
                const res = await fetch(API + '/api/auth/status');
                const status = await res.json();
                document.getElementById('loader').classList.add('hidden');

                if (!res.ok) {
                    if(status.error && status.error.includes("Schema")) {
                        document.getElementById('repair-alert').classList.remove('hidden');
                        showView('view-dashboard');
                    } else {
                        alert("Backend Error: " + status.error);
                    }
                    return;
                }

                if (!status.adminExists) showView('view-setup');
                else if (token) {
                    initDashboard();
                    document.getElementById('admin-name-display').innerText = localStorage.getItem('adminName') || 'Admin';
                } else showView('view-login');
            } catch (e) {
                document.getElementById('loader').classList.add('hidden');
                alert("Connection Error");
            }
        };

        // --- NAVIGATION & VIEWS ---
        function switchView(id) {
            document.querySelectorAll('.sidebar-link').forEach(el => el.classList.remove('active'));
            document.getElementById('nav-' + id)?.classList.add('active');
            
            showView('view-' + id);
            
            const titles = {
                'dashboard': 'Dashboard',
                'curriculum': 'Curriculum Manager',
                'topics': 'Content Manager',
                'exam-builder': 'Exam Generator',
                'questions': 'Question Bank'
            };
            document.getElementById('page-title').innerText = titles[id] || 'Overview';

            if(id === 'curriculum') loadCurriculum();
            if(id === 'topics' || id === 'exam-builder') loadSubjectsDropdown();
        }

        function showView(id) {
            const container = document.getElementById('main-container');
            Array.from(container.children).forEach(c => {
                if(c.id !== 'loader' && !c.classList.contains('hidden')) c.classList.add('hidden');
            });
            document.getElementById(id).classList.remove('hidden');
        }

        async function initDashboard() {
            switchView('dashboard');
            // Fetch Stats
            const res = await fetch(API + '/api/admin/stats', { headers: { 'Authorization': token } });
            if(res.ok) {
                const stats = await res.json();
                document.getElementById('dash-subjects').innerText = stats.subjects;
                document.getElementById('dash-topics').innerText = stats.topics;
                document.getElementById('dash-questions').innerText = stats.questions;
                document.getElementById('dash-exams').innerText = stats.exams;
            }
        }

        // --- CORE FUNCTIONS ---

        async function loadCurriculum() {
            const res = await fetch(API + '/api/admin/curriculum', { headers: { 'Authorization': token } });
            const data = await res.json();
            globalData = data;
            
            // Populate Modal Dropdowns
            const clsSel = document.getElementById('new-sub-class');
            const grpSel = document.getElementById('new-sub-group');
            clsSel.innerHTML = ''; grpSel.innerHTML = '';
            data.classes.forEach(c => clsSel.add(new Option(c.name, c.id)));
            data.groups.forEach(g => grpSelect.add(new Option(g.name, g.id))); // Fix typo in next render
            
            // Render Tree
            const container = document.getElementById('curriculum-tree');
            container.innerHTML = '';

            data.programs.forEach(prog => {
                const progClasses = data.classes.filter(c => c.program_id === prog.id);
                let html = \`<div class="card p-6 mb-4"><h3 class="font-bold text-lg mb-4 text-blue-800 flex items-center"><i data-lucide="book" class="w-5 h-5 mr-2"></i> \${prog.name}</h3>\`;
                
                progClasses.forEach(cls => {
                    const subjects = data.subjects.filter(s => s.class_id === cls.id);
                    html += \`<div class="ml-4 mb-4"><h4 class="font-semibold text-gray-700 mb-2">\${cls.name}</h4><div class="grid grid-cols-1 md:grid-cols-3 gap-3">\`;
                    if(subjects.length === 0) html += '<span class="text-sm text-gray-400 italic">No subjects added.</span>';
                    subjects.forEach(sub => {
                        const groupName = data.groups.find(g => g.id === sub.group_id)?.name || 'Common';
                        html += \`<div class="bg-blue-50 border border-blue-100 p-3 rounded-lg text-sm text-blue-900 flex justify-between"><span>\${sub.name}</span> <span class="text-xs bg-white px-2 py-0.5 rounded text-gray-500">\${groupName}</span></div>\`;
                    });
                    html += \`</div></div>\`;
                });
                html += \`</div>\`;
                container.innerHTML += html;
            });
            lucide.createIcons();
            
            // Fix modal dropdown population
            const gSelect = document.getElementById('new-sub-group');
            gSelect.innerHTML = '';
            data.groups.forEach(g => gSelect.add(new Option(g.name, g.id)));
        }

        async function loadSubjectsDropdown() {
            const res = await fetch(API + '/api/admin/subjects/all', { headers: { 'Authorization': token } });
            const subs = await res.json();
            
            // Populate for Content Manager
            const contentSel = document.getElementById('content-subject-select');
            contentSel.innerHTML = '<option>Select Subject...</option>';
            subs.forEach(s => contentSel.add(new Option(s.name + ' (' + s.class_name + ')', s.id)));

            // Populate for Exam Builder
            const examSel = document.getElementById('exam-subject');
            examSel.innerHTML = '<option>Select Subject...</option>';
            subs.forEach(s => examSel.add(new Option(s.name + ' (' + s.class_name + ')', s.id)));
        }

        async function loadChapters(subjectId) {
            const res = await fetch(API + '/api/admin/chapters/' + subjectId, { headers: { 'Authorization': token } });
            const chapters = await res.json();
            const container = document.getElementById('content-area');
            container.innerHTML = '';
            
            if(chapters.length === 0) {
                container.innerHTML = '<div class="text-center p-8 bg-gray-50 rounded-lg">No chapters found. Create one!</div>';
                return;
            }

            for (const chap of chapters) {
                // Fetch topics for this chapter (N+1 query is okay for small admin/chapter scale)
                const tRes = await fetch(API + '/api/admin/topics/' + chap.id, { headers: { 'Authorization': token } });
                const topics = await tRes.json();
                
                let topicsHtml = '';
                topics.forEach(t => {
                    topicsHtml += \`<div class="flex items-center justify-between p-2 bg-white border rounded mb-2 text-sm"><span class="flex items-center"><i data-lucide="hash" class="w-3 h-3 mr-2 text-gray-400"></i> \${t.title}</span> <span class="text-xs text-gray-400">\${t.q_count || 0} Questions</span></div>\`;
                });

                container.innerHTML += \`
                    <div class="card p-4 border-l-4 border-blue-400">
                        <div class="flex justify-between items-center mb-3">
                            <h4 class="font-bold text-gray-800 text-lg">\${chap.title}</h4>
                            <button onclick="addTopic(\${chap.id})" class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">+ Add Topic</button>
                        </div>
                        <div class="pl-2 border-l-2 border-gray-100 ml-1 space-y-1">
                            \${topicsHtml || '<span class="text-xs text-gray-400 italic">No topics yet.</span>'}
                        </div>
                    </div>
                \`;
            }
            lucide.createIcons();
        }

        async function loadTopicsForExam(subjectId) {
             const res = await fetch(API + '/api/admin/chapters/' + subjectId, { headers: { 'Authorization': token } });
             const chapters = await res.json();
             const container = document.getElementById('exam-topic-list');
             container.innerHTML = '';

             for (const chap of chapters) {
                 const tRes = await fetch(API + '/api/admin/topics/' + chap.id, { headers: { 'Authorization': token } });
                 const topics = await tRes.json();
                 
                 let html = \`<div class="mb-3"><h5 class="font-bold text-sm text-gray-700 mb-1">\${chap.title}</h5>\`;
                 topics.forEach(t => {
                     html += \`<label class="flex items-center space-x-2 text-sm p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input type="checkbox" class="exam-topic-check w-4 h-4 text-blue-600 rounded" value="\${t.id}">
                        <span>\${t.title}</span>
                     </label>\`;
                 });
                 html += \`</div>\`;
                 container.innerHTML += html;
             }
        }

        async function generateExam() {
            const subjectId = document.getElementById('exam-subject').value;
            const title = document.getElementById('exam-title').value;
            const duration = document.getElementById('exam-duration').value;
            
            // Get checked topics
            const checkboxes = document.querySelectorAll('.exam-topic-check:checked');
            const topicIds = Array.from(checkboxes).map(cb => parseInt(cb.value));

            if(topicIds.length === 0) return alert("Please select at least one topic.");
            if(!title) return alert("Please enter exam title.");

            const res = await fetch(API + '/api/admin/exams/generate', {
                method: 'POST',
                headers: { 'Authorization': token, 'Content-Type': 'application/json' },
                body: JSON.stringify({ subject_id: subjectId, title, duration, topic_ids: topicIds })
            });
            const data = await res.json();
            
            if(data.success) {
                alert(\`Exam Generated Successfully! ID: \${data.exam_id}\nContains \${data.question_count} Questions.\`);
                initDashboard();
            } else {
                alert("Error: " + data.error);
            }
        }

        // --- ACTIONS ---
        async function submitSubject() {
            const body = {
                class_id: document.getElementById('new-sub-class').value,
                group_id: document.getElementById('new-sub-group').value,
                name: document.getElementById('new-sub-name').value,
                code: document.getElementById('new-sub-code').value
            };
            const res = await fetch(API + '/api/admin/subject', { method: 'POST', headers: { 'Authorization': token }, body: JSON.stringify(body) });
            if(res.ok) { document.getElementById('modal-subject').classList.add('hidden'); loadCurriculum(); }
        }

        async function addTopic(chapId) {
            const title = prompt("Enter Topic Name:");
            if(!title) return;
            await fetch(API + '/api/admin/topic', { 
                method: 'POST', 
                headers: { 'Authorization': token }, 
                body: JSON.stringify({ chapter_id: chapId, title }) 
            });
            // Refresh
            const subId = document.getElementById('content-subject-select').value;
            loadChapters(subId);
        }
        
        async function addChapter() {
            const subId = document.getElementById('content-subject-select').value;
            if(!subId) return alert("Select a subject first");
            const title = prompt("Enter Chapter Name:");
            if(!title) return;
            await fetch(API + '/api/admin/chapter', { 
                method: 'POST', 
                headers: { 'Authorization': token }, 
                body: JSON.stringify({ subject_id: subId, title }) 
            });
            loadChapters(subId);
        }

        async function repairSystem() {
            if(!confirm("Reset Database to support Exams?")) return;
            await fetch(API + '/api/auth/repair', { method: 'POST' });
            location.reload();
        }

        async function login() {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const res = await fetch(API + '/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
            const data = await res.json();
            if(data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('adminName', data.name);
                location.reload();
            } else alert(data.error);
        }
        async function performSetup() {
            const body = {
                name: document.getElementById('setupName').value,
                email: document.getElementById('setupEmail').value,
                password: document.getElementById('setupPass').value
            };
            await fetch(API + '/api/auth/setup', { method: 'POST', body: JSON.stringify(body) });
            location.reload();
        }
        function logout() { localStorage.clear(); location.reload(); }
    </script>
</body>
</html>
`;

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);

        if (url.pathname === "/admin") return new Response(ADMIN_HTML, { headers: { "Content-Type": "text/html" } });
        if (url.pathname === "/") return new Response("Student Portal", { headers: { "Content-Type": "text/html" } });
        if (request.method === "OPTIONS") return new Response(null, { headers: { "Access-Control-Allow-Origin": "*" } });

        try {
            // --- AUTH ---
            if (url.pathname === "/api/auth/status") {
                try {
                    const check = await env.DB.prepare("SELECT count(*) as c FROM pragma_table_info('exams')").first();
                    if((check as any).c === 0) throw new Error("Schema Mismatch");
                    const admin = await env.DB.prepare("SELECT COUNT(*) as t FROM users WHERE role='admin'").first();
                    return jsonResponse({ adminExists: (admin as any).t > 0 });
                } catch (e: any) { return jsonResponse({ error: e.message }, 500); }
            }
            if (url.pathname === "/api/auth/repair" && request.method === "POST") {
                await env.DB.batch(REPAIR_SQL.map(sql => env.DB.prepare(sql)));
                return jsonResponse({ success: true });
            }
            if (url.pathname === "/api/auth/setup" && request.method === "POST") {
                const b = await request.json() as any;
                const h = await hashPassword(b.password);
                await env.DB.prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')").bind(b.name, b.email, h).run();
                return jsonResponse({ success: true });
            }
            if (url.pathname === "/api/auth/login" && request.method === "POST") {
                const b = await request.json() as any;
                const h = await hashPassword(b.password);
                const u = await env.DB.prepare("SELECT * FROM users WHERE email=? AND password_hash=?").bind(b.email, h).first();
                if(!u) return jsonResponse({error: "Invalid"}, 401);
                return jsonResponse({ token: "admin-token", name: u.name });
            }

            // --- ADMIN DATA ---
            if (url.pathname === "/api/admin/stats") {
                const s = await env.DB.prepare("SELECT COUNT(*) as c FROM subjects").first();
                const t = await env.DB.prepare("SELECT COUNT(*) as c FROM topics").first();
                const q = await env.DB.prepare("SELECT COUNT(*) as c FROM questions").first();
                const e = await env.DB.prepare("SELECT COUNT(*) as c FROM exams").first();
                return jsonResponse({ subjects: s.c, topics: t.c, questions: q.c, exams: e.c });
            }

            if (url.pathname === "/api/admin/curriculum") {
                const p = await env.DB.prepare("SELECT * FROM programs").all();
                const c = await env.DB.prepare("SELECT * FROM classes").all();
                const g = await env.DB.prepare("SELECT * FROM groups").all();
                const s = await env.DB.prepare("SELECT * FROM subjects").all();
                return jsonResponse({ programs: p.results, classes: c.results, groups: g.results, subjects: s.results });
            }

            if (url.pathname === "/api/admin/subjects/all") {
                const s = await env.DB.prepare("SELECT s.id, s.name, c.name as class_name FROM subjects s JOIN classes c ON s.class_id = c.id").all();
                return jsonResponse(s.results);
            }

            if (url.pathname.startsWith("/api/admin/chapters/")) {
                const subId = url.pathname.split('/').pop();
                const c = await env.DB.prepare("SELECT * FROM chapters WHERE subject_id = ? ORDER BY sort_order").bind(subId).all();
                return jsonResponse(c.results);
            }

            if (url.pathname.startsWith("/api/admin/topics/")) {
                const chapId = url.pathname.split('/').pop();
                // Join to get question count
                const t = await env.DB.prepare(`
                    SELECT t.*, (SELECT COUNT(*) FROM questions q WHERE q.topic_id = t.id) as q_count 
                    FROM topics t WHERE t.chapter_id = ?
                `).bind(chapId).all();
                return jsonResponse(t.results);
            }

            // --- WRITES ---
            if (url.pathname === "/api/admin/chapter" && request.method === "POST") {
                const b = await request.json() as any;
                await env.DB.prepare("INSERT INTO chapters (subject_id, title) VALUES (?, ?)").bind(b.subject_id, b.title).run();
                return jsonResponse({ success: true });
            }
            if (url.pathname === "/api/admin/topic" && request.method === "POST") {
                const b = await request.json() as any;
                await env.DB.prepare("INSERT INTO topics (chapter_id, title) VALUES (?, ?)").bind(b.chapter_id, b.title).run();
                return jsonResponse({ success: true });
            }
            if (url.pathname === "/api/admin/subject" && request.method === "POST") {
                const b = await request.json() as any;
                await env.DB.prepare("INSERT INTO subjects (class_id, group_id, name, code) VALUES (?, ?, ?, ?)").bind(b.class_id, b.group_id, b.name, b.code).run();
                return jsonResponse({ success: true });
            }

            // --- EXAM ENGINE (The Core Logic) ---
            if (url.pathname === "/api/admin/exams/generate" && request.method === "POST") {
                const b = await request.json() as any; // { subject_id, title, duration, topic_ids: [] }
                
                // 1. Create Exam Record
                const examRes = await env.DB.prepare(`
                    INSERT INTO exams (title, subject_id, duration_minutes) VALUES (?, ?, ?) RETURNING id
                `).bind(b.title, b.subject_id, b.duration).first();
                
                // 2. Fetch Questions from selected topics (Randomized)
                // Note: D1 doesn't support "WHERE IN (?)" easily with arrays, so we construct dynamic query or loop.
                // For robustness in this environment, we loop or use a limited dynamic IN.
                // Better approach: Get all questions for these topics, shuffle in JS (for reliability vs D1 limits).
                
                // Hacky IN clause for D1
                const placeholders = b.topic_ids.map(() => '?').join(',');
                const questions = await env.DB.prepare(`
                    SELECT id FROM questions WHERE topic_id IN (${placeholders}) ORDER BY RANDOM() LIMIT 20
                `).bind(...b.topic_ids).all();

                if(questions.results.length === 0) return jsonResponse({ success: false, error: "No questions found in selected topics" });

                // 3. Link Questions to Exam
                const stmt = env.DB.prepare("INSERT INTO exam_questions (exam_id, question_id) VALUES (?, ?)");
                const batch = questions.results.map((q: any) => stmt.bind(examRes.id, q.id));
                await env.DB.batch(batch);

                return jsonResponse({ success: true, exam_id: examRes.id, question_count: questions.results.length });
            }

            return new Response("Not Found", { status: 404 });

        } catch (e: any) { return jsonResponse({ error: e.message }, 500); }
    }
}
