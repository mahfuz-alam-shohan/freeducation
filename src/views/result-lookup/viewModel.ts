import type { ExamRef, LocalizedText, ResultRecord } from '../../contracts/index.js'
import type { ViewContext } from '../types.js'

export interface ResultLookupViewModel {
  title: LocalizedText
  exams: ExamRef[]
  /** What the visitor asked for, echoed back so the form keeps its state. */
  query: { exam: string; roll: string }
  searched: boolean
  result: ResultRecord | null
  basePath: string
}

export async function loadViewModel({ client, route, url }: ViewContext): Promise<ResultLookupViewModel> {
  const exams = await client.get('result.exams')
  const exam = url.searchParams.get('exam') ?? exams[0]?.id ?? ''
  const roll = (url.searchParams.get('roll') ?? '').trim()
  const searched = roll.length > 0 && exam.length > 0

  return {
    title: route.item.label,
    exams,
    query: { exam, roll },
    searched,
    result: searched ? await client.get('result.lookup', { exam, roll }) : null,
    basePath: route.path,
  }
}
