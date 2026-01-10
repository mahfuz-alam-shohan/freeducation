import { registerTableSchema } from '../../../shared/db/schema';

registerTableSchema({
  name: 'social_profiles',
  createSql: `CREATE TABLE IF NOT EXISTS social_profiles (
    user_id INTEGER PRIMARY KEY,
    bio TEXT,
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  columns: [
    { name: 'user_id', sql: 'INTEGER PRIMARY KEY' },
    { name: 'bio', sql: 'TEXT' },
    { name: 'followers_count', sql: 'INTEGER DEFAULT 0' },
    { name: 'following_count', sql: 'INTEGER DEFAULT 0' },
    { name: 'created_at', sql: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    { name: 'updated_at', sql: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
  ],
});
