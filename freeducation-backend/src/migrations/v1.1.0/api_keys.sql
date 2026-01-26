CREATE TABLE IF NOT EXISTS api_keys (
  id TEXT PRIMARY KEY,
  endpoint_id TEXT NOT NULL,
  label TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  prefix TEXT NOT NULL,
  is_enabled INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_used_at DATETIME,
  expires_at DATETIME,
  FOREIGN KEY (endpoint_id) REFERENCES api_endpoints(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_api_keys_endpoint ON api_keys(endpoint_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_enabled ON api_keys(is_enabled);
