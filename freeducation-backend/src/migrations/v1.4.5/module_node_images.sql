UPDATE module_nodes
SET has_image = 1
WHERE template_id IN (
  SELECT id FROM module_templates WHERE code = 'bangla-1st-nctb-2010'
)
AND node_key IN (
  'RHYMES_CHAPTERS',
  'STORIES_CHAPTERS',
  'RHYMES_SHORT_NOTES',
  'STORIES_SHORT_NOTES'
);

UPDATE module_nodes
SET has_image = 1
WHERE template_id IN (
  SELECT id FROM module_templates WHERE code = 'science-subjects-bio-phy-chem-nctb-2010'
)
AND node_key IN (
  'EXAM_SYSTEM',
  'CURRICULUM',
  'CURRICULUM_CHAPTERS',
  'CURRICULUM_TOPICS',
  'TOPIC_SHORT_NOTES'
);
