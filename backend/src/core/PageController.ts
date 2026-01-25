/**
 * ===================================
   PAGE CONTROLLER
   ===================================
 */

import { DatabaseManager } from './database/database_manager';
import { AdminSetupService } from '../api/v1/admin/setup';

interface PageControllerConfig {
  env: any;
}

export class PageController {
  private db: DatabaseManager;
  private adminService: AdminSetupService;
  private env: any;

  constructor(config: PageControllerConfig) {
    this.env = config.env;
    this.db = new DatabaseManager(this.env.DB);
    this.adminService = new AdminSetupService(this.db);
  }

  /**
   * Initialize the page controller
   */
  async initialize(): Promise<void> {
    await this.db.initialize();
  }

  /**
   * Handle page requests
   */
  async handleRequest(path: string): Promise<Response> {
    // Check if admin setup is needed first
    try {
      const result = await this.adminService.checkAdminSetup();
      
      if (result.needsSetup) {
        return this.serveSetupPage();
      }
    } catch (error) {
      console.log('Could not check setup status, serving setup page');
      return this.serveSetupPage();
    }

    // Serve the main application
    return this.serveMainApp();
  }

  /**
   * Serve the main application
   */
  private serveMainApp(): Response {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Freeducation</title>
    <style>
/* ===================================
   LAYOUT CONTROLLER STYLES
   =================================== */

.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-background, #ffffff);
  position: relative;
}

.main-content {
  margin-top: var(--header-height, 64px);
  margin-left: var(--sidebar-width-expanded, 256px);
  min-height: calc(100vh - var(--header-height, 64px));
  transition: var(--sidebar-transition, all 0.3s cubic-bezier(0.4, 0, 0.2, 1));
  position: relative;
}

.main-content.sidebar-collapsed {
  margin-left: var(--sidebar-width-collapsed, 64px);
}

.content-wrapper {
  padding: var(--spacing-6, 1.5rem);
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100%;
}

/* ===================================
   RESPONSIVE BEHAVIOR
   =================================== */

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
  
  .main-content.sidebar-collapsed {
    margin-left: 0;
  }
  
  .content-wrapper {
    padding: var(--spacing-4, 1rem);
  }
}

/* ===================================
   MOBILE OVERLAY
   =================================== */

.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: var(--z-modal-backdrop, 1040);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.mobile-overlay.show {
  opacity: 1;
  visibility: visible;
}

/* ===================================
   DROPDOWN POSITIONING
   =================================== */

#profile-dropdown,
#notification-dropdown {
  position: fixed;
  top: var(--header-height, 64px);
  right: 0;
  z-index: var(--z-dropdown, 1000);
}

#mobile-notification {
  position: fixed;
  top: var(--header-height, 64px);
  right: 0;
  bottom: 0;
  width: 100%;
  max-width: 400px;
  background-color: var(--color-background, #ffffff);
  border-left: 1px solid var(--color-border, #e5e7eb);
  z-index: var(--z-modal, 1050);
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

#mobile-notification.open {
  transform: translateX(0);
}

/* ===================================
   CSS CUSTOM PROPERTIES
   =================================== */

:root {
  --header-height: 64px;
  --sidebar-width-expanded: 256px;
  --sidebar-width-collapsed: 64px;
  --sidebar-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --z-modal-backdrop: 1040;
  --z-dropdown: 1000;
  --z-modal: 1050;
  --spacing-2: 0.5rem;
  --spacing-4: 1rem;
  --spacing-6: 1.5rem;
  --text-base: 1rem;
  --text-xl: 1.25rem;
  
  /* Colors */
  --color-background: #ffffff;
  --color-border: #e5e7eb;
  --color-text-primary: #111827;
  --color-text-secondary: #6b7280;
  --color-primary: #3b82f6;
  --color-error: #ef4444;
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #0f172a;
    --color-border: #334155;
    --color-text-primary: #f1f5f9;
    --color-text-secondary: #cbd5e1;
    --color-error: #ef4444;
  }
}
    </style>
</head>
<body>
    <!-- ===================================
         LAYOUT CONTAINER
         =================================== -->
    <div class="layout-container" data-layout-container>
        
        <!-- Header Component -->
        <div id="header-component" data-header-component></div>
        
        <!-- Sidebar Component -->
        <div id="sidebar-component" data-sidebar-component></div>
        
        <!-- Main Content Area -->
        <main class="main-content" data-main-content>
            <div class="content-wrapper" data-content-wrapper>
                <!-- Page content will be dynamically loaded here -->
            </div>
        </main>
        
        <!-- Mobile Overlay -->
        <div class="mobile-overlay hidden" data-mobile-overlay></div>
        
        <!-- Dropdown Containers -->
        <div id="profile-dropdown" data-profile-dropdown></div>
        <div id="notification-dropdown" data-notification-dropdown></div>
        <div id="mobile-notification" data-mobile-notification></div>
    </div>
    
    <!-- ===================================
         LAYOUT CONTROLLER SCRIPT
         =================================== -->
    <script type="module">
        // Simple homepage for now
        document.querySelector('.content-wrapper').innerHTML = \`
            <div style="text-align: center; padding: 2rem;">
                <h1 style="color: #3b82f6; font-size: 2rem; margin-bottom: 1rem;">Welcome to Freeducation! 🎓</h1>
                <p style="color: #6b7280; font-size: 1.1rem; margin-bottom: 2rem;">Your modular ed-tech platform is ready!</p>
                <div style="background: #f3f4f6; padding: 2rem; border-radius: 8px; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #111827; margin-bottom: 1rem;">✅ Platform Status</h2>
                    <ul style="text-align: left; color: #6b7280; line-height: 1.8;">
                        <li>✅ Modular Architecture Implemented</li>
                        <li>✅ Component-Based Structure</li>
                        <li>✅ Database Connected</li>
                        <li>✅ Admin Setup Complete</li>
                        <li>✅ Layout Controller Active</li>
                    </ul>
                </div>
                <div style="margin-top: 2rem;">
                    <button style="background: #3b82f6; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 6px; cursor: pointer; margin: 0.5rem;">
                        Dashboard
                    </button>
                    <button style="background: #10b981; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 6px; cursor: pointer; margin: 0.5rem;">
                        Subjects
                    </button>
                    <button style="background: #f59e0b; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 6px; cursor: pointer; margin: 0.5rem;">
                        Profile
                    </button>
                </div>
            </div>
        \`;
    </script>
</body>
</html>`;

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html'
      }
    });
  }

  /**
   * Serve the setup page
   */
  private serveSetupPage(): Response {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Freeducation - Setup</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <div id="root"></div>
    
    <script type="text/babel">
        const { useState, useEffect } = React;
        
        function AdminSetupForm({ onSubmit, isLoading }) {
            const [formData, setFormData] = useState({
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                profile_picture_url: ''
            });
            const [errors, setErrors] = useState({});

            const handleInputChange = (e) => {
                const { name, value } = e.target;
                setFormData(prev => ({ ...prev, [name]: value }));
                if (errors[name]) {
                    setErrors(prev => ({ ...prev, [name]: undefined }));
                }
            };

            const validateForm = () => {
                const newErrors = {};
                
                if (!formData.name.trim()) {
                    newErrors.name = 'Name is required';
                } else if (formData.name.trim().length < 2) {
                    newErrors.name = 'Name must be at least 2 characters';
                }

                if (!formData.email.trim()) {
                    newErrors.email = 'Email is required';
                } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.email)) {
                    newErrors.email = 'Invalid email format';
                }

                if (!formData.password) {
                    newErrors.password = 'Password is required';
                } else if (formData.password.length < 8) {
                    newErrors.password = 'Password must be at least 8 characters';
                }

                if (!formData.confirmPassword) {
                    newErrors.confirmPassword = 'Please confirm your password';
                } else if (formData.password !== formData.confirmPassword) {
                    newErrors.confirmPassword = 'Passwords do not match';
                }

                setErrors(newErrors);
                return Object.keys(newErrors).length === 0;
            };

            const handleSubmit = async (e) => {
                e.preventDefault();
                
                if (!validateForm()) {
                    return;
                }

                const { confirmPassword, ...submitData } = formData;
                await onSubmit(submitData);
            };

            return (
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                        Create Admin Account
                    </h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your full name"
                                disabled={isLoading}
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="admin@example.com"
                                disabled={isLoading}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password *
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Create a strong password"
                                disabled={isLoading}
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password *
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Re-enter your password"
                                disabled={isLoading}
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? 'Creating Admin...' : 'Create Admin Account'}
                        </button>
                    </form>
                </div>
            );
        }

        function SetupPage() {
            const [setupStatus, setSetupStatus] = useState({
                needsSetup: true,
                isLoading: true,
                error: null,
                success: false
            });

            useEffect(() => {
                checkSetupStatus();
            }, []);

            const checkSetupStatus = async () => {
                try {
                    const response = await fetch('/api/v1/admin/setup/check');
                    const data = await response.json();
                    
                    setSetupStatus({
                        needsSetup: data.needsSetup,
                        isLoading: false,
                        error: null
                    });
                } catch (error) {
                    setSetupStatus({
                        needsSetup: true,
                        isLoading: false,
                        error: 'Failed to check setup status'
                    });
                }
            };

            const handleAdminSubmit = async (data) => {
                try {
                    setSetupStatus(prev => ({ ...prev, isLoading: true, error: null }));
                    
                    const response = await fetch('/api/v1/admin/setup', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    });

                    const result = await response.json();

                    if (result.success) {
                        setSetupStatus({
                            needsSetup: false,
                            isLoading: false,
                            error: null,
                            success: true
                        });
                    } else {
                        setSetupStatus({
                            needsSetup: true,
                            isLoading: false,
                            error: result.message || 'Failed to create admin'
                        });
                    }
                } catch (error) {
                    setSetupStatus({
                        needsSetup: true,
                        isLoading: false,
                        error: 'Network error occurred'
                    });
                }
            };

            if (setupStatus.isLoading) {
                return (
                    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Checking setup status...</p>
                        </div>
                    </div>
                );
            }

            if (setupStatus.success) {
                return (
                    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
                            <div className="mb-4">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Admin Created Successfully!
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Your admin account has been created. You can now start using the platform.
                            </p>
                            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                                <p className="text-sm text-blue-800">
                                    <strong>Next Steps:</strong> The platform is ready for use. You can now log in with your admin credentials and start setting up subjects, content, and manage users.
                                </p>
                            </div>
                        </div>
                    </div>
                );
            }

            if (!setupStatus.needsSetup) {
                return (
                    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Platform Already Configured
                            </h2>
                            <p className="text-gray-600">
                                This platform has already been set up. Please contact your administrator if you need access.
                            </p>
                        </div>
                    </div>
                );
            }

            return (
                <div className="min-h-screen bg-gray-50">
                    <div className="container mx-auto px-4 py-8">
                        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                            <div className="max-w-4xl w-full space-y-8">
                                <div className="text-center">
                                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                        Welcome to Freeducation
                                    </h1>
                                    <p className="text-lg text-gray-600 mb-8">
                                        Let's set up your admin account to get started
                                    </p>
                                </div>

                                {setupStatus.error && (
                                    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm text-red-800">{setupStatus.error}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <AdminSetupForm 
                                    onSubmit={handleAdminSubmit}
                                    isLoading={setupStatus.isLoading}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        ReactDOM.render(<SetupPage />, document.getElementById('root'));
    </script>
</body>
</html>`;

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html'
      }
    });
  }
}
