INSERT OR IGNORE INTO module_nodes (template_id, parent_id, node_key, server_name, node_type, has_image, sort_order)
SELECT t.id, parent.id, 'RHYMES_CHAPTERS', 'Chapters', 'part', 0, 1
FROM module_templates t
JOIN module_nodes parent
  ON parent.template_id = t.id
  AND parent.node_key = 'RHYMES'
WHERE t.code = 'bangla-1st-nctb-2010';

INSERT OR IGNORE INTO module_nodes (template_id, parent_id, node_key, server_name, node_type, has_image, sort_order)
SELECT t.id, parent.id, 'RHYMES_SHORT_NOTES', 'Short Notes', 'part', 0, 1
FROM module_templates t
JOIN module_nodes parent
  ON parent.template_id = t.id
  AND parent.node_key = 'RHYMES_CHAPTERS'
WHERE t.code = 'bangla-1st-nctb-2010';

INSERT OR IGNORE INTO module_nodes (template_id, parent_id, node_key, server_name, node_type, has_image, sort_order)
SELECT t.id, parent.id, 'RHYMES_VIDEOS', 'Videos', 'part', 0, 2
FROM module_templates t
JOIN module_nodes parent
  ON parent.template_id = t.id
  AND parent.node_key = 'RHYMES_CHAPTERS'
WHERE t.code = 'bangla-1st-nctb-2010';

INSERT OR IGNORE INTO module_nodes (template_id, parent_id, node_key, server_name, node_type, has_image, sort_order)
SELECT t.id, parent.id, 'RHYMES_QUESTION_BANK', 'Question Bank', 'part', 0, 3
FROM module_templates t
JOIN module_nodes parent
  ON parent.template_id = t.id
  AND parent.node_key = 'RHYMES_CHAPTERS'
WHERE t.code = 'bangla-1st-nctb-2010';

INSERT OR IGNORE INTO module_nodes (template_id, parent_id, node_key, server_name, node_type, has_image, sort_order)
SELECT t.id, parent.id, 'RHYMES_CQ', 'CQ', 'part', 0, 1
FROM module_templates t
JOIN module_nodes parent
  ON parent.template_id = t.id
  AND parent.node_key = 'RHYMES_QUESTION_BANK'
WHERE t.code = 'bangla-1st-nctb-2010';

INSERT OR IGNORE INTO module_nodes (template_id, parent_id, node_key, server_name, node_type, has_image, sort_order)
SELECT t.id, parent.id, 'RHYMES_MCQ', 'MCQ', 'part', 0, 2
FROM module_templates t
JOIN module_nodes parent
  ON parent.template_id = t.id
  AND parent.node_key = 'RHYMES_QUESTION_BANK'
WHERE t.code = 'bangla-1st-nctb-2010';

INSERT OR IGNORE INTO module_nodes (template_id, parent_id, node_key, server_name, node_type, has_image, sort_order)
SELECT t.id, parent.id, 'RHYMES_CQ_KNOWLEDGE', 'Knowledge', 'part', 0, 1
FROM module_templates t
JOIN module_nodes parent
  ON parent.template_id = t.id
  AND parent.node_key = 'RHYMES_CQ'
WHERE t.code = 'bangla-1st-nctb-2010';

INSERT OR IGNORE INTO module_nodes (template_id, parent_id, node_key, server_name, node_type, has_image, sort_order)
SELECT t.id, parent.id, 'RHYMES_CQ_TWO', 'Understanding', 'part', 0, 2
FROM module_templates t
JOIN module_nodes parent
  ON parent.template_id = t.id
  AND parent.node_key = 'RHYMES_CQ'
WHERE t.code = 'bangla-1st-nctb-2010';

INSERT OR IGNORE INTO module_nodes (template_id, parent_id, node_key, server_name, node_type, has_image, sort_order)
SELECT t.id, parent.id, 'RHYMES_CQ_THREE', 'Application', 'part', 0, 3
FROM module_templates t
JOIN module_nodes parent
  ON parent.template_id = t.id
  AND parent.node_key = 'RHYMES_CQ'
WHERE t.code = 'bangla-1st-nctb-2010';

INSERT OR IGNORE INTO module_nodes (template_id, parent_id, node_key, server_name, node_type, has_image, sort_order)
SELECT t.id, parent.id, 'RHYMES_CQ_FOUR', 'HOTS', 'part', 0, 4
FROM module_templates t
JOIN module_nodes parent
  ON parent.template_id = t.id
  AND parent.node_key = 'RHYMES_CQ'
WHERE t.code = 'bangla-1st-nctb-2010';

INSERT OR IGNORE INTO module_nodes (template_id, parent_id, node_key, server_name, node_type, has_image, sort_order)
SELECT t.id, parent.id, 'STORIES_CHAPTERS', 'Chapters', 'part', 0, 1
FROM module_templates t
JOIN module_nodes parent
  ON parent.template_id = t.id
  AND parent.node_key = 'STORIES'
WHERE t.code = 'bangla-1st-nctb-2010';

INSERT OR IGNORE INTO module_nodes (template_id, parent_id, node_key, server_name, node_type, has_image, sort_order)
SELECT t.id, parent.id, 'STORIES_SHORT_NOTES', 'Short Notes', 'part', 0, 1
FROM module_templates t
JOIN module_nodes parent
  ON parent.template_id = t.id
  AND parent.node_key = 'STORIES_CHAPTERS'
WHERE t.code = 'bangla-1st-nctb-2010';

INSERT OR IGNORE INTO module_nodes (template_id, parent_id, node_key, server_name, node_type, has_image, sort_order)
SELECT t.id, parent.id, 'STORIES_VIDEOS', 'Videos', 'part', 0, 2
FROM module_templates t
JOIN module_nodes parent
  ON parent.template_id = t.id
  AND parent.node_key = 'STORIES_CHAPTERS'
WHERE t.code = 'bangla-1st-nctb-2010';

INSERT OR IGNORE INTO module_nodes (template_id, parent_id, node_key, server_name, node_type, has_image, sort_order)
SELECT t.id, parent.id, 'STORIES_QUESTION_BANK', 'Question Bank', 'part', 0, 3
FROM module_templates t
JOIN module_nodes parent
  ON parent.template_id = t.id
  AND parent.node_key = 'STORIES_CHAPTERS'
WHERE t.code = 'bangla-1st-nctb-2010';

INSERT OR IGNORE INTO module_nodes (template_id, parent_id, node_key, server_name, node_type, has_image, sort_order)
SELECT t.id, parent.id, 'STORIES_CQ', 'CQ', 'part', 0, 1
FROM module_templates t
JOIN module_nodes parent
  ON parent.template_id = t.id
  AND parent.node_key = 'STORIES_QUESTION_BANK'
WHERE t.code = 'bangla-1st-nctb-2010';

INSERT OR IGNORE INTO module_nodes (template_id, parent_id, node_key, server_name, node_type, has_image, sort_order)
SELECT t.id, parent.id, 'STORIES_MCQ', 'MCQ', 'part', 0, 2
FROM module_templates t
JOIN module_nodes parent
  ON parent.template_id = t.id
  AND parent.node_key = 'STORIES_QUESTION_BANK'
WHERE t.code = 'bangla-1st-nctb-2010';

INSERT OR IGNORE INTO module_nodes (template_id, parent_id, node_key, server_name, node_type, has_image, sort_order)
SELECT t.id, parent.id, 'STORIES_CQ_KNOWLEDGE', 'Knowledge', 'part', 0, 1
FROM module_templates t
JOIN module_nodes parent
  ON parent.template_id = t.id
  AND parent.node_key = 'STORIES_CQ'
WHERE t.code = 'bangla-1st-nctb-2010';

INSERT OR IGNORE INTO module_nodes (template_id, parent_id, node_key, server_name, node_type, has_image, sort_order)
SELECT t.id, parent.id, 'STORIES_CQ_TWO', 'Understanding', 'part', 0, 2
FROM module_templates t
JOIN module_nodes parent
  ON parent.template_id = t.id
  AND parent.node_key = 'STORIES_CQ'
WHERE t.code = 'bangla-1st-nctb-2010';

INSERT OR IGNORE INTO module_nodes (template_id, parent_id, node_key, server_name, node_type, has_image, sort_order)
SELECT t.id, parent.id, 'STORIES_CQ_THREE', 'Application', 'part', 0, 3
FROM module_templates t
JOIN module_nodes parent
  ON parent.template_id = t.id
  AND parent.node_key = 'STORIES_CQ'
WHERE t.code = 'bangla-1st-nctb-2010';

INSERT OR IGNORE INTO module_nodes (template_id, parent_id, node_key, server_name, node_type, has_image, sort_order)
SELECT t.id, parent.id, 'STORIES_CQ_FOUR', 'HOTS', 'part', 0, 4
FROM module_templates t
JOIN module_nodes parent
  ON parent.template_id = t.id
  AND parent.node_key = 'STORIES_CQ'
WHERE t.code = 'bangla-1st-nctb-2010';
