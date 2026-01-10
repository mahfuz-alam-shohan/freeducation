import { scienceState } from './state';
import { scienceTypes } from './types';
import { scienceSscViews as scienceSscAdminViews } from './views/admin/ssc';
import { scienceHscViews } from './views/admin/hsc';
import { scienceSscViews as scienceSscPublicViews } from './views/public/ssc';
import { scienceHscPhysicsViews } from './views/public/hsc-physics';
import { scienceHscChemistryViews } from './views/public/hsc-chemistry';
import { scienceHscBiologyViews } from './views/public/hsc-biology';

const sciencePublicViews =
  scienceSscPublicViews + scienceHscPhysicsViews + scienceHscChemistryViews + scienceHscBiologyViews;
const scienceAdminViews = scienceSscAdminViews + scienceHscViews;

export const subjectModule = {
  id: 'science',
  state: scienceState,
  types: scienceTypes,
  views: {
    public: sciencePublicViews,
    admin: scienceAdminViews,
  },
};

export {
  scienceState,
  scienceTypes,
  sciencePublicViews,
  scienceAdminViews,
  scienceSscPublicViews,
  scienceHscPhysicsViews,
  scienceHscChemistryViews,
  scienceHscBiologyViews,
  scienceSscAdminViews,
  scienceHscViews,
};
