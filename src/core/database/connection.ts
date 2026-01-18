import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export interface Database {
  db: ReturnType<typeof drizzle<typeof schema>>;
  rawDB: D1Database;
}

export function createDatabase(env: any): Database {
  return {
    db: drizzle(env.DB, { schema }),
    rawDB: env.DB
  };
}

// Auto-migration function
export async function runMigrations(database: Database) {
  try {
    const { db, rawDB } = database;
    
    // Check if users table exists and has the correct schema
    const tableCheck = await rawDB.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='system_settings'
    `).first();

    if (!tableCheck) {
      // First time setup - create all tables
      await createInitialTables(rawDB);
    } else {
      // Check for schema updates
      await updateSchema(rawDB);
    }

    console.log('Database migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    // If migration fails due to schema conflict, we need to reset
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('no such column')) {
      console.log('Schema conflict detected, dropping conflicting tables...');
      await resetConflictingTables(rawDB);
      // Retry creating tables
      await createInitialTables(rawDB);
    } else {
      throw error;
    }
  }
}

// Reset conflicting tables
async function resetConflictingTables(rawDB: D1Database) {
  const conflictingTables = ['users', 'user_profiles', 'site_settings'];
  
  for (const table of conflictingTables) {
    try {
      await rawDB.prepare(`DROP TABLE IF EXISTS ${table}`).run();
      console.log(`Dropped table: ${table}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log(`Failed to drop table ${table}:`, errorMessage);
    }
  }
}

async function createInitialTables(rawDB: D1Database) {
  // Create all tables using the schema
  const createTablesSQL = `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'student',
      first_name TEXT,
      last_name TEXT,
      avatar TEXT,
      is_active BOOLEAN DEFAULT 1,
      is_email_verified BOOLEAN DEFAULT 0,
      credits INTEGER DEFAULT 0,
      total_study_time INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      last_login_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS user_profiles (
      user_id TEXT PRIMARY KEY,
      bio TEXT,
      date_of_birth TEXT,
      phone TEXT,
      address TEXT,
      city TEXT,
      country TEXT,
      education_level TEXT,
      institution TEXT,
      interests TEXT,
      social_links TEXT,
      preferences TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS subjects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      class_level TEXT NOT NULL,
      category TEXT,
      icon TEXT,
      is_active BOOLEAN DEFAULT 1,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS chapters (
      id TEXT PRIMARY KEY,
      subject_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      order_index INTEGER NOT NULL,
      is_active BOOLEAN DEFAULT 1,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS lessons (
      id TEXT PRIMARY KEY,
      chapter_id TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT,
      type TEXT NOT NULL DEFAULT 'text',
      media_url TEXT,
      duration INTEGER,
      order_index INTEGER NOT NULL,
      is_active BOOLEAN DEFAULT 1,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS assessments (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      type TEXT NOT NULL,
      subject_id TEXT,
      chapter_id TEXT,
      time_limit INTEGER,
      total_marks INTEGER NOT NULL,
      passing_marks INTEGER,
      is_active BOOLEAN DEFAULT 1,
      created_by TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (subject_id) REFERENCES subjects(id),
      FOREIGN KEY (chapter_id) REFERENCES chapters(id),
      FOREIGN KEY (created_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      assessment_id TEXT NOT NULL,
      question TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'mcq',
      options TEXT,
      correct_answer TEXT NOT NULL,
      explanation TEXT,
      marks INTEGER DEFAULT 1,
      order_index INTEGER NOT NULL,
      is_active BOOLEAN DEFAULT 1,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_assessments (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      assessment_id TEXT NOT NULL,
      started_at INTEGER NOT NULL,
      completed_at INTEGER,
      score INTEGER,
      total_marks INTEGER,
      percentage REAL,
      passed BOOLEAN,
      attempts INTEGER DEFAULT 1,
      time_spent INTEGER,
      status TEXT NOT NULL DEFAULT 'in_progress',
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_answers (
      id TEXT PRIMARY KEY,
      user_assessment_id TEXT NOT NULL,
      question_id TEXT NOT NULL,
      answer TEXT NOT NULL,
      is_correct BOOLEAN,
      time_spent INTEGER,
      answered_at INTEGER NOT NULL,
      FOREIGN KEY (user_assessment_id) REFERENCES user_assessments(id) ON DELETE CASCADE,
      FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS credit_transactions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL,
      amount INTEGER NOT NULL,
      reason TEXT NOT NULL,
      reference_id TEXT,
      reference_type TEXT,
      balance INTEGER NOT NULL,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS study_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      lesson_id TEXT NOT NULL,
      started_at INTEGER NOT NULL,
      ended_at INTEGER,
      duration INTEGER,
      credits_earned INTEGER DEFAULT 0,
      completed BOOLEAN DEFAULT 0,
      progress INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS social_posts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      content TEXT NOT NULL,
      media_urls TEXT,
      type TEXT NOT NULL DEFAULT 'text',
      tags TEXT,
      likes_count INTEGER DEFAULT 0,
      comments_count INTEGER DEFAULT 0,
      shares_count INTEGER DEFAULT 0,
      is_public BOOLEAN DEFAULT 1,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS social_likes (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      post_id TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (post_id) REFERENCES social_posts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS social_comments (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      post_id TEXT NOT NULL,
      parent_id TEXT,
      content TEXT NOT NULL,
      likes_count INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (post_id) REFERENCES social_posts(id) ON DELETE CASCADE,
      FOREIGN KEY (parent_id) REFERENCES social_comments(id)
    );

    CREATE TABLE IF NOT EXISTS system_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'string',
      description TEXT,
      category TEXT NOT NULL DEFAULT 'general',
      is_public BOOLEAN DEFAULT 0,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      action TEXT NOT NULL,
      resource TEXT NOT NULL,
      resource_id TEXT,
      old_values TEXT,
      new_values TEXT,
      ip_address TEXT,
      user_agent TEXT,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    -- Create indexes for performance
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
    CREATE INDEX IF NOT EXISTS idx_subjects_class_level ON subjects(class_level);
    CREATE INDEX IF NOT EXISTS idx_chapters_subject_id ON chapters(subject_id);
    CREATE INDEX IF NOT EXISTS idx_lessons_chapter_id ON lessons(chapter_id);
    CREATE INDEX IF NOT EXISTS idx_assessments_subject_id ON assessments(subject_id);
    CREATE INDEX IF NOT EXISTS idx_questions_assessment_id ON questions(assessment_id);
    CREATE INDEX IF NOT EXISTS idx_user_assessments_user_id ON user_assessments(user_id);
    CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
    CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON study_sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_social_posts_user_id ON social_posts(user_id);
    CREATE INDEX IF NOT EXISTS idx_social_likes_post_id ON social_likes(post_id);
    CREATE INDEX IF NOT EXISTS idx_social_comments_post_id ON social_comments(post_id);
  `;

  await rawDB.batch(createTablesSQL.split(';').filter(sql => sql.trim()).map(sql => rawDB.prepare(sql.trim())));
}

async function updateSchema(rawDB: D1Database) {
  // Future schema updates will go here
  // This function will handle adding new columns, tables, or modifying existing ones
  console.log('Schema update check completed');
}
