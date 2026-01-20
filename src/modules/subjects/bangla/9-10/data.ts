export type BanglaNineTenSahapathItem = {
  id: number;
  category: string;
  title: string;
  createdAt: string;
};

export type BanglaNineTenLiteratureItem = {
  id: number;
  category: string;
  title: string;
  createdAt: string;
};

type D1Database = {
  prepare: (query: string) => {
    all: <T = unknown>() => Promise<{ results: T[] }>;
    run: () => Promise<void>;
    bind: (...values: unknown[]) => {
      all: <T = unknown>() => Promise<{ results: T[] }>;
      run: () => Promise<void>;
    };
  };
};

const sahapathTable = "bangla_9_10_sahapath_items";
const literatureTable = "bangla_9_10_literature_items";

export const listBanglaNineTenSahapathItems = async (db: D1Database): Promise<BanglaNineTenSahapathItem[]> => {
  const result = await db
    .prepare(`SELECT id, category, title, created_at as createdAt FROM ${sahapathTable} ORDER BY createdAt ASC`)
    .all<BanglaNineTenSahapathItem>();
  return result.results;
};

export const getBanglaNineTenSahapathItem = async (
  db: D1Database,
  itemId: number,
): Promise<BanglaNineTenSahapathItem | null> => {
  const result = await db
    .prepare(`SELECT id, category, title, created_at as createdAt FROM ${sahapathTable} WHERE id = ?`)
    .bind(itemId)
    .all<BanglaNineTenSahapathItem>();
  return result.results[0] ?? null;
};

export const createBanglaNineTenSahapathItem = async (
  db: D1Database,
  payload: { category: string; title: string },
): Promise<void> => {
  const createdAt = new Date().toISOString();
  await db
    .prepare(`INSERT INTO ${sahapathTable} (category, title, created_at) VALUES (?, ?, ?)`)
    .bind(payload.category, payload.title, createdAt)
    .run();
};

export const updateBanglaNineTenSahapathItem = async (
  db: D1Database,
  payload: { id: number; category: string; title: string },
): Promise<void> => {
  await db
    .prepare(`UPDATE ${sahapathTable} SET category = ?, title = ? WHERE id = ?`)
    .bind(payload.category, payload.title, payload.id)
    .run();
};

export const updateBanglaNineTenSahapathItemTitle = async (
  db: D1Database,
  payload: { id: number; title: string },
): Promise<void> => {
  await db
    .prepare(`UPDATE ${sahapathTable} SET title = ? WHERE id = ?`)
    .bind(payload.title, payload.id)
    .run();
};

export const updateBanglaNineTenSahapathItemCategory = async (
  db: D1Database,
  payload: { id: number; category: string },
): Promise<void> => {
  await db
    .prepare(`UPDATE ${sahapathTable} SET category = ? WHERE id = ?`)
    .bind(payload.category, payload.id)
    .run();
};

export const deleteBanglaNineTenSahapathItem = async (db: D1Database, itemId: number): Promise<void> => {
  await db.prepare(`DELETE FROM ${sahapathTable} WHERE id = ?`).bind(itemId).run();
};

export const listBanglaNineTenLiteratureItems = async (
  db: D1Database,
  category: string,
): Promise<BanglaNineTenLiteratureItem[]> => {
  const result = await db
    .prepare(
      `SELECT id, category, title, created_at as createdAt FROM ${literatureTable} WHERE category = ? ORDER BY createdAt ASC`,
    )
    .bind(category)
    .all<BanglaNineTenLiteratureItem>();
  return result.results;
};

export const getBanglaNineTenLiteratureItem = async (
  db: D1Database,
  itemId: number,
): Promise<BanglaNineTenLiteratureItem | null> => {
  const result = await db
    .prepare(`SELECT id, category, title, created_at as createdAt FROM ${literatureTable} WHERE id = ?`)
    .bind(itemId)
    .all<BanglaNineTenLiteratureItem>();
  return result.results[0] ?? null;
};

export const createBanglaNineTenLiteratureItem = async (
  db: D1Database,
  payload: { category: string; title: string },
): Promise<void> => {
  const createdAt = new Date().toISOString();
  await db
    .prepare(`INSERT INTO ${literatureTable} (category, title, created_at) VALUES (?, ?, ?)`)
    .bind(payload.category, payload.title, createdAt)
    .run();
};

export const updateBanglaNineTenLiteratureItem = async (
  db: D1Database,
  payload: { id: number; title: string },
): Promise<void> => {
  await db
    .prepare(`UPDATE ${literatureTable} SET title = ? WHERE id = ?`)
    .bind(payload.title, payload.id)
    .run();
};

export const deleteBanglaNineTenLiteratureItem = async (db: D1Database, itemId: number): Promise<void> => {
  await db.prepare(`DELETE FROM ${literatureTable} WHERE id = ?`).bind(itemId).run();
};
