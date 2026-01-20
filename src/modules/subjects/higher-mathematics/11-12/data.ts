export type HigherMathematicsElevenTwelveChapter = {
  id: number;
  paper: string;
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

const chapterTable = "higher_mathematics_11_12_chapters";

export const listHigherMathematicsElevenTwelveChapters = async (
  db: D1Database,
  paper: string,
): Promise<HigherMathematicsElevenTwelveChapter[]> => {
  const result = await db
    .prepare(`SELECT id, paper, title, created_at as createdAt FROM ${chapterTable} WHERE paper = ? ORDER BY createdAt ASC`)
    .bind(paper)
    .all<HigherMathematicsElevenTwelveChapter>();
  return result.results;
};

export const getHigherMathematicsElevenTwelveChapter = async (
  db: D1Database,
  chapterId: number,
): Promise<HigherMathematicsElevenTwelveChapter | null> => {
  const result = await db
    .prepare(`SELECT id, paper, title, created_at as createdAt FROM ${chapterTable} WHERE id = ?`)
    .bind(chapterId)
    .all<HigherMathematicsElevenTwelveChapter>();
  return result.results[0] ?? null;
};

export const createHigherMathematicsElevenTwelveChapter = async (
  db: D1Database,
  payload: { paper: string; title: string },
): Promise<void> => {
  const createdAt = new Date().toISOString();
  await db
    .prepare(`INSERT INTO ${chapterTable} (paper, title, created_at) VALUES (?, ?, ?)`)
    .bind(payload.paper, payload.title, createdAt)
    .run();
};
