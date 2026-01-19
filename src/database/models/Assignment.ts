export interface Assignment {
  id: number;
  title: string;
  description?: string;
  type: 'homework' | 'quiz' | 'exam' | 'project';
  subject_id: number;
  chapter_id?: number;
  teacher_id: number;
  max_points: number;
  due_date?: string;
  allow_late_submission: boolean;
  instructions?: string;
  attachment_urls?: string; // JSON array
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: number;
  assignment_id: number;
  student_id: number;
  content?: string;
  attachment_urls?: string; // JSON array
  status: 'draft' | 'submitted' | 'graded' | 'returned';
  points_earned?: number;
  feedback?: string;
  graded_by?: number;
  graded_at?: string;
  submitted_at: string;
  updated_at: string;
}

export interface StudySession {
  id: number;
  user_id: number;
  subject_id?: number;
  lesson_id?: number;
  duration_minutes: number;
  progress_percentage: number;
  completed: boolean;
  started_at: string;
  ended_at?: string;
}

export interface CreateAssignmentRequest {
  title: string;
  description?: string;
  type: 'homework' | 'quiz' | 'exam' | 'project';
  subject_id: number;
  chapter_id?: number;
  max_points?: number;
  due_date?: string;
  allow_late_submission?: boolean;
  instructions?: string;
  attachment_urls?: string[];
}

export interface CreateSubmissionRequest {
  assignment_id: number;
  content?: string;
  attachment_urls?: string[];
}

export interface GradeSubmissionRequest {
  points_earned: number;
  feedback?: string;
}

export interface CreateStudySessionRequest {
  subject_id?: number;
  lesson_id?: number;
  duration_minutes: number;
  progress_percentage?: number;
  completed?: boolean;
}
