// User related models
export interface User {
  id: number;
  role: UserRole;
  name: string;
  email: string;
  passwordHash: string;
  dateOfBirth: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSession {
  name: string;
  email: string;
}

export interface StudentSignup {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  dateOfBirth: string;
  codeHash: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "admin" | "teacher" | "student";

export interface UserListItem {
  role: UserRole;
  name: string;
  email: string;
  createdAt: string;
}

// Module and Subject models
export interface Module {
  id: number;
  name: string;
  slug: string;
  description: string;
  isActive: number;
  createdAt: string;
  updatedAt: string;
}

export interface ModuleListItem {
  id: number;
  name: string;
  slug: string;
  description: string;
  isActive: number;
  createdAt: string;
}

export interface ClassGroup {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
}

export interface Subject {
  id: number;
  name: string;
  slug: string;
  templateSlug: string;
  description: string;
  isTwoPaper: number;
  createdAt: string;
  updatedAt: string;
}

export interface SubjectListItem {
  id: number;
  name: string;
  slug: string;
  templateSlug: string;
  description: string;
  isTwoPaper: number;
  createdAt: string;
}

export interface SubjectDetail {
  id: number;
  name: string;
  slug: string;
  templateSlug: string;
  description: string;
  isTwoPaper: number;
}

export interface SubjectClassGroup {
  classSubjectId: number;
  classGroupId: number;
  classGroupName: string;
  classGroupSlug: string;
  isOptional: number;
}

// Content hierarchy models
export interface Chapter {
  id: number;
  classSubjectId: number;
  title: string;
  slug: string;
  position: number;
  summary?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChapterItem {
  id: number;
  title: string;
  slug: string;
  position: number;
  summary?: string;
  createdAt: string;
}

export interface Topic {
  id: number;
  chapterId: number;
  title: string;
  slug: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface TopicItem {
  id: number;
  title: string;
  slug: string;
  position: number;
  createdAt: string;
}

export interface Content {
  id: number;
  chapterId?: number;
  topicId?: number;
  contentType: string;
  title: string;
  body?: string;
  resourceUrl?: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContentItem {
  id: number;
  contentType: string;
  title: string;
  body?: string;
  resourceUrl?: string;
  position: number;
}

// Template models
export interface SubjectTemplate {
  slug: string;
  name: string;
  structure: {
    hasTopics: boolean;
    hasChapters: boolean;
    hasContent: boolean;
  };
}

// Request/Response models
export interface AdminPayload {
  name: string;
  email: string;
  password: string;
  dateOfBirth: string;
}

export interface CreateUserPayload {
  role: UserRole;
  name: string;
  email: string;
  password: string;
  dateOfBirth: string;
}

export interface StudentSignupPayload {
  name: string;
  email: string;
  password: string;
  dateOfBirth: string;
  codeHash: string;
  expiresAt: string;
}

export interface ChapterPayload {
  classSubjectId: number;
  title: string;
  slug: string;
  position: number;
  summary?: string;
}

export interface TopicPayload {
  chapterId: number;
  title: string;
  slug: string;
  position: number;
}

export interface ContentPayload {
  chapterId?: number;
  topicId?: number;
  contentType: string;
  title: string;
  body?: string;
  resourceUrl?: string;
  position: number;
}
