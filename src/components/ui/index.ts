import {DOMSource, VNode} from '@cycle/dom'
import {StateSource} from 'cycle-onionify'
import xs, {Stream} from 'xstream'

import {IAction} from '../../utils/actionCreatorFactory'
import isolateChildren from '../../utils/isolateChildren'
import Chat from '../chat'
import intent from './intent'
import model from './model'
import view from './view'

import {Reducer, State} from './model'

export interface Sources {
  DOM: DOMSource;
  onion: StateSource<State>;
}

export interface Sinks {
  DOM: Stream<VNode>;
  onion: Stream<Reducer>;
  phoenix: Stream<IAction>;
}

export default function UI(sources: Sources) {
  const children = isolateChildren(sources, {
    chat: Chat,
  })
  const state$ = sources.onion.state$
  const action$ = intent(sources.DOM)
  const reducer$ = model(action$)

  return {
    DOM: view(state$, children.vnodes$),
    onion: xs.merge(reducer$, children.reducers$),
    phoenix: children.sinks.chat.phoenix,
  }
}
