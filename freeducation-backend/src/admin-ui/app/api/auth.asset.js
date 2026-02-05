import { requestJson, requestVoid } from './client.js';

export async function getSession() {
  const res = await fetch('/api/v1/admin/session', { credentials: 'include' });
  if (!res.ok) return null;
  const data = await res.json();
  return data.success ? data : null;
}

export async function bootstrap(payload) {
  return await requestJson('/api/v1/admin/bootstrap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }, 'Failed to create admin');
}

export async function bootstrapStatus() {
  return await requestJson('/api/v1/admin/bootstrap/status', {}, 'Failed to check bootstrap status');
}

export async function login(payload) {
  return await requestJson('/api/v1/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  }, 'Login failed');
}

export async function logout() {
  await requestVoid('/api/v1/admin/logout', {
    method: 'POST',
    credentials: 'include'
  });
}
