import { englishState } from './state';
import { englishTypes } from './types';
import { englishViews as englishPublicViews } from './views/public';
import { englishViews as englishAdminViews } from './views/admin';

export const subjectModule = {
  id: 'english',
  state: englishState,
  types: englishTypes,
  views: {
    public: englishPublicViews,
    admin: englishAdminViews,
  },
};

export { englishState, englishTypes, englishPublicViews, englishAdminViews };
