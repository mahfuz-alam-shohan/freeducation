export interface Env {
  DB: D1Database;
  // BUCKET: R2Bucket; // Ready for when you implement file storage
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
