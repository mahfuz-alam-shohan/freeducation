DELETE FROM api_access_roles
WHERE endpoint_id IN (
  SELECT id FROM api_endpoints
  WHERE path IN (
    '/api/v1/admin/subjects',
    '/api/v1/admin/subjects/:id',
    '/api/v1/admin/subjects/:id/academic',
    '/api/v1/modules/subjects',
    '/api/v1/modules/subjects/:id/academic'
  )
);

DELETE FROM api_user_overrides
WHERE endpoint_id IN (
  SELECT id FROM api_endpoints
  WHERE path IN (
    '/api/v1/admin/subjects',
    '/api/v1/admin/subjects/:id',
    '/api/v1/admin/subjects/:id/academic',
    '/api/v1/modules/subjects',
    '/api/v1/modules/subjects/:id/academic'
  )
);

DELETE FROM api_keys
WHERE endpoint_id IN (
  SELECT id FROM api_endpoints
  WHERE path IN (
    '/api/v1/admin/subjects',
    '/api/v1/admin/subjects/:id',
    '/api/v1/admin/subjects/:id/academic',
    '/api/v1/modules/subjects',
    '/api/v1/modules/subjects/:id/academic'
  )
);

DELETE FROM api_endpoints
WHERE path IN (
  '/api/v1/admin/subjects',
  '/api/v1/admin/subjects/:id',
  '/api/v1/admin/subjects/:id/academic',
  '/api/v1/modules/subjects',
  '/api/v1/modules/subjects/:id/academic'
);

DROP TABLE IF EXISTS subject_academic_classes;
DROP TABLE IF EXISTS academic_classes;
DROP TABLE IF EXISTS subjects;
