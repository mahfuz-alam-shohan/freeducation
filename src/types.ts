export interface Env {
  DB: D1Database;
  JWT_SECRET?: string;
}

export interface AdminSession {
  id: number;
  name: string;
  email: string;
}

export interface ClassRow {
  id: number;
  name: string;
  has_groups: number;
  created_at: string;
  link_id?: number | null;
  link_name?: string | null;
}

export interface GroupRow {
  id: number;
  name: string;
  class_id?: number | null;
  link_id?: number | null;
}

export interface SubjectRow {
  id: number;
  name: string;
  class_id?: number | null;
  group_id?: number | null;
  link_id?: number | null;
  created_at: string;
  group_name?: string | null;
  chapter_count?: number;
}

export interface ChapterRow {
  id: number;
  subject_id: number;
  name: string;
  sort_order: number;
  created_at: string;
  topic_count?: number;
  question_count?: number;
}

export interface TopicRow {
  id: number;
  chapter_id: number;
  title: string;
  sort_order: number;
  created_at: string;
}

export interface ContentRow {
  id: number;
  topic_id: number;
  type: 'note' | 'video' | 'pdf' | 'explanation';
  title: string;
  data: string; // URL or Text body
  sort_order: number;
  created_at: string;
}

export interface QuestionRow {
  id: number;
  chapter_id: number;
  topic_id?: number; // Optional linking to topic
  type: 'mcq' | 'short' | 'board' | 'versity' | 'college' | 'custom';
  source_label?: string;
  question: string;
  cq_group_id?: string;
  cq_label?: string;
  cq_related?: number;
  scenario_text?: string;
  scenario_media_type?: 'image' | 'pdf' | 'link';
  scenario_media_url?: string;
  options?: string; // JSON string for MCQs
  answer?: string;
  answer_type?: 'text' | 'image' | 'pdf' | 'link';
  answer_media?: string;
  explanation?: string;
  sort_order: number;
  created_at: string;
}
