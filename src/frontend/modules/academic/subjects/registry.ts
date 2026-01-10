import { subjectModule as banglaModule } from './bangla';
import { subjectModule as englishModule } from './english';
import { subjectModule as humanitiesModule } from './humanities';
import { subjectModule as ictModule } from './ict';
import { subjectModule as religionModule } from './religion';
import { subjectModule as scienceModule } from './science';

export type SubjectModule = {
  id: string;
  state?: string;
  types?: string;
  views?: {
    public?: string;
    admin?: string;
  };
};

const subjectModules = [
  banglaModule,
  englishModule,
  humanitiesModule,
  ictModule,
  religionModule,
  scienceModule,
].sort((a, b) => a.id.localeCompare(b.id));

const subjectStates = subjectModules
  .map((module) => module.state)
  .filter((module): module is string => Boolean(module));
const subjectTypes = subjectModules
  .map((module) => module.types)
  .filter((module): module is string => Boolean(module));
const subjectPublicViews = subjectModules
  .map((module) => module.views?.public)
  .filter((module): module is string => Boolean(module))
  .join('');
const subjectAdminViews = subjectModules
  .map((module) => module.views?.admin)
  .filter((module): module is string => Boolean(module))
  .join('');

export { subjectModules, subjectStates, subjectTypes, subjectPublicViews, subjectAdminViews };
