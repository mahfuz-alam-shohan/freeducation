import { requestJson } from './client.js';

export async function uploadMedia(file, folder) {
  const form = new FormData();
  form.append('file', file);
  if (folder) {
    form.append('folder', folder);
  }

  return await requestJson('/api/v1/admin/media/upload', {
    method: 'POST',
    credentials: 'include',
    body: form
  }, 'Failed to upload media');
}
