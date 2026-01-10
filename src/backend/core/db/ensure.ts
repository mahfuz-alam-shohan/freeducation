import type { Env } from '../../../shared/types';
import { syncDatabaseSchema } from './migrator';

let readyPromise: Promise<void> | null = null;

export const ensureDatabaseReady = async (env: Env) => {
  if (!readyPromise) {
    readyPromise = syncDatabaseSchema(env).then(() => undefined);
  }
  await readyPromise;
};
