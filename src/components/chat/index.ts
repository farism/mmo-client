import {DOMSource, VNode} from '@cycle/dom'
import {StateSource} from 'cycle-onionify'
import xs, {MemoryStream, Stream} from 'xstream'

import {Message} from '../../drivers/phoenix/PhoenixSource'
import checkActionType from '../../utils/checkActionType'
import intent, {sendInput} from './intent'
import model, {Reducer, State} from './model'
import view from './view'

export {State} from './model'

export interface Sources {
  DOM: DOMSource;
  onion: StateSource<State>;
}

export interface Sinks {
  DOM: MemoryStream<VNode>;
  onion: Stream<Reducer>;
  phoenix: Stream<Message>;
}

export default function Chat(sources: Sources): Sinks {
  const state$ = sources.onion.state$
  const action$ = intent(sources.DOM)
  const reducer$ = model(action$)
  const vdom$ = view(state$)

  const outgoing$ = action$
    .compose(checkActionType(sendInput))
    .map(ac => ({
      event: 'message',
      topic: 'world:lobby',
      payload: ac.payload,
      ref: null,
    } as Message))

  return {
    DOM: vdom$,
    onion: reducer$,
    phoenix: outgoing$,
  }
}
