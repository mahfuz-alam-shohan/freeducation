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
  link_name?: string | null; // Joined field
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
  
  // Joined fields for UI convenience
  group_name?: string | null;
  chapter_count?: number;
}

export interface ChapterRow {
  id: number;
  subject_id: number;
  name: string;
  sort_order: number;
  created_at: string;
}

export interface TopicRow {
  id: number;
  chapter_id: number;
  title: string;
  content_type: 'text' | 'video' | 'pdf';
  content_url?: string; // For video/PDF
  content_body?: string; // For text explanation
  sort_order: number;
  created_at: string;
}
