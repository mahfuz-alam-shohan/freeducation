export type MathematicsNineTenChapter = {
  id: number;
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

const chapterTable = "mathematics_9_10_chapters";

export const listMathematicsNineTenChapters = async (db: D1Database): Promise<MathematicsNineTenChapter[]> => {
  const result = await db
    .prepare(`SELECT id, title, created_at as createdAt FROM ${chapterTable} ORDER BY createdAt ASC`)
    .all<MathematicsNineTenChapter>();
  return result.results;
};

export const getMathematicsNineTenChapter = async (
  db: D1Database,
  chapterId: number,
): Promise<MathematicsNineTenChapter | null> => {
  const result = await db
    .prepare(`SELECT id, title, created_at as createdAt FROM ${chapterTable} WHERE id = ?`)
    .bind(chapterId)
    .all<MathematicsNineTenChapter>();
  return result.results[0] ?? null;
};

export const createMathematicsNineTenChapter = async (
  db: D1Database,
  payload: { title: string },
): Promise<void> => {
  const createdAt = new Date().toISOString();
  await db
    .prepare(`INSERT INTO ${chapterTable} (title, created_at) VALUES (?, ?)`)
    .bind(payload.title, createdAt)
    .run();
};
