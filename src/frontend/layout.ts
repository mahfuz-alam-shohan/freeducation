import { navBarComponent } from "./components/layout/header";
import { adminMobileNavComponent } from "./components/layout/admin-mobile-nav";
import { adminPageHeaderComponent } from "./components/layout/admin-page-header";
import { adminShellComponent } from "./components/layout/admin-shell";
import { adminSidebarComponent } from "./components/layout/admin-sidebar";
import { teacherMobileNavComponent } from "./components/layout/teacher-mobile-nav";
import { teacherShellComponent } from "./components/layout/teacher-shell";
import { teacherSidebarComponent } from "./components/layout/teacher-sidebar";
import { uiComponents } from "./components/shared/ui";
import { landingComponents } from "./public/landing";
import { authComponents } from "./public/auth";
import { dashboardComponents } from "./admin/dashboard";
import { settingsComponents } from "./admin/settings";
import { mainApp } from "./app";

export function renderAppHtml(initialView: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Freeducation - Learning Platform</title>
    
    <!-- Dependencies -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">

    <style>
        :root {
            color-scheme: light;
            --card-grid-gap: clamp(0.75rem, 1.4vw, 1.5rem);
            --card-art-ink: rgba(15, 23, 42, 0.2);
            --card-art-accent: rgba(14, 116, 144, 0.35);
            --card-art-rose: rgba(225, 29, 72, 0.28);
        }
        * { box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background-color: #f8fafc; color: #0f172a; -webkit-text-size-adjust: 100%; min-height: 100vh; }
        input, select, textarea { font-size: 16px !important; }
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-bangla { font-family: 'Noto Sans Bengali', 'Inter', sans-serif; }
        .glass-panel { background: rgba(255, 255, 255, 0.98); backdrop-filter: blur(6px); }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        .panel-shadow { box-shadow: 0 14px 28px rgba(15, 23, 42, 0.06); }
        .thumbnail-float { animation: thumbnailFloat 9s ease-in-out infinite; }
        .float-slow { animation: floatSlow 8s ease-in-out infinite; }
        .float-slower { animation: floatSlow 12s ease-in-out infinite; }
        .pulse-soft { animation: pulseSoft 10s ease-in-out infinite; }
        .bg-pan-slow { background-size: 200% 200%; animation: bgPan 16s ease infinite; }
        .marquee-wrapper { position: relative; overflow: hidden; }
        .marquee-track { display: flex; width: max-content; animation: marquee 36s linear infinite; }
        .marquee-wrapper:hover .marquee-track { animation-play-state: paused; }
        .soft-glow { background-image: linear-gradient(120deg, rgba(59, 130, 246, 0.08), rgba(14, 165, 233, 0.05), rgba(59, 130, 246, 0.08)); background-size: 200% 200%; animation: bgPan 18s ease infinite; }
        .card-grid-gap { gap: var(--card-grid-gap); }
        .card-art-surface {
            position: relative;
            overflow: hidden;
            background: linear-gradient(135deg, rgba(15, 23, 42, 0.08), rgba(15, 23, 42, 0));
        }
        .card-art-surface::before {
            content: '';
            position: absolute;
            inset: 0;
            background: repeating-linear-gradient(135deg, var(--card-art-ink) 0 2px, transparent 2px 12px);
            opacity: 0.4;
        }
        .card-art-surface::after {
            content: '';
            position: absolute;
            inset: auto -20% -30% auto;
            width: 70%;
            height: 70%;
            background: linear-gradient(120deg, var(--card-art-accent), var(--card-art-rose));
            opacity: 0.25;
            transform: rotate(-12deg);
        }
        .card-art-media {
            position: relative;
            z-index: 1;
        }
        .card-art-detail {
            position: absolute;
            top: 12px;
            right: 12px;
            z-index: 2;
            width: 36px;
            height: 36px;
            border-radius: 999px;
            border: 1px solid rgba(15, 23, 42, 0.15);
            background: linear-gradient(160deg, rgba(15, 23, 42, 0.15), rgba(255, 255, 255, 0.85));
        }
        .art-panel {
            position: relative;
            overflow: hidden;
            background: linear-gradient(120deg, rgba(15, 23, 42, 0.12), rgba(15, 23, 42, 0));
        }
        .art-panel > * {
            position: relative;
            z-index: 1;
        }
        .art-panel::before {
            content: '';
            position: absolute;
            inset: 0;
            background: repeating-linear-gradient(120deg, rgba(15, 23, 42, 0.22) 0 3px, transparent 3px 14px);
            opacity: 0.3;
        }
        .art-panel::after {
            content: '';
            position: absolute;
            inset: -30% 10% auto auto;
            width: 60%;
            height: 60%;
            background: linear-gradient(160deg, rgba(14, 116, 144, 0.45), rgba(225, 29, 72, 0.35));
            opacity: 0.35;
            transform: rotate(-6deg);
        }
        .admin-art-layer {
            position: absolute;
            inset: -20% -10% auto auto;
            width: 60%;
            height: 60%;
            background: repeating-linear-gradient(135deg, rgba(15, 23, 42, 0.18) 0 3px, transparent 3px 12px),
                linear-gradient(120deg, rgba(14, 116, 144, 0.35), rgba(59, 130, 246, 0.25));
            opacity: 0.28;
            pointer-events: none;
        }
        .admin-art-layer.secondary {
            inset: auto auto -25% -15%;
            width: 50%;
            height: 50%;
            background: repeating-linear-gradient(45deg, rgba(15, 23, 42, 0.2) 0 4px, transparent 4px 14px),
                linear-gradient(160deg, rgba(225, 29, 72, 0.35), rgba(245, 158, 11, 0.3));
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes thumbnailFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes floatSlow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes pulseSoft { 0%, 100% { opacity: 0.9; } 50% { opacity: 1; } }
        @keyframes bgPan { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) {
            .thumbnail-float {
                animation: none;
            }
            .float-slow,
            .float-slower,
            .pulse-soft,
            .bg-pan-slow,
            .marquee-track,
            .soft-glow {
                animation: none;
            }
        }
        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #e2e8f0; }
        ::-webkit-scrollbar-thumb { background: #94a3b8; border-radius: 999px; }
        ::-webkit-scrollbar-thumb:hover { background: #64748b; }
        @media (max-width: 640px) {
            .qa-container { padding: 0 !important; margin: 0 !important; }
            .qa-card { padding: 0 !important; border-radius: 0 !important; width: 100% !important; }
            .qa-card .qa-text,
            .qa-card .qa-text span { display: block; width: 100%; }
            .qa-indent { padding-left: 0 !important; }
        }
    </style>
    <style id="custom-fonts"></style>
</head>
<body>
    <div id="root"></div>

    <script>
        const loadCustomFonts = async () => {
            try {
                const response = await fetch('/api/fonts');
                if (!response.ok) return;
                const fonts = await response.json();
                if (!Array.isArray(fonts) || fonts.length === 0) return;
                const styleEl = document.getElementById('custom-fonts');
                if (!styleEl) return;
                const css = fonts.map((font) => {
                    const name = String(font.name || '').replace(/'/g, "\\'");
                    const url = font.url || '';
                    const format = font.format ? " format('" + font.format + "')" : '';
                    return "@font-face { font-family: '" + name + "'; src: url('" + url + "')" + format + "; font-display: swap; }";
                }).join('\\n');
                styleEl.textContent = css;
            } catch (err) {
                console.warn('Failed to load custom fonts', err);
            }
        };

        loadCustomFonts();
    </script>

    <script>
        window.__INITIAL_VIEW = ${JSON.stringify(initialView)};
    </script>
    <script type="text/babel">
        const { useState, useEffect } = React;

        // --- SHARED UI COMPONENTS ---
        ${uiComponents}

        // --- LAYOUT COMPONENTS ---
        ${navBarComponent}
        ${adminSidebarComponent}
        ${adminMobileNavComponent}
        ${adminPageHeaderComponent}
        ${adminShellComponent}
        ${teacherSidebarComponent}
        ${teacherMobileNavComponent}
        ${teacherShellComponent}

        // --- VIEW LOGIC ---
        ${authComponents}
        ${landingComponents}
        ${dashboardComponents}
        ${settingsComponents}

        // --- MAIN APP ---
        ${mainApp}

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>
  `;
}
