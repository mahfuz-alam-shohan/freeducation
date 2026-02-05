interface ApiSeedEntry {
  name: string;
  method: string;
  path: string;
  description: string;
  dataSummary: string;
  isPublic: boolean;
  isSystem: boolean;
  roles?: string[];
}

const DEFAULT_APIS: ApiSeedEntry[] = [
  {
    name: 'Health check',
    method: 'GET',
    path: '/api/v1/health',
    description: 'Basic health response.',
    dataSummary: 'status',
    isPublic: true,
    isSystem: true
  },
  {
    name: 'Admin bootstrap',
    method: 'POST',
    path: '/api/v1/admin/bootstrap',
    description: 'Create the first admin account.',
    dataSummary: 'admin profile',
    isPublic: true,
    isSystem: true
  },
  {
    name: 'Admin bootstrap status',
    method: 'GET',
    path: '/api/v1/admin/bootstrap/status',
    description: 'Check if admin bootstrap is available.',
    dataSummary: 'canBootstrap flag',
    isPublic: true,
    isSystem: true
  },
  {
    name: 'Admin login',
    method: 'POST',
    path: '/api/v1/admin/login',
    description: 'Sign in an admin.',
    dataSummary: 'admin profile, session cookie',
    isPublic: true,
    isSystem: true
  },
  {
    name: 'Admin logout',
    method: 'POST',
    path: '/api/v1/admin/logout',
    description: 'Sign out the admin.',
    dataSummary: 'logout result',
    isPublic: true,
    isSystem: true
  },
  {
    name: 'Admin session',
    method: 'GET',
    path: '/api/v1/admin/session',
    description: 'Load the current admin session.',
    dataSummary: 'session, admin profile',
    isPublic: true,
    isSystem: true
  },
  {
    name: 'Users list',
    method: 'GET',
    path: '/api/v1/users',
    description: 'List users with pagination.',
    dataSummary: 'users array, pagination',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'Users create',
    method: 'POST',
    path: '/api/v1/users',
    description: 'Create a user record.',
    dataSummary: 'user record',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'Users get',
    method: 'GET',
    path: '/api/v1/users/:id',
    description: 'Get a user by id.',
    dataSummary: 'user record',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'Users update',
    method: 'PATCH',
    path: '/api/v1/users/:id',
    description: 'Update a user.',
    dataSummary: 'user record',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'Schema reconcile',
    method: 'POST',
    path: '/api/v1/admin/maintenance/reconcile',
    description: 'Reconcile database tables.',
    dataSummary: 'created/dropped tables, warnings',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'DB tables',
    method: 'GET',
    path: '/api/v1/admin/db/tables',
    description: 'List database tables.',
    dataSummary: 'tables list',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'DB table detail',
    method: 'GET',
    path: '/api/v1/admin/db/table/:table',
    description: 'List table rows.',
    dataSummary: 'rows, columns, total',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'DB table delete',
    method: 'DELETE',
    path: '/api/v1/admin/db/table/:table',
    description: 'Drop a table.',
    dataSummary: 'delete result',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'DB table truncate',
    method: 'POST',
    path: '/api/v1/admin/db/table/:table/truncate',
    description: 'Clear all rows.',
    dataSummary: 'truncate result',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'DB row delete',
    method: 'DELETE',
    path: '/api/v1/admin/db/table/:table/row',
    description: 'Delete a row.',
    dataSummary: 'delete result',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'Module categories',
    method: 'GET',
    path: '/api/v1/admin/modules/categories',
    description: 'List module categories.',
    dataSummary: 'categories array',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'Subject skeleton templates',
    method: 'GET',
    path: '/api/v1/admin/modules/subjects',
    description: 'List subject skeleton templates.',
    dataSummary: 'templates array',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'Subject skeleton detail',
    method: 'GET',
    path: '/api/v1/admin/modules/subjects/:id',
    description: 'Get a subject skeleton template.',
    dataSummary: 'template, nodes',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'Subjects list',
    method: 'GET',
    path: '/api/v1/admin/subjects',
    description: 'List subjects.',
    dataSummary: 'subjects array',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'Subjects create',
    method: 'POST',
    path: '/api/v1/admin/subjects',
    description: 'Create a subject.',
    dataSummary: 'subject record',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'Subjects detail',
    method: 'GET',
    path: '/api/v1/admin/subjects/:id',
    description: 'Get subject detail and skeleton nodes.',
    dataSummary: 'subject, nodes, labels',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'Subjects update',
    method: 'PATCH',
    path: '/api/v1/admin/subjects/:id',
    description: 'Update a subject.',
    dataSummary: 'subject record',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'Subjects delete',
    method: 'DELETE',
    path: '/api/v1/admin/subjects/:id',
    description: 'Delete a subject.',
    dataSummary: 'delete result',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'Subject node override',
    method: 'PUT',
    path: '/api/v1/admin/subjects/:id/nodes/:nodeId',
    description: 'Update subject skeleton node overrides.',
    dataSummary: 'override result',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'Subject chapters list',
    method: 'GET',
    path: '/api/v1/admin/subjects/:id/chapters',
    description: 'List subject chapters for a node.',
    dataSummary: 'chapters array',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'Subject chapters create',
    method: 'POST',
    path: '/api/v1/admin/subjects/:id/chapters',
    description: 'Create a chapter.',
    dataSummary: 'chapter record',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'Subject chapters update',
    method: 'PATCH',
    path: '/api/v1/admin/subjects/:id/chapters/:chapterId',
    description: 'Update a chapter.',
    dataSummary: 'chapter record',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'Subject chapters delete',
    method: 'DELETE',
    path: '/api/v1/admin/subjects/:id/chapters/:chapterId',
    description: 'Delete a chapter.',
    dataSummary: 'delete result',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'Chapter detail',
    method: 'GET',
    path: '/api/v1/admin/chapters/:chapterId',
    description: 'Get chapter detail and content.',
    dataSummary: 'chapter, notes, videos, questions',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'Chapter notes create',
    method: 'POST',
    path: '/api/v1/admin/chapters/:chapterId/notes',
    description: 'Add a short note.',
    dataSummary: 'note record',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'Chapter notes delete',
    method: 'DELETE',
    path: '/api/v1/admin/chapters/:chapterId/notes/:noteId',
    description: 'Delete a short note.',
    dataSummary: 'delete result',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'Chapter videos create',
    method: 'POST',
    path: '/api/v1/admin/chapters/:chapterId/videos',
    description: 'Add a video.',
    dataSummary: 'video record',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'Chapter videos delete',
    method: 'DELETE',
    path: '/api/v1/admin/chapters/:chapterId/videos/:videoId',
    description: 'Delete a video.',
    dataSummary: 'delete result',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'Chapter questions create',
    method: 'POST',
    path: '/api/v1/admin/chapters/:chapterId/questions',
    description: 'Add a question item.',
    dataSummary: 'question record',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'Chapter questions update',
    method: 'PATCH',
    path: '/api/v1/admin/chapters/:chapterId/questions/:questionId',
    description: 'Update a question item.',
    dataSummary: 'question record',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'Chapter questions delete',
    method: 'DELETE',
    path: '/api/v1/admin/chapters/:chapterId/questions/:questionId',
    description: 'Delete a question item.',
    dataSummary: 'delete result',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'Chapter topics list',
    method: 'GET',
    path: '/api/v1/admin/chapters/:chapterId/topics',
    description: 'List chapter topics.',
    dataSummary: 'topics array',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'Chapter topics create',
    method: 'POST',
    path: '/api/v1/admin/chapters/:chapterId/topics',
    description: 'Create a topic for a chapter.',
    dataSummary: 'topic record',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'Chapter topics update',
    method: 'PATCH',
    path: '/api/v1/admin/chapters/:chapterId/topics/:topicId',
    description: 'Update a topic.',
    dataSummary: 'topic record',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'Chapter topics delete',
    method: 'DELETE',
    path: '/api/v1/admin/chapters/:chapterId/topics/:topicId',
    description: 'Delete a topic.',
    dataSummary: 'delete result',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'Topic detail',
    method: 'GET',
    path: '/api/v1/admin/topics/:topicId',
    description: 'Get topic detail and content.',
    dataSummary: 'topic, notes, videos, questions',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'Topic notes create',
    method: 'POST',
    path: '/api/v1/admin/topics/:topicId/notes',
    description: 'Add a topic note.',
    dataSummary: 'note record',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'Topic notes delete',
    method: 'DELETE',
    path: '/api/v1/admin/topics/:topicId/notes/:noteId',
    description: 'Delete a topic note.',
    dataSummary: 'delete result',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'Topic videos create',
    method: 'POST',
    path: '/api/v1/admin/topics/:topicId/videos',
    description: 'Add a topic video.',
    dataSummary: 'video record',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'Topic videos delete',
    method: 'DELETE',
    path: '/api/v1/admin/topics/:topicId/videos/:videoId',
    description: 'Delete a topic video.',
    dataSummary: 'delete result',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'Topic questions create',
    method: 'POST',
    path: '/api/v1/admin/topics/:topicId/questions',
    description: 'Add a topic question item.',
    dataSummary: 'question record',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'Topic questions update',
    method: 'PATCH',
    path: '/api/v1/admin/topics/:topicId/questions/:questionId',
    description: 'Update a topic question item.',
    dataSummary: 'question record',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'Topic questions delete',
    method: 'DELETE',
    path: '/api/v1/admin/topics/:topicId/questions/:questionId',
    description: 'Delete a topic question item.',
    dataSummary: 'delete result',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'Subject question labels update',
    method: 'PUT',
    path: '/api/v1/admin/subjects/:id/question-labels',
    description: 'Update subject question labels.',
    dataSummary: 'labels result',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'Admin media upload',
    method: 'POST',
    path: '/api/v1/admin/media/upload',
    description: 'Upload media to storage.',
    dataSummary: 'media key',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  },
  {
    name: 'Admin media fetch',
    method: 'GET',
    path: '/api/v1/admin/media',
    description: 'Fetch media from storage.',
    dataSummary: 'media stream',
    isPublic: false,
    isSystem: false,
    roles: ['admin']
  }
];

export async function seedApiRegistry(db: D1Database): Promise<void> {
  for (const api of DEFAULT_APIS) {
    const exists = await db.prepare(`
      SELECT id FROM api_endpoints WHERE method = ? AND path = ? LIMIT 1
    `).bind(api.method, api.path).first();

    if (exists) {
      continue;
    }

    const id = crypto.randomUUID();
    await db.prepare(`
      INSERT INTO api_endpoints (id, name, method, path, description, data_summary, is_public, is_enabled, is_system)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)
    `).bind(
      id,
      api.name,
      api.method,
      api.path,
      api.description,
      api.dataSummary,
      api.isPublic ? 1 : 0,
      api.isSystem ? 1 : 0
    ).run();

    if (api.roles && api.roles.length > 0) {
      for (const role of api.roles) {
        await db.prepare(`
          INSERT INTO api_access_roles (id, endpoint_id, role, is_enabled)
          VALUES (?, ?, ?, 1)
        `).bind(crypto.randomUUID(), id, role).run();
      }
    }
  }
}
