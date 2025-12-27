import { appConfig } from "./config";
import * as DB from "./db";
import * as Admin from "./admin";
import * as Student from "./student";
import * as Security from "./security";
import { layout } from "./templates"; // Import layout to wrap errors

const html = (body: string, status = 200) => new Response(body, { status, headers: { "Content-Type": "text/html; charset=utf-8" } });
const redirect = (loc: string) => new Response(null, { status: 302, headers: { Location: loc } });

// Helper to render beautiful error pages instead of raw text
const renderError = (title: string, msg: string, code = 500) => {
  return html(layout(title, `
    <div class="error-container">
      <div class="error-icon">⚠️</div>
      <h1 class="error-title">${title}</h1>
      <p class="error-msg">${msg}</p>
      <a href="/" class="btn-primary" style="margin-top:24px; width:auto; display:inline-flex;">Return Home</a>
    </div>
  `), code);
};

export default {
  async fetch(req: Request, env: DB.Env): Promise<Response> {
    const url = new URL(req.url);
    const path = url.pathname;

    try {
      await DB.ensureClassLinkColumn(env.DB);
      // --- PUBLIC ---
      if (path === "/") {
        const [h, f] = await Promise.all([DB.getHierarchy(env.DB), DB.getFeaturedCards(env.DB)]);
        const q = Object.fromEntries(url.searchParams);
        return html(Student.renderStudentHome({...h, featuredCards: f}, q));
      }
      
      if (path === "/smart-filter") {
         const query = Object.fromEntries(url.searchParams);
         const questions = await DB.listQuestionsFiltered(env.DB, query);
         return html(Student.renderResults(questions, query));
      }

      // --- ADMIN ---
      if (path.startsWith("/admin")) {
        // Auth Check
        const cookie = req.headers.get("Cookie")?.match(/freeducation_session=([^;]+)/)?.[1];
        let user = null;
        if (cookie) user = await DB.getUserFromSession(env.DB, await Security.sha256(cookie));
        
        // Login Page
        if (path === "/admin/login") {
           const adminCount = await DB.getAdminCount(env.DB);
           if (req.method === "POST") {
             const fd = await req.formData();
             const email = fd.get("email") as string;
             const pw = fd.get("password") as string;
             
             let u: any = null;
             if (adminCount === 0) {
               u = await DB.createAdmin(env.DB, email, await Security.createPasswordHash(pw));
             } else {
               const exist = await DB.getUserByEmail(env.DB, email);
               if (exist && await Security.verifyPassword(pw, exist.passwordHash)) u = exist;
             }
             
             if (u) {
               const tok = Security.randomToken(32);
               await DB.createSession(env.DB, u.id, await Security.sha256(tok));
               return new Response(null, { status: 302, headers: { Location: "/admin", "Set-Cookie": `freeducation_session=${tok}; HttpOnly; Path=/` }});
             }
             return html(Admin.renderLogin({error: "Invalid Credentials"}));
           }
           if (user) return redirect("/admin");
           return html(Admin.renderLogin({isFirst: adminCount===0}));
        }
        
        if (path === "/admin/logout") {
          return new Response(null, { status: 302, headers: { Location: "/", "Set-Cookie": "freeducation_session=; HttpOnly; Path=/; Max-Age=0" }});
        }

        if (!user) return redirect("/admin/login");

        // Admin Actions
        if (req.method === "POST") {
          const fd = await req.formData();
          const p = Object.fromEntries(fd);
          
          if (path === "/admin/delete") { await DB.deleteItem(env.DB, p.table as string, p.id as string); return redirect(`/admin?view=${p.view}`); }
          if (path === "/admin/classes") { await DB.insertClass(env.DB, p.name as string, p.hasGroups === "true"); return redirect("/admin?view=structure"); }
          if (path === "/admin/classes/update") { await DB.updateClass(env.DB, p.id as string, p.name as string, p.hasGroups === "true"); return redirect("/admin?view=structure"); }
          if (path === "/admin/classes/link") { await DB.updateClassLink(env.DB, p.id as string, (p.linkedClassId as string) || null); return redirect("/admin?view=structure"); }
          if (path === "/admin/groups") { await DB.insertGroup(env.DB, p.classId as string, p.name as string); return redirect("/admin?view=structure"); }
          if (path === "/admin/groups/update") { await DB.updateGroup(env.DB, p.id as string, p.name as string); return redirect("/admin?view=structure"); }
          if (path === "/admin/subjects") { await DB.insertSubject(env.DB, p.classId as string, p.groupId as string || null, p.name as string); return redirect("/admin?view=structure"); }
          if (path === "/admin/subjects/update") { await DB.updateSubject(env.DB, p.id as string, p.name as string, p.groupId as string || null); return redirect("/admin?view=structure"); }
          if (path === "/admin/chapters") { await DB.insertChapter(env.DB, p.subjectId as string, p.name as string, 1); return redirect("/admin?view=qbank"); }
          if (path === "/admin/subchapters") { await DB.insertSubChapter(env.DB, p.chapterId as string, p.name as string); return redirect("/admin?view=qbank"); }
          if (path === "/admin/source-entities") { await DB.insertSourceEntity(env.DB, p.categoryId as string, p.name as string); return redirect("/admin?view=settings"); }
          if (path === "/admin/featured-cards") { await DB.insertFeaturedCard(env.DB, p); return redirect("/admin?view=cards"); }
          
          if (path === "/admin/stems") { await DB.insertStem(env.DB, p); return redirect("/admin?view=qbank"); }
          if (path === "/admin/questions") { await DB.insertQuestion(env.DB, p); return redirect("/admin?view=qbank"); }
        }

        const view = url.searchParams.get("view") || "structure";
        const [h, s, cards, stems] = await Promise.all([
          DB.getHierarchy(env.DB), 
          DB.getSources(env.DB), 
          DB.getFeaturedCards(env.DB),
          env.DB.prepare("SELECT * FROM stems ORDER BY id DESC LIMIT 50").all().then(r => r.results || [])
        ]);
        
        return html(Admin.renderDashboard({hierarchy: h, sources: s, cards, stems}, view));
      }

      return renderError("Page Not Found", "We couldn't find the page you are looking for.", 404);

    } catch (e: any) {
       // --- UI FIX: Wrap DB Init message in the Layout ---
       if (e.message && e.message.includes("no such table")) { 
         await DB.setupDatabase(env.DB); 
         return renderError("System Initialized", "The database has been created successfully. Please reload the page to start.", 200); 
       }
       
       return renderError("System Error", e.message, 500);
    }
  }
};
