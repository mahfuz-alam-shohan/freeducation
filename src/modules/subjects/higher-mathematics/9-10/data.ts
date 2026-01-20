export type HigherMathematicsNineTenChapter = {
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

const chapterTable = "higher_mathematics_9_10_chapters";

export const listHigherMathematicsNineTenChapters = async (
  db: D1Database,
): Promise<HigherMathematicsNineTenChapter[]> => {
  const result = await db
    .prepare(`SELECT id, title, created_at as createdAt FROM ${chapterTable} ORDER BY createdAt ASC`)
    .all<HigherMathematicsNineTenChapter>();
  return result.results;
};

export const getHigherMathematicsNineTenChapter = async (
  db: D1Database,
  chapterId: number,
): Promise<HigherMathematicsNineTenChapter | null> => {
  const result = await db
    .prepare(`SELECT id, title, created_at as createdAt FROM ${chapterTable} WHERE id = ?`)
    .bind(chapterId)
    .all<HigherMathematicsNineTenChapter>();
  return result.results[0] ?? null;
};

export const createHigherMathematicsNineTenChapter = async (
  db: D1Database,
  payload: { title: string },
): Promise<void> => {
  const createdAt = new Date().toISOString();
  await db
    .prepare(`INSERT INTO ${chapterTable} (title, created_at) VALUES (?, ?)`)
    .bind(payload.title, createdAt)
    .run();
};
