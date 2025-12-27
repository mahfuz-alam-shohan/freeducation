export interface Env {
    DB: D1Database;
    BUCKET: R2Bucket;
    JWT_SECRET: string; // Set this in wrangler.toml [vars]
}

// Simple Response Helper
const jsonResponse = (data: any, status = 200) => 
    new Response(JSON.stringify(data), {
        status,
        headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
        }
    });

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);
        
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

        // 1. Login (Admin or Student)
        if (url.pathname === "/api/auth/login" && request.method === "POST") {
            const { email, password } = await request.json() as any;
            // In production, use bcrypt. Here we do simple check for demo.
            const user = await env.DB.prepare("SELECT * FROM users WHERE email = ? AND password_hash = ?")
                .bind(email, password).first();

            if (!user) return jsonResponse({ error: "Invalid credentials" }, 401);

            // Create a simple session token (In real app, sign a JWT)
            const token = btoa(`${user.id}:${user.role}:${Date.now()}`); 

            return jsonResponse({ token, role: user.role, name: user.name });
        }

        // 2. Register (Student Only)
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

        // --- PUBLIC / STUDENT ROUTES (Read Only) ---

        // Get Structure (Classes -> Subjects)
        if (url.pathname === "/api/structure" && request.method === "GET") {
            const classes = await env.DB.prepare("SELECT * FROM classes").all();
            const subjects = await env.DB.prepare("SELECT * FROM subjects").all();
            
            const tree = classes.results.map((c: any) => ({
                ...c,
                subjects: subjects.results.filter((s: any) => s.class_id === c.id)
            }));
            return jsonResponse(tree);
        }

        // Get Chapter Content
        if (url.pathname.startsWith("/api/chapter/") && request.method === "GET") {
            const chapterId = url.pathname.split("/").pop();
            const materials = await env.DB.prepare("SELECT * FROM materials WHERE chapter_id = ?").bind(chapterId).all();
            const mcqs = await env.DB.prepare("SELECT id, question, options, explanation FROM mcqs WHERE chapter_id = ?").bind(chapterId).all();
            
            // Parse JSON options for frontend
            const formattedMcqs = mcqs.results.map((m: any) => ({
                ...m,
                options: JSON.parse(m.options)
            }));

            return jsonResponse({ materials: materials.results, mcqs: formattedMcqs });
        }

        // --- ADMIN ROUTES (Protected) ---
        // Basic security check: Header must contain "admin" (Expand this with real JWT verify)
        
        const authHeader = request.headers.get("Authorization");
        const isAdmin = authHeader && atob(authHeader).includes("admin");

        if (url.pathname.startsWith("/api/admin/")) {
            if (!isAdmin) return jsonResponse({ error: "Unauthorized" }, 403);

            // Add Subject
            if (url.pathname === "/api/admin/subject" && request.method === "POST") {
                const { class_id, name, group_type, icon } = await request.json() as any;
                await env.DB.prepare("INSERT INTO subjects (class_id, name, group_type, icon) VALUES (?, ?, ?, ?)")
                    .bind(class_id, name, group_type, icon).run();
                return jsonResponse({ success: true });
            }

            // Add Chapter
            if (url.pathname === "/api/admin/chapter" && request.method === "POST") {
                const { subject_id, title } = await request.json() as any;
                await env.DB.prepare("INSERT INTO chapters (subject_id, title) VALUES (?, ?)")
                    .bind(subject_id, title).run();
                return jsonResponse({ success: true });
            }

            // Add MCQ
            if (url.pathname === "/api/admin/mcq" && request.method === "POST") {
                const { chapter_id, question, options, correct_index, explanation } = await request.json() as any;
                await env.DB.prepare("INSERT INTO mcqs (chapter_id, question, options, correct_index, explanation) VALUES (?, ?, ?, ?, ?)")
                    .bind(chapter_id, question, JSON.stringify(options), correct_index, explanation).run();
                return jsonResponse({ success: true });
            }
            
            // Upload Material (Metadata only - file goes to R2 separately)
            if (url.pathname === "/api/admin/material" && request.method === "POST") {
                const { chapter_id, title, type, content_url } = await request.json() as any;
                await env.DB.prepare("INSERT INTO materials (chapter_id, title, type, content_url) VALUES (?, ?, ?, ?)")
                    .bind(chapter_id, title, type, content_url).run();
                return jsonResponse({ success: true });
            }
        }

        return new Response("Not Found", { status: 404 });
    },
};
