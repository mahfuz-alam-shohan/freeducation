import type { ClassRef, LocalizedText, Routine } from '../../contracts/index.js'
import type { ViewContext } from '../types.js'

export interface RoutineViewModel {
  title: LocalizedText
  classes: ClassRef[]
  selected: ClassRef | null
  routine: Routine | null
  basePath: string
}

export async function loadViewModel({ client, route, url }: ViewContext): Promise<RoutineViewModel> {
  const classes = await client.get('routine.classes')
  const requested = url.searchParams.get('class') ?? route.params.class ?? classes[0]?.id
  const routine = requested ? await client.get('routine.byClass', { class: requested }) : null
  return {
    title: route.item.label,
    classes,
    selected: classes.find(entry => entry.id === requested) ?? null,
    routine,
    basePath: route.path,
  }
}
