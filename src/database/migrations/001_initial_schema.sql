-- Initial Database Schema for Free Education Platform
-- Migration: 001_initial_schema
-- Created: 2026-01-19
-- Description: Creates all initial tables for the education platform

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    user_type TEXT NOT NULL DEFAULT 'student',
    is_active INTEGER NOT NULL DEFAULT 1,
    email_verified INTEGER NOT NULL DEFAULT 0,
    avatar_url TEXT,
    phone TEXT,
    date_of_birth TEXT,
    address TEXT,
    bio TEXT,
    created_at TEXT NOT NULL DEFAULT datetime('now'),
    updated_at TEXT NOT NULL DEFAULT datetime('now'),
    last_login TEXT
);

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    institution TEXT,
    class_grade TEXT,
    section TEXT,
    roll_number TEXT,
    parent_name TEXT,
    parent_phone TEXT,
    emergency_contact TEXT,
    preferences TEXT,
    created_at TEXT NOT NULL DEFAULT datetime('now'),
    updated_at TEXT NOT NULL DEFAULT datetime('now'),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Subjects table
CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    class_level TEXT NOT NULL,
    group TEXT,
    icon TEXT,
    color TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT datetime('now'),
    updated_at TEXT NOT NULL DEFAULT datetime('now')
);

-- Chapters table
CREATE TABLE IF NOT EXISTS chapters (
    id INTEGER PRIMARY KEY,
    subject_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    chapter_number INTEGER NOT NULL,
    estimated_hours REAL,
    is_active INTEGER NOT NULL DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT datetime('now'),
    updated_at TEXT NOT NULL DEFAULT datetime('now'),
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
    id INTEGER PRIMARY KEY,
    chapter_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    lesson_type TEXT NOT NULL DEFAULT 'text',
    video_url TEXT,
    audio_url TEXT,
    duration_minutes INTEGER,
    lesson_number INTEGER NOT NULL,
    difficulty_level TEXT DEFAULT 'beginner',
    is_active INTEGER NOT NULL DEFAULT 1,
    is_free INTEGER NOT NULL DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT datetime('now'),
    updated_at TEXT NOT NULL DEFAULT datetime('now'),
    FOREIGN KEY (chapter_id) REFERENCES chapters(id)
);

-- Assignments table
CREATE TABLE IF NOT EXISTS assignments (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL DEFAULT 'homework',
    subject_id INTEGER NOT NULL,
    chapter_id INTEGER,
    teacher_id INTEGER NOT NULL,
    max_points INTEGER DEFAULT 100,
    due_date TEXT,
    allow_late_submission INTEGER DEFAULT 0,
    instructions TEXT,
    attachment_urls TEXT,
    is_published INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT datetime('now'),
    updated_at TEXT NOT NULL DEFAULT datetime('now'),
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (chapter_id) REFERENCES chapters(id),
    FOREIGN KEY (teacher_id) REFERENCES users(id)
);

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY,
    assignment_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    content TEXT,
    attachment_urls TEXT,
    status TEXT NOT NULL DEFAULT 'submitted',
    points_earned INTEGER,
    feedback TEXT,
    graded_by INTEGER,
    graded_at TEXT,
    submitted_at TEXT NOT NULL DEFAULT datetime('now'),
    updated_at TEXT NOT NULL DEFAULT datetime('now'),
    FOREIGN KEY (assignment_id) REFERENCES assignments(id),
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (graded_by) REFERENCES users(id)
);

-- Study sessions table
CREATE TABLE IF NOT EXISTS study_sessions (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    subject_id INTEGER,
    lesson_id INTEGER,
    duration_minutes INTEGER NOT NULL,
    progress_percentage REAL DEFAULT 0,
    completed INTEGER NOT NULL DEFAULT 0,
    started_at TEXT NOT NULL DEFAULT datetime('now'),
    ended_at TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);

-- Credit transactions table
CREATE TABLE IF NOT EXISTS credit_transactions (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    reference_id INTEGER,
    reference_type TEXT,
    created_at TEXT NOT NULL DEFAULT datetime('now'),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Social posts table
CREATE TABLE IF NOT EXISTS social_posts (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'text',
    attachment_urls TEXT,
    hashtags TEXT,
    mentions TEXT,
    visibility TEXT NOT NULL DEFAULT 'public',
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    is_pinned INTEGER DEFAULT 0,
    is_edited INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT datetime('now'),
    updated_at TEXT NOT NULL DEFAULT datetime('now'),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    parent_id INTEGER,
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    is_edited INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT datetime('now'),
    updated_at TEXT NOT NULL DEFAULT datetime('now'),
    FOREIGN KEY (post_id) REFERENCES social_posts(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (parent_id) REFERENCES comments(id)
);

-- Likes table
CREATE TABLE IF NOT EXISTS likes (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    target_type TEXT NOT NULL,
    target_id INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT datetime('now'),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT,
    data TEXT,
    is_read INTEGER NOT NULL DEFAULT 0,
    action_url TEXT,
    created_at TEXT NOT NULL DEFAULT datetime('now'),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
