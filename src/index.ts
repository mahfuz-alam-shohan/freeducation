export interface Env {
    DB: D1Database;
    BUCKET: R2Bucket;
    JWT_SECRET: string;
}

// --- 1. NEW DEEP SCHEMA (NCTB STRUCTURE) ---
const REPAIR_SQL = [
    // Clean Slate for the Upgrade
    "PRAGMA foreign_keys = OFF;",
    "DROP TABLE IF EXISTS questions;",
    "DROP TABLE IF EXISTS topics;",
    "DROP TABLE IF EXISTS chapters;",
    "DROP TABLE IF EXISTS subjects;",
    "DROP TABLE IF EXISTS groups;",
    "DROP TABLE IF EXISTS classes;",
    "DROP TABLE IF EXISTS programs;", 
    "DROP TABLE IF EXISTS users;",
    "PRAGMA foreign_keys = ON;",

    // 1. Users & Auth
    `CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        email TEXT UNIQUE NOT NULL, 
        password_hash TEXT NOT NULL, 
        name TEXT NOT NULL, 
        role TEXT DEFAULT 'student', 
        created_at INTEGER DEFAULT (unixepoch())
    );`,

    // 2. Programs (e.g., SSC, HSC, Admission)
    `CREATE TABLE programs (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        name TEXT NOT NULL UNIQUE, -- "SSC", "HSC"
        slug TEXT UNIQUE NOT NULL
    );`,

    // 3. Classes (e.g., Class 9, Class 10) - Linked to Program
    `CREATE TABLE classes (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        program_id INTEGER NOT NULL,
        name TEXT NOT NULL, -- "Class 9"
        FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE
    );`,

    // 4. Groups (e.g., Science, Arts, Commerce, Common)
    `CREATE TABLE groups (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        name TEXT NOT NULL -- "Science", "Common"
    );`,

    // 5. Subjects (e.g., Physics) - Linked to Class AND Group
    `CREATE TABLE subjects (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        class_id INTEGER NOT NULL,
        group_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        code TEXT, -- "101"
        icon TEXT,
        FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
        FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
    );`,

    // 6. Chapters (e.g., Motion)
    `CREATE TABLE chapters (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        subject_id INTEGER NOT NULL, 
        title TEXT NOT NULL, 
        sort_order INTEGER DEFAULT 0, 
        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
    );`,

    // 7. Topics (New! - e.g., "Speed", "Velocity")
    `CREATE TABLE topics (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        chapter_id INTEGER NOT NULL, 
        title TEXT NOT NULL, 
        FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
    );`,

    // 8. Question Bank (Linked to Topics)
    `CREATE TABLE questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        topic_id INTEGER NOT NULL, 
        type TEXT DEFAULT 'mcq', -- 'mcq' or 'cq'
        content TEXT NOT NULL, -- JSON string containing question, options, answer
        difficulty TEXT DEFAULT 'medium',
        FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
    );`,

    // --- SEED DATA (Bangladeshi Context) ---
    "INSERT INTO groups (name) VALUES ('Common'), ('Science'), ('Arts'), ('Commerce');",
    "INSERT INTO programs (name, slug) VALUES ('SSC', 'ssc'), ('HSC', 'hsc');",
    
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

// --- PROFESSIONAL ADMIN UI (Tailwind + Component Logic) ---
const ADMIN_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Freeducation Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        body { background-color: #f3f4f6; font-family: 'Inter', sans-serif; }
        .sidebar-link { display: flex; align-items: center; padding: 10px 15px; color: #9ca3af; transition: 0.2s; border-radius: 8px; margin-bottom: 5px; cursor: pointer; }
        .sidebar-link:hover, .sidebar-link.active { background-color: #1f2937; color: white; }
        .tree-item { padding-left: 20px; border-left: 1px solid #e5e7eb; position: relative; }
        .tree-item::before { content: ''; position: absolute; left: 0; top: 15px; width: 15px; height: 1px; background: #e5e7eb; }
    </style>
</head>
<body class="h-screen flex overflow-hidden">

    <!-- SIDEBAR -->
    <aside class="w-64 bg-gray-900 text-white flex flex-col shadow-xl z-20">
        <div class="h-16 flex items-center px-6 border-b border-gray-800">
            <h1 class="text-xl font-bold tracking-tight text-blue-400">Freeducation<span class="text-white text-xs ml-1">ADMIN</span></h1>
        </div>
        <nav class="flex-1 px-4 py-4 overflow-y-auto">
            <div onclick="switchView('dashboard')" id="nav-dashboard" class="sidebar-link active">
                <i data-lucide="layout-dashboard" class="w-5 h-5 mr-3"></i> Dashboard
            </div>
            <div class="mt-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Academics</div>
            <div onclick="switchView('curriculum')" id="nav-curriculum" class="sidebar-link">
                <i data-lucide="library" class="w-5 h-5 mr-3"></i> Curriculum Manager
            </div>
            <div onclick="switchView('questions')" id="nav-questions" class="sidebar-link">
                <i data-lucide="file-question" class="w-5 h-5 mr-3"></i> Question Bank
            </div>
        </nav>
        <div class="p-4 border-t border-gray-800">
            <button onclick="logout()" class="flex items-center text-red-400 hover:text-red-300 text-sm font-medium transition">
                <i data-lucide="log-out" class="w-4 h-4 mr-2"></i> Logout
            </button>
        </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="flex-1 flex flex-col overflow-hidden relative">
        <!-- Top Bar -->
        <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
            <h2 id="page-title" class="text-lg font-semibold text-gray-800">Overview</h2>
            <div class="flex items-center space-x-4">
                <span class="text-sm text-gray-500">Administrator</span>
                <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">A</div>
            </div>
        </header>

        <!-- Content Area -->
        <div class="flex-1 overflow-auto p-8 bg-gray-50" id="main-container">
            
            <!-- INIT LOADER -->
            <div id="loader" class="flex flex-col items-center justify-center h-full">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p class="mt-4 text-gray-500">Connecting to secure backend...</p>
            </div>

            <!-- LOGIN VIEW -->
            <div id="view-login" class="hidden max-w-md mx-auto mt-20">
                <div class="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                    <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Admin Access</h2>
                    <input type="email" id="email" placeholder="Email" class="w-full mb-4 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                    <input type="password" id="password" placeholder="Password" class="w-full mb-6 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                    <button onclick="login()" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-md">Secure Login</button>
                </div>
            </div>

            <!-- SETUP VIEW -->
            <div id="view-setup" class="hidden max-w-md mx-auto mt-20">
                <div class="bg-white p-8 rounded-xl shadow-lg border-l-4 border-green-500">
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">System Initialization</h2>
                    <p class="text-gray-500 mb-6">Create the root administrator account.</p>
                    <input type="text" id="setupName" placeholder="Full Name" class="w-full mb-4 p-3 border rounded-lg">
                    <input type="email" id="setupEmail" placeholder="Email" class="w-full mb-4 p-3 border rounded-lg">
                    <input type="password" id="setupPass" placeholder="Strong Password" class="w-full mb-6 p-3 border rounded-lg">
                    <button onclick="performSetup()" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-md">Initialize System</button>
                </div>
            </div>

            <!-- DIAGNOSTICS VIEW -->
            <div id="view-diagnostics" class="hidden max-w-2xl mx-auto mt-10">
                <div class="bg-white p-8 rounded-xl shadow-lg border-l-4 border-red-500">
                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <i data-lucide="alert-triangle" class="h-8 w-8 text-red-500"></i>
                        </div>
                        <div class="ml-4">
                            <h3 class="text-xl font-bold text-gray-900">Database Schema Mismatch</h3>
                            <p class="text-gray-600 mt-2" id="errorMsg">The database structure does not match the latest code version.</p>
                            <div class="mt-6">
                                <button onclick="repairSystem()" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg shadow transition flex items-center">
                                    <i data-lucide="wrench" class="w-4 h-4 mr-2"></i> Auto-Repair Database
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- DASHBOARD VIEW -->
            <div id="view-dashboard" class="hidden">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div class="text-gray-500 text-sm font-medium uppercase">Programs</div>
                        <div class="text-3xl font-bold text-gray-900 mt-2" id="stat-programs">-</div>
                    </div>
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div class="text-gray-500 text-sm font-medium uppercase">Total Subjects</div>
                        <div class="text-3xl font-bold text-gray-900 mt-2" id="stat-subjects">-</div>
                    </div>
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div class="text-gray-500 text-sm font-medium uppercase">Questions Banked</div>
                        <div class="text-3xl font-bold text-gray-900 mt-2" id="stat-questions">-</div>
                    </div>
                </div>
                
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
                    <div class="flex space-x-4">
                        <button onclick="switchView('curriculum')" class="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium">Manage Subjects</button>
                        <button onclick="switchView('questions')" class="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 font-medium">Add New Question</button>
                    </div>
                </div>
            </div>

            <!-- CURRICULUM MANAGER VIEW -->
            <div id="view-curriculum" class="hidden">
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 class="text-lg font-bold text-gray-800">Academic Structure</h3>
                        <div class="space-x-2">
                             <button onclick="openModal('modal-subject')" class="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700">+ Add Subject</button>
                             <button onclick="fetchCurriculum()" class="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-200">Refresh</button>
                        </div>
                    </div>
                    <div class="p-6 overflow-x-auto">
                        <div id="curriculum-tree" class="space-y-4">
                            <!-- Tree Content Generated by JS -->
                            <p class="text-gray-400 text-sm italic">Loading curriculum data...</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- QUESTION BANK VIEW -->
            <div id="view-questions" class="hidden">
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 class="text-lg font-bold text-gray-800 mb-6">Add New Question</h3>
                    
                    <div class="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Select Topic</label>
                            <select id="q-topic-select" class="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
                                <option>Loading Topics...</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
                            <select class="w-full p-2.5 border rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" disabled>
                                <option value="mcq">Multiple Choice (MCQ)</option>
                                <option value="cq">Creative Question (Coming Soon)</option>
                            </select>
                        </div>
                    </div>

                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
                        <textarea id="q-text" rows="3" class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
                    </div>

                    <div class="grid grid-cols-2 gap-4 mb-6">
                        <input type="text" id="q-opt1" placeholder="Option A" class="p-2.5 border rounded-lg">
                        <input type="text" id="q-opt2" placeholder="Option B" class="p-2.5 border rounded-lg">
                        <input type="text" id="q-opt3" placeholder="Option C" class="p-2.5 border rounded-lg">
                        <input type="text" id="q-opt4" placeholder="Option D" class="p-2.5 border rounded-lg">
                    </div>

                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
                        <select id="q-correct" class="w-full p-2.5 border rounded-lg">
                            <option value="0">Option A</option>
                            <option value="1">Option B</option>
                            <option value="2">Option C</option>
                            <option value="3">Option D</option>
                        </select>
                    </div>

                    <button onclick="saveQuestion()" class="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition">Save to Question Bank</button>
                </div>
            </div>

        </div>
    </main>

    <!-- MODALS -->
    <!-- Add Subject Modal -->
    <div id="modal-subject" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 class="text-xl font-bold mb-4">Add New Subject</h3>
            <div class="space-y-4">
                <select id="new-sub-class" class="w-full p-2 border rounded">
                    <!-- Populated by JS -->
                </select>
                <select id="new-sub-group" class="w-full p-2 border rounded">
                    <!-- Populated by JS -->
                </select>
                <input type="text" id="new-sub-name" placeholder="Subject Name (e.g. Physics)" class="w-full p-2 border rounded">
                <input type="text" id="new-sub-code" placeholder="Code (e.g. 101)" class="w-full p-2 border rounded">
            </div>
            <div class="mt-6 flex justify-end space-x-3">
                <button onclick="closeModal('modal-subject')" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                <button onclick="submitSubject()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Create</button>
            </div>
        </div>
    </div>

    <!-- Add Chapter/Topic Modal logic handled inline or via simple prompts for this version to save space -->

    <script>
        const API = window.location.origin;
        let token = localStorage.getItem('token');
        let curriculumData = null; // Store fetched data

        // --- INIT ---
        window.onload = async () => {
            lucide.createIcons();
            try {
                const res = await fetch(API + '/api/auth/status');
                const status = await res.json();
                document.getElementById('loader').classList.add('hidden');

                if (!res.ok) {
                    showError(status.error || "Backend Error");
                    return;
                }

                if (!status.adminExists) {
                    showView('view-setup');
                } else if (token) {
                    initDashboard();
                } else {
                    showView('view-login');
                }
            } catch (e) {
                document.getElementById('loader').classList.add('hidden');
                showError("Connection Failed: " + e.message);
            }
        };

        // --- NAVIGATION ---
        function switchView(viewName) {
            document.querySelectorAll('.sidebar-link').forEach(el => el.classList.remove('active'));
            document.getElementById('nav-' + viewName).classList.add('active');
            
            showView('view-' + viewName);
            
            // Dynamic Title
            const titles = { 'dashboard': 'Overview', 'curriculum': 'Curriculum Manager', 'questions': 'Question Bank' };
            document.getElementById('page-title').innerText = titles[viewName];

            if(viewName === 'curriculum') fetchCurriculum();
            if(viewName === 'questions') prepareQuestionBank();
        }

        function showView(id) {
            // Hide all views inside main container except loader
            const container = document.getElementById('main-container');
            Array.from(container.children).forEach(child => {
                if(child.id !== 'loader') child.classList.add('hidden');
            });
            document.getElementById(id).classList.remove('hidden');
        }

        function initDashboard() {
            switchView('dashboard');
            // Mock stats or fetch real ones
            document.getElementById('stat-programs').innerText = "2"; // SSC, HSC
            fetchCurriculum(); // Pre-load data
        }

        function showError(msg) {
            showView('view-diagnostics');
            document.getElementById('errorMsg').innerText = msg;
        }

        // --- API ACTIONS ---
        async function repairSystem() {
            if(!confirm("This will RESET the database to the new structure. All old data will be wiped. Continue?")) return;
            const res = await fetch(API + '/api/auth/repair', { method: 'POST' });
            const data = await res.json();
            if(data.success) { alert("System Repaired!"); location.reload(); }
            else alert("Error: " + data.error);
        }

        async function login() {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const res = await fetch(API + '/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
            const data = await res.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
                initDashboard();
            } else alert(data.error);
        }

        function logout() { localStorage.removeItem('token'); location.reload(); }

        // --- CURRICULUM MANAGER (THE COMPLEX PART) ---
        async function fetchCurriculum() {
            const res = await fetch(API + '/api/admin/curriculum', { headers: { 'Authorization': token } });
            const data = await res.json();
            curriculumData = data; // { programs: [], classes: [], groups: [], subjects: [] }
            renderCurriculumTree(data);
            populateSubjectModal(data);
        }

        function renderCurriculumTree(data) {
            const container = document.getElementById('curriculum-tree');
            container.innerHTML = '';

            // Group By Program -> Class
            data.programs.forEach(prog => {
                const progDiv = document.createElement('div');
                progDiv.className = 'mb-6';
                progDiv.innerHTML = \`<h4 class="font-bold text-gray-800 text-lg mb-2 flex items-center"><i data-lucide="book" class="w-5 h-5 mr-2 text-blue-500"></i> \${prog.name}</h4>\`;
                
                const progClasses = data.classes.filter(c => c.program_id === prog.id);
                
                progClasses.forEach(cls => {
                    const clsDiv = document.createElement('div');
                    clsDiv.className = 'ml-6 mb-4';
                    clsDiv.innerHTML = \`<div class="font-semibold text-gray-700 bg-white border px-3 py-2 rounded flex justify-between">\${cls.name}</div>\`;
                    
                    // Render Subjects for this class
                    const subjects = data.subjects.filter(s => s.class_id === cls.id);
                    const subContainer = document.createElement('div');
                    subContainer.className = 'ml-4 mt-2 grid grid-cols-1 md:grid-cols-2 gap-2';

                    if(subjects.length === 0) {
                        subContainer.innerHTML = '<div class="text-sm text-gray-400 pl-2">No subjects yet.</div>';
                    }

                    subjects.forEach(sub => {
                        const subDiv = document.createElement('div');
                        subDiv.className = 'bg-blue-50 text-blue-800 text-sm px-3 py-2 rounded border border-blue-100 flex justify-between items-center group';
                        subDiv.innerHTML = \`
                            <span>\${sub.name} <span class="text-xs text-blue-400">(\${data.groups.find(g=>g.id===sub.group_id)?.name})</span></span>
                            <div class="space-x-1 opacity-0 group-hover:opacity-100 transition">
                                <button onclick="addChapter(\${sub.id})" class="text-xs bg-white px-2 py-1 rounded shadow text-green-600 hover:bg-green-50">+ Chapter</button>
                            </div>
                        \`;
                        subContainer.appendChild(subDiv);
                    });

                    clsDiv.appendChild(subContainer);
                    progDiv.appendChild(clsDiv);
                });

                container.appendChild(progDiv);
            });
            lucide.createIcons();
        }

        // --- QUESTION BANK LOGIC ---
        async function prepareQuestionBank() {
            // Need flat list of subjects -> chapters -> topics
            // For MVP, we just fetch ALL topics to populate dropdown
            const res = await fetch(API + '/api/admin/topics/all', { headers: { 'Authorization': token } });
            const topics = await res.json();
            
            const select = document.getElementById('q-topic-select');
            select.innerHTML = '';
            
            topics.forEach(t => {
                const opt = document.createElement('option');
                opt.value = t.id;
                opt.text = \`\${t.subject_name} > \${t.chapter_title} > \${t.title}\`;
                select.appendChild(opt);
            });
        }

        async function saveQuestion() {
            const body = {
                topic_id: document.getElementById('q-topic-select').value,
                type: 'mcq',
                content: JSON.stringify({
                    question: document.getElementById('q-text').value,
                    options: [
                        document.getElementById('q-opt1').value,
                        document.getElementById('q-opt2').value,
                        document.getElementById('q-opt3').value,
                        document.getElementById('q-opt4').value
                    ],
                    correct_index: parseInt(document.getElementById('q-correct').value)
                })
            };

            const res = await fetch(API + '/api/admin/question', {
                method: 'POST',
                headers: { 'Authorization': token, 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if(data.success) { alert("Question Saved!"); document.getElementById('q-text').value = ''; }
            else alert("Error: " + data.error);
        }

        // --- MODAL & SUBMIT LOGIC ---
        function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
        function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

        function populateSubjectModal(data) {
            const clsSelect = document.getElementById('new-sub-class');
            const grpSelect = document.getElementById('new-sub-group');
            clsSelect.innerHTML = ''; grpSelect.innerHTML = '';

            data.classes.forEach(c => clsSelect.add(new Option(c.name, c.id)));
            data.groups.forEach(g => grpSelect.add(new Option(g.name, g.id)));
        }

        async function submitSubject() {
            const body = {
                class_id: document.getElementById('new-sub-class').value,
                group_id: document.getElementById('new-sub-group').value,
                name: document.getElementById('new-sub-name').value,
                code: document.getElementById('new-sub-code').value
            };
            const res = await fetch(API + '/api/admin/subject', {
                method: 'POST',
                headers: { 'Authorization': token, 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if(data.success) { closeModal('modal-subject'); fetchCurriculum(); }
            else alert("Failed");
        }

        async function addChapter(subjectId) {
            const title = prompt("Enter Chapter Title:");
            if(!title) return;
            await postData('/api/admin/chapter', { subject_id: subjectId, title: title });
            // For now, auto-add a default topic so questions can be added
            // In a full version, you'd have a UI to manage topics specifically
            await postData('/api/admin/topic', { chapter_title: title, title: "General Topic" }); 
            alert("Chapter Added (with default topic)");
        }
        
        async function postData(ep, body) {
             await fetch(API + ep, { method: 'POST', headers: {'Authorization': token}, body: JSON.stringify(body)});
        }
        
        async function performSetup() {
            const body = {
                name: document.getElementById('setupName').value,
                email: document.getElementById('setupEmail').value,
                password: document.getElementById('setupPass').value
            };
            const res = await fetch(API + '/api/auth/setup', { method: 'POST', body: JSON.stringify(body) });
            const data = await res.json();
            if (data.success) { alert("Success! Please Login."); location.reload(); }
            else alert(data.error);
        }
    </script>
</body>
</html>
`;

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);

        // Serve HTML
        if (url.pathname === "/admin") return new Response(ADMIN_HTML, { headers: { "Content-Type": "text/html" } });
        // Keeping student HTML simple for now, can be updated later to match new schema
        if (url.pathname === "/") return new Response("Student Portal Update in Progress. Please use /admin", { headers: { "Content-Type": "text/html" } });
        if (request.method === "OPTIONS") return new Response(null, { headers: { "Access-Control-Allow-Origin": "*" } });

        try {
            // --- REPAIR ---
            if (url.pathname === "/api/auth/repair" && request.method === "POST") {
                await env.DB.batch(REPAIR_SQL.map(sql => env.DB.prepare(sql)));
                return jsonResponse({ success: true });
            }

            // --- STATUS ---
            if (url.pathname === "/api/auth/status") {
                try {
                    // Check if new tables exist
                    const check = await env.DB.prepare("SELECT count(*) as c FROM pragma_table_info('topics')").first();
                    if((check as any).c === 0) throw new Error("Schema Mismatch");
                    
                    const admin = await env.DB.prepare("SELECT COUNT(*) as t FROM users WHERE role='admin'").first();
                    return jsonResponse({ adminExists: (admin as any).t > 0 });
                } catch (e: any) { return jsonResponse({ error: "Schema Mismatch" }, 500); }
            }

            // --- AUTH ---
            if (url.pathname === "/api/auth/login" && request.method === "POST") {
                const body = await request.json() as any;
                const hashed = await hashPassword(body.password);
                const user = await env.DB.prepare("SELECT * FROM users WHERE email=? AND password_hash=?").bind(body.email, hashed).first();
                if (!user) return jsonResponse({ error: "Invalid Credentials" }, 401);
                return jsonResponse({ token: "admin-token", name: user.name }); // Simple token for demo
            }

            if (url.pathname === "/api/auth/setup" && request.method === "POST") {
                const body = await request.json() as any;
                const hashed = await hashPassword(body.password);
                await env.DB.prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')").bind(body.name, body.email, hashed).run();
                return jsonResponse({ success: true });
            }

            // --- ADMIN DATA ---
            if (url.pathname === "/api/admin/curriculum") {
                const p = await env.DB.prepare("SELECT * FROM programs").all();
                const c = await env.DB.prepare("SELECT * FROM classes").all();
                const g = await env.DB.prepare("SELECT * FROM groups").all();
                const s = await env.DB.prepare("SELECT * FROM subjects").all();
                return jsonResponse({ programs: p.results, classes: c.results, groups: g.results, subjects: s.results });
            }

            if (url.pathname === "/api/admin/subject" && request.method === "POST") {
                const b = await request.json() as any;
                await env.DB.prepare("INSERT INTO subjects (class_id, group_id, name, code) VALUES (?, ?, ?, ?)").bind(b.class_id, b.group_id, b.name, b.code).run();
                return jsonResponse({ success: true });
            }
            
            if (url.pathname === "/api/admin/chapter" && request.method === "POST") {
                const b = await request.json() as any;
                const res = await env.DB.prepare("INSERT INTO chapters (subject_id, title) VALUES (?, ?) RETURNING id").bind(b.subject_id, b.title).first();
                return jsonResponse({ success: true, id: res.id });
            }

            // Helper to auto-create topic for chapter (Simplified for MVP)
            if (url.pathname === "/api/admin/topic" && request.method === "POST") {
                const b = await request.json() as any;
                // Find chapter ID by name (risky in prod, ok for demo) or pass ID
                const chap = await env.DB.prepare("SELECT id FROM chapters WHERE title = ? ORDER BY id DESC").bind(b.chapter_title).first();
                if(chap) {
                     await env.DB.prepare("INSERT INTO topics (chapter_id, title) VALUES (?, ?)").bind(chap.id, b.title).run();
                }
                return jsonResponse({ success: true });
            }

            if (url.pathname === "/api/admin/topics/all") {
                // Join query to get readable hierarchy
                const res = await env.DB.prepare(`
                    SELECT t.id, t.title, c.title as chapter_title, s.name as subject_name 
                    FROM topics t 
                    JOIN chapters c ON t.chapter_id = c.id 
                    JOIN subjects s ON c.subject_id = s.id
                `).all();
                return jsonResponse(res.results);
            }

            if (url.pathname === "/api/admin/question" && request.method === "POST") {
                const b = await request.json() as any;
                await env.DB.prepare("INSERT INTO questions (topic_id, type, content) VALUES (?, ?, ?)").bind(b.topic_id, b.type, b.content).run();
                return jsonResponse({ success: true });
            }

            return new Response("Not Found", { status: 404 });

        } catch (e: any) { return jsonResponse({ error: e.message }, 500); }
    }
}
