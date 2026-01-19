export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      if (url.pathname === '/' && request.method === 'GET') {
        return new Response(getAdminSetupPage(), {
          headers: { 'Content-Type': 'text/html', ...corsHeaders }
        });
      }

      if (url.pathname === '/api/setup/admin' && request.method === 'POST') {
        const body = await request.json();
        const result = await createAdminAccount(env.DB, env.JWT_SECRET, body);
        return new Response(JSON.stringify(result), {
          status: result.success ? 200 : 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      return new Response('Not Found', { status: 404 });

    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  }
};

async function createAdminAccount(db, jwtSecret, body) {
  try {
    const { fullName, email, username, password } = body;

    // Validation
    if (!fullName || !email || !username || !password) {
      return { error: 'All fields are required' };
    }

    if (password.length < 8) {
      return { error: 'Password must be at least 8 characters long' };
    }

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      return { error: 'Username must be 3-20 characters and contain only letters, numbers, and underscores' };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { error: 'Invalid email format' };
    }

    // Create users table if it doesn't exist
    try {
      await db.prepare(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        user_type VARCHAR(20) NOT NULL DEFAULT 'student',
        is_active BOOLEAN DEFAULT 1,
        email_verified BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME
      )`).run();
    } catch (error) {
      console.log('Table might already exist:', error.message);
    }

    // Check if user already exists
    const existingUser = await db.prepare(`
      SELECT id FROM users WHERE email = ? OR username = ?
    `).bind(email, username).first();

    if (existingUser) {
      return { error: 'User with this email or username already exists' };
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create admin user
    const result = await db.prepare(`
      INSERT INTO users (username, email, password_hash, full_name, user_type, is_active, email_verified)
      VALUES (?, ?, ?, ?, 'admin', 1, 1)
    `).bind(username, email, passwordHash, fullName).run();

    if (!result.success) {
      return { error: 'Failed to create admin account' };
    }

    const adminId = result.meta.last_row_id;

    // Create JWT token
    const token = await createToken(adminId, username, jwtSecret);

    return {
      success: true,
      message: 'Admin account created successfully',
      admin: {
        id: adminId,
        username,
        email,
        fullName,
        userType: 'admin'
      },
      token
    };

  } catch (error) {
    console.error('Admin setup failed:', error);
    return { error: 'Internal server error during admin setup' };
  }
}

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

async function createToken(userId, username, secret) {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const payload = {
    sub: userId.toString(),
    username: username,
    userType: 'admin',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
  };

  const headerBase64 = btoa(JSON.stringify(header));
  const payloadBase64 = btoa(JSON.stringify(payload));
  
  const signature = await signData(`${headerBase64}.${payloadBase64}`, secret);
  
  return `${headerBase64}.${payloadBase64}.${signature}`;
}

async function signData(data, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

function getAdminSetupPage() {
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
            
            errorDiv.classList.add('hidden');
            successDiv.classList.add('hidden');
            
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
                
                if (response.ok && data.success) {
                    showSuccess('Admin account created successfully!');
                    submitBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Account Created';
                } else {
                    showError(data.error || 'Failed to create admin account');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-user-shield mr-2"></i>Create Admin Account';
                }
            } catch (error) {
                showError('Network error. Please try again.');
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
