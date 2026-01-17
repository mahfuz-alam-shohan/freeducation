const baseStyles = `
  :root {
    color-scheme: light;
    --bg: #f7f8fb;
    --panel: #ffffff;
    --border: #d7dbe5;
    --text: #182230;
    --muted: #5f6c7b;
    --primary: #2155cd;
    --primary-soft: #e8efff;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: "Inter", system-ui, -apple-system, sans-serif;
    color: var(--text);
    background: var(--bg);
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  .form-grid {
    display: grid;
    gap: 10px;
  }

  label {
    font-size: 12px;
    color: var(--muted);
  }

  input {
    width: 100%;
    padding: 8px 10px;
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 14px;
    background: #fff;
  }

  button {
    border: none;
    background: var(--primary);
    color: #fff;
    padding: 8px 12px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
  }

  .secondary {
    background: #fff;
    color: var(--primary);
    border: 1px solid var(--primary);
  }

  .message {
    padding: 8px 10px;
    border-radius: 8px;
    background: var(--primary-soft);
    color: var(--primary);
    font-size: 12px;
    display: inline-block;
  }

  .card {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 12px;
    margin-bottom: 12px;
  }

  .section-title {
    font-size: 15px;
    margin: 0 0 6px;
  }

  .small {
    font-size: 12px;
    color: var(--muted);
  }
`;

export { baseStyles };
