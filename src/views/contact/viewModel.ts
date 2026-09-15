import type { LocalizedText, SchoolProfile, SubmissionState } from '../../contracts/index.js'
import type { ViewContext } from '../types.js'

export interface ContactViewModel {
  title: LocalizedText
  profile: SchoolProfile
  submission: SubmissionState
}

export async function loadViewModel({ client, route, submission }: ViewContext): Promise<ContactViewModel> {
  const profile = await client.get('site.profile')
  // Only show the outcome of a message sent from this page, not from another form.
  const own = submission.formKey === 'contact.message' ? submission : { ...submission, status: 'idle' as const }
  return { title: route.item.label, profile, submission: own }
}
