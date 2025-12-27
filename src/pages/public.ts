import { layout, escapeHtml } from '../utils';
import { css } from '../styles';
import { Resource } from '../config';

export function renderStudentHome(resources: Resource[]) {
  // Client-side script for instant filtering
  const script = `
    <script>
      function filterResources() {
        const input = document.getElementById('searchInput').value.toLowerCase();
        const cards = document.querySelectorAll('.resource-card');
        let hasVisible = false;
        
        cards.forEach(card => {
          const text = card.innerText.toLowerCase();
          if (text.includes(input)) {
            card.style.display = 'block';
            hasVisible = true;
          } else {
            card.style.display = 'none';
          }
        });
        
        document.getElementById('no-results').style.display = hasVisible ? 'none' : 'block';
      }
    </script>
  `;

  const resourceCards = resources.map(r => `
    <article class="card resource-card">
      <div class="flex justify-between items-center mb-4">
        <span class="badge ${r.type === 'video' ? 'badge-purple' : r.type === 'pdf' ? 'badge-blue' : 'badge-orange'}">
          ${r.type.toUpperCase()}
        </span>
        <span style="font-size: 0.8rem; color: var(--muted);">${new Date(r.created_at * 1000).toLocaleDateString()}</span>
      </div>
      <h3 style="font-weight: 700; font-size: 1.15rem; margin-bottom: 0.5rem;">
        <a href="${escapeHtml(r.url)}" target="_blank" style="color: inherit;">${escapeHtml(r.title)}</a>
      </h3>
      <p style="color: var(--muted); font-size: 0.95rem; margin-bottom: 1.5rem; line-height: 1.6;">
        ${escapeHtml(r.description)}
      </p>
      <div class="flex justify-between items-center" style="margin-top: auto;">
        <span style="font-size: 0.85rem; font-weight: 600; color: var(--muted);">#${escapeHtml(r.category)}</span>
        <a href="${escapeHtml(r.url)}" target="_blank" class="btn btn-outline" style="padding: 0.4rem 1rem; font-size: 0.85rem;">
          Access Now &rarr;
        </a>
      </div>
    </article>
  `).join('');

  const body = `
    <nav style="border-bottom: 1px solid var(--border); background: white;">
      <div class="container flex justify-between items-center" style="height: 60px;">
        <a href="/" style="font-weight: 800; font-size: 1.25rem; color: var(--primary);">Freeducation.</a>
        <a href="/admin/login" style="font-size: 0.85rem; color: var(--muted);">Staff Login</a>
      </div>
    </nav>

    <header class="hero">
      <div class="container">
        <h1>Learn anything, for free.</h1>
        <p>A community-driven library for Bangladeshi students. No signup required.</p>
        
        <div class="search-bar">
          <span class="search-icon">🔍</span>
          <input type="text" id="searchInput" class="search-input" placeholder="Search for Physics, Math, or HSC..." onkeyup="filterResources()">
        </div>
      </div>
    </header>

    <main class="container" style="padding-bottom: 4rem;">
      <div class="flex items-center gap-4 mb-4" style="overflow-x: auto; padding-bottom: 0.5rem;">
        <span style="font-weight: 600; font-size: 0.9rem; white-space: nowrap;">Quick Filters:</span>
        <button class="btn btn-outline" style="border-radius: 99px; padding: 0.3rem 0.8rem; font-size: 0.8rem;" onclick="document.getElementById('searchInput').value='PDF'; filterResources()">📚 Books</button>
        <button class="btn btn-outline" style="border-radius: 99px; padding: 0.3rem 0.8rem; font-size: 0.8rem;" onclick="document.getElementById('searchInput').value='Video'; filterResources()">🎥 Videos</button>
        <button class="btn btn-outline" style="border-radius: 99px; padding: 0.3rem 0.8rem; font-size: 0.8rem;" onclick="document.getElementById('searchInput').value='HSC'; filterResources()">🎓 HSC</button>
      </div>

      <div class="grid grid-cols-2" id="resource-grid">
        ${resources.length > 0 ? resourceCards : `<div class="card" style="grid-column: 1/-1; text-align: center; padding: 3rem;"><h3>Library is Empty</h3><p>Check back later.</p></div>`}
      </div>
      
      <div id="no-results" style="display: none; text-align: center; padding: 3rem; color: var(--muted);">
        <h3>No matches found</h3>
        <p>Try searching for something else.</p>
      </div>
    </main>

    <footer style="border-top: 1px solid var(--border); padding: 2rem 0; text-align: center; font-size: 0.9rem; color: var(--muted);">
      <p>&copy; ${new Date().getFullYear()} Freeducation Bangladesh.</p>
    </footer>
    ${script}
  `;

  return layout("Freeducation | Free Learning", body, css);
}
