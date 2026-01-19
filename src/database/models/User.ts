export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  full_name: string;
  user_type: 'admin' | 'student' | 'teacher' | 'writer' | 'publisher';
  is_active: boolean;
  email_verified: boolean;
  avatar_url?: string;
  phone?: string;
  date_of_birth?: string;
  address?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface UserProfile {
  id: number;
  user_id: number;
  institution?: string;
  class_grade?: string;
  section?: string;
  roll_number?: string;
  parent_name?: string;
  parent_phone?: string;
  emergency_contact?: string;
  preferences?: string; // JSON string
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  full_name: string;
  user_type: 'admin' | 'student' | 'teacher' | 'writer' | 'publisher';
  phone?: string;
  date_of_birth?: string;
  address?: string;
  bio?: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  full_name?: string;
  phone?: string;
  date_of_birth?: string;
  address?: string;
  bio?: string;
  avatar_url?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password_hash'>;
  token: string;
  expires_at: string;
}
