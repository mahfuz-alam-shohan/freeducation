import { createServer, type Server } from 'node:http'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { httpSource } from './http.js'
import { createClient } from '../source.js'
import { fixtures } from '../../testing/fixtures/index.js'

/** Records what the adapter actually sent, so URL and header construction is verified. */
interface Received { url: string; headers: Record<string, string | string[] | undefined> }

let server: Server
let baseUrl: string
let lastRequest: Received | undefined
let respondWith: { status: number; body: unknown; delayMs?: number } = { status: 200, body: {} }

beforeAll(async () => {
  server = createServer((request, response) => {
    lastRequest = { url: request.url ?? '', headers: request.headers }
    const send = () => {
      response.writeHead(respondWith.status, { 'content-type': 'application/json' })
      response.end(JSON.stringify(respondWith.body))
    }
    if (respondWith.delayMs) setTimeout(send, respondWith.delayMs)
    else send()
  })

  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
  const address = server.address()
  if (typeof address === 'string' || address === null) throw new Error('no port')
  baseUrl = `http://127.0.0.1:${address.port}/api`
})

afterAll(async () => {
  await new Promise<void>(resolve => server.close(() => resolve()))
})

const source = (overrides = {}) =>
  httpSource({ baseUrl, apiKey: 'test-key', tenant: 'demo-school', ...overrides })

describe('httpSource', () => {
  it('builds the endpoint path for a key', async () => {
    respondWith = { status: 200, body: fixtures.profile }
    await source().fetch('site.profile', {})
    expect(lastRequest?.url).toBe('/api/site/profile')
  })

  it('substitutes path parameters rather than sending them as query values', async () => {
    respondWith = { status: 200, body: fixtures.notices[0] }
    await source().fetch('notice.bySlug', { slug: 'admission-2026' })
    expect(lastRequest?.url).toBe('/api/notices/admission-2026')
  })

  it('URL-encodes path parameters', async () => {
    respondWith = { status: 200, body: null }
    await source().fetch('notice.bySlug', { slug: 'a b/c' })
    expect(lastRequest?.url).toBe('/api/notices/a%20b%2Fc')
  })

  it('sends remaining parameters as query values', async () => {
    respondWith = { status: 200, body: { items: [], page: 1, pageSize: 20, total: 0 } }
    await source().fetch('notice.list', { category: 'academic', page: 2, pageSize: 20 })
    expect(lastRequest?.url).toContain('/api/notices?')
    expect(lastRequest?.url).toContain('category=academic')
    expect(lastRequest?.url).toContain('page=2')
  })

  it('omits parameters that are not set', async () => {
    respondWith = { status: 200, body: { items: [], page: 1, pageSize: 20, total: 0 } }
    await source().fetch('notice.list', { category: undefined, page: 1 })
    expect(lastRequest?.url).not.toContain('category')
  })

  it('sends the API key and tenant as headers', async () => {
    respondWith = { status: 200, body: fixtures.profile }
    await source().fetch('site.profile', {})
    expect(lastRequest?.headers['x-api-key']).toBe('test-key')
    expect(lastRequest?.headers['x-tenant']).toBe('demo-school')
    expect(lastRequest?.headers.accept).toBe('application/json')
  })

  it('omits the API key header when no key is configured', async () => {
    respondWith = { status: 200, body: fixtures.profile }
    await httpSource({ baseUrl }).fetch('site.profile', {})
    expect(lastRequest?.headers['x-api-key']).toBeUndefined()
  })

  it('treats 404 as absent content rather than an error', async () => {
    respondWith = { status: 404, body: { message: 'gone' } }
    await expect(source().fetch('notice.bySlug', { slug: 'missing' })).resolves.toBeNull()
  })

  it('throws on a server error', async () => {
    respondWith = { status: 500, body: { message: 'boom' } }
    await expect(source().fetch('site.profile', {})).rejects.toThrow(/HTTP 500/)
  })

  it('aborts a request that exceeds its timeout', async () => {
    respondWith = { status: 200, body: {}, delayMs: 200 }
    await expect(source({ timeoutMs: 30 }).fetch('site.profile', {})).rejects.toThrow()
    respondWith = { status: 200, body: {} }
  })

  it('tolerates a base URL with a trailing slash', async () => {
    respondWith = { status: 200, body: fixtures.profile }
    await httpSource({ baseUrl: `${baseUrl}/` }).fetch('site.profile', {})
    expect(lastRequest?.url).toBe('/api/site/profile')
  })
})

describe('httpSource through the client', () => {
  it('validates a real response against its contract', async () => {
    respondWith = { status: 200, body: fixtures.profile }
    const client = createClient(source(), { strict: true })
    const profile = await client.get('site.profile')
    expect(profile.name.en).toBe(fixtures.profile.name.en)
    expect(profile.phones).toEqual(fixtures.profile.phones)
  })

  it('rejects a response that does not match the contract', async () => {
    respondWith = { status: 200, body: { name: 'a string, not localized text' } }
    const client = createClient(source(), { strict: true })
    await expect(client.get('site.profile')).rejects.toThrow(/site\.profile/)
  })

  it('reports the failing key when the backend is unreachable', async () => {
    const client = createClient(httpSource({ baseUrl: 'http://127.0.0.1:1/api' }), { strict: true })
    await expect(client.get('site.profile')).rejects.toThrow(/site\.profile/)
  })
})
