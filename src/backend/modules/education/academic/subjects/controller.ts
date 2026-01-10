import type { Env } from '../../../../../shared/types';
import { apiHeaders, applyTeacherContentUpdate, ensureAdmin, getAuthPayload, recordEditHistory } from '../../../users/shared/utils';
import { readContent, writeContent } from './data';
import { subjectModules } from './registry';

const VIDEO_PREFIX = 'videos';

const buildContentPayload = (content: Record<string, unknown>) =>
  subjectModules.reduce((acc, module) => ({ ...acc, ...module.pickContentSlice(content) }), {} as Record<string, unknown>);

const mergeContentPayload = (payload: Record<string, unknown>) =>
  subjectModules.reduce((acc, module) => module.applyContentSlice(acc, payload), {} as Record<string, unknown>);

const handleVideoUpload = async (request: Request, env: Env) => {
  const payload = await getAuthPayload(request, env);
  if (!payload) {
    return Response.json({ success: false, error: 'Unauthorized' }, { status: 401, headers: apiHeaders });
  }
  if (!ensureAdmin(payload) && payload?.role !== 'teacher') {
    return Response.json({ success: false, error: 'Admin or teacher access required.' }, { status: 403, headers: apiHeaders });
  }
  const formData = await request.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) {
    return Response.json({ success: false, error: 'Video file is required.' }, { status: 400, headers: apiHeaders });
  }

  const arrayBuffer = await file.arrayBuffer();
  const fileKey = `${VIDEO_PREFIX}/${crypto.randomUUID()}-${file.name}`;
  const contentType = file.type || 'application/octet-stream';

  await env.BUCKET.put(fileKey, arrayBuffer, {
    httpMetadata: {
      contentType,
    },
  });

  return Response.json(
    {
      success: true,
      fileKey,
      url: `/api/videos/${encodeURIComponent(fileKey)}`,
    },
    { headers: apiHeaders }
  );
};

const handleVideoGet = async (env: Env, rawKey: string) => {
  const fileKey = decodeURIComponent(rawKey);
  if (!fileKey || !fileKey.startsWith(`${VIDEO_PREFIX}/`)) {
    return Response.json({ success: false, error: 'Invalid video key.' }, { status: 400, headers: apiHeaders });
  }
  const object = await env.BUCKET.get(fileKey);
  if (!object) {
    return Response.json({ success: false, error: 'Video not found.' }, { status: 404, headers: apiHeaders });
  }
  const headers = new Headers(apiHeaders);
  headers.set('Content-Type', object.httpMetadata?.contentType || 'application/octet-stream');
  headers.set('Cache-Control', 'public, max-age=3600');
  return new Response(object.body, { headers });
};

export const handleContent = async (request: Request, env: Env, path: string): Promise<Response | null> => {
  if (path !== '/api/content') return null;

  if (request.method === 'GET') {
    const content = await readContent(env);
    const payload = buildContentPayload(content);
    return Response.json({ success: true, content: payload }, { headers: apiHeaders });
  }

  if (request.method === 'PUT') {
    const payload = await getAuthPayload(request, env);
    if (!payload) return Response.json({ success: false, error: 'Unauthorized' }, { status: 401, headers: apiHeaders });
    const body = await request.json().catch(() => ({}));
    if (!body || typeof body !== 'object') {
      return Response.json({ success: false, error: 'Invalid content payload.' }, { status: 400, headers: apiHeaders });
    }

    const sanitizedPayload = mergeContentPayload(body as Record<string, unknown>);

    if (ensureAdmin(payload)) {
      await writeContent(env, sanitizedPayload);
      await recordEditHistory(env.DB, payload, 'Content updated', { scope: 'admin' });
      return Response.json({ success: true }, { headers: apiHeaders });
    }

    if (payload.role === 'teacher') {
      if (!payload.assignment) {
        return Response.json({ success: false, error: 'Assignment missing.' }, { status: 400, headers: apiHeaders });
      }
      const canEditStructure = Array.isArray(payload.permissions) && payload.permissions.includes('structure');
      const existingContent = await readContent(env);
      const updatedContent = applyTeacherContentUpdate(
        existingContent,
        sanitizedPayload,
        payload.assignment,
        canEditStructure
      );
      if (!updatedContent) {
        return Response.json({ success: false, error: 'Subject is not configured for updates.' }, { status: 400, headers: apiHeaders });
      }
      await writeContent(env, updatedContent);
      await recordEditHistory(env.DB, payload, 'Content updated', {
        scope: 'teacher',
        level: payload.assignment.level,
        subject: payload.assignment.subject,
      });
      return Response.json({ success: true }, { headers: apiHeaders });
    }

    return Response.json({ success: false, error: 'Unauthorized' }, { status: 401, headers: apiHeaders });
  }

  return null;
};

export const handleVideos = async (request: Request, env: Env, path: string): Promise<Response | null> => {
  if (path === '/api/videos' && request.method === 'POST') {
    return handleVideoUpload(request, env);
  }

  if (path.startsWith('/api/videos/') && request.method === 'GET') {
    return handleVideoGet(env, path.replace('/api/videos/', ''));
  }

  return null;
};
