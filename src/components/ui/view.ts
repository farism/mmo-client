import {div, VNode} from '@cycle/dom'
import xs,{MemoryStream, Stream} from 'xstream'

import {State} from './model'

interface Children {
  [key: string]: MemoryStream<VNode>
}

export default function view(state$: MemoryStream<State>, children: any): Stream<VNode> {
  const {
    chat,
  } = children

  return xs.combine(state$, chat).map(([state, chat]) => {
    return div('.ui', [
      'ui',
      chat,
    ])
  })
}
