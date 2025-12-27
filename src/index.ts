export interface Env {
    DB: D1Database;
    BUCKET: R2Bucket;
    JWT_SECRET: string;
}

// --- EMBEDDED ADMIN UI HTML ---
// This allows the Worker to serve the frontend directly without separate hosting.
const ADMIN_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Freeducation Admin</title>
    <style>
        body { font-family: -apple-system, system-ui, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; background: #f4f4f9; color: #333; }
        .card { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-bottom: 20px; }
        h1, h2 { color: #1a1a1a; }
        input, select, textarea { width: 100%; padding: 10px; margin: 8px 0 20px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; font-size: 14px; }
        button { background: #2563eb; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: background 0.2s; }
        button:hover { background: #1d4ed8; }
        .hidden { display: none; }
        .status-bar { padding: 10px; margin-bottom: 20px; border-radius: 6px; background: #e0f2fe; color: #0369a1; display: flex; justify-content: space-between; align-items: center; }
        pre { background: #1e293b; color: #e2e8f0; padding: 15px; border-radius: 8px; overflow-x: auto; font-size: 13px; }
    </style>
</head>
<body>
    <div id="app">
        <h1>🎓 Freeducation Control Center</h1>

        <!-- Status & Logout -->
        <div id="statusBar" class="status-bar hidden">
            <span>Logged in as: <strong id="adminName">Admin</strong></span>
            <button onclick="logout()" style="padding: 5px 10px; font-size: 12px; background: #ef4444;">Logout</button>
        </div>

        <!-- Login Section -->
        <div id="loginSection" class="card">
            <h2>🔐 Admin Login</h2>
            <p style="color: #666; font-size: 0.9rem; margin-bottom: 15px;">Default: admin@free.edu / admin123</p>
            <input type="email" id="email" placeholder="Email" value="admin@free.edu">
            <input type="password" id="password" placeholder="Password" value="admin123">
            <button onclick="login()">Access Dashboard</button>
        </div>

        <!-- Dashboard Section -->
        <div id="dashboardSection" class="hidden">
            
            <!-- Content Creator -->
            <div class="card">
                <h2>📝 Add Content</h2>
                <label style="font-weight: bold; display: block; margin-bottom: 5px;">What do you want to add?</label>
                <select id="actionType" onchange="toggleForm()">
                    <option value="chapter">New Chapter</option>
                    <option value="mcq">New MCQ Question</option>
                </select>

                <!-- Chapter Form -->
                <div id="chapterForm" style="margin-top: 15px;">
                    <input type="number" id="subjectId" placeholder="Subject ID (See structure below)">
                    <input type="text" id="chapterTitle" placeholder="Chapter Title (e.g., Vector, Organic Chemistry)">
                    <button onclick="addChapter()">Create Chapter</button>
                </div>

                <!-- MCQ Form -->
                <div id="mcqForm" class="hidden" style="margin-top: 15px;">
                    <input type="number" id="mcqChapterId" placeholder="Chapter ID (See structure below)">
                    <textarea id="question" rows="3" placeholder="Question Text"></textarea>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <input type="text" id="opt1" placeholder="Option A">
                        <input type="text" id="opt2" placeholder="Option B">
                        <input type="text" id="opt3" placeholder="Option C">
                        <input type="text" id="opt4" placeholder="Option D">
                    </div>
                    
                    <label>Correct Answer:</label>
                    <select id="correctIdx">
                        <option value="0">Option A</option>
                        <option value="1">Option B</option>
                        <option value="2">Option C</option>
                        <option value="3">Option D</option>
                    </select>
                    
                    <input type="text" id="explanation" placeholder="Explanation (Why is this correct?)">
                    <button onclick="addMcq()">Save Question</button>
                </div>
            </div>

            <!-- Database Viewer -->
            <div class="card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h2 style="margin: 0;">📚 Database Structure</h2>
                    <button onclick="fetchStructure()" style="background: #64748b; font-size: 13px; padding: 8px 16px;">Refresh Data</button>
                </div>
                <p style="font-size: 0.9rem; color: #666;">Use the IDs shown below when adding content.</p>
                <pre id="jsonOutput">Loading data...</pre>
            </div>
        </div>
    </div>

    <script>
        // Automatically detect API URL (Localhost or Production)
        const API_URL = window.location.origin;
        let token = localStorage.getItem('admin_token');

        // Check if already logged in
        if (token) {
            showDashboard();
        }

        async function login() {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                const res = await fetch(\`\${API_URL}/api/auth/login\`, {
                    method: 'POST',
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                
                if (data.token && data.role === 'admin') {
                    token = data.token;
                    localStorage.setItem('admin_token', token);
                    showDashboard();
                } else {
                    alert("Login Failed: " + (data.error || "Check credentials"));
                }
            } catch (e) { 
                alert("Connection Error. Is the worker running?"); 
            }
        }

        function logout() {
            token = null;
            localStorage.removeItem('admin_token');
            document.getElementById('loginSection').classList.remove('hidden');
            document.getElementById('dashboardSection').classList.add('hidden');
            document.getElementById('statusBar').classList.add('hidden');
        }

        function showDashboard() {
            document.getElementById('loginSection').classList.add('hidden');
            document.getElementById('dashboardSection').classList.remove('hidden');
            document.getElementById('statusBar').classList.remove('hidden');
            fetchStructure();
        }

        async function fetchStructure() {
            try {
                const res = await fetch(\`\${API_URL}/api/structure\`);
                const data = await res.json();
                document.getElementById('jsonOutput').innerText = JSON.stringify(data, null, 2);
            } catch(e) {
                document.getElementById('jsonOutput').innerText = "Error loading data.";
            }
        }

        function toggleForm() {
            const type = document.getElementById('actionType').value;
            document.getElementById('chapterForm').classList.toggle('hidden', type !== 'chapter');
            document.getElementById('mcqForm').classList.toggle('hidden', type !== 'mcq');
        }

        async function addChapter() {
            const subject_id = document.getElementById('subjectId').value;
            const title = document.getElementById('chapterTitle').value;
            
            if(!subject_id || !title) return alert("Please fill all fields");

            await authenticatedPost('/api/admin/chapter', { subject_id, title });
        }

        async function addMcq() {
            const chapter_id = document.getElementById('mcqChapterId').value;
            const question = document.getElementById('question').value;
            const options = [
                document.getElementById('opt1').value,
                document.getElementById('opt2').value,
                document.getElementById('opt3').value,
                document.getElementById('opt4').value
            ];
            const correct_index = parseInt(document.getElementById('correctIdx').value);
            const explanation = document.getElementById('explanation').value;

            if(!chapter_id || !question) return alert("Please fill required fields");

            await authenticatedPost('/api/admin/mcq', { chapter_id, question, options, correct_index, explanation });
        }

        async function authenticatedPost(endpoint, body) {
            const res = await fetch(\`\${API_URL}\${endpoint}\`, {
                method: 'POST',
                headers: { 
                    'Authorization': token, 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (data.success) {
                alert("✅ Added Successfully!");
                fetchStructure(); // Refresh view
            } else {
                alert("❌ Error: " + (data.error || JSON.stringify(data)));
            }
        }
    </script>
</body>
</html>
`;

// --- WORKER LOGIC ---

const jsonResponse = (data: any, status = 200) => 
    new Response(JSON.stringify(data), {
        status,
        headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
    });

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);

        // 1. SERVE THE ADMIN UI (The Fix!)
        if (url.pathname === "/admin") {
            return new Response(ADMIN_HTML, {
                headers: { "Content-Type": "text/html;charset=UTF-8" }
            });
        }

        // 2. ROOT URL (The Fix!)
        if (url.pathname === "/") {
            return new Response("Freeducation API is Online. Go to /admin to manage content.", { status: 200 });
        }
        
        // CORS Preflight
        if (request.method === "OPTIONS") {
            return new Response(null, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                },
            });
        }

        // --- AUTHENTICATION ROUTES ---

        if (url.pathname === "/api/auth/login" && request.method === "POST") {
            const { email, password } = await request.json() as any;
            const user = await env.DB.prepare("SELECT * FROM users WHERE email = ? AND password_hash = ?")
                .bind(email, password).first();

            if (!user) return jsonResponse({ error: "Invalid credentials" }, 401);
            
            // Generate basic token
            const token = btoa(`${user.id}:${user.role}:${Date.now()}`); 
            return jsonResponse({ token, role: user.role, name: user.name });
        }

        if (url.pathname === "/api/auth/register" && request.method === "POST") {
            const { name, email, password, class_level } = await request.json() as any;
            try {
                await env.DB.prepare(
                    "INSERT INTO users (name, email, password_hash, class_level, role) VALUES (?, ?, ?, ?, 'student')"
                ).bind(name, email, password, class_level).run();
                return jsonResponse({ success: true });
            } catch (e) {
                return jsonResponse({ error: "Email already exists" }, 400);
            }
        }

        // --- PUBLIC ROUTES ---

        if (url.pathname === "/api/structure" && request.method === "GET") {
            const classes = await env.DB.prepare("SELECT * FROM classes").all();
            const subjects = await env.DB.prepare("SELECT * FROM subjects").all();
            
            const tree = classes.results.map((c: any) => ({
                ...c,
                subjects: subjects.results.filter((s: any) => s.class_id === c.id)
            }));
            return jsonResponse(tree);
        }

        if (url.pathname.startsWith("/api/chapter/") && request.method === "GET") {
            const chapterId = url.pathname.split("/").pop();
            const materials = await env.DB.prepare("SELECT * FROM materials WHERE chapter_id = ?").bind(chapterId).all();
            const mcqs = await env.DB.prepare("SELECT id, question, options, explanation FROM mcqs WHERE chapter_id = ?").bind(chapterId).all();
            
            const formattedMcqs = mcqs.results.map((m: any) => ({
                ...m,
                options: JSON.parse(m.options as string)
            }));

            return jsonResponse({ materials: materials.results, mcqs: formattedMcqs });
        }

        // --- ADMIN API ROUTES ---
        
        const authHeader = request.headers.get("Authorization");
        const isAdmin = authHeader && atob(authHeader).includes("admin");

        if (url.pathname.startsWith("/api/admin/")) {
            if (!isAdmin) return jsonResponse({ error: "Unauthorized" }, 403);

            if (url.pathname === "/api/admin/subject" && request.method === "POST") {
                const { class_id, name, group_type, icon } = await request.json() as any;
                await env.DB.prepare("INSERT INTO subjects (class_id, name, group_type, icon) VALUES (?, ?, ?, ?)")
                    .bind(class_id, name, group_type, icon).run();
                return jsonResponse({ success: true });
            }

            if (url.pathname === "/api/admin/chapter" && request.method === "POST") {
                const { subject_id, title } = await request.json() as any;
                await env.DB.prepare("INSERT INTO chapters (subject_id, title) VALUES (?, ?)")
                    .bind(subject_id, title).run();
                return jsonResponse({ success: true });
            }

            if (url.pathname === "/api/admin/mcq" && request.method === "POST") {
                const { chapter_id, question, options, correct_index, explanation } = await request.json() as any;
                await env.DB.prepare("INSERT INTO mcqs (chapter_id, question, options, correct_index, explanation) VALUES (?, ?, ?, ?, ?)")
                    .bind(chapter_id, question, JSON.stringify(options), correct_index, explanation).run();
                return jsonResponse({ success: true });
            }
        }

        return new Response("Not Found", { status: 404 });
    },
};
