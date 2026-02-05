import type { Router, Handler, RequestContext } from '../../../shared/kernel/router';
import { jsonResponse } from '../../../shared/kernel/http';

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

async function uploadFile(ctx: RequestContext): Promise<Response> {
  if (!ctx.env.BUCKET) {
    return jsonResponse(500, { success: false, error: 'Storage bucket not configured' });
  }

  const form = await ctx.request.formData();
  const file = form.get('file');
  if (!(file instanceof File)) {
    return jsonResponse(400, { success: false, error: 'File is required' });
  }

  const folder = String(form.get('folder') || 'uploads');
  const safeName = sanitizeFileName(file.name || 'file');
  const key = `${folder}/${crypto.randomUUID()}-${safeName}`;

  await ctx.env.BUCKET.put(key, file.stream(), {
    httpMetadata: { contentType: file.type || 'application/octet-stream' }
  });

  return jsonResponse(200, {
    success: true,
    data: {
      key,
      url: `/api/v1/admin/media?key=${encodeURIComponent(key)}`
    }
  });
}

async function getFile(ctx: RequestContext): Promise<Response> {
  if (!ctx.env.BUCKET) {
    return jsonResponse(500, { success: false, error: 'Storage bucket not configured' });
  }

  const key = ctx.query.get('key');
  if (!key) {
    return jsonResponse(400, { success: false, error: 'Key is required' });
  }

  const object = await ctx.env.BUCKET.get(key);
  if (!object) {
    return jsonResponse(404, { success: false, error: 'File not found' });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('Cache-Control', 'public, max-age=3600');

  return new Response(object.body, { status: 200, headers });
}

export function registerMediaRoutes(router: Router, adminGuard: (handler: Handler) => Handler): void {
  router.add('POST', '/api/v1/admin/media/upload', adminGuard((ctx) => uploadFile(ctx)));
  router.add('GET', '/api/v1/admin/media', adminGuard((ctx) => getFile(ctx)));
}
