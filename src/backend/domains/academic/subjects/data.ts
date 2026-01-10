import type { Env } from '../../../../../shared/types';
import { safeParseContent } from '../../../core/users/shared/utils';

const CONTENT_KEY = 'app-content';

export const readContent = async (env: Env) => {
  const row = await env.DB.prepare('SELECT data FROM content_store WHERE key = ?').bind(CONTENT_KEY).first();
  if (!row?.data) return {};
  return safeParseContent(row.data);
};

export const writeContent = async (env: Env, content: Record<string, unknown>) => {
  await env.DB.prepare(
    'INSERT INTO content_store (key, data, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ' +
      'ON CONFLICT(key) DO UPDATE SET data = excluded.data, updated_at = CURRENT_TIMESTAMP'
  )
    .bind(CONTENT_KEY, JSON.stringify(content))
    .run();
};
