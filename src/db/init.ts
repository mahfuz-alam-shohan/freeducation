import { DatabaseManager } from './database.js';

export async function initDatabase(db: D1Database): Promise<void> {
  const dbManager = new DatabaseManager(db);
  
  try {
    // Check if tables exist
    const tablesResult = await dbManager.query(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `);
    
    const existingTables = tablesResult.results?.map((row: any) => row.name) || [];
    
    // If no tables exist, create the complete schema
    if (existingTables.length === 0) {
      await createCompleteSchema(dbManager);
      console.log('Database schema created successfully');
    } else {
      // Handle schema migrations if needed
      await handleMigrations(dbManager, existingTables);
      console.log('Database migrations completed');
    }
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

async function createCompleteSchema(dbManager: DatabaseManager): Promise<void> {
  const schemaSQL = `
    -- Users table (core authentication and user management)
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      full_name VARCHAR(255) NOT NULL,
      user_type VARCHAR(20) NOT NULL DEFAULT 'student',
      is_active BOOLEAN DEFAULT 1,
      email_verified BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    );

    -- User profiles table (extended user information)
    CREATE TABLE user_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      phone VARCHAR(20),
      date_of_birth DATE,
      gender VARCHAR(10),
      address TEXT,
      city VARCHAR(100),
      country VARCHAR(100) DEFAULT 'Bangladesh',
      education_level VARCHAR(50),
      institution_name VARCHAR(255),
      bio TEXT,
      profile_image_url VARCHAR(500),
      preferences TEXT, -- JSON string for user preferences
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Subjects table (academic subjects)
    CREATE TABLE subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(255) NOT NULL,
      code VARCHAR(20) UNIQUE NOT NULL,
      description TEXT,
      class_level INTEGER NOT NULL, -- 6-12 for NCTB
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Chapters table (subject chapters)
    CREATE TABLE chapters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_id INTEGER NOT NULL,
      title VARCHAR(255) NOT NULL,
      chapter_number INTEGER NOT NULL,
      description TEXT,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
    );

    -- Lessons table (chapter lessons)
    CREATE TABLE lessons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chapter_id INTEGER NOT NULL,
      title VARCHAR(255) NOT NULL,
      content TEXT,
      lesson_type VARCHAR(20) DEFAULT 'text', -- text, video, audio, interactive
      video_url VARCHAR(500),
      audio_url VARCHAR(500),
      duration_minutes INTEGER,
      order_index INTEGER NOT NULL,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
    );

    -- Assessments table (tests and quizzes)
    CREATE TABLE assessments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      subject_id INTEGER,
      chapter_id INTEGER,
      assessment_type VARCHAR(20) DEFAULT 'quiz', -- quiz, test, exam, assignment
      total_marks INTEGER DEFAULT 100,
      duration_minutes INTEGER,
      passing_marks INTEGER,
      is_active BOOLEAN DEFAULT 1,
      created_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL,
      FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE SET NULL,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
    );

    -- Questions table (assessment questions)
    CREATE TABLE questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      assessment_id INTEGER NOT NULL,
      question_text TEXT NOT NULL,
      question_type VARCHAR(20) DEFAULT 'multiple_choice', -- multiple_choice, true_false, short_answer, essay
      options TEXT, -- JSON string for multiple choice options
      correct_answer TEXT NOT NULL,
      explanation TEXT,
      marks INTEGER DEFAULT 1,
      order_index INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
    );

    -- User assessments table (user test attempts)
    CREATE TABLE user_assessments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      assessment_id INTEGER NOT NULL,
      started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,
      total_marks INTEGER,
      obtained_marks INTEGER,
      percentage DECIMAL(5,2),
      status VARCHAR(20) DEFAULT 'in_progress', -- in_progress, completed, abandoned
      answers TEXT, -- JSON string for user answers
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
    );

    -- Credit transactions table (gamification and rewards)
    CREATE TABLE credit_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      transaction_type VARCHAR(20) NOT NULL, -- earned, spent, bonus, penalty
      amount INTEGER NOT NULL,
      description VARCHAR(255),
      reference_type VARCHAR(50), -- study_session, assessment, contribution, etc.
      reference_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Study sessions table (track user learning time)
    CREATE TABLE study_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      subject_id INTEGER,
      chapter_id INTEGER,
      lesson_id INTEGER,
      started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      ended_at DATETIME,
      duration_minutes INTEGER,
      credits_earned INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL,
      FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE SET NULL,
      FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE SET NULL
    );

    -- Social posts table (community features)
    CREATE TABLE social_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      post_type VARCHAR(20) DEFAULT 'text', -- text, image, video, link
      media_url VARCHAR(500),
      likes_count INTEGER DEFAULT 0,
      comments_count INTEGER DEFAULT 0,
      shares_count INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Social likes table
    CREATE TABLE social_likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      post_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (post_id) REFERENCES social_posts(id) ON DELETE CASCADE,
      UNIQUE(user_id, post_id)
    );

    -- Social comments table
    CREATE TABLE social_comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      post_id INTEGER NOT NULL,
      parent_comment_id INTEGER, -- for threaded comments
      content TEXT NOT NULL,
      likes_count INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (post_id) REFERENCES social_posts(id) ON DELETE CASCADE,
      FOREIGN KEY (parent_comment_id) REFERENCES social_comments(id) ON DELETE SET NULL
    );

    -- System settings table (platform configuration)
    CREATE TABLE system_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      setting_key VARCHAR(100) UNIQUE NOT NULL,
      setting_value TEXT,
      setting_type VARCHAR(20) DEFAULT 'string', -- string, number, boolean, json
      description TEXT,
      is_public BOOLEAN DEFAULT 0, -- whether setting is accessible via public API
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Audit logs table (track all important actions)
    CREATE TABLE audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      action VARCHAR(100) NOT NULL,
      resource_type VARCHAR(50),
      resource_id INTEGER,
      old_values TEXT, -- JSON string
      new_values TEXT, -- JSON string
      ip_address VARCHAR(45),
      user_agent TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    -- Create indexes for better performance
    CREATE INDEX idx_users_email ON users(email);
    CREATE INDEX idx_users_username ON users(username);
    CREATE INDEX idx_users_type ON users(user_type);
    CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
    CREATE INDEX idx_subjects_class_level ON subjects(class_level);
    CREATE INDEX idx_chapters_subject_id ON chapters(subject_id);
    CREATE INDEX idx_lessons_chapter_id ON lessons(chapter_id);
    CREATE INDEX idx_assessments_subject_id ON assessments(subject_id);
    CREATE INDEX idx_questions_assessment_id ON questions(assessment_id);
    CREATE INDEX idx_user_assessments_user_id ON user_assessments(user_id);
    CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);
    CREATE INDEX idx_study_sessions_user_id ON study_sessions(user_id);
    CREATE INDEX idx_social_posts_user_id ON social_posts(user_id);
    CREATE INDEX idx_social_likes_user_post ON social_likes(user_id, post_id);
    CREATE INDEX idx_social_comments_post_id ON social_comments(post_id);
    CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
    CREATE INDEX idx_audit_logs_action ON audit_logs(action);
  `;

  await dbManager.run(schemaSQL);
  
  // Insert default system settings
  await insertDefaultSettings(dbManager);
}

async function insertDefaultSettings(dbManager: DatabaseManager): Promise<void> {
  const defaultSettings = [
    ['platform_name', 'Free Education', 'string', 'Platform name'],
    ['platform_version', '1.0.0', 'string', 'Current platform version'],
    ['registration_enabled', 'true', 'boolean', 'Allow new user registrations'],
    ['email_verification_required', 'false', 'boolean', 'Require email verification for new users'],
    ['default_credits_per_study_minute', '1', 'number', 'Credits earned per minute of study'],
    ['max_daily_study_credits', '100', 'number', 'Maximum credits that can be earned per day'],
    ['social_post_min_credits', '5', 'number', 'Minimum credits required to post on social feed'],
    ['assessment_passing_percentage', '60', 'number', 'Default passing percentage for assessments'],
    ['platform_maintenance_mode', 'false', 'boolean', 'Enable maintenance mode'],
    ['admin_setup_completed', 'false', 'boolean', 'Whether initial admin setup is completed']
  ];

  for (const [key, value, type, description] of defaultSettings) {
    await dbManager.run(
      `INSERT INTO system_settings (setting_key, setting_value, setting_type, description) VALUES (?, ?, ?, ?)`,
      [key, value, type, description]
    );
  }
}

async function handleMigrations(dbManager: DatabaseManager, existingTables: string[]): Promise<void> {
  // For now, just ensure admin_setup_completed setting exists
  try {
    await dbManager.run(`
      INSERT OR IGNORE INTO system_settings (setting_key, setting_value, setting_type, description) 
      VALUES ('admin_setup_completed', 'false', 'boolean', 'Whether initial admin setup is completed')
    `);
  } catch (error) {
    // System settings table might not exist, create it
    await dbManager.run(`
      CREATE TABLE IF NOT EXISTS system_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        setting_key VARCHAR(100) UNIQUE NOT NULL,
        setting_value TEXT,
        setting_type VARCHAR(20) DEFAULT 'string',
        description TEXT,
        is_public BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await insertDefaultSettings(dbManager);
  }
}

export async function checkAdminSetup(db: D1Database): Promise<boolean> {
  const dbManager = new DatabaseManager(db);
  
  try {
    const result = await dbManager.query(`
      SELECT setting_value FROM system_settings 
      WHERE setting_key = 'admin_setup_completed'
    `);
    
    return result.results?.[0]?.setting_value === 'true';
  } catch (error) {
    // If table doesn't exist, setup is not complete
    return false;
  }
}

export async function markAdminSetupCompleted(db: D1Database): Promise<void> {
  const dbManager = new DatabaseManager(db);
  
  await dbManager.run(`
    UPDATE system_settings 
    SET setting_value = 'true', updated_at = CURRENT_TIMESTAMP 
    WHERE setting_key = 'admin_setup_completed'
  `);
}
