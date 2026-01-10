import { religionState } from './state';
import { religionTypes } from './types';
import { religionViews as religionPublicViews } from './views/public';
import { religionViews as religionAdminViews } from './views/admin';

export const subjectModule = {
  id: 'religion',
  state: religionState,
  types: religionTypes,
  views: {
    public: religionPublicViews,
    admin: religionAdminViews,
  },
};

export { religionState, religionTypes, religionPublicViews, religionAdminViews };
