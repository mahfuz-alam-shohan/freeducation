CREATE TABLE IF NOT EXISTS api_user_overrides (
  id TEXT PRIMARY KEY,
  endpoint_id TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('allow', 'deny')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (endpoint_id) REFERENCES api_endpoints(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_api_user_overrides_endpoint_user ON api_user_overrides(endpoint_id, user_id);
