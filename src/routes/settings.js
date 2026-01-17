// Settings and system management API routes

import { authenticate, requireAdmin, defaultHeaders, logUserAction } from '../auth/auth.js';

export const settingsRoutes = {
  // System status check
  '/api/system/status': async (request, env, ctx) => {
    if (request.method !== 'GET') return null;

    const adminCount = await env.DB.prepare("SELECT count(*) as count FROM users WHERE role = 'admin'").first();
    const legacyAdminCount = await env.DB.prepare("SELECT count(*) as count FROM admins").first();
    const initialized = Number(adminCount?.count || 0) > 0 || Number(legacyAdminCount?.count || 0) > 0;

    return Response.json({ initialized }, { headers: defaultHeaders });
  },

  // System initialization
  '/api/system/init': async (request, env, ctx) => {
    if (request.method !== 'POST') return null;

    // Import migrateDatabase function
    const { migrateDatabase } = await import('../db/database.js');
    await migrateDatabase(env);

    const adminCount = await env.DB.prepare("SELECT count(*) as count FROM users WHERE role = 'admin'").first();
    if (Number(adminCount?.count || 0) > 0) {
      return Response.json({ success: false, error: "System already initialized" }, { status: 403, headers: defaultHeaders });
    }

    const { adminName, email, password, confirmPassword } = await request.json().catch(() => ({}));
    const trimmedName = String(adminName || "").trim();
    const normalizedEmail = email.toLowerCase().trim();
    const trimmedPassword = String(password || "");
    const trimmedConfirmPassword = String(confirmPassword || "");

    if (!trimmedName || !normalizedEmail || !trimmedPassword || !trimmedConfirmPassword) {
      return Response.json({ success: false, error: "All fields are required." }, { status: 400, headers: defaultHeaders });
    }

    if (trimmedPassword.length < 8) {
      return Response.json({ success: false, error: "Password must be at least 8 characters." }, { status: 400, headers: defaultHeaders });
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      return Response.json({ success: false, error: "Passwords do not match." }, { status: 400, headers: defaultHeaders });
    }

    // Hash password
    const encoder = new TextEncoder();
    const data = encoder.encode(trimmedPassword + "salt");
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    const passwordHash = `sha256:${hashHex}`;

    const result = await env.DB.prepare("INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)")
      .bind(normalizedEmail, passwordHash, "admin").run();

    if (result.success) {
      const newAdminId = result.meta.last_row_id;
      
      await env.DB.batch([
        env.DB.prepare("INSERT INTO user_profiles (user_id, username, name) VALUES (?, ?, ?)")
          .bind(newAdminId, normalizedEmail, trimmedName),
        env.DB.prepare("INSERT INTO admin_permissions (user_id, permissions) VALUES (?, ?)")
          .bind(newAdminId, JSON.stringify(["dashboard", "classes", "settings", "thumbnails", "userManagement"])),
        env.DB.prepare("INSERT INTO admins (username, password_hash) VALUES (?, ?)")
          .bind(normalizedEmail, passwordHash)
      ]);

      return Response.json({ success: true }, { headers: defaultHeaders });
    }

    return Response.json({ success: false, error: "Admin creation failed." }, { status: 500, headers: defaultHeaders });
  },

  // Reset settings
  '/api/settings/reset': async (request, env, ctx) => {
    const user = await authenticate(request, env);
    if (!requireAdmin(user)) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: defaultHeaders });
    }

    if (request.method !== 'POST') return null;

    const body = await request.json().catch(() => ({}));
    if (!body || body.confirm !== true) {
      return Response.json({ success: false, error: "Confirmation required." }, { status: 400, headers: defaultHeaders });
    }

    // Collect file keys to delete from storage
    const fontKeys = ((await env.DB.prepare("SELECT file_key FROM fonts").all()).results || [])
      .map(row => row.file_key)
      .filter(key => typeof key === "string" && key.length > 0);

    const subjectThumbnailKeys = ((await env.DB.prepare("SELECT file_key FROM subject_thumbnails").all()).results || [])
      .map(row => row.file_key)
      .filter(key => typeof key === "string" && key.length > 0);

    const chapterThumbnailKeys = ((await env.DB.prepare("SELECT file_key FROM chapter_thumbnails").all()).results || [])
      .map(row => row.file_key)
      .filter(key => typeof key === "string" && key.length > 0);

    const allKeys = [...fontKeys, ...subjectThumbnailKeys, ...chapterThumbnailKeys];

    // Delete files from R2 storage
    for (const key of allKeys) {
      try {
        await env.STORAGE.delete(key);
      } catch (error) {
        console.warn(`Failed to delete file ${key}:`, error);
      }
    }

    // Clear database tables
    await env.DB.batch([
      env.DB.prepare("DELETE FROM fonts"),
      env.DB.prepare("DELETE FROM subject_thumbnails"),
      env.DB.prepare("DELETE FROM chapter_thumbnails"),
      env.DB.prepare("DELETE FROM content_store")
    ]);

    await logUserAction(env.DB, user.id, "Settings reset", { filesDeleted: allKeys.length });

    return Response.json({ success: true }, { headers: defaultHeaders });
  },

  // Hard reset (complete system wipe)
  '/api/settings/hard-reset': async (request, env, ctx) => {
    const user = await authenticate(request, env);
    if (!requireAdmin(user)) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: defaultHeaders });
    }

    if (request.method !== 'POST') return null;

    const { password } = await request.json();
    
    // Verify admin password
    const adminInfo = await env.DB.prepare("SELECT password_hash FROM users WHERE id = ?").bind(user.id).first();
    if (!adminInfo) {
      return Response.json({ success: false, error: "Admin not found" }, { status: 401, headers: defaultHeaders });
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(password + "salt");
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    const computedHash = `sha256:${hashHex}`;

    const [algorithm, storedHash] = adminInfo.password_hash.split(':');
    if (computedHash !== adminInfo.password_hash) {
      return Response.json({ success: false, error: "Incorrect password" }, { status: 401, headers: defaultHeaders });
    }

    // Get all file keys before deletion
    const fontKeys = ((await env.DB.prepare("SELECT file_key FROM fonts").all()).results || [])
      .map(row => row.file_key)
      .filter(key => typeof key === "string" && key.length > 0);

    const subjectThumbnailKeys = ((await env.DB.prepare("SELECT file_key FROM subject_thumbnails").all()).results || [])
      .map(row => row.file_key)
      .filter(key => typeof key === "string" && key.length > 0);

    const chapterThumbnailKeys = ((await env.DB.prepare("SELECT file_key FROM chapter_thumbnails").all()).results || [])
      .map(row => row.file_key)
      .filter(key => typeof key === "string" && key.length > 0);

    const allKeys = [...fontKeys, ...subjectThumbnailKeys, ...chapterThumbnailKeys];

    // Delete all files from storage
    for (const key of allKeys) {
      try {
        await env.STORAGE.delete(key);
      } catch (error) {
        console.warn(`Failed to delete file ${key}:`, error);
      }
    }

    // Get all table names
    const tables = await env.DB.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    const tableNames = (tables.results || []).map(table => table.name);

    // Clear all data except system tables
    const userTables = tableNames.filter(name => 
      !name.startsWith('sqlite_') && 
      name !== 'd1_migrations'
    );

    for (const tableName of userTables) {
      try {
        await env.DB.prepare(`DELETE FROM ${tableName}`).run();
      } catch (error) {
        console.warn(`Failed to clear table ${tableName}:`, error);
      }
    }

    await logUserAction(env.DB, user.id, "Hard reset performed", { tablesCleared: userTables.length });

    return Response.json({ success: true }, { headers: defaultHeaders });
  },

  // Get fonts
  '/api/fonts': async (request, env, ctx) => {
    if (request.method !== 'GET') return null;

    const fonts = await env.DB.prepare("SELECT name, file_key, content_type, original_name FROM fonts").all();

    const fontsWithUrls = (fonts.results || []).map(font => ({
      name: font.name,
      url: font.file_key ? `/api/font/${font.file_key}` : null,
      contentType: font.content_type,
      originalName: font.original_name
    }));

    return Response.json(fontsWithUrls, { 
      headers: { ...defaultHeaders, "Cache-Control": "public, max-age=3600" } 
    });
  },

  // Upload font
  '/api/fonts': async (request, env, ctx) => {
    const user = await authenticate(request, env);
    if (!requireAdmin(user)) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: defaultHeaders });
    }

    if (request.method !== 'POST') return null;

    const formData = await request.formData();
    const file = formData.get('file');
    const name = formData.get('name');

    if (!file || !(file instanceof File)) {
      return Response.json({ success: false, error: "Font file is required." }, { status: 400, headers: defaultHeaders });
    }

    const fontName = String(name || file.name).trim();
    const fileKey = `fonts/${Date.now()}-${file.name}`;
    const contentType = file.type;

    // Upload to R2 storage
    await env.STORAGE.put(fileKey, file.stream(), {
      contentType,
      httpMetadata: { contentType }
    });

    // Save to database
    await env.DB.prepare(`
      INSERT INTO fonts (name, file_key, content_type, original_name) 
      VALUES (?, ?, ?, ?)
    `).bind(fontName, fileKey, contentType, file.name).run();

    await logUserAction(env.DB, user.id, "Font uploaded", { name: fontName, fileKey });

    return Response.json({ success: true }, { headers: defaultHeaders });
  },

  // Get font file
  '/api/font/:fileKey': async (request, env, ctx) => {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const fileKey = pathParts[pathParts.length - 1];

    if (!fileKey) {
      return Response.json({ success: false, error: "File key is required." }, { status: 400, headers: defaultHeaders });
    }

    const font = await env.DB.prepare("SELECT content_type FROM fonts WHERE file_key = ?").bind(fileKey).first();
    
    if (!font) {
      return Response.json({ success: false, error: "Font not found." }, { status: 404, headers: defaultHeaders });
    }

    try {
      const object = await env.STORAGE.get(fileKey);
      if (!object) {
        return Response.json({ success: false, error: "Font file not found." }, { status: 404, headers: defaultHeaders });
      }

      return new Response(object.body, {
        headers: {
          'Content-Type': font.content_type || 'font/woff2',
          'Cache-Control': 'public, max-age=31536000', // 1 year
          ...Object.fromEntries(Object.entries(defaultHeaders).filter(([key]) => 
            !['Content-Type'].includes(key)
          ))
        }
      });
    } catch (error) {
      return Response.json({ success: false, error: "Failed to retrieve font." }, { status: 500, headers: defaultHeaders });
    }
  }
};
