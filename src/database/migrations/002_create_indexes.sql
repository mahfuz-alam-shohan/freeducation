-- Create Indexes for Performance Optimization
-- Migration: 002_create_indexes
-- Created: 2026-01-19
-- Description: Creates indexes for better query performance

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- User profiles table indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- Subjects table indexes
CREATE INDEX IF NOT EXISTS idx_subjects_code ON subjects(code);
CREATE INDEX IF NOT EXISTS idx_subjects_class_level ON subjects(class_level);
CREATE INDEX IF NOT EXISTS idx_subjects_group ON subjects(group);
CREATE INDEX IF NOT EXISTS idx_subjects_category ON subjects(category);
CREATE INDEX IF NOT EXISTS idx_subjects_is_active ON subjects(is_active);

-- Chapters table indexes
CREATE INDEX IF NOT EXISTS idx_chapters_subject_id ON chapters(subject_id);
CREATE INDEX IF NOT EXISTS idx_chapters_chapter_number ON chapters(chapter_number);
CREATE INDEX IF NOT EXISTS idx_chapters_is_active ON chapters(is_active);

-- Lessons table indexes
CREATE INDEX IF NOT EXISTS idx_lessons_chapter_id ON lessons(chapter_id);
CREATE INDEX IF NOT EXISTS idx_lessons_lesson_number ON lessons(lesson_number);
CREATE INDEX IF NOT EXISTS idx_lessons_lesson_type ON lessons(lesson_type);
CREATE INDEX IF NOT EXISTS idx_lessons_is_active ON lessons(is_active);
CREATE INDEX IF NOT EXISTS idx_lessons_is_free ON lessons(is_free);

-- Assignments table indexes
CREATE INDEX IF NOT EXISTS idx_assignments_subject_id ON assignments(subject_id);
CREATE INDEX IF NOT EXISTS idx_assignments_teacher_id ON assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_assignments_due_date ON assignments(due_date);
CREATE INDEX IF NOT EXISTS idx_assignments_type ON assignments(type);
CREATE INDEX IF NOT EXISTS idx_assignments_is_published ON assignments(is_published);

-- Submissions table indexes
CREATE INDEX IF NOT EXISTS idx_submissions_assignment_id ON submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student_id ON submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON submissions(submitted_at);

-- Study sessions table indexes
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_subject_id ON study_sessions(subject_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_started_at ON study_sessions(started_at);

-- Credit transactions table indexes
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_type ON credit_transactions(type);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON credit_transactions(created_at);

-- Social posts table indexes
CREATE INDEX IF NOT EXISTS idx_social_posts_user_id ON social_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_created_at ON social_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_social_posts_visibility ON social_posts(visibility);
CREATE INDEX IF NOT EXISTS idx_social_posts_is_pinned ON social_posts(is_pinned);

-- Comments table indexes
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);

-- Likes table indexes
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_target_type ON likes(target_type);
CREATE INDEX IF NOT EXISTS idx_likes_target_id ON likes(target_id);

-- Notifications table indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Create unique indexes for data integrity
CREATE UNIQUE INDEX IF NOT EXISTS uidx_likes_user_target ON likes(user_id, target_type, target_id);
