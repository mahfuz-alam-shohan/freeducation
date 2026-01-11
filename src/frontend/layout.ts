import { navBarComponent } from './shared/components/layout/header';
import { adminMobileNavComponent } from './shared/components/layout/admin-mobile-nav';
import { adminPageHeaderComponent } from './shared/components/layout/admin-page-header';
import { adminShellComponent } from './shared/components/layout/admin-shell';
import { adminSidebarComponent } from './shared/components/layout/admin-sidebar';
import { teacherMobileNavComponent } from './shared/components/layout/teacher-mobile-nav';
import { teacherShellComponent } from './shared/components/layout/teacher-shell';
import { teacherSidebarComponent } from './shared/components/layout/teacher-sidebar';
import { studentMobileNavComponent } from './shared/components/layout/student-mobile-nav';
import { studentShellComponent } from './shared/components/layout/student-shell';
import { studentSidebarComponent } from './shared/components/layout/student-sidebar';
import { uiComponents } from './shared/components/ui';
import { landingComponents, authComponents } from './modules/users/public';
import { adminDashboardComponents, settingsComponents } from './modules/users/admin';
import { studentDashboardComponents } from './modules/users/student';
import { teacherDashboardComponents } from './modules/users/teacher';
import { mainApp } from './app';

export function renderAppHtml(initialView: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Freeducation - Learning Platform</title>
    
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
            --ui-surface: #ffffff;
            --ui-soft: #f3f6ff;
            --ui-muted: #e2e8f0;
        }
        * { box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; font-size: 15px; background-color: var(--ui-soft); color: #0f172a; -webkit-text-size-adjust: 100%; min-height: 100vh; }
        input, select, textarea { font-size: 16px !important; }
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-bangla { font-family: 'Noto Sans Bengali', 'Inter', sans-serif; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        .thumbnail-float { animation: thumbnailFloat 9s ease-in-out infinite; }
        .float-slow { animation: floatSlow 8s ease-in-out infinite; }
        .float-slower { animation: floatSlow 12s ease-in-out infinite; }
        .pulse-soft { animation: pulseSoft 10s ease-in-out infinite; }
        .marquee-wrapper { position: relative; overflow: hidden; }
        .marquee-track { display: flex; width: max-content; animation: marquee 36s linear infinite; }
        .marquee-wrapper:hover .marquee-track { animation-play-state: paused; }
        .soft-glow { background-color: #eef2ff; }
        .card-grid-gap { gap: var(--card-grid-gap); }
        .card-art-surface {
            position: relative;
            overflow: hidden;
            background: #f1f5f9;
        }
        .card-art-media {
            position: relative;
            z-index: 1;
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes thumbnailFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes floatSlow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes pulseSoft { 0%, 100% { opacity: 0.9; } 50% { opacity: 1; } }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) {
            .thumbnail-float {
                animation: none;
            }
            .float-slow,
            .float-slower,
            .pulse-soft,
            .marquee-track,
            .soft-glow {
                animation: none;
            }
        }
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
        const { useState, useEffect, useRef } = React;

        ${uiComponents}

        ${navBarComponent}
        ${adminSidebarComponent}
        ${adminMobileNavComponent}
        ${adminPageHeaderComponent}
        ${adminShellComponent}
        ${teacherSidebarComponent}
        ${teacherMobileNavComponent}
        ${teacherShellComponent}
        ${studentSidebarComponent}
        ${studentMobileNavComponent}
        ${studentShellComponent}

        ${authComponents}
        ${landingComponents}
        ${adminDashboardComponents}
        ${teacherDashboardComponents}
        ${studentDashboardComponents}
        ${settingsComponents}

        ${mainApp}

        const root = ReactDOM.createRoot(document.getElementById('root'));
        try {
            root.render(<App />);
        } catch (error) {
            console.error('Failed to render app', error);
            const rootEl = document.getElementById('root');
            if (rootEl) {
                rootEl.innerHTML = '<div style="padding:24px;font-family:Inter, sans-serif;"><h2>Something went wrong.</h2><p>Please refresh the page or contact support if the problem persists.</p></div>';
            }
        }
    </script>
</body>
</html>
  `;
}
