import {div, input, makeDOMDriver} from '@cycle/dom'
import {run} from '@cycle/xstream-run'
import onionify from 'cycle-onionify'
import * as dotenv from 'dotenv'
import xs, {Stream} from 'xstream'
dotenv.config()

import UI from './components/ui'
import makePhoenixDriver from './drivers/makePhoenixDriver'

type Action = {
  type: string;
  payload: any;
}

function intent(DOM): Stream<Action> {
  const updateInputValueAction$: Stream<Action> =
    DOM.select('.input')
      .events('input')
      .map(ev => ev.target.value)
      .map(payload => ({type: 'updateInputValue', payload}))

  const sendMessageAction$: Stream<Action> =
    DOM.select('.input')
      .events('keydown')
      .filter(ev => {
        return ev.keyCode === 13
      })
      .map(ev => ev.target.value)
      .map(payload => ({type: 'sendMessage', payload}))

  return xs.merge(
    updateInputValueAction$,
    sendMessageAction$,
  )
}

function model(action$) {
  const initialReducer$ = xs.of(function initialReducer(state) {
    return {
      inputValue: '',
    }
  })

  const updateInputValueReducer$ = action$
    .filter(ac => ac.type === 'updateInputValue')
    .map(ac => function updateInputValueReducer(state) {
      return {
        ...state,
        inputValue: ac.payload,
      }
    })

  const sendChatMessageReducer$ = action$
    .filter(ac => ac.type === 'sendMessage')
    .map(ac => function sendChatMessageReducer(state) {
      return {
        ...state,
      }
    })

  return xs.merge(
    initialReducer$,
    updateInputValueReducer$,
    sendChatMessageReducer$,
  )
}

function Renderer(sources) {
  const state$ = sources.onion.state$
  const action$ = intent(sources.DOM)
  const reducer$ = model(action$)
  const outgoingChat$ = action$
    .filter(ac => ac.type === 'sendMessage')
    .map(ac => ac.payload)

  const chan$ = sources
    .phoenix
    .presences('world:lobby')
    .startWith({})

  return {
    onion: reducer$,
    phoenix: outgoingChat$,
    DOM: xs.combine(state$, chan$).map(([state, channel]) => {
      return div([
        input('.input', {attrs: {type: 'text'}}),
        UI(sources).DOM,
      ])
    }),
  }
}

const sources = {
  DOM: makeDOMDriver('#app'),
  phoenix: makePhoenixDriver('ws://localhost:4000/socket', {params: {guardian_token: process.env.JWT}}),
}

run(onionify(Renderer), sources)
