export interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
  JWT_SECRET: string;
}

export interface Question {
  id: number;
  type: 'MCQ' | 'CQ' | 'CQ-Part' | 'WRITTEN';
  topic_id: number | null;
  question_text: string;
  options: any[]; // Stored as JSON string in DB, but API returns array
  answer: string;
  metadata: {
    board?: string;
    year?: string;
    school?: string;
    part?: string;
    chapter_id?: number | string;
    subject_id?: number | string;
    scope?: string;
  }; // Stored as JSON string in DB, but API returns object
}

export interface Topic {
  id: number;
  title: string;
  chapter_id: number;
  content: string;
  order_num: number;
}

export interface Chapter {
  id: number;
  title: string;
  subject_id: number;
  order_num: number;
}

export interface Subject {
  id: number;
  name: string;
  class_id: number;
  is_common: boolean; // SQLite stores 0/1, we treat as boolean
  group_id?: number;
}
