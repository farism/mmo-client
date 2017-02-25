import {DOMSource, VNode} from '@cycle/dom'
import isolate from '@cycle/isolate'
import {StateSource} from 'cycle-onionify'
import xs, {Stream} from 'xstream'

import Chat, {Sinks as ChatSinks, State as ChatState} from '../chat'
import intent from './intent'
import model from './model'
import view from './view'

export interface State {
  chat: ChatState;
}

export type Reducer = (prev?: State) => State | undefined

export interface Sources {
  DOM: DOMSource;
  onion: StateSource<State>;
}

export interface Sinks {
  DOM: Stream<VNode>;
  onion?: Stream<Reducer>;
}

export default function UI(sources: Sources) {
  const chat = isolate(Chat, 'chat')(sources)
  const state$ = sources.onion.state$
  const action$ = intent(sources.DOM)
  const reducer$ = xs.merge(
    model(action$),
    // chat.onion,
  )
  const vdom$ = view(state$)

  return {
    DOM: vdom$,
    onion: reducer$,
  }
}
