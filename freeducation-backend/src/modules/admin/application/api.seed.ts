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
  }
];

export async function seedApiRegistry(db: D1Database): Promise<void> {
  const existing = await db.prepare('SELECT COUNT(*) as count FROM api_endpoints').first();
  if (Number(existing?.count || 0) > 0) {
    return;
  }

  for (const api of DEFAULT_APIS) {
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
