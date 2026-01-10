import { humanitiesState } from './state';
import { humanitiesTypes } from './types';
import { humanitiesViews as humanitiesPublicViews } from './views/public';
import { humanitiesAdminViews } from './views/admin';

export const subjectModule = {
  id: 'humanities',
  state: humanitiesState,
  types: humanitiesTypes,
  views: {
    public: humanitiesPublicViews,
    admin: humanitiesAdminViews,
  },
};

export { humanitiesState, humanitiesTypes, humanitiesPublicViews, humanitiesAdminViews };
