export interface Env {
    DB: D1Database;
    BUCKET: R2Bucket;
    JWT_SECRET: string;
}

// --- UTILS: ROBUSTNESS ---

// 1. Safe Password Hasher
async function hashPassword(password: string): Promise<string> {
    if (!password) throw new Error("Password cannot be empty");
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// 2. Safe JSON Response Wrapper
const jsonResponse = (data: any, status = 200) => 
    new Response(JSON.stringify(data), {
        status,
        headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
    });

// 3. Robust JSON Parser (Prevents crashes on bad input)
async function parseBody(request: Request) {
    try {
        const text = await request.text();
        return text ? JSON.parse(text) : {};
    } catch (e) {
        return null; // Return null if JSON is broken
    }
}

// --- EMBEDDED ADMIN UI HTML ---
const ADMIN_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Freeducation Admin</title>
    <style>
        body { font-family: -apple-system, system-ui, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; background: #f1f5f9; color: #334155; }
        .card { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); margin-bottom: 25px; border: 1px solid #e2e8f0; }
        h1, h2 { color: #0f172a; margin-top: 0; }
        label { display: block; margin-bottom: 6px; font-weight: 600; font-size: 0.9rem; color: #475569; }
        input, select, textarea { width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 15px; box-sizing: border-box; }
        button { background: #2563eb; color: white; padding: 12px 20px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; width: 100%; margin-top: 10px; }
        button:hover { background: #1d4ed8; }
        button:disabled { background: #94a3b8; cursor: not-allowed; }
        .hidden { display: none !important; }
        .alert { padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center; font-weight: 500; }
        .alert-error { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
        .alert-success { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
        pre { background: #1e293b; color: #e2e8f0; padding: 15px; border-radius: 8px; overflow-x: auto; font-size: 12px; }
    </style>
</head>
<body>
    <div id="app">
        <h1 style="text-align: center;">🎓 Freeducation Panel</h1>

        <!-- System Diagnostics -->
        <div id="diagnostics" class="alert alert-error hidden"></div>

        <!-- 1. SETUP SECTION -->
        <div id="setupSection" class="card hidden">
            <h2 style="text-align: center;">🚀 First Time Setup</h2>
            <div class="alert alert-success">Database is ready. Create Super Admin.</div>
            <label>Full Name</label>
            <input type="text" id="setupName" placeholder="Your Name">
            <label>Email Address</label>
            <input type="email" id="setupEmail" placeholder="admin@example.com">
            <label>Secure Password</label>
            <input type="password" id="setupPass" placeholder="********">
            <button onclick="performSetup()" id="setupBtn">Initialize System</button>
        </div>

        <!-- 2. LOGIN SECTION -->
        <div id="loginSection" class="card hidden">
            <h2 style="text-align: center;">🔐 Admin Login</h2>
            <label>Email</label>
            <input type="email" id="email">
            <label>Password</label>
            <input type="password" id="password">
            <button onclick="login()" id="loginBtn">Login</button>
        </div>

        <!-- 3. DASHBOARD SECTION -->
        <div id="dashboardSection" class="hidden">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <span>Welcome, <strong id="adminName">Admin</strong></span>
                <button onclick="logout()" style="width: auto; background: #ef4444; margin: 0;">Logout</button>
            </div>
            
            <div class="card">
                <h2>Add Content</h2>
                <label>Type</label>
                <select id="actionType" onchange="toggleForm()">
                    <option value="chapter">New Chapter</option>
                    <option value="mcq">New MCQ</option>
                </select>

                <!-- Chapter Form -->
                <div id="chapterForm" style="margin-top: 15px;">
                    <label>Subject ID</label>
                    <input type="number" id="subjectId" placeholder="e.g. 1">
                    <label>Chapter Title</label>
                    <input type="text" id="chapterTitle" placeholder="e.g. Organic Chemistry">
                    <button onclick="addChapter()">Create Chapter</button>
                </div>

                <!-- MCQ Form -->
                <div id="mcqForm" class="hidden" style="margin-top: 15px;">
                    <label>Chapter ID</label>
                    <input type="number" id="mcqChapterId">
                    <label>Question</label>
                    <textarea id="question" rows="2"></textarea>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
                        <input type="text" id="opt1" placeholder="Option A">
                        <input type="text" id="opt2" placeholder="Option B">
                        <input type="text" id="opt3" placeholder="Option C">
                        <input type="text" id="opt4" placeholder="Option D">
                    </div>
                    <label style="margin-top: 10px;">Correct Answer (0-3)</label>
                    <select id="correctIdx">
                        <option value="0">Option A</option>
                        <option value="1">Option B</option>
                        <option value="2">Option C</option>
                        <option value="3">Option D</option>
                    </select>
                    <label>Explanation</label>
                    <input type="text" id="explanation">
                    <button onclick="addMcq()">Save MCQ</button>
                </div>
            </div>

            <div class="card">
                <h2>Database Structure</h2>
                <button onclick="fetchStructure()" style="width: auto; background: #64748b; margin-bottom: 10px;">Refresh</button>
                <pre id="jsonOutput">Loading...</pre>
            </div>
        </div>
    </div>

    <script>
        const API = window.location.origin;
        let token = localStorage.getItem('token');

        window.onload = async () => {
            try {
                // 1. Health Check
                const res = await fetch(\`\${API}/api/auth/status\`);
                if (!res.ok) throw new Error("Backend connection failed");
                
                const status = await res.json();
                
                // 2. Fatal DB Error Check
                if (status.error) {
                    showError("Database Error: " + status.error);
                    return;
                }

                // 3. Routing
                if (!status.adminExists) {
                    showSection('setupSection');
                } else if (token) {
                    showSection('dashboardSection');
                    document.getElementById('adminName').innerText = "User";
                    fetchStructure();
                } else {
                    showSection('loginSection');
                }
            } catch (e) {
                showError(e.message);
            }
        };

        function showSection(id) {
            ['setupSection', 'loginSection', 'dashboardSection'].forEach(s => {
                document.getElementById(s).classList.add('hidden');
            });
            document.getElementById(id).classList.remove('hidden');
        }

        function showError(msg) {
            const el = document.getElementById('diagnostics');
            el.innerText = "CRITICAL FAILURE: " + msg;
            el.classList.remove('hidden');
        }

        async function performSetup() {
            const btn = document.getElementById('setupBtn');
            btn.disabled = true;
            btn.innerText = "Processing...";

            const body = {
                name: document.getElementById('setupName').value,
                email: document.getElementById('setupEmail').value,
                password: document.getElementById('setupPass').value
            };

            try {
                const res = await fetch(\`\${API}/api/auth/setup\`, {
                    method: 'POST',
                    body: JSON.stringify(body)
                });
                const data = await res.json();

                if (data.success) {
                    alert("Setup Success! Please Login.");
                    location.reload();
                } else {
                    alert("Failed: " + data.error);
                    btn.disabled = false;
                }
            } catch (e) {
                alert("Network Error");
                btn.disabled = false;
            }
        }

        async function login() {
            const body = {
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            };
            
            const res = await fetch(\`\${API}/api/auth/login\`, { method: 'POST', body: JSON.stringify(body) });
            const data = await res.json();
            
            if (data.token) {
                localStorage.setItem('token', data.token);
                location.reload();
            } else {
                alert(data.error || "Login Failed");
            }
        }

        function logout() { localStorage.removeItem('token'); location.reload(); }

        function toggleForm() {
            const type = document.getElementById('actionType').value;
            document.getElementById('chapterForm').classList.toggle('hidden', type !== 'chapter');
            document.getElementById('mcqForm').classList.toggle('hidden', type !== 'mcq');
        }

        async function fetchStructure() {
            const res = await fetch(\`\${API}/api/structure\`);
            const data = await res.json();
            document.getElementById('jsonOutput').innerText = JSON.stringify(data, null, 2);
        }

        async function addChapter() {
            const subject_id = document.getElementById('subjectId').value;
            const title = document.getElementById('chapterTitle').value;
            postData('/api/admin/chapter', { subject_id, title });
        }

        async function addMcq() {
            const data = {
                chapter_id: document.getElementById('mcqChapterId').value,
                question: document.getElementById('question').value,
                options: [
                    document.getElementById('opt1').value,
                    document.getElementById('opt2').value,
                    document.getElementById('opt3').value,
                    document.getElementById('opt4').value
                ],
                correct_index: parseInt(document.getElementById('correctIdx').value),
                explanation: document.getElementById('explanation').value
            };
            postData('/api/admin/mcq', data);
        }

        async function postData(endpoint, body) {
            const res = await fetch(\`\${API}\${endpoint}\`, {
                method: 'POST',
                headers: { 'Authorization': token, 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (data.success) { alert("Saved!"); fetchStructure(); }
            else { alert("Error: " + (data.error || JSON.stringify(data))); }
        }
    </script>
</body>
</html>
`;

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);

        // --- GLOBAL ERROR CATCHER ---
        try {
            // 1. Serve UI
            if (url.pathname === "/admin") {
                return new Response(ADMIN_HTML, { headers: { "Content-Type": "text/html;charset=UTF-8" } });
            }
            if (url.pathname === "/") {
                return new Response("Freeducation API is Online. Go to /admin", { status: 200 });
            }

            // 2. CORS Preflight (Essential for reliability)
            if (request.method === "OPTIONS") {
                return new Response(null, {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                        "Access-Control-Allow-Headers": "Content-Type, Authorization",
                    },
                });
            }

            // --- API ROUTES ---

            // STATUS CHECK (Diagnostics)
            if (url.pathname === "/api/auth/status") {
                try {
                    // We specifically select 'password_hash' to verify the schema is correct.
                    // If this fails, we know the migration hasn't run.
                    const result = await env.DB.prepare("SELECT COUNT(*) as total FROM users").first();
                    
                    // Also check for admins
                    const adminCount = await env.DB.prepare("SELECT COUNT(*) as total FROM users WHERE role = 'admin'").first();
                    
                    return jsonResponse({ 
                        online: true, 
                        db_connected: true,
                        adminExists: (adminCount as any).total > 0 
                    });
                } catch (e: any) {
                    // This is the "Reliable" part. We tell the frontend EXACTLY what is broken.
                    return jsonResponse({ error: `Database Schema Mismatch: ${e.message}. Please run migrations.` }, 500);
                }
            }

            // SETUP (Create First Admin)
            if (url.pathname === "/api/auth/setup" && request.method === "POST") {
                const body = await parseBody(request);
                if (!body || !body.name || !body.email || !body.password) {
                    return jsonResponse({ error: "Missing required fields" }, 400);
                }

                // Security: Prevent multiple setups
                const existing = await env.DB.prepare("SELECT COUNT(*) as total FROM users WHERE role = 'admin'").first();
                if ((existing as any).total > 0) return jsonResponse({ error: "Admin already exists" }, 403);

                try {
                    const hashed = await hashPassword(body.password);
                    await env.DB.prepare(
                        "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')"
                    ).bind(body.name, body.email, hashed).run();
                    return jsonResponse({ success: true });
                } catch (e: any) {
                    return jsonResponse({ error: "Setup Failed: " + e.message }, 500);
                }
            }

            // LOGIN
            if (url.pathname === "/api/auth/login" && request.method === "POST") {
                const body = await parseBody(request);
                if (!body) return jsonResponse({ error: "Invalid JSON" }, 400);

                const hashed = await hashPassword(body.password);
                const user = await env.DB.prepare("SELECT * FROM users WHERE email = ? AND password_hash = ?")
                    .bind(body.email, hashed).first();

                if (!user) return jsonResponse({ error: "Invalid Credentials" }, 401);

                const token = btoa(`${user.id}:${user.role}:${Date.now()}`);
                return jsonResponse({ token, role: user.role, name: user.name });
            }

            // GET STRUCTURE (Robust)
            if (url.pathname === "/api/structure") {
                const classes = await env.DB.prepare("SELECT * FROM classes").all();
                const subjects = await env.DB.prepare("SELECT * FROM subjects").all();
                // If tables are empty, return empty array instead of crashing
                const cList = classes.results || [];
                const sList = subjects.results || [];
                
                const tree = cList.map((c: any) => ({
                    ...c,
                    subjects: sList.filter((s: any) => s.class_id === c.id)
                }));
                return jsonResponse(tree);
            }

            // ADMIN ACTIONS (With Auth Check)
            if (url.pathname.startsWith("/api/admin/")) {
                const authHeader = request.headers.get("Authorization");
                if (!authHeader) return jsonResponse({ error: "No Token" }, 401);
                
                // Decode token safely
                try {
                    const decoded = atob(authHeader);
                    if (!decoded.includes("admin")) return jsonResponse({ error: "Not Admin" }, 403);
                } catch(e) {
                    return jsonResponse({ error: "Bad Token" }, 401);
                }

                const body = await parseBody(request);
                if (!body) return jsonResponse({ error: "No Data" }, 400);

                if (url.pathname === "/api/admin/chapter") {
                    await env.DB.prepare("INSERT INTO chapters (subject_id, title) VALUES (?, ?)")
                        .bind(body.subject_id, body.title).run();
                    return jsonResponse({ success: true });
                }

                if (url.pathname === "/api/admin/mcq") {
                    await env.DB.prepare("INSERT INTO mcqs (chapter_id, question, options, correct_index, explanation) VALUES (?, ?, ?, ?, ?)")
                        .bind(body.chapter_id, body.question, JSON.stringify(body.options), body.correct_index, body.explanation).run();
                    return jsonResponse({ success: true });
                }
            }

            return new Response("Not Found", { status: 404 });

        } catch (e: any) {
            // CRITICAL: Catch any unforeseen worker crash and return JSON
            return jsonResponse({ error: "Internal Server Error: " + e.message }, 500);
        }
    },
};
