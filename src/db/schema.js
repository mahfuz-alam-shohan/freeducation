import { ADMIN_SCHEMA } from "../config.js";

export async function ensureSchema(db) {
  for (const [table, columns] of Object.entries(ADMIN_SCHEMA)) {
    await db.prepare(`CREATE TABLE IF NOT EXISTS ${table} (${columns.map(([name, def]) => `${name} ${def}`).join(",")})`).run();
    await alignColumns(db, table, columns);
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

  const type = definition.split(/\s+/)[0]?.toUpperCase() || "TEXT";
  if (type.includes("INT") || type.includes("REAL") || type.includes("NUM")) {
    return "0";
  }
  return "''";
}
