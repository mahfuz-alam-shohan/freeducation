import * as auth from './auth.js';
import * as users from './users.js';
import * as database from './database.js';
import * as modules from './modules.js';
import * as subjects from './subjects.js';
import * as media from './media.js';
import * as apiManagement from './api-management.js';

export const api = {
  ...auth,
  ...users,
  ...database,
  ...modules,
  ...subjects,
  ...media,
  ...apiManagement
};
