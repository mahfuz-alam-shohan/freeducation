import type { Env } from "./types";

const TABLES = [
  {
    name: "admins",
    definition: [
      "id INTEGER PRIMARY KEY AUTOINCREMENT",
      "name TEXT NOT NULL",
      "email TEXT NOT NULL UNIQUE",
      "password_hash TEXT NOT NULL",
      "created_at TEXT NOT NULL"
    ]
  },
  {
    name: "admin_sessions",
    definition: [
      "id INTEGER PRIMARY KEY AUTOINCREMENT",
      "admin_id INTEGER NOT NULL",
      "token TEXT NOT NULL UNIQUE",
      "created_at TEXT NOT NULL",
      "expires_at TEXT NOT NULL",
      "FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE"
    ]
  },
  {
    name: "classes",
    definition: [
      "id INTEGER PRIMARY KEY AUTOINCREMENT",
      "name TEXT NOT NULL",
      "has_groups INTEGER NOT NULL DEFAULT 0",
      "created_at TEXT NOT NULL"
    ]
  },
  {
    name: "class_links",
    definition: [
      "id INTEGER PRIMARY KEY AUTOINCREMENT",
      "name TEXT NOT NULL",
      "created_at TEXT NOT NULL"
    ]
  },
  {
    name: "class_link_members",
    definition: [
      "link_id INTEGER NOT NULL",
      "class_id INTEGER NOT NULL",
      "PRIMARY KEY (link_id, class_id)",
      "FOREIGN KEY (link_id) REFERENCES class_links(id) ON DELETE CASCADE",
      "FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE"
    ]
  },
  {
    name: "class_groups",
    definition: [
      "id INTEGER PRIMARY KEY AUTOINCREMENT",
      "name TEXT NOT NULL",
      "class_id INTEGER",
      "link_id INTEGER",
      "created_at TEXT NOT NULL",
      "FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE",
      "FOREIGN KEY (link_id) REFERENCES class_links(id) ON DELETE CASCADE"
    ]
  },
  {
    name: "subjects",
    definition: [
      "id INTEGER PRIMARY KEY AUTOINCREMENT",
      "name TEXT NOT NULL",
      "class_id INTEGER",
      "group_id INTEGER",
      "link_id INTEGER",
      "created_at TEXT NOT NULL",
      "FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE",
      "FOREIGN KEY (group_id) REFERENCES class_groups(id) ON DELETE CASCADE",
      "FOREIGN KEY (link_id) REFERENCES class_links(id) ON DELETE CASCADE"
    ]
  },
  {
    name: "chapters",
    definition: [
      "id INTEGER PRIMARY KEY AUTOINCREMENT",
      "subject_id INTEGER NOT NULL",
      "name TEXT NOT NULL",
      "sort_order INTEGER DEFAULT 0",
      "created_at TEXT NOT NULL",
      "FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE"
    ]
  },
  {
    name: "topics",
    definition: [
      "id INTEGER PRIMARY KEY AUTOINCREMENT",
      "chapter_id INTEGER NOT NULL",
      "title TEXT NOT NULL",
      "sort_order INTEGER DEFAULT 0",
      "created_at TEXT NOT NULL",
      "FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE"
    ]
  },
  {
    name: "topic_contents",
    definition: [
      "id INTEGER PRIMARY KEY AUTOINCREMENT",
      "topic_id INTEGER NOT NULL",
      "type TEXT NOT NULL", // note, video, pdf, explanation
      "title TEXT NOT NULL",
      "data TEXT", // URL or Body text
      "sort_order INTEGER DEFAULT 0",
      "created_at TEXT NOT NULL",
      "FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE"
    ]
  },
  {
    name: "questions",
    definition: [
      "id INTEGER PRIMARY KEY AUTOINCREMENT",
      "chapter_id INTEGER NOT NULL",
      "topic_id INTEGER",
      "type TEXT NOT NULL", // mcq, short, board, versity, college, custom
      "source_label TEXT",
      "question TEXT NOT NULL",
      "cq_group_id TEXT",
      "cq_label TEXT",
      "cq_related INTEGER DEFAULT 0",
      "scenario_text TEXT",
      "scenario_media_type TEXT",
      "scenario_media_url TEXT",
      "options TEXT", // JSON string for MCQs
      "answer TEXT",
      "answer_type TEXT",
      "answer_media TEXT",
      "explanation TEXT",
      "sort_order INTEGER DEFAULT 0",
      "created_at TEXT NOT NULL",
      "FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE"
    ]
  }
];

const INDEXES = [
  "CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token)",
  "CREATE INDEX IF NOT EXISTS idx_chapters_subject_id ON chapters(subject_id)",
  "CREATE INDEX IF NOT EXISTS idx_topics_chapter_id ON topics(chapter_id)",
  "CREATE INDEX IF NOT EXISTS idx_content_topic_id ON topic_contents(topic_id)",
  "CREATE INDEX IF NOT EXISTS idx_questions_chapter_id ON questions(chapter_id)"
];

export async function ensureDatabase(env: Env): Promise<{ ok: boolean; message?: string }> {
  if (!env.DB) return { ok: false, message: "DB binding missing" };

  try {
    for (const table of TABLES) {
      await env.DB.prepare(`CREATE TABLE IF NOT EXISTS ${table.name} (${table.definition.join(", ")})`).run();
    }
    // Simple column syncer (basic migration)
    for (const table of TABLES) {
      for (const colDef of table.definition) {
        if (colDef.trim().match(/^(FOREIGN|PRIMARY|CONSTRAINT|UNIQUE|CHECK)/i)) continue;
        try {
          await env.DB.prepare(`ALTER TABLE ${table.name} ADD COLUMN ${colDef}`).run();
        } catch (e: any) { }
      }
    }
    for (const idx of INDEXES) {
      await env.DB.prepare(idx).run();
    }
    return { ok: true };
  } catch (e: any) {
    console.error("Critical Schema Error:", e);
    return { ok: true, message: "Schema sync partial warning" };
  }
}

export async function resetDatabase(env: Env) {
  const tableNames = TABLES.map(t => t.name).reverse();
  for (const t of tableNames) {
    try {
      await env.DB.prepare(`DROP TABLE IF EXISTS ${t}`).run();
    } catch(e) {}
  }
  await ensureDatabase(env);
}
