INSERT OR IGNORE INTO module_templates (category_id, code, name, description)
SELECT id, 'math-nctb-2010', 'Math-NCTB 2010', 'Subject skeleton template.'
FROM module_categories
WHERE key = 'subjects';

INSERT OR IGNORE INTO module_nodes (template_id, parent_id, node_key, server_name, node_type, has_image, sort_order)
SELECT t.id, NULL, 'EXAM_SYSTEM', 'Exam System', 'book', 1, 1
FROM module_templates t
WHERE t.code = 'math-nctb-2010';

INSERT OR IGNORE INTO module_nodes (template_id, parent_id, node_key, server_name, node_type, has_image, sort_order)
SELECT t.id, NULL, 'CURRICULUM', 'Curriculum', 'book', 1, 2
FROM module_templates t
WHERE t.code = 'math-nctb-2010';

INSERT OR IGNORE INTO module_nodes (template_id, parent_id, node_key, server_name, node_type, has_image, sort_order)
SELECT t.id, parent.id, 'CURRICULUM_CHAPTERS', 'Chapters', 'part', 1, 1
FROM module_templates t
JOIN module_nodes parent
  ON parent.template_id = t.id
  AND parent.node_key = 'CURRICULUM'
WHERE t.code = 'math-nctb-2010';

INSERT OR IGNORE INTO module_nodes (template_id, parent_id, node_key, server_name, node_type, has_image, sort_order)
SELECT t.id, parent.id, 'CURRICULUM_TOPICS', 'Topics', 'part', 1, 1
FROM module_templates t
JOIN module_nodes parent
  ON parent.template_id = t.id
  AND parent.node_key = 'CURRICULUM_CHAPTERS'
WHERE t.code = 'math-nctb-2010';

INSERT OR IGNORE INTO module_nodes (template_id, parent_id, node_key, server_name, node_type, has_image, sort_order)
SELECT t.id, parent.id, 'TOPIC_SHORT_NOTES', 'Short Notes', 'part', 1, 1
FROM module_templates t
JOIN module_nodes parent
  ON parent.template_id = t.id
  AND parent.node_key = 'CURRICULUM_TOPICS'
WHERE t.code = 'math-nctb-2010';

INSERT OR IGNORE INTO module_nodes (template_id, parent_id, node_key, server_name, node_type, has_image, sort_order)
SELECT t.id, parent.id, 'TOPIC_VIDEOS', 'Videos', 'part', 0, 2
FROM module_templates t
JOIN module_nodes parent
  ON parent.template_id = t.id
  AND parent.node_key = 'CURRICULUM_TOPICS'
WHERE t.code = 'math-nctb-2010';

INSERT OR IGNORE INTO module_nodes (template_id, parent_id, node_key, server_name, node_type, has_image, sort_order)
SELECT t.id, parent.id, 'TOPIC_QUESTION_BANK', 'Question Bank', 'part', 0, 3
FROM module_templates t
JOIN module_nodes parent
  ON parent.template_id = t.id
  AND parent.node_key = 'CURRICULUM_TOPICS'
WHERE t.code = 'math-nctb-2010';

INSERT OR IGNORE INTO module_nodes (template_id, parent_id, node_key, server_name, node_type, has_image, sort_order)
SELECT t.id, parent.id, 'TOPIC_CQ', 'CQ', 'part', 0, 1
FROM module_templates t
JOIN module_nodes parent
  ON parent.template_id = t.id
  AND parent.node_key = 'TOPIC_QUESTION_BANK'
WHERE t.code = 'math-nctb-2010';

INSERT OR IGNORE INTO module_nodes (template_id, parent_id, node_key, server_name, node_type, has_image, sort_order)
SELECT t.id, parent.id, 'TOPIC_MCQ', 'MCQ', 'part', 0, 2
FROM module_templates t
JOIN module_nodes parent
  ON parent.template_id = t.id
  AND parent.node_key = 'TOPIC_QUESTION_BANK'
WHERE t.code = 'math-nctb-2010';

INSERT OR IGNORE INTO module_nodes (template_id, parent_id, node_key, server_name, node_type, has_image, sort_order)
SELECT t.id, parent.id, 'TOPIC_CQ_KNOWLEDGE', 'Knowledge', 'part', 0, 1
FROM module_templates t
JOIN module_nodes parent
  ON parent.template_id = t.id
  AND parent.node_key = 'TOPIC_CQ'
WHERE t.code = 'math-nctb-2010';

INSERT OR IGNORE INTO module_nodes (template_id, parent_id, node_key, server_name, node_type, has_image, sort_order)
SELECT t.id, parent.id, 'TOPIC_CQ_THREE', 'Application', 'part', 0, 2
FROM module_templates t
JOIN module_nodes parent
  ON parent.template_id = t.id
  AND parent.node_key = 'TOPIC_CQ'
WHERE t.code = 'math-nctb-2010';

INSERT OR IGNORE INTO module_nodes (template_id, parent_id, node_key, server_name, node_type, has_image, sort_order)
SELECT t.id, parent.id, 'TOPIC_CQ_FOUR', 'HOTS', 'part', 0, 3
FROM module_templates t
JOIN module_nodes parent
  ON parent.template_id = t.id
  AND parent.node_key = 'TOPIC_CQ'
WHERE t.code = 'math-nctb-2010';
