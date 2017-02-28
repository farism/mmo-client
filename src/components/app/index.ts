import {div, DOMSource, li, ul, VNode} from '@cycle/dom'
import isolate from '@cycle/isolate'
import xs, {Stream} from 'xstream'

import UI from '../../components/ui'
import {PhoenixSource} from '../../drivers/phoenix'

export interface Sources {
  DOM: DOMSource;
  phoenix: PhoenixSource;
  onion: any;
}

export interface Sinks {
  DOM?: Stream<VNode>;
  phoenix?: any;
  onion?: any;
}

export interface Action {
  type: string;
  payload: Object;
}

export default function App(sources: Sources): Sinks {
  const state$ = sources.onion.state$
  const ui = isolate(UI, 'ui')(sources)
  const reducer$ = xs.merge(
    ui.onion,
  )

  // const presence$ = sources
  //   .phoenix
  //   .presence$()

  return {
    DOM: xs.combine(state$, ui.DOM).map(([state, uiVNode]) => {
      return div('.app', [
        'app',
        uiVNode,
      ])
    }),
    onion: reducer$,
    phoenix: ui.phoenix,
  }
}
