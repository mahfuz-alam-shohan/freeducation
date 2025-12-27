import { appConfig } from "./config";
import { layout, iconHat, iconLock } from "./templates";

type Hierarchy = { classes: any[]; groups: any[]; subjects: any[]; chapters: any[]; subchapters: any[]; featuredCards?: any[] };

// Helper: Bangla Part Mapping
const partMap: Record<string, string> = { k: 'ক', kh: 'খ', g: 'গ', gh: 'ঘ', mcq: 'MCQ' };

// --- Layout Components ---

const header = (backLink?: string, title?: string) => `
  <header class="app-header">
    <div class="header-content">
      ${backLink ? `
        <a href="${backLink}" style="padding:8px; margin-left:-8px; display:flex; align-items:center; color:var(--text-muted);">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </a>
      ` : `
        <div class="brand">
          ${iconHat}
          <span>${appConfig.siteName}</span>
        </div>
      `}
      
      ${title ? `<div style="font-weight:700; font-size:16px;">${title}</div>` : ''}
      
      <div style="width:40px; display:flex; justify-content:flex-end;">
        <a href="/admin/login" style="opacity:0.3;">${iconLock}</a>
      </div>
    </div>
  </header>
`;

// --- Page Renderers ---

export const renderStudentHome = (h: Hierarchy, q: Record<string, string>) => {
  
  // 1. HOME: Class Selection
  if (!q.classId) {
    const featured = h.featuredCards?.map(c => `
      <a href="${c.target_link}" class="focus-card featured clickable" style="background:${c.bg_color || 'var(--primary)'};">
        <div style="font-size:12px; font-weight:700; opacity:0.8; text-transform:uppercase; margin-bottom:4px; letter-spacing:1px;">Featured</div>
        <h3 style="font-size:20px; margin-bottom:4px;">${c.title}</h3>
        <p style="font-size:14px; opacity:0.9; margin:0;">${c.subtitle || 'Tap to explore'}</p>
      </a>
    `).join("") || "";

    const classes = h.classes.map(c => `
      <a href="/?classId=${c.id}" class="focus-card clickable" style="display:flex; align-items:center; justify-content:space-between;">
        <div>
          <h3 style="font-size:18px;">${c.name}</h3>
          <p style="color:var(--text-muted); font-size:14px; margin-top:4px;">
            ${c.has_groups ? 'Science • Arts • Commerce' : 'General Curriculum'}
          </p>
        </div>
        <div style="background:var(--bg-app); width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:var(--primary);">
          →
        </div>
      </a>
    `).join("");

    return layout("Select Class", `
      ${header()}
      <main class="container" style="padding-top:24px;">
        ${featured}
        <div style="margin:32px 0 16px 0; font-weight:700; color:var(--text-muted); font-size:13px; letter-spacing:0.05em; text-transform:uppercase;">Select Your Class</div>
        ${classes}
      </main>
    `);
  }

  // 2. SUBJECT SELECTION
  if (!q.subjectId) {
    const cls = h.classes.find(c => String(c.id) === q.classId);
    const subjects = h.subjects.filter(s => String(s.class_id) === q.classId);

    // Group subjects visually
    const commonSubs = subjects.filter(s => !s.group_id);
    const groupSubs = subjects.filter(s => s.group_id);

    const renderSub = (s: any) => `
      <a href="/?classId=${q.classId}&subjectId=${s.id}" style="display:flex; align-items:center; justify-content:space-between; padding:16px 0; border-bottom:1px solid var(--border);">
        <span style="font-weight:600; font-size:16px;">${s.name}</span>
        <span style="color:var(--text-muted);">›</span>
      </a>
    `;

    return layout(cls.name, `
      ${header("/", cls.name)}
      <main class="container" style="padding-top:16px;">
        
        <div class="focus-card">
          <div style="font-size:12px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:8px;">Common Subjects</div>
          ${commonSubs.map(renderSub).join("")}
        </div>

        ${groupSubs.length > 0 ? `
          <div class="focus-card">
            <div style="font-size:12px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:8px;">Group Subjects</div>
            ${groupSubs.map(renderSub).join("")}
          </div>
        ` : ''}
      </main>
    `);
  }

  // 3. CHAPTER / TOPIC SELECTION
  const subject = h.subjects.find(s => String(s.id) === q.subjectId);
  const chapters = h.chapters.filter(c => String(c.subject_id) === q.subjectId);

  const chapterHtml = chapters.map(c => {
    const topics = h.subchapters.filter(sc => sc.chapter_id === c.id);
    return `
      <div class="focus-card" style="padding:0;">
        <div style="padding:16px; background:var(--bg-app); border-bottom:1px solid var(--border); font-weight:700;">
          ${c.name}
        </div>
        <div style="padding:0 16px;">
          ${topics.map(t => `
            <a href="/smart-filter?classId=${q.classId}&subjectId=${q.subjectId}&chapterId=${c.id}&subchapterId=${t.id}" 
               style="display:block; padding:16px 0; border-bottom:1px solid var(--border); font-size:15px; display:flex; justify-content:space-between;">
               <span>${t.name}</span>
               <span style="color:var(--accent); font-weight:600; font-size:13px;">Practice</span>
            </a>
          `).join("")}
          <a href="/smart-filter?chapterId=${c.id}" style="display:block; padding:16px 0; text-align:center; color:var(--accent); font-weight:600; font-size:14px;">
            Solve All ${c.name} Questions →
          </a>
        </div>
      </div>
    `;
  }).join("");

  return layout(subject.name, `
    ${header(`/?classId=${q.classId}`, subject.name)}
    <main class="container" style="padding-top:24px;">
      ${chapterHtml}
    </main>
  `);
};

export const renderResults = (questions: any[], q: Record<string, string>) => {
  // Group questions by Stem logic
  const stems: Record<number, any> = {};
  const standalone: any[] = [];

  questions.forEach(item => {
    if (item.stem_id) {
      if (!stems[item.stem_id]) {
        stems[item.stem_id] = { ...item, children: [] }; // Store stem metadata
      }
      stems[item.stem_id].children.push(item);
    } else {
      standalone.push(item);
    }
  });

  let content = "";

  // Render Connected Sets (Creative Questions)
  Object.values(stems).forEach((stem: any) => {
    content += `
      <div style="margin-bottom:40px;">
        <!-- The Scenario (Focus Block) -->
        <div class="stem-block">
          ${stem.stemContent}
          ${stem.stemImage ? `<img src="${stem.stemImage}" style="display:block; max-width:100%; margin-top:16px; border-radius:8px;">` : ''}
          <div style="margin-top:12px; font-size:12px; color:var(--text-muted); font-family:sans-serif; font-weight:600; text-transform:uppercase;">
             ${stem.sourceName || 'Board Question'} ${stem.year || ''}
          </div>
        </div>

        <!-- The Threaded Questions -->
        <div class="question-thread">
          ${stem.children.map((child: any) => `
            <div class="sub-question">
              <div style="display:flex; align-items:flex-start;">
                <div class="q-part-badge">${partMap[child.question_part] || '?'}</div>
                <div style="flex:1;">
                   <div style="font-size:16px; font-weight:500; margin-bottom:8px;">${child.prompt}</div>
                   
                   <div style="display:flex; gap:8px; flex-wrap:wrap;">
                     ${child.topicName ? `<span style="font-size:11px; background:var(--bg-app); padding:2px 8px; border-radius:4px; color:var(--text-muted);">📍 ${child.topicName}</span>` : ''}
                     ${!child.is_connected ? `<span style="font-size:11px; color:var(--accent);">Note: Concept based</span>` : ''}
                   </div>
                </div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  });

  // Render Standalone
  if (standalone.length > 0) {
    content += `
      <div style="margin:40px 0 24px 0; font-weight:800; font-size:18px; border-bottom:2px solid var(--primary); padding-bottom:8px;">
        MCQ / Short Questions
      </div>
    `;
    content += standalone.map(item => `
      <div class="focus-card" style="padding:20px;">
        <div style="font-size:16px; font-weight:600; margin-bottom:12px;">${item.prompt}</div>
        ${item.image_url ? `<img src="${item.image_url}" style="max-width:100%; border-radius:8px; margin-bottom:12px;">` : ''}
        <div style="font-size:12px; color:var(--text-muted); font-weight:600;">
           ${item.question_part === 'mcq' ? '● MCQ' : ''} • ${item.chapterName}
        </div>
      </div>
    `).join("");
  }

  if (questions.length === 0) {
    content = `
      <div class="empty-state">
        <div class="empty-icon">📝</div>
        <h3>No Questions Found</h3>
        <p>Try selecting a different topic.</p>
      </div>
    `;
  }

  // Back Link Logic
  const backLink = q.subchapterId 
    ? `/?classId=${q.classId}&subjectId=${q.subjectId}` // Back to chapters
    : `/?classId=${q.classId}`; // Back to subjects

  return layout("Practice", `
    ${header(backLink, "Question Bank")}
    <main class="container" style="padding-top:24px;">
      ${content}
    </main>
  `);
};


