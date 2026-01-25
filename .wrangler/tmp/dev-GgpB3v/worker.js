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

// backend/src/core/FrontendRenderer.ts
var FrontendRenderer = class {
  static {
    __name(this, "FrontendRenderer");
  }
  env;
  constructor(config) {
    this.env = config.env;
  }
  /**
   * Handle frontend requests
   */
  async handleRequest(path) {
    return this.serveMainApp();
  }
  /**
   * Serve the main application page
   */
  serveMainApp() {
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
   LOADING STATES
   =================================== */

.page-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.page-loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border, #e5e7eb);
  border-top: 3px solid var(--color-primary, #3b82f6);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.page-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: var(--spacing-4, 1rem);
  text-align: center;
}

.page-error-icon {
  width: 64px;
  height: 64px;
  margin-bottom: var(--spacing-4, 1rem);
  color: var(--color-error, #ef4444);
}

.page-error-title {
  font-size: var(--text-xl, 1.25rem);
  font-weight: 600;
  color: var(--color-text-primary, #111827);
  margin-bottom: var(--spacing-2, 0.5rem);
}

.page-error-message {
  font-size: var(--text-base, 1rem);
  color: var(--color-text-secondary, #6b7280);
  margin-bottom: var(--spacing-4, 1rem);
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
         APP CONTROLLER SCRIPT
         =================================== -->
    <script type="module">
        import { AppController } from '/core/AppController.js';
        
        // Initialize the app controller
        const appController = new AppController({
            onPageChange: (page) => {
                console.log('Page changed to:', page);
            },
            onAuthChange: (isAuthenticated, user) => {
                console.log('Auth state changed:', { isAuthenticated, user });
            }
        });
        
        appController.init();
    <\/script>
</body>
</html>`;
    return new Response(html, {
      headers: {
        "Content-Type": "text/html"
      }
    });
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

// backend/src/core/RequestRouter.ts
var RequestRouter = class {
  static {
    __name(this, "RequestRouter");
  }
  db;
  adminService;
  frontendRenderer;
  env;
  constructor(config) {
    this.env = config.env;
    this.db = new DatabaseManager(this.env.DB);
    this.adminService = new AdminSetupService(this.db);
    this.frontendRenderer = new FrontendRenderer({ env: this.env });
  }
  /**
   * Initialize the request router
   */
  async initialize() {
    await this.db.initialize();
  }
  /**
   * Handle incoming requests
   */
  async handleRequest(request) {
    const corsResponse = handleCORS(request);
    if (corsResponse) return corsResponse;
    try {
      const url = new URL(request.url);
      const path = url.pathname;
      const method = request.method;
      if (path === "/api/v1/admin/setup/check" && method === "GET") {
        return this.handleSetupCheck();
      }
      if (path === "/api/v1/admin/setup" && method === "POST") {
        return this.handleAdminSetup(request);
      }
      if (path === "/" || path.startsWith("/static/") || path.startsWith("/components/")) {
        return this.frontendRenderer.handleRequest(path);
      }
      return new Response("Not Found", { status: 404 });
    } catch (error) {
      console.error("Request router error:", error);
      return new Response("Internal Server Error", {
        status: 500,
        headers: corsHeaders()
      });
    }
  }
  /**
   * Handle setup check
   */
  async handleSetupCheck() {
    try {
      const result = await this.adminService.checkAdminSetup();
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
  /**
   * Handle admin setup
   */
  async handleAdminSetup(request) {
    try {
      const body = await request.json();
      const result = await this.adminService.createFirstAdmin(body);
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
};

// worker.js
var worker_default = {
  async fetch(request, env, ctx) {
    const requestRouter = new RequestRouter({ env });
    await requestRouter.initialize();
    return requestRouter.handleRequest(request);
  }
};

// ../../../../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
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
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
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
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
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
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
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
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
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
