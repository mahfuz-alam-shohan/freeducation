export interface Env {
    DB: D1Database;
    BUCKET: R2Bucket;
    JWT_SECRET: string;
}

// --- SQL FOR REPAIR (Same as before) ---
const REPAIR_SQL = [
    "DROP TABLE IF EXISTS users;",
    "CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, name TEXT NOT NULL, role TEXT DEFAULT 'student', class_level TEXT, created_at INTEGER DEFAULT (unixepoch()));",
    "CREATE TABLE IF NOT EXISTS classes (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL);",
    "CREATE TABLE IF NOT EXISTS subjects (id INTEGER PRIMARY KEY AUTOINCREMENT, class_id INTEGER NOT NULL, name TEXT NOT NULL, group_type TEXT DEFAULT 'common', icon TEXT, FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE);",
    "CREATE TABLE IF NOT EXISTS chapters (id INTEGER PRIMARY KEY AUTOINCREMENT, subject_id INTEGER NOT NULL, title TEXT NOT NULL, sort_order INTEGER DEFAULT 0, FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE);",
    "CREATE TABLE IF NOT EXISTS mcqs (id INTEGER PRIMARY KEY AUTOINCREMENT, chapter_id INTEGER NOT NULL, question TEXT NOT NULL, options TEXT NOT NULL, correct_index INTEGER NOT NULL, explanation TEXT, FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE);",
    "INSERT INTO classes (name, slug) VALUES ('Class 9 (SSC)', 'class-9') ON CONFLICT(slug) DO NOTHING;",
    "INSERT INTO classes (name, slug) VALUES ('Class 10 (SSC)', 'class-10') ON CONFLICT(slug) DO NOTHING;",
    "INSERT INTO classes (name, slug) VALUES ('HSC 1st Year', 'hsc-1') ON CONFLICT(slug) DO NOTHING;"
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

// --- 1. STUDENT FRONTEND (Mobile-Friendly & Modern) ---
const STUDENT_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Freeducation - Free Coaching for All</title>
    <style>
        :root { --primary: #2563eb; --bg: #f8fafc; --text: #1e293b; }
        body { font-family: -apple-system, system-ui, sans-serif; background: var(--bg); color: var(--text); margin: 0; padding-bottom: 40px; }
        
        /* Header */
        header { background: white; padding: 15px 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; }
        header h1 { margin: 0; font-size: 1.2rem; color: var(--primary); font-weight: 800; }
        
        /* Container */
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        
        /* Cards */
        .card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 15px; cursor: pointer; transition: transform 0.1s; border: 1px solid #e2e8f0; }
        .card:active { transform: scale(0.98); }
        .card h3 { margin: 0 0 5px 0; font-size: 1.1rem; }
        .card p { margin: 0; color: #64748b; font-size: 0.9rem; }
        
        /* Navigation / Breadcrumbs */
        .nav-bar { display: flex; gap: 10px; margin-bottom: 20px; font-size: 0.9rem; color: #64748b; }
        .nav-btn { color: var(--primary); cursor: pointer; font-weight: 600; text-decoration: underline; }

        /* Exam Interface */
        .mcq-box { background: white; padding: 20px; margin-bottom: 20px; border-radius: 12px; border: 1px solid #e2e8f0; }
        .mcq-question { font-weight: 600; margin-bottom: 15px; font-size: 1.05rem; }
        .mcq-option { padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px; margin-bottom: 8px; cursor: pointer; }
        .mcq-option.selected { border-color: var(--primary); background: #eff6ff; }
        .mcq-option.correct { border-color: #22c55e; background: #dcfce7; }
        .mcq-option.wrong { border-color: #ef4444; background: #fee2e2; }
        .hidden { display: none !important; }
        
        /* Hero */
        .hero { text-align: center; margin-bottom: 30px; }
        .hero h2 { font-size: 1.8rem; margin-bottom: 10px; }
        .hero p { color: #64748b; }
    </style>
</head>
<body>
    <header>
        <h1>🎓 Freeducation</h1>
        <a href="/admin" style="font-size: 0.8rem; color: #94a3b8; text-decoration: none;">Admin Login</a>
    </header>

    <div class="container">
        <!-- Breadcrumb Nav -->
        <div id="nav" class="nav-bar hidden">
            <span onclick="goHome()" class="nav-btn">Home</span>
            <span id="nav-subject" class="hidden"> > Subject</span>
        </div>

        <!-- VIEW 1: CLASS SELECTION (Home) -->
        <div id="view-home">
            <div class="hero">
                <h2>Free Coaching for Everyone</h2>
                <p>Select your class to start learning.</p>
            </div>
            <div id="classList">Loading...</div>
        </div>

        <!-- VIEW 2: SUBJECT LIST -->
        <div id="view-subjects" class="hidden">
            <h2 id="classTitle">Subjects</h2>
            <div id="subjectList"></div>
        </div>

        <!-- VIEW 3: CHAPTER LIST -->
        <div id="view-chapters" class="hidden">
            <h2 id="subjectTitle">Chapters</h2>
            <div id="chapterList"></div>
        </div>

        <!-- VIEW 4: CONTENT & EXAM -->
        <div id="view-content" class="hidden">
            <h2 id="chapterTitleDisplay" style="margin-bottom: 20px;"></h2>
            
            <!-- Tabs -->
            <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                <button onclick="switchTab('exam')" style="flex:1; padding: 10px; background: var(--primary); color: white; border: none; border-radius: 8px;">📝 Take Exam</button>
                <button onclick="switchTab('notes')" style="flex:1; padding: 10px; background: #e2e8f0; color: #334155; border: none; border-radius: 8px;">📚 Notes</button>
            </div>

            <div id="tab-exam">
                <div id="mcqList"></div>
                <button onclick="submitExam()" style="width: 100%; padding: 15px; background: #22c55e; color: white; border: none; border-radius: 8px; font-weight: bold; font-size: 1rem;">Check Answers</button>
                <div id="scoreDisplay" style="text-align: center; margin-top: 20px; font-size: 1.2rem; font-weight: bold;"></div>
            </div>

            <div id="tab-notes" class="hidden">
                <p style="text-align: center; color: #64748b;">No PDF notes uploaded for this chapter yet.</p>
            </div>
        </div>
    </div>

    <script>
        const API = window.location.origin;
        let dbStructure = [];
        let currentSubject = null;
        let currentChapter = null;

        // --- NAVIGATION ---
        window.onload = loadStructure;

        function goHome() {
            document.getElementById('view-home').classList.remove('hidden');
            ['view-subjects', 'view-chapters', 'view-content', 'nav'].forEach(id => document.getElementById(id).classList.add('hidden'));
        }

        async function loadStructure() {
            try {
                const res = await fetch(API + '/api/structure');
                dbStructure = await res.json();
                renderClasses();
            } catch(e) { document.getElementById('classList').innerHTML = "Error loading data."; }
        }

        // --- RENDERERS ---

        function renderClasses() {
            const container = document.getElementById('classList');
            container.innerHTML = '';
            if(dbStructure.length === 0) {
                container.innerHTML = '<p style="text-align:center">System is initializing. Please wait.</p>';
                return;
            }
            dbStructure.forEach(cls => {
                const div = document.createElement('div');
                div.className = 'card';
                div.innerHTML = \`<h3>\${cls.name}</h3><p>\${cls.subjects.length} Subjects</p>\`;
                div.onclick = () => showSubjects(cls);
                container.appendChild(div);
            });
        }

        function showSubjects(cls) {
            document.getElementById('view-home').classList.add('hidden');
            document.getElementById('view-subjects').classList.remove('hidden');
            document.getElementById('nav').classList.remove('hidden');
            document.getElementById('classTitle').innerText = cls.name;
            
            const container = document.getElementById('subjectList');
            container.innerHTML = '';
            
            if(cls.subjects.length === 0) {
                container.innerHTML = '<p>No subjects added yet.</p>';
                return;
            }

            cls.subjects.forEach(sub => {
                const div = document.createElement('div');
                div.className = 'card';
                div.innerHTML = \`<h3>\${sub.icon || '📘'} \${sub.name}</h3><p>\${sub.group_type}</p>\`;
                div.onclick = () => showChapters(sub);
                container.appendChild(div);
            });
        }

        async function showChapters(sub) {
            currentSubject = sub;
            // Fetch chapters dynamically
            const res = await fetch(API + '/api/public/chapters/' + sub.id);
            const chapters = await res.json();

            document.getElementById('view-subjects').classList.add('hidden');
            document.getElementById('view-chapters').classList.remove('hidden');
            document.getElementById('subjectTitle').innerText = sub.name;

            const container = document.getElementById('chapterList');
            container.innerHTML = '';

            if(chapters.length === 0) {
                container.innerHTML = '<p>No chapters added yet.</p>';
                return;
            }

            chapters.forEach(chap => {
                const div = document.createElement('div');
                div.className = 'card';
                div.innerHTML = \`<h3>\${chap.title}</h3>\`;
                div.onclick = () => showContent(chap);
                container.appendChild(div);
            });
        }

        async function showContent(chap) {
            currentChapter = chap;
            const res = await fetch(API + '/api/public/content/' + chap.id);
            const data = await res.json(); // { mcqs: [], materials: [] }

            document.getElementById('view-chapters').classList.add('hidden');
            document.getElementById('view-content').classList.remove('hidden');
            document.getElementById('chapterTitleDisplay').innerText = chap.title;

            // Render MCQs
            const mcqContainer = document.getElementById('mcqList');
            mcqContainer.innerHTML = '';
            document.getElementById('scoreDisplay').innerText = '';

            if(data.mcqs.length === 0) {
                mcqContainer.innerHTML = '<p>No questions available for practice.</p>';
                document.querySelector('button[onclick="submitExam()"]').classList.add('hidden');
            } else {
                document.querySelector('button[onclick="submitExam()"]').classList.remove('hidden');
                data.mcqs.forEach((q, idx) => {
                    const opts = JSON.parse(q.options);
                    let html = \`<div class="mcq-box" id="q-\${idx}" data-correct="\${q.correct_index}">
                        <div class="mcq-question">\${idx+1}. \${q.question}</div>\`;
                    
                    opts.forEach((opt, oIdx) => {
                        html += \`<div class="mcq-option" onclick="selectOption(this, \${idx})">\${opt}</div>\`;
                    });
                    
                    html += \`<div class="explanation hidden" style="margin-top:10px; color:#2563eb; font-size:0.9rem;">💡 \${q.explanation || 'No explanation'}</div></div>\`;
                    mcqContainer.innerHTML += html;
                });
            }
        }

        // --- EXAM LOGIC ---
        function selectOption(el, qIdx) {
            // Remove previous selection in this question
            const parent = document.getElementById('q-' + qIdx);
            if(parent.classList.contains('checked')) return; // Prevent changing after submit

            parent.querySelectorAll('.mcq-option').forEach(d => d.classList.remove('selected'));
            el.classList.add('selected');
        }

        function submitExam() {
            let score = 0;
            let total = 0;
            const questions = document.querySelectorAll('.mcq-box');
            
            questions.forEach(q => {
                total++;
                q.classList.add('checked');
                const correctIdx = parseInt(q.getAttribute('data-correct'));
                const selected = q.querySelector('.selected');
                const options = q.querySelectorAll('.mcq-option');
                
                // Highlight Correct Answer
                options[correctIdx].classList.add('correct');

                // Check User Answer
                if(selected) {
                    // Find index of selected
                    const selectedIdx = Array.from(options).indexOf(selected);
                    if(selectedIdx === correctIdx) {
                        score++;
                    } else {
                        selected.classList.add('wrong');
                    }
                }
                
                // Show Explanation
                q.querySelector('.explanation').classList.remove('hidden');
            });

            document.getElementById('scoreDisplay').innerText = \`You scored \${score} / \${total}\`;
            window.scrollTo(0, document.body.scrollHeight);
        }

        function switchTab(tab) {
            if(tab === 'exam') {
                document.getElementById('tab-exam').classList.remove('hidden');
                document.getElementById('tab-notes').classList.add('hidden');
            } else {
                document.getElementById('tab-exam').classList.add('hidden');
                document.getElementById('tab-notes').classList.remove('hidden');
            }
        }
    </script>
</body>
</html>
`;

// --- 2. ADMIN HTML (Same as before, kept for management) ---
const ADMIN_HTML = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Freeducation Admin</title><style>body{font-family:-apple-system,system-ui,sans-serif;padding:20px;max-width:800px;margin:0 auto;background:#f1f5f9;color:#334155}.card{background:white;padding:30px;border-radius:12px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);margin-bottom:25px;border:1px solid #e2e8f0}h1,h2{color:#0f172a;margin-top:0}label{display:block;margin-bottom:6px;font-weight:600;font-size:.9rem;color:#475569}input,select,textarea{width:100%;padding:10px;border:1px solid #cbd5e1;border-radius:6px;font-size:15px;box-sizing:border-box}button{background:#2563eb;color:white;padding:12px 20px;border:none;border-radius:6px;cursor:pointer;font-weight:600;width:100%;margin-top:10px}button:hover{background:#1d4ed8}.hidden{display:none!important}.alert{padding:15px;border-radius:8px;margin-bottom:20px;text-align:center;font-weight:500}.alert-error{background:#fee2e2;color:#991b1b;border:1px solid #fecaca}.repair-btn{background:#b91c1c;margin-top:15px}</style></head><body><div id="app"><h1 style="text-align:center">🎓 Freeducation Panel</h1><div id="diagnostics" class="card hidden" style="border-left:5px solid #ef4444"><h3 style="margin-top:0;color:#b91c1c">System Failure Detected</h3><p id="errorMsg"></p><button onclick="repairSystem()" class="repair-btn">🛠️ Click to Repair Database Automatically</button></div><div id="setupSection" class="card hidden"><h2 style="text-align:center">🚀 First Time Setup</h2><div class="alert" style="background:#dcfce7;color:#166534">Database connected. Create Admin.</div><label>Full Name</label><input type="text" id="setupName"><label>Email Address</label><input type="email" id="setupEmail"><label>Secure Password</label><input type="password" id="setupPass"><button onclick="performSetup()">Initialize System</button></div><div id="loginSection" class="card hidden"><h2 style="text-align:center">🔐 Admin Login</h2><label>Email</label><input type="email" id="email"><label>Password</label><input type="password" id="password"><button onclick="login()">Login</button></div><div id="dashboardSection" class="hidden"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px"><span>Logged in as <strong id="adminName">Admin</strong></span><button onclick="logout()" style="width:auto;background:#ef4444;margin:0">Logout</button></div><div class="card"><h2>Add Content</h2><label>Type</label><select id="actionType" onchange="toggleForm()"><option value="chapter">New Chapter</option><option value="mcq">New MCQ</option></select><div id="chapterForm" style="margin-top:15px"><label>Subject ID</label><input type="number" id="subjectId" placeholder="e.g. 1"><label>Chapter Title</label><input type="text" id="chapterTitle" placeholder="e.g. Organic Chemistry"><button onclick="addChapter()">Create Chapter</button></div><div id="mcqForm" class="hidden" style="margin-top:15px"><label>Chapter ID</label><input type="number" id="mcqChapterId"><label>Question</label><textarea id="question" rows="2"></textarea><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px"><input type="text" id="opt1" placeholder="Option A"><input type="text" id="opt2" placeholder="Option B"><input type="text" id="opt3" placeholder="Option C"><input type="text" id="opt4" placeholder="Option D"></div><label style="margin-top:10px">Correct Answer (0-3)</label><select id="correctIdx"><option value="0">Option A</option><option value="1">Option B</option><option value="2">Option C</option><option value="3">Option D</option></select><label>Explanation</label><input type="text" id="explanation"><button onclick="addMcq()">Save MCQ</button></div></div><div class="card"><h2>Database Structure</h2><pre id="jsonOutput" style="background:#1e293b;color:#e2e8f0;padding:15px;border-radius:8px;overflow:auto">Loading...</pre><button onclick="fetchStructure()" style="margin-top:10px;background:#64748b">Refresh Data</button></div></div></div><script>const API=window.location.origin;let token=localStorage.getItem("token");window.onload=async()=>{try{const e=await fetch(\`\${API}/api/auth/status\`),t=await e.json();e.ok?t.adminExists?token?(showSection("dashboardSection"),document.getElementById("adminName").innerText="Admin",fetchStructure()):showSection("loginSection"):showSection("setupSection"):showError(t.error||"Unknown Backend Error")}catch(e){showError("Connection Failed: "+e.message)}};function showSection(e){["setupSection","loginSection","dashboardSection","diagnostics"].forEach(e=>{document.getElementById(e).classList.add("hidden")}),document.getElementById(e).classList.remove("hidden")}function showError(e){showSection("diagnostics"),document.getElementById("errorMsg").innerText=e}async function repairSystem(){confirm("This will attempt to fix the database structure. Continue?")&&try{const e=await fetch(\`\${API}/api/auth/repair\`,{method:"POST"}),t=await e.json();t.success?(alert("✅ Repair Successful! Reloading..."),location.reload()):alert("❌ Repair Failed: "+t.error)}catch(e){alert("Network Error: "+e.message)}}async function performSetup(){const e={name:document.getElementById("setupName").value,email:document.getElementById("setupEmail").value,password:document.getElementById("setupPass").value},t=await fetch(\`\${API}/api/auth/setup\`,{method:"POST",body:JSON.stringify(e)}),n=await t.json();n.success?(alert("Success! Please Login."),location.reload()):alert(n.error)}async function login(){const e={email:document.getElementById("email").value,password:document.getElementById("password").value},t=await fetch(\`\${API}/api/auth/login\`,{method:"POST",body:JSON.stringify(e)}),n=await t.json();n.token?(localStorage.setItem("token",n.token),location.reload()):alert(n.error)}function logout(){localStorage.removeItem("token"),location.reload()}function toggleForm(){const e=document.getElementById("actionType").value;document.getElementById("chapterForm").classList.toggle("hidden","chapter"!==e),document.getElementById("mcqForm").classList.toggle("hidden","mcq"!==e)}async function fetchStructure(){const e=await fetch(\`\${API}/api/structure\`),t=await e.json();document.getElementById("jsonOutput").innerText=JSON.stringify(t,null,2)}async function addChapter(){const e=document.getElementById("subjectId").value,t=document.getElementById("chapterTitle").value;postData("/api/admin/chapter",{subject_id:e,title:t})}async function addMcq(){const e={chapter_id:document.getElementById("mcqChapterId").value,question:document.getElementById("question").value,options:[document.getElementById("opt1").value,document.getElementById("opt2").value,document.getElementById("opt3").value,document.getElementById("opt4").value],correct_index:parseInt(document.getElementById("correctIdx").value),explanation:document.getElementById("explanation").value};postData("/api/admin/mcq",e)}async function postData(e,t){const n=await fetch(\`\${API}\${e}\`,{method:"POST",headers:{Authorization:token,"Content-Type":"application/json"},body:JSON.stringify(t)}),a=await n.json();a.success?(alert("Saved!"),fetchStructure()):alert("Error: "+(a.error||JSON.stringify(a)))}</script></body></html>`;

// --- WORKER LOGIC ---
export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);

        // 1. SERVE HTML
        if (url.pathname === "/admin") return new Response(ADMIN_HTML, { headers: { "Content-Type": "text/html" } });
        if (url.pathname === "/") return new Response(STUDENT_HTML, { headers: { "Content-Type": "text/html" } }); // <--- NOW SERVES STUDENT APP
        if (request.method === "OPTIONS") return new Response(null, { headers: { "Access-Control-Allow-Origin": "*" } });

        try {
            // --- PUBLIC APIs (Student Access) ---
            
            // Get Subjects for a Class (Not really needed as /structure does it all, but good to have)
            // Get Chapters for a Subject
            if (url.pathname.startsWith("/api/public/chapters/")) {
                const subjectId = url.pathname.split('/').pop();
                const chapters = await env.DB.prepare("SELECT * FROM chapters WHERE subject_id = ? ORDER BY sort_order ASC, id ASC").bind(subjectId).all();
                return jsonResponse(chapters.results || []);
            }

            // Get Content (MCQs + PDFs) for a Chapter
            if (url.pathname.startsWith("/api/public/content/")) {
                const chapterId = url.pathname.split('/').pop();
                const mcqs = await env.DB.prepare("SELECT * FROM mcqs WHERE chapter_id = ?").bind(chapterId).all();
                const materials = await env.DB.prepare("SELECT * FROM materials WHERE chapter_id = ?").bind(chapterId).all();
                return jsonResponse({ mcqs: mcqs.results || [], materials: materials.results || [] });
            }

            // --- SHARED APIs ---
            if (url.pathname === "/api/auth/repair" && request.method === "POST") {
                await env.DB.batch(REPAIR_SQL.map(sql => env.DB.prepare(sql)));
                return jsonResponse({ success: true, message: "Database Repaired" });
            }

            if (url.pathname === "/api/auth/status") {
                try {
                    const adminCount = await env.DB.prepare("SELECT COUNT(*) as total FROM users WHERE role = 'admin'").first();
                    return jsonResponse({ adminExists: (adminCount as any).total > 0 });
                } catch (e: any) { return jsonResponse({ error: "DB Error: " + e.message }, 500); }
            }

            if (url.pathname === "/api/structure") {
                const classes = await env.DB.prepare("SELECT * FROM classes").all();
                const subjects = await env.DB.prepare("SELECT * FROM subjects").all();
                // Simple JOIN in JS
                const tree = (classes.results || []).map((c: any) => ({
                    ...c,
                    subjects: (subjects.results || []).filter((s: any) => s.class_id === c.id)
                }));
                return jsonResponse(tree);
            }

            // --- AUTH APIs ---
            if (url.pathname === "/api/auth/setup" && request.method === "POST") {
                const body = await request.json() as any;
                const hashed = await hashPassword(body.password);
                await env.DB.prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')")
                    .bind(body.name, body.email, hashed).run();
                return jsonResponse({ success: true });
            }

            if (url.pathname === "/api/auth/login" && request.method === "POST") {
                const body = await request.json() as any;
                const hashed = await hashPassword(body.password);
                const user = await env.DB.prepare("SELECT * FROM users WHERE email = ? AND password_hash = ?").bind(body.email, hashed).first();
                if (!user) return jsonResponse({ error: "Invalid Credentials" }, 401);
                const token = btoa(`${user.id}:${user.role}:${Date.now()}`);
                return jsonResponse({ token, role: user.role, name: user.name });
            }

            // --- ADMIN APIs ---
            if (url.pathname.startsWith("/api/admin/")) {
                const authHeader = request.headers.get("Authorization");
                const isAdmin = authHeader && atob(authHeader).includes("admin");
                if (!isAdmin) return jsonResponse({ error: "Unauthorized" }, 403);

                if (url.pathname === "/api/admin/chapter" && request.method === "POST") {
                    const body = await request.json() as any;
                    await env.DB.prepare("INSERT INTO chapters (subject_id, title) VALUES (?, ?)").bind(body.subject_id, body.title).run();
                    return jsonResponse({ success: true });
                }
                if (url.pathname === "/api/admin/mcq" && request.method === "POST") {
                    const body = await request.json() as any;
                    await env.DB.prepare("INSERT INTO mcqs (chapter_id, question, options, correct_index, explanation) VALUES (?, ?, ?, ?, ?)")
                        .bind(body.chapter_id, body.question, JSON.stringify(body.options), body.correct_index, body.explanation).run();
                    return jsonResponse({ success: true });
                }
            }

            return new Response("Not Found", { status: 404 });

        } catch (e: any) {
            return jsonResponse({ error: "Internal Error: " + e.message }, 500);
        }
    },
};
