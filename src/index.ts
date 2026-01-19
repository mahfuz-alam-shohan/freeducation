import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { authRoutes } from './routes/auth.js';
import { adminRoutes } from './routes/admin.js';
import { setupRoutes } from './routes/setup.js';
import { initDatabase } from './db/init.js';
import { DatabaseManager } from './db/database.js';

type Bindings = {
  DB: D1Database;
  BUCKET: R2Bucket;
  JWT_SECRET: string;
  GMAIL_CLIENT_ID: string;
  GMAIL_CLIENT_SECRET: string;
  GMAIL_REFRESH_TOKEN: string;
};

type Variables = {
  db: DatabaseManager;
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Middleware
app.use('*', cors());
app.use('*', logger());

// Database initialization middleware
app.use('*', async (c, next) => {
  const db = new DatabaseManager(c.env.DB);
  
  // Initialize database if needed
  try {
    await initDatabase(c.env.DB);
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
  
  c.set('db', db);
  await next();
});

// Static routes
app.get('/', (c) => {
  return c.html(getAdminSetupPage());
});

// API Routes
app.route('/api/auth', authRoutes);
app.route('/api/admin', adminRoutes);
app.route('/api/setup', setupRoutes);

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;

function getAdminSetupPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Free Education - Admin Setup</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
    <div class="container mx-auto px-4 py-8">
        <div class="max-w-md mx-auto bg-white rounded-lg shadow-xl p-8">
            <div class="text-center mb-8">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                    <i class="fas fa-graduation-cap text-white text-2xl"></i>
                </div>
                <h1 class="text-3xl font-bold text-gray-800 mb-2">Free Education</h1>
                <p class="text-gray-600">Admin Account Setup</p>
            </div>

            <form id="adminSetupForm" class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        <i class="fas fa-user mr-2"></i>Full Name
                    </label>
                    <input type="text" id="fullName" required
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                           placeholder="Enter your full name">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        <i class="fas fa-envelope mr-2"></i>Email Address
                    </label>
                    <input type="email" id="email" required
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                           placeholder="admin@example.com">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        <i class="fas fa-id-card mr-2"></i>Username
                    </label>
                    <input type="text" id="username" required
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                           placeholder="Choose a username">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        <i class="fas fa-lock mr-2"></i>Password
                    </label>
                    <div class="relative">
                        <input type="password" id="password" required
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                               placeholder="Create a strong password">
                        <button type="button" id="togglePassword" 
                                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        <i class="fas fa-lock mr-2"></i>Confirm Password
                    </label>
                    <input type="password" id="confirmPassword" required
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                           placeholder="Confirm your password">
                </div>

                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 class="font-semibold text-blue-800 mb-2">
                        <i class="fas fa-info-circle mr-2"></i>Admin Account Information
                    </h3>
                    <ul class="text-sm text-blue-700 space-y-1">
                        <li>• Full system access and control</li>
                        <li>• User management capabilities</li>
                        <li>• Content moderation permissions</li>
                        <li>• Platform configuration access</li>
                    </ul>
                </div>

                <button type="submit" id="submitBtn"
                        class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 flex items-center justify-center">
                    <i class="fas fa-user-shield mr-2"></i>
                    Create Admin Account
                </button>

                <div id="errorMessage" class="hidden bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"></div>
                <div id="successMessage" class="hidden bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg"></div>
            </form>
        </div>
    </div>

    <script>
        // Password toggle functionality
        document.getElementById('togglePassword').addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });

        // Form validation and submission
        document.getElementById('adminSetupForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            const errorDiv = document.getElementById('errorMessage');
            const successDiv = document.getElementById('successMessage');
            const submitBtn = document.getElementById('submitBtn');
            
            // Reset messages
            errorDiv.classList.add('hidden');
            successDiv.classList.add('hidden');
            
            // Validation
            if (password.length < 8) {
                showError('Password must be at least 8 characters long');
                return;
            }
            
            if (password !== confirmPassword) {
                showError('Passwords do not match');
                return;
            }
            
            if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
                showError('Username must be 3-20 characters and contain only letters, numbers, and underscores');
                return;
            }
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Creating Account...';
            
            try {
                const response = await fetch('/api/setup/admin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        fullName,
                        email,
                        username,
                        password
                    })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    showSuccess('Admin account created successfully! Redirecting to dashboard...');
                    setTimeout(() => {
                        window.location.href = '/admin/dashboard';
                    }, 2000);
                } else {
                    showError(data.error || 'Failed to create admin account');
                }
            } catch (error) {
                showError('Network error. Please try again.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-user-shield mr-2"></i>Create Admin Account';
            }
        });
        
        function showError(message) {
            const errorDiv = document.getElementById('errorMessage');
            errorDiv.textContent = message;
            errorDiv.classList.remove('hidden');
        }
        
        function showSuccess(message) {
            const successDiv = document.getElementById('successMessage');
            successDiv.textContent = message;
            successDiv.classList.remove('hidden');
        }
    </script>
</body>
</html>`;
}
