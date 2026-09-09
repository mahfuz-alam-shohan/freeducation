import type { ContentBlock, LocalizedText, Person, RichPage } from '../../contracts/index.js'
import type { ViewContext } from '../types.js'

/** People referenced by a 'people' block are resolved here, so variants never fetch. */
export interface RichPageViewModel {
  title: LocalizedText
  page: RichPage | null
  blocks: ContentBlock[]
  peopleByGroup: Record<string, Person[]>
}

export async function loadViewModel({ client, route }: ViewContext): Promise<RichPageViewModel> {
  const slug = route.params.slug ?? route.path
  const page = await client.get('page.bySlug', { slug })
  const blocks = page?.blocks ?? []

  const groups = [...new Set(blocks.filter(b => b.type === 'people').map(b => b.group))]
  const results = await Promise.all(groups.map(group => client.get('person.list', { group, pageSize: 200 })))
  const peopleByGroup = Object.fromEntries(groups.map((group, i) => [group, results[i]!.items]))

  return { title: page?.title ?? route.item.label, page, blocks, peopleByGroup }
}
