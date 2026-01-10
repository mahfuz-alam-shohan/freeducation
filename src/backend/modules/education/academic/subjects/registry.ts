import { subjectModule as banglaModule } from './bangla';
import { subjectModule as englishModule } from './english';
import { subjectModule as humanitiesModule } from './humanities';
import { subjectModule as ictModule } from './ict';
import { subjectModule as religionModule } from './religion';
import { subjectModule as scienceModule } from './science';
import { subjectModule as sharedModule } from './shared';

export type SubjectModule = {
  id: string;
  contentKeys: string[];
  pickContentSlice: (content: Record<string, unknown>) => Record<string, unknown>;
  applyContentSlice: (content: Record<string, unknown>, update: Record<string, unknown>) => Record<string, unknown>;
};

const subjectModules = [
  banglaModule,
  englishModule,
  humanitiesModule,
  ictModule,
  religionModule,
  scienceModule,
  sharedModule,
].sort((a, b) => a.id.localeCompare(b.id));

export { subjectModules };
