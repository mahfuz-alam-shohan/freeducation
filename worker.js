import { DatabaseManager } from './backend/src/core/database/database_manager';
import { AdminSetupService } from './backend/src/api/v1/admin/setup';
import { corsHeaders, handleCORS } from './backend/src/api/middleware/cors';

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    const corsResponse = handleCORS(request);
    if (corsResponse) return corsResponse;

    try {
      // Initialize database
      const db = new DatabaseManager(env.DB);
      await db.initialize();

      const url = new URL(request.url);
      const path = url.pathname;

      // Route handling
      if (path === '/api/v1/admin/setup/check' && request.method === 'GET') {
        return handleSetupCheck(db);
      }

      if (path === '/api/v1/admin/setup' && request.method === 'POST') {
        return handleAdminSetup(request, db);
      }

      // Serve frontend files
      if (path === '/' || path.startsWith('/static/')) {
        return serveFrontend(path);
      }

      // Default response
      return new Response('Not Found', { status: 404 });

    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Internal Server Error', { 
        status: 500,
        headers: corsHeaders()
      });
    }
  }
};

async function handleSetupCheck(db) {
  try {
    const adminService = new AdminSetupService(db);
    const result = await adminService.checkAdminSetup();
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders()
      }
    });
  } catch (error) {
    console.error('Setup check error:', error);
    return new Response(JSON.stringify({ error: 'Failed to check setup status' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders()
      }
    });
  }
}

async function handleAdminSetup(request, db) {
  try {
    const body = await request.json();
    const adminService = new AdminSetupService(db);
    const result = await adminService.createFirstAdmin(body);
    
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders()
      }
    });
  } catch (error) {
    console.error('Admin setup error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Failed to create admin account' 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders()
      }
    });
  }
}

async function serveFrontend(path) {
  // For now, serve a simple HTML page with the setup form
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Profile Picture URL (Optional)
                            </label>
                            <input
                                type="url"
                                name="profile_picture_url"
                                value={formData.profile_picture_url}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="https://example.com/profile.jpg"
                                disabled={isLoading}
                            />
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
      'Content-Type': 'text/html',
      ...corsHeaders()
    }
  });
}