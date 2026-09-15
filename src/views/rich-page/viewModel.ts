import type { ContentBlock, LocalizedText, Person, RichPage } from '../../contracts/index.js'
import type { PageMeta, ViewContext } from '../types.js'
import { resolveText, toPlainText } from '../../i18n/index.js'

/** People referenced by a 'people' block are resolved here, so variants never fetch. */
export interface RichPageViewModel {
  title: LocalizedText
  page: RichPage | null
  blocks: ContentBlock[]
  peopleByGroup: Record<string, Person[]>
  meta: PageMeta
}

export async function loadViewModel({ client, route, locale }: ViewContext): Promise<RichPageViewModel> {
  const slug = route.params.slug ?? route.path
  const page = await client.get('page.bySlug', { slug })
  const blocks = page?.blocks ?? []

  const groups = [...new Set(blocks.filter(b => b.type === 'people').map(b => b.group))]
  const results = await Promise.all(groups.map(group => client.get('person.list', { group, pageSize: 200 })))
  const peopleByGroup = Object.fromEntries(groups.map((group, i) => [group, results[i]!.items]))

  const firstText = blocks.find(block => block.type === 'richtext')
  const firstImage = blocks.find(block => block.type === 'image')

  return {
    title: page?.title ?? route.item.label,
    page, blocks, peopleByGroup,
    meta: {
      ...(page ? { title: resolveText(page.title, locale) } : {}),
      ...(firstText ? { description: toPlainText(resolveText(firstText.html, locale)) } : {}),
      ...(firstImage ? { image: firstImage.image.url } : {}),
    },
  }
}
