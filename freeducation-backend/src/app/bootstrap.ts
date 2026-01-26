import type { Env } from '../shared/types/env';
import { runMigrations } from '../migrations/registry';
import { createServer } from './server';
import { logger } from '../shared/utils/logger';
import { seedApiRegistry } from '../modules/admin/application/api.seed';

export async function bootstrap(env: Env) {
  logger.info('Bootstrap starting');
  await runMigrations(env.DB);
  logger.info('Migrations completed');
  await seedApiRegistry(env.DB);
  logger.info('API registry seeded');
  return createServer(env);
}
