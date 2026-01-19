export interface SocialPost {
  id: number;
  user_id: number;
  content: string;
  type: 'text' | 'image' | 'video' | 'link';
  attachment_urls?: string; // JSON array
  hashtags?: string; // JSON array
  mentions?: string; // JSON array of user IDs
  visibility: 'public' | 'friends' | 'private';
  likes_count: number;
  comments_count: number;
  is_pinned: boolean;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  parent_id?: number; // For threaded comments
  content: string;
  likes_count: number;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
}

export interface Like {
  id: number;
  user_id: number;
  target_type: 'post' | 'comment';
  target_id: number;
  created_at: string;
}

export interface Notification {
  id: number;
  user_id: number;
  type: 'assignment' | 'grade' | 'comment' | 'like' | 'mention' | 'system';
  title: string;
  message?: string;
  data?: string; // JSON with additional data
  is_read: boolean;
  action_url?: string;
  created_at: string;
}

export interface CreditTransaction {
  id: number;
  user_id: number;
  amount: number; // positive for earning, negative for spending
  type: 'study_time' | 'assignment_complete' | 'quiz_score' | 'social_post' | 'premium_content';
  description?: string;
  reference_id?: number; // Reference to related record
  reference_type?: string; // 'assignment', 'lesson', 'social_post'
  created_at: string;
}

export interface CreatePostRequest {
  content: string;
  type: 'text' | 'image' | 'video' | 'link';
  attachment_urls?: string[];
  hashtags?: string[];
  mentions?: number[];
  visibility?: 'public' | 'friends' | 'private';
}

export interface CreateCommentRequest {
  post_id: number;
  parent_id?: number;
  content: string;
}

export interface LikeRequest {
  target_type: 'post' | 'comment';
  target_id: number;
}

export interface CreateNotificationRequest {
  user_id: number;
  type: 'assignment' | 'grade' | 'comment' | 'like' | 'mention' | 'system';
  title: string;
  message?: string;
  data?: any;
  action_url?: string;
}
