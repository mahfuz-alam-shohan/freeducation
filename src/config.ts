export interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  password_hash: string;
  salt: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'tool';
  category: string;
  url: string;
  views: number;
  created_at: number;
}

export interface Session {
  id: string;
  user_id: string;
  full_name: string;
  role: string;
  expires_at: number;
}
