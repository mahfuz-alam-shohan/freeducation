export const dashboardStyles = `
.kpi-grid .kpi-card { border-radius: 8px; border: 1px solid var(--line); box-shadow: var(--shadow-soft); }
.kpi-grid .kpi-card:nth-child(1) { background: linear-gradient(135deg, #eff4ff 0%, #ffffff 100%); }
.kpi-grid .kpi-card:nth-child(2) { background: linear-gradient(135deg, #e9fce8 0%, #ffffff 100%); }
.kpi-grid .kpi-card:nth-child(3) { background: linear-gradient(135deg, #fff7e8 0%, #ffffff 100%); }
.kpi { margin-top: 6px; font-size: 36px; font-weight: 700; line-height: 1.05; color: #1a2a52; }
@media (max-width: 840px) { .kpi { font-size: 30px; } }
`;
