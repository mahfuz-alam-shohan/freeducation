import type { ZodIssue } from 'zod'
import { formKeys, isFormKey, type Client } from '../data/index.js'
import type { SubmissionState } from '../contracts/index.js'

export type { SubmissionState }

export const idleSubmission: SubmissionState = { status: 'idle', errors: {}, values: {} }

/** Turns a validation failure into a message key the page can translate. */
function messageKey(issue: ZodIssue, value: string | undefined): string {
  if (issue.message === 'contact.needsReply') return 'form.error.needsReply'
  if (!value?.trim()) return 'form.error.required'
  if (issue.code === 'invalid_format') return 'form.error.email'
  if (issue.code === 'too_small') return 'form.error.tooShort'
  if (issue.code === 'too_big') return 'form.error.tooLong'
  return 'form.error.invalid'
}

/**
 * Handles a posted form.
 *
 * The markup validates in the browser, but everything is checked again here: browser
 * validation is a convenience, not a guarantee.
 */
export async function handleSubmission(client: Client, request: Request): Promise<SubmissionState> {
  const form = await request.formData()

  const key = String(form.get('_form') ?? '')
  if (!isFormKey(key)) return { ...idleSubmission, status: 'failed' }

  const values: Record<string, string> = {}
  for (const [field, value] of form.entries()) {
    if (field.startsWith('_') || typeof value !== 'string') continue
    values[field] = value
  }

  // A field hidden from people but visible to naive bots. Anything that fills it is
  // told the message was accepted, and nothing is sent onward.
  if (String(form.get('_website') ?? '').trim() !== '') {
    return { status: 'ok', formKey: key, errors: {}, values: {} }
  }

  const parsed = formKeys[key].input.safeParse(values)
  if (!parsed.success) {
    const errors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? '')
      if (field && !errors[field]) errors[field] = messageKey(issue, values[field])
    }
    return { status: 'invalid', formKey: key, errors, values }
  }

  try {
    const receipt = await client.submit(key, parsed.data as never)
    return {
      status: receipt.ok ? 'ok' : 'failed',
      formKey: key,
      reference: receipt.reference,
      errors: {},
      values: receipt.ok ? {} : values,
    }
  } catch (cause) {
    console.error('[forms] submission failed', cause)
    return { status: 'failed', formKey: key, errors: {}, values }
  }
}
