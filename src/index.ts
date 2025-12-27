export interface Env {
    DB: D1Database;
    BUCKET: R2Bucket;
    JWT_SECRET: string;
}

// --- SQL DEFINITIONS FOR SELF-REPAIR ---
const REPAIR_SQL = [
    // 1. Users
    "DROP TABLE IF EXISTS users;",
    "CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, name TEXT NOT NULL, role TEXT DEFAULT 'student', class_level TEXT, created_at INTEGER DEFAULT (unixepoch()));",
    
    // 2. Classes
    "CREATE TABLE IF NOT EXISTS classes (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL);",
    
    // 3. Subjects
    "CREATE TABLE IF NOT EXISTS subjects (id INTEGER PRIMARY KEY AUTOINCREMENT, class_id INTEGER NOT NULL, name TEXT NOT NULL, group_type TEXT DEFAULT 'common', icon TEXT, FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE);",
    
    // 4. Chapters
    "CREATE TABLE IF NOT EXISTS chapters (id INTEGER PRIMARY KEY AUTOINCREMENT, subject_id INTEGER NOT NULL, title TEXT NOT NULL, sort_order INTEGER DEFAULT 0, FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE);",
    
    // 5. MCQs
    "CREATE TABLE IF NOT EXISTS mcqs (id INTEGER PRIMARY KEY AUTOINCREMENT, chapter_id INTEGER NOT NULL, question TEXT NOT NULL, options TEXT NOT NULL, correct_index INTEGER NOT NULL, explanation TEXT, FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE);",

    // 6. Seed Data
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
    new Response(JSON.stringify(data), {
        status,
        headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
    });

// --- EMBEDDED UI ---
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
        .hidden { display: none !important; }
        .alert { padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center; font-weight: 500; }
        .alert-error { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
        .repair-btn { background: #b91c1c; margin-top: 15px; }
    </style>
</head>
<body>
    <div id="app">
        <h1 style="text-align: center;">🎓 Freeducation Panel</h1>

        <!-- System Diagnostics -->
        <div id="diagnostics" class="card hidden" style="border-left: 5px solid #ef4444;">
            <h3 style="margin-top:0; color:#b91c1c">System Failure Detected</h3>
            <p id="errorMsg"></p>
            <button onclick="repairSystem()" class="repair-btn">🛠️ Click to Repair Database Automatically</button>
        </div>

        <!-- Setup Section -->
        <div id="setupSection" class="card hidden">
            <h2 style="text-align: center;">🚀 First Time Setup</h2>
            <div class="alert" style="background: #dcfce7; color: #166534;">Database connected. Create Admin.</div>
            <label>Full Name</label>
            <input type="text" id="setupName">
            <label>Email Address</label>
            <input type="email" id="setupEmail">
            <label>Secure Password</label>
            <input type="password" id="setupPass">
            <button onclick="performSetup()">Initialize System</button>
        </div>

        <!-- Login Section -->
        <div id="loginSection" class="card hidden">
            <h2 style="text-align: center;">🔐 Admin Login</h2>
            <label>Email</label>
            <input type="email" id="email">
            <label>Password</label>
            <input type="password" id="password">
            <button onclick="login()">Login</button>
        </div>

        <!-- Dashboard -->
        <div id="dashboardSection" class="hidden">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <span>Logged in as <strong id="adminName">Admin</strong></span>
                <button onclick="logout()" style="width: auto; background: #ef4444; margin: 0;">Logout</button>
            </div>
            <div class="card">
                <h2>Database Structure</h2>
                <pre id="jsonOutput" style="background:#1e293b; color:#e2e8f0; padding:15px; border-radius:8px; overflow:auto;">Loading...</pre>
                <button onclick="fetchStructure()" style="margin-top:10px; background: #64748b;">Refresh Data</button>
            </div>
        </div>
    </div>

    <script>
        const API = window.location.origin;
        let token = localStorage.getItem('token');

        window.onload = async () => {
            try {
                // 1. STATUS CHECK
                const res = await fetch(\`\${API}/api/auth/status\`);
                const status = await res.json();
                
                // CRITICAL: Check if request failed (usually DB error)
                if (!res.ok) {
                    showError(status.error || "Unknown Backend Error");
                    return;
                }

                // 2. ROUTING
                if (!status.adminExists) {
                    showSection('setupSection');
                } else if (token) {
                    showSection('dashboardSection');
                    document.getElementById('adminName').innerText = "Admin";
                    fetchStructure();
                } else {
                    showSection('loginSection');
                }
            } catch (e) {
                showError("Connection Failed: " + e.message);
            }
        };

        function showSection(id) {
            ['setupSection', 'loginSection', 'dashboardSection', 'diagnostics'].forEach(s => {
                document.getElementById(s).classList.add('hidden');
            });
            document.getElementById(id).classList.remove('hidden');
        }

        function showError(msg) {
            showSection('diagnostics');
            document.getElementById('errorMsg').innerText = msg;
        }

        async function repairSystem() {
            if(!confirm("This will attempt to fix the database structure. Continue?")) return;
            
            try {
                const res = await fetch(\`\${API}/api/auth/repair\`, { method: 'POST' });
                const data = await res.json();
                if(data.success) {
                    alert("✅ Repair Successful! Reloading...");
                    location.reload();
                } else {
                    alert("❌ Repair Failed: " + data.error);
                }
            } catch(e) { alert("Network Error: " + e.message); }
        }

        async function performSetup() {
            const body = {
                name: document.getElementById('setupName').value,
                email: document.getElementById('setupEmail').value,
                password: document.getElementById('setupPass').value
            };
            const res = await fetch(\`\${API}/api/auth/setup\`, { method: 'POST', body: JSON.stringify(body) });
            const data = await res.json();
            if (data.success) { alert("Success! Please Login."); location.reload(); }
            else alert(data.error);
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
            } else alert(data.error);
        }

        function logout() { localStorage.removeItem('token'); location.reload(); }

        async function fetchStructure() {
            const res = await fetch(\`\${API}/api/structure\`);
            const data = await res.json();
            document.getElementById('jsonOutput').innerText = JSON.stringify(data, null, 2);
        }
    </script>
</body>
</html>
`;

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);

        // Serve UI
        if (url.pathname === "/admin") return new Response(ADMIN_HTML, { headers: { "Content-Type": "text/html" } });
        if (url.pathname === "/") return new Response("Freeducation API Online. <a href='/admin'>Go to Admin</a>", { headers: { "Content-Type": "text/html" } });

        // CORS
        if (request.method === "OPTIONS") return new Response(null, { headers: { "Access-Control-Allow-Origin": "*" } });

        try {
            // 1. REPAIR ENDPOINT (The Magic Fix)
            if (url.pathname === "/api/auth/repair" && request.method === "POST") {
                const statements = REPAIR_SQL.map(sql => env.DB.prepare(sql));
                await env.DB.batch(statements);
                return jsonResponse({ success: true, message: "Database Repaired" });
            }

            // 2. STATUS CHECK
            if (url.pathname === "/api/auth/status") {
                try {
                    const adminCount = await env.DB.prepare("SELECT COUNT(*) as total FROM users WHERE role = 'admin'").first();
                    return jsonResponse({ adminExists: (adminCount as any).total > 0 });
                } catch (e: any) {
                    // Return 500 with specific error so frontend can show Repair Button
                    return jsonResponse({ error: "Database Missing or Corrupt. (" + e.message + ")" }, 500);
                }
            }

            // 3. SETUP
            if (url.pathname === "/api/auth/setup" && request.method === "POST") {
                const body = await request.json() as any;
                const hashed = await hashPassword(body.password);
                await env.DB.prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')")
                    .bind(body.name, body.email, hashed).run();
                return jsonResponse({ success: true });
            }

            // 4. LOGIN
            if (url.pathname === "/api/auth/login" && request.method === "POST") {
                const body = await request.json() as any;
                const hashed = await hashPassword(body.password);
                const user = await env.DB.prepare("SELECT * FROM users WHERE email = ? AND password_hash = ?").bind(body.email, hashed).first();
                if (!user) return jsonResponse({ error: "Invalid Credentials" }, 401);
                const token = btoa(`${user.id}:${user.role}:${Date.now()}`);
                return jsonResponse({ token, role: user.role, name: user.name });
            }

            // 5. STRUCTURE
            if (url.pathname === "/api/structure") {
                const classes = await env.DB.prepare("SELECT * FROM classes").all();
                return jsonResponse(classes.results);
            }

            return new Response("Not Found", { status: 404 });

        } catch (e: any) {
            return jsonResponse({ error: "Internal Error: " + e.message }, 500);
        }
    },
};
