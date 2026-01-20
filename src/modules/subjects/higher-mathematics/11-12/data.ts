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

const chapterTableByPaper: Record<string, string> = {
  first: "higher_mathematics_11_12_first_chapters",
  second: "higher_mathematics_11_12_second_chapters",
};

const getChapterTable = (paper: string): string => chapterTableByPaper[paper] ?? chapterTableByPaper.first;

export const listHigherMathematicsElevenTwelveChapters = async (
  db: D1Database,
  paper: string,
): Promise<HigherMathematicsElevenTwelveChapter[]> => {
  const chapterTable = getChapterTable(paper);
  const result = await db
    .prepare(`SELECT id, title, created_at as createdAt FROM ${chapterTable} ORDER BY createdAt ASC`)
    .all<HigherMathematicsElevenTwelveChapter>();
  return result.results.map((item) => ({ ...item, paper }));
};

export const getHigherMathematicsElevenTwelveChapter = async (
  db: D1Database,
  chapterId: number,
  paper: string,
): Promise<HigherMathematicsElevenTwelveChapter | null> => {
  const chapterTable = getChapterTable(paper);
  const result = await db
    .prepare(`SELECT id, title, created_at as createdAt FROM ${chapterTable} WHERE id = ?`)
    .bind(chapterId)
    .all<HigherMathematicsElevenTwelveChapter>();
  const item = result.results[0];
  if (!item) {
    return null;
  }
  return { ...item, paper };
};

export const createHigherMathematicsElevenTwelveChapter = async (
  db: D1Database,
  payload: { paper: string; title: string },
): Promise<void> => {
  const createdAt = new Date().toISOString();
  const chapterTable = getChapterTable(payload.paper);
  await db
    .prepare(`INSERT INTO ${chapterTable} (title, created_at) VALUES (?, ?)`)
    .bind(payload.title, createdAt)
    .run();
};
