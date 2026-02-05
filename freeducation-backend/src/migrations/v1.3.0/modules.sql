CREATE TABLE IF NOT EXISTS module_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS module_templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES module_categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS module_nodes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  template_id INTEGER NOT NULL,
  parent_id INTEGER,
  node_key TEXT NOT NULL,
  server_name TEXT NOT NULL,
  node_type TEXT NOT NULL CHECK (node_type IN ('book', 'part')),
  has_image INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(template_id, node_key),
  FOREIGN KEY (template_id) REFERENCES module_templates(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES module_nodes(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_module_templates_category ON module_templates(category_id);
CREATE INDEX IF NOT EXISTS idx_module_templates_active ON module_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_module_nodes_template ON module_nodes(template_id);
CREATE INDEX IF NOT EXISTS idx_module_nodes_parent ON module_nodes(parent_id);

INSERT OR IGNORE INTO module_categories (key, name, description)
VALUES ('subjects', 'Subject Skeletons', 'Subject skeleton templates.');

INSERT OR IGNORE INTO module_templates (category_id, code, name, description)
SELECT id, 'bangla-1st-nctb-2010', 'Bangla-1st-NCTB 2010', 'Subject skeleton template.'
FROM module_categories
WHERE key = 'subjects';

INSERT OR IGNORE INTO module_nodes (template_id, parent_id, node_key, server_name, node_type, has_image, sort_order)
SELECT t.id, NULL, 'MAIN_BOOK', 'Main Book', 'book', 1, 1
FROM module_templates t
WHERE t.code = 'bangla-1st-nctb-2010';

INSERT OR IGNORE INTO module_nodes (template_id, parent_id, node_key, server_name, node_type, has_image, sort_order)
SELECT t.id, NULL, 'ASSISTED_BOOK', 'Assisted Book', 'book', 1, 2
FROM module_templates t
WHERE t.code = 'bangla-1st-nctb-2010';

INSERT OR IGNORE INTO module_nodes (template_id, parent_id, node_key, server_name, node_type, has_image, sort_order)
SELECT t.id, parent.id, 'RHYMES', 'Rhymes', 'part', 1, 1
FROM module_templates t
JOIN module_nodes parent
  ON parent.template_id = t.id
  AND parent.node_key = 'MAIN_BOOK'
WHERE t.code = 'bangla-1st-nctb-2010';

INSERT OR IGNORE INTO module_nodes (template_id, parent_id, node_key, server_name, node_type, has_image, sort_order)
SELECT t.id, parent.id, 'STORIES', 'Stories', 'part', 1, 2
FROM module_templates t
JOIN module_nodes parent
  ON parent.template_id = t.id
  AND parent.node_key = 'MAIN_BOOK'
WHERE t.code = 'bangla-1st-nctb-2010';

INSERT OR IGNORE INTO module_nodes (template_id, parent_id, node_key, server_name, node_type, has_image, sort_order)
SELECT t.id, parent.id, 'DIALOGUE', 'Dialogue', 'part', 1, 1
FROM module_templates t
JOIN module_nodes parent
  ON parent.template_id = t.id
  AND parent.node_key = 'ASSISTED_BOOK'
WHERE t.code = 'bangla-1st-nctb-2010';

INSERT OR IGNORE INTO module_nodes (template_id, parent_id, node_key, server_name, node_type, has_image, sort_order)
SELECT t.id, parent.id, 'BIG_STORY', 'Big Story', 'part', 1, 2
FROM module_templates t
JOIN module_nodes parent
  ON parent.template_id = t.id
  AND parent.node_key = 'ASSISTED_BOOK'
WHERE t.code = 'bangla-1st-nctb-2010';
