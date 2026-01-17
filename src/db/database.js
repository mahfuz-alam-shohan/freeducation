// Database utilities and migration functions

import { tables } from './schema.js';

const tableRegistry = new Map();

export const registerTable = (table) => {
  tableRegistry.has(table.name) || tableRegistry.set(table.name, table);
};

export const getRegisteredTables = () => Array.from(tableRegistry.values());

// Register all tables
tables.forEach(registerTable);

export const createTableIfNotExists = async (db, table) => {
  const existingTable = await db
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?")
    .bind(table.name)
    .first();
  
  return existingTable?.name ? true : (await db.prepare(table.createSql).run(), false);
};

export const getTableColumns = async (db, tableName) => {
  const result = await db.prepare(`PRAGMA table_info(${tableName})`).all();
  return new Set((result.results || []).map(col => String(col.name)));
};

export const migrateLegacyUserData = async (db) => {
  const userColumns = await getTableColumns(db, "users");
  
  // Migrate user profiles
  if (userColumns.has("username") || userColumns.has("name") || userColumns.has("class_label") || userColumns.has("group_label")) {
    const usernameField = userColumns.has("username") ? "username" : "email";
    const nameField = userColumns.has("name") ? "name" : usernameField;
    
    await db.prepare(`
      INSERT INTO user_profiles (user_id, username, name)
      SELECT id, ${usernameField}, ${nameField}
      FROM users
      WHERE id NOT IN (SELECT user_id FROM user_profiles)
    `).run();
  }
  
  // Migrate academic profiles
  if (userColumns.has("class_label") || userColumns.has("group_label") || userColumns.has("religion") || 
      userColumns.has("date_of_birth") || userColumns.has("batch_year") || userColumns.has("points")) {
    const classLabelField = userColumns.has("class_label") ? "class_label" : "NULL";
    const groupLabelField = userColumns.has("group_label") ? "group_label" : "NULL";
    const religionField = userColumns.has("religion") ? "religion" : "NULL";
    const dateOfBirthField = userColumns.has("date_of_birth") ? "date_of_birth" : "NULL";
    const batchYearField = userColumns.has("batch_year") ? "batch_year" : "NULL";
    const pointsField = userColumns.has("points") ? "points" : "0";
    
    await db.prepare(`
      INSERT INTO academic_profiles (user_id, class_label, group_label, religion, date_of_birth, batch_year, points)
      SELECT id, ${classLabelField}, ${groupLabelField}, ${religionField}, ${dateOfBirthField}, ${batchYearField}, ${pointsField}
      FROM users
      WHERE role = 'student' AND id NOT IN (SELECT user_id FROM academic_profiles)
    `).run();
  }
};

export const getAllTables = async (db) => {
  return ((await db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all()).results || [])
    .map(table => String(table.name));
};

export const isSystemTable = (tableName) => {
  return tableName.startsWith("sqlite_") || tableName === "d1_migrations";
};

export const migrateDatabase = async (env) => {
  const registeredTables = getRegisteredTables();
  const registeredTableNames = new Set(registeredTables.map(table => table.name));
  
  const migrationResult = {
    createdTables: [],
    addedColumns: [],
    droppedTables: [],
    errors: []
  };
  
  // Get all existing tables
  const existingTables = await getAllTables(env);
  
  // Drop tables that are not registered (except system tables)
  for (const tableName of existingTables) {
    if (!isSystemTable(tableName) && !registeredTableNames.has(tableName)) {
      try {
        const safeTableName = tableName.replace(/"/g, '""');
        await env.DB.prepare(`DROP TABLE IF EXISTS "${safeTableName}"`).run();
        migrationResult.droppedTables.push(tableName);
      } catch (error) {
        migrationResult.errors.push({
          table: tableName,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
  }
  
  // Create or update registered tables
  for (const table of registeredTables) {
    try {
      const tableExists = await createTableIfNotExists(env.DB, table);
      
      if (tableExists) {
        migrationResult.createdTables.push(table.name);
        
        // Run seeds if they exist
        if (table.seeds && table.seeds.length) {
          const seedStatements = table.seeds.map(seed => env.DB.prepare(seed));
          await env.DB.batch(seedStatements);
        }
        continue;
      }
      
      // Check for missing columns and add them
      const existingColumns = await getTableColumns(env.DB, table.name);
      for (const column of table.columns) {
        if (!existingColumns.has(column.name)) {
          await env.DB.prepare(`ALTER TABLE ${table.name} ADD COLUMN ${column.name} ${column.sql}`).run();
          migrationResult.addedColumns.push({
            table: table.name,
            column: column.name,
            sql: column.sql
          });
        }
      }
    } catch (error) {
      migrationResult.errors.push({
        table: table.name,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
  
  // Run legacy data migration
  await migrateLegacyUserData(env);
  
  return migrationResult;
};

export const ensureTableColumns = async (db, tables) => {
  for (const table of tables) {
    try {
      const columns = await getTableColumns(db, table.name);
      
      for (const column of table.columns) {
        if (!columns.has(column.name)) {
          await db.prepare(`ALTER TABLE ${table.name} ADD COLUMN ${column.name} ${column.sql}`).run();
        }
      }
    } catch (error) {
      console.warn(`Skipping column check for ${table.name}.`, error);
    }
  }
};
