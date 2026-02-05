UPDATE module_nodes
SET server_name = 'Understanding'
WHERE node_key LIKE '%_CQ_TWO';

UPDATE module_nodes
SET server_name = 'Application'
WHERE node_key LIKE '%_CQ_THREE';

UPDATE module_nodes
SET server_name = 'HOTS'
WHERE node_key LIKE '%_CQ_FOUR';

UPDATE subject_cq_section_labels
SET display_name = 'Understanding'
WHERE display_name = 'Two';

UPDATE subject_cq_section_labels
SET display_name = 'Application'
WHERE display_name = 'Three';

UPDATE subject_cq_section_labels
SET display_name = 'HOTS'
WHERE display_name = 'Four';
