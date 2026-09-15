import type { z } from 'zod'
import { AdmissionApplication, ContactMessage, SubmissionReceipt } from '../contracts/index.js'

/**
 * Things a visitor can send, addressed by key in the same way content is read by key.
 * A new form means a new entry here and a schema — never an ad-hoc POST.
 */
export const formKeys = {
  'contact.message': { input: ContactMessage, result: SubmissionReceipt },
  'admission.application': { input: AdmissionApplication, result: SubmissionReceipt },
} as const

export type FormKey = keyof typeof formKeys
export type InputOf<K extends FormKey> = z.input<(typeof formKeys)[K]['input']>
export type ReceiptOf<K extends FormKey> = z.output<(typeof formKeys)[K]['result']>

export const isFormKey = (value: string): value is FormKey => value in formKeys
