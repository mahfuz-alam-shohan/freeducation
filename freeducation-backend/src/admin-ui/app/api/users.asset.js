import { requestJson } from './client.js';

export async function listUsers() {
  return await requestJson('/api/v1/users?limit=50&offset=0', { credentials: 'include' }, 'Failed to load users');
}

export async function createUser(payload) {
  return await requestJson('/api/v1/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  }, 'Failed to create user');
}

export async function updateUser(id, payload) {
  return await requestJson(`/api/v1/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  }, 'Failed to update user');
}
