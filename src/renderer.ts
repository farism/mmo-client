import {div, DOMSource, input, makeDOMDriver, VNode} from '@cycle/dom'
import {run} from '@cycle/xstream-run'
import onionify from 'cycle-onionify'
import * as dotenv from 'dotenv'
import xs, {Stream} from 'xstream'
dotenv.config()

import UI from './components/ui'
import makePhoenixDriver, {PhoenixSource} from './drivers/makePhoenixDriver'

interface RendererSource {
  DOM: DOMSource;
  phoenix: PhoenixSource;
  onion: any;
}

interface RendererSink {
  DOM?: Stream<VNode>;
  phoenix?: any;
  onion?: any;
}

interface Action {
  type: string;
  payload: Object;
}

type ActionStream = Stream<Action>

type ReducerStream = Stream<Object>

function intent(DOM: DOMSource): ActionStream {
  const updateInputValueAction$: ActionStream =
    DOM.select('.input')
      .events('input')
      .map(ev => ev.target.value)
      .map((payload): Action => ({type: 'updateInputValue', payload}))

  const sendMessageAction$: ActionStream =
    DOM.select('.input')
      .events('keydown')
      .filter(ev => {
        return ev.keyCode === 13
      })
      .map(ev => ev.target.value)
      .map((payload): Action => ({type: 'sendMessage', payload}))

  return xs.merge<Action>(
    updateInputValueAction$,
    sendMessageAction$,
  )
}

function model(action$: ActionStream): ReducerStream {
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

  return xs.merge(
    initialReducer$,
    updateInputValueReducer$,
  )
}

function Renderer(sources: RendererSource): RendererSink {
  const state$ = sources.onion.state$
  const action$ = intent(sources.DOM)
  const reducer$ = model(action$)

  const presence$ = sources
    .phoenix
    .presences('world:lobby')
    .startWith([])

  return {
    onion: reducer$,
    // phoenix: outgoing$,
    DOM: xs.combine(state$, presence$).map(([state, presences]) => {
      console.log(presences)
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
