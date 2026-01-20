export type ColumnDefinition = {
  name: string;
  type: string;
  notNull?: boolean;
  unique?: boolean;
  defaultValue?: string;
  primaryKey?: boolean;
};

export type TableSchema = {
  name: string;
  columns: ColumnDefinition[];
};

export const adminTableSchema: TableSchema = {
  name: "admins",
  columns: [
    { name: "id", type: "INTEGER", primaryKey: true },
    { name: "name", type: "TEXT", notNull: true },
    { name: "email", type: "TEXT", notNull: true, unique: true },
    { name: "password_hash", type: "TEXT", notNull: true },
    { name: "date_of_birth", type: "TEXT", notNull: true },
    { name: "created_at", type: "TEXT", notNull: true },
  ],
};

export const studentTableSchema: TableSchema = {
  name: "students",
  columns: [
    { name: "id", type: "INTEGER", primaryKey: true },
    { name: "name", type: "TEXT", notNull: true },
    { name: "email", type: "TEXT", notNull: true, unique: true },
    { name: "password_hash", type: "TEXT", notNull: true },
    { name: "date_of_birth", type: "TEXT", notNull: true },
    { name: "created_at", type: "TEXT", notNull: true },
    { name: "verified_at", type: "TEXT" },
  ],
};

export const studentVerificationTableSchema: TableSchema = {
  name: "student_verifications",
  columns: [
    { name: "id", type: "INTEGER", primaryKey: true },
    { name: "student_id", type: "INTEGER", notNull: true },
    { name: "code_hash", type: "TEXT", notNull: true },
    { name: "attempts", type: "INTEGER", notNull: true, defaultValue: "0" },
    { name: "expires_at", type: "TEXT", notNull: true },
    { name: "created_at", type: "TEXT", notNull: true },
    { name: "used_at", type: "TEXT" },
  ],
};

export const teacherTableSchema: TableSchema = {
  name: "teachers",
  columns: [
    { name: "id", type: "INTEGER", primaryKey: true },
    { name: "name", type: "TEXT", notNull: true },
    { name: "email", type: "TEXT", notNull: true, unique: true },
    { name: "password_hash", type: "TEXT", notNull: true },
    { name: "date_of_birth", type: "TEXT", notNull: true },
    { name: "created_at", type: "TEXT", notNull: true },
  ],
};

export const moduleTableSchema: TableSchema = {
  name: "modules",
  columns: [
    { name: "id", type: "INTEGER", primaryKey: true },
    { name: "name", type: "TEXT", notNull: true },
    { name: "slug", type: "TEXT", notNull: true, unique: true },
    { name: "description", type: "TEXT" },
    { name: "is_active", type: "INTEGER", notNull: true, defaultValue: "1" },
    { name: "created_at", type: "TEXT", notNull: true },
  ],
};

export const classGroupTableSchema: TableSchema = {
  name: "class_groups",
  columns: [
    { name: "id", type: "INTEGER", primaryKey: true },
    { name: "name", type: "TEXT", notNull: true },
    { name: "slug", type: "TEXT", notNull: true, unique: true },
    { name: "description", type: "TEXT" },
    { name: "created_at", type: "TEXT", notNull: true },
  ],
};

export const subjectTableSchema: TableSchema = {
  name: "subjects",
  columns: [
    { name: "id", type: "INTEGER", primaryKey: true },
    { name: "name", type: "TEXT", notNull: true },
    { name: "slug", type: "TEXT", notNull: true, unique: true },
    { name: "template_slug", type: "TEXT" },
    { name: "description", type: "TEXT" },
    { name: "is_two_paper", type: "INTEGER", notNull: true, defaultValue: "0" },
    { name: "created_at", type: "TEXT", notNull: true },
  ],
};

export const classSubjectTableSchema: TableSchema = {
  name: "class_subjects",
  columns: [
    { name: "id", type: "INTEGER", primaryKey: true },
    { name: "class_group_id", type: "INTEGER", notNull: true },
    { name: "subject_id", type: "INTEGER", notNull: true },
    { name: "stream", type: "TEXT", notNull: true },
    { name: "is_optional", type: "INTEGER", notNull: true, defaultValue: "0" },
    { name: "created_at", type: "TEXT", notNull: true },
  ],
};

export const chapterTableSchema: TableSchema = {
  name: "chapters",
  columns: [
    { name: "id", type: "INTEGER", primaryKey: true },
    { name: "class_subject_id", type: "INTEGER", notNull: true },
    { name: "title", type: "TEXT", notNull: true },
    { name: "slug", type: "TEXT", notNull: true },
    { name: "position", type: "INTEGER", notNull: true, defaultValue: "0" },
    { name: "summary", type: "TEXT" },
    { name: "created_at", type: "TEXT", notNull: true },
  ],
};

export const chapterTopicTableSchema: TableSchema = {
  name: "chapter_topics",
  columns: [
    { name: "id", type: "INTEGER", primaryKey: true },
    { name: "chapter_id", type: "INTEGER", notNull: true },
    { name: "title", type: "TEXT", notNull: true },
    { name: "slug", type: "TEXT", notNull: true },
    { name: "position", type: "INTEGER", notNull: true, defaultValue: "0" },
    { name: "created_at", type: "TEXT", notNull: true },
  ],
};

export const contentItemTableSchema: TableSchema = {
  name: "content_items",
  columns: [
    { name: "id", type: "INTEGER", primaryKey: true },
    { name: "chapter_id", type: "INTEGER" },
    { name: "topic_id", type: "INTEGER" },
    { name: "content_type", type: "TEXT", notNull: true },
    { name: "title", type: "TEXT", notNull: true },
    { name: "body", type: "TEXT" },
    { name: "resource_url", type: "TEXT" },
    { name: "position", type: "INTEGER", notNull: true, defaultValue: "0" },
    { name: "metadata_json", type: "TEXT" },
    { name: "created_at", type: "TEXT", notNull: true },
  ],
};

export const subjectExamTableSchema: TableSchema = {
  name: "subject_exams",
  columns: [
    { name: "id", type: "INTEGER", primaryKey: true },
    { name: "class_subject_id", type: "INTEGER", notNull: true },
    { name: "title", type: "TEXT", notNull: true },
    { name: "exam_type", type: "TEXT", notNull: true },
    { name: "instructions", type: "TEXT" },
    { name: "total_marks", type: "INTEGER", notNull: true, defaultValue: "0" },
    { name: "duration_minutes", type: "INTEGER", notNull: true, defaultValue: "0" },
    { name: "created_at", type: "TEXT", notNull: true },
  ],
};

export const subjectExamQuestionTableSchema: TableSchema = {
  name: "subject_exam_questions",
  columns: [
    { name: "id", type: "INTEGER", primaryKey: true },
    { name: "exam_id", type: "INTEGER", notNull: true },
    { name: "question", type: "TEXT", notNull: true },
    { name: "answer", type: "TEXT" },
    { name: "choices_json", type: "TEXT" },
    { name: "position", type: "INTEGER", notNull: true, defaultValue: "0" },
    { name: "explanation", type: "TEXT" },
  ],
};

export const banglaNineTenSahapathTableSchema: TableSchema = {
  name: "bangla_9_10_sahapath_items",
  columns: [
    { name: "id", type: "INTEGER", primaryKey: true },
    { name: "category", type: "TEXT", notNull: true },
    { name: "title", type: "TEXT", notNull: true },
    { name: "created_at", type: "TEXT", notNull: true },
  ],
};

export const banglaNineTenLiteratureTableSchema: TableSchema = {
  name: "bangla_9_10_literature_items",
  columns: [
    { name: "id", type: "INTEGER", primaryKey: true },
    { name: "category", type: "TEXT", notNull: true },
    { name: "title", type: "TEXT", notNull: true },
    { name: "created_at", type: "TEXT", notNull: true },
  ],
};

export const banglaElevenTwelveSahapathTableSchema: TableSchema = {
  name: "bangla_11_12_sahapath_items",
  columns: [
    { name: "id", type: "INTEGER", primaryKey: true },
    { name: "category", type: "TEXT", notNull: true },
    { name: "title", type: "TEXT", notNull: true },
    { name: "created_at", type: "TEXT", notNull: true },
  ],
};

export const banglaElevenTwelveLiteratureTableSchema: TableSchema = {
  name: "bangla_11_12_literature_items",
  columns: [
    { name: "id", type: "INTEGER", primaryKey: true },
    { name: "category", type: "TEXT", notNull: true },
    { name: "title", type: "TEXT", notNull: true },
    { name: "created_at", type: "TEXT", notNull: true },
  ],
};

export const expectedSchema: TableSchema[] = [
  adminTableSchema,
  studentTableSchema,
  studentVerificationTableSchema,
  teacherTableSchema,
  moduleTableSchema,
  classGroupTableSchema,
  subjectTableSchema,
  classSubjectTableSchema,
  chapterTableSchema,
  chapterTopicTableSchema,
  contentItemTableSchema,
  subjectExamTableSchema,
  subjectExamQuestionTableSchema,
  banglaNineTenSahapathTableSchema,
  banglaNineTenLiteratureTableSchema,
  banglaElevenTwelveSahapathTableSchema,
  banglaElevenTwelveLiteratureTableSchema,
];

export const buildColumnSql = (column: ColumnDefinition): string => {
  const parts = [column.name, column.type];

  if (column.primaryKey) {
    parts.push("PRIMARY KEY");
  }

  if (column.notNull) {
    parts.push("NOT NULL");
  }

  if (column.unique) {
    parts.push("UNIQUE");
  }

  if (column.defaultValue) {
    parts.push(`DEFAULT ${column.defaultValue}`);
  }

  return parts.join(" ");
};

export const buildCreateTableSql = (table: TableSchema): string => {
  const columnSql = table.columns.map(buildColumnSql).join(", ");
  return `CREATE TABLE IF NOT EXISTS ${table.name} (${columnSql})`;
};
