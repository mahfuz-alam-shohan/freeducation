var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-qx4vt2/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
__name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, [
      stripCfConnectingIPHeader.apply(null, argArray)
    ]);
  }
});

// src/shared/infrastructure/database/schemas/registry.ts
var SCHEMA_REGISTRY = {
  "1.0.0": {
    version: "1.0.0",
    tables: ["users"],
    migrations: [
      "src/shared/infrastructure/database/schemas/v1.0.0/users.sql"
    ]
  }
};
var LATEST_VERSION = "1.0.0";

// src/shared/infrastructure/database/migrations/version.manager.ts
var VersionManager = class {
  db;
  constructor(db) {
    this.db = db;
  }
  async initializeMigrationTable() {
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version TEXT PRIMARY KEY,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        checksum TEXT NOT NULL
      )
    `);
  }
  async getCurrentVersion() {
    const result = await this.db.prepare(
      "SELECT version FROM schema_migrations ORDER BY applied_at DESC LIMIT 1"
    ).first();
    return result?.version || null;
  }
  async getAppliedMigrations() {
    const result = await this.db.prepare(
      "SELECT * FROM schema_migrations ORDER BY applied_at ASC"
    ).all();
    return result.results;
  }
  async markMigrationApplied(version, checksum) {
    await this.db.prepare(
      "INSERT OR REPLACE INTO schema_migrations (version, checksum) VALUES (?, ?)"
    ).bind(version, checksum).run();
  }
  async needsUpgrade() {
    const currentVersion = await this.getCurrentVersion();
    return currentVersion !== LATEST_VERSION;
  }
  getPendingMigrations(currentVersion) {
    if (!currentVersion) {
      return Object.keys(SCHEMA_REGISTRY);
    }
    const versions = Object.keys(SCHEMA_REGISTRY);
    const currentIndex = versions.indexOf(currentVersion);
    if (currentIndex === -1) {
      return versions;
    }
    return versions.slice(currentIndex + 1);
  }
  getSchemaVersion(version) {
    return SCHEMA_REGISTRY[version];
  }
};
__name(VersionManager, "VersionManager");

// src/shared/infrastructure/database/migrations/schema.comparator.ts
var SchemaComparator = class {
  db;
  constructor(db) {
    this.db = db;
  }
  async getTableSchema(tableName) {
    const tableInfo = await this.db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name=?
    `).bind(tableName).first();
    if (!tableInfo)
      return null;
    const columns = await this.db.prepare(`
      PRAGMA table_info(${tableName})
    `).all();
    const indexes = await this.db.prepare(`
      PRAGMA index_list(${tableName})
    `).all();
    const columnInfo = columns.results.map((col) => ({
      name: col.name,
      type: col.type,
      nullable: col.notnull === 0,
      default: col.dflt_value,
      primary_key: col.pk > 0
    }));
    const indexInfo = indexes.results.map((idx) => ({
      name: idx.name,
      columns: [],
      // Would need additional query to get columns
      unique: idx.unique === 1
    }));
    return {
      name: tableName,
      columns: columnInfo,
      indexes: indexInfo
    };
  }
  async compareTables(expected, actual) {
    const missing = expected.filter((table) => !actual.includes(table));
    const extra = actual.filter((table) => !expected.includes(table));
    const matching = expected.filter((table) => actual.includes(table));
    return { missing, extra, matching };
  }
  async needsTableRecreation(tableName, expectedSQL) {
    const currentSchema = await this.getTableSchema(tableName);
    if (!currentSchema)
      return true;
    const currentChecksum = await this.generateSchemaChecksum(tableName);
    const expectedChecksum = await this.generateChecksum(expectedSQL);
    return currentChecksum !== expectedChecksum;
  }
  async generateSchemaChecksum(tableName) {
    const schema = await this.getTableSchema(tableName);
    if (!schema)
      return "";
    const schemaString = JSON.stringify(schema);
    return this.simpleHash(schemaString);
  }
  async generateChecksum(sql) {
    return this.simpleHash(sql);
  }
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash.toString(16);
  }
  async dropTable(tableName) {
    await this.db.prepare(`DROP TABLE IF EXISTS ${tableName}`).run();
  }
  async createTable(sql) {
    await this.db.exec(sql);
  }
};
__name(SchemaComparator, "SchemaComparator");

// src/shared/infrastructure/database/migrations/rollback.manager.ts
var RollbackManager = class {
  db;
  constructor(db) {
    this.db = db;
  }
  async createBackup(tableName) {
    const backupName = `${tableName}_backup_${Date.now()}`;
    await this.db.prepare(`
      CREATE TABLE ${backupName} AS SELECT * FROM ${tableName}
    `).run();
    return backupName;
  }
  async restoreFromBackup(backupName, targetTableName) {
    await this.db.prepare(`DROP TABLE IF EXISTS ${targetTableName}`).run();
    await this.db.prepare(`ALTER TABLE ${backupName} RENAME TO ${targetTableName}`).run();
  }
  async cleanupBackup(backupName) {
    await this.db.prepare(`DROP TABLE IF EXISTS ${backupName}`).run();
  }
  async rollbackMigration(version) {
    console.log(`Rolling back migration version: ${version}`);
  }
};
__name(RollbackManager, "RollbackManager");

// src/shared/infrastructure/database/migrations/migration.service.ts
var MigrationService = class {
  versionManager;
  schemaComparator;
  rollbackManager;
  db;
  constructor(db) {
    this.db = db;
    this.versionManager = new VersionManager(db);
    this.schemaComparator = new SchemaComparator(db);
    this.rollbackManager = new RollbackManager(db);
  }
  async initialize() {
    await this.versionManager.initializeMigrationTable();
  }
  async runMigrations() {
    console.log("\u{1F504} Starting database migrations...");
    const currentVersion = await this.versionManager.getCurrentVersion();
    console.log(`\u{1F4CB} Current version: ${currentVersion || "none"}`);
    if (currentVersion === LATEST_VERSION) {
      console.log("\u2705 Database is up to date");
      return;
    }
    const pendingVersions = this.versionManager.getPendingMigrations(currentVersion);
    console.log(`\u{1F4E6} Pending migrations: ${pendingVersions.join(", ")}`);
    for (const version of pendingVersions) {
      await this.applyMigration(version);
    }
    console.log("\u2705 All migrations completed successfully");
  }
  async applyMigration(version) {
    console.log(`\u{1F680} Applying migration v${version}...`);
    const schema = this.versionManager.getSchemaVersion(version);
    for (const migrationPath of schema.migrations) {
      if (migrationPath.includes("users.sql")) {
        await this.applyUsersTableMigration();
      }
    }
    const checksum = this.generateChecksum(version);
    await this.versionManager.markMigrationApplied(version, checksum);
    console.log(`\u2705 Migration v${version} applied successfully`);
  }
  async applyUsersTableMigration() {
    const tableName = "users";
    const expectedTables = ["users"];
    const currentTablesResult = await this.db.prepare(`
      SELECT name FROM sqlite_master WHERE type='table'
    `).all();
    const currentTables = currentTablesResult.results.map((row) => row.name);
    const comparison = await this.schemaComparator.compareTables(expectedTables, currentTables);
    if (comparison.missing.includes(tableName)) {
      console.log(`\u{1F4DD} Creating table: ${tableName}`);
      const usersSQL = `
        CREATE TABLE users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          avatar_url TEXT,
          bio TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          is_active BOOLEAN DEFAULT 1
        );
        
        CREATE INDEX idx_users_email ON users(email);
        CREATE INDEX idx_users_role ON users(role);
        CREATE INDEX idx_users_active ON users(is_active);
      `;
      await this.schemaComparator.createTable(usersSQL);
    } else if (await this.schemaComparator.needsTableRecreation(tableName, "")) {
      console.log(`\u{1F504} Recreating table: ${tableName}`);
      await this.rollbackManager.createBackup(tableName);
      await this.schemaComparator.dropTable(tableName);
      const usersSQL = `
        CREATE TABLE users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          avatar_url TEXT,
          bio TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          is_active BOOLEAN DEFAULT 1
        );
        
        CREATE INDEX idx_users_email ON users(email);
        CREATE INDEX idx_users_role ON users(role);
        CREATE INDEX idx_users_active ON users(is_active);
      `;
      await this.schemaComparator.createTable(usersSQL);
    } else {
      console.log(`\u2705 Table ${tableName} is up to date`);
    }
  }
  generateChecksum(version) {
    return this.simpleHash(version + Date.now());
  }
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash.toString(16);
  }
  async verifyIntegrity() {
    try {
      const currentVersion = await this.versionManager.getCurrentVersion();
      const appliedMigrations = await this.versionManager.getAppliedMigrations();
      console.log(`\u{1F50D} Database integrity check:`);
      console.log(`   Version: ${currentVersion}`);
      console.log(`   Applied migrations: ${appliedMigrations.length}`);
      await this.db.prepare("SELECT COUNT(*) FROM users").first();
      console.log("\u2705 Database integrity verified");
      return true;
    } catch (error) {
      console.error("\u274C Database integrity check failed:", error);
      return false;
    }
  }
};
__name(MigrationService, "MigrationService");

// src/modules/users/entities/user.entity.ts
var UserEntity = class {
  id;
  email;
  password_hash;
  role;
  first_name;
  last_name;
  avatar_url;
  bio;
  created_at;
  updated_at;
  is_active;
  constructor(data) {
    this.id = data.id || 0;
    this.email = data.email || "";
    this.password_hash = data.password_hash || "";
    this.role = data.role || "student";
    this.first_name = data.first_name || "";
    this.last_name = data.last_name || "";
    this.avatar_url = data.avatar_url;
    this.bio = data.bio;
    this.created_at = data.created_at || (/* @__PURE__ */ new Date()).toISOString();
    this.updated_at = data.updated_at || (/* @__PURE__ */ new Date()).toISOString();
    this.is_active = data.is_active ?? true;
  }
  static fromDatabaseRow(row) {
    return new UserEntity({
      id: row.id,
      email: row.email,
      password_hash: row.password_hash,
      role: row.role,
      first_name: row.first_name,
      last_name: row.last_name,
      avatar_url: row.avatar_url,
      bio: row.bio,
      created_at: row.created_at,
      updated_at: row.updated_at,
      is_active: Boolean(row.is_active)
    });
  }
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      role: this.role,
      first_name: this.first_name,
      last_name: this.last_name,
      avatar_url: this.avatar_url,
      bio: this.bio,
      created_at: this.created_at,
      updated_at: this.updated_at,
      is_active: this.is_active
    };
  }
  updateTimestamp() {
    this.updated_at = (/* @__PURE__ */ new Date()).toISOString();
  }
};
__name(UserEntity, "UserEntity");

// src/modules/users/repositories/user.repo.ts
var UserRepository = class {
  db;
  constructor(db) {
    this.db = db;
  }
  async create(userData) {
    const hashedPassword = await this.hashPassword(userData.password);
    const result = await this.db.prepare(`
      INSERT INTO users (email, password_hash, role, first_name, last_name, avatar_url, bio)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      userData.email,
      hashedPassword,
      userData.role,
      userData.first_name,
      userData.last_name,
      userData.avatar_url || null,
      userData.bio || null
    ).run();
    if (!result.success) {
      throw new Error("Failed to create user");
    }
    const user = await this.findById(result.meta.last_row_id);
    if (!user) {
      throw new Error("User created but not found");
    }
    return user;
  }
  async findById(id) {
    const result = await this.db.prepare(`
      SELECT * FROM users WHERE id = ? AND is_active = 1
    `).bind(id).first();
    return result ? UserEntity.fromDatabaseRow(result) : null;
  }
  async findByEmail(email) {
    const result = await this.db.prepare(`
      SELECT * FROM users WHERE email = ? AND is_active = 1
    `).bind(email).first();
    return result ? UserEntity.fromDatabaseRow(result) : null;
  }
  async findByEmailWithPassword(email) {
    const result = await this.db.prepare(`
      SELECT * FROM users WHERE email = ? AND is_active = 1
    `).bind(email).first();
    return result ? UserEntity.fromDatabaseRow(result) : null;
  }
  async update(id, updateData) {
    const fields = [];
    const values = [];
    if (updateData.first_name !== void 0) {
      fields.push("first_name = ?");
      values.push(updateData.first_name);
    }
    if (updateData.last_name !== void 0) {
      fields.push("last_name = ?");
      values.push(updateData.last_name);
    }
    if (updateData.avatar_url !== void 0) {
      fields.push("avatar_url = ?");
      values.push(updateData.avatar_url);
    }
    if (updateData.bio !== void 0) {
      fields.push("bio = ?");
      values.push(updateData.bio);
    }
    if (updateData.is_active !== void 0) {
      fields.push("is_active = ?");
      values.push(updateData.is_active ? 1 : 0);
    }
    if (fields.length === 0) {
      return await this.findById(id);
    }
    fields.push("updated_at = CURRENT_TIMESTAMP");
    values.push(id);
    const result = await this.db.prepare(`
      UPDATE users SET ${fields.join(", ")} WHERE id = ?
    `).bind(...values).run();
    if (!result.success) {
      throw new Error("Failed to update user");
    }
    return await this.findById(id);
  }
  async delete(id) {
    const result = await this.db.prepare(`
      UPDATE users SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).bind(id).run();
    return result.success && (result.meta.changes || 0) > 0;
  }
  async findAll(limit = 50, offset = 0) {
    const result = await this.db.prepare(`
      SELECT * FROM users WHERE is_active = 1 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `).bind(limit, offset).all();
    return result.results.map((row) => UserEntity.fromDatabaseRow(row));
  }
  async count() {
    const result = await this.db.prepare(`
      SELECT COUNT(*) as count FROM users WHERE is_active = 1
    `).first();
    return result?.count || 0;
  }
  async hashPassword(password) {
    return password;
  }
};
__name(UserRepository, "UserRepository");

// src/modules/users/services/user.service.ts
var UserService = class {
  userRepository;
  constructor(db) {
    this.userRepository = new UserRepository(db);
  }
  async createUser(userData) {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }
    const user = await this.userRepository.create(userData);
    return user.toJSON();
  }
  async getUserById(id) {
    const user = await this.userRepository.findById(id);
    return user ? user.toJSON() : null;
  }
  async getUserByEmail(email) {
    const user = await this.userRepository.findByEmail(email);
    return user ? user.toJSON() : null;
  }
  async updateUser(id, updateData) {
    const user = await this.userRepository.update(id, updateData);
    return user ? user.toJSON() : null;
  }
  async deleteUser(id) {
    return await this.userRepository.delete(id);
  }
  async getAllUsers(limit = 50, offset = 0) {
    const users = await this.userRepository.findAll(limit, offset);
    return users.map((user) => user.toJSON());
  }
  async getUserCount() {
    return await this.userRepository.count();
  }
  async searchUsers(query, limit = 20) {
    const users = await this.userRepository.findAll(limit, 0);
    return users.map((user) => user.toJSON());
  }
};
__name(UserService, "UserService");

// src/modules/users/controllers/user.controller.ts
var UserController = class {
  userService;
  constructor(db) {
    this.userService = new UserService(db);
  }
  async createUser(request) {
    try {
      const body = await request.json();
      const user = await this.userService.createUser(body);
      return new Response(JSON.stringify({
        success: true,
        data: user,
        message: "User created successfully"
      }), {
        status: 201,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      return this.handleError(error);
    }
  }
  async getUserById(request, params) {
    try {
      const id = parseInt(params.id);
      if (isNaN(id)) {
        return new Response(JSON.stringify({
          success: false,
          error: "Invalid user ID"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
      const user = await this.userService.getUserById(id);
      if (!user) {
        return new Response(JSON.stringify({
          success: false,
          error: "User not found"
        }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
      return new Response(JSON.stringify({
        success: true,
        data: user
      }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      return this.handleError(error);
    }
  }
  async updateUser(request, params) {
    try {
      const id = parseInt(params.id);
      if (isNaN(id)) {
        return new Response(JSON.stringify({
          success: false,
          error: "Invalid user ID"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
      const body = await request.json();
      const user = await this.userService.updateUser(id, body);
      if (!user) {
        return new Response(JSON.stringify({
          success: false,
          error: "User not found"
        }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
      return new Response(JSON.stringify({
        success: true,
        data: user,
        message: "User updated successfully"
      }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      return this.handleError(error);
    }
  }
  async deleteUser(request, params) {
    try {
      const id = parseInt(params.id);
      if (isNaN(id)) {
        return new Response(JSON.stringify({
          success: false,
          error: "Invalid user ID"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
      const success = await this.userService.deleteUser(id);
      if (!success) {
        return new Response(JSON.stringify({
          success: false,
          error: "User not found"
        }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
      return new Response(JSON.stringify({
        success: true,
        message: "User deleted successfully"
      }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      return this.handleError(error);
    }
  }
  async getAllUsers(request) {
    try {
      const url = new URL(request.url);
      const limit = parseInt(url.searchParams.get("limit") || "50");
      const offset = parseInt(url.searchParams.get("offset") || "0");
      const users = await this.userService.getAllUsers(limit, offset);
      const count = await this.userService.getUserCount();
      return new Response(JSON.stringify({
        success: true,
        data: users,
        pagination: {
          limit,
          offset,
          total: count,
          hasMore: offset + limit < count
        }
      }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      return this.handleError(error);
    }
  }
  handleError(error) {
    console.error("UserController error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message.includes("not found") ? 404 : message.includes("already exists") ? 409 : 500;
    return new Response(JSON.stringify({
      success: false,
      error: message
    }), {
      status,
      headers: { "Content-Type": "application/json" }
    });
  }
};
__name(UserController, "UserController");

// src/modules/users/routes/user.routes.ts
var UserRoutes = class {
  controller;
  constructor(db) {
    this.controller = new UserController(db);
  }
  getRoutes() {
    return [
      {
        path: "/api/v1/users",
        method: "POST",
        handler: async (request, params, env) => {
          return await this.controller.createUser(request);
        }
      },
      {
        path: "/api/v1/users",
        method: "GET",
        handler: async (request, params, env) => {
          return await this.controller.getAllUsers(request);
        }
      },
      {
        path: "/api/v1/users/:id",
        method: "GET",
        handler: async (request, params, env) => {
          return await this.controller.getUserById(request, params);
        }
      },
      {
        path: "/api/v1/users/:id",
        method: "PUT",
        handler: async (request, params, env) => {
          return await this.controller.updateUser(request, params);
        }
      },
      {
        path: "/api/v1/users/:id",
        method: "DELETE",
        handler: async (request, params, env) => {
          return await this.controller.deleteUser(request, params);
        }
      }
    ];
  }
};
__name(UserRoutes, "UserRoutes");

// src/app.ts
async function createApp(env) {
  console.log("\u{1F680} Initializing FreeEducation Backend...");
  const migrationService = new MigrationService(env.DB);
  await migrationService.initialize();
  await migrationService.runMigrations();
  const userRoutes = new UserRoutes(env.DB);
  const allRoutes = [
    ...userRoutes.getRoutes()
  ];
  function matchRoute(path, method) {
    for (const route of allRoutes) {
      if (route.method === method) {
        if (route.path.includes(":id")) {
          const routeParts = route.path.split("/");
          const pathParts = path.split("/");
          if (routeParts.length === pathParts.length) {
            let matches = true;
            const params = {};
            for (let i = 0; i < routeParts.length; i++) {
              if (routeParts[i].startsWith(":")) {
                const paramName = routeParts[i].substring(1);
                params[paramName] = pathParts[i];
              } else if (routeParts[i] !== pathParts[i]) {
                matches = false;
                break;
              }
            }
            if (matches) {
              return { handler: route.handler, params };
            }
          }
        } else if (route.path === path) {
          return { handler: route.handler, params: {} };
        }
      }
    }
    return null;
  }
  __name(matchRoute, "matchRoute");
  return async (request) => {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };
    if (method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    const match = matchRoute(path, method);
    if (match) {
      try {
        const response = await match.handler(request, match.params, env);
        Object.entries(corsHeaders).forEach(([key, value]) => {
          response.headers.set(key, value);
        });
        return response;
      } catch (error) {
        console.error("Route handler error:", error);
        return new Response(JSON.stringify({
          success: false,
          error: "Internal server error"
        }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
    }
    return new Response(JSON.stringify({
      success: false,
      error: "Route not found",
      message: `Cannot ${method} ${path}`
    }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  };
}
__name(createApp, "createApp");

// worker.ts
var worker_default = {
  async fetch(request, env, ctx) {
    try {
      const app = await createApp(env);
      return await app(request);
    } catch (error) {
      console.error("Worker error:", error);
      return new Response(JSON.stringify({
        success: false,
        error: "Service unavailable"
      }), {
        status: 503,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
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

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
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

// .wrangler/tmp/bundle-qx4vt2/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// node_modules/wrangler/templates/middleware/common.ts
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

// .wrangler/tmp/bundle-qx4vt2/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
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
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
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
