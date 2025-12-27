export const baseStyles = `
:root {
  color-scheme: light;
  --primary: #123a7f;
  --primary-dark: #0c2a5e;
  --primary-soft: #e7eefc;
  --accent: #f4b400;
  --text: #1b1d23;
  --muted: #4c5565;
  --border: #d7dde8;
  --background: #f7f9fc;
  --card: #ffffff;
  --success: #1f7a3f;
}

* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
  background: var(--background);
  color: var(--text);
}

a { color: inherit; text-decoration: none; }

header {
  padding: 1.5rem 1.25rem;
  background: var(--card);
  border-bottom: 1px solid var(--border);
}

main {
  padding: 1.5rem 1.25rem 3rem;
}

.container {
  max-width: 1080px;
  margin: 0 auto;
}

.hero {
  display: grid;
  gap: 1rem;
}

.hero h1 {
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  margin: 0;
}

.hero p {
  color: var(--muted);
  margin: 0;
}

.card-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  margin-top: 1.5rem;
}

.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 1.25rem;
  box-shadow: 0 10px 20px rgba(17, 31, 68, 0.05);
}

.card h3 {
  margin-top: 0;
}

.badge {
  display: inline-flex;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
  background: var(--primary-soft);
  color: var(--primary-dark);
  font-size: 0.75rem;
  font-weight: 600;
}

button, input, select, textarea {
  font: inherit;
}

form {
  display: grid;
  gap: 0.75rem;
}

input, select, textarea {
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: #fff;
}

button {
  padding: 0.7rem 1rem;
  border-radius: 10px;
  border: none;
  background: var(--primary);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

button.secondary {
  background: #fff;
  border: 1px solid var(--border);
  color: var(--primary-dark);
}

.section-title {
  margin-top: 2rem;
  margin-bottom: 0.5rem;
}

.dashboard {
  display: grid;
  gap: 1.5rem;
}

.notice {
  padding: 0.75rem 1rem;
  border-radius: 12px;
  background: var(--primary-soft);
  color: var(--primary-dark);
  border: 1px solid #c3d3f5;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.table th,
.table td {
  text-align: left;
  padding: 0.6rem 0.4rem;
  border-bottom: 1px solid var(--border);
}

@media (min-width: 900px) {
  .hero {
    grid-template-columns: 1.1fr 0.9fr;
    align-items: center;
  }
}
`;
