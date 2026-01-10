export type SubjectModule = {
  id: string;
  state?: string;
  types?: string;
  views?: {
    public?: string;
    admin?: string;
  };
};

const subjectEntries = (import.meta as any).glob('./*/index.ts', { eager: true });
const subjectModules = Object.values(subjectEntries)
  .map((entry) => (entry as { subjectModule?: SubjectModule }).subjectModule)
  .filter((module): module is SubjectModule => Boolean(module))
  .sort((a, b) => a.id.localeCompare(b.id));

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
