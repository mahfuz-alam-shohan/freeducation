import { subjectId, contentKeys } from './data';
import { pickContentSlice, applyContentSlice } from './controller';
import './schema';

export const subjectModule = {
  id: subjectId,
  contentKeys,
  pickContentSlice,
  applyContentSlice,
};
