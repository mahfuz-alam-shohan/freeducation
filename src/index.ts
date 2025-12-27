export interface Env {
    DB: D1Database;
    BUCKET: R2Bucket;
    JWT_SECRET: string;
}

// --- UTILS: SECURITY ---
async function hashPassword(password: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
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
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; background: #f8fafc; color: #334155; }
        .card { background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); margin-bottom: 25px; border: 1px solid #e2e8f0; }
        h1, h2 { color: #0f172a; margin-top: 0; }
        .input-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: 600; font-size: 0.9rem; color: #475569; }
        input, select, textarea { width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; box-sizing: border-box; font-size: 15px; transition: border 0.2s, box-shadow 0.2s; }
        input:focus, select:focus, textarea:focus { border-color: #3b82f6; outline: none; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2); }
        button { background: #2563eb; color: white; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; width: 100%; font-size: 1rem; transition: background 0.2s; }
        button:hover { background: #1d4ed8; }
        .hidden { display: none !important; }
        .status-bar { padding: 12px 20px; margin-bottom: 20px; border-radius: 8px; background: #eff6ff; color: #1e40af; display: flex; justify-content: space-between; align-items: center; border: 1px solid #dbeafe; }
        .alert { padding: 15px; background: #fee2e2; color: #991b1b; border-radius: 8px; margin-bottom: 20px; text-align: center; border: 1px solid #fecaca; font-weight: 500; }
        pre { background: #1e293b; color: #e2e8f0; padding: 20px; border-radius: 8px; overflow-x: auto; font-size: 13px; font-family: 'Menlo', 'Monaco', 'Courier New', monospace; }
        .btn-logout { width: auto; padding: 6px 15px; font-size: 13px; background: #ef4444; }
        .btn-refresh { width: auto; background: #64748b; padding: 8px 16px; font-size: 13px; }
    </style>
</head>
<body>
    <div id="app">
        <h1 style="text-align: center; margin-bottom: 30px;">🎓 Freeducation Engine</h1>

        <!-- Loading State -->
        <div id="loading" style="text-align: center; padding: 40px;">
            <div style="font-size: 1.2rem; font-weight: 600;">Checking System Integrity...</div>
        </div>

        <!-- 1. SETUP SECTION (First Run Only) -->
        <div id="setupSection" class="card hidden">
            <h2 style="text-align: center;">🚀 Initialize Platform</h2>
            <div class="alert">System is fresh. Create the Root Administrator.</div>
            
            <div class="input-group">
                <label>Admin Name</label>
                <input type="text" id="setupName" placeholder="e.g. Mahfuz Alam">
            </div>
            <div class="input-group">
                <label>Admin Email</label>
                <input type="email" id="setupEmail" placeholder="admin@freeducation.com">
            </div>
            <div class="input-group">
                <label>Create Secure Password</label>
                <input type="password" id="setupPass" placeholder="Strong password">
            </div>
            <button onclick="performSetup()">Create Super Admin</button>
        </div>

        <!-- 2. LOGIN SECTION -->
        <div id="loginSection" class="card hidden">
            <h2 style="text-align: center;">🔐 Admin Access</h2>
            <div class="input-group">
                <label>Email</label>
                <input type="email" id="email">
            </div>
            <div class="input-group">
                <label>Password</label>
                <input type="password" id="password">
            </div>
            <button onclick="login()">Enter Dashboard</button>
        </div>

        <!-- 3. DASHBOARD SECTION -->
        <div id="dashboardSection" class="hidden">
            <div id="statusBar" class="status-bar">
                <span>👤 <strong id="adminName">Admin</strong></span>
                <button onclick="logout()" class="btn-logout">Logout</button>
            </div>
            
            <div class="card">
                <h2>📝 Content Manager</h2>
                <div class="input-group">
                    <label>Action</label>
                    <select id="actionType" onchange="toggleForm()">
                        <option value="chapter">Create New Chapter</option>
                        <option value="mcq">Add MCQ Question</option>
                    </select>
                </div>

                <div id="chapterForm">
                    <div class="input-group">
                        <input type="number" id="subjectId" placeholder="Subject ID (See Reference Below)">
                    </div>
                    <div class="input-group">
                        <input type="text" id="chapterTitle" placeholder="Chapter Title">
                    </div>
                    <button onclick="addChapter()">Create Chapter</button>
                </div>

                <div id="mcqForm" class="hidden">
                    <div class="input-group">
                        <input type="number" id="mcqChapterId" placeholder="Chapter ID">
                    </div>
                    <div class="input-group">
                        <textarea id="question" rows="3" placeholder="Question Text"></textarea>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                        <input type="text" id="opt1" placeholder="Option A">
                        <input type="text" id="opt2" placeholder="Option B">
                        <input type="text" id="opt3" placeholder="Option C">
                        <input type="text" id="opt4" placeholder="Option D">
                    </div>
                    <div class="input-group">
                        <label>Correct Answer</label>
                        <select id="correctIdx">
                            <option value="0">Option A</option>
                            <option value="1">Option B</option>
                            <option value="2">Option C</option>
                            <option value="3">Option D</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <input type="text" id="explanation" placeholder="Explanation (Optional)">
                    </div>
                    <button onclick="addMcq()">Save Question</button>
                </div>
            </div>

            <div class="card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h2 style="margin: 0;">📚 Database Reference</h2>
                    <button onclick="fetchStructure()" class="btn-refresh">Refresh Data</button>
                </div>
                <pre id="jsonOutput">Loading data...</pre>
            </div>
        </div>
    </div>

    <script>
        const API_URL = window.location.origin;
        let token = localStorage.getItem('admin_token');

        // --- INIT ---
        window.onload = async () => {
            try {
                const res = await fetch(\`\${API_URL}/api/auth/status\`);
                // Robustness: Handle non-JSON responses (fatal errors)
                if (!res.ok) throw new Error(\`Server returned \${res.status}\`);
                
                const status = await res.json();
                document.getElementById('loading').classList.add('hidden');
                
                if (status.error) {
                    alert("System Critical Error: " + status.error);
                    return;
                }

                if (!status.adminExists) {
                    document.getElementById('setupSection').classList.remove('hidden');
                } else if (token) {
                    // Validate token isn't expired/fake by trying to fetch structure
                    showDashboard();
                } else {
                    document.getElementById('loginSection').classList.remove('hidden');
                }
            } catch (e) {
                document.getElementById('loading').innerHTML = \`
                    <div style="color:red">Connection Failed</div>
                    <small>\${e.message}</small>
                \`;
            }
        };

        // --- ACTIONS ---

        async function performSetup() {
            const name = document.getElementById('setupName').value;
            const email = document.getElementById('setupEmail').value;
            const password = document.getElementById('setupPass').value;

            if(!name || !email || !password) return alert("Please fill all fields");

            document.querySelector('#setupSection button').disabled = true;
            document.querySelector('#setupSection button').innerText = "Creating...";

            try {
                const res = await fetch(\`\${API_URL}/api/auth/setup\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });
                const data = await res.json();

                if (data.success) {
                    alert("✅ Setup Complete! You can now login.");
                    location.reload();
                } else {
                    alert("❌ Setup Failed: " + (data.error || "Unknown Error"));
                    document.querySelector('#setupSection button').disabled = false;
                }
            } catch (e) {
                alert("Network Error: " + e.message);
            }
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
                
                if (data.token) {
                    token = data.token;
                    localStorage.setItem('admin_token', token);
                    document.getElementById('adminName').innerText = data.name;
                    showDashboard();
                } else {
                    alert("Login Failed: " + (data.error || "Check credentials"));
                }
            } catch (e) {
                alert("Login Error: " + e.message);
            }
        }

        function logout() {
            localStorage.removeItem('admin_token');
            location.reload();
        }

        function showDashboard() {
            document.getElementById('setupSection').classList.add('hidden');
            document.getElementById('loginSection').classList.add('hidden');
            document.getElementById('dashboardSection').classList.remove('hidden');
            fetchStructure();
        }

        async function fetchStructure() {
            try {
                const res = await fetch(\`\${API_URL}/api/structure\`);
                const data = await res.json();
                document.getElementById('jsonOutput').innerText = JSON.stringify(data, null, 2);
            } catch (e) {
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
            await authenticatedPost('/api/admin/mcq', { chapter_id, question, options, correct_index, explanation });
        }

        async function authenticatedPost(endpoint, body) {
            const res = await fetch(\`\${API_URL}\${endpoint}\`, {
                method: 'POST',
                headers: { 'Authorization': token, 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (data.success) {
                alert("✅ Success!");
                fetchStructure();
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
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
    });

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);

        // Serve UI
        if (url.pathname === "/admin") {
            return new Response(ADMIN_HTML, { headers: { "Content-Type": "text/html;charset=UTF-8" } });
        }
        if (url.pathname === "/") {
            return new Response("Freeducation API Online. <a href='/admin'>Go to Admin</a>", { 
                headers: { "Content-Type": "text/html" } 
            });
        }
        if (request.method === "OPTIONS") {
            return new Response(null, { headers: { "Access-Control-Allow-Origin": "*" } });
        }

        // --- AUTH API ---

        // 1. Check Status
        if (url.pathname === "/api/auth/status") {
            try {
                // We use a query that fails if the table doesn't exist to catch schema errors early
                const count = await env.DB.prepare("SELECT COUNT(*) as total FROM users WHERE role = 'admin'").first();
                return jsonResponse({ adminExists: (count as any).total > 0 });
            } catch (e: any) {
                // Return the DB error to the frontend so we know if migration failed
                return jsonResponse({ adminExists: false, error: "Database Error: " + e.message });
            }
        }

        // 2. Setup (Create First Admin)
        if (url.pathname === "/api/auth/setup" && request.method === "POST") {
            try {
                // Double check to prevent race conditions
                const count = await env.DB.prepare("SELECT COUNT(*) as total FROM users WHERE role = 'admin'").first();
                if ((count as any).total > 0) {
                    return jsonResponse({ error: "System already initialized" }, 403);
                }

                const { name, email, password } = await request.json() as any;
                const hashed = await hashPassword(password);

                await env.DB.prepare(
                    "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')"
                ).bind(name, email, hashed).run();
                
                return jsonResponse({ success: true });
            } catch (e: any) {
                // CRITICAL: Return the exact error message (e.g., "Table users has no column password_hash")
                return jsonResponse({ error: e.message }, 500);
            }
        }

        // 3. Login
        if (url.pathname === "/api/auth/login" && request.method === "POST") {
            try {
                const { email, password } = await request.json() as any;
                const hashed = await hashPassword(password);
                
                const user = await env.DB.prepare("SELECT * FROM users WHERE email = ? AND password_hash = ?")
                    .bind(email, hashed).first();

                if (!user) return jsonResponse({ error: "Invalid credentials" }, 401);

                const token = btoa(`${user.id}:${user.role}:${Date.now()}`); 
                return jsonResponse({ token, role: user.role, name: user.name });
            } catch(e: any) {
                return jsonResponse({ error: "Login Error: " + e.message }, 500);
            }
        }

        // --- PUBLIC DATA ---
        if (url.pathname === "/api/structure") {
            try {
                const classes = await env.DB.prepare("SELECT * FROM classes").all();
                const subjects = await env.DB.prepare("SELECT * FROM subjects").all();
                const tree = classes.results.map((c: any) => ({
                    ...c,
                    subjects: subjects.results.filter((s: any) => s.class_id === c.id)
                }));
                return jsonResponse(tree);
            } catch (e: any) {
                return jsonResponse({ error: "Structure Error: " + e.message }, 500);
            }
        }

        // --- PROTECTED ADMIN ROUTES ---
        if (url.pathname.startsWith("/api/admin/")) {
            const authHeader = request.headers.get("Authorization");
            const isAdmin = authHeader && atob(authHeader).includes("admin");

            if (!isAdmin) return jsonResponse({ error: "Unauthorized" }, 403);

            try {
                if (url.pathname === "/api/admin/chapter" && request.method === "POST") {
                    const { subject_id, title } = await request.json() as any;
                    await env.DB.prepare("INSERT INTO chapters (subject_id, title) VALUES (?, ?)").bind(subject_id, title).run();
                    return jsonResponse({ success: true });
                }

                if (url.pathname === "/api/admin/mcq" && request.method === "POST") {
                    const { chapter_id, question, options, correct_index, explanation } = await request.json() as any;
                    await env.DB.prepare("INSERT INTO mcqs (chapter_id, question, options, correct_index, explanation) VALUES (?, ?, ?, ?, ?)")
                        .bind(chapter_id, question, JSON.stringify(options), correct_index, explanation).run();
                    return jsonResponse({ success: true });
                }
            } catch(e: any) {
                return jsonResponse({ error: "DB Error: " + e.message }, 500);
            }
        }

        return new Response("Not Found", { status: 404 });
    },
};
