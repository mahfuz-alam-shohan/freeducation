import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { authRoutes } from './routes/auth.js';
import { adminRoutes } from './routes/admin.js';
import { migrateDatabase } from '../database/migrate.js';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger());

// Serve static files and frontend
app.get('/*', async (c) => {
  const url = new URL(c.req.url);
  const path = url.pathname;

  // API routes - let them pass through
  if (path.startsWith('/api/')) {
    return;
  }

  // Serve the React app for all other routes
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>freeducation - Education Platform</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/axios@1.6.2/dist/axios.min.js"></script>
  <script src="https://unpkg.com/react-hook-form@7.48.2/dist/index.umd.js"></script>
  <script src="https://unpkg.com/react-hot-toast@2.4.1/dist/index.umd.js"></script>
  <script src="https://unpkg.com/lucide-react@0.294.0/dist/umd/lucide-react.js"></script>
  <script src="https://unpkg.com/react-router-dom@6.8.1/dist/umd/react-router-dom.production.min.js"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', system-ui, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    .btn-primary {
      background: #3b82f6;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      border: none;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .btn-primary:hover {
      background: #2563eb;
    }
    
    .input-field {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      transition: all 0.2s;
    }
    
    .input-field:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .card {
      background: white;
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
      border: 1px solid #e2e8f0;
    }
    
    .loading-spinner {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #eff6ff 0%, #f1f5f9 100%);
    }
    
    .mobile-card {
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      padding: 1rem;
      border: 1px solid #e2e8f0;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  
  <script type="text/babel">
    const { useState, useEffect, createContext, useContext } = React;
    const { BrowserRouter, Routes, Route, Navigate } = ReactRouterDOM;
    
    // Auth Context
    const AuthContext = createContext();
    
    const AuthProvider = ({ children }) => {
      const [user, setUser] = useState({
        isAuthenticated: false,
        initialized: false,
        data: null
      });
      const [loading, setLoading] = useState(true);
      const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
      
      useEffect(() => {
        const checkAuthStatus = async () => {
          try {
            const token = localStorage.getItem('freeducation_token');
            
            if (token) {
              const response = await axios.get('/api/admin/profile', {
                headers: { Authorization: \`Bearer \${token}\` }
              });
              
              if (response.data.admin) {
                setUser({
                  isAuthenticated: true,
                  initialized: true,
                  data: response.data.admin
                });
              } else {
                localStorage.removeItem('freeducation_token');
              }
            } else {
              const initResponse = await axios.get('/api/auth/check-init');
              setUser(prev => ({
                ...prev,
                initialized: initResponse.data.initialized
              }));
            }
          } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('freeducation_token');
          } finally {
            setLoading(false);
          }
        };
        
        checkAuthStatus();
        
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        
        return () => window.removeEventListener('resize', handleResize);
      }, []);
      
      const login = async (email, password) => {
        try {
          const response = await axios.post('/api/auth/login', { email, password });
          
          if (response.data.token) {
            localStorage.setItem('freeducation_token', response.data.token);
            setUser({
              isAuthenticated: true,
              initialized: true,
              data: response.data.admin
            });
            ReactHotToast.success('Login successful!');
            return { success: true };
          } else {
            ReactHotToast.error(response.data.error || 'Login failed');
            return { success: false, error: response.data.error };
          }
        } catch (error) {
          ReactHotToast.error('Login failed. Please try again.');
          return { success: false, error: error.message };
        }
      };
      
      const registerFirstAdmin = async (adminData) => {
        try {
          const response = await axios.post('/api/auth/register-first-admin', adminData);
          
          if (response.data.token) {
            localStorage.setItem('freeducation_token', response.data.token);
            setUser({
              isAuthenticated: true,
              initialized: true,
              data: response.data.admin
            });
            ReactHotToast.success('First admin registered successfully!');
            return { success: true };
          } else {
            ReactHotToast.error(response.data.error || 'Registration failed');
            return { success: false, error: response.data.error };
          }
        } catch (error) {
          ReactHotToast.error('Registration failed. Please try again.');
          return { success: false, error: error.message };
        }
      };
      
      return (
        <AuthContext.Provider value={{ user, loading, isMobile, login, registerFirstAdmin }}>
          {children}
        </AuthContext.Provider>
      );
    };
    
    const useAuth = () => {
      const context = useContext(AuthContext);
      if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
      }
      return context;
    };
    
    // First Admin Setup Component
    const FirstAdminSetup = () => {
      const { registerFirstAdmin, isMobile } = useAuth();
      const [showPassword, setShowPassword] = useState(false);
      const [showConfirmPassword, setShowConfirmPassword] = useState(false);
      const [loading, setLoading] = useState(false);
      const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        date_of_birth: ''
      });
      
      const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
          ReactHotToast.error('Passwords do not match');
          return;
        }
        
        setLoading(true);
        const result = await registerFirstAdmin({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          date_of_birth: formData.date_of_birth
        });
        
        setLoading(false);
      };
      
      const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value
        });
      };
      
      return React.createElement('div', {
        style: {
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #eff6ff 0%, #f1f5f9 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? '1rem' : '2rem'
        }
      }, [
        React.createElement('div', {
          style: {
            width: isMobile ? '100%' : '28rem',
            maxWidth: isMobile ? 'none' : '32rem'
          }
        }, [
          React.createElement('div', {
            style: {
              textAlign: 'center',
              marginBottom: '2rem'
            }
          }, [
            React.createElement('div', {
              style: {
                width: '4rem',
                height: '4rem',
                background: '#3b82f6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }
            }, [
              React.createElement('span', {
                style: { color: 'white', fontSize: '1.5rem' }
              }, '🎓')
            ]),
            React.createElement('h1', {
              style: {
                fontSize: isMobile ? '1.5rem' : '2rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '0.5rem'
              }
            }, 'freeducation'),
            React.createElement('p', {
              style: {
                color: '#6b7280',
                fontSize: isMobile ? '0.875rem' : '0.875rem'
              }
            }, 'Setup your administrator account'),
            React.createElement('div', {
              style: {
                display: 'flex',
                alignItems: 'center',
                marginTop: '0.75rem',
                color: '#d97706',
                fontSize: '0.75rem'
              }
            }, [
              React.createElement('span', { style: { marginRight: '0.25rem' } }, '🔒'),
              React.createElement('span', {}, 'One-time setup')
            ])
          ]),
          
          React.createElement('form', {
            onSubmit: handleSubmit,
            style: { width: '100%' }
          }, [
            React.createElement('input', {
              type: 'text',
              name: 'name',
              placeholder: 'Full Name',
              value: formData.name,
              onChange: handleChange,
              className: 'input-field',
              style: { marginBottom: '1rem' },
              required: true
            }),
            
            React.createElement('input', {
              type: 'email',
              name: 'email',
              placeholder: 'Email Address',
              value: formData.email,
              onChange: handleChange,
              className: 'input-field',
              style: { marginBottom: '1rem' },
              required: true
            }),
            
            React.createElement('input', {
              type: 'date',
              name: 'date_of_birth',
              value: formData.date_of_birth,
              onChange: handleChange,
              className: 'input-field',
              style: { marginBottom: '1rem' },
              required: true
            }),
            
            React.createElement('div', { style: { position: 'relative', marginBottom: '1rem' } }, [
              React.createElement('input', {
                type: showPassword ? 'text' : 'password',
                name: 'password',
                placeholder: 'Create a strong password',
                value: formData.password,
                onChange: handleChange,
                className: 'input-field',
                style: { paddingRight: '2.5rem' },
                required: true,
                minLength: 8
              }),
              React.createElement('button', {
                type: 'button',
                onClick: () => setShowPassword(!showPassword),
                style: {
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer'
                }
              }, showPassword ? '👁️' : '👁️‍🗨️')
            ]),
            
            React.createElement('div', { style: { position: 'relative', marginBottom: '1.5rem' } }, [
              React.createElement('input', {
                type: showConfirmPassword ? 'text' : 'password',
                name: 'confirmPassword',
                placeholder: 'Confirm your password',
                value: formData.confirmPassword,
                onChange: handleChange,
                className: 'input-field',
                style: { paddingRight: '2.5rem' },
                required: true
              }),
              React.createElement('button', {
                type: 'button',
                onClick: () => setShowConfirmPassword(!showConfirmPassword),
                style: {
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer'
                }
              }, showConfirmPassword ? '👁️' : '👁️‍🗨️')
            ]),
            
            React.createElement('button', {
              type: 'submit',
              className: 'btn-primary',
              disabled: loading,
              style: { 
                width: '100%', 
                padding: '0.75rem',
                fontSize: '1rem',
                opacity: loading ? 0.7 : 1
              }
            }, loading ? 'Creating Account...' : 'Create Admin Account')
          ]),
          
          React.createElement('div', {
            style: {
              marginTop: '1.5rem',
              padding: '0.75rem',
              background: '#fef3c7',
              border: '1px solid #f59e0b',
              borderRadius: '0.5rem',
              fontSize: '0.75rem'
            }
          }, [
            React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', marginBottom: '0.5rem' } }, [
              React.createElement('span', { style: { marginRight: '0.5rem' } }, '🔒'),
              React.createElement('span', { style: { color: '#d97706' } }, 'Security Notice')
            ]),
            React.createElement('div', { style: { color: '#92400e' } }, [
              React.createElement('p', { style: { fontWeight: 'bold', marginBottom: '0.25rem' } }, 'This is a one-time setup.'),
              React.createElement('p', {}, 'After creating the first admin, this form will be permanently disabled for security reasons.')
            ])
          ])
        ])
      ]);
    };
    
    // Login Component
    const Login = () => {
      const { login, isMobile } = useAuth();
      const [showPassword, setShowPassword] = useState(false);
      const [loading, setLoading] = useState(false);
      const [formData, setFormData] = useState({
        email: '',
        password: ''
      });
      
      const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await login(formData.email, formData.password);
        setLoading(false);
      };
      
      const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value
        });
      };
      
      return React.createElement('div', {
        style: {
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #eff6ff 0%, #f1f5f9 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? '1rem' : '2rem'
        }
      }, [
        React.createElement('div', {
          style: {
            width: isMobile ? '100%' : '28rem',
            maxWidth: isMobile ? 'none' : '32rem'
          }
        }, [
          React.createElement('div', {
            style: {
              textAlign: 'center',
              marginBottom: '2rem'
            }
          }, [
            React.createElement('div', {
              style: {
                width: '4rem',
                height: '4rem',
                background: '#3b82f6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }
            }, [
              React.createElement('span', {
                style: { color: 'white', fontSize: '1.5rem' }
              }, '🎓')
            ]),
            React.createElement('h1', {
              style: {
                fontSize: isMobile ? '1.5rem' : '2rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '0.5rem'
              }
            }, 'freeducation'),
            React.createElement('p', {
              style: {
                color: '#6b7280',
                fontSize: isMobile ? '0.875rem' : '0.875rem'
              }
            }, 'Sign in to your admin account')
          ]),
          
          React.createElement('form', {
            onSubmit: handleSubmit,
            style: { width: '100%' }
          }, [
            React.createElement('input', {
              type: 'email',
              name: 'email',
              placeholder: 'Email Address',
              value: formData.email,
              onChange: handleChange,
              className: 'input-field',
              style: { marginBottom: '1rem' },
              required: true
            }),
            
            React.createElement('div', { style: { position: 'relative', marginBottom: '1.5rem' } }, [
              React.createElement('input', {
                type: showPassword ? 'text' : 'password',
                name: 'password',
                placeholder: 'Enter your password',
                value: formData.password,
                onChange: handleChange,
                className: 'input-field',
                style: { paddingRight: '2.5rem' },
                required: true
              }),
              React.createElement('button', {
                type: 'button',
                onClick: () => setShowPassword(!showPassword),
                style: {
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer'
                }
              }, showPassword ? '👁️' : '👁️‍🗨️')
            ]),
            
            React.createElement('button', {
              type: 'submit',
              className: 'btn-primary',
              disabled: loading,
              style: { 
                width: '100%', 
                padding: '0.75rem',
                fontSize: '1rem',
                opacity: loading ? 0.7 : 1
              }
            }, loading ? 'Signing In...' : 'Sign In')
          ])
        ])
      ]);
    };
    
    // Dashboard Component
    const Dashboard = () => {
      const { user, logout, isMobile } = useAuth();
      
      const handleLogout = () => {
        localStorage.removeItem('freeducation_token');
        logout();
        ReactHotToast.success('Logged out successfully');
      };
      
      return React.createElement('div', {
        style: {
          minHeight: '100vh',
          background: '#f9fafb'
        }
      }, [
        React.createElement('div', {
          style: {
            background: 'white',
            borderBottom: '1px solid #e2e8f0',
            padding: isMobile ? '0.75rem' : '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }
        }, [
          React.createElement('div', {
            style: { display: 'flex', alignItems: 'center' }
          }, [
            React.createElement('button', {
              onClick: () => setShowSidebar(!showSidebar),
              style: {
                padding: '0.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: 'none'
              }
            }, isMobile ? '☰' : '☰'),
            React.createElement('div', {
              style: { marginLeft: '0.75rem' }
            }, [
              React.createElement('h1', {
                style: {
                  fontSize: isMobile ? '1.125rem' : '1.25rem',
                  fontWeight: 'bold',
                  color: '#1f2937'
                }
              }, 'freeducation'),
              React.createElement('p', {
                style: {
                  color: '#6b7280',
                  fontSize: '0.75rem'
                }
              }, 'Admin Panel')
            ])
          ]),
          
          React.createElement('div', {
            style: { display: 'flex', alignItems: 'center', gap: '0.75rem' }
          }, [
            React.createElement('div', {
              style: { textAlign: 'right' }
            }, [
              React.createElement('p', {
                style: {
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#1f2937'
                }
              }, user.data?.name),
              React.createElement('p', {
                style: {
                  fontSize: '0.75rem',
                  color: '#6b7280'
                }
              }, 'Administrator')
            ]),
            React.createElement('div', {
              style: {
                width: '2rem',
                height: '2rem',
                background: '#3b82f6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }
            }, [
              React.createElement('span', {
                style: { color: 'white', fontSize: '0.875rem' }
              }, user.data?.name?.charAt(0)?.toUpperCase())
            ])
          ]),
          
          React.createElement('button', {
            onClick: handleLogout,
            style: {
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: 'none',
              color: '#dc2626',
              fontSize: '0.875rem',
              cursor: 'pointer'
            }
          }, 'Logout')
        ]),
        
        React.createElement('div', {
          style: {
            padding: isMobile ? '1rem' : '2rem'
          }
        }, [
          React.createElement('div', {
            style: {
              background: 'white',
              borderRadius: isMobile ? '0.5rem' : '0.75rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              padding: isMobile ? '1rem' : '1.5rem',
              marginBottom: isMobile ? '1rem' : '1.5rem'
            }
          }, [
            React.createElement('div', {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }
            }, [
              React.createElement('h2', {
                style: {
                  fontSize: isMobile ? '1.125rem' : '1.25rem',
                  fontWeight: 'bold',
                  color: '#1f2937'
                }
              }, 'Welcome back!'),
              React.createElement('div', {
                style: {
                  width: '3rem',
                  height: '3rem',
                  background: '#3b82f6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }
              }, [
                React.createElement('span', {
                  style: { color: 'white', fontSize: '1rem' }
                }, '🎓')
              ])
            ]),
            
            React.createElement('p', {
              style: {
                color: '#6b7280',
                fontSize: isMobile ? '0.875rem' : '0.875rem',
                marginBottom: '1rem'
              }
            }, 'Manage your freeducation platform from here. You can add new admins, manage users, and configure system settings.'),
            
            React.createElement('div', {
              style: {
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem'
              }
            }, [
              React.createElement('div', {
                style: {
                  background: '#dbeafe',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  textAlign: 'center'
                }
              }, [
                React.createElement('p', {
                  style: {
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#1e40af'
                  }
                }, '1'),
                React.createElement('p', {
                  style: {
                    color: '#1e40af',
                    fontSize: '0.75rem'
                  }
                }, 'Total Admins')
              ]),
              
              React.createElement('div', {
                style: {
                  background: '#dcfce7',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  textAlign: 'center'
                }
              }, [
                React.createElement('p', {
                  style: {
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#16a34a'
                  }
                }, '0'),
                React.createElement('p', {
                  style: {
                    color: '#16a34a',
                    fontSize: '0.75rem'
                  }
                }, 'Total Users')
              ])
            ])
          ]),
          
          React.createElement('div', {
            style: {
              background: 'white',
              borderRadius: isMobile ? '0.5rem' : '0.75rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              padding: isMobile ? '1rem' : '1.5rem'
            }
          }, [
            React.createElement('h3', {
              style: {
                fontSize: isMobile ? '1rem' : '1.125rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '1rem'
              }
            }, 'Quick Actions'),
            
            React.createElement('div', {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }
            }, [
              React.createElement('button', {
                style: {
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  background: '#3b82f6',
                  color: 'white',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }
              }, [
                React.createElement('span', {}, '➕ Add New Admin'),
                React.createElement('span', {}, '→')
              ])
            ])
          ])
        ])
      ]);
    };
    
    // Loading Spinner
    const LoadingSpinner = () => React.createElement('div', {
      className: 'loading-spinner'
    }, [
      React.createElement('div', {
        style: {
          width: '2rem',
          height: '2rem',
          border: '4px solid #e5e7eb',
          borderTop: '4px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }
      }),
      React.createElement('p', {
        style: {
          color: '#6b7280',
          fontWeight: '500',
          marginTop: '1rem'
        }
      }, 'Loading freeducation...')
    ]);
    
    // Main App Component
    const App = () => {
      const { user, loading, isMobile } = useAuth();
      
      if (loading) {
        return React.createElement(LoadingSpinner);
      }
      
      // First-time admin setup
      if (!user?.initialized) {
        return React.createElement(FirstAdminSetup);
      }
      
      // Authenticated routes
      if (user?.isAuthenticated) {
        return React.createElement(Dashboard);
      }
      
      // Login routes
      return React.createElement(Login);
    };
    
    // Render the app
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(AuthProvider, null, React.createElement(App)));
  </script>
</body>
</html>
  `;
  
  return c.html(html);
});

// Database migration endpoint (for first setup)
app.post('/api/migrate', async (c) => {
  try {
    const result = await migrateDatabase(c.env.DB);
    return c.json(result);
  } catch (error) {
    console.error('Migration error:', error);
    return c.json({ 
      success: false, 
      error: error.message 
    }, 500);
  }
});

// Health check
app.get('/', (c) => {
  return c.json({ 
    message: 'freeducation API is running',
    version: '1.0.0',
    status: 'healthy'
  });
});

// Routes
app.route('/api/auth', authRoutes);
app.route('/api/admin', adminRoutes);

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Route not found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error(err);
  return c.json({ 
    error: 'Internal server error',
    message: err.message 
  }, 500);
});

export default app;
