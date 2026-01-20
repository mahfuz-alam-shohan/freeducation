export type Env = {
  DB: {
    prepare: (query: string) => {
      all: <T = unknown>() => Promise<{ results: T[] }>;
      run: () => Promise<void>;
      bind: (...values: unknown[]) => { run: () => Promise<void> };
    };
  };
  JWT_SECRET: string;
  GMAIL_CLIENT_ID: string;
  GMAIL_CLIENT_SECRET: string;
  GMAIL_REFRESH_TOKEN: string;
  ADMIN_SETUP_TOKEN?: string;
};
