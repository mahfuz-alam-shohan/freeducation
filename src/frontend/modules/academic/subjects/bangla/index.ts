import { banglaState } from './state';
import { banglaTopics } from './types';
import { banglaViews as banglaPublicViews } from './views/public';
import { banglaViews as banglaAdminViews } from './views/admin';

export const subjectModule = {
  id: 'bangla',
  state: banglaState,
  types: banglaTopics,
  views: {
    public: banglaPublicViews,
    admin: banglaAdminViews,
  },
};

export { banglaState, banglaTopics, banglaPublicViews, banglaAdminViews };
