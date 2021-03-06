import {DOMSource, VNode} from '@cycle/dom'
import {StateSource} from 'cycle-onionify'
import xs, {MemoryStream, Stream} from 'xstream'

import PhoenixSource, {Message} from '../../drivers/phoenix/PhoenixSource'
import checkActionType from '../../utils/checkActionType'
import intent, {sendInput} from './intent'
import model, {Reducer, State} from './model'
import view from './view'

export {State} from './model'

export interface Sources {
  DOM: DOMSource;
  onion: StateSource<State>;
  phoenix: PhoenixSource;
}

export interface Sinks {
  DOM: Stream<VNode>;
  onion: Stream<Reducer>;
  phoenix: Stream<Message>;
}

export default function Chat(sources: Sources): Sinks {
  const state$ = sources.onion.state$
  const action$ = intent(sources.DOM)
  const reducer$ = model(action$)

  const receive$ = sources
    .phoenix
    .message$()

  const push$ = action$
    .compose(checkActionType(sendInput))
    .map(ac => ({
      event: 'message',
      topic: 'world:lobby',
      payload: ac.payload,
      ref: null,
    } as Message))

  const vdom$ = view(state$, receive$)

  return {
    DOM: vdom$,
    onion: reducer$,
    phoenix: push$,
  }
}
