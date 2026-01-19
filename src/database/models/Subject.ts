export interface Subject {
  id: number;
  name: string;
  code: string;
  description?: string;
  category: 'core' | 'elective' | 'optional';
  class_level: string; // '6', '7', '8', '9', '10', '11', '12' or ranges like '6-8'
  group?: 'science' | 'commerce' | 'arts';
  icon?: string;
  color?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Chapter {
  id: number;
  subject_id: number;
  title: string;
  description?: string;
  chapter_number: number;
  estimated_hours?: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: number;
  chapter_id: number;
  title: string;
  content?: string; // HTML/Markdown content
  lesson_type: 'text' | 'video' | 'audio' | 'interactive';
  video_url?: string;
  audio_url?: string;
  duration_minutes?: number;
  lesson_number: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  is_active: boolean;
  is_free: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateSubjectRequest {
  name: string;
  code: string;
  description?: string;
  category: 'core' | 'elective' | 'optional';
  class_level: string;
  group?: 'science' | 'commerce' | 'arts';
  icon?: string;
  color?: string;
}

export interface CreateChapterRequest {
  subject_id: number;
  title: string;
  description?: string;
  chapter_number: number;
  estimated_hours?: number;
}

export interface CreateLessonRequest {
  chapter_id: number;
  title: string;
  content?: string;
  lesson_type: 'text' | 'video' | 'audio' | 'interactive';
  video_url?: string;
  audio_url?: string;
  duration_minutes?: number;
  lesson_number: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  is_free?: boolean;
}
