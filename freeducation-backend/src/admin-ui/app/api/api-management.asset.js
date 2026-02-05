import { requestJson } from './client.js';

export async function listApiEndpoints() {
  return await requestJson('/api/v1/admin/api/endpoints', { credentials: 'include' }, 'Failed to load APIs');
}

export async function getApiEndpoint(id) {
  return await requestJson(`/api/v1/admin/api/endpoints/${id}`, { credentials: 'include' }, 'Failed to load API');
}

export async function updateApiEndpoint(id, payload) {
  return await requestJson(`/api/v1/admin/api/endpoints/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  }, 'Failed to update API');
}

export async function createApiKey(endpointId, label) {
  return await requestJson(`/api/v1/admin/api/endpoints/${endpointId}/keys`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ label })
  }, 'Failed to create key');
}

export async function updateApiKey(keyId, payload) {
  return await requestJson(`/api/v1/admin/api/keys/${keyId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  }, 'Failed to update key');
}

export async function rotateApiKey(keyId) {
  return await requestJson(`/api/v1/admin/api/keys/${keyId}/rotate`, {
    method: 'POST',
    credentials: 'include'
  }, 'Failed to rotate key');
}

export async function deleteApiKey(keyId) {
  return await requestJson(`/api/v1/admin/api/keys/${keyId}`, {
    method: 'DELETE',
    credentials: 'include'
  }, 'Failed to delete key');
}
