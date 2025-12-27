import { layout, escapeHtml } from './utils';
import { css } from './styles';
import { Session } from './config';

export function renderLogin(error?: string) {
  const body = `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bg);">
      <div class="card" style="width: 100%; max-width: 400px;">
        <div style="text-align: center; margin-bottom: 2rem;">
          <h2 style="color: var(--primary); font-weight: 800;">Freeducation.</h2>
          <p style="color: var(--muted);">Staff Access Portal</p>
        </div>
        
        ${error ? `<div style="background: #fef2f2; color: #dc2626; padding: 0.75rem; border-radius: 8px; margin-bottom: 1rem; font-size: 0.9rem;">${error}</div>` : ''}
        
        <form method="POST" class="grid" style="gap: 1rem;">
          <div class="input-group">
            <label>Email Address</label>
            <input type="email" name="email" required placeholder="admin@freeducation.bd">
          </div>
          <div class="input-group">
            <label>Password</label>
            <input type="password" name="password" required>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%;">Sign In</button>
        </form>
        <div style="text-align: center; margin-top: 1.5rem;">
          <a href="/" style="font-size: 0.9rem; color: var(--muted);">&larr; Back to Library</a>
        </div>
      </div>
    </div>
  `;
  return layout("Staff Login", body, css);
}

export function renderDashboard(session: Session, content: string) {
  const body = `
    <div class="admin-layout">
      <aside class="sidebar">
        <a href="/admin/dashboard" class="sidebar-brand">Freeducation.</a>
        <nav>
          <a href="/admin/dashboard" class="sidebar-link active">Dashboard</a>
          <a href="/admin/dashboard" class="sidebar-link">My Uploads</a>
          <a href="/admin/dashboard" class="sidebar-link">Settings</a>
          <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #334155;">
             <div style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 0.5rem;">Logged in as:</div>
             <div style="font-weight: 600; margin-bottom: 1rem;">${escapeHtml(session.full_name)}</div>
             <a href="/admin/logout" class="sidebar-link" style="color: #fca5a5;">Sign Out</a>
          </div>
        </nav>
      </aside>
      
      <main class="admin-main">
        ${content}
      </main>
    </div>
  `;
  return layout("Dashboard", body, css);
}

export function renderUploadForm(success?: boolean) {
  return `
    <div class="flex justify-between items-center mb-4">
      <h1 style="font-size: 1.8rem; font-weight: 700;">Dashboard</h1>
      <a href="/" target="_blank" class="btn btn-outline">View Live Site &rarr;</a>
    </div>

    ${success ? `<div style="background: #dcfce7; color: #166534; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">Resource published successfully!</div>` : ''}

    <div class="card">
      <h3 style="margin-bottom: 1.5rem; font-size: 1.1rem; border-bottom: 1px solid var(--border); padding-bottom: 0.75rem;">Add New Resource</h3>
      <form method="POST" action="/admin/dashboard/add">
        <div class="grid">
          <div class="input-group">
            <label>Resource Title</label>
            <input type="text" name="title" required placeholder="e.g. Higher Math Solution 2024">
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="input-group">
              <label>Type</label>
              <select name="type">
                <option value="pdf">PDF Document</option>
                <option value="video">Video Lecture</option>
                <option value="tool">Interactive Tool</option>
              </select>
            </div>
            <div class="input-group">
              <label>Category / Tag</label>
              <input type="text" name="category" required placeholder="e.g. Physics 1st Paper">
            </div>
          </div>

          <div class="input-group">
            <label>Direct URL (GDrive, YouTube, etc)</label>
            <input type="url" name="url" required placeholder="https://...">
          </div>

          <div class="input-group">
            <label>Description (Optional)</label>
            <textarea name="description" rows="3" placeholder="Brief details about what this contains..."></textarea>
          </div>

          <div class="flex" style="justify-content: flex-end;">
            <button type="submit" class="btn btn-primary">Publish to Library</button>
          </div>
        </div>
      </form>
    </div>
  `;
}
