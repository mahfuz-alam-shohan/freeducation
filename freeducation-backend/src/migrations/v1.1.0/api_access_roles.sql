CREATE TABLE IF NOT EXISTS api_access_roles (
  id TEXT PRIMARY KEY,
  endpoint_id TEXT NOT NULL,
  role TEXT NOT NULL,
  is_enabled INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (endpoint_id) REFERENCES api_endpoints(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_api_access_roles_endpoint_role ON api_access_roles(endpoint_id, role);
