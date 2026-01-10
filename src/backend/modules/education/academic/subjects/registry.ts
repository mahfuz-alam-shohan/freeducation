export type SubjectModule = {
  id: string;
  contentKeys: string[];
  pickContentSlice: (content: Record<string, unknown>) => Record<string, unknown>;
  applyContentSlice: (content: Record<string, unknown>, update: Record<string, unknown>) => Record<string, unknown>;
};

const subjectEntries = (import.meta as any).glob('./*/index.ts', { eager: true });
const subjectModules = Object.values(subjectEntries)
  .map((entry) => (entry as { subjectModule?: SubjectModule }).subjectModule)
  .filter((module): module is SubjectModule => Boolean(module))
  .sort((a, b) => a.id.localeCompare(b.id));

export { subjectModules };
