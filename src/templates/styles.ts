export const styles = `
@import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Nunito:wght@400;600;700;800&display=swap');

:root {
  /* Brand Colors - Playful & Academic */
  --primary: #6366f1;       /* Indigo */
  --primary-dark: #4338ca;
  --secondary: #10b981;     /* Emerald (for Success/Science) */
  --accent: #f59e0b;        /* Amber (for Attention/Math) */
  --rose: #f43f5e;          /* Rose (for Alerts/Important) */
  
  /* Gradients */
  --grad-primary: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  --grad-surface: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  --grad-glass: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4));
  
  /* Backgrounds */
  --bg-body: #f1f5f9;
  --bg-card: #ffffff;
  
  /* Typography */
  --font-bn: 'Hind Siliguri', sans-serif; /* Beautiful for Bangla */
  --font-en: 'Nunito', sans-serif;       /* Rounded, friendly English */
  
  /* Effects */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-card: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.05);
  --shadow-float: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04);
  --glass-border: 1px solid rgba(255, 255, 255, 0.5);
}

* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: var(--font-en);
  background: var(--bg-body);
  color: #1e293b;
  line-height: 1.6;
  background-image: 
    radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
    radial-gradient(at 100% 0%, rgba(16, 185, 129, 0.15) 0px, transparent 50%);
  background-attachment: fixed;
}

h1, h2, h3, h4 {
  font-family: var(--font-bn);
  font-weight: 700;
  margin: 0;
  color: #0f172a;
}

/* --- Layout Components --- */
.container {
  width: min(1200px, 94vw);
  margin: 0 auto;
}

.grid { display: grid; gap: 1.5rem; }
.grid-2 { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
.grid-3 { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
.grid-4 { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }

/* --- Artistic Cards --- */
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: var(--glass-border);
  border-radius: 24px;
  padding: 1.5rem;
  box-shadow: var(--shadow-card);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  position: relative;
}

.glass-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-float);
  background: rgba(255, 255, 255, 0.9);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

/* --- Navigation --- */
.nav-bar {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  padding: 0.8rem 0;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  text-decoration: none;
}

.logo-box {
  width: 40px;
  height: 40px;
  background: var(--grad-primary);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 1.2rem;
  transform: rotate(-3deg);
}

/* --- Type-wise Tags --- */
.tag {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 99px;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: var(--font-bn);
}

.tag-math { background: #fff7ed; color: #ea580c; border: 1px solid #fed7aa; }
.tag-board { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }
.tag-guide { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
.tag-pdf { background: #fef2f2; color: #e11d48; border: 1px solid #fecaca; }

/* --- Buttons --- */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.7rem 1.4rem;
  border-radius: 16px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  font-family: var(--font-en);
}

.btn-primary {
  background: var(--grad-primary);
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}
.btn-primary:hover { transform: scale(1.02); }

.btn-soft {
  background: #e0e7ff;
  color: var(--primary-dark);
}
.btn-soft:hover { background: #c7d2fe; }

/* --- Specific Components --- */
.hero-section {
  text-align: center;
  padding: 4rem 0 2rem;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  line-height: 1.1;
  margin-bottom: 1rem;
  background: var(--grad-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.shelf-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 2rem;
  padding: 2rem 0;
}

.book-spine {
  aspect-ratio: 2/3;
  background: white;
  border-radius: 8px 16px 16px 8px;
  box-shadow: 
    inset 4px 0 0 rgba(0,0,0,0.1),
    inset 0 0 20px rgba(0,0,0,0.05),
    5px 5px 15px rgba(0,0,0,0.15);
  position: relative;
  transition: transform 0.2s;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1rem;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}
.book-spine:hover { transform: translateY(-5px) rotate(1deg); }
.book-spine::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 12px;
  background: rgba(0,0,0,0.05);
  border-right: 1px solid rgba(0,0,0,0.1);
}

.subject-icon {
  width: 60px;
  height: 60px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  margin-bottom: 1rem;
  box-shadow: 0 8px 16px -4px rgba(0,0,0,0.1);
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 16px;
  overflow: hidden;
}
.admin-table th { background: #f8fafc; text-align: left; padding: 1rem; font-size: 0.9rem; color: #64748b; }
.admin-table td { padding: 1rem; border-top: 1px solid #f1f5f9; }

/* Utilities */
.text-muted { color: #64748b; font-size: 0.9rem; }
.flex-between { display: flex; justify-content: space-between; align-items: center; }
.mb-4 { margin-bottom: 1rem; }
.mt-2 { margin-top: 0.5rem; }
.flex-wrap { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.stack { display: flex; flex-direction: column; gap: 1rem; }
input, select, textarea { width: 100%; padding: 0.75rem; border-radius: 12px; border: 1px solid #e2e8f0; font-family: inherit; }
`;


