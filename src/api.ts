import { hashPassword, createToken, verifyToken } from "./auth";
import { initDatabase, resolveContentId } from "./db";
import type { Env, Question } from "./types";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS, PUT, DELETE",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const parseQuestion = (q: any): Question => ({
  ...q,
  options: q.options ? JSON.parse(q.options as string) : [],
  metadata: q.metadata ? JSON.parse(q.metadata as string) : {},
});

export async function handleApiRequest(request: Request, env: Env): Promise<Response | null> {
  const url = new URL(request.url);
  const path = url.pathname;

  if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  // --- GENERIC REQUEST HANDLER (DELETE & UPDATE) ---
  if (path === "/api/request") {
      if (request.method === "DELETE") {
        const { id, type } = await request.json() as any;
        let table = "";
        if (type === 'class') table = "classes";
        else if (type === 'group') table = "groups";
        else if (type === 'subject') table = "subjects";
        else if (type === 'chapter') table = "chapters";
        else if (type === 'topic') table = "topics";
        else if (type === 'question') table = "questions";

        if (table) {
            await env.DB.prepare(`DELETE FROM ${table} WHERE id = ?`).bind(id).run();
            return Response.json({ success: true }, { headers: corsHeaders });
        }
        return Response.json({ success: false, error: "Invalid type" }, { status: 400, headers: corsHeaders });
      }
      
      if (request.method === "PUT") {
          const { id, type, value } = await request.json() as any;
          let table = "";
          let field = "name";

          if (type === 'class') { table = "classes"; field = "name"; }
          else if (type === 'group') { table = "groups"; field = "name"; }
          else if (type === 'subject') { table = "subjects"; field = "name"; }
          else if (type === 'chapter') { table = "chapters"; field = "title"; }
          else if (type === 'topic') { table = "topics"; field = "title"; }

          if (table) {
              await env.DB.prepare(`UPDATE ${table} SET ${field} = ? WHERE id = ?`).bind(value, id).run();
              return Response.json({ success: true }, { headers: corsHeaders });
          }
          return Response.json({ success: false, error: "Invalid type" }, { status: 400, headers: corsHeaders });
      }
  }

  // 1. SYSTEM INITIALIZATION
  if (path === "/api/init" && request.method === "POST") {
    try {
      await initDatabase(env.DB);
      return Response.json({ success: true, message: "Database initialized" }, { headers: corsHeaders });
    } catch (e: any) {
      return Response.json({ success: false, error: e.message }, { status: 500, headers: corsHeaders });
    }
  }

  if (path === "/api/setup-status") {
    const result = await env.DB.prepare("SELECT count(*) as count FROM admins").first();
    return Response.json({ hasAdmin: (result?.count as number) > 0 }, { headers: corsHeaders });
  }

  // 2. AUTHENTICATION
  if (path === "/api/register-admin" && request.method === "POST") {
    const { username, password } = await request.json() as any;
    const count = await env.DB.prepare("SELECT count(*) as count FROM admins").first();
    if ((count?.count as number) > 0) return Response.json({ success: false, error: "Admin already exists" }, { status: 403, headers: corsHeaders });

    const salt = crypto.getRandomValues(new Uint8Array(16));
    const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
    const hash = await hashPassword(password, saltHex);
    await env.DB.prepare("INSERT INTO admins (username, password_hash) VALUES (?, ?)").bind(username, `${saltHex}:${hash}`).run();
    return Response.json({ success: true }, { headers: corsHeaders });
  }

  if (path === "/api/login" && request.method === "POST") {
    const { username, password } = await request.json() as any;
    const user = await env.DB.prepare("SELECT * FROM admins WHERE username = ?").bind(username).first();
    if (!user) return Response.json({ success: false, error: "Invalid credentials" }, { status: 401, headers: corsHeaders });

    const [saltHex, originalHash] = (user.password_hash as string).split(':');
    const hash = await hashPassword(password, saltHex);
    if (hash !== originalHash) return Response.json({ success: false, error: "Invalid credentials" }, { status: 401, headers: corsHeaders });

    const token = await createToken({ username: user.username, id: user.id }, env.JWT_SECRET || "default");
    return Response.json({ success: true, username: user.username, token }, { headers: corsHeaders });
  }

  if (path === "/api/me" && request.method === "GET") {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) return Response.json({ user: null }, { headers: corsHeaders });
    const payload = await verifyToken(authHeader.split(" ")[1], env.JWT_SECRET || "default");
    return Response.json({ user: payload ? { username: payload.username } : null }, { headers: corsHeaders });
  }

  // 3. DATA ENDPOINTS
  if (path === "/api/classes") {
    if (request.method === "GET") {
      const classes = await env.DB.prepare(`SELECT c.*, p.name as parent_name FROM classes c LEFT JOIN classes p ON c.parent_class_id = p.id ORDER BY c.created_at DESC`).all();
      return Response.json(classes.results, { headers: corsHeaders });
    }
    if (request.method === "POST") {
      const { name } = await request.json() as any;
      await env.DB.prepare("INSERT INTO classes (name) VALUES (?)").bind(name).run();
      return Response.json({ success: true }, { headers: corsHeaders });
    }
    if (request.method === "PUT") {
      const { id, parent_class_id, program_label } = await request.json() as any;
      await env.DB.prepare("UPDATE classes SET parent_class_id = ?, program_label = ? WHERE id = ?").bind(parent_class_id || null, program_label || null, id).run();
      return Response.json({ success: true }, { headers: corsHeaders });
    }
  }

  if (path === "/api/groups") {
    if (request.method === "GET") {
      const { class_id } = Object.fromEntries(url.searchParams);
      const sourceId = await resolveContentId(env.DB, class_id);
      const groups = await env.DB.prepare("SELECT * FROM groups WHERE class_id = ?").bind(sourceId).all();
      return Response.json(groups.results, { headers: corsHeaders });
    }
    if (request.method === "POST") {
      const { name, class_id } = await request.json() as any;
      const sourceId = await resolveContentId(env.DB, class_id);
      await env.DB.prepare("INSERT INTO groups (name, class_id) VALUES (?, ?)").bind(name, sourceId).run();
      return Response.json({ success: true }, { headers: corsHeaders });
    }
  }

  if (path === "/api/subjects") {
    if (request.method === "GET") {
      const { class_id } = Object.fromEntries(url.searchParams);
      const sourceId = await resolveContentId(env.DB, class_id);
      const subjects = await env.DB.prepare("SELECT * FROM subjects WHERE class_id = ?").bind(sourceId).all();
      return Response.json(subjects.results.map((s: any) => ({ ...s, is_common: !!s.is_common })), { headers: corsHeaders });
    }
    if (request.method === "POST") {
      const { name, class_id, is_common, group_id } = await request.json() as any;
      const sourceId = await resolveContentId(env.DB, class_id);
      await env.DB.prepare("INSERT INTO subjects (name, class_id, is_common, group_id) VALUES (?, ?, ?, ?)").bind(name, sourceId, is_common ? 1 : 0, group_id || null).run();
      return Response.json({ success: true }, { headers: corsHeaders });
    }
  }

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

  if (path === "/api/topics") {
    if (request.method === "GET") {
      const { chapter_id } = Object.fromEntries(url.searchParams);
      const topics = await env.DB.prepare("SELECT * FROM topics WHERE chapter_id = ? ORDER BY order_num ASC").bind(chapter_id).all();
      return Response.json(topics.results, { headers: corsHeaders });
    }
    if (request.method === "POST") {
      const { id, title, chapter_id, content, order_num } = await request.json() as any;
      if (id) {
           await env.DB.prepare("UPDATE topics SET title=?, content=?, order_num=? WHERE id=?").bind(title, content, order_num, id).run();
      } else {
           await env.DB.prepare("INSERT INTO topics (title, chapter_id, content, order_num) VALUES (?, ?, ?, ?)").bind(title, chapter_id, content, order_num).run();
      }
      return Response.json({ success: true }, { headers: corsHeaders });
    }
  }

  if (path === "/api/questions") {
    if (request.method === "GET") {
      const { topic_id } = Object.fromEntries(url.searchParams);
      const questions = await env.DB.prepare("SELECT * FROM questions WHERE topic_id = ?").bind(topic_id).all();
      return Response.json(questions.results.map(parseQuestion), { headers: corsHeaders });
    }
    if (request.method === "POST") {
      const { type, topic_id, question_text, options, answer, metadata } = await request.json() as any;
      await env.DB.prepare("INSERT INTO questions (type, topic_id, question_text, options, answer, metadata) VALUES (?, ?, ?, ?, ?, ?)").bind(type, topic_id, question_text, JSON.stringify(options), answer, JSON.stringify(metadata)).run();
      return Response.json({ success: true }, { headers: corsHeaders });
    }
  }

  if (path === "/api/search") {
    const { q } = Object.fromEntries(url.searchParams);
    const term = `%${q}%`;
    const results = await env.DB.batch([
      env.DB.prepare("SELECT id, name as title, 'subject' as type FROM subjects WHERE name LIKE ? LIMIT 5").bind(term),
      env.DB.prepare("SELECT id, title, 'chapter' as type FROM chapters WHERE title LIKE ? LIMIT 5").bind(term),
      env.DB.prepare("SELECT id, title, 'topic' as type FROM topics WHERE title LIKE ? LIMIT 5").bind(term)
    ]);
    return Response.json([...results[0].results, ...results[1].results, ...results[2].results], { headers: corsHeaders });
  }

  if (path === "/api/reset-db" && request.method === "POST") {
    await env.DB.batch([
      env.DB.prepare("DROP TABLE IF EXISTS questions"),
      env.DB.prepare("DROP TABLE IF EXISTS topics"),
      env.DB.prepare("DROP TABLE IF EXISTS chapters"),
      env.DB.prepare("DROP TABLE IF EXISTS subjects"),
      env.DB.prepare("DROP TABLE IF EXISTS groups"),
      env.DB.prepare("DROP TABLE IF EXISTS classes"),
      env.DB.prepare("DROP TABLE IF EXISTS admins")
    ]);
    await initDatabase(env.DB);
    return Response.json({ success: true, message: "System Reset" }, { headers: corsHeaders });
  }

  return null;
}


