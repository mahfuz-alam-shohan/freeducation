import { navBarComponent } from "./components/navbar";
import { landingHeaderComponent } from "./components/header";
import { classSidebarComponent } from "./components/sidebar";
import { uiComponents } from "./components/ui";
import { authComponents } from "./views/auth";
import { studentComponents } from "./views/student";
import { adminComponents } from "./views/admin";
import { mainApp } from "./app";
import { routerUtilities } from "./routing";

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
        body { font-family: 'Inter', sans-serif; background-color: #f8fafc; color: #1e293b; }
        html, body, #root { min-height: 100%; }
        html { -webkit-text-size-adjust: 100%; }
        .font-serif { font-family: 'Playfair Display', serif; }
        .glass-panel { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(8px); }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 640px) {
            input, select, textarea { font-size: 16px; }
        }
        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    </style>
</head>
<body>
    <div id="root"></div>
    <div id="app-error" style="display:none; position:fixed; inset:0; background:#0f172a; color:#f8fafc; padding:24px; overflow:auto; z-index:9999;">
        <h1 style="font-size:20px; font-weight:700; margin-bottom:12px;">Freeducation UI Error</h1>
        <pre id="app-error-message" style="white-space:pre-wrap; font-size:14px; line-height:1.5;"></pre>
    </div>

    <script>
        window.__INITIAL_VIEW = ${JSON.stringify(initialView)};
        window.__reportAppError = function(message) {
            var container = document.getElementById('app-error');
            var messageEl = document.getElementById('app-error-message');
            if (!container || !messageEl) return;
            messageEl.textContent = message || 'Unknown error';
            container.style.display = 'block';
        };
        window.addEventListener('error', function(event) {
            var error = event.error || {};
            var message = error.stack || error.message || event.message || String(event);
            window.__reportAppError(message);
        });
        window.addEventListener('unhandledrejection', function(event) {
            var reason = event.reason || {};
            var message = reason.stack || reason.message || String(reason);
            window.__reportAppError(message);
        });
    </script>
    <script type="text/babel">
        const { useState, useEffect } = React;
        class ErrorBoundary extends React.Component {
            constructor(props) {
                super(props);
                this.state = { hasError: false, error: null };
            }
            static getDerivedStateFromError(error) {
                return { hasError: true, error };
            }
            componentDidCatch(error) {
                const message = error && (error.stack || error.message || String(error));
                if (window.__reportAppError) {
                    window.__reportAppError(message);
                }
            }
            render() {
                if (this.state.hasError) {
                    return null;
                }
                return this.props.children;
            }
        }

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

        // --- ROUTING UTILITIES ---
        ${routerUtilities}

        // --- MAIN APP ---
        ${mainApp}

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(
            <ErrorBoundary>
                <App />
            </ErrorBoundary>
        );
    </script>
</body>
</html>
  `;
}
