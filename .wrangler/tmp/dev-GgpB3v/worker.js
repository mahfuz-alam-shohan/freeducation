var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// backend/src/core/database/migrations/migration_manager.ts
var MigrationManager = class {
  constructor(db) {
    this.db = db;
  }
  static {
    __name(this, "MigrationManager");
  }
  migrations = [];
  addMigration(migration) {
    this.migrations.push(migration);
  }
  async runMigrations() {
    await this.db.prepare(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version TEXT PRIMARY KEY,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
    const appliedResult = await this.db.prepare(
      "SELECT version FROM schema_migrations ORDER BY version"
    ).all();
    const appliedVersions = new Set(appliedResult.results?.map((row) => row.version) || []);
    for (const migration of this.migrations) {
      if (!appliedVersions.has(migration.version)) {
        console.log(`Running migration: ${migration.version} - ${migration.description}`);
        try {
          await this.db.prepare(migration.up).run();
          await this.db.prepare(
            "INSERT INTO schema_migrations (version) VALUES (?)"
          ).bind(migration.version).run();
          console.log(`Migration ${migration.version} completed successfully`);
        } catch (error) {
          console.error(`Migration ${migration.version} failed:`, error);
          throw error;
        }
      }
    }
  }
  async resetDatabase() {
    console.log("Resetting database...");
    const tables = [
      "schema_migrations",
      "system_settings",
      "subjects",
      "users"
    ];
    for (const table of tables) {
      try {
        await this.db.prepare(`DROP TABLE IF EXISTS ${table}`).run();
        console.log(`Dropped table: ${table}`);
      } catch (error) {
        console.warn(`Failed to drop table ${table}:`, error);
      }
    }
    this.migrations = [];
  }
  async checkAndRecreate() {
    const tables = ["users", "subjects", "system_settings"];
    for (const table of tables) {
      try {
        const result = await this.db.prepare(`PRAGMA table_info(${table})`).all();
        if (!result.results || result.results.length === 0) {
          console.log(`Table ${table} missing, will recreate`);
          await this.resetDatabase();
          await this.runMigrations();
          return;
        }
      } catch (error) {
        console.log(`Error checking table ${table}, recreating database:`, error);
        await this.resetDatabase();
        await this.runMigrations();
        return;
      }
    }
  }
};

// backend/src/core/database/models/user.ts
var UserModel = class {
  constructor(db) {
    this.db = db;
  }
  static {
    __name(this, "UserModel");
  }
  async create(userData) {
    const id = crypto.randomUUID();
    const password_hash = await this.hashPassword(userData.password);
    const result = await this.db.prepare(`
      INSERT INTO users (id, email, password_hash, name, role, profile_picture_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      userData.email,
      password_hash,
      userData.name,
      userData.role || "student",
      userData.profile_picture_url || null
    ).run();
    if (!result.success) {
      throw new Error("Failed to create user");
    }
    return this.findById(id);
  }
  async findById(id) {
    const result = await this.db.prepare(
      "SELECT * FROM users WHERE id = ?"
    ).bind(id).first();
    return result;
  }
  async findByEmail(email) {
    const result = await this.db.prepare(
      "SELECT * FROM users WHERE email = ?"
    ).bind(email).first();
    return result || null;
  }
  async updateLastLogin(id) {
    await this.db.prepare(
      "UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?"
    ).bind(id).run();
  }
  async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  async verifyPassword(password, hash) {
    const passwordHash = await this.hashPassword(password);
    return passwordHash === hash;
  }
};

// backend/src/core/database/models/system_settings.ts
var SystemSettingsModel = class {
  constructor(db) {
    this.db = db;
  }
  static {
    __name(this, "SystemSettingsModel");
  }
  async get(key) {
    const result = await this.db.prepare(
      "SELECT value FROM system_settings WHERE key = ?"
    ).bind(key).first();
    return result?.value || null;
  }
  async set(key, value) {
    await this.db.prepare(`
      INSERT OR REPLACE INTO system_settings (key, value, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `).bind(key, value).run();
  }
  async isAdminCreated() {
    const value = await this.get("admin_created");
    return value === "true";
  }
  async markAdminCreated() {
    await this.set("admin_created", "true");
  }
};

// backend/src/core/database/database_manager.ts
var DatabaseManager = class {
  constructor(db) {
    this.db = db;
    this.migrationManager = new MigrationManager(db);
    this.users = new UserModel(db);
    this.systemSettings = new SystemSettingsModel(db);
  }
  static {
    __name(this, "DatabaseManager");
  }
  migrationManager;
  users;
  systemSettings;
  async initialize() {
    console.log("Initializing database...");
    const migrationSQL = await this.loadMigration("001_initial_schema.sql");
    this.migrationManager.addMigration({
      version: "001",
      description: "Initial database schema",
      up: migrationSQL
    });
    await this.migrationManager.checkAndRecreate();
    await this.migrationManager.runMigrations();
    console.log("Database initialized successfully");
  }
  async loadMigration(filename) {
    return `
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'student',
        profile_picture_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT 1,
        email_verified BOOLEAN DEFAULT 0,
        last_login_at DATETIME
      );

      CREATE TABLE IF NOT EXISTS subjects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL,
        teacher_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT 1,
        FOREIGN KEY (teacher_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS system_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      INSERT OR IGNORE INTO system_settings (key, value) VALUES 
        ('admin_created', 'false'),
        ('site_name', 'Freeducation'),
        ('maintenance_mode', 'false');
    `;
  }
};

// backend/src/api/v1/admin/setup.ts
var AdminSetupService = class {
  constructor(db) {
    this.db = db;
  }
  static {
    __name(this, "AdminSetupService");
  }
  async createFirstAdmin(data) {
    try {
      const adminExists = await this.db.systemSettings.isAdminCreated();
      if (adminExists) {
        return { success: false, message: "Admin already exists" };
      }
      const validation = this.validateAdminData(data);
      if (!validation.isValid) {
        return { success: false, message: validation.message };
      }
      const admin = await this.db.users.create({
        ...data,
        role: "admin"
      });
      await this.db.systemSettings.markAdminCreated();
      return {
        success: true,
        message: "Admin created successfully",
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        }
      };
    } catch (error) {
      console.error("Error creating admin:", error);
      return { success: false, message: "Failed to create admin" };
    }
  }
  async checkAdminSetup() {
    const adminExists = await this.db.systemSettings.isAdminCreated();
    return { needsSetup: !adminExists };
  }
  validateAdminData(data) {
    if (!data.name || data.name.trim().length < 2) {
      return { isValid: false, message: "Name must be at least 2 characters long" };
    }
    if (!data.email || !this.isValidEmail(data.email)) {
      return { isValid: false, message: "Please provide a valid email address" };
    }
    if (!data.password || data.password.length < 8) {
      return { isValid: false, message: "Password must be at least 8 characters long" };
    }
    return { isValid: true, message: "Valid data" };
  }
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
};

// backend/src/api/middleware/cors.ts
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400"
  };
}
__name(corsHeaders, "corsHeaders");
function handleCORS(request) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders()
    });
  }
  return null;
}
__name(handleCORS, "handleCORS");

// worker.js
var worker_default = {
  async fetch(request, env2, ctx) {
    const corsResponse = handleCORS(request);
    if (corsResponse) return corsResponse;
    try {
      const db = new DatabaseManager(env2.DB);
      await db.initialize();
      const url = new URL(request.url);
      const path = url.pathname;
      if (path === "/api/v1/admin/setup/check" && request.method === "GET") {
        return handleSetupCheck(db);
      }
      if (path === "/api/v1/admin/setup" && request.method === "POST") {
        return handleAdminSetup(request, db);
      }
      if (path === "/" || path.startsWith("/static/")) {
        return serveFrontend(path);
      }
      return new Response("Not Found", { status: 404 });
    } catch (error) {
      console.error("Worker error:", error);
      return new Response("Internal Server Error", {
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
        "Content-Type": "application/json",
        ...corsHeaders()
      }
    });
  } catch (error) {
    console.error("Setup check error:", error);
    return new Response(JSON.stringify({ error: "Failed to check setup status" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders()
      }
    });
  }
}
__name(handleSetupCheck, "handleSetupCheck");
async function handleAdminSetup(request, db) {
  try {
    const body = await request.json();
    const adminService = new AdminSetupService(db);
    const result = await adminService.createFirstAdmin(body);
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders()
      }
    });
  } catch (error) {
    console.error("Admin setup error:", error);
    return new Response(JSON.stringify({
      success: false,
      message: "Failed to create admin account"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders()
      }
    });
  }
}
__name(handleAdminSetup, "handleAdminSetup");
async function serveFrontend(path) {
  try {
    const db = new DatabaseManager(env.DB);
    await db.initialize();
    const adminService = new AdminSetupService(db);
    const result = await adminService.checkAdminSetup();
    if (result.needsSetup) {
      return serveSetupPage();
    }
  } catch (error) {
    console.log("Could not check setup status, serving setup page");
    return serveSetupPage();
  }
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Freeducation</title>
    <link rel="stylesheet" href="/components/common/layouts/LayoutController.css">
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
        import { LayoutController } from '/components/common/layouts/LayoutController.js';
        
        // Initialize the layout controller
        const layoutController = new LayoutController({
            onPageChange: (page) => {
                console.log('Page changed to:', page);
                // Handle page change logic here
            },
            onAuthChange: (isAuthenticated, user) => {
                console.log('Auth state changed:', { isAuthenticated, user });
                // Handle auth change logic here
            }
        });
        
        layoutController.init();
    <\/script>
</body>
</html>`;
  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
      ...corsHeaders()
    }
  });
}
__name(serveFrontend, "serveFrontend");
async function serveSetupPage() {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Freeducation - Setup</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"><\/script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"><\/script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
    <script src="https://cdn.tailwindcss.com"><\/script>
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
    <\/script>
</body>
</html>`;
  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
      ...corsHeaders()
    }
  });
}
__name(serveSetupPage, "serveSetupPage");

// ../../../../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../../../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-eFxvu7/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// ../../../../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env2, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env2, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-eFxvu7/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env2, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env2, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env2, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env2, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=worker.js.map
