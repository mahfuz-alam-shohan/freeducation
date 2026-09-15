import type { ClassRef, LocalizedText, RichPage, SubmissionState } from '../../contracts/index.js'
import type { ViewContext } from '../types.js'

export interface AdmissionFormViewModel {
  title: LocalizedText
  /** Admission information shown above the form, so applicants read the rules first. */
  info: RichPage | null
  classes: ClassRef[]
  submission: SubmissionState
}

export async function loadViewModel(
  { client, route, submission }: ViewContext,
): Promise<AdmissionFormViewModel> {
  const [info, classes] = await Promise.all([
    client.get('page.bySlug', { slug: route.params.info ?? 'admission' }),
    client.get('routine.classes'),
  ])

  const own = submission.formKey === 'admission.application'
    ? submission
    : { ...submission, status: 'idle' as const }

  return { title: route.item.label, info, classes, submission: own }
}
