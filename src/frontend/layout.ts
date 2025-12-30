import { navBarComponent } from "./components/navbar";
import { landingHeaderComponent } from "./components/header";
import { classSidebarComponent } from "./components/sidebar";
import { uiComponents } from "./components/ui";
import { authComponents } from "./views/auth";
import { studentComponents } from "./views/student";
import { adminComponents } from "./views/admin";
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
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">

    <style>
        :root {
            color-scheme: light;
        }
        * { box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background-color: #f1f5f9; color: #0f172a; -webkit-text-size-adjust: 100%; min-height: 100vh; }
        input, select, textarea { font-size: 16px !important; }
        .font-serif { font-family: 'Playfair Display', serif; }
        .glass-panel { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(8px); }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        .panel-shadow { box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #e2e8f0; }
        ::-webkit-scrollbar-thumb { background: #94a3b8; border-radius: 999px; }
        ::-webkit-scrollbar-thumb:hover { background: #64748b; }
    </style>
</head>
<body>
    <div id="root"></div>

    <script>
        window.__INITIAL_VIEW = ${JSON.stringify(initialView)};
    </script>
    <script type="text/babel">
        const { useState, useEffect } = React;

        // --- SHARED UI COMPONENTS ---
        ${uiComponents}

        // --- IMPORTED COMPONENTS ---
        ${navBarComponent}
        ${landingHeaderComponent}
        ${classSidebarComponent}

        // --- VIEW LOGIC ---
        ${authComponents}
        ${studentComponents}
        ${adminComponents}

        // --- MAIN APP ---
        ${mainApp}

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>
  `;
}
