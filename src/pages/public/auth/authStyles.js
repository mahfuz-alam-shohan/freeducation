export const authPageStyles = `
.center-wrap {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 10px;
  background:
    radial-gradient(circle at top right, #d9e6ff 0%, transparent 45%),
    radial-gradient(circle at bottom left, #cfffe9 0%, transparent 46%),
    radial-gradient(circle at 58% 12%, #fff1b4 0%, transparent 32%),
    #eef3ff;
}
.auth-card {
  width: min(500px, 100%);
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border: 1px solid #c8d8f8;
  border-radius: 14px;
  padding: 12px;
  box-shadow: 0 18px 36px rgba(54, 76, 157, 0.16);
}
.public-login-shell { padding: 8px 6px; }
.public-auth-card { width: min(430px, 100%); border-radius: 14px; }
.form-grid { display: grid; gap: 6px; margin-top: 8px; }
label { font-size: 12px; color: #2f4380; font-weight: 700; }
.error { color: #c2264a; min-height: 18px; font-size: 12px; margin: 0 0 6px; }
`;
