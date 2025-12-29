export type Bindings = {
  DB: D1Database;
  BUCKET: R2Bucket;
};

export type Variables = {
  admin?: {
    id: number;
    name: string;
    email: string;
  };
};
