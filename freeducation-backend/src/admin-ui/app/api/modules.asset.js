import { requestJson } from './client.js';

export async function listModuleCategories() {
  return await requestJson('/api/v1/admin/modules/categories', { credentials: 'include' }, 'Failed to load module categories');
}

export async function listSubjectModules() {
  return await requestJson('/api/v1/admin/modules/subjects', { credentials: 'include' }, 'Failed to load subject skeletons');
}

export async function getSubjectModule(id) {
  return await requestJson(`/api/v1/admin/modules/subjects/${id}`, { credentials: 'include' }, 'Failed to load subject skeleton');
}
