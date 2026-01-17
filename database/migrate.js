// Database migration and repair script
// This script will clean and repair the database automatically

export async function migrateDatabase(db) {
  console.log('Starting database migration and repair...');
  
  try {
    // Step 1: Get list of all existing tables
    const tables = await db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `).all();
    
    console.log('Existing tables:', tables.results?.map(t => t.name) || []);
    
    // Step 2: Drop all existing tables to ensure clean start
    const tablesToDrop = ['sessions', 'users', 'admins', 'system_config'];
    
    for (const tableName of tablesToDrop) {
      try {
        await db.prepare(`DROP TABLE IF EXISTS ${tableName}`).run();
        console.log(`Dropped table: ${tableName}`);
      } catch (error) {
        console.log(`Table ${tableName} didn't exist or couldn't be dropped:`, error.message);
      }
    }
    
    // Step 3: Create clean tables with correct structure
    await createSystemConfigTable(db);
    await createAdminsTable(db);
    await createUsersTable(db);
    await createSessionsTable(db);
    
    // Step 4: Create indexes
    await createIndexes(db);
    
    // Step 5: Insert initial data
    await insertInitialData(db);
    
    console.log('Database migration and repair completed successfully!');
    return { success: true, message: 'Database cleaned and repaired' };
    
  } catch (error) {
    console.error('Database migration failed:', error);
    return { success: false, error: error.message };
  }
}

async function createSystemConfigTable(db) {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS system_config (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
  console.log('Created system_config table');
}

async function createAdminsTable(db) {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        date_of_birth TEXT NOT NULL,
        is_active BOOLEAN DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
  console.log('Created admins table');
}

async function createUsersTable(db) {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_type TEXT NOT NULL DEFAULT 'student',
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        date_of_birth TEXT NOT NULL,
        is_active BOOLEAN DEFAULT 1,
        created_by_admin INTEGER,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by_admin) REFERENCES admins(id)
    )
  `).run();
  console.log('Created users table');
}

async function createSessionsTable(db) {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        user_type TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES admins(id) ON DELETE CASCADE
    )
  `).run();
  console.log('Created sessions table');
}

async function createIndexes(db) {
  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email)',
    'CREATE INDEX IF NOT EXISTS idx_admins_active ON admins(is_active)',
    'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
    'CREATE INDEX IF NOT EXISTS idx_users_type ON users(user_type)',
    'CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at)'
  ];
  
  for (const indexSql of indexes) {
    try {
      await db.prepare(indexSql).run();
    } catch (error) {
      console.log('Index creation warning:', error.message);
    }
  }
  console.log('Created database indexes');
}

async function insertInitialData(db) {
  // Clean existing config data
  await db.prepare('DELETE FROM system_config').run();
  
  // Insert fresh configuration
  const configData = [
    ['admin_initialized', 'false'],
    ['app_version', '1.0.0'],
    ['maintenance_mode', 'false'],
    ['db_schema_version', '1.0.0'],
    ['last_cleaned', new Date().toISOString()]
  ];
  
  for (const [key, value] of configData) {
    await db.prepare(`
      INSERT INTO system_config (key, value) VALUES (?, ?)
    `).bind(key, value).run();
  }
  
  console.log('Inserted initial configuration data');
}
