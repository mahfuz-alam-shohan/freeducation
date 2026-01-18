import { sqliteTable, text, integer, real, blob } from 'drizzle-orm/sqlite-core';

// Users table with role-based permissions
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  username: text('username').unique().notNull(),
  password: text('password').notNull(),
  role: text('role').notNull().default('student'), // student, teacher, writer, publisher, admin
  firstName: text('first_name'),
  lastName: text('last_name'),
  avatar: text('avatar'), // R2 URL
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  isEmailVerified: integer('is_email_verified', { mode: 'boolean' }).default(false),
  credits: integer('credits').default(0),
  totalStudyTime: integer('total_study_time').default(0), // minutes
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
  lastLoginAt: integer('last_login_at'),
});

// User profiles for extended information
export const userProfiles = sqliteTable('user_profiles', {
  userId: text('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  bio: text('bio'),
  dateOfBirth: text('date_of_birth'), // ISO string
  phone: text('phone'),
  address: text('address'),
  city: text('city'),
  country: text('country'),
  educationLevel: text('education_level'), // primary, secondary, higher, etc.
  institution: text('institution'),
  interests: text('interests'), // JSON array
  socialLinks: text('social_links'), // JSON object
  preferences: text('preferences'), // JSON object for UI preferences
});

// Educational content organization
export const subjects = sqliteTable('subjects', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  classLevel: text('class_level').notNull(), // grade1, grade2, ..., grade12, university
  category: text('category'), // science, arts, commerce, etc.
  icon: text('icon'), // R2 URL
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export const chapters = sqliteTable('chapters', {
  id: text('id').primaryKey(),
  subjectId: text('subject_id').references(() => subjects.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  orderIndex: integer('order_index').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export const lessons = sqliteTable('lessons', {
  id: text('id').primaryKey(),
  chapterId: text('chapter_id').references(() => chapters.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  content: text('content'), // HTML/Markdown content
  type: text('type').notNull().default('text'), // text, video, audio, interactive
  mediaUrl: text('media_url'), // R2 URL for video/audio
  duration: integer('duration'), // minutes
  orderIndex: integer('order_index').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

// Assessment system
export const assessments = sqliteTable('assessments', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  type: text('type').notNull(), // quiz, test, exam, practice
  subjectId: text('subject_id').references(() => subjects.id),
  chapterId: text('chapter_id').references(() => chapters.id),
  timeLimit: integer('time_limit'), // minutes
  totalMarks: integer('total_marks').notNull(),
  passingMarks: integer('passing_marks'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdBy: text('created_by').references(() => users.id),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export const questions = sqliteTable('questions', {
  id: text('id').primaryKey(),
  assessmentId: text('assessment_id').references(() => assessments.id, { onDelete: 'cascade' }),
  question: text('question').notNull(),
  type: text('type').notNull().default('mcq'), // mcq, true_false, short_answer, essay
  options: text('options'), // JSON array for MCQ options
  correctAnswer: text('correct_answer').notNull(),
  explanation: text('explanation'),
  marks: integer('marks').default(1),
  orderIndex: integer('order_index').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export const userAssessments = sqliteTable('user_assessments', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  assessmentId: text('assessment_id').references(() => assessments.id, { onDelete: 'cascade' }),
  startedAt: integer('started_at').notNull(),
  completedAt: integer('completed_at'),
  score: integer('score'),
  totalMarks: integer('total_marks'),
  percentage: real('percentage'),
  passed: integer('passed', { mode: 'boolean' }),
  attempts: integer('attempts').default(1),
  timeSpent: integer('time_spent'), // minutes
  status: text('status').notNull().default('in_progress'), // in_progress, completed, abandoned
});

export const userAnswers = sqliteTable('user_answers', {
  id: text('id').primaryKey(),
  userAssessmentId: text('user_assessment_id').references(() => userAssessments.id, { onDelete: 'cascade' }),
  questionId: text('question_id').references(() => questions.id, { onDelete: 'cascade' }),
  answer: text('answer').notNull(),
  isCorrect: integer('is_correct', { mode: 'boolean' }),
  timeSpent: integer('time_spent'), // seconds
  answeredAt: integer('answered_at').notNull(),
});

// Credit and gamification system
export const creditTransactions = sqliteTable('credit_transactions', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // earned, spent, bonus, penalty
  amount: integer('amount').notNull(),
  reason: text('reason').notNull(),
  referenceId: text('reference_id'), // Related entity ID
  referenceType: text('reference_type'), // assessment, lesson, social_post, etc.
  balance: integer('balance').notNull(), // Balance after transaction
  createdAt: integer('created_at').notNull(),
});

export const studySessions = sqliteTable('study_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  lessonId: text('lesson_id').references(() => lessons.id, { onDelete: 'cascade' }),
  startedAt: integer('started_at').notNull(),
  endedAt: integer('ended_at'),
  duration: integer('duration'), // minutes
  creditsEarned: integer('credits_earned').default(0),
  completed: integer('completed', { mode: 'boolean' }).default(false),
  progress: integer('progress').default(0), // percentage
});

// Social media features
export const socialPosts = sqliteTable('social_posts', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  mediaUrls: text('media_urls'), // JSON array of R2 URLs
  type: text('type').notNull().default('text'), // text, image, video, mixed
  tags: text('tags'), // JSON array
  likesCount: integer('likes_count').default(0),
  commentsCount: integer('comments_count').default(0),
  sharesCount: integer('shares_count').default(0),
  isPublic: integer('is_public', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export const socialLikes = sqliteTable('social_likes', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  postId: text('post_id').references(() => socialPosts.id, { onDelete: 'cascade' }),
  createdAt: integer('created_at').notNull(),
});

export const socialComments = sqliteTable('social_comments', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  postId: text('post_id').references(() => socialPosts.id, { onDelete: 'cascade' }),
  parentId: text('parent_id').references(() => socialComments.id), // For replies
  content: text('content').notNull(),
  likesCount: integer('likes_count').default(0),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

// System configuration and settings
export const systemSettings = sqliteTable('system_settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  type: text('type').notNull().default('string'), // string, number, boolean, json
  description: text('description'),
  category: text('category').notNull().default('general'),
  isPublic: integer('is_public', { mode: 'boolean' }).default(false),
  updatedAt: integer('updated_at').notNull(),
});

// Audit log for security and tracking
export const auditLogs = sqliteTable('audit_logs', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  action: text('action').notNull(),
  resource: text('resource').notNull(),
  resourceId: text('resource_id'),
  oldValues: text('old_values'), // JSON object
  newValues: text('new_values'), // JSON object
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: integer('created_at').notNull(),
});

// Type exports for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;
export type Subject = typeof subjects.$inferSelect;
export type NewSubject = typeof subjects.$inferInsert;
export type Chapter = typeof chapters.$inferSelect;
export type NewChapter = typeof chapters.$inferInsert;
export type Lesson = typeof lessons.$inferSelect;
export type NewLesson = typeof lessons.$inferInsert;
export type Assessment = typeof assessments.$inferSelect;
export type NewAssessment = typeof assessments.$inferInsert;
export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;
export type UserAssessment = typeof userAssessments.$inferSelect;
export type NewUserAssessment = typeof userAssessments.$inferInsert;
export type UserAnswer = typeof userAnswers.$inferSelect;
export type NewUserAnswer = typeof userAnswers.$inferInsert;
export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type NewCreditTransaction = typeof creditTransactions.$inferInsert;
export type StudySession = typeof studySessions.$inferSelect;
export type NewStudySession = typeof studySessions.$inferInsert;
export type SocialPost = typeof socialPosts.$inferSelect;
export type NewSocialPost = typeof socialPosts.$inferInsert;
export type SocialLike = typeof socialLikes.$inferSelect;
export type NewSocialLike = typeof socialLikes.$inferInsert;
export type SocialComment = typeof socialComments.$inferSelect;
export type NewSocialComment = typeof socialComments.$inferInsert;
export type SystemSetting = typeof systemSettings.$inferSelect;
export type NewSystemSetting = typeof systemSettings.$inferInsert;
export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
