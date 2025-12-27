export interface Env {
    DB: D1Database;
    JWT_SECRET: string;
}

// --- SQL FOR SYSTEM RESET (Must match migrations file) ---
const INIT_SQL = `
PRAGMA foreign_keys = OFF;
DROP TABLE IF EXISTS exam_questions; DROP TABLE IF EXISTS exams; DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS topics; DROP TABLE IF EXISTS chapters; DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS groups; DROP TABLE IF EXISTS classes; DROP TABLE IF EXISTS programs; DROP TABLE IF EXISTS users;
PRAGMA foreign_keys = ON;

CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, name TEXT NOT NULL, role TEXT DEFAULT 'student', created_at INTEGER DEFAULT (unixepoch()));
CREATE TABLE programs (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE, slug TEXT UNIQUE NOT NULL);
CREATE TABLE classes (id INTEGER PRIMARY KEY AUTOINCREMENT, program_id INTEGER NOT NULL, title TEXT NOT NULL, FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE);
CREATE TABLE groups (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE);
CREATE TABLE subjects (id INTEGER PRIMARY KEY AUTOINCREMENT, program_id INTEGER NOT NULL, group_id INTEGER NOT NULL, title TEXT NOT NULL, code TEXT, icon TEXT, FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE, FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE);
CREATE TABLE chapters (id INTEGER PRIMARY KEY AUTOINCREMENT, subject_id INTEGER NOT NULL, title TEXT NOT NULL, sort_order INTEGER DEFAULT 0, FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE);
CREATE TABLE topics (id INTEGER PRIMARY KEY AUTOINCREMENT, chapter_id INTEGER NOT NULL, title TEXT NOT NULL, FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE);
CREATE TABLE questions (id INTEGER PRIMARY KEY AUTOINCREMENT, topic_id INTEGER NOT NULL, type TEXT DEFAULT 'mcq', question_text TEXT NOT NULL, options TEXT NOT NULL, correct_answer TEXT NOT NULL, explanation TEXT, difficulty TEXT DEFAULT 'medium', FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE);
CREATE TABLE exams (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, subject_id INTEGER NOT NULL, duration_minutes INTEGER DEFAULT 25, is_active BOOLEAN DEFAULT 1, FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE);
CREATE TABLE exam_questions (exam_id INTEGER NOT NULL, question_id INTEGER NOT NULL, FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE, FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE);

INSERT INTO programs (title, slug) VALUES ('SSC (9-10)', 'ssc'), ('HSC (11-12)', 'hsc');
INSERT INTO classes (program_id, title) SELECT id, 'Class 9' FROM programs WHERE slug='ssc';
INSERT INTO classes (program_id, title) SELECT id, 'Class 10' FROM programs WHERE slug='ssc';
INSERT INTO classes (program_id, title) SELECT id, '1st Year' FROM programs WHERE slug='hsc';
INSERT INTO classes (program_id, title) SELECT id, '2nd Year' FROM programs WHERE slug='hsc';
INSERT INTO groups (title) VALUES ('Science'), ('Humanities (Arts)'), ('Business Studies'), ('Common');
`;

// --- UTILS ---
async function hashPassword(p: string) {
    const msg = new TextEncoder().encode(p);
    const hash = await crypto.subtle.digest('SHA-256', msg);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}
const json = (data: any, code = 200) => new Response(JSON.stringify(data), { status: code, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });

// --- ADMIN DASHBOARD HTML ---
const ADMIN_UI = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Freeducation Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <style>
        body { background: #f3f4f6; }
        .sidebar { width: 260px; background: #1f2937; color: white; min-height: 100vh; position: fixed; }
        .main-content { margin-left: 260px; padding: 2rem; }
        .step-card { border-left: 4px solid #3b82f6; transition: transform 0.1s; }
        .step-card:hover { transform: translateX(5px); }
        .active-nav { background: #374151; border-right: 4px solid #60a5fa; }
    </style>
</head>
<body>
    <div class="sidebar flex flex-col">
        <div class="p-6 font-bold text-2xl border-b border-gray-700">Freeducation</div>
        <nav class="flex-1 overflow-y-auto py-4">
            <a onclick="setView('dashboard')" id="nav-dashboard" class="block px-6 py-3 hover:bg-gray-700 cursor-pointer active-nav">Dashboard</a>
            <div class="px-6 py-2 text-xs uppercase text-gray-500 font-bold mt-4">Curriculum</div>
            <a onclick="setView('curriculum')" id="nav-curriculum" class="block px-6 py-3 hover:bg-gray-700 cursor-pointer">Manage Structure</a>
            <div class="px-6 py-2 text-xs uppercase text-gray-500 font-bold mt-4">Content</div>
            <a onclick="setView('content')" id="nav-content" class="block px-6 py-3 hover:bg-gray-700 cursor-pointer">Question Bank</a>
            <div class="px-6 py-2 text-xs uppercase text-gray-500 font-bold mt-4">System</div>
            <a href="/api/system/init" target="_blank" class="block px-6 py-3 text-red-400 hover:bg-gray-700 cursor-pointer">⚠️ Reset Database</a>
        </nav>
    </div>

    <div class="main-content">
        <!-- Dashboard View -->
        <div id="view-dashboard">
            <h1 class="text-3xl font-bold text-gray-800 mb-6">Overview</h1>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-white p-6 rounded shadow-sm border-t-4 border-blue-500">
                    <div class="text-gray-500 text-sm">Total Programs</div>
                    <div class="text-2xl font-bold" id="stat-programs">-</div>
                </div>
                <div class="bg-white p-6 rounded shadow-sm border-t-4 border-green-500">
                    <div class="text-gray-500 text-sm">Total Subjects</div>
                    <div class="text-2xl font-bold" id="stat-subjects">-</div>
                </div>
                <div class="bg-white p-6 rounded shadow-sm border-t-4 border-purple-500">
                    <div class="text-gray-500 text-sm">Questions Banked</div>
                    <div class="text-2xl font-bold" id="stat-questions">-</div>
                </div>
            </div>
            
            <div class="mt-8 bg-white p-8 rounded shadow-sm">
                <h2 class="text-xl font-bold mb-4">Quick Setup Guide</h2>
                <div class="space-y-4">
                    <div class="p-4 bg-gray-50 rounded flex items-center justify-between step-card">
                        <div>
                            <span class="font-bold text-blue-600">Step 1:</span> Define Subjects for Programs (e.g., SSC Science Physics).
                        </div>
                        <button onclick="setView('curriculum')" class="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded">Go</button>
                    </div>
                    <div class="p-4 bg-gray-50 rounded flex items-center justify-between step-card">
                        <div>
                            <span class="font-bold text-blue-600">Step 2:</span> Create Chapters & Topics.
                        </div>
                        <button onclick="setView('content')" class="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded">Go</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Curriculum View -->
        <div id="view-curriculum" class="hidden">
            <h1 class="text-3xl font-bold text-gray-800 mb-6">Curriculum Manager</h1>
            
            <div class="bg-white p-6 rounded shadow mb-8">
                <h3 class="font-bold text-lg mb-4 border-b pb-2">Add New Subject</h3>
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Program (e.g. SSC)</label>
                        <select id="sub-program" class="w-full border p-2 rounded"></select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Group (e.g. Science)</label>
                        <select id="sub-group" class="w-full border p-2 rounded"></select>
                    </div>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700">Subject Name</label>
                    <input type="text" id="sub-name" placeholder="e.g. Physics" class="w-full border p-2 rounded">
                </div>
                <button onclick="addSubject()" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Create Subject</button>
            </div>

            <div class="bg-white p-6 rounded shadow">
                <h3 class="font-bold text-lg mb-4">Existing Subjects</h3>
                <div id="subject-list" class="space-y-2">Loading...</div>
            </div>
        </div>

        <!-- Content View (The Sequential Drill Down) -->
        <div id="view-content" class="hidden">
            <h1 class="text-3xl font-bold text-gray-800 mb-6">Content & Questions</h1>
            
            <!-- Breadcrumb / Selector -->
            <div class="bg-white p-4 rounded shadow mb-6 flex gap-4">
                <select id="cont-subject" class="border p-2 rounded flex-1" onchange="loadChapters(this.value)">
                    <option value="">1. Select Subject...</option>
                </select>
                <select id="cont-chapter" class="border p-2 rounded flex-1" onchange="loadTopics(this.value)">
                    <option value="">2. Select Chapter...</option>
                </select>
            </div>

            <!-- Context Area -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <!-- Left: Topic Manager -->
                <div class="bg-white p-6 rounded shadow">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="font-bold">Topics</h3>
                        <button onclick="addTopic()" class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">+ New Topic</button>
                    </div>
                    <div id="topic-list" class="space-y-2 text-sm text-gray-600">
                        Select a chapter to view topics.
                    </div>
                    <div id="add-topic-form" class="hidden mt-4 pt-4 border-t">
                        <input type="text" id="new-topic-title" placeholder="Topic Name" class="w-full border p-2 rounded mb-2 text-sm">
                        <button onclick="submitTopic()" class="w-full bg-green-600 text-white py-1 rounded text-sm">Save Topic</button>
                    </div>
                </div>

                <!-- Right: Question Manager -->
                <div class="bg-white p-6 rounded shadow">
                    <h3 class="font-bold mb-4">Add Question</h3>
                    <div id="q-form-overlay" class="text-center text-gray-400 py-10 bg-gray-50 rounded">
                        Select a Topic on the left to add questions.
                    </div>
                    <div id="q-form" class="hidden">
                        <input type="hidden" id="q-topic-id">
                        <textarea id="q-text" placeholder="Question Text" class="w-full border p-2 rounded mb-2 h-20"></textarea>
                        <div class="grid grid-cols-2 gap-2 mb-2">
                            <input id="q-opt1" placeholder="Option A" class="border p-2 rounded text-sm">
                            <input id="q-opt2" placeholder="Option B" class="border p-2 rounded text-sm">
                            <input id="q-opt3" placeholder="Option C" class="border p-2 rounded text-sm">
                            <input id="q-opt4" placeholder="Option D" class="border p-2 rounded text-sm">
                        </div>
                        <select id="q-correct" class="w-full border p-2 rounded mb-4">
                            <option value="Option A">Correct: Option A</option>
                            <option value="Option B">Correct: Option B</option>
                            <option value="Option C">Correct: Option C</option>
                            <option value="Option D">Correct: Option D</option>
                        </select>
                        <button onclick="saveQuestion()" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Save Question</button>
                    </div>
                </div>
            </div>

            <!-- Chapter Creator Modal (Inline) -->
            <div class="mt-8 bg-white p-6 rounded shadow">
                 <h3 class="font-bold mb-2">Add Chapter to Current Subject</h3>
                 <div class="flex gap-2">
                     <input type="text" id="new-chap-title" placeholder="Chapter Title" class="flex-1 border p-2 rounded">
                     <button onclick="addChapter()" class="bg-gray-800 text-white px-4 rounded">Add</button>
                 </div>
            </div>
        </div>

    </div>

    <script>
        const API = window.location.origin + '/api';
        
        // Navigation
        function setView(id) {
            ['dashboard', 'curriculum', 'content'].forEach(v => document.getElementById('view-'+v).classList.add('hidden'));
            document.querySelectorAll('.active-nav').forEach(n => n.classList.remove('active-nav', 'bg-gray-700'));
            
            document.getElementById('view-'+id).classList.remove('hidden');
            document.getElementById('nav-'+id).classList.add('active-nav', 'bg-gray-700');

            if(id === 'dashboard') loadStats();
            if(id === 'curriculum') loadCurriculumData();
            if(id === 'content') loadContentDropdowns();
        }

        // Dashboard Logic
        async function loadStats() {
            const res = await fetch(API + '/stats');
            const data = await res.json();
            document.getElementById('stat-programs').innerText = data.programs;
            document.getElementById('stat-subjects').innerText = data.subjects;
            document.getElementById('stat-questions').innerText = data.questions;
        }

        // Curriculum Logic
        async function loadCurriculumData() {
            const res = await fetch(API + '/meta');
            const data = await res.json();
            
            // Populates Subject Creator
            const pSel = document.getElementById('sub-program');
            const gSel = document.getElementById('sub-group');
            pSel.innerHTML = ''; gSel.innerHTML = '';
            
            data.programs.forEach(p => pSel.add(new Option(p.title, p.id)));
            data.groups.forEach(g => gSel.add(new Option(g.title, g.id)));

            // List existing subjects
            const subRes = await fetch(API + '/subjects');
            const subjects = await subRes.json();
            const list = document.getElementById('subject-list');
            list.innerHTML = '';
            subjects.forEach(s => {
                list.innerHTML += \`<div class="flex justify-between p-3 bg-gray-50 rounded border">
                    <span class="font-bold text-gray-700">\${s.title}</span>
                    <span class="text-xs bg-white px-2 py-1 rounded text-gray-500">\${s.program_title} - \${s.group_title}</span>
                </div>\`;
            });
        }

        async function addSubject() {
            const body = {
                program_id: document.getElementById('sub-program').value,
                group_id: document.getElementById('sub-group').value,
                title: document.getElementById('sub-name').value
            };
            if(!body.title) return alert("Enter Name");
            await fetch(API + '/subject', { method: 'POST', body: JSON.stringify(body) });
            loadCurriculumData();
            document.getElementById('sub-name').value = '';
        }

        // Content Logic
        async function loadContentDropdowns() {
            const res = await fetch(API + '/subjects');
            const subjects = await res.json();
            const sel = document.getElementById('cont-subject');
            sel.innerHTML = '<option value="">1. Select Subject...</option>';
            subjects.forEach(s => sel.add(new Option(s.title + ' (' + s.program_title + ')', s.id)));
        }

        async function loadChapters(subId) {
            if(!subId) return;
            const res = await fetch(API + '/chapters/' + subId);
            const chapters = await res.json();
            const sel = document.getElementById('cont-chapter');
            sel.innerHTML = '<option value="">2. Select Chapter...</option>';
            chapters.forEach(c => sel.add(new Option(c.title, c.id)));
        }

        async function addChapter() {
            const subId = document.getElementById('cont-subject').value;
            const title = document.getElementById('new-chap-title').value;
            if(!subId) return alert("Select Subject First");
            if(!title) return alert("Enter Title");
            
            await fetch(API + '/chapter', { method: 'POST', body: JSON.stringify({ subject_id: subId, title }) });
            loadChapters(subId);
            document.getElementById('new-chap-title').value = '';
        }

        async function loadTopics(chapId) {
            if(!chapId) return;
            const res = await fetch(API + '/topics/' + chapId);
            const topics = await res.json();
            const list = document.getElementById('topic-list');
            list.innerHTML = '';
            topics.forEach(t => {
                list.innerHTML += \`<div onclick="selectTopic(\${t.id}, '\${t.title}')" class="p-2 border rounded cursor-pointer hover:bg-blue-50">\${t.title}</div>\`;
            });
        }

        function addTopic() { document.getElementById('add-topic-form').classList.remove('hidden'); }
        
        async function submitTopic() {
            const chapId = document.getElementById('cont-chapter').value;
            const title = document.getElementById('new-topic-title').value;
            await fetch(API + '/topic', { method: 'POST', body: JSON.stringify({ chapter_id: chapId, title }) });
            document.getElementById('add-topic-form').classList.add('hidden');
            loadTopics(chapId);
        }

        let selectedTopicId = null;
        function selectTopic(id, title) {
            selectedTopicId = id;
            document.getElementById('q-form-overlay').classList.add('hidden');
            document.getElementById('q-form').classList.remove('hidden');
            document.getElementById('q-topic-id').value = id;
        }

        async function saveQuestion() {
            const body = {
                topic_id: selectedTopicId,
                question_text: document.getElementById('q-text').value,
                options: JSON.stringify([
                    document.getElementById('q-opt1').value,
                    document.getElementById('q-opt2').value,
                    document.getElementById('q-opt3').value,
                    document.getElementById('q-opt4').value
                ]),
                correct_answer: document.getElementById('q-correct').value
            };
            await fetch(API + '/question', { method: 'POST', body: JSON.stringify(body) });
            alert("Question Saved!");
            document.getElementById('q-text').value = '';
        }

        // Init
        setView('dashboard');
    </script>
</body>
</html>
`;

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);

        // --- ROUTES ---
        
        // 1. ADMIN UI
        if (url.pathname === "/admin") return new Response(ADMIN_UI, { headers: { "Content-Type": "text/html" } });
        
        // 2. SYSTEM RESET (The "Fix Everything" Button)
        if (url.pathname === "/api/system/init") {
            try {
                // Split statements safely
                const statements = INIT_SQL.split(';').map(s => s.trim()).filter(s => s.length > 0);
                for(const stmt of statements) { await env.DB.prepare(stmt).run(); }
                return new Response("System Reset Successfully! Go back to /admin", { status: 200 });
            } catch(e: any) { return new Response("Error: " + e.message, { status: 500 }); }
        }

        // 3. STATS
        if (url.pathname === "/api/stats") {
            const p = await env.DB.prepare("SELECT count(*) as c FROM programs").first();
            const s = await env.DB.prepare("SELECT count(*) as c FROM subjects").first();
            const q = await env.DB.prepare("SELECT count(*) as c FROM questions").first();
            return json({ programs: p.c, subjects: s.c, questions: q.c });
        }

        // 4. METADATA (Programs/Groups)
        if (url.pathname === "/api/meta") {
            const p = await env.DB.prepare("SELECT * FROM programs").all();
            const g = await env.DB.prepare("SELECT * FROM groups").all();
            return json({ programs: p.results, groups: g.results });
        }

        // 5. SUBJECTS
        if (url.pathname === "/api/subjects") {
            const res = await env.DB.prepare(`
                SELECT s.id, s.title, p.title as program_title, g.title as group_title 
                FROM subjects s 
                JOIN programs p ON s.program_id = p.id 
                JOIN groups g ON s.group_id = g.id
            `).all();
            return json(res.results);
        }
        if (url.pathname === "/api/subject" && request.method === "POST") {
            const b = await request.json() as any;
            await env.DB.prepare("INSERT INTO subjects (program_id, group_id, title) VALUES (?, ?, ?)").bind(b.program_id, b.group_id, b.title).run();
            return json({success:true});
        }

        // 6. CHAPTERS
        if (url.pathname.startsWith("/api/chapters/")) {
            const subId = url.pathname.split('/').pop();
            const res = await env.DB.prepare("SELECT * FROM chapters WHERE subject_id = ?").bind(subId).all();
            return json(res.results);
        }
        if (url.pathname === "/api/chapter" && request.method === "POST") {
            const b = await request.json() as any;
            await env.DB.prepare("INSERT INTO chapters (subject_id, title) VALUES (?, ?)").bind(b.subject_id, b.title).run();
            return json({success:true});
        }

        // 7. TOPICS
        if (url.pathname.startsWith("/api/topics/")) {
            const chapId = url.pathname.split('/').pop();
            const res = await env.DB.prepare("SELECT * FROM topics WHERE chapter_id = ?").bind(chapId).all();
            return json(res.results);
        }
        if (url.pathname === "/api/topic" && request.method === "POST") {
            const b = await request.json() as any;
            await env.DB.prepare("INSERT INTO topics (chapter_id, title) VALUES (?, ?)").bind(b.chapter_id, b.title).run();
            return json({success:true});
        }

        // 8. QUESTIONS
        if (url.pathname === "/api/question" && request.method === "POST") {
            const b = await request.json() as any;
            await env.DB.prepare("INSERT INTO questions (topic_id, question_text, options, correct_answer) VALUES (?, ?, ?, ?)").bind(b.topic_id, b.question_text, b.options, b.correct_answer).run();
            return json({success:true});
        }

        return new Response("Freeducation API Online. Visit /admin", { headers: { "Content-Type": "text/html" } });
    }
}
