import {div} from '@cycle/dom'

import Root from '../root'

export default function UI(sources) {
  return {
    DOM: div([
      'ui',
      Root(sources).DOM,
    ]),
  }
}
