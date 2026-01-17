// Main entry point for Freeducation platform

import { migrateDatabase } from './db/database.js';
import { handleRoute } from './routes/index.js';

// HTML Template
const generateHTML = (initialData) => {
  return `<!DOCTYPE html>
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
                    const name = String(font.name || '').replace(/'/g, "\\\'"); 
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
        
        const LogoMark = ({ className = '', textClassName = '', subtitle = 'Learning that feels effortless.', compact = false }) => {
          return React.createElement('div', {
            className: "flex items-center gap-3 " + className,
            children: [
              React.createElement('div', {
                className: "relative w-11 h-11 flex items-center justify-center",
                children: [
                  React.createElement('div', {
                    className: "w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg",
                    children: ['F']
                  })
                ]
              })
            ]
          });
        };

        const BackgroundArt = () => {
          return React.createElement('div', {
            className: "absolute inset-0 overflow-hidden pointer-events-none",
            children: [
              React.createElement('div', { className: "absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-2xl float-slow" }),
              React.createElement('div', { className: "absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-indigo-200/30 to-pink-200/30 rounded-full blur-xl float-slower" }),
              React.createElement('div', { className: "absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-3xl pulse-soft" }),
              React.createElement('div', { className: "absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-xl float-slow" }),
              React.createElement('div', { className: "absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" }),
              React.createElement('div', { className: "absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" })
            ]
          });
        };

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
            return React.createElement('div', {
              className: "min-h-screen flex items-center justify-center",
              children: [
                React.createElement('div', {
                  className: "text-center",
                  children: [
                    React.createElement('div', {
                      className: "w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"
                    }),
                    React.createElement('p', {
                      className: "text-slate-600",
                      children: ['Loading...']
                    })
                  ]
                })
              ]
            });
          }

          // Simple routing based on view
          if (view === 'login') {
            return React.createElement('div', {
              children: [
                React.createElement('div', {
                  className: "min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50",
                  children: [
                    BackgroundArt({}),
                    React.createElement('nav', {
                      className: "bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50",
                      children: [
                        LogoMark({}),
                        React.createElement('div', {
                          className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
                          children: [
                            React.createElement('div', {
                              className: "flex justify-between items-center h-16",
                              children: [
                                React.createElement('div', {
                                  className: "flex items-center gap-4",
                                  children: [
                                    React.createElement('button', {
                                      onClick: () => handleNavigate('login'),
                                      className: "text-indigo-600 hover:text-indigo-700 font-medium transition-colors",
                                      children: ['Sign In']
                                    })
                                  ]
                                })
                              ]
                            })
                          ]
                        })
                      ]
                    })
                  ])
                })
              ]
            });
          }

          // Dashboard (simplified)
          return React.createElement('div', {
            className: "min-h-screen bg-slate-50",
            children: [
              React.createElement('nav', {
                className: "bg-white border-b border-slate-200 shadow-sm",
                children: [
                  React.createElement('div', {
                    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
                    children: [
                      React.createElement('div', {
                        className: "flex justify-between items-center h-16",
                        children: [
                          React.createElement('div', {
                            className: "flex items-center gap-3",
                            children: [
                              React.createElement('div', {
                                className: "w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center",
                                children: [
                                  React.createElement('i', { className: "fas fa-book text-indigo-600" })
                                ]
                              }),
                              React.createElement('h1', {
                                className: "text-xl font-semibold text-slate-900",
                                children: ['Welcome back, ' + (user?.username || 'User') + '!']
                              })
                            ]
                          }),
                          React.createElement('div', {
                            className: "flex items-center gap-4",
                            children: [
                              React.createElement('button', {
                                onClick: handleLogout,
                                className: "text-slate-600 hover:text-slate-900 transition-colors",
                                children: [
                                  React.createElement('i', { className: "fas fa-sign-out-alt mr-2" }),
                                  'Logout'
                                ]
                              })
                            ]
                          })
                        ]
                      })
                    ]
                  })
                ]
              }),
              React.createElement('main', {
                className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",
                children: [
                  React.createElement('div', {
                    className: "mb-8",
                    children: [
                      React.createElement('h2', {
                        className: "text-2xl font-bold text-slate-900",
                        children: ['Welcome back, ' + (user?.username || 'User') + '!']
                      })
                    ],
                    React.createElement('p', {
                      className: "text-slate-600 mt-2",
                      children: ["Here's what's happening with your learning journey."]
                    })
                    })
                  ])
                ]
              })
            ]
          });
        };

        const root = ReactDOM.createRoot(document.getElementById('root'));
        try {
            root.render(React.createElement(App));
        } catch (error) {
            console.error('Failed to render app', error);
            const rootEl = document.getElementById('root');
            if (rootEl) {
                rootEl.innerHTML = '<div style="padding:24px;font-family:Inter, sans-serif;"><h2>Something went wrong.</h2><p>Please refresh page or contact support if problem persists.</p></div>';
            }
        }
    </script>
</body>
</html>
`;
};

// Main fetch handler
const worker = {
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
  },
  generateHTML,
  handleRoute
};

export default worker;
export { generateHTML, handleRoute };
