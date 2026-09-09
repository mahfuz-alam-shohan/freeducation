import type { LocalizedText, SchoolProfile } from '../../contracts/index.js'
import type { ViewContext } from '../types.js'

export interface ContactViewModel { title: LocalizedText; profile: SchoolProfile }

export async function loadViewModel({ client, route }: ViewContext): Promise<ContactViewModel> {
  const profile = await client.get('site.profile')
  return { title: route.item.label, profile }
}
