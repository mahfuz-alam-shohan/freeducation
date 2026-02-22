export const authPageStyles = `
.center-wrap {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 10px;
  background:
    radial-gradient(circle at top right, #dde8ff 0%, transparent 45%),
    radial-gradient(circle at bottom left, #dcfce7 0%, transparent 46%),
    #f5f8ff;
}
.auth-card {
  width: min(500px, 100%);
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 12px;
  box-shadow: 0 16px 42px rgba(39, 71, 172, 0.12);
}
.public-login-shell { padding: 8px 6px; }
.public-auth-card { width: min(430px, 100%); border-radius: 10px; }
.form-grid { display: grid; gap: 6px; margin-top: 8px; }
label { font-size: 12px; color: #2d3f66; font-weight: 700; }
.error { color: #b91c1c; min-height: 18px; font-size: 12px; margin: 0 0 6px; }
`;
