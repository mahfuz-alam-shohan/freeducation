import { describe, expect, it, vi } from 'vitest'
import { createClient, type DataSource } from './source.js'
import { fixtureSource } from './adapters/fixture.js'

const badSource: DataSource = { name: 'bad', async fetch() { return { nonsense: true } } }
const throwingSource: DataSource = { name: 'throwing', async fetch() { throw new Error('network down') } }

describe('createClient', () => {
  it('returns validated data from a well-behaved source', async () => {
    const client = createClient(fixtureSource())
    const result = await client.get('notice.list', { pageSize: 2 })
    expect(result.items).toHaveLength(2)
    expect(result.total).toBeGreaterThan(0)
  })

  it('filters by a parameter', async () => {
    const client = createClient(fixtureSource())
    const result = await client.get('notice.list', { category: 'career' })
    expect(result.items.every(notice => notice.category === 'career')).toBe(true)
  })

  it('applies schema defaults so callers never see missing fields', async () => {
    const client = createClient(fixtureSource())
    const notice = await client.get('notice.bySlug', { slug: 'office-closure' })
    expect(notice?.attachments).toEqual([])
    expect(notice?.pinned).toBe(false)
  })

  it('throws on contract violations in strict mode, so bugs are loud in development', async () => {
    const client = createClient(badSource, { strict: true })
    await expect(client.get('site.profile')).rejects.toThrow(/does not match|failed/)
  })

  it('degrades to an empty value in production rather than breaking a live page', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const client = createClient(badSource, { strict: false })
    const result = await client.get('notice.list')
    expect(result.items).toEqual([])
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('wraps transport failures with the key that failed', async () => {
    const client = createClient(throwingSource, { strict: true })
    await expect(client.get('site.profile')).rejects.toThrow(/site\.profile/)
  })

  it('rejects invalid parameters before calling the backend', async () => {
    const client = createClient(fixtureSource())
    await expect(client.get('notice.list', { page: -1 })).rejects.toThrow()
  })
})
