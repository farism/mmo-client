import {div} from '@cycle/dom'

import Chat from '../chat'

export default function view(sources) {
  return {
    DOM: div([
      'root',
      Chat(sources).DOM,
    ]),
  }
}
