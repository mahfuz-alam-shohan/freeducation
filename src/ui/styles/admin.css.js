import { DESIGN_TOKENS } from "../theme/designSystem.js";

const { colors, spacing, radius, layout } = DESIGN_TOKENS;

export const ADMIN_CSS = `
:root{color-scheme:dark;--bg:${colors.bg};--panel:${colors.panel};--line:${colors.line};--txt:${colors.text};--muted:${colors.muted};--accent:${colors.accent};--space-xs:${spacing.xs};--space-sm:${spacing.sm};--radius-sm:${radius.sm};--radius-md:${radius.md}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--txt);font:14px/1.45 Inter,system-ui,sans-serif}
a{text-decoration:none;color:inherit}
input,button{font:inherit}
.page{min-height:100vh}
.stack{display:grid;gap:var(--space-sm)}
.card{background:var(--panel);border:1px solid var(--line);border-radius:var(--radius-md);padding:var(--space-sm)}
.auth{max-width:420px;margin:24px auto;padding:0 var(--space-sm)}
label{display:grid;gap:${spacing.xxs};color:var(--muted);font-size:12px}
input{background:#0f1728;border:1px solid var(--line);border-radius:var(--radius-sm);color:var(--txt);padding:var(--space-xs)}
button{border:0;border-radius:var(--radius-sm);background:var(--accent);color:#031227;padding:var(--space-xs) var(--space-sm);font-weight:600;cursor:pointer}
button.secondary{background:#1a2640;color:var(--txt)}
.muted{color:var(--muted)}

.admin{display:grid;grid-template-columns:1fr;min-height:100vh}
.sidebar{border-bottom:1px solid var(--line);background:#0f1728;padding:var(--space-sm);display:grid;gap:var(--space-xs)}
.brand{font-weight:700}
.nav{display:flex;gap:6px;flex-wrap:wrap}
.nav a{padding:7px 9px;border-radius:var(--radius-sm);color:var(--muted)}
.nav a.active,.nav a:hover{background:#16233a;color:var(--txt)}
.main{display:grid;grid-template-rows:auto 1fr auto}
.header,.footer{padding:var(--space-sm);border-bottom:1px solid var(--line)}
.footer{border-top:1px solid var(--line);border-bottom:0;color:var(--muted)}
.content{padding:var(--space-sm);display:grid;gap:var(--space-sm)}
.kpi{font-size:24px;font-weight:700}
.grid{display:grid;gap:var(--space-sm);grid-template-columns:1fr}
.table{width:100%;border-collapse:collapse}
th,td{text-align:left;padding:var(--space-xs);border-bottom:1px solid var(--line)}

@media (min-width:${layout.desktopBreakpoint}){
  .admin{grid-template-columns:${layout.desktopNavWidth} 1fr}
  .sidebar{border-right:1px solid var(--line);border-bottom:0;align-content:start}
  .nav{display:grid;gap:${spacing.xxs}}
}
`;
