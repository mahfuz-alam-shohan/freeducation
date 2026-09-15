import { describe, expect, it, vi } from 'vitest'
import { handleSubmission } from './forms.js'
import { createClient, fixtureSource } from '../data/index.js'
import type { Client } from '../data/index.js'

const post = (fields: Record<string, string>) => {
  const body = new FormData()
  for (const [name, value] of Object.entries(fields)) body.append(name, value)
  return new Request('https://school.example/contact', { method: 'POST', body })
}

const client = () => createClient(fixtureSource(), { strict: true })

const validMessage = {
  _form: 'contact.message',
  name: 'Rafiqul Islam',
  phone: '+880 1711 000000',
  subject: 'Admission query',
  message: 'I would like to know the admission dates for Class Nine.',
}

describe('handleSubmission', () => {
  it('accepts a complete message and returns a reference to quote', async () => {
    const result = await handleSubmission(client(), post(validMessage))
    expect(result.status).toBe('ok')
    expect(result.reference).toMatch(/^MSG-/)
    expect(result.errors).toEqual({})
  })

  it('clears the typed values once the message is accepted', async () => {
    const result = await handleSubmission(client(), post(validMessage))
    expect(result.values).toEqual({})
  })

  it('refuses a form name it does not know', async () => {
    const result = await handleSubmission(client(), post({ ...validMessage, _form: 'nonsense' }))
    expect(result.status).toBe('failed')
  })

  it('reports a missing required field against that field', async () => {
    const result = await handleSubmission(client(), post({ ...validMessage, name: '' }))
    expect(result.status).toBe('invalid')
    expect(result.errors.name).toBe('form.error.required')
  })

  it('reports a malformed email address', async () => {
    const result = await handleSubmission(client(), post({ ...validMessage, email: 'not-an-address' }))
    expect(result.errors.email).toBe('form.error.email')
  })

  it('reports a message that is too short to be useful', async () => {
    const result = await handleSubmission(client(), post({ ...validMessage, message: 'hi' }))
    expect(result.errors.message).toBe('form.error.tooShort')
  })

  it('insists on some way to reply', async () => {
    const result = await handleSubmission(client(), post({ ...validMessage, phone: '', email: '' }))
    expect(result.status).toBe('invalid')
    expect(result.errors.email).toBe('form.error.needsReply')
  })

  it('hands back what was typed so a rejected form is not blanked', async () => {
    const result = await handleSubmission(client(), post({ ...validMessage, message: 'hi' }))
    expect(result.values.name).toBe('Rafiqul Islam')
    expect(result.values.subject).toBe('Admission query')
  })

  it('never returns the honeypot or the form name as a value', async () => {
    const result = await handleSubmission(client(), post({ ...validMessage, message: 'hi' }))
    expect(result.values._form).toBeUndefined()
    expect(result.values._website).toBeUndefined()
  })

  it('silently discards a submission that filled the honeypot', async () => {
    const source = fixtureSource()
    const spy = vi.spyOn(source, 'submit' as never)
    const result = await handleSubmission(
      createClient(source, { strict: true }),
      post({ ...validMessage, _website: 'http://spam.example' }),
    )
    expect(result.status).toBe('ok')
    expect(spy).not.toHaveBeenCalled()
  })

  it('accepts an admission application', async () => {
    const result = await handleSubmission(client(), post({
      _form: 'admission.application',
      studentName: 'Tanvir Hasan',
      guardianName: 'Rafiqul Islam',
      phone: '+880 1711 000000',
      classApplyingFor: 'Class Nine',
    }))
    expect(result.status).toBe('ok')
    expect(result.reference).toMatch(/^ADM-/)
  })

  it('reports a failure from the backend without losing the applicant’s answers', async () => {
    const failing: Client = {
      get: (() => { throw new Error('unused') }) as never,
      submit: async () => { throw new Error('backend down') },
    }
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const result = await handleSubmission(failing, post(validMessage))
    expect(result.status).toBe('failed')
    expect(result.values.name).toBe('Rafiqul Islam')
    spy.mockRestore()
  })
})
