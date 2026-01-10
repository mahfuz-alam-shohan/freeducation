import type { Env } from '../../../../shared/types';
import { apiHeaders, clampZoom, ensureAdmin, getAuthPayload, isValidKey, recordEditHistory } from '../../../core/users/shared/utils';

type ThumbnailConfig = {
  table: 'subject_thumbnails' | 'chapter_thumbnails';
  keyColumn: 'subject_key' | 'chapter_key';
  keyField: 'subjectKey' | 'chapterKey';
  urlPrefix: '/api/thumbnails' | '/api/chapter-thumbnails';
  bucketPrefix: 'thumbnails' | 'chapter-thumbnails';
  includeZoom: boolean;
};

const subjectThumbnailConfig: ThumbnailConfig = {
  table: 'subject_thumbnails',
  keyColumn: 'subject_key',
  keyField: 'subjectKey',
  urlPrefix: '/api/thumbnails',
  bucketPrefix: 'thumbnails',
  includeZoom: true,
};

const chapterThumbnailConfig: ThumbnailConfig = {
  table: 'chapter_thumbnails',
  keyColumn: 'chapter_key',
  keyField: 'chapterKey',
  urlPrefix: '/api/chapter-thumbnails',
  bucketPrefix: 'chapter-thumbnails',
  includeZoom: false,
};

const getThumbnailVersion = (row: any) => (row?.updated_at ? new Date(row.updated_at as string).getTime() : Date.now());

const handleThumbnailList = async (env: Env, config: ThumbnailConfig) => {
  const columns = config.includeZoom ? `${config.keyColumn}, zoom, updated_at` : `${config.keyColumn}, updated_at`;
  const rows = await env.DB.prepare(`SELECT ${columns} FROM ${config.table} ORDER BY updated_at DESC`).all();
  const thumbnails = (rows.results || []).map((row: any) => {
    const version = getThumbnailVersion(row);
    const keyValue = row[config.keyColumn];
    return {
      [config.keyField]: keyValue,
      ...(config.includeZoom ? { zoom: typeof row.zoom === 'number' ? row.zoom : 1 } : {}),
      url: `${config.urlPrefix}/${keyValue}?v=${version}`,
    };
  });
  return Response.json({ thumbnails }, { headers: apiHeaders });
};

const handleThumbnailUpload = async (request: Request, env: Env, config: ThumbnailConfig) => {
  const payload = await getAuthPayload(request, env);
  if (!payload) return Response.json({ success: false, error: 'Unauthorized' }, { status: 401, headers: apiHeaders });
  if (!ensureAdmin(payload)) {
    return Response.json({ success: false, error: 'Admin access required.' }, { status: 403, headers: apiHeaders });
  }
  const formData = await request.formData();
  const keyValue = String(formData.get(config.keyField) || '').trim().toLowerCase();
  if (!keyValue || !isValidKey(keyValue)) {
    return Response.json(
      { success: false, error: `Invalid ${config.keyField.replace('Key', ' key')}.` },
      { status: 400, headers: apiHeaders }
    );
  }
  const zoomValue = config.includeZoom ? clampZoom(Number(formData.get('zoom'))) : null;
  const file = formData.get('file');
  const existing = await env.DB.prepare(
    `SELECT file_key, content_type${config.includeZoom ? ', zoom' : ''} FROM ${config.table} WHERE ${config.keyColumn} = ?`
  )
    .bind(keyValue)
    .first();

  if (!(file instanceof File) && !existing) {
    return Response.json({ success: false, error: 'Thumbnail file is required.' }, { status: 400, headers: apiHeaders });
  }

  let fileKey = existing?.file_key as string | undefined;
  let contentType = existing?.content_type as string | undefined;

  if (file instanceof File) {
    const arrayBuffer = await file.arrayBuffer();
    fileKey = `${config.bucketPrefix}/${keyValue}-${crypto.randomUUID()}-${file.name}`;
    contentType = file.type || 'application/octet-stream';
    await env.BUCKET.put(fileKey, arrayBuffer, {
      httpMetadata: {
        contentType,
      },
    });
    if (existing?.file_key) {
      await env.BUCKET.delete(existing.file_key as string);
    }
  }

  const insertColumns = config.includeZoom
    ? `${config.keyColumn}, file_key, content_type, zoom, updated_at`
    : `${config.keyColumn}, file_key, content_type, updated_at`;
  const insertValues = config.includeZoom ? '?, ?, ?, ?, CURRENT_TIMESTAMP' : '?, ?, ?, CURRENT_TIMESTAMP';
  const updateColumns = config.includeZoom
    ? 'file_key = excluded.file_key, content_type = excluded.content_type, zoom = excluded.zoom, updated_at = CURRENT_TIMESTAMP'
    : 'file_key = excluded.file_key, content_type = excluded.content_type, updated_at = CURRENT_TIMESTAMP';
  const statement = env.DB.prepare(
    `INSERT INTO ${config.table} (${insertColumns}) VALUES (${insertValues}) ON CONFLICT(${config.keyColumn}) DO UPDATE SET ${updateColumns}`
  );
  const bindValues = config.includeZoom ? [keyValue, fileKey, contentType, zoomValue] : [keyValue, fileKey, contentType];
  await statement.bind(...bindValues).run();

  await recordEditHistory(env.DB, payload, 'Thumbnail updated', {
    key: keyValue,
    type: config.table,
  });

  const cacheBuster = Date.now();
  return Response.json(
    {
      success: true,
      thumbnail: {
        [config.keyField]: keyValue,
        ...(config.includeZoom ? { zoom: zoomValue } : {}),
        url: `${config.urlPrefix}/${keyValue}?v=${cacheBuster}`,
      },
    },
    { headers: apiHeaders }
  );
};

const handleThumbnailGet = async (env: Env, config: ThumbnailConfig, rawKey: string) => {
  const keyValue = decodeURIComponent(rawKey).toLowerCase();
  if (!keyValue || !isValidKey(keyValue)) {
    return Response.json(
      { success: false, error: `Invalid ${config.keyField.replace('Key', ' key')}.` },
      { status: 400, headers: apiHeaders }
    );
  }
  const thumbnail = await env.DB.prepare(`SELECT file_key, content_type FROM ${config.table} WHERE ${config.keyColumn} = ?`)
    .bind(keyValue)
    .first();
  if (!thumbnail) {
    return Response.json({ success: false, error: 'Thumbnail not found.' }, { status: 404, headers: apiHeaders });
  }
  const object = await env.BUCKET.get(thumbnail.file_key as string);
  if (!object) {
    return Response.json({ success: false, error: 'Thumbnail file missing.' }, { status: 404, headers: apiHeaders });
  }
  const headers = new Headers(apiHeaders);
  headers.set('Content-Type', (thumbnail.content_type as string) || 'application/octet-stream');
  headers.set('Cache-Control', 'public, max-age=86400');
  return new Response(object.body, { headers });
};

export const handleThumbnails = async (request: Request, env: Env, path: string): Promise<Response | null> => {
  if (path.startsWith('/api/thumbnails')) {
    if (path === '/api/thumbnails' && request.method === 'GET') {
      return handleThumbnailList(env, subjectThumbnailConfig);
    }

    if (path === '/api/thumbnails' && request.method === 'POST') {
      return handleThumbnailUpload(request, env, subjectThumbnailConfig);
    }

    if (path.startsWith('/api/thumbnails/') && request.method === 'GET') {
      return handleThumbnailGet(env, subjectThumbnailConfig, path.replace('/api/thumbnails/', ''));
    }
  }

  if (path.startsWith('/api/chapter-thumbnails')) {
    if (path === '/api/chapter-thumbnails' && request.method === 'GET') {
      return handleThumbnailList(env, chapterThumbnailConfig);
    }

    if (path === '/api/chapter-thumbnails' && request.method === 'POST') {
      return handleThumbnailUpload(request, env, chapterThumbnailConfig);
    }

    if (path.startsWith('/api/chapter-thumbnails/') && request.method === 'GET') {
      return handleThumbnailGet(env, chapterThumbnailConfig, path.replace('/api/chapter-thumbnails/', ''));
    }
  }

  return null;
};
