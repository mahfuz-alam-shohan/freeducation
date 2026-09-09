import type { LocalizedText, Person } from '../../contracts/index.js'
import type { ViewContext } from '../types.js'

export interface PersonListViewModel { title: LocalizedText; people: Person[] }

export async function loadViewModel({ client, route }: ViewContext): Promise<PersonListViewModel> {
  const result = await client.get('person.list', { group: route.params.group, pageSize: 200 })
  const people = [...result.items].sort((a, b) => a.order - b.order)
  return { title: route.item.label, people }
}
