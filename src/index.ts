const layout = (title: string, description: string, body: string) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="${description}" />
    <title>${title}</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f4f7fb;
        --surface: #ffffff;
        --primary: #1e4db7;
        --primary-dark: #163a8f;
        --accent: #f97316;
        --text: #0f172a;
        --muted: #556079;
        --border: #e2e8f0;
        --success: #15803d;
        --shadow: 0 14px 40px rgba(15, 23, 42, 0.12);
      }

      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      body {
        font-family: "Inter", "Segoe UI", system-ui, sans-serif;
        background: var(--bg);
        color: var(--text);
        line-height: 1.6;
      }

      a {
        color: inherit;
        text-decoration: none;
      }

      .container {
        width: min(1120px, 100% - 2rem);
        margin: 0 auto;
      }

      .pill {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: rgba(30, 77, 183, 0.12);
        color: var(--primary);
        padding: 0.35rem 0.8rem;
        border-radius: 999px;
        font-size: 0.85rem;
        font-weight: 600;
      }

      header {
        background: var(--surface);
        border-bottom: 1px solid var(--border);
        position: sticky;
        top: 0;
        z-index: 10;
      }

      .nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 0;
      }

      .nav-links {
        display: flex;
        gap: 1rem;
        font-weight: 600;
        font-size: 0.95rem;
      }

      .nav-links a {
        padding: 0.4rem 0.75rem;
        border-radius: 999px;
        transition: background 0.2s ease;
      }

      .nav-links a:hover {
        background: rgba(30, 77, 183, 0.08);
      }

      .hero {
        padding: 3.5rem 0 3rem;
      }

      .hero-grid {
        display: grid;
        gap: 2rem;
      }

      .hero-card {
        background: var(--surface);
        padding: 2rem;
        border-radius: 24px;
        box-shadow: var(--shadow);
      }

      .hero h1 {
        font-size: clamp(2.2rem, 5vw, 3.4rem);
        line-height: 1.1;
        margin-bottom: 1rem;
      }

      .hero p {
        color: var(--muted);
        font-size: 1.05rem;
        margin-bottom: 1.5rem;
      }

      .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.85rem 1.6rem;
        border-radius: 999px;
        background: var(--primary);
        color: #fff;
        font-weight: 600;
        border: none;
        cursor: pointer;
        transition: background 0.2s ease;
      }

      .button.secondary {
        background: rgba(30, 77, 183, 0.1);
        color: var(--primary);
      }

      .button:hover {
        background: var(--primary-dark);
      }

      .button.secondary:hover {
        background: rgba(30, 77, 183, 0.2);
      }

      .content-grid {
        display: grid;
        gap: 1.5rem;
        margin-top: 2rem;
      }

      .card {
        background: var(--surface);
        padding: 1.5rem;
        border-radius: 20px;
        border: 1px solid var(--border);
      }

      .card h3 {
        margin-bottom: 0.75rem;
        font-size: 1.2rem;
      }

      .card p {
        color: var(--muted);
      }

      .stats {
        display: grid;
        gap: 1rem;
        margin-top: 2rem;
      }

      .stat {
        background: #eaf0ff;
        padding: 1.2rem;
        border-radius: 18px;
        font-weight: 600;
        color: var(--primary-dark);
      }

      .section {
        padding: 3rem 0;
      }

      .section h2 {
        font-size: clamp(1.6rem, 4vw, 2.2rem);
        margin-bottom: 1rem;
      }

      .muted {
        color: var(--muted);
      }

      .dashboard {
        display: grid;
        gap: 1.5rem;
      }

      .panel {
        background: var(--surface);
        padding: 1.5rem;
        border-radius: 20px;
        border: 1px solid var(--border);
      }

      .panel h3 {
        margin-bottom: 0.75rem;
      }

      .list {
        display: grid;
        gap: 0.75rem;
        margin-top: 1rem;
      }

      .list-item {
        padding: 0.9rem 1rem;
        border-radius: 16px;
        border: 1px dashed #cbd5f5;
        background: #f8faff;
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
      }

      form {
        display: grid;
        gap: 1rem;
      }

      label {
        font-weight: 600;
        font-size: 0.9rem;
      }

      input,
      select,
      textarea {
        padding: 0.85rem 1rem;
        border-radius: 14px;
        border: 1px solid var(--border);
        font-family: inherit;
        font-size: 1rem;
      }

      input:focus,
      textarea:focus,
      select:focus {
        outline: 2px solid rgba(30, 77, 183, 0.25);
        border-color: rgba(30, 77, 183, 0.5);
      }

      .form-row {
        display: grid;
        gap: 0.6rem;
      }

      .tag {
        display: inline-flex;
        padding: 0.25rem 0.6rem;
        border-radius: 999px;
        background: rgba(249, 115, 22, 0.12);
        color: var(--accent);
        font-size: 0.8rem;
        font-weight: 600;
      }

      footer {
        padding: 2.5rem 0 3rem;
        color: var(--muted);
        font-size: 0.95rem;
      }

      @media (min-width: 768px) {
        .hero-grid {
          grid-template-columns: 1.1fr 0.9fr;
          align-items: center;
        }

        .content-grid {
          grid-template-columns: repeat(3, 1fr);
        }

        .stats {
          grid-template-columns: repeat(3, 1fr);
        }

        .dashboard {
          grid-template-columns: repeat(2, 1fr);
        }

        .form-split {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
      }
    </style>
  </head>
  <body>
    ${body}
  </body>
</html>`;

const baseNav = `
  <header>
    <div class="container nav">
      <a href="/" aria-label="Freeducation home">
        <strong>Freeducation</strong>
      </a>
      <nav class="nav-links">
        <a href="/">Explore</a>
        <a href="/admin/setup">Top Admin Setup</a>
        <a href="/admin/login">Login</a>
      </nav>
    </div>
  </header>
`;

const homePage = () =>
  layout(
    "Freeducation | Free learning for every student",
    "Discover free ebooks, courses, videos, and student tools in one mobile-first hub.",
    `
    ${baseNav}
    <main>
      <section class="hero">
        <div class="container hero-grid">
          <div>
            <span class="pill">Always free • Mobile-first • Cloudflare-ready</span>
            <h1>Everything students need to learn, collected in one place.</h1>
            <p>
              Freeducation delivers free ebooks, videos, study packs, and tools with a secure, modular
              platform that grows with your community.
            </p>
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <a class="button" href="/admin/setup">Create top admin account</a>
              <a class="button secondary" href="#content">Browse library</a>
            </div>
          </div>
          <div class="hero-card">
            <h3>Today’s highlights</h3>
            <p class="muted">Fresh resources, curated collections, and student-friendly search.</p>
            <div class="content-grid" style="margin-top: 1.2rem;">
              <div class="card">
                <span class="tag">Ebooks</span>
                <h3>STEM starter pack</h3>
                <p>Open textbooks, exam guides, and quick reference sheets.</p>
              </div>
              <div class="card">
                <span class="tag">Videos</span>
                <h3>Daily micro lessons</h3>
                <p>Short, mobile-first videos with transcripts and summaries.</p>
              </div>
              <div class="card">
                <span class="tag">Tools</span>
                <h3>Study planner</h3>
                <p>Generate weekly plans and track progress across topics.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section" id="content">
        <div class="container">
          <h2>Explore the free learning library</h2>
          <p class="muted">Organized by category, verified by admins, and optimized for low-bandwidth access.</p>
          <div class="content-grid">
            <article class="card">
              <h3>Books & PDFs</h3>
              <p>Thousands of open-access textbooks, lab manuals, and lecture notes.</p>
            </article>
            <article class="card">
              <h3>Courses & Playlists</h3>
              <p>Structured learning paths with progress tracking and saved favorites.</p>
            </article>
            <article class="card">
              <h3>Community Resources</h3>
              <p>Student notes, project showcases, and curated opportunities.</p>
            </article>
          </div>

          <div class="stats">
            <div class="stat">Verified uploads from administrators only</div>
            <div class="stat">Role-based dashboards for every team</div>
            <div class="stat">Optimized for phones, tablets, and desktops</div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container hero-card">
          <h2>Built for security and growth</h2>
          <p class="muted">
            Data lives in Cloudflare D1 and R2, audit-ready logs keep every change traceable, and a
            top-level admin controls who can publish content.
          </p>
          <div class="content-grid">
            <div class="card">
              <h3>Trusted roles</h3>
              <p>Super admin, director, admin, and moderator workflows are modular by design.</p>
            </div>
            <div class="card">
              <h3>Performance first</h3>
              <p>Edge deployment with fast caching keeps pages responsive on any device.</p>
            </div>
            <div class="card">
              <h3>Responsible access</h3>
              <p>Strict permission layers and review queues protect student safety.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
    <footer>
      <div class="container">
        <p>Freeducation — A free learning platform for every student.</p>
      </div>
    </footer>
  `
  );

const setupPage = () =>
  layout(
    "Top Admin Setup | Freeducation",
    "Create the first super admin account for Freeducation.",
    `
    ${baseNav}
    <main class="section">
      <div class="container">
        <div class="hero-card">
          <span class="pill">Initial setup</span>
          <h1>Activate the platform with your top admin account</h1>
          <p class="muted">
            This account controls all other roles. Complete the secure form below to create the first
            super admin profile.
          </p>
          <form method="POST" action="/admin/setup">
            <div class="form-split">
              <div class="form-row">
                <label for="full-name">Full name</label>
                <input id="full-name" name="fullName" type="text" placeholder="e.g. Amina Rahman" required />
              </div>
              <div class="form-row">
                <label for="email">Work email</label>
                <input id="email" name="email" type="email" placeholder="admin@freeducation.org" required />
              </div>
            </div>
            <div class="form-row">
              <label for="role">Primary role</label>
              <select id="role" name="role" required>
                <option value="super-admin">Super Admin (Top role)</option>
                <option value="director">Director</option>
              </select>
            </div>
            <div class="form-split">
              <div class="form-row">
                <label for="password">Password</label>
                <input id="password" name="password" type="password" minlength="12" required />
              </div>
              <div class="form-row">
                <label for="confirm">Confirm password</label>
                <input id="confirm" name="confirm" type="password" minlength="12" required />
              </div>
            </div>
            <div class="form-row">
              <label for="mission">Mission statement</label>
              <textarea id="mission" name="mission" rows="4" placeholder="Share how Freeducation will serve students."></textarea>
            </div>
            <button class="button" type="submit">Create top admin account</button>
          </form>
        </div>
      </div>
    </main>
  `
  );

const setupSuccessPage = () =>
  layout(
    "Setup Complete | Freeducation",
    "Top admin account created.",
    `
    ${baseNav}
    <main class="section">
      <div class="container">
        <div class="hero-card">
          <span class="pill">Setup complete</span>
          <h1>Top admin account created</h1>
          <p class="muted">Continue to login and start inviting directors, admins, and moderators.</p>
          <a class="button" href="/admin/login">Go to login</a>
        </div>
      </div>
    </main>
  `
  );

const loginPage = () =>
  layout(
    "Admin Login | Freeducation",
    "Secure login for Freeducation administrators.",
    `
    ${baseNav}
    <main class="section">
      <div class="container">
        <div class="hero-card">
          <span class="pill">Secure access</span>
          <h1>Administrator login</h1>
          <p class="muted">Only approved roles can access dashboards.</p>
          <form method="POST" action="/admin/login">
            <div class="form-row">
              <label for="login-email">Email</label>
              <input id="login-email" name="email" type="email" required />
            </div>
            <div class="form-row">
              <label for="login-password">Password</label>
              <input id="login-password" name="password" type="password" required />
            </div>
            <button class="button" type="submit">Login</button>
          </form>
        </div>
      </div>
    </main>
  `
  );

const dashboardPage = () =>
  layout(
    "Top Admin Dashboard | Freeducation",
    "Overview for the Freeducation top admin dashboard.",
    `
    ${baseNav}
    <main class="section">
      <div class="container">
        <div class="hero-card">
          <span class="pill">Top Admin Dashboard</span>
          <h1>Welcome to your control center</h1>
          <p class="muted">Manage roles, approve resources, and monitor learning impact.</p>
        </div>
        <div class="dashboard" style="margin-top: 1.5rem;">
          <section class="panel">
            <h3>Role management</h3>
            <p class="muted">Invite directors, admins, and moderators with scoped permissions.</p>
            <div class="list">
              <div class="list-item">
                <strong>Invite new admin</strong>
                <span class="muted">Send role-specific access links.</span>
              </div>
              <div class="list-item">
                <strong>Approval queue</strong>
                <span class="muted">Review pending content submissions.</span>
              </div>
              <div class="list-item">
                <strong>Audit logs</strong>
                <span class="muted">Track every change with timestamps.</span>
              </div>
            </div>
          </section>
          <section class="panel">
            <h3>Content health</h3>
            <p class="muted">Keep the library organized and trusted.</p>
            <div class="list">
              <div class="list-item">
                <strong>Top categories</strong>
                <span class="muted">Science, Business, Coding, Language Learning</span>
              </div>
              <div class="list-item">
                <strong>Safety checks</strong>
                <span class="muted">Automated scans and manual review tools.</span>
              </div>
              <div class="list-item">
                <strong>Student feedback</strong>
                <span class="muted">Monitor ratings, flags, and suggestions.</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  `
  );

const notFoundPage = () =>
  layout(
    "Page not found | Freeducation",
    "The requested page could not be found.",
    `
    ${baseNav}
    <main class="section">
      <div class="container">
        <div class="hero-card">
          <span class="pill">404</span>
          <h1>We couldn't find that page</h1>
          <p class="muted">Return to the home page to keep exploring.</p>
          <a class="button" href="/">Back to home</a>
        </div>
      </div>
    </main>
  `
  );

const htmlResponse = (content: string, status = 200) =>
  new Response(content, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "x-content-type-options": "nosniff",
      "x-frame-options": "DENY",
      "referrer-policy": "no-referrer",
      "permissions-policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
      "strict-transport-security": "max-age=63072000; includeSubDomains; preload",
      "content-security-policy":
        "default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
    },
  });

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      return htmlResponse(homePage());
    }

    if (url.pathname === "/admin/setup") {
      if (request.method === "POST") {
        return htmlResponse(setupSuccessPage(), 201);
      }
      return htmlResponse(setupPage());
    }

    if (url.pathname === "/admin/login") {
      if (request.method === "POST") {
        return Response.redirect(`${url.origin}/admin/dashboard`, 303);
      }
      return htmlResponse(loginPage());
    }

    if (url.pathname === "/admin/dashboard") {
      return htmlResponse(dashboardPage());
    }

    return htmlResponse(notFoundPage(), 404);
  },
};
