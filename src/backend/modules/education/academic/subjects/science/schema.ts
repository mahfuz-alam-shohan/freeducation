import { registerTableSchema } from '../../../../../../shared/db/schema';

registerTableSchema({
  name: 'science_labs',
  createSql: `CREATE TABLE IF NOT EXISTS science_labs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  columns: [
    { name: 'title', sql: 'TEXT NOT NULL' },
    { name: 'content', sql: 'TEXT NOT NULL' },
    { name: 'created_at', sql: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
  ],
});
