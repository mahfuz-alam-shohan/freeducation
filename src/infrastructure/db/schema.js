import { PLATFORM_SCHEMA } from "../../config/index.js";

const PLATFORM_INDEXES = [
  "CREATE INDEX IF NOT EXISTS idx_freeducation_admins_email ON freeducation_admins(email)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_sessions_token_hash ON freeducation_sessions(token_hash)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_sessions_expires_at ON freeducation_sessions(expires_at)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_sessions_admin_id ON freeducation_sessions(admin_id)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_social_posts_created_at ON freeducation_social_posts(created_at)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_social_posts_admin_id ON freeducation_social_posts(admin_id)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_social_posts_created_id ON freeducation_social_posts(created_at DESC, id DESC)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_social_posts_admin_created_id ON freeducation_social_posts(admin_id, created_at DESC, id DESC)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_social_comments_post_id ON freeducation_social_comments(post_id)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_social_comments_post_created ON freeducation_social_comments(post_id, created_at ASC, id ASC)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_social_comments_admin_id ON freeducation_social_comments(admin_id)",
  "CREATE UNIQUE INDEX IF NOT EXISTS idx_freeducation_social_reactions_unique ON freeducation_social_reactions(post_id, admin_id)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_social_reactions_post_id ON freeducation_social_reactions(post_id)",
  "CREATE UNIQUE INDEX IF NOT EXISTS idx_freeducation_social_comment_reactions_unique ON freeducation_social_comment_reactions(comment_id, admin_id)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_social_comment_reactions_comment_id ON freeducation_social_comment_reactions(comment_id)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_social_comment_reactions_admin_id ON freeducation_social_comment_reactions(admin_id)",
];

export async function ensureSchema(db) {
  for (const [table, columns] of Object.entries(PLATFORM_SCHEMA)) {
    await db.prepare(`CREATE TABLE IF NOT EXISTS ${table} (${columns.map(([name, def]) => `${name} ${def}`).join(",")})`).run();
    await alignColumns(db, table, columns);
  }

  for (const indexQuery of PLATFORM_INDEXES) {
    await db.prepare(indexQuery).run();
  }
}

async function alignColumns(db, table, requiredColumns) {
  const required = new Map(requiredColumns);
  const currentInfo = await db.prepare(`PRAGMA table_info(${table})`).all();
  const currentCols = currentInfo.results.map((r) => r.name);

  const hasUnknown = currentCols.some((name) => !required.has(name));
  if (hasUnknown) {
    await rebuildTable(db, table, requiredColumns, currentCols.filter((name) => required.has(name)));
    return;
  }

  for (const [name, def] of requiredColumns) {
    if (!currentCols.includes(name)) {
      const addDef = def
        .replace(/\s+NOT\s+NULL/gi, "")
        .replace(/\s+UNIQUE/gi, "")
        .trim();
      await db.prepare(`ALTER TABLE ${table} ADD COLUMN ${name} ${addDef}`).run();
      await applyColumnBackfill(db, table, name);
    }
  }
}

async function applyColumnBackfill(db, table, column) {
  const now = new Date().toISOString();
  if (column === "created_at" || column === "updated_at") {
    await db.prepare(`UPDATE ${table} SET ${column} = ?1 WHERE ${column} IS NULL OR ${column} = ''`).bind(now).run();
  }
  if (column === "name") {
    await db.prepare(`UPDATE ${table} SET name = 'Administrator' WHERE name IS NULL OR name = ''`).run();
  }
  if (column === "user_type") {
    await db.prepare(`UPDATE ${table} SET user_type = 'Administrator' WHERE user_type IS NULL OR user_type = ''`).run();
  }
}

async function rebuildTable(db, table, requiredColumns, keepColumns) {
  const tempTable = `${table}_tmp_${Date.now()}`;
  const schemaSql = requiredColumns.map(([name, def]) => `${name} ${def}`).join(",");
  await db.prepare(`CREATE TABLE ${tempTable} (${schemaSql})`).run();

  if (keepColumns.length > 0) {
    const now = new Date().toISOString();
    const expressions = requiredColumns.map(([name, def]) => {
      if (keepColumns.includes(name)) return name;
      return defaultExpressionForColumn(name, def, now);
    });
    const targetColumns = requiredColumns.map(([name]) => name).join(",");
    await db.prepare(
      `INSERT INTO ${tempTable} (${targetColumns}) SELECT ${expressions.join(",")} FROM ${table}`,
    ).run();
  }

  await db.prepare(`DROP TABLE ${table}`).run();
  await db.prepare(`ALTER TABLE ${tempTable} RENAME TO ${table}`).run();

  for (const [name] of requiredColumns) {
    await applyColumnBackfill(db, table, name);
  }
}

function defaultExpressionForColumn(column, definition, now) {
  if (column === "created_at" || column === "updated_at") {
    return `'${now}'`;
  }
  if (column === "name") {
    return `'Administrator'`;
  }
  if (column === "user_type") {
    return `'Administrator'`;
  }

  const type = definition.split(/\s+/)[0]?.toUpperCase() || "TEXT";
  if (type.includes("INT") || type.includes("REAL") || type.includes("NUM")) {
    return "0";
  }
  return "''";
}
