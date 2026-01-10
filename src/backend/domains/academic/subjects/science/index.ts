import { subjectId, contentKeys } from './data';
import { pickContentSlice, applyContentSlice } from './controller';

export const subjectModule = {
  id: subjectId,
  contentKeys,
  pickContentSlice,
  applyContentSlice,
};
