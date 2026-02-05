export const CACHE_TTL = {
  users: 30000,
  apis: 30000,
  moduleCategories: 60000,
  subjectModules: 30000,
  subjectModuleDetail: 20000,
  subjects: 30000,
  subjectDetail: 20000,
  subjectChapters: 20000,
  subjectTopics: 20000,
  chapterDetail: 20000,
  topicDetail: 20000,
  tables: 60000,
  tableData: 20000
};

export const cache = {
  users: { at: 0 },
  apis: { at: 0 },
  moduleCategories: { at: 0 },
  subjectModules: { at: 0 },
  subjectModuleDetail: {},
  subjects: { at: 0 },
  subjectDetail: {},
  subjectChapters: {},
  chapterDetail: {},
  subjectTopics: {},
  topicDetail: {},
  tables: { at: 0 },
  tableData: {}
};

export function isFresh(timestamp, ttl) {
  return Boolean(timestamp) && (Date.now() - timestamp < ttl);
}

export function resetCache() {
  cache.users.at = 0;
  cache.apis.at = 0;
  cache.moduleCategories.at = 0;
  cache.subjectModules.at = 0;
  cache.subjects.at = 0;
  cache.tables.at = 0;
  Object.keys(cache.tableData).forEach((key) => delete cache.tableData[key]);
  Object.keys(cache.subjectModuleDetail).forEach((key) => delete cache.subjectModuleDetail[key]);
  Object.keys(cache.subjectDetail).forEach((key) => delete cache.subjectDetail[key]);
  Object.keys(cache.subjectChapters).forEach((key) => delete cache.subjectChapters[key]);
  Object.keys(cache.chapterDetail).forEach((key) => delete cache.chapterDetail[key]);
  Object.keys(cache.subjectTopics).forEach((key) => delete cache.subjectTopics[key]);
  Object.keys(cache.topicDetail).forEach((key) => delete cache.topicDetail[key]);
}

export function invalidateUsers() {
  cache.users.at = 0;
}

export function invalidateApis() {
  cache.apis.at = 0;
}

export function invalidateModuleCategories() {
  cache.moduleCategories.at = 0;
}

export function invalidateSubjectModules() {
  cache.subjectModules.at = 0;
}

export function invalidateSubjectModuleDetail(id) {
  if (!id) return;
  delete cache.subjectModuleDetail[id];
}

export function invalidateSubjects() {
  cache.subjects.at = 0;
}

export function invalidateSubjectDetail(id) {
  if (!id) return;
  delete cache.subjectDetail[id];
}

export function invalidateSubjectChapters(subjectId, nodeId) {
  if (!subjectId || !nodeId) return;
  delete cache.subjectChapters[`${subjectId}:${nodeId}`];
}

export function invalidateChapterDetail(chapterId) {
  if (!chapterId) return;
  delete cache.chapterDetail[chapterId];
}

export function invalidateSubjectTopics(chapterId) {
  if (!chapterId) return;
  delete cache.subjectTopics[chapterId];
}

export function invalidateTopicDetail(topicId) {
  if (!topicId) return;
  delete cache.topicDetail[topicId];
}

export function invalidateTables() {
  cache.tables.at = 0;
}

export function invalidateTableData(table) {
  if (!table) return;
  delete cache.tableData[table];
}
