import { z } from 'zod'
import { LocalizedText } from './primitives.js'

/**
 * What a visitor may send the school.
 *
 * These are validated in the browser by the markup, and again on the server before
 * anything reaches the backend — the second check is the one that counts.
 */

const name = z.string().trim().min(2).max(120)
const phone = z.string().trim().min(6).max(30)
const email = z.email().trim().max(160)

export const ContactMessage = z.object({
  name,
  email: email.optional().or(z.literal('')),
  phone: phone.optional().or(z.literal('')),
  subject: z.string().trim().min(2).max(160),
  message: z.string().trim().min(10).max(4000),
}).refine(value => Boolean(value.email) || Boolean(value.phone), {
  message: 'contact.needsReply',
  path: ['email'],
})
export type ContactMessage = z.infer<typeof ContactMessage>

export const AdmissionApplication = z.object({
  studentName: name,
  guardianName: name,
  phone,
  email: email.optional().or(z.literal('')),
  classApplyingFor: z.string().trim().min(1).max(60),
  group: z.string().trim().max(60).optional().or(z.literal('')),
  dateOfBirth: z.string().trim().max(40).optional().or(z.literal('')),
  previousSchool: z.string().trim().max(160).optional().or(z.literal('')),
  address: z.string().trim().max(400).optional().or(z.literal('')),
  note: z.string().trim().max(1000).optional().or(z.literal('')),
})
export type AdmissionApplication = z.infer<typeof AdmissionApplication>

/** Which form was posted, addressed the same way content keys are. */
export type FormName = 'contact.message' | 'admission.application'

/** The outcome of a posted form, as the page needs to render it. */
export interface SubmissionState {
  status: 'idle' | 'ok' | 'invalid' | 'failed'
  formKey?: FormName | undefined
  /** Quoted back to the applicant so the office can find their submission. */
  reference?: string | undefined
  /** Field name to a translation key, so errors appear beside the field that caused them. */
  errors: Record<string, string>
  /** What the visitor typed, so a rejected form comes back filled in rather than blank. */
  values: Record<string, string>
}

/** What the backend returns once it has accepted something. */
export const SubmissionReceipt = z.object({
  ok: z.boolean(),
  /** Shown to the applicant so they can quote it to the office. */
  reference: z.string().optional(),
  message: LocalizedText.optional(),
})
export type SubmissionReceipt = z.infer<typeof SubmissionReceipt>
