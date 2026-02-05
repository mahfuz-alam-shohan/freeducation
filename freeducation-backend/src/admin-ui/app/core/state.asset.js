export const DEFAULT_LABELS = {
  types: { CQ: 'CQ', MCQ: 'MCQ' },
  sections: { KNOWLEDGE: 'Knowledge', TWO: 'Understanding', THREE: 'Application', FOUR: 'HOTS' }
};

export const state = {
  user: null,
  users: [],
  total: 0,
  apis: [],
  moduleCategories: [],
  subjectModules: [],
  activeSubjectModule: null,
  subjectModuleNodes: [],
  subjects: [],
  activeSubject: null,
  subjectNodes: [],
  subjectLabels: DEFAULT_LABELS,
  subjectChapters: [],
  subjectTopics: [],
  chapterDetail: null,
  topicDetail: null,
  tables: [],
  selectedTable: null,
  tableRows: [],
  tableColumns: [],
  tablePrimaryKey: null,
  tableTotal: 0,
  maintenance: null
};
