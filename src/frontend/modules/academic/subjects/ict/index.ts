import { ictState } from './state';
import { ictTypes } from './types';
import { ictViews as ictPublicViews } from './views/public';
import { ictViews as ictAdminViews } from './views/admin';

export const subjectModule = {
  id: 'ict',
  state: ictState,
  types: ictTypes,
  views: {
    public: ictPublicViews,
    admin: ictAdminViews,
  },
};

export { ictState, ictTypes, ictPublicViews, ictAdminViews };
