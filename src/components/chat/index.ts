import {DOMSource, VNode} from '@cycle/dom'
// import isolate from '@cycle/isolate'
import {StateSource} from 'cycle-onionify'
import xs, {Stream} from 'xstream'

import intent from './intent'
import model, {Reducer, State} from './model'
import view from './view'

export {State} from './model'

export interface Sources {
  DOM: DOMSource;
  onion: StateSource<State>;
}

export interface Sinks {
  DOM: Stream<VNode>;
  onion: Stream<Reducer>;
}

export default function Chat(sources: Sources) {
  const state$ = sources.onion.state$
  const action$ = intent(sources.DOM)
  const reducer$ = model(action$)
  const vdom$ = view(state$)

  return {
    DOM: vdom$,
    onion: reducer$,
  }
}
