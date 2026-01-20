export type BanglaElevenTwelveSahapathItem = {
  id: number;
  category: string;
  title: string;
  createdAt: string;
};

export type BanglaElevenTwelveLiteratureItem = {
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

const sahapathTable = "bangla_11_12_sahapath_items";
const literatureTable = "bangla_11_12_literature_items";

export const listBanglaElevenTwelveSahapathItems = async (
  db: D1Database,
): Promise<BanglaElevenTwelveSahapathItem[]> => {
  const result = await db
    .prepare(`SELECT id, category, title, created_at as createdAt FROM ${sahapathTable} ORDER BY createdAt ASC`)
    .all<BanglaElevenTwelveSahapathItem>();
  return result.results;
};

export const getBanglaElevenTwelveSahapathItem = async (
  db: D1Database,
  itemId: number,
): Promise<BanglaElevenTwelveSahapathItem | null> => {
  const result = await db
    .prepare(`SELECT id, category, title, created_at as createdAt FROM ${sahapathTable} WHERE id = ?`)
    .bind(itemId)
    .all<BanglaElevenTwelveSahapathItem>();
  return result.results[0] ?? null;
};

export const createBanglaElevenTwelveSahapathItem = async (
  db: D1Database,
  payload: { category: string; title: string },
): Promise<void> => {
  const createdAt = new Date().toISOString();
  await db
    .prepare(`INSERT INTO ${sahapathTable} (category, title, created_at) VALUES (?, ?, ?)`)
    .bind(payload.category, payload.title, createdAt)
    .run();
};

export const updateBanglaElevenTwelveSahapathItem = async (
  db: D1Database,
  payload: { id: number; category: string; title: string },
): Promise<void> => {
  await db
    .prepare(`UPDATE ${sahapathTable} SET category = ?, title = ? WHERE id = ?`)
    .bind(payload.category, payload.title, payload.id)
    .run();
};

export const updateBanglaElevenTwelveSahapathItemTitle = async (
  db: D1Database,
  payload: { id: number; title: string },
): Promise<void> => {
  await db
    .prepare(`UPDATE ${sahapathTable} SET title = ? WHERE id = ?`)
    .bind(payload.title, payload.id)
    .run();
};

export const updateBanglaElevenTwelveSahapathItemCategory = async (
  db: D1Database,
  payload: { id: number; category: string },
): Promise<void> => {
  await db
    .prepare(`UPDATE ${sahapathTable} SET category = ? WHERE id = ?`)
    .bind(payload.category, payload.id)
    .run();
};

export const deleteBanglaElevenTwelveSahapathItem = async (db: D1Database, itemId: number): Promise<void> => {
  await db.prepare(`DELETE FROM ${sahapathTable} WHERE id = ?`).bind(itemId).run();
};

export const listBanglaElevenTwelveLiteratureItems = async (
  db: D1Database,
  category: string,
): Promise<BanglaElevenTwelveLiteratureItem[]> => {
  const result = await db
    .prepare(
      `SELECT id, category, title, created_at as createdAt FROM ${literatureTable} WHERE category = ? ORDER BY createdAt ASC`,
    )
    .bind(category)
    .all<BanglaElevenTwelveLiteratureItem>();
  return result.results;
};

export const getBanglaElevenTwelveLiteratureItem = async (
  db: D1Database,
  itemId: number,
): Promise<BanglaElevenTwelveLiteratureItem | null> => {
  const result = await db
    .prepare(`SELECT id, category, title, created_at as createdAt FROM ${literatureTable} WHERE id = ?`)
    .bind(itemId)
    .all<BanglaElevenTwelveLiteratureItem>();
  return result.results[0] ?? null;
};

export const createBanglaElevenTwelveLiteratureItem = async (
  db: D1Database,
  payload: { category: string; title: string },
): Promise<void> => {
  const createdAt = new Date().toISOString();
  await db
    .prepare(`INSERT INTO ${literatureTable} (category, title, created_at) VALUES (?, ?, ?)`)
    .bind(payload.category, payload.title, createdAt)
    .run();
};

export const updateBanglaElevenTwelveLiteratureItem = async (
  db: D1Database,
  payload: { id: number; title: string },
): Promise<void> => {
  await db
    .prepare(`UPDATE ${literatureTable} SET title = ? WHERE id = ?`)
    .bind(payload.title, payload.id)
    .run();
};

export const deleteBanglaElevenTwelveLiteratureItem = async (db: D1Database, itemId: number): Promise<void> => {
  await db.prepare(`DELETE FROM ${literatureTable} WHERE id = ?`).bind(itemId).run();
};
