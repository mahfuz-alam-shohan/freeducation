UPDATE module_categories
SET name = 'Subject Skeletons',
  description = 'Subject skeleton templates.'
WHERE key = 'subjects';

UPDATE module_templates
SET description = 'Subject skeleton template.'
WHERE code = 'bangla-1st-nctb-2010';

UPDATE api_endpoints
SET name = 'Subject skeleton templates',
  description = 'List subject skeleton templates.'
WHERE path = '/api/v1/admin/modules/subjects'
  AND UPPER(method) = 'GET';

UPDATE api_endpoints
SET name = 'Subject skeleton detail',
  description = 'Get a subject skeleton template.'
WHERE path = '/api/v1/admin/modules/subjects/:id'
  AND UPPER(method) = 'GET';
