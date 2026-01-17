import { sqliteTable, text, integer, boolean } from 'drizzle-orm/sqlite-core';

// System configuration table
export const system_config = sqliteTable('system_config', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  created_at: text('created_at').default('CURRENT_TIMESTAMP'),
  updated_at: text('updated_at').default('CURRENT_TIMESTAMP')
});

// Admins table
export const admins = sqliteTable('admins', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  date_of_birth: text('date_of_birth').notNull(),
  is_active: boolean('is_active').default(true),
  created_at: text('created_at').default('CURRENT_TIMESTAMP'),
  updated_at: text('updated_at').default('CURRENT_TIMESTAMP')
});

// Users table (for future use)
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  user_type: text('user_type').default('student'),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  date_of_birth: text('date_of_birth').notNull(),
  is_active: boolean('is_active').default(true),
  created_by_admin: integer('created_by_admin'),
  created_at: text('created_at').default('CURRENT_TIMESTAMP'),
  updated_at: text('updated_at').default('CURRENT_TIMESTAMP')
});

// Sessions table for authentication
export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  user_id: integer('user_id').notNull(),
  user_type: text('user_type').notNull(),
  expires_at: text('expires_at').notNull(),
  created_at: text('created_at').default('CURRENT_TIMESTAMP')
});
