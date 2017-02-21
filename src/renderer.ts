import {div, input, makeDOMDriver} from '@cycle/dom'
import {run} from '@cycle/xstream-run'
import onionify from 'cycle-onionify';
import * as dotenv from 'dotenv'
import xs from 'xstream'
dotenv.config()

import UI from './components/ui'
import makePhoenixDriver from './drivers/makePhoenixDriver'

function intent(DOM) {
  const updateInputValue$ =
    DOM.select('.input')
      .events('input')
      .map(ev => ev.target.value)
      .map(payload => ({type: 'updateInputValue', payload}))

  return xs.merge(
    updateInputValue$,
  )
}

function model(action$) {
  const initialReducer$ = xs.of(function initialReducer(prevState) {
    return {
      inputValue: '',
    }
  })

  const updateInputValueReducer$ = action$
    .filter(ac => ac.type === 'updateInputValue')
    .map(ac => function updateInputValueReducer(prevState) {
      return {
        ...prevState,
        inputValue: ac.payload,
      }
    })

  const sendChatMessageReducer$ = action$
    .filter(ac => ac.type === 'sendMessage')
    .map(ac => function sendChatMessageReducer(prevState) {
      return {
        ...prevState,
      }
    })

  return xs.merge(
    initialReducer$,
    updateInputValueReducer$,
  )
}

function Renderer(sources) {
  const state$ = sources.onion.state$
  const action$ = intent(sources.DOM)
  const reducer$ = model(action$)

  return {
    DOM: state$.map(state => {
      return div([
        input('.input', {attrs: {type: 'text', value: state.inputValue}}),
        UI(sources).DOM,
      ])
    }),
    onion: reducer$,
  }
}

const sources = {
  DOM: makeDOMDriver('#app'),
  phoenix: makePhoenixDriver('ws://localhost:4000/socket', { params: { guardian_token: process.env.JWT } }),
}

run(onionify(Renderer), sources)
