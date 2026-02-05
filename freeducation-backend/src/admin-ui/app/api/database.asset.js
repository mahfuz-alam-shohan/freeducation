import { requestJson } from './client.js';

export async function listTables() {
  return await requestJson('/api/v1/admin/db/tables', { credentials: 'include' }, 'Failed to load tables');
}

export async function getTable(name) {
  return await requestJson(`/api/v1/admin/db/table/${name}?limit=50&offset=0`, { credentials: 'include' }, 'Failed to load table');
}

export async function deleteRow(table, primaryKey, value) {
  return await requestJson(`/api/v1/admin/db/table/${table}/row`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ primaryKey, value })
  }, 'Failed to delete row');
}

export async function truncateTable(table) {
  return await requestJson(`/api/v1/admin/db/table/${table}/truncate`, {
    method: 'POST',
    credentials: 'include'
  }, 'Failed to truncate table');
}

export async function dropTable(table) {
  return await requestJson(`/api/v1/admin/db/table/${table}`, {
    method: 'DELETE',
    credentials: 'include'
  }, 'Failed to drop table');
}

export async function reconcileSchema() {
  return await requestJson('/api/v1/admin/maintenance/reconcile', {
    method: 'POST',
    credentials: 'include'
  }, 'Maintenance failed');
}
