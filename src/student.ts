import { appConfig } from "./config";
import { layout, iconHat, iconLock } from "./templates";

type Hierarchy = { classes: any[]; groups: any[]; subjects: any[]; chapters: any[]; subchapters: any[]; featuredCards?: any[] };

const header = () => `
  <header class="app-header">
    <div class="brand">${iconHat} <span>${appConfig.siteName}</span></div>
    <div class="header-right"><a href="/admin/login" style="color:var(--text-sub); opacity:0.3;">${iconLock}</a></div>
  </header>
`;

// Map part codes to Bangla
const partMap: Record<string, string> = { k: 'ক', kh: 'খ', g: 'গ', gh: 'ঘ', mcq: 'MCQ' };
const partColor: Record<string, string> = { k: '#f1f5f9', kh: '#f1f5f9', g: '#eff6ff', gh: '#eff6ff' };

export const renderStudentHome = (h: Hierarchy, q: Record<string, string>) => {
  // 1. FEATURED CARDS (Banners)
  const cardsHtml = h.featuredCards && h.featuredCards.length > 0 
    ? `
    <div class="nav-scroll" style="top:0; background:none; padding:0 0 16px 0;">
      ${h.featuredCards.map(c => `
        <a href="${c.target_link}" style="min-width:240px; background:${c.bg_color}; border-radius:12px; padding:16px; color:#111; border:1px solid rgba(0,0,0,0.1); display:flex; flex-direction:column; justify-content:center;">
           <div style="font-weight:700; font-size:15px; margin-bottom:4px;">${c.title}</div>
           <div style="font-size:12px; opacity:0.8;">${c.subtitle || 'Click to view'}</div>
        </a>
      `).join("")}
    </div>` 
    : '';

  // 2. CLASS SELECTION
  if (!q.classId) {
    const classCards = h.classes.map(c => `
      <div class="card card-clickable">
        <a href="/?classId=${c.id}" style="display:block; padding:20px; text-align:center;">
          <div style="font-size:32px; margin-bottom:8px;">📚</div>
          <h3 style="font-size:18px; margin-bottom:4px;">${c.name}</h3>
          <p style="font-size:13px; color:var(--text-sub);">${c.has_groups ? 'Science • Arts • Commerce' : 'General'}</p>
          <div style="margin-top:16px;"><span class="tag tag-blue">Enter</span></div>
        </a>
      </div>
    `).join("");

    return layout("Select Class", `
      ${header()}
      <main class="container" style="padding-top:24px;">
        ${cardsHtml}
        <h2 style="text-align:center; margin:16px 0 24px 0;">Select Your Class</h2>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:16px;">${classCards}</div>
      </main>
    `);
  }

  // 3. SUBJECT SELECTION
  if (!q.subjectId) {
    const cls = h.classes.find(c => String(c.id) === q.classId);
    const visibleSubjects = h.subjects.filter(s => String(s.class_id) === q.classId);
    
    return layout(cls.name, `
      ${header()}
      <div style="background:#fff; padding:12px; border-bottom:1px solid var(--border);">
        <div class="container">
          <a href="/" class="tag tag-gray">← Classes</a>
          <h2 style="margin-top:8px;">${cls.name} Subjects</h2>
        </div>
      </div>
      <main class="container" style="padding-top:16px;">
        <div class="card">
          ${visibleSubjects.map(s => `
            <a href="/?classId=${q.classId}&subjectId=${s.id}" class="list-row card-clickable">
              <div class="list-content"><h4>${s.name}</h4><p>${h.groups.find(g=>g.id===s.group_id)?.name||'Common'}</p></div>
              <div style="color:var(--text-sub);">›</div>
            </a>
          `).join("")}
        </div>
      </main>
    `);
  }

  // 4. CHAPTER/TOPIC SELECTION
  const subject = h.subjects.find(s => String(s.id) === q.subjectId);
  const chapters = h.chapters.filter(c => String(c.subject_id) === q.subjectId);

  return layout(subject.name, `
    ${header()}
    <div style="background:#fff; padding:12px; border-bottom:1px solid var(--border);">
      <div class="container"><a href="/?classId=${q.classId}" class="tag tag-gray">← Subjects</a><h2 style="margin-top:8px;">${subject.name}</h2></div>
    </div>
    <main class="container" style="padding-top:16px;">
      ${chapters.map(c => {
         const topics = h.subchapters.filter(sc => sc.chapter_id === c.id);
         return `
         <div class="card">
           <div class="card-header"><span>${c.name}</span><span style="font-size:11px; opacity:0.6;">${topics.length} Topics</span></div>
           <div style="padding:8px 0;">
             ${topics.map(t => `<a href="/smart-filter?classId=${q.classId}&subjectId=${q.subjectId}&chapterId=${c.id}&subchapterId=${t.id}" style="display:block; padding:10px 16px; border-left:2px solid var(--border); margin-left:16px; font-size:14px; color:var(--text-sub);">• ${t.name}</a>`).join("")}
             <div style="padding:8px 16px; border-top:1px dashed var(--border); margin-top:8px;"><a href="/smart-filter?chapterId=${c.id}" class="btn-sm btn-secondary" style="width:100%; display:inline-block; text-align:center;">Practice All ${c.name}</a></div>
           </div>
         </div>`;
      }).join("")}
    </main>
  `);
};

export const renderResults = (questions: any[], q: Record<string,string>) => {
  // GROUP QUESTIONS BY STEM
  // 1. Identify all stems
  const stems: Record<number, any> = {};
  const standalone: any[] = [];

  questions.forEach(item => {
    if (item.stem_id) {
      if (!stems[item.stem_id]) {
        stems[item.stem_id] = { 
          content: item.stemContent, 
          image: item.stemImage, 
          source: item.sourceName, 
          year: item.year,
          children: [] 
        };
      }
      stems[item.stem_id].children.push(item);
    } else {
      standalone.push(item);
    }
  });

  // 2. Render HTML
  let contentHtml = '';

  // Render Linked CQs
  Object.values(stems).forEach((stem: any) => {
    contentHtml += `
      <div class="card" style="border-left:4px solid var(--accent);">
        <div class="card-body">
          <div style="background:#f1f5f9; padding:12px; border-radius:8px; font-size:15px; margin-bottom:16px; font-family:'Georgia', serif; line-height:1.6;">
            ${stem.content}
            ${stem.image ? `<img src="${stem.image}" style="display:block; max-width:100%; margin-top:12px; border-radius:4px;">` : ''}
          </div>
          <div style="margin-bottom:12px; display:flex; gap:8px;">
             <span class="tag tag-gray">${stem.source||'Board'} '${stem.year||''}</span>
          </div>

          <!-- Questions K, Kh, G, Gh -->
          <div style="display:flex; flex-direction:column; gap:12px;">
            ${stem.children.map((child: any) => `
               <div style="background:${partColor[child.question_part] || '#fff'}; padding:8px 12px; border-radius:6px; border:1px solid var(--border);">
                 <div style="display:flex; gap:8px;">
                   <span style="font-weight:700; color:var(--primary); width:24px;">(${partMap[child.question_part] || '?'})</span>
                   <div style="flex:1;">
                     <div style="font-size:15px; margin-bottom:4px;">${child.prompt}</div>
                     ${child.topicName ? `<span class="tag tag-purple" style="font-size:10px;">${child.topicName}</span>` : ''}
                     ${!child.is_connected ? `<span class="tag tag-gray" style="font-size:10px;">Stem Independent</span>` : ''}
                   </div>
                 </div>
               </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;
  });

  // Render Standalone MCQs
  if (standalone.length > 0) {
    contentHtml += `<div style="font-weight:700; color:var(--text-sub); margin:24px 0 12px 0;">STANDALONE QUESTIONS</div>`;
    contentHtml += standalone.map(item => `
      <div class="card">
        <div class="card-body">
          <div style="font-size:15px; font-weight:500; line-height:1.6; margin-bottom:8px;">${item.prompt}</div>
          ${item.image_url ? `<img src="${item.image_url}" style="max-width:100%; border-radius:8px; margin-bottom:12px;">` : ''}
          <div style="display:flex; gap:8px;">
            <span class="tag tag-blue">MCQ</span>
            <span class="tag tag-gray">${item.chapterName}</span>
          </div>
        </div>
      </div>
    `).join("");
  }

  if (questions.length === 0) contentHtml = `<div style="text-align:center; padding:40px; color:var(--text-sub);">No questions found.</div>`;

  return layout("Questions", `
    ${header()}
    <div style="background:#fff; padding:12px; border-bottom:1px solid var(--border);">
      <div class="container"><button onclick="history.back()" class="tag tag-gray">← Back</button><h2 style="margin-top:8px;">Practice Board Questions</h2></div>
    </div>
    <main class="container" style="padding-top:16px;">${contentHtml}</main>
  `);
};


