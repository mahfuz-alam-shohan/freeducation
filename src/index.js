// Main entry point for the Freeducation platform

import { migrateDatabase } from './db/database.js';
import { handleRoute } from './routes/index.js';

// HTML Template
const generateHTML = (initialData) => `
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
        body { font-family: 'Inter', sans-serif; background-color: var(--ui-soft); color: #0f172a; -webkit-text-size-adjust: 100%; min-height: 100vh; font-size: 15px; }
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
            .thumbnail-float, .float-slow, .float-slower, .pulse-soft, .marquee-track, .soft-glow {
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
        window.__INITIAL_VIEW = ${JSON.stringify(initialData)};
    </script>
    
    <script type="text/babel">
        const { useState, useEffect, useRef } = React;

        // Import all components (these would be dynamically loaded in a real app)
        // For now, we'll define them inline to maintain compatibility
        
        const LogoMark = ({ className = '', textClassName = '', subtitle = 'Learning that feels effortless.', compact = false }) => (
          <div className={\`flex items-center gap-3 \${className}\`}>
            <div className="relative w-11 h-11 flex items-center justify-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                F
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-white shadow-sm"></div>
            </div>
            {!compact && (
              <div className="flex flex-col">
                <span className={\`font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent \${textClassName}\`}>
                  Freeducation
                </span>
                <span className={\`text-xs text-slate-500 \${textClassName}\`}>{subtitle}</span>
              </div>
            )}
          </div>
        );

        const BackgroundArt = () => (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-2xl float-slow"></div>
            <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-indigo-200/30 to-pink-200/30 rounded-full blur-xl float-slower"></div>
            <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-3xl pulse-soft"></div>
            <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-xl float-slow"></div>
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
          </div>
        );

        // Import utility hooks
        const { useReadingProgress, useThumbnails, makeChapterThumbnailKey, getLastReadForSubject } = (() => {
          // Simplified versions of the hooks for this demo
          const useReadingProgress = () => {
            const [readMap, setReadMap] = useState({});
            const markRead = (entry) => {
              setReadMap(prev => ({ ...prev, [entry.chapterKey]: { ...entry, updatedAt: Date.now() } }));
            };
            return { readMap, markRead };
          };

          const useThumbnails = (endpoint, keyField) => {
            const [thumbnailMap, setThumbnailMap] = useState({});
            useEffect(() => {
              fetch(endpoint).then(res => res.json()).then(data => {
                const map = {};
                data.forEach(item => { map[item[keyField]] = item; });
                setThumbnailMap(map);
              }).catch(console.error);
            }, [endpoint, keyField]);
            return thumbnailMap;
          };

          const makeChapterThumbnailKey = (classLabel, subjectLabel, chapterKey) => {
            return (classLabel + '-' + subjectLabel + '-' + chapterKey).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          };

          const getLastReadForSubject = (readMap, subjectLabel) => {
            const entries = Object.values(readMap || {}).filter(entry => entry.subjectLabel === subjectLabel);
            return entries.length > 0 ? entries[0]?.label || '' : '';
          };

          return { useReadingProgress, useThumbnails, makeChapterThumbnailKey, getLastReadForSubject };
        })();

        // Import additional components
        const { BookReader, ArtPanelGrid } = (() => {
          const BookReader = ({ children, className = '' }) => (
            <div className={'w-full ' + className}>
              <div className="font-serif text-slate-900 text-sm leading-snug text-justify space-y-2">
                {children}
              </div>
            </div>
          );

          const ArtPanelGrid = ({ children, className = '' }) => (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div className={'relative grid justify-items-center gap-4 ' + className}>
                {children}
              </div>
            </div>
          );

          return { BookReader, ArtPanelGrid };
        })();

        // Simple App component
        const App = () => {
          const [view, setView] = useState(window.__INITIAL_VIEW || 'landing');
          const [user, setUser] = useState(null);
          const [loading, setLoading] = useState(true);

          useEffect(() => {
            const token = localStorage.getItem('auth_token');
            const userData = localStorage.getItem('user_data');
            
            if (token && userData) {
              try {
                setUser(JSON.parse(userData));
              } catch (error) {
                console.error('Failed to parse user data:', error);
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user_data');
              }
            }
            setLoading(false);
          }, []);

          const handleNavigate = (newView) => {
            setView(newView);
          };

          const handleLogout = () => {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            setUser(null);
            setView('landing');
          };

          const handleLogin = (userData) => {
            setUser(userData);
            setView('dashboard');
          };

          if (loading) {
            return (
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-600">Loading...</p>
                </div>
              </div>
            );
          }

          // Simple routing based on view
          if (view === 'login') {
            return (
              <div>
                <AuthForm mode="login" onSubmit={handleLogin} onNavigate={handleNavigate} />
              </div>
            );
          }

          if (view === 'landing') {
            return (
              <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
                <BackgroundArt />
                <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                      <LogoMark />
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleNavigate('login')}
                          className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                        >
                          Sign In
                        </button>
                      </div>
                    </div>
                  </div>
                </nav>
                
                <main className="relative z-10">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                      <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 mb-6">
                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          Learning Made Simple
                        </span>
                      </h1>
                      <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                        Access quality educational content for SSC and HSC students. 
                        Learn at your own pace with our comprehensive study materials.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                          onClick={() => handleNavigate('login')}
                          className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
                        >
                          Get Started
                        </button>
                        <button
                          className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-all"
                        >
                          Learn More
                        </button>
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            );
          }

          // Dashboard (simplified)
          return (
            <div className="min-h-screen bg-slate-50">
              <NavBar user={user} onNavigate={handleNavigate} onLogout={handleLogout} />
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-slate-900">
                    Welcome back, {user?.username || 'User'}!
                  </h1>
                  <p className="text-slate-600 mt-2">
                    Here's what's happening with your learning journey.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <i className="fas fa-book text-indigo-600"></i>
                      </div>
                      <h3 className="font-semibold text-slate-900">Your Courses</h3>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">--</p>
                    <p className="text-sm text-slate-600">Active courses</p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <i className="fas fa-chart-line text-green-600"></i>
                      </div>
                      <h3 className="font-semibold text-slate-900">Progress</h3>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">--%</p>
                    <p className="text-sm text-slate-600">Completion rate</p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                        <i className="fas fa-trophy text-amber-600"></i>
                      </div>
                      <h3 className="font-semibold text-slate-900">Achievements</h3>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">--</p>
                    <p className="text-sm text-slate-600">Earned badges</p>
                  </div>
                </div>
              </main>
            </div>
          );
        };

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

// Main fetch handler
export default {
  async fetch(request, env, ctx) {
    try {
      // Handle API routes first
      const apiResponse = await handleRoute(request, env, ctx);
      if (apiResponse) {
        return apiResponse;
      }

      // Handle static files and other routes
      const url = new URL(request.url);
      const pathname = url.pathname;

      // Serve the main application for all non-API routes
      return new Response(generateHTML(pathname), {
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'public, max-age=3600',
        }
      });
    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }
};
