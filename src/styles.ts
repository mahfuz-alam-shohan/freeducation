import { THEME } from "./config";

export const baseStyles = `
:root {
  color-scheme: light;
  --primary: ${THEME.primary};
  --primary-dark: ${THEME.primaryDark};
  --accent: ${THEME.accent};
  --background: ${THEME.background};
  --text: ${THEME.text};
  --muted: ${THEME.muted};
  --card: ${THEME.card};
  --border: ${THEME.border};
}
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  font-family: "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
  background: var(--background);
  color: var(--text);
}
header {
  background: var(--card);
  border-bottom: 1px solid var(--border);
  padding: 1.25rem 1rem;
  position: sticky;
  top: 0;
  z-index: 10;
}
header .brand {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--primary);
}
main {
  padding: 1.5rem 1rem 3rem;
  max-width: 1100px;
  margin: 0 auto;
}
.hero {
  display: grid;
  gap: 1.5rem;
}
.hero h1 {
  font-size: 1.8rem;
  margin: 0;
}
.hero p {
  color: var(--muted);
  margin: 0;
}
.grid {
  display: grid;
  gap: 1rem;
}
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 1.25rem;
  box-shadow: 0 12px 30px rgba(31, 79, 178, 0.08);
}
.card h3 {
  margin-top: 0;
  margin-bottom: 0.75rem;
}
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
  background: rgba(31, 79, 178, 0.08);
  color: var(--primary);
  font-size: 0.8rem;
  font-weight: 600;
}
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  border: none;
  background: var(--primary);
  color: white;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
}
.button.secondary {
  background: white;
  color: var(--primary);
  border: 1px solid var(--primary);
}
.section-title {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.15rem;
}
.list {
  display: grid;
  gap: 0.75rem;
}
.list-item {
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--card);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
form {
  display: grid;
  gap: 0.75rem;
}
label {
  font-weight: 600;
  font-size: 0.9rem;
}
input, select, textarea {
  padding: 0.7rem 0.85rem;
  border-radius: 10px;
  border: 1px solid var(--border);
  font-size: 0.95rem;
}
textarea {
  min-height: 100px;
}
footer {
  padding: 2rem 1rem;
  text-align: center;
  color: var(--muted);
}
@media (min-width: 768px) {
  .hero {
    grid-template-columns: 1.2fr 1fr;
    align-items: center;
  }
  .grid {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }
}
`;
