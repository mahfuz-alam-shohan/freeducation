// Media upload and thumbnail management API routes

import { authenticate, defaultHeaders, logUserAction } from '../auth/auth.js';

export const mediaRoutes = {
  // Upload videos/files
  '/api/videos': async (request, env, ctx) => {
    const user = await authenticate(request, env);
    if (!user) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: defaultHeaders });
    }

    if (request.method !== 'POST') return null;

    try {
      const formData = await request.formData();
      const file = formData.get('file');
      
      if (!file || !(file instanceof File)) {
        return Response.json({ success: false, error: "No file provided" }, { status: 400, headers: defaultHeaders });
      }

      // Generate unique file key
      const fileKey = `videos/${Date.now()}-${file.name}`;
      
      // Upload to R2 storage
      await env.STORAGE.put(fileKey, file.stream(), {
        contentType: file.type,
        httpMetadata: { contentType: file.type }
      });

      const url = `https://pub-${env.STORAGE_BUCKET_ID}.r2.dev/${fileKey}`;

      await logUserAction(env.DB, user.id, "Video uploaded", { fileKey, fileName: file.name });

      return Response.json({
        success: true,
        url,
        fileKey
      }, { headers: defaultHeaders });

    } catch (error) {
      console.error('Upload error:', error);
      return Response.json({ success: false, error: "Upload failed" }, { status: 500, headers: defaultHeaders });
    }
  },

  // Get subject thumbnails
  '/api/thumbnails': async (request, env, ctx) => {
    if (request.method !== 'GET') return null;

    try {
      const thumbnails = await env.DB.prepare(`
        SELECT subject_key as subjectKey, file_key as fileKey, content_type as contentType, zoom
        FROM subject_thumbnails
      `).all();

      const thumbnailsWithUrls = (thumbnails.results || []).map(thumb => ({
        subjectKey: thumb.subjectKey,
        url: thumb.fileKey ? `https://pub-${env.STORAGE_BUCKET_ID}.r2.dev/${thumb.fileKey}` : null,
        contentType: thumb.contentType,
        zoom: thumb.zoom
      }));

      return Response.json(thumbnailsWithUrls, { 
        headers: { ...defaultHeaders, "Cache-Control": "public, max-age=3600" } 
      });

    } catch (error) {
      console.error('Thumbnails fetch error:', error);
      return Response.json({ success: false, error: "Failed to fetch thumbnails" }, { status: 500, headers: defaultHeaders });
    }
  },

  // Get chapter thumbnails
  '/api/chapter-thumbnails': async (request, env, ctx) => {
    if (request.method !== 'GET') return null;

    try {
      const thumbnails = await env.DB.prepare(`
        SELECT chapter_key as chapterKey, file_key as fileKey, content_type as contentType
        FROM chapter_thumbnails
      `).all();

      const thumbnailsWithUrls = (thumbnails.results || []).map(thumb => ({
        chapterKey: thumb.chapterKey,
        url: thumb.fileKey ? `https://pub-${env.STORAGE_BUCKET_ID}.r2.dev/${thumb.fileKey}` : null,
        contentType: thumb.contentType
      }));

      return Response.json(thumbnailsWithUrls, { 
        headers: { ...defaultHeaders, "Cache-Control": "public, max-age=3600" } 
      });

    } catch (error) {
      console.error('Chapter thumbnails fetch error:', error);
      return Response.json({ success: false, error: "Failed to fetch chapter thumbnails" }, { status: 500, headers: defaultHeaders });
    }
  },

  // Upload chapter thumbnail
  '/api/chapter-thumbnails': async (request, env, ctx) => {
    const user = await authenticate(request, env);
    if (!user) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: defaultHeaders });
    }

    if (request.method !== 'POST') return null;

    try {
      const formData = await request.formData();
      const file = formData.get('file');
      const chapterKey = formData.get('chapterKey');
      
      if (!file || !(file instanceof File) || !chapterKey) {
        return Response.json({ success: false, error: "File and chapter key are required" }, { status: 400, headers: defaultHeaders });
      }

      // Generate unique file key
      const fileKey = `chapter-thumbnails/${Date.now()}-${file.name}`;
      
      // Upload to R2 storage
      await env.STORAGE.put(fileKey, file.stream(), {
        contentType: file.type,
        httpMetadata: { contentType: file.type }
      });

      // Save to database
      await env.DB.prepare(`
        INSERT INTO chapter_thumbnails (chapter_key, file_key, content_type) 
        VALUES (?, ?, ?) 
        ON CONFLICT(chapter_key) DO UPDATE SET 
          file_key = excluded.file_key, 
          content_type = excluded.content_type, 
          updated_at = CURRENT_TIMESTAMP
      `).bind(chapterKey, fileKey, file.type).run();

      const url = `https://pub-${env.STORAGE_BUCKET_ID}.r2.dev/${fileKey}`;

      await logUserAction(env.DB, user.id, "Chapter thumbnail uploaded", { chapterKey, fileKey });

      return Response.json({
        success: true,
        thumbnail: {
          chapterKey,
          url,
          fileKey
        }
      }, { headers: defaultHeaders });

    } catch (error) {
      console.error('Chapter thumbnail upload error:', error);
      return Response.json({ success: false, error: "Upload failed" }, { status: 500, headers: defaultHeaders });
    }
  },

  // Upload subject thumbnail
  '/api/subject-thumbnails': async (request, env, ctx) => {
    const user = await authenticate(request, env);
    if (!user) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: defaultHeaders });
    }

    if (request.method !== 'POST') return null;

    try {
      const formData = await request.formData();
      const file = formData.get('file');
      const subjectKey = formData.get('subjectKey');
      const zoom = formData.get('zoom') ? parseFloat(formData.get('zoom')) : 1.0;
      
      if (!file || !(file instanceof File) || !subjectKey) {
        return Response.json({ success: false, error: "File and subject key are required" }, { status: 400, headers: defaultHeaders });
      }

      // Generate unique file key
      const fileKey = `subject-thumbnails/${Date.now()}-${file.name}`;
      
      // Upload to R2 storage
      await env.STORAGE.put(fileKey, file.stream(), {
        contentType: file.type,
        httpMetadata: { contentType: file.type }
      });

      // Save to database
      await env.DB.prepare(`
        INSERT INTO subject_thumbnails (subject_key, file_key, content_type, zoom) 
        VALUES (?, ?, ?, ?) 
        ON CONFLICT(subject_key) DO UPDATE SET 
          file_key = excluded.file_key, 
          content_type = excluded.content_type, 
          zoom = excluded.zoom,
          updated_at = CURRENT_TIMESTAMP
      `).bind(subjectKey, fileKey, file.type, zoom).run();

      const url = `https://pub-${env.STORAGE_BUCKET_ID}.r2.dev/${fileKey}`;

      await logUserAction(env.DB, user.id, "Subject thumbnail uploaded", { subjectKey, fileKey, zoom });

      return Response.json({
        success: true,
        thumbnail: {
          subjectKey,
          url,
          fileKey,
          zoom
        }
      }, { headers: defaultHeaders });

    } catch (error) {
      console.error('Subject thumbnail upload error:', error);
      return Response.json({ success: false, error: "Upload failed" }, { status: 500, headers: defaultHeaders });
    }
  }
};
