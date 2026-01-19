// Export all models for easy importing
export * from './User';
export * from './Subject';
export * from './Assignment';
export * from './Social';

// Re-export common types
export type {
  User,
  UserProfile
} from './User';

export type {
  Subject,
  Chapter,
  Lesson
} from './Subject';

export type {
  Assignment,
  Submission,
  StudySession
} from './Assignment';

export type {
  SocialPost,
  Comment,
  Like,
  Notification,
  CreditTransaction
} from './Social';

// Re-export request types
export type {
  CreateUserRequest,
  UpdateUserRequest,
  LoginRequest,
  AuthResponse
} from './User';

export type {
  CreateSubjectRequest,
  CreateChapterRequest,
  CreateLessonRequest
} from './Subject';

export type {
  CreateAssignmentRequest,
  CreateSubmissionRequest,
  GradeSubmissionRequest,
  CreateStudySessionRequest
} from './Assignment';

export type {
  CreatePostRequest,
  CreateCommentRequest,
  LikeRequest,
  CreateNotificationRequest
} from './Social';
