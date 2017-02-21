import {div} from '@cycle/dom'

export default function view(sources) {
  return {
    DOM: div([
      'hello',
      'world',
    ]),
  }
}
