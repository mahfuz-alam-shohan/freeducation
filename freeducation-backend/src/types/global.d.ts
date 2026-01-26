declare global {
  interface D1Database {
    prepare(query: string): D1PreparedStatement;
  }

  interface D1PreparedStatement {
    bind(...values: any[]): D1PreparedStatement;
    first(): Promise<any>;
    all(): Promise<{ results?: any[] }>;
    run(): Promise<{ success?: boolean; meta?: { changes?: number } }>;
  }

  interface R2Bucket {}

  interface ExecutionContext {
    waitUntil(promise: Promise<any>): void;
    passThroughOnException(): void;
  }
}

export {};
