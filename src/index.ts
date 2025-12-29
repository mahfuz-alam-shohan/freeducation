type Env = {
  DB: D1Database;
};

type PracticeTestFilters = {
  release_id: string;
  grade_id?: string;
  subject_id?: string;
  chapter_id?: string;
  outcome_id?: string;
  lesson_ids?: string[];
  difficulty?: string;
};

type AnswerPayload = {
  question_id: string;
  selected_choice_ids?: string[];
  answer_text?: string;
};

type ContentDashboardFilters = {
  release_id: string;
  grade_id?: string;
  subject_id?: string;
  coordinator_id?: string;
};

type ContentSearchFilters = {
  release_id: string;
  grade_id?: string;
  subject_id?: string;
  chapter_id?: string;
  type?: string;
  year?: number;
};

type ContentRatingPayload = {
  rating: number;
  comment?: string;
  user_id?: string;
};

type DashboardLimits = {
  approvals: number;
  reviews: number;
  timeline: number;
};

const jsonResponse = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });

const htmlResponse = (html: string, status = 200) =>
  new Response(html, {
    status,
    headers: { "content-type": "text/html; charset=utf-8" },
  });

const parseJson = async (request: Request) => {
  try {
    return await request.json();
  } catch {
    return null;
  }
};

const normalizeAnswer = (value: string) => value.trim().toLowerCase();

const ensureArray = (value: unknown) => (Array.isArray(value) ? value : []);

const parseLimit = (value: string | null, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
};

const parseOffset = (value: string | null, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : fallback;
};

const buildFilters = (filters: PracticeTestFilters) => {
  const conditions: string[] = ["cqs.release_id = ?"];
  const params: unknown[] = [filters.release_id];

  if (filters.grade_id) {
    conditions.push("g.id = ?");
    params.push(filters.grade_id);
  }

  if (filters.subject_id) {
    conditions.push("s.id = ?");
    params.push(filters.subject_id);
  }

  if (filters.chapter_id) {
    conditions.push("(ch.id = ? OR cqs.chapter_id = ?)");
    params.push(filters.chapter_id, filters.chapter_id);
  }

  if (filters.outcome_id) {
    conditions.push("(q.outcome_id = ? OR cqs.outcome_id = ?)");
    params.push(filters.outcome_id, filters.outcome_id);
  }

  if (filters.lesson_ids && filters.lesson_ids.length > 0) {
    const placeholders = filters.lesson_ids.map(() => "?").join(", ");
    conditions.push(`lessons.id IN (${placeholders})`);
    params.push(...filters.lesson_ids);
  }

  if (filters.difficulty) {
    conditions.push("cqs.difficulty = ?");
    params.push(filters.difficulty);
  }

  return { conditions, params };
};

const buildContentDashboardFilters = (filters: ContentDashboardFilters) => {
  const conditions: string[] = ["ci.release_id = ?"];
  const params: unknown[] = [filters.release_id];

  if (filters.grade_id) {
    conditions.push("g.id = ?");
    params.push(filters.grade_id);
  }

  if (filters.subject_id) {
    conditions.push("s.id = ?");
    params.push(filters.subject_id);
  }

  if (filters.coordinator_id) {
    conditions.push("ci.owner_id = ?");
    params.push(filters.coordinator_id);
  }

  return { conditions, params };
};

const buildSearchFilters = (filters: ContentSearchFilters) => {
  const conditions: string[] = ["ci.release_id = ?"];
  const params: unknown[] = [filters.release_id];

  if (filters.grade_id) {
    conditions.push("g.id = ?");
    params.push(filters.grade_id);
  }

  if (filters.subject_id) {
    conditions.push("s.id = ?");
    params.push(filters.subject_id);
  }

  if (filters.chapter_id) {
    conditions.push("ch.id = ?");
    params.push(filters.chapter_id);
  }

  if (filters.type) {
    conditions.push("ci.type = ?");
    params.push(filters.type);
  }

  if (filters.year) {
    conditions.push("ci.year = ?");
    params.push(filters.year);
  }

  return { conditions, params };
};

const buildWhereClause = (conditions: string[]) =>
  conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

const renderHomePage = () => `<!doctype html>
<html lang="bn">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Freeducation LMS — NCTB Focused Learning</title>
    <style>
      :root {
        color-scheme: light;
        --brand: #1a4b8c;
        --accent: #f4b400;
        --ink: #0c1526;
        --muted: #5f6b7a;
        --surface: #f7f8fb;
        --card: #ffffff;
      }
      * {
        box-sizing: border-box;
        font-family: "Noto Sans Bengali", "Hind Siliguri", "Segoe UI", sans-serif;
      }
      body {
        margin: 0;
        color: var(--ink);
        background: var(--surface);
        line-height: 1.6;
      }
      header {
        background: linear-gradient(120deg, #0d2b57 0%, #1a4b8c 55%, #2767c9 100%);
        color: white;
        padding: 32px 24px 48px;
      }
      nav {
        max-width: 1120px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
      }
      nav a {
        color: white;
        text-decoration: none;
        font-weight: 600;
        margin-left: 16px;
      }
      .hero {
        max-width: 1120px;
        margin: 32px auto 0;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 24px;
        align-items: center;
      }
      .hero h1 {
        font-size: clamp(2rem, 4vw, 3rem);
        margin: 0 0 12px;
      }
      .hero p {
        margin: 0 0 16px;
        color: #e8eef8;
      }
      .hero-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }
      .btn {
        border: none;
        padding: 12px 20px;
        border-radius: 999px;
        font-weight: 700;
        cursor: pointer;
        text-decoration: none;
      }
      .btn-primary {
        background: var(--accent);
        color: #1a1a1a;
      }
      .btn-secondary {
        background: rgba(255, 255, 255, 0.18);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.3);
      }
      main {
        max-width: 1120px;
        margin: -32px auto 56px;
        padding: 0 24px;
      }
      .highlight {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 16px;
        background: white;
        padding: 24px;
        border-radius: 20px;
        box-shadow: 0 18px 40px rgba(12, 21, 38, 0.08);
      }
      .highlight strong {
        font-size: 1.1rem;
      }
      section {
        margin-top: 40px;
      }
      h2 {
        font-size: 1.8rem;
        margin-bottom: 12px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 16px;
      }
      .card {
        background: var(--card);
        padding: 20px;
        border-radius: 16px;
        border: 1px solid #e6eaf0;
      }
      .card h3 {
        margin-top: 0;
      }
      .timeline {
        display: grid;
        gap: 12px;
      }
      .timeline div {
        background: white;
        padding: 16px;
        border-radius: 14px;
        border-left: 4px solid var(--brand);
      }
      footer {
        background: #0d1e3b;
        color: white;
        padding: 32px 24px;
      }
      footer p {
        margin: 0;
        color: #d6dbea;
      }
      .pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        background: #f5f7ff;
        border-radius: 999px;
        font-weight: 600;
        color: var(--brand);
        font-size: 0.9rem;
      }
      .list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .list li {
        margin: 8px 0;
        color: var(--muted);
      }
      @media (max-width: 600px) {
        nav {
          flex-direction: column;
          align-items: flex-start;
        }
        nav div {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
      }
    </style>
  </head>
  <body>
    <header>
      <nav>
        <div><strong>Freeducation LMS</strong></div>
        <div>
          <a href="#curriculum">কারিকুলাম</a>
          <a href="#practice">প্র্যাকটিস</a>
          <a href="#dashboard">ড্যাশবোর্ড</a>
          <a href="#about">আমাদের লক্ষ্য</a>
        </div>
      </nav>
      <div class="hero">
        <div>
          <p class="pill">NCTB + Custom Curriculum</p>
          <h1>পড়া → দাগ দেওয়া → নোট → প্র্যাকটিস</h1>
          <p>
            হাজারো শিক্ষার্থী ও শিক্ষককে এক জায়গায় এনে দেয়ার জন্য তৈরি
            বাংলাদেশি স্টাডি‑স্টাইল ভিত্তিক ফ্রি LMS।
          </p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="#practice">ফ্রি প্রশ্নব্যাংক</a>
            <a class="btn btn-secondary" href="#dashboard">অ্যাডমিন ড্যাশবোর্ড</a>
          </div>
        </div>
        <div class="card">
          <h3>আজকের ফিচার সেট</h3>
          <ul class="list">
            <li>✅ NCTB বেইসড বিষয়ভিত্তিক নোট</li>
            <li>✅ বোর্ড + বিশ্ববিদ্যালয় প্রশ্ন ব্যাংক</li>
            <li>✅ CQ/MCQ অনুশীলন সেট</li>
            <li>✅ শিক্ষক ও কো-অর্ডিনেটর ওয়ার্কফ্লো</li>
          </ul>
        </div>
      </div>
    </header>
    <main>
      <section class="highlight" id="about">
        <div>
          <strong>বাংলাদেশি স্টাডি ফ্লো</strong>
          <p>বই পড়া, দাগ দেওয়া, নোট লেখা এবং সাথে সাথে প্রশ্ন অনুশীলন।</p>
        </div>
        <div>
          <strong>সম্পূর্ণ ফ্রি</strong>
          <p>সকল ক্লাস, নোট, ট্রিকস, বোর্ড প্রশ্ন এবং পরীক্ষা ফ্রি।</p>
        </div>
        <div>
          <strong>স্কেল করার জন্য তৈরি</strong>
          <p>Cloudflare Workers + D1 + R2—হাজার হাজার ইউজারের জন্য প্রস্তুত।</p>
        </div>
      </section>

      <section id="curriculum">
        <h2>কারিকুলাম স্টুডিও</h2>
        <div class="grid">
          <div class="card">
            <h3>NCTB বেইসলাইন</h3>
            <p>প্রাথমিক, মাধ্যমিক, উচ্চ মাধ্যমিক স্তর ধরে সব সাবজেক্ট ম্যাপিং।</p>
          </div>
          <div class="card">
            <h3>কাস্টম ওভাররাইড</h3>
            <p>নিজস্ব অধ্যায়, আউটকাম ও কন্টেন্ট যোগ করার সুযোগ।</p>
          </div>
          <div class="card">
            <h3>রিলিজ সিস্টেম</h3>
            <p>পরীক্ষা ও কন্টেন্ট নির্দিষ্ট রিলিজ ভার্সনে লক থাকবে।</p>
          </div>
        </div>
      </section>

      <section id="practice">
        <h2>প্র্যাকটিস &amp; প্রশ্নব্যাংক</h2>
        <div class="grid">
          <div class="card">
            <h3>প্রশ্ন সেট</h3>
            <p>বিভাগ, বছর, বোর্ড, ইউনিভার্সিটি এবং টপিক ভিত্তিক ফিল্টার।</p>
          </div>
          <div class="card">
            <h3>ইন্টার‍্যাক্টিভ টেস্ট</h3>
            <p>টাইমড টেস্ট, ইনস্ট্যান্ট রেজাল্ট, ডিফিকাল্টি মিক্স।</p>
          </div>
          <div class="card">
            <h3>স্মার্ট রিকমেন্ডেশন</h3>
            <p>দূর্বল টপিকে বেশি প্রশ্ন অনুশীলনের সাজেশন।</p>
          </div>
        </div>
      </section>

      <section id="dashboard">
        <h2>অ্যাডমিন ও কো-অর্ডিনেটর ড্যাশবোর্ড</h2>
        <div class="timeline">
          <div><strong>১.</strong> শিক্ষক সাবমিশন → অটোমেটেড চেক → রিভিউ কিউ</div>
          <div><strong>২.</strong> কনটেন্ট রিভিউ → অ্যাপ্রুভ → প্রকাশ</div>
          <div><strong>৩.</strong> রিপোর্টিং: জনপ্রিয় লেসন, প্রশ্নের পারফরম্যান্স, রেটিং</div>
          <div><strong>৪.</strong> কাস্টম রিলিজ ও কারিকুলাম ম্যাপিং ম্যানেজমেন্ট</div>
        </div>
      </section>

      <section>
        <h2>শিক্ষার্থীদের জন্য সহজ ডিজাইন</h2>
        <div class="grid">
          <div class="card">
            <h3>এক নজরে লেসন</h3>
            <p>নোট, আন্ডারলাইন, ট্রিকস ও দ্রুত প্র্যাকটিস বোতাম।</p>
          </div>
          <div class="card">
            <h3>মোবাইল‑ফার্স্ট</h3>
            <p>লো‑ব্যান্ডউইথেও দ্রুত লোড হবে এবং সহজ নেভিগেশন।</p>
          </div>
          <div class="card">
            <h3>ফিউচার লগইন</h3>
            <p>ভবিষ্যতে নাম/ইমেইল দিয়ে প্রগ্রেস সেভ করা যাবে।</p>
          </div>
        </div>
      </section>
    </main>
    <footer>
      <p>Freeducation LMS — বাংলাদেশের শিক্ষার্থীদের জন্য ফ্রি লার্নিং প্ল্যাটফর্ম।</p>
    </footer>
  </body>
</html>`;

const renderAdminOverview = () => `<!doctype html>
<html lang="bn">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Freeducation Admin Studio</title>
    <style>
      :root {
        --ink: #101828;
        --muted: #667085;
        --brand: #1a4b8c;
        --surface: #f4f6fb;
        --card: #ffffff;
      }
      * {
        box-sizing: border-box;
        font-family: "Noto Sans Bengali", "Hind Siliguri", "Segoe UI", sans-serif;
      }
      body {
        margin: 0;
        background: var(--surface);
        color: var(--ink);
      }
      header {
        background: var(--brand);
        color: white;
        padding: 24px;
      }
      main {
        max-width: 1100px;
        margin: 0 auto;
        padding: 24px;
        display: grid;
        gap: 20px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 16px;
      }
      .card {
        background: var(--card);
        border-radius: 16px;
        padding: 18px;
        border: 1px solid #e5e7eb;
      }
      .card h3 {
        margin-top: 0;
      }
      .badge {
        display: inline-block;
        background: #eef2ff;
        color: #3730a3;
        padding: 4px 10px;
        border-radius: 999px;
        font-weight: 600;
        font-size: 0.85rem;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th,
      td {
        padding: 10px;
        border-bottom: 1px solid #e5e7eb;
        text-align: left;
      }
      th {
        color: var(--muted);
        font-weight: 600;
        font-size: 0.85rem;
      }
    </style>
  </head>
  <body>
    <header>
      <h1>Admin Studio</h1>
      <p>কনটেন্ট, রিভিউ, রিলিজ ও এনালিটিক্স পরিচালনার প্রোটোটাইপ।</p>
    </header>
    <main>
      <div class="grid">
        <div class="card">
          <h3>কনটেন্ট স্ট্যাটাস</h3>
          <p class="badge">Pending Reviews: 24</p>
          <p class="badge">Drafts: 18</p>
          <p class="badge">Published: 340</p>
        </div>
        <div class="card">
          <h3>কারিকুলাম রিলিজ</h3>
          <p>Active Release: <strong>NCTB-2025</strong></p>
          <p>Next Draft: <strong>Custom-Alpha</strong></p>
        </div>
        <div class="card">
          <h3>কো-অর্ডিনেটর ফ্লো</h3>
          <p>Assigned reviews, escalation queue, QA sign-off.</p>
        </div>
      </div>

      <div class="card">
        <h3>রিভিউ কিউ (উদাহরণ)</h3>
        <table>
          <thead>
            <tr>
              <th>কনটেন্ট</th>
              <th>বিষয়</th>
              <th>ক্লাস</th>
              <th>স্ট্যাটাস</th>
              <th>অ্যাসাইনড</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>গণিত - অধ্যায় ৩ নোট</td>
              <td>গণিত</td>
              <td>৮ম</td>
              <td>Review</td>
              <td>Coordinator A</td>
            </tr>
            <tr>
              <td>ভৌতবিজ্ঞান MCQ সেট</td>
              <td>ফিজিক্স</td>
              <td>১০ম</td>
              <td>Draft</td>
              <td>Coordinator B</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </body>
</html>`;

const fetchContentDashboard = async (
  db: D1Database,
  filters: ContentDashboardFilters,
  limits: DashboardLimits
) => {
  const { conditions, params } = buildContentDashboardFilters(filters);
  const baseJoin = `
    FROM content_items ci
    LEFT JOIN chapters ch ON ci.chapter_id = ch.id
    LEFT JOIN subjects s ON ch.subject_id = s.id
    LEFT JOIN grades g ON s.grade_id = g.id
  `;
  const whereClause = buildWhereClause(conditions);

  const statusRows = await db
    .prepare(
      `
      SELECT ci.status, COUNT(*) AS count
      ${baseJoin}
      ${whereClause}
      GROUP BY ci.status
      ORDER BY ci.status
      `
    )
    .bind(...params)
    .all<{ status: string; count: number }>();

  const typeRows = await db
    .prepare(
      `
      SELECT ci.type, COUNT(*) AS count
      ${baseJoin}
      ${whereClause}
      GROUP BY ci.type
      ORDER BY count DESC
      `
    )
    .bind(...params)
    .all<{ type: string; count: number }>();

  const approvalsConditions = [...conditions, "ci.status = ?"];
  const approvalsWhere = buildWhereClause(approvalsConditions);
  const approvalsRows = await db
    .prepare(
      `
      SELECT ci.id, ci.title, ci.type, ci.status, ci.updated_at, ci.owner_id,
             ch.name AS chapter_name, s.name AS subject_name, g.name AS grade_name
      ${baseJoin}
      ${approvalsWhere}
      ORDER BY ci.updated_at DESC
      LIMIT ?
      `
    )
    .bind(...params, "approved", limits.approvals)
    .all<{
      id: string;
      title: string;
      type: string;
      status: string;
      updated_at: string;
      owner_id: string | null;
      chapter_name: string | null;
      subject_name: string | null;
      grade_name: string | null;
    }>();

  const reviewConditions = [...conditions, "ci.status = ?"];
  const reviewWhere = buildWhereClause(reviewConditions);
  const reviewRows = await db
    .prepare(
      `
      SELECT ci.id, ci.title, ci.type, ci.status, ci.updated_at, ci.owner_id,
             ch.name AS chapter_name, s.name AS subject_name, g.name AS grade_name
      ${baseJoin}
      ${reviewWhere}
      ORDER BY ci.updated_at DESC
      LIMIT ?
      `
    )
    .bind(...params, "review", limits.reviews)
    .all<{
      id: string;
      title: string;
      type: string;
      status: string;
      updated_at: string;
      owner_id: string | null;
      chapter_name: string | null;
      subject_name: string | null;
      grade_name: string | null;
    }>();

  const gradeWhere = buildWhereClause([...conditions, "g.id IS NOT NULL"]);
  const gradeRows = await db
    .prepare(
      `
      SELECT g.id AS grade_id, g.name AS grade_name, g.sequence AS grade_sequence, COUNT(*) AS count
      ${baseJoin}
      ${gradeWhere}
      GROUP BY g.id, g.name, g.sequence
      ORDER BY g.sequence
      `
    )
    .bind(...params)
    .all<{ grade_id: string; grade_name: string; grade_sequence: number; count: number }>();

  const subjectWhere = buildWhereClause([...conditions, "s.id IS NOT NULL"]);
  const subjectRows = await db
    .prepare(
      `
      SELECT s.id AS subject_id, s.name AS subject_name, COUNT(*) AS count
      ${baseJoin}
      ${subjectWhere}
      GROUP BY s.id, s.name
      ORDER BY count DESC
      `
    )
    .bind(...params)
    .all<{ subject_id: string; subject_name: string; count: number }>();

  const coordinatorWhere = buildWhereClause([...conditions, "ci.owner_id IS NOT NULL"]);
  const coordinatorRows = await db
    .prepare(
      `
      SELECT ci.owner_id AS coordinator_id, COUNT(*) AS count
      ${baseJoin}
      ${coordinatorWhere}
      GROUP BY ci.owner_id
      ORDER BY count DESC
      `
    )
    .bind(...params)
    .all<{ coordinator_id: string; count: number }>();

  const timelineWhere = buildWhereClause(conditions);
  const timelineRows = await db
    .prepare(
      `
      SELECT logs.id, logs.content_item_id, logs.action, logs.actor_id,
             logs.from_status, logs.to_status, logs.created_at,
             ci.title, ci.type, s.name AS subject_name, g.name AS grade_name
      FROM content_item_audit_logs logs
      JOIN content_items ci ON ci.id = logs.content_item_id
      LEFT JOIN chapters ch ON ci.chapter_id = ch.id
      LEFT JOIN subjects s ON ch.subject_id = s.id
      LEFT JOIN grades g ON s.grade_id = g.id
      ${timelineWhere}
      ORDER BY logs.created_at DESC
      LIMIT ?
      `
    )
    .bind(...params, limits.timeline)
    .all<{
      id: string;
      content_item_id: string;
      action: string;
      actor_id: string | null;
      from_status: string | null;
      to_status: string | null;
      created_at: string;
      title: string;
      type: string;
      subject_name: string | null;
      grade_name: string | null;
    }>();

  return jsonResponse({
    filters,
    content_status: {
      by_status: statusRows.results ?? [],
      by_type: typeRows.results ?? [],
    },
    approvals: {
      total: approvalsRows.results?.length ?? 0,
      items: approvalsRows.results ?? [],
    },
    pending_reviews: {
      total: reviewRows.results?.length ?? 0,
      items: reviewRows.results ?? [],
    },
    analytics: {
      by_grade: gradeRows.results ?? [],
      by_subject: subjectRows.results ?? [],
      by_coordinator: coordinatorRows.results ?? [],
    },
    activity_timeline: timelineRows.results ?? [],
  });
};

const fetchContentSearch = async (
  db: D1Database,
  filters: ContentSearchFilters,
  limit: number,
  offset: number
) => {
  const { conditions, params } = buildSearchFilters(filters);
  const baseJoin = `
    FROM content_items ci
    JOIN chapters ch ON ci.chapter_id = ch.id
    JOIN subjects s ON ch.subject_id = s.id
    JOIN grades g ON s.grade_id = g.id
  `;
  const whereClause = buildWhereClause(conditions);

  const totalRow = await db
    .prepare(
      `
      SELECT COUNT(*) AS total
      ${baseJoin}
      ${whereClause}
      `
    )
    .bind(...params)
    .first<{ total: number }>();

  const itemsResult = await db
    .prepare(
      `
      SELECT ci.id, ci.title, ci.type, ci.status, ci.year, ci.chapter_id,
             ch.name AS chapter_name,
             s.id AS subject_id, s.name AS subject_name,
             g.id AS grade_id, g.name AS grade_name
      ${baseJoin}
      ${whereClause}
      ORDER BY ci.updated_at DESC
      LIMIT ? OFFSET ?
      `
    )
    .bind(...params, limit, offset)
    .all<{
      id: string;
      title: string;
      type: string;
      status: string;
      year: number | null;
      chapter_id: string | null;
      chapter_name: string | null;
      subject_id: string | null;
      subject_name: string | null;
      grade_id: string | null;
      grade_name: string | null;
    }>();

  const gradeFacetRows = await db
    .prepare(
      `
      SELECT g.id AS grade_id, g.name AS grade_name, g.sequence AS grade_sequence, COUNT(*) AS count
      ${baseJoin}
      ${whereClause}
      GROUP BY g.id, g.name, g.sequence
      ORDER BY g.sequence
      `
    )
    .bind(...params)
    .all<{ grade_id: string; grade_name: string; grade_sequence: number; count: number }>();

  const subjectFacetRows = await db
    .prepare(
      `
      SELECT s.id AS subject_id, s.name AS subject_name, COUNT(*) AS count
      ${baseJoin}
      ${whereClause}
      GROUP BY s.id, s.name
      ORDER BY count DESC
      `
    )
    .bind(...params)
    .all<{ subject_id: string; subject_name: string; count: number }>();

  const chapterFacetRows = await db
    .prepare(
      `
      SELECT ch.id AS chapter_id, ch.name AS chapter_name, COUNT(*) AS count
      ${baseJoin}
      ${whereClause}
      GROUP BY ch.id, ch.name
      ORDER BY count DESC
      `
    )
    .bind(...params)
    .all<{ chapter_id: string; chapter_name: string; count: number }>();

  const typeFacetRows = await db
    .prepare(
      `
      SELECT ci.type AS type, COUNT(*) AS count
      ${baseJoin}
      ${whereClause}
      GROUP BY ci.type
      ORDER BY count DESC
      `
    )
    .bind(...params)
    .all<{ type: string; count: number }>();

  const yearFacetRows = await db
    .prepare(
      `
      SELECT ci.year AS year, COUNT(*) AS count
      ${baseJoin}
      ${whereClause}
      GROUP BY ci.year
      ORDER BY ci.year DESC
      `
    )
    .bind(...params)
    .all<{ year: number | null; count: number }>();

  return jsonResponse({
    filters,
    pagination: {
      total: totalRow?.total ?? 0,
      limit,
      offset,
      returned: itemsResult.results?.length ?? 0,
    },
    items: itemsResult.results ?? [],
    facets: {
      by_grade: gradeFacetRows.results ?? [],
      by_subject: subjectFacetRows.results ?? [],
      by_chapter: chapterFacetRows.results ?? [],
      by_type: typeFacetRows.results ?? [],
      by_year: yearFacetRows.results ?? [],
    },
  });
};

const fetchContinueLearning = async (
  db: D1Database,
  userId: string,
  limit: number,
  recommendationLimit: number
) => {
  const activityQuery = `
    WITH activity AS (
      SELECT lesson_id AS content_item_id,
             'lesson' AS content_type,
             last_viewed_at AS last_activity_at,
             status,
             1 AS priority,
             last_viewed_at AS sort_at
      FROM lesson_progress
      WHERE user_id = ? AND status = 'in_progress' AND last_viewed_at IS NOT NULL
      UNION ALL
      SELECT question_set_id AS content_item_id,
             'question_set' AS content_type,
             started_at AS last_activity_at,
             status,
             2 AS priority,
             started_at AS sort_at
      FROM question_set_attempts
      WHERE user_id = ? AND status = 'in_progress'
      UNION ALL
      SELECT practice_test_id AS content_item_id,
             'practice_test' AS content_type,
             started_at AS last_activity_at,
             status,
             2 AS priority,
             started_at AS sort_at
      FROM practice_test_attempts
      WHERE user_id = ? AND status = 'in_progress'
      UNION ALL
      SELECT lesson_id AS content_item_id,
             'lesson' AS content_type,
             completed_at AS last_activity_at,
             status,
             3 AS priority,
             completed_at AS sort_at
      FROM lesson_progress
      WHERE user_id = ? AND status = 'completed' AND completed_at IS NOT NULL
      UNION ALL
      SELECT question_set_id AS content_item_id,
             'question_set' AS content_type,
             submitted_at AS last_activity_at,
             status,
             3 AS priority,
             submitted_at AS sort_at
      FROM question_set_attempts
      WHERE user_id = ? AND status = 'submitted' AND submitted_at IS NOT NULL
      UNION ALL
      SELECT practice_test_id AS content_item_id,
             'practice_test' AS content_type,
             submitted_at AS last_activity_at,
             status,
             3 AS priority,
             submitted_at AS sort_at
      FROM practice_test_attempts
      WHERE user_id = ? AND status = 'submitted' AND submitted_at IS NOT NULL
    )
    SELECT activity.content_item_id,
           activity.content_type,
           activity.last_activity_at,
           activity.status,
           COALESCE(ci.title, pt.title) AS title,
           ch.id AS chapter_id,
           ch.name AS chapter_name,
           s.id AS subject_id,
           s.name AS subject_name,
           g.id AS grade_id,
           g.name AS grade_name
    FROM activity
    LEFT JOIN content_items ci
      ON ci.id = activity.content_item_id
      AND activity.content_type IN ('lesson', 'question_set', 'note', 'resource')
    LEFT JOIN practice_tests pt
      ON pt.id = activity.content_item_id
      AND activity.content_type = 'practice_test'
    LEFT JOIN chapters ch ON ci.chapter_id = ch.id
    LEFT JOIN subjects s ON ch.subject_id = s.id
    LEFT JOIN grades g ON s.grade_id = g.id
    ORDER BY activity.priority ASC, activity.sort_at DESC
    LIMIT ?
  `;

  const activityRows = await db
    .prepare(activityQuery)
    .bind(userId, userId, userId, userId, userId, userId, limit)
    .all<{
      content_item_id: string;
      content_type: string;
      last_activity_at: string | null;
      status: string;
      title: string | null;
      chapter_id: string | null;
      chapter_name: string | null;
      subject_id: string | null;
      subject_name: string | null;
      grade_id: string | null;
      grade_name: string | null;
    }>();

  const items = activityRows.results ?? [];
  const hasInProgress = items.some((item) => item.status === "in_progress");
  let recommendations: Array<{
    content_item_id: string;
    content_type: string;
    last_activity_at: string | null;
    status: string;
    title: string;
    chapter_id: string | null;
    chapter_name: string | null;
    subject_id: string | null;
    subject_name: string | null;
    grade_id: string | null;
    grade_name: string | null;
  }> = [];

  if (!hasInProgress && items.length > 0) {
    const recentCompleted = items[0];
    if (recentCompleted.chapter_id || recentCompleted.subject_id) {
      const conditions = ["ci.id != ?"];
      const params: unknown[] = [recentCompleted.content_item_id];

      if (recentCompleted.chapter_id && recentCompleted.subject_id) {
        conditions.push("(ci.chapter_id = ? OR s.id = ?)");
        params.push(recentCompleted.chapter_id, recentCompleted.subject_id);
      } else if (recentCompleted.chapter_id) {
        conditions.push("ci.chapter_id = ?");
        params.push(recentCompleted.chapter_id);
      } else if (recentCompleted.subject_id) {
        conditions.push("s.id = ?");
        params.push(recentCompleted.subject_id);
      }

      const recommendationsQuery = `
        SELECT ci.id AS content_item_id,
               ci.type AS content_type,
               NULL AS last_activity_at,
               'recommended' AS status,
               ci.title AS title,
               ch.id AS chapter_id,
               ch.name AS chapter_name,
               s.id AS subject_id,
               s.name AS subject_name,
               g.id AS grade_id,
               g.name AS grade_name
        FROM content_items ci
        LEFT JOIN chapters ch ON ci.chapter_id = ch.id
        LEFT JOIN subjects s ON ch.subject_id = s.id
        LEFT JOIN grades g ON s.grade_id = g.id
        WHERE ${conditions.join(" AND ")}
        ORDER BY ci.updated_at DESC
        LIMIT ?
      `;

      const recommendationRows = await db
        .prepare(recommendationsQuery)
        .bind(...params, recommendationLimit)
        .all<{
          content_item_id: string;
          content_type: string;
          last_activity_at: string | null;
          status: string;
          title: string;
          chapter_id: string | null;
          chapter_name: string | null;
          subject_id: string | null;
          subject_name: string | null;
          grade_id: string | null;
          grade_name: string | null;
        }>();

      recommendations = recommendationRows.results ?? [];
    }
  }

  return jsonResponse({
    items,
    recommendations,
  });
};

const selectQuestionsForPracticeTest = async (
  db: D1Database,
  filters: PracticeTestFilters,
  questionCount: number
) => {
  const { conditions, params } = buildFilters(filters);
  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const query = `
    SELECT q.id, q.points
    FROM questions q
    JOIN question_sets qs ON qs.content_item_id = q.question_set_id
    JOIN content_items cqs ON cqs.id = qs.content_item_id
    LEFT JOIN lesson_question_sets lqs ON lqs.question_set_id = cqs.id
    LEFT JOIN content_items lessons ON lessons.id = lqs.lesson_id
    LEFT JOIN chapters ch ON lessons.chapter_id = ch.id
    LEFT JOIN subjects s ON ch.subject_id = s.id
    LEFT JOIN grades g ON s.grade_id = g.id
    ${whereClause}
    ORDER BY RANDOM()
    LIMIT ?
  `;
  const result = await db.prepare(query).bind(...params, questionCount).all<{
    id: string;
    points: number;
  }>();

  return result.results ?? [];
};

const createPracticeTest = async (db: D1Database, payload: Record<string, unknown>) => {
  const filters = payload.filters as PracticeTestFilters | undefined;
  if (!filters?.release_id) {
    return jsonResponse({ error: "release_id is required" }, 400);
  }

  const questionCount = Number(payload.question_count ?? 20);
  const questions = await selectQuestionsForPracticeTest(db, filters, questionCount);

  if (questions.length === 0) {
    return jsonResponse({ error: "No questions matched the filters" }, 404);
  }

  const practiceTestId = crypto.randomUUID();
  const createdBy = typeof payload.created_by === "string" ? payload.created_by : null;
  const title =
    typeof payload.title === "string"
      ? payload.title
      : `Practice Test (${new Date().toISOString()})`;
  const scoringRuleId = typeof payload.scoring_rule_id === "string" ? payload.scoring_rule_id : null;
  const timeLimitSeconds =
    typeof payload.time_limit_seconds === "number" ? payload.time_limit_seconds : null;
  const maxScore = questions.reduce((total, question) => total + (question.points ?? 0), 0);

  const statements: D1PreparedStatement[] = [];
  statements.push(
    db
      .prepare(
        `INSERT INTO practice_tests
        (id, release_id, title, filters_json, scoring_rule_id, time_limit_seconds, question_count, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        practiceTestId,
        filters.release_id,
        title,
        JSON.stringify(filters),
        scoringRuleId,
        timeLimitSeconds,
        questions.length,
        createdBy
      )
  );

  questions.forEach((question, index) => {
    statements.push(
      db
        .prepare(
          `INSERT INTO practice_test_questions
          (practice_test_id, question_id, sequence)
          VALUES (?, ?, ?)`
        )
        .bind(practiceTestId, question.id, index + 1)
    );
  });

  await db.batch(statements);

  return jsonResponse({
    id: practiceTestId,
    title,
    question_count: questions.length,
    max_score: maxScore,
  });
};

const startPracticeTestAttempt = async (
  db: D1Database,
  practiceTestId: string,
  payload: Record<string, unknown>
) => {
  const practiceTest = await db
    .prepare(
      `SELECT id, time_limit_seconds
       FROM practice_tests
       WHERE id = ?`
    )
    .bind(practiceTestId)
    .first<{ id: string; time_limit_seconds: number | null }>();

  if (!practiceTest) {
    return jsonResponse({ error: "Practice test not found" }, 404);
  }

  const attemptId = crypto.randomUUID();
  const userId = typeof payload.user_id === "string" ? payload.user_id : null;
  const timeLimitSeconds =
    typeof payload.time_limit_seconds === "number"
      ? payload.time_limit_seconds
      : practiceTest.time_limit_seconds;

  await db
    .prepare(
      `INSERT INTO practice_test_attempts
      (id, practice_test_id, user_id, status, time_limit_seconds)
      VALUES (?, ?, ?, 'in_progress', ?)`
    )
    .bind(attemptId, practiceTestId, userId, timeLimitSeconds)
    .run();

  return jsonResponse({ id: attemptId, time_limit_seconds: timeLimitSeconds });
};

const scoreAttempt = (
  question: {
    id: string;
    question_type: string;
    points: number;
    answer_key: string | null;
  },
  choices: { id: string; is_correct: number }[],
  answer: AnswerPayload,
  scoringRule: { rule_type: string; config_json: string }
) => {
  const ruleConfig = (() => {
    try {
      return JSON.parse(scoringRule.config_json ?? "{}");
    } catch {
      return {};
    }
  })();

  const basePoints = question.points ?? 0;
  const selected = ensureArray(answer.selected_choice_ids).map(String);

  const correctChoices = choices.filter((choice) => choice.is_correct === 1).map((choice) => choice.id);
  const isChoiceQuestion = ["single_choice", "multiple_choice", "true_false"].includes(
    question.question_type
  );

  let isCorrect = false;
  if (isChoiceQuestion) {
    const sortedSelected = [...selected].sort();
    const sortedCorrect = [...correctChoices].sort();
    isCorrect =
      sortedSelected.length === sortedCorrect.length &&
      sortedSelected.every((value, index) => value === sortedCorrect[index]);
  } else if (question.question_type === "short_answer") {
    const answerText = answer.answer_text ? normalizeAnswer(answer.answer_text) : "";
    const normalizedKey = (() => {
      if (!question.answer_key) {
        return [];
      }
      try {
        const parsed = JSON.parse(question.answer_key);
        if (Array.isArray(parsed)) {
          return parsed.map((value) => normalizeAnswer(String(value)));
        }
        if (typeof parsed?.acceptable_answers === "object" && Array.isArray(parsed.acceptable_answers)) {
          return parsed.acceptable_answers.map((value: string) => normalizeAnswer(String(value)));
        }
        if (typeof parsed === "string") {
          return [normalizeAnswer(parsed)];
        }
        return [normalizeAnswer(question.answer_key)];
      } catch {
        return [normalizeAnswer(question.answer_key)];
      }
    })();
    isCorrect = normalizedKey.includes(answerText);
  }

  let awardedPoints = 0;
  if (scoringRule.rule_type === "negative_marking") {
    const penalty = Number(ruleConfig.incorrect_penalty ?? 0.25);
    awardedPoints = isCorrect ? basePoints : -basePoints * penalty;
  } else if (scoringRule.rule_type === "partial_credit" && isChoiceQuestion) {
    const incorrectPenalty = Number(ruleConfig.incorrect_penalty ?? 0);
    const correctSelected = selected.filter((choice) => correctChoices.includes(choice)).length;
    const incorrectSelected = selected.filter((choice) => !correctChoices.includes(choice)).length;
    const ratio = correctChoices.length > 0 ? correctSelected / correctChoices.length : 0;
    awardedPoints = basePoints * ratio - basePoints * incorrectPenalty * incorrectSelected;
    awardedPoints = Math.max(0, Math.min(basePoints, awardedPoints));
    isCorrect = ratio === 1 && incorrectSelected === 0;
  } else {
    awardedPoints = isCorrect ? basePoints : 0;
  }

  return { isCorrect, awardedPoints };
};

const submitPracticeTestAttempt = async (
  db: D1Database,
  practiceTestId: string,
  attemptId: string,
  payload: Record<string, unknown>
) => {
  const answers = ensureArray(payload.answers) as AnswerPayload[];
  if (answers.length === 0) {
    return jsonResponse({ error: "answers are required" }, 400);
  }

  const practiceTest = await db
    .prepare(
      `SELECT pt.id, pt.scoring_rule_id, sr.rule_type, sr.config_json
       FROM practice_tests pt
       LEFT JOIN scoring_rules sr ON sr.id = pt.scoring_rule_id
       WHERE pt.id = ?`
    )
    .bind(practiceTestId)
    .first<{ id: string; scoring_rule_id: string | null; rule_type: string | null; config_json: string | null }>();

  if (!practiceTest) {
    return jsonResponse({ error: "Practice test not found" }, 404);
  }

  const scoringRule = {
    rule_type: practiceTest.rule_type ?? "standard",
    config_json: practiceTest.config_json ?? "{}",
  };

  const questionRows = await db
    .prepare(
      `SELECT q.id, q.question_type, q.points, q.answer_key
       FROM questions q
       JOIN practice_test_questions ptq ON ptq.question_id = q.id
       WHERE ptq.practice_test_id = ?`
    )
    .bind(practiceTestId)
    .all<{ id: string; question_type: string; points: number; answer_key: string | null }>();

  const questions = questionRows.results ?? [];
  if (questions.length === 0) {
    return jsonResponse({ error: "No questions assigned to practice test" }, 404);
  }

  const questionIds = questions.map((question) => question.id);
  const choicePlaceholders = questionIds.map(() => "?").join(", ");
  const choicesResult = await db
    .prepare(
      `SELECT id, question_id, is_correct
       FROM question_choices
       WHERE question_id IN (${choicePlaceholders})`
    )
    .bind(...questionIds)
    .all<{ id: string; question_id: string; is_correct: number }>();

  const choicesByQuestion = new Map<string, { id: string; is_correct: number }[]>();
  (choicesResult.results ?? []).forEach((choice) => {
    const existing = choicesByQuestion.get(choice.question_id) ?? [];
    existing.push(choice);
    choicesByQuestion.set(choice.question_id, existing);
  });

  let totalScore = 0;
  let maxScore = 0;
  const answerStatements: D1PreparedStatement[] = [];

  questions.forEach((question) => {
    maxScore += question.points ?? 0;
    const answer = answers.find((item) => item.question_id === question.id);
    if (!answer) {
      return;
    }
    const choices = choicesByQuestion.get(question.id) ?? [];
    const { isCorrect, awardedPoints } = scoreAttempt(question, choices, answer, scoringRule);
    totalScore += awardedPoints;
    answerStatements.push(
      db
        .prepare(
          `INSERT INTO practice_test_attempt_answers
          (attempt_id, question_id, selected_choice_ids, answer_text, is_correct, awarded_points)
          VALUES (?, ?, ?, ?, ?, ?)`
        )
        .bind(
          attemptId,
          question.id,
          answer.selected_choice_ids ? JSON.stringify(answer.selected_choice_ids) : null,
          answer.answer_text ?? null,
          isCorrect ? 1 : 0,
          awardedPoints
        )
    );
  });

  await db.batch(answerStatements);

  await db
    .prepare(
      `UPDATE practice_test_attempts
       SET status = 'submitted', submitted_at = CURRENT_TIMESTAMP, score = ?, max_score = ?
       WHERE id = ? AND practice_test_id = ?`
    )
    .bind(totalScore, maxScore, attemptId, practiceTestId)
    .run();

  return jsonResponse({
    attempt_id: attemptId,
    score: totalScore,
    max_score: maxScore,
  });
};

const upsertContentRating = async (
  db: D1Database,
  contentItemId: string,
  payload: ContentRatingPayload
) => {
  if (!Number.isFinite(payload.rating)) {
    return jsonResponse({ error: "rating is required" }, 400);
  }
  const rating = Math.round(payload.rating);
  if (rating < 1 || rating > 5) {
    return jsonResponse({ error: "rating must be between 1 and 5" }, 400);
  }

  const ratingId = crypto.randomUUID();
  const userId = typeof payload.user_id === "string" ? payload.user_id : null;
  const comment = typeof payload.comment === "string" ? payload.comment : null;

  await db
    .prepare(
      `INSERT INTO content_ratings
      (id, content_item_id, user_id, rating, comment)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT (content_item_id, user_id)
      DO UPDATE SET rating = excluded.rating, comment = excluded.comment, updated_at = CURRENT_TIMESTAMP`
    )
    .bind(ratingId, contentItemId, userId, rating, comment)
    .run();

  return jsonResponse({ content_item_id: contentItemId, rating, comment, user_id: userId }, 201);
};

const refreshQuestionAccuracyAggregates = async (db: D1Database, releaseId: string) => {
  const accuracyRows = await db
    .prepare(
      `
      WITH answer_rows AS (
        SELECT q.outcome_id AS outcome_id, qa.is_correct AS is_correct
        FROM question_set_attempt_answers qa
        JOIN question_set_attempts qsa ON qsa.id = qa.attempt_id
        JOIN question_sets qs ON qs.content_item_id = qsa.question_set_id
        JOIN content_items ci ON ci.id = qs.content_item_id
        JOIN questions q ON q.id = qa.question_id
        WHERE ci.release_id = ? AND q.outcome_id IS NOT NULL
        UNION ALL
        SELECT q.outcome_id AS outcome_id, pta.is_correct AS is_correct
        FROM practice_test_attempt_answers pta
        JOIN practice_test_attempts ptt ON ptt.id = pta.attempt_id
        JOIN practice_tests pt ON pt.id = ptt.practice_test_id
        JOIN questions q ON q.id = pta.question_id
        WHERE pt.release_id = ? AND q.outcome_id IS NOT NULL
      )
      SELECT outcome_id,
             COUNT(*) AS question_count,
             SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) AS correct_count
      FROM answer_rows
      GROUP BY outcome_id
      `
    )
    .bind(releaseId, releaseId)
    .all<{ outcome_id: string; question_count: number; correct_count: number }>();

  const statements = (accuracyRows.results ?? []).map((row) =>
    db
      .prepare(
        `INSERT INTO question_topic_accuracy
        (release_id, outcome_id, question_count, correct_count, accuracy_rate, last_calculated_at)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT (release_id, outcome_id)
        DO UPDATE SET question_count = excluded.question_count,
                      correct_count = excluded.correct_count,
                      accuracy_rate = excluded.accuracy_rate,
                      last_calculated_at = CURRENT_TIMESTAMP`
      )
      .bind(
        releaseId,
        row.outcome_id,
        row.question_count,
        row.correct_count,
        row.question_count > 0 ? row.correct_count / row.question_count : 0
      )
  );

  if (statements.length > 0) {
    await db.batch(statements);
  }
};

const refreshLessonCompletionAggregates = async (db: D1Database, releaseId: string) => {
  const completionRows = await db
    .prepare(
      `
      SELECT lp.lesson_id,
             SUM(CASE WHEN lp.status IN ('in_progress', 'completed') THEN 1 ELSE 0 END) AS started_count,
             SUM(CASE WHEN lp.status = 'completed' THEN 1 ELSE 0 END) AS completed_count
      FROM lesson_progress lp
      JOIN content_items ci ON ci.id = lp.lesson_id
      WHERE ci.release_id = ?
      GROUP BY lp.lesson_id
      `
    )
    .bind(releaseId)
    .all<{ lesson_id: string; started_count: number; completed_count: number }>();

  const statements = (completionRows.results ?? []).map((row) =>
    db
      .prepare(
        `INSERT INTO lesson_completion_rates
        (release_id, lesson_id, started_count, completed_count, completion_rate, last_calculated_at)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT (release_id, lesson_id)
        DO UPDATE SET started_count = excluded.started_count,
                      completed_count = excluded.completed_count,
                      completion_rate = excluded.completion_rate,
                      last_calculated_at = CURRENT_TIMESTAMP`
      )
      .bind(
        releaseId,
        row.lesson_id,
        row.started_count,
        row.completed_count,
        row.started_count > 0 ? row.completed_count / row.started_count : 0
      )
  );

  if (statements.length > 0) {
    await db.batch(statements);
  }
};

const refreshContentRatingAggregates = async (db: D1Database, releaseId: string) => {
  const ratingRows = await db
    .prepare(
      `
      SELECT cr.content_item_id,
             COUNT(*) AS rating_count,
             AVG(cr.rating) AS rating_average
      FROM content_ratings cr
      JOIN content_items ci ON ci.id = cr.content_item_id
      WHERE ci.release_id = ?
      GROUP BY cr.content_item_id
      `
    )
    .bind(releaseId)
    .all<{ content_item_id: string; rating_count: number; rating_average: number }>();

  const statements = (ratingRows.results ?? []).map((row) =>
    db
      .prepare(
        `INSERT INTO content_rating_aggregates
        (release_id, content_item_id, rating_count, rating_average, last_calculated_at)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT (release_id, content_item_id)
        DO UPDATE SET rating_count = excluded.rating_count,
                      rating_average = excluded.rating_average,
                      last_calculated_at = CURRENT_TIMESTAMP`
      )
      .bind(releaseId, row.content_item_id, row.rating_count, row.rating_average ?? 0)
  );

  if (statements.length > 0) {
    await db.batch(statements);
  }
};

const fetchAdminLearningReport = async (db: D1Database, releaseId: string) => {
  await refreshQuestionAccuracyAggregates(db, releaseId);
  await refreshLessonCompletionAggregates(db, releaseId);
  await refreshContentRatingAggregates(db, releaseId);

  const questionAccuracyRows = await db
    .prepare(
      `
      SELECT qa.outcome_id,
             o.description AS outcome_description,
             ch.id AS chapter_id,
             ch.name AS chapter_name,
             s.id AS subject_id,
             s.name AS subject_name,
             g.id AS grade_id,
             g.name AS grade_name,
             qa.question_count,
             qa.correct_count,
             qa.accuracy_rate,
             qa.last_calculated_at
      FROM question_topic_accuracy qa
      JOIN outcomes o ON o.id = qa.outcome_id
      JOIN chapters ch ON ch.id = o.chapter_id
      JOIN subjects s ON s.id = ch.subject_id
      JOIN grades g ON g.id = s.grade_id
      WHERE qa.release_id = ?
      ORDER BY qa.accuracy_rate ASC, qa.question_count DESC
      `
    )
    .bind(releaseId)
    .all<{
      outcome_id: string;
      outcome_description: string;
      chapter_id: string;
      chapter_name: string;
      subject_id: string;
      subject_name: string;
      grade_id: string;
      grade_name: string;
      question_count: number;
      correct_count: number;
      accuracy_rate: number;
      last_calculated_at: string;
    }>();

  const lessonCompletionRows = await db
    .prepare(
      `
      SELECT lcr.lesson_id,
             ci.title AS lesson_title,
             ch.id AS chapter_id,
             ch.name AS chapter_name,
             s.id AS subject_id,
             s.name AS subject_name,
             g.id AS grade_id,
             g.name AS grade_name,
             lcr.started_count,
             lcr.completed_count,
             lcr.completion_rate,
             lcr.last_calculated_at
      FROM lesson_completion_rates lcr
      JOIN content_items ci ON ci.id = lcr.lesson_id
      LEFT JOIN chapters ch ON ch.id = ci.chapter_id
      LEFT JOIN subjects s ON s.id = ch.subject_id
      LEFT JOIN grades g ON g.id = s.grade_id
      WHERE lcr.release_id = ?
      ORDER BY lcr.completion_rate ASC, lcr.started_count DESC
      `
    )
    .bind(releaseId)
    .all<{
      lesson_id: string;
      lesson_title: string;
      chapter_id: string | null;
      chapter_name: string | null;
      subject_id: string | null;
      subject_name: string | null;
      grade_id: string | null;
      grade_name: string | null;
      started_count: number;
      completed_count: number;
      completion_rate: number;
      last_calculated_at: string;
    }>();

  const ratingRows = await db
    .prepare(
      `
      SELECT cra.content_item_id,
             ci.title AS content_title,
             ci.type AS content_type,
             ch.id AS chapter_id,
             ch.name AS chapter_name,
             s.id AS subject_id,
             s.name AS subject_name,
             g.id AS grade_id,
             g.name AS grade_name,
             cra.rating_count,
             cra.rating_average,
             cra.last_calculated_at
      FROM content_rating_aggregates cra
      JOIN content_items ci ON ci.id = cra.content_item_id
      LEFT JOIN chapters ch ON ch.id = ci.chapter_id
      LEFT JOIN subjects s ON s.id = ch.subject_id
      LEFT JOIN grades g ON g.id = s.grade_id
      WHERE cra.release_id = ?
      ORDER BY cra.rating_average DESC, cra.rating_count DESC
      `
    )
    .bind(releaseId)
    .all<{
      content_item_id: string;
      content_title: string;
      content_type: string;
      chapter_id: string | null;
      chapter_name: string | null;
      subject_id: string | null;
      subject_name: string | null;
      grade_id: string | null;
      grade_name: string | null;
      rating_count: number;
      rating_average: number;
      last_calculated_at: string;
    }>();

  return jsonResponse({
    release_id: releaseId,
    question_accuracy_by_topic: questionAccuracyRows.results ?? [],
    lesson_completion_rates: lessonCompletionRows.results ?? [],
    content_rating_summary: ratingRows.results ?? [],
  });
};

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (request.method === "GET" && pathname === "/") {
      return htmlResponse(renderHomePage());
    }

    if (request.method === "GET" && pathname === "/admin") {
      return htmlResponse(renderAdminOverview());
    }

    if (request.method === "POST" && pathname === "/practice-tests/generate") {
      const payload = await parseJson(request);
      if (!payload) {
        return jsonResponse({ error: "Invalid JSON payload" }, 400);
      }
      return createPracticeTest(env.DB, payload as Record<string, unknown>);
    }

    if (request.method === "GET" && pathname === "/dashboard/content") {
      const releaseId = url.searchParams.get("release_id");
      if (!releaseId) {
        return jsonResponse({ error: "release_id is required" }, 400);
      }
      const filters: ContentDashboardFilters = {
        release_id: releaseId,
        grade_id: url.searchParams.get("grade_id") ?? undefined,
        subject_id: url.searchParams.get("subject_id") ?? undefined,
        coordinator_id: url.searchParams.get("coordinator_id") ?? undefined,
      };
      const limits: DashboardLimits = {
        approvals: parseLimit(url.searchParams.get("approval_limit"), 12),
        reviews: parseLimit(url.searchParams.get("review_limit"), 12),
        timeline: parseLimit(url.searchParams.get("timeline_limit"), 20),
      };
      return fetchContentDashboard(env.DB, filters, limits);
    }

    if (request.method === "GET" && pathname === "/content/search") {
      const releaseId = url.searchParams.get("release_id");
      if (!releaseId) {
        return jsonResponse({ error: "release_id is required" }, 400);
      }
      const yearParam = url.searchParams.get("year");
      const yearValue = yearParam ? Number(yearParam) : null;
      const filters: ContentSearchFilters = {
        release_id: releaseId,
        grade_id: url.searchParams.get("grade_id") ?? undefined,
        subject_id: url.searchParams.get("subject_id") ?? undefined,
        chapter_id: url.searchParams.get("chapter_id") ?? undefined,
        type: url.searchParams.get("type") ?? undefined,
        year: Number.isFinite(yearValue) ? yearValue ?? undefined : undefined,
      };
      const limit = parseLimit(url.searchParams.get("limit"), 25);
      const offset = parseOffset(url.searchParams.get("offset"), 0);
      return fetchContentSearch(env.DB, filters, limit, offset);
    }

    const continueLearningMatch = pathname.match(/^\/users\/([^/]+)\/continue-learning\/?$/);
    if (request.method === "GET" && continueLearningMatch) {
      const limit = parseLimit(url.searchParams.get("limit"), 10);
      const recommendationLimit = parseLimit(
        url.searchParams.get("recommendation_limit"),
        5
      );
      return fetchContinueLearning(env.DB, continueLearningMatch[1], limit, recommendationLimit);
    }

    const attemptMatch = pathname.match(/^\/practice-tests\/([^/]+)\/attempts\/?$/);
    if (request.method === "POST" && attemptMatch) {
      const payload = await parseJson(request);
      if (!payload) {
        return jsonResponse({ error: "Invalid JSON payload" }, 400);
      }
      return startPracticeTestAttempt(env.DB, attemptMatch[1], payload as Record<string, unknown>);
    }

    const submitMatch = pathname.match(/^\/practice-tests\/([^/]+)\/attempts\/([^/]+)\/submit\/?$/);
    if (request.method === "POST" && submitMatch) {
      const payload = await parseJson(request);
      if (!payload) {
        return jsonResponse({ error: "Invalid JSON payload" }, 400);
      }
      return submitPracticeTestAttempt(
        env.DB,
        submitMatch[1],
        submitMatch[2],
        payload as Record<string, unknown>
      );
    }

    const ratingMatch = pathname.match(/^\/content\/([^/]+)\/ratings\/?$/);
    if (request.method === "POST" && ratingMatch) {
      const payload = await parseJson(request);
      if (!payload) {
        return jsonResponse({ error: "Invalid JSON payload" }, 400);
      }
      return upsertContentRating(env.DB, ratingMatch[1], payload as ContentRatingPayload);
    }

    if (request.method === "GET" && pathname === "/admin/reports/learning") {
      const releaseId = url.searchParams.get("release_id");
      if (!releaseId) {
        return jsonResponse({ error: "release_id is required" }, 400);
      }
      return fetchAdminLearningReport(env.DB, releaseId);
    }

    return jsonResponse({ error: "Not Found" }, 404);
  },
};
