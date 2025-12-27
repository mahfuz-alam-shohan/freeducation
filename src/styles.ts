export const baseStyles = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

:root {
  /* --- Modern Palette --- */
  --bg-app: #f0f4f8;        
  --bg-card: #ffffff;
  --bg-stem: #eef2ff;       
  
  --primary: #2563eb;       /* Brand Blue */
  --primary-dark: #1e40af;
  --accent: #f59e0b;        /* Amber for highlights */
  
  --text-main: #0f172a;     /* Slate 900 */
  --text-body: #334155;     /* Slate 700 */
  --text-muted: #64748b;    /* Slate 500 */
  
  --border: #e2e8f0;
  
  /* --- Shadows & Radius --- */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  
  --radius-lg: 16px;
  --radius-md: 12px;
  --radius-sm: 8px;
  
  --header-height: 70px;
}

* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

body {
  margin: 0;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  background: var(--bg-app);
  color: var(--text-body);
  font-size: 16px;
  line-height: 1.6;
  padding-bottom: env(safe-area-inset-bottom);
}

a { text-decoration: none; color: inherit; transition: all 0.2s ease; }

/* --- Typography --- */
h1, h2, h3, h4 { margin: 0; font-weight: 700; color: var(--text-main); letter-spacing: -0.02em; }
h1 { font-size: 28px; }
h2 { font-size: 24px; }
h3 { font-size: 18px; }

.container {
  max-width: 768px;
  margin: 0 auto;
  padding: 0 16px;
}

/* --- Header --- */
.app-header {
  height: var(--header-height);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  box-shadow: var(--shadow-sm);
}

.header-content {
  width: 100%;
  max-width: 768px;
  margin: 0 auto;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  font-size: 20px;
  font-weight: 800;
  color: var(--primary);
  display: flex;
  align-items: center;
  gap: 10px;
}

/* --- Cards --- */
.focus-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  overflow: hidden;
}

.focus-card.clickable:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary);
}

.focus-card.clickable:active {
  transform: scale(0.98);
}

/* Featured Card (Gradient) */
.focus-card.featured {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: #fff;
  border: none;
  box-shadow: var(--shadow-lg);
}
.focus-card.featured h3 { color: #fff; }
.focus-card.featured p { color: rgba(255,255,255,0.9); }

/* --- Stem Block (Reading Mode) --- */
.stem-block {
  background: var(--bg-stem);
  padding: 24px;
  border-radius: var(--radius-md);
  margin-bottom: 24px;
  border-left: 4px solid var(--primary);
  font-family: 'Georgia', serif;
  font-size: 18px;
  color: #1e293b;
  line-height: 1.8;
}

/* --- Questions --- */
.question-thread {
  position: relative;
  padding-left: 20px;
  margin-left: 10px;
  border-left: 2px solid var(--border);
}

.sub-question {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 16px;
  margin-bottom: 16px;
  position: relative;
  box-shadow: var(--shadow-sm);
}

.sub-question::before {
  content: '';
  position: absolute;
  left: -22px;
  top: 24px;
  width: 20px;
  height: 2px;
  background: var(--border);
}

.q-part-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg-stem);
  color: var(--primary);
  font-weight: 700;
  font-size: 14px;
  margin-right: 12px;
  flex-shrink: 0;
  border: 1px solid var(--border);
}

/* --- Buttons --- */
button, .btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 15px;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-primary {
  background: var(--primary);
  color: #fff;
  width: 100%;
}
.btn-primary:active { opacity: 0.9; }

/* --- Error Pages --- */
.error-container {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 20px;
}
.error-icon { font-size: 64px; margin-bottom: 24px; }
.error-title { font-size: 24px; margin-bottom: 8px; }
.error-msg { color: var(--text-muted); max-width: 400px; margin: 0 auto; }
`;
